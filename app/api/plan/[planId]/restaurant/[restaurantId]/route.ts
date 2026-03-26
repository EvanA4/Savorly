import PlanModel from "@/models/Plan";
import PlanRestaurantModel from "@/models/PlanRestaurant";
import { getRestaurantById } from "@/utils/server/restaurant";

import dbConnect from "@/utils/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import { addRestaurantToPlan } from "@/utils/server/plan";

// POST (add restaurant to plan)
export const POST = async function (
  req: NextRequest,
  { params }: { params: { planId: string; restaurantId: string } },
) {
  await dbConnect();

  const { planId, restaurantId } = await params;

  // Check if planId is valid
  if (!planId)
    return NextResponse.json({ message: "Plan ID required" }, { status: 400 });

  try {
    const plan = await PlanModel.findById(planId);
    if (!plan) {
      return NextResponse.json(
        {
          error: true,
          message: "Plan not found",
          value: undefined,
        },
        { status: 404 },
      );
    }
  } catch (e) {
    const err = e as { message?: string };
    return NextResponse.json(
      {
        error: true,
        message: `Failed to find plan: ${err.message}`,
        value: undefined,
      },
      { status: 400 },
    );
  }

  // Check if restaurantId is valid
  if (!restaurantId)
    return NextResponse.json(
      { message: "Restaurant ID required" },
      { status: 400 },
    );

  const restaurant = await getRestaurantById(restaurantId);
  const restExists = restaurant.anticipate();
  if (restExists.error) {
    return NextResponse.json(
      { message: "Restaurant not found" },
      { status: 404 },
    );
  }

  // Check if restaurant is already in the plan
  const isInPlan = await PlanRestaurantModel.findOne({
    planId,
    restaurantId,
  });

  if (isInPlan) {
    return NextResponse.json(
      { message: "Restaurant is already in the plan" },
      { status: 400 },
    );
  }

  // Create a new PlanRestaurant document
  const planRestaurant = await addRestaurantToPlan(planId, restaurantId);
  const perr = planRestaurant.anticipate();
  if (perr.error) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to add restaurant to plan: ${perr.message}`,
        value: undefined,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(planRestaurant.unwrap());
};

// DELETE (remove restaurant from plan)
export const DELETE = async function (
  req: NextRequest,
  { params }: { params: { planId: string; restaurantId: string } },
) {
  await dbConnect();

  const { planId, restaurantId } = await params;

  // Check if planId is valid
  if (!planId)
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  const plan = await PlanModel.findOne({ _id: planId });
  if (!plan)
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  // Check if restaurantId is valid
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

  // Delete the PlanRestaurant document

  return NextResponse.json(
    { message: "Restaurant removed from plan" },
    { status: 200 },
  );
};

// GET (Verify if restaurant is in the plan)
export const GET = async function (
  req: NextRequest,
  { params }: { params: { planId: string; restaurantId: string } },
) {
  await dbConnect();

  const { planId, restaurantId } = await params;

  // Check if planId is valid
  if (!planId)
    return NextResponse.json({ message: "Plan ID required" }, { status: 400 });

  const plan = await PlanModel.findOne({ _id: planId });
  if (!plan)
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  // Check if restaurantId is valid
  if (!restaurantId)
    return NextResponse.json(
      { message: "Restaurant ID required" },
      { status: 400 },
    );

  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant)
    return NextResponse.json(
      { message: "Restaurant not found" },
      { status: 404 },
    );

  // Check if restaurant is in the plan
  // returns NULL if restaurant is not in the plan
  // returns the planRestaurant document if restaurant is in the plan
  const isInPlan = await PlanRestaurantModel.findOne({
    planId: planId,
    restaurantId: restaurantId,
  });

  return NextResponse.json(isInPlan, { status: 200 });
};
