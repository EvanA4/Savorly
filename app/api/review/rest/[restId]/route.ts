import { ReviewDocument } from "@/models/Review";
import { APIResult } from "@/types/results";
import { getReviewsByRestaurantId } from "@/utils/server/review";
import { NextRequest, NextResponse } from "next/server";

// [GET] Get list of all existing review IDs from userID
export const GET = async function (
  _: NextRequest,
  { params }: { params: Promise<{ restId: string }> },
): Promise<NextResponse<APIResult<ReviewDocument[]>>> {
  const { restId } = await params;

  if (!restId) {
    return NextResponse.json(
      {
        error: true,
        message: "Restaurant ID is required",
        value: undefined,
      },
      { status: 400 },
    );
  }

  const reviewsRes = await getReviewsByRestaurantId(restId);
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
