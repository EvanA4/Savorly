import { ReviewDocument } from "@/models/Review";
import { APIResult } from "@/types/results";
import dbConnect from "@/utils/dbconnect";
import { getReviewsBySearchStr } from "@/utils/server/review";
import { NextRequest, NextResponse } from "next/server";

export const GET = async function (
  req: NextRequest,
): Promise<NextResponse<APIResult<ReviewDocument[]>>> {
  await dbConnect();
  const searchParams = req.nextUrl.searchParams; // use for optional restaurantId query
  const searchStr = searchParams.get("q");
  const restId = searchParams.get("rid");
  const userId = searchParams.get("uid");

  // make sure search wasn't nothing
  if (!searchStr) {
    return NextResponse.json(
      {
        error: true,
        message: "Search string is required",
        value: undefined,
      },
      { status: 400 },
    );
  }

  const reviewsRes = await getReviewsBySearchStr(
    searchStr,
    restId ? restId : undefined,
    userId ? userId : undefined,
  );
  const rerr = reviewsRes.anticipate();
  if (rerr.error) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to get reviews: ${rerr.message}`,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Successfully got reviews",
    value: reviewsRes.unwrap(),
  });
};
