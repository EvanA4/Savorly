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

  if (!params.planId)
    return NextResponse.json({ message: "Plan ID required" }, { status: 400 });

  if (!params.restaurantId)
    return NextResponse.json(
      { message: "Restaurant ID required" },
      { status: 400 },
    );

  const plan = await PlanModel.findOne({ _id: params.planId });
  if (!plan)
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  const restaurant = await PlanModel.findOne({ _id: params.restaurantId });
  if (!restaurant)
    return NextResponse.json(
      { message: "Restaurant not found" },
      { status: 404 },
    );

  plan.restaurants.push(params.restaurantId);
  await plan.save();

  return NextResponse.json(plan, { status: 200 });
};

// DELETE (remove restaurant from plan)
export const DELETE = async function (
  req: NextRequest,
  { params }: { params: { planId: string; restaurantId: string } },
) {
  await dbConnect();

  if (!params.planId)
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  if (!params.restaurantId)
    return NextResponse.json(
      { message: "Restaurant not found." },
      { status: 404 },
    );

  const isRestaurant =
    (await getRestaurantById(params.restaurantId as string)) != undefined;
  if (!isRestaurant)
    return NextResponse.json(
      { message: "Restaurant ID is invalid" },
      { status: 400 },
    );

  const updatedPlan = await PlanModel.findByIdAndUpdate(
    params.planId,
    { $pullAll: { restaurants: params.restaurantId } },
    { new: true },
  );

  if (!updatedPlan)
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  return NextResponse.json(
    { message: "Restaurant removed from plan", plan: updatedPlan },
    { status: 200 },
  );
};
