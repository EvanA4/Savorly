import { Restaurant } from "@/types/restaurant";
import { APIResult } from "@/types/results";
import { poiSearchRests } from "@/utils/server/poi";
import { NextRequest, NextResponse } from "next/server";

export const POST = async function (
  req: NextRequest,
): Promise<NextResponse<APIResult<Restaurant[]>>> {
  const body: {
    searchStr: string;
    lat: number;
    lng: number;
    cuisine: string;
    restrictions: string[];
  } = await req.json();

  const res = await poiSearchRests(body);
  const rerr = res.anticipate();
  if (rerr.error) {
    return NextResponse.json(
      {
        error: true,
        message: rerr.message,
        value: undefined,
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      error: false,
      message: "Successfully performed POI search for restaurants.",
      value: res.unwrap(),
    },
    { status: 200 },
  );
};
