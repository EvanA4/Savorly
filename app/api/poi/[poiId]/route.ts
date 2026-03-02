import { Restaurant } from "@/types/restaurant";
import { APIResult } from "@/types/results";
import { getRestaurantById } from "@/utils/server/restaurant";
import { NextRequest, NextResponse } from "next/server";

export const GET = async function (
  req: NextRequest,
  { params }: { params: { poiId: string } },
): Promise<NextResponse<APIResult<Restaurant>>> {
  const { poiId } = await params;
  const restaurantRes = await getRestaurantById(poiId);
  const rerr = restaurantRes.anticipate();

  if (rerr.error) {
    return NextResponse.json({
      error: true,
      message: rerr.message,
      value: undefined,
    });
  }

  return NextResponse.json({
    error: false,
    message: "Successfully fetched restaurant by ID.",
    value: restaurantRes.unwrap(),
  });
};
