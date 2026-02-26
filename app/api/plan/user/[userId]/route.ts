import PlanModel from "@/models/Plan";
import { getUserById } from "@/utils/handlers/users";

import dbConnect from "@/utils/dbconnect";
import { NextRequest, NextResponse } from "next/server";

// POST (create new plan)
export const POST = async function (
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  await dbConnect();

  if (!params.userId)
    return NextResponse.json({ message: "User Id required" }, { status: 400 });

  const body = await req.json();
  const name = body.name;
  if (!name)
    return NextResponse.json(
      { message: "Plan name required" },
      { status: 400 },
    );

  const isUser = (await getUserById(params.userId)) != undefined;
  if (!isUser)
    return NextResponse.json(
      { message: "User ID is invalid" },
      { status: 400 },
    );

  const plan = await PlanModel.create({
    name,
    creatorId: params.userId,
  });

  return NextResponse.json(plan, { status: 201 });
};

// GET (get all plans)
export const GET = async function (
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  await dbConnect();

  if (!params.userId)
    return NextResponse.json({ message: "User ID required" }, { status: 400 });

  const plans = await PlanModel.find({ creatorId: params.userId });

  return NextResponse.json(plans, { status: 200 });
};
