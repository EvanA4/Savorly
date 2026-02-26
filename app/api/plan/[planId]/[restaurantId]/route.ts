import PlanModel from "@/models/Plan";
import { getRestaurantById } from "@/utils/handlers/restaurant";

import dbConnect from "@/utils/dbconnect";
import { NextRequest, NextResponse } from "next/server";

// PUT (add restaurant to plan)
export const PUT = async function (
  req: NextRequest,
  { params }: { params: { planId: string; restaurantId: string } },
) {
  await dbConnect();

  const { planId, restaurantId } = await params;

  if (!planId)
    return NextResponse.json({ message: "Plan ID required" }, { status: 400 });

  if (!restaurantId)
    return NextResponse.json(
      { message: "Restaurant ID required" },
      { status: 400 },
    );

  const plan = await PlanModel.findOne({ _id: planId });
  if (!plan)
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant)
    return NextResponse.json(
      { message: "Restaurant not found" },
      { status: 404 },
    );

  plan.restaurants.push(restaurantId);
  await plan.save();

  return NextResponse.json(plan, { status: 200 });
};

// DELETE (remove restaurant from plan)
export const DELETE = async function (
  req: NextRequest,
  { params }: { params: { planId: string; restaurantId: string } },
) {
  await dbConnect();

  const { planId, restaurantId } = await params;

  if (!planId)
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  if (!restaurantId)
    return NextResponse.json(
      { message: "Restaurant not found." },
      { status: 404 },
    );

  const isRestaurant =
    (await getRestaurantById(restaurantId as string)) != undefined;
  if (!isRestaurant)
    return NextResponse.json(
      { message: "Restaurant ID is invalid" },
      { status: 400 },
    );

  const updatedPlan = await PlanModel.findByIdAndUpdate(
    planId,
    { $pullAll: { restaurants: restaurantId } },
    { new: true },
  );

  if (!updatedPlan)
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  return NextResponse.json(
    { message: "Restaurant removed from plan", plan: updatedPlan },
    { status: 200 },
  );
};
