import { Restaurant } from "@/types/restaurant";
import { APIResult } from "@/types/results";
import { getRestaurantById } from "@/utils/server/restaurant";
import { NextRequest, NextResponse } from "next/server";

declare global {
  var restIdCache: undefined | Map<string, Restaurant>;
}

export const GET = async function (
  req: NextRequest,
  { params }: { params: Promise<{ poiId: string }> },
): Promise<NextResponse<APIResult<Restaurant>>> {
  const { poiId } = await params;

  // make sure restidcache is defined
  if (global.restIdCache === undefined) {
    global.restIdCache = new Map<string, Restaurant>();
  }

  // return restaurant if already cached
  if (global.restIdCache.has(poiId)) {
    return NextResponse.json({
      error: false,
      message: "Successfully found cached restaurant by ID.",
      value: global.restIdCache.get(poiId),
    });
  }

  // if not, do lookup
  const restaurantRes = await getRestaurantById(poiId);
  const rerr = restaurantRes.anticipate();

  if (rerr.error) {
    return NextResponse.json({
      error: true,
      message: rerr.message,
      value: undefined,
    });
  }

  const found = restaurantRes.unwrap();
  global.restIdCache.set(poiId, found);
  return NextResponse.json({
    error: false,
    message: "Successfully fetched restaurant by ID.",
    value: found,
  });
};
