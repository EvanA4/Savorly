import ReviewModel, { ReviewDocument } from "@/models/Review";
import { APIResult } from "@/types/results";
import dbConnect from "@/utils/dbconnect";
import { NextRequest, NextResponse } from "next/server";

// [GET] Get list of all existing reviews
export const GET = async function (
  _: NextRequest,
): Promise<NextResponse<APIResult<ReviewDocument[]>>> {
  await dbConnect();
  const reviews = (await ReviewModel.find().limit(20)) as ReviewDocument[];
  return NextResponse.json({
    error: false,
    message: "Successfully got all reviews",
    value: reviews,
  });
};
