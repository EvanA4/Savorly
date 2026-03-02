import { ReviewDocument } from "@/models/Review";
import { TagDocument } from "@/models/Tag";
import { IImage } from "@/types/imagedb/image";
import { APIResult, Result } from "@/types/results";
import { PopulatedReview } from "@/types/review";

export async function getPopulatedReview(
  reviewId: string,
): Promise<Result<PopulatedReview>> {
  // fetch review
  let rawRes = await fetch(`/api/review/review/${reviewId}`);
  const reviewRes = new Result<ReviewDocument>(await rawRes.json());
  let rerr = reviewRes.anticipate();
  if (rerr.error) {
    return new Result({
      error: true,
      message: `Failed to fetch review document: ${rerr.message}`,
    });
  }
  const rdoc = reviewRes.unwrap();
  const review = {
    ...rdoc,
    images: [] as IImage[],
    tags: [] as TagDocument[],
  } as PopulatedReview;

  // fetch images
  rawRes = await fetch(`/api/images?reviewId=${review._id}`);
  const imageAPIRes = (await rawRes.json()) as APIResult<IImage[]>;
  const imageRes = new Result<IImage[]>(imageAPIRes);
  rerr = imageRes.anticipate();
  if (rerr.error) {
    return new Result({
      error: true,
      message: rerr.message,
    });
  }
  review.images = imageRes.unwrap();

  // fetch tags
  rawRes = await fetch(`/api/tags/${review._id}`);
  const tagAPIRes = (await rawRes.json()) as APIResult<TagDocument[]>;
  const tagRes = new Result<TagDocument[]>(tagAPIRes);
  rerr = tagRes.anticipate();
  if (rerr.error) {
    return new Result({
      error: true,
      message: rerr.message,
    });
  }
  review.tags = tagRes.unwrap();

  // finally return review
  return new Result<PopulatedReview>({
    error: false,
    message: "Successfully found populated review.",
    value: review,
  });
}

export async function getReviewsByUserId(
  userId: string,
  restaurantId?: string,
): Promise<Result<ReviewDocument[]>> {
  const rawRes = restaurantId
    ? await fetch(`/api/review/user/${userId}?restaurantId=${restaurantId}`)
    : await fetch(`/api/review/user/${userId}`);
  return new Result<ReviewDocument[]>(await rawRes.json());
}

export async function getReviewsByRestaurantId(
  restaurantId: string,
): Promise<Result<ReviewDocument[]>> {
  const rawRes = await fetch(`/api/review/rest/${restaurantId}`);
  return new Result<ReviewDocument[]>(await rawRes.json());
}

function getReviewFormData(src: {
  restaurantId: string;
  title: string;
  description: string;
  rating: number;
  tags: string[];
  imagesToCreate: File[];
  imagesToDelete?: IImage[];
}) {
  const formData = new FormData();
  formData.append("restaurantId", src.restaurantId);
  formData.append("title", src.title);
  formData.append("description", src.description);
  formData.append("rating", src.rating.toString());
  for (const idx in src.tags) formData.append("tags", src.tags[idx]);
  for (const idx in src.imagesToCreate)
    formData.append("images", src.imagesToCreate[idx]);
  if (src.imagesToDelete) {
    for (const idx in src.imagesToDelete)
      formData.append(
        "prevImagesToDelete",
        src.imagesToDelete[idx]._id!.toString(),
      );
  }
  return formData;
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
  const formData = getReviewFormData(review);
  const rawRes = await fetch(`/api/review/user/${userId}`, {
    method: "POST",
    body: formData,
  });
  const apiRes = (await rawRes.json()) as APIResult<PopulatedReview>;
  return new Result(apiRes);
}

export async function updateReview(review: {
  _id: string;
  restaurantId: string;
  title: string;
  description: string;
  rating: number;
  tags: string[];
  imagesToCreate: File[];
  imagesToDelete: IImage[];
}): Promise<Result<PopulatedReview>> {
  const formData = getReviewFormData(review);
  const rawRes = await fetch(`/api/review/review/${review._id}`, {
    method: "PUT",
    body: formData,
  });
  return new Result(await rawRes.json());
}

export async function deleteReview(
  reviewId: string,
): Promise<Result<ReviewDocument>> {
  const rawRes = await fetch(`/api/review/review/${reviewId}`, {
    method: "DELETE",
  });
  const apiRes = (await rawRes.json()) as APIResult<ReviewDocument>;
  return new Result<ReviewDocument>(apiRes);
}
