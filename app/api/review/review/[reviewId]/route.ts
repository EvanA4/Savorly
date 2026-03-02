import dbConnect from "@/utils/dbconnect";
import {
  deleteReview,
  getReviewById,
  updateReview,
} from "@/utils/server/review";
import { ReviewDocument } from "@/models/Review";
import { PopulatedReview } from "@/types/review";
import { getRestaurantById } from "@/utils/server/restaurant";
import { NextRequest, NextResponse } from "next/server";
import { APIResult } from "@/types/results";

// [PUT] Modify review with review ID and userID using body data
export const PUT = async function (
  req: NextRequest,
  { params }: { params: { reviewId: string } },
): Promise<NextResponse<APIResult<PopulatedReview>>> {
  await dbConnect();
  const { reviewId } = await params;
  let in_fd: FormData;
  try {
    in_fd = await req.formData();
  } catch {
    return NextResponse.json(
      {
        error: true,
        message: "Missing or invalid body type",
      },
      { status: 400 },
    );
  }

  // images are optional

  // title
  const titleArr = in_fd.getAll("title");
  if (titleArr.length == 0 || !titleArr[0]) {
    return NextResponse.json(
      {
        error: true,
        message: "Title is required",
      },
      { status: 400 },
    );
  }

  // descripton
  const descArr = in_fd.getAll("description");
  if (descArr.length == 0 || !descArr[0]) {
    return NextResponse.json(
      {
        error: true,
        message: "Description is required",
      },
      { status: 400 },
    );
  }

  // rating must be float within [0,5] and multiple of .5
  const ratingArr = in_fd.getAll("rating");
  if (ratingArr.length == 0 || !ratingArr[0]) {
    return NextResponse.json(
      {
        error: true,
        message: "Rating is required",
      },
      { status: 400 },
    );
  }
  let rating: number;
  try {
    rating = parseFloat(ratingArr[0] as string);
    if (rating < 0 || rating > 5 || rating % 0.5 != 0) {
      return NextResponse.json(
        {
          error: true,
          message: "Rating must be decimal within [0,5] and multiple of .5",
        },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json(
      {
        error: true,
        message: "Rating must be decimal within [0,5] and multiple of .5",
      },
      { status: 400 },
    );
  }

  // tags are optional

  // restaurantId must be valid
  const restIdArr = in_fd.getAll("restaurantId");
  if (restIdArr.length == 0 || !restIdArr[0]) {
    return NextResponse.json(
      {
        error: true,
        message: "Restaurant ID is required",
      },
      { status: 400 },
    );
  }
  const isRestaurant =
    (await getRestaurantById(restIdArr[0] as string)) != undefined;
  if (!isRestaurant) {
    return NextResponse.json(
      {
        error: true,
        message: "Restaurant ID is invalid",
      },
      { status: 400 },
    );
  }

  // Actually create the review, tags, and images
  const toUpdate = {
    _id: reviewId,
    title: titleArr[0] as string,
    description: descArr[0] as string,
    rating: rating,
    restaurantId: restIdArr[0] as string,
    tags: in_fd.getAll("tags") as string[],
    imagesToCreate: in_fd.getAll("images") as File[],
    imagesToDelete: in_fd.getAll("prevImagesToDelete") as string[],
  };

  const res = await updateReview(toUpdate);
  const rerr = res.anticipate();
  if (rerr.error) {
    return NextResponse.json({
      error: true,
      message: rerr.message,
    });
  }

  return NextResponse.json({
    error: false,
    message: "Successfully updated review",
    value: res.unwrap(),
  });
};

// [DELETE] Delete review under userID with reviewID
export const DELETE = async function (
  _: NextRequest,
  { params }: { params: { userId: string; reviewId: string } },
): Promise<NextResponse<APIResult<ReviewDocument>>> {
  await dbConnect();
  const { reviewId } = await params;

  if (!reviewId) {
    return NextResponse.json(
      {
        error: true,
        message: "Review ID is required",
      },
      { status: 400 },
    );
  }

  const res = await deleteReview(reviewId);
  const rerr = res.anticipate();
  if (rerr.error) {
    return NextResponse.json({
      error: true,
      message: `Failed to delete review: ${rerr.message}`,
    });
  }

  return NextResponse.json({
    error: false,
    message: `Successfully deleted a review!`,
    value: res.unwrap(),
  });
};

// [GET] Get list of all existing review IDs from userID
export const GET = async function (
  req: NextRequest,
  { params }: { params: { reviewId: string } },
): Promise<NextResponse<APIResult<ReviewDocument>>> {
  const { reviewId } = await params;

  if (!reviewId) {
    return NextResponse.json(
      {
        error: true,
        message: "Review ID is required",
        value: undefined,
      },
      { status: 400 },
    );
  }

  const reviewRes = await getReviewById(reviewId);
  const rerr = reviewRes.anticipate();
  if (rerr.error) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to get review: ${rerr.message}`,
        value: undefined,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Successfully got review",
    value: reviewRes.unwrap(),
  });
};
