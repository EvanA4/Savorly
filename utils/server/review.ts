import ReviewModel, { ReviewDocument } from "@/models/Review";
import { APIResult, Result } from "@/types/results";
import dbConnect from "../dbconnect";
import { startSession } from "mongoose";
import TagModel, { TagDocument } from "@/models/Tag";
import { IImage } from "@/types/imagedb/image";
import { PopulatedReview } from "@/types/review";
import { EDietRestriction } from "@/types/tag";
import { poiSearchRests } from "./poi";

export async function getReviewsByUserId(
  userId: string,
  restaurantId?: string,
): Promise<Result<ReviewDocument[]>> {
  try {
    await dbConnect();

    let reviews: ReviewDocument[];
    if (!restaurantId) {
      reviews = (await ReviewModel.find({
        userId,
      })) as ReviewDocument[];
    } else {
      reviews = (await ReviewModel.find({
        userId,
        restaurantId,
      })) as ReviewDocument[];
    }

    return new Result({
      error: false,
      message: "Successfully retrieved reviews.",
      value: reviews,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<ReviewDocument[]>({
      error: true,
      message:
        err.message != undefined ? err.message : "Failed to look up reviews.",
      value: undefined,
    });
  }
}

export async function getReviewsByRestaurantId(
  restaurantId: string,
): Promise<Result<ReviewDocument[]>> {
  try {
    await dbConnect();

    const reviews = (await ReviewModel.find({
      restaurantId,
    })) as ReviewDocument[];
    return new Result({
      error: false,
      message: "Successfully retrieved reviews.",
      value: reviews,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<ReviewDocument[]>({
      error: true,
      message:
        err.message != undefined ? err.message : "Failed to look up reviews.",
      value: undefined,
    });
  }
}

export async function getReviewById(
  id: string,
): Promise<Result<ReviewDocument>> {
  try {
    await dbConnect();

    const review = (await ReviewModel.findById(id)) as ReviewDocument;
    if (review) {
      return new Result<ReviewDocument>({
        error: false,
        message: "Successfully retrieved review.",
        value: review,
      });
    } else {
      return new Result<ReviewDocument>({
        error: true,
        message: "Review does not exist.",
      });
    }
  } catch (e) {
    const err = e as { message?: string };
    return new Result<ReviewDocument>({
      error: true,
      message:
        err.message != undefined ? err.message : "Failed to look up review.",
      value: undefined,
    });
  }
}

export async function deleteReview(
  id: string,
): Promise<Result<ReviewDocument>> {
  await dbConnect();

  const session = await startSession();
  let review: ReviewDocument | undefined = undefined;
  let numTagsDeleted = 0;
  let numImagesDeleted = 0;
  let didError: string = "";
  try {
    await session.withTransaction(async () => {
      // delete review and tags
      review = (await ReviewModel.findByIdAndDelete(id)) as ReviewDocument;
      numTagsDeleted = (await TagModel.deleteMany({ reviewId: id }))
        .deletedCount;

      // delete images
      const rawRes = await fetch(
        `${process.env.IMAGEDB_HOST}/images?reviewId=${id}`,
        {
          method: "DELETE",
          body: JSON.stringify({
            password: process.env.IMAGEDB_PASS,
          }),
          headers: {
            "Content-Type": "application/json", // Not including this causes NGINX to ignore DELETE requests' bodies
          },
        },
      );
      const res = (await rawRes.json()) as APIResult<IImage[]>;
      numImagesDeleted = res.value!.length;
    });
  } catch (e) {
    const err = e as { message?: string };
    didError = err.message || "Failed to delete all review material.";
  } finally {
    session.endSession();
  }

  if (!review || didError != "") {
    return new Result<ReviewDocument>({
      error: true,
      message: didError ? didError : "Failed to delete all review material.",
    });
  }

  return new Result<ReviewDocument>({
    error: false,
    message: `Successfully deleted a review, ${numTagsDeleted} tag(s), and ${numImagesDeleted} image(s)`,
    value: review as unknown as ReviewDocument,
  });
}

export async function updateReview(review: {
  _id: string;
  restaurantId: string;
  title: string;
  description: string;
  rating: number;
  tags: string[];
  imagesToCreate: File[];
  imagesToDelete: string[]; // List of _id's
}): Promise<Result<PopulatedReview>> {
  let updated: ReviewDocument | undefined = undefined;
  const tags: TagDocument[] = [];
  let images: IImage[] = [];
  let didError = "";

  const session = await startSession(); // begin transaction
  try {
    await session.withTransaction(async () => {
      // create review
      updated = (await ReviewModel.findByIdAndUpdate(
        review._id,
        {
          restaurantId: review.restaurantId,
          title: review.title,
          description: review.description,
          rating: review.rating,
        },
        { returnDocument: "after" },
      )) as ReviewDocument;

      // delete previous tags
      await TagModel.deleteMany({
        reviewId: review._id,
      });

      // create tags
      for (let i = 0; i < review.tags.length; ++i) {
        tags.push(
          await TagModel.create({
            reviewId: review._id.toString(),
            restaurantId: review.restaurantId,
            label: review.tags[i] as unknown as EDietRestriction,
          }),
        );
      }

      // delete selected images
      for (const idx in review.imagesToDelete) {
        await fetch(
          `${process.env.IMAGEDB_HOST}/images?_id=${review.imagesToDelete[idx]}`,
          {
            method: "DELETE",
            body: JSON.stringify({
              password: process.env.IMAGEDB_PASS,
            }),
            headers: {
              "Content-Type": "application/json", // Not including this causes NGINX to ignore DELETE requests' bodies
            },
          },
        );
      }

      // create images
      for (const idx in review.imagesToCreate) {
        const tmp_fd = new FormData();
        tmp_fd.append("images", review.imagesToCreate[idx]);
        tmp_fd.append("password", process.env.IMAGEDB_PASS!);
        tmp_fd.append("reviewId", review._id.toString());
        await fetch(`${process.env.IMAGEDB_HOST}/images`, {
          method: "POST",
          body: tmp_fd,
        });
      }

      // get final list of images
      const rawRes = await fetch(
        `${process.env.IMAGEDB_HOST}/images?reviewId=${review._id}`,
      );
      const res = (await rawRes.json()) as APIResult<IImage[]>;
      images = res.value!;
    });
  } catch (e) {
    const err = e as { message?: string };

    // if this goes wrong, db is going to be very sad
    // just call sync as a hail mary
    await fetch(`${process.env.IMAGEDB_HOST}/sync`, {
      method: "POST",
      body: JSON.stringify({
        password: process.env.IMAGEDB_PASS,
      }),
    });

    didError = err.message ? err.message : "Failed to update review.";
  } finally {
    session.endSession(); // end transaction
  }

  if (!updated || didError) {
    return new Result<PopulatedReview>({
      error: true,
      message: "Failed to update review",
    });
  }

  updated = updated as unknown as ReviewDocument;
  return new Result<PopulatedReview>({
    error: false,
    message: "Successfully updated review",
    value: {
      userId: updated.userId,
      restaurantId: updated.restaurantId,
      rating: updated.rating,
      description: updated.description,
      title: updated.title,
      _id: updated._id,
      tags,
      images,
    } as PopulatedReview,
  });
}

export async function createReview(
  userId: string,
  review: {
    restaurantId: string;
    title: string;
    description: string;
    rating: number;
    tags: string[];
    imagesToCreate: File[];
  },
): Promise<Result<PopulatedReview>> {
  let created: ReviewDocument | undefined = undefined;
  const tags: TagDocument[] = [];
  const images: IImage[] = [];
  let didError = "";

  const session = await startSession(); // begin transaction
  try {
    await session.withTransaction(async () => {
      // create review
      created = (await ReviewModel.create(review)) as ReviewDocument;

      // create tags
      for (let i = 0; i < review.tags.length; ++i) {
        tags.push(
          await TagModel.create({
            reviewId: created._id.toString(),
            restaurantId: review.restaurantId,
            label: review.tags[i] as unknown as EDietRestriction,
          }),
        );
      }

      // create images
      for (const idx in review.imagesToCreate) {
        const tmp_fd = new FormData();
        tmp_fd.append("images", review.imagesToCreate[idx]);
        tmp_fd.append("password", process.env.IMAGEDB_PASS!);
        tmp_fd.append("reviewId", created._id.toString());

        const rawRes = await fetch(`${process.env.IMAGEDB_HOST}/images`, {
          method: "POST",
          body: tmp_fd,
        });
        const res = await rawRes.json();

        if (res.value && res.value[0]) {
          images.push(res.value[0]);
        }
      }
    });
  } catch (e) {
    const err = e as { message?: string };

    // delete images if things go wrong
    for (let i = 0; i < images.length; ++i) {
      await fetch(`${process.env.IMAGEDB_HOST}/images?${images[i]._id!}`, {
        method: "DELETE",
        body: JSON.stringify({
          password: process.env.IMAGEDB_PASS,
        }),
        headers: {
          "Content-Type": "application/json", // Not including this causes NGINX to ignore DELETE requests' bodies
        },
      });
    }

    didError = err.message ? err.message : "Failed to create review.";
  } finally {
    session.endSession(); // end transaction
  }

  if (!created || didError) {
    return new Result<PopulatedReview>({
      error: true,
      message: didError ? didError : "Failed to create review.",
    });
  }

  created = created as unknown as ReviewDocument;
  return new Result<PopulatedReview>({
    error: false,
    message: "Successfully created a review.",
    value: {
      userId: userId,
      restaurantId: created.restaurantId,
      rating: created.rating,
      description: created.description,
      title: created.title,
      _id: created._id,
      tags,
      images,
    } as PopulatedReview,
  });
}

export async function getReviewsBySearchStr(
  search: string,
  restaurantId: string | undefined,
  userId: string | undefined,
): Promise<Result<ReviewDocument[]>> {
  try {
    const reviews: ReviewDocument[] = [];
    const reviewsSet = new Set<string>();
    const addReviews = (val: ReviewDocument) => {
      if (!reviewsSet.has(val._id.toString())) {
        reviews.push(val);
        reviewsSet.add(val._id.toString());
      }
    };

    // get all restaurants associated with search
    if (!restaurantId) {
      const restsRes = await poiSearchRests({
        searchStr: search,
        lat: -1,
        lng: -1,
        cuisine: "",
        restrictions: [],
      });
      let rerr = restsRes.anticipate();
      if (!rerr.error) {
        const rests = restsRes.unwrap();

        // for each found restaurant, find reviews and add them to list
        for (let i = 0; i < rests.length; ++i) {
          const reviewsRes = await getReviewsByRestaurantId(rests[i].mapboxId);
          rerr = reviewsRes.anticipate();
          if (!rerr.error) {
            reviewsRes.unwrap().forEach(addReviews);
          }
        }
      }
    }

    // for each review, check whether description or title contains search string
    let constraints = {};
    if (restaurantId && userId) constraints = { restaurantId, userId };
    else if (restaurantId) constraints = { restaurantId };
    else constraints = { userId };
    const descReviews = await ReviewModel.find({
      description: new RegExp(".*" + search + ".*", "i"),
      ...constraints,
    });
    descReviews.forEach(addReviews);
    const titleReviews = await ReviewModel.find({
      title: new RegExp(".*" + search + ".*", "i"),
      ...constraints,
    });
    titleReviews.forEach(addReviews);

    return new Result({
      error: false,
      message: "Successfully searched for reviews",
      value: reviews,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result({
      error: true,
      message: err.message ? err.message : "Failed to create review.",
    });
  }
}
