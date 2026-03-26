// api/restaurant/stats/[poiId]
import ReviewModel from "@/models/Review";
import dbConnect from "@/utils/dbconnect";
import { getRestaurantById } from "@/utils/server/restaurant";
import { NextRequest, NextResponse } from "next/server";

export const GET = async function (
  req: NextRequest,
  { params }: { params: { poiId: string } },
) {
  await dbConnect();

  // poiId must be valid
  const { poiId } = await params;
  if (!poiId) {
    return NextResponse.json(
      { message: "POI ID is required" },
      { status: 400 },
    );
  }

  const isPoi = (await getRestaurantById(poiId as string)) != undefined;
  if (!isPoi) {
    return NextResponse.json(
      {
        error: true,
        message: "POI ID is invalid",
      },
      { status: 400 },
    );
  }

  // get average rating
  const [avg_rating] = await ReviewModel.aggregate([
    { $match: { restaurantId: poiId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  const avgRating = avg_rating?.avgRating ?? 0;

  // get average budget
  const [avg_budget] = await ReviewModel.aggregate([
    { $match: { restaurantId: poiId } },
    {
      $group: {
        _id: null,
        avgBudget: { $avg: "$budget" },
      },
    },
  ]);
  const avgBudget = Math.round(avg_budget?.avgBudget ?? 0);

  // get # reviews
  const reviewCount = await ReviewModel.countDocuments({ restaurantId: poiId });

  // get image ID
  const firstReview = await ReviewModel.findOne({ restaurantId: poiId })
    .sort({ createdAt: 1 })
    .select({ images: 1 })
    .lean();
  const imageId = (firstReview as { images?: string[] })?.images?.[0] ?? null;

  return NextResponse.json({
    poiId,
    avgRating,
    avgBudget,
    reviewCount,
    imageId,
  });
};
