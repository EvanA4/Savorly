// /api/review/{userID}

import { ReviewDocument } from "@/models/Review";
import { APIResult } from "@/types/results";
import dbConnect from "@/utils/dbconnect";
import { getRestaurantById } from "@/utils/server/restaurant";
import { createReview, getReviewsByUserId } from "@/utils/server/review";
import { getUserById } from "@/utils/server/users";
import { NextRequest, NextResponse } from "next/server";

/*
THINGS TO VERIFY:
images
description
rating
tags
userId
restaurantId
*/

// [POST] Add a review under userID with data in body
export const POST = async function (
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  await dbConnect();
  const { userId } = await params;
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

  // userId must be valid
  const isUser = (await getUserById(userId)) != undefined;
  if (!isUser) {
    return NextResponse.json(
      {
        error: true,
        message: "User ID is invalid",
      },
      { status: 400 },
    );
  }

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
  const toCreate = {
    title: titleArr[0] as string,
    description: descArr[0] as string,
    rating: rating,
    userId: userId,
    restaurantId: restIdArr[0] as string,
    tags: in_fd.getAll("tags") as string[],
    imagesToCreate: in_fd.getAll("images") as File[],
  };

  const res = await createReview(userId, toCreate);
  const rerr = res.anticipate();
  if (rerr.error) {
    return NextResponse.json({
      error: true,
      message: `Failed to create review: ${rerr.message}`,
    });
  }

  return NextResponse.json({
    error: false,
    message: "Successfully created a review",
    value: res.unwrap(),
  });
};

// [GET] Get list of all existing review IDs from userID
export const GET = async function (
  req: NextRequest,
  { params }: { params: { userId: string } },
): Promise<NextResponse<APIResult<ReviewDocument[]>>> {
  await dbConnect();
  const { userId } = await params;
  const searchParams = req.nextUrl.searchParams; // use for optional restaurantId query
  const restaurantId = searchParams.get("restaurantId");

  if (!userId) {
    return NextResponse.json(
      {
        error: true,
        message: "User ID is required",
        value: undefined,
      },
      { status: 400 },
    );
  }

  const reviewsRes = await getReviewsByUserId(
    userId,
    restaurantId ? restaurantId : undefined,
  );
  const rerr = reviewsRes.anticipate();
  if (rerr.error) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to get reviews: ${rerr.message}`,
        value: undefined,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Successfully got all reviews",
    value: reviewsRes.unwrap(),
  });
};
