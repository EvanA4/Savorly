import ReviewModel, { ReviewDocument } from "../models/Review";
import TagModel, { TagDocument } from "../models/Tag";
import { Result } from "../types/results";
import { PopulatedReview } from "../types/review";
import { startSession } from "mongoose";
import { EDietRestriction } from "../types/tag";
import { Image } from "../models/Image";

export async function createReview(
  userId: string,
  review: {
    restaurantId: string;
    title: string;
    description: string;
    rating: number;
    budget: number;
    tags: string[];
    imagesToCreate: File[];
  },
): Promise<Result<PopulatedReview>> {
  let created: ReviewDocument | undefined = undefined;
  const tags: TagDocument[] = [];
  const images: Image[] = [];
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
      budget: created.budget,
      description: created.description,
      title: created.title,
      _id: created._id,
      tags,
      images,
    } as unknown as PopulatedReview,
  });
}
