import TagModel, { TagDocument } from "@/models/Tag";
import dbConnect from "@/utils/dbconnect";
import { NextRequest, NextResponse } from "next/server";

// [GET] Get list of all existing review IDs from userID
export const GET = async function (
  req: NextRequest,
  { params }: { params: { reviewId: string } },
) {
  await dbConnect();
  const { reviewId } = await params;

  const tags = (await TagModel.find({
    reviewId,
  })) as TagDocument[];

  return NextResponse.json({
    error: false,
    message: "Successfully got tags",
    value: tags,
  });
};
