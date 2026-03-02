import { IMovie } from "@/models/Movie";
import { APIResult, ResultErr } from "@/types/results";
import { fetch3Movies } from "@/utils/server/movies";
import { NextResponse } from "next/server";

export const GET = async function (): Promise<
  NextResponse<APIResult<IMovie[]>>
> {
  const moviesRes = await fetch3Movies();
  const rerr: ResultErr = moviesRes.anticipate();
  if (rerr.error) {
    return NextResponse.json(
      {
        error: true,
        message: `Error fetching movies: ${rerr.message}`,
        value: undefined,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      error: false,
      message: `Successfully retrieved movies.`,
      value: moviesRes.unwrap(),
    },
    { status: 200 },
  );
};
