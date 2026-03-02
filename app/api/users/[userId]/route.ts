import { getUserById } from "@/utils/server/users";
import { NextRequest, NextResponse } from "next/server";

export const GET = async function (
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = await params;

  const user = await getUserById(userId);

  return NextResponse.json(
    user || { message: "Failed to extract user from ID" },
    { status: 200 },
  );
};
