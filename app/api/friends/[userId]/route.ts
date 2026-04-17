import FriendModel from "@/models/Friend";
import dbConnect from "@/utils/dbconnect";
import { NextRequest, NextResponse } from "next/server";

// Get all requests sent or received by a user, including those that are accepted
export const GET = async function (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  await dbConnect();
  const userId = await params;

  if (!userId)
    return NextResponse.json({ message: "User ID required" }, { status: 400 });

  const friend = await FriendModel.find({
    $or: [{ requestorId: userId }, { receiverId: userId }],
  });

  if (!friend)
    return NextResponse.json({ message: "Friends not found" }, { status: 404 });

  return NextResponse.json(friend, { status: 200 });
};
