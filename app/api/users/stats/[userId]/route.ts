import { APIResult } from "@/types/results";
import { UserStats } from "@/types/userstats";
import { getUserStatsById } from "@/utils/server/users";
import { NextRequest, NextResponse } from "next/server";

export const GET = async function (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
): Promise<NextResponse<APIResult<UserStats>>> {
  const { userId } = await params;

  const res = await getUserStatsById(userId);
  const rerr = res.anticipate();
  if (rerr.error) {
    return NextResponse.json({
      error: true,
      message: rerr.message,
      value: undefined,
    });
  }

  return NextResponse.json(
    {
      error: false,
      message: "Successfully retrieved user statistics.",
      value: res.unwrap(),
    },
    { status: 200 },
  );
};
