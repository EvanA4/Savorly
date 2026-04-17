import FriendModel from "@/models/Friend";
// import UserModel from "@/models/User";
import dbConnect from "@/utils/dbconnect";
import { NextRequest, NextResponse } from "next/server";

// Get the friend relationship between two users
export const GET = async function (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string; user2Id: string }> },
) {
  await dbConnect();

  const { userId, user2Id } = await params;

  if (!userId)
    return NextResponse.json({ message: "User ID required" }, { status: 400 });

  const friend = await FriendModel.find({
    $or: [
      { requestorId: userId, receiverId: user2Id },
      { requestorId: user2Id, receiverId: userId },
    ],
  });

  if (!friend)
    return NextResponse.json(
      { message: "Friend relationship not found" },
      { status: 404 },
    );

  return NextResponse.json(friend, { status: 200 });
};

// the same as creating a new Friend relationship / sending a friend request
// the first one must be the requestor and the second one must be the receiver
export const POST = async function (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string; user2Id: string }> },
) {
  await dbConnect();
  const { userId, user2Id } = await params;

  // verify that both userId and user2Id are present
  if (!userId || !user2Id)
    return NextResponse.json(
      { message: "Requestor User ID and Receiver User ID required" },
      { status: 400 },
    );

  // verify that the requestor and receiver user IDs are not the same
  if (userId == user2Id)
    return NextResponse.json(
      { message: "Requestor and Receiver User IDs cannot be the same" },
      { status: 400 },
    );

  // verify that the users exist in the database
  // const user = await UserModel.findOne({ _id: params.userId });
  // if (!user)
  //   return NextResponse.json({ message: "User not found" }, { status: 404 });

  // const user2 = await UserModel.findOne({ _id: params.user2Id });
  // if (!user2)
  //   return NextResponse.json({ message: "User not found" }, { status: 404 });

  // verify that the friend relationship does not already exist
  const existing = await FriendModel.findOne({
    $or: [
      { requestorId: userId, receiverId: user2Id },
      { requestorId: user2Id, receiverId: userId },
    ],
  });
  if (existing)
    return NextResponse.json(
      { message: "Friend relationship already exists" },
      { status: 400 },
    );

  const friend = await FriendModel.insertOne({
    requestorId: userId,
    receiverId: user2Id,
    status: false,
  });

  if (!friend)
    return NextResponse.json({ message: "Friend not found" }, { status: 404 });

  return NextResponse.json(friend, { status: 200 });
};
