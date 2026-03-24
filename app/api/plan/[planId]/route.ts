import PlanModel from "@/models/Plan";
import PlanRestaurantModel from "@/models/PlanRestaurant";

import dbConnect from "@/utils/dbconnect";
import { NextRequest, NextResponse } from "next/server";

// DELETE (delete plan)
export const DELETE = async function (
  req: NextRequest,
  { params }: { params: { planId: string } },
) {
  await dbConnect();

  // Verify if planId is valid
  const { planId } = await params;

  if (!planId)
    return NextResponse.json({ message: "Plan ID required" }, { status: 400 });

  const plan = await PlanModel.findOneAndDelete({
    _id: planId,
  });

  if (!plan)
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  // delete all planRestaurants associated with the plan
  await PlanRestaurantModel.deleteMany({ planId: planId });

  return NextResponse.json(plan, { status: 200 });
};

// GET (get all restaurants in a plan)
export const GET = async function (
  req: NextRequest,
  { params }: { params: { planId: string } },
) {
  await dbConnect();

  const { planId } = await params;

  if (!planId)
    return NextResponse.json({ message: "Plan ID required" }, { status: 400 });

  const plan = await PlanModel.find({ _id: planId });

  if (!plan)
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  // get all restaurants in the plan
  const restaurants = await PlanRestaurantModel.find({ planId: planId });

  return NextResponse.json({ plan, restaurants }, { status: 200 });
};

// PUT (update plan name)
export const PUT = async function (
  req: NextRequest,
  { params }: { params: { planId: string } },
) {
  await dbConnect();

  const { planId } = await params;

  if (!planId)
    return NextResponse.json({ message: "Plan ID required" }, { status: 400 });

  const body = await req.json();
  const name = body.name;
  if (!name)
    return NextResponse.json(
      { message: "Plan name required" },
      { status: 400 },
    );

  const plan = await PlanModel.findOneAndUpdate(
    { _id: planId },
    { name },
    { new: true },
  );

  if (!plan)
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  return NextResponse.json(plan, { status: 200 });
};
