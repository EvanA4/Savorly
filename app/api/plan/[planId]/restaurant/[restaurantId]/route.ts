import PlanModel from "@/models/Plan";
import PlanRestaurantModel, {
  PlanRestaurantDocument,
} from "@/models/PlanRestaurant";
import { getRestaurantById } from "@/utils/server/restaurant";

import dbConnect from "@/utils/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import {
  addRestaurantToPlan,
  deleteRestaurantFromPlan,
  getPlanRestaurant,
} from "@/utils/server/plan";
import { APIResult } from "@/types/results";

// POST (add restaurant to plan)
export const POST = async function (
  req: NextRequest,
  { params }: { params: { planId: string; restaurantId: string } },
) {
  await dbConnect();

  const { planId, restaurantId } = await params;

  // Check if planId is valid
  if (!planId)
    return NextResponse.json(
      {
        error: true,
        message: "Plan ID required",
      },
      { status: 400 },
    );

  try {
    await PlanModel.findById(planId);
  } catch (e) {
    const err = e as { message?: string };
    return NextResponse.json(
      {
        error: true,
        message: `Failed to find plan: ${err.message}`,
      },
      { status: 400 },
    );
  }

  // Check if restaurantId is valid
  if (!restaurantId)
    return NextResponse.json(
      {
        error: true,
        message: "Restaurant ID required",
      },
      { status: 400 },
    );

  const restaurant = await getRestaurantById(restaurantId);
  const restExists = restaurant.anticipate();
  if (restExists.error) {
    return NextResponse.json(
      {
        error: true,
        message: "Restaurant not found",
      },
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
      {
        error: true,
        message: "Restaurant is already in the plan",
      },
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
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Successfully added restaurant to plan",
    value: planRestaurant.unwrap(),
  });
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
    return NextResponse.json({ message: "Plan ID required" }, { status: 400 });

  try {
    await PlanModel.findById(planId);
  } catch (e) {
    const err = e as { message?: string };
    return NextResponse.json(
      {
        error: true,
        message: `Failed to find plan: ${err.message}`,
      },
      { status: 400 },
    );
  }

  // Check if restaurantId is valid
  if (!restaurantId)
    return NextResponse.json(
      {
        error: true,
        message: "Restaurant ID required",
      },
      { status: 400 },
    );

  const restaurant = await getRestaurantById(restaurantId);
  const restExists = restaurant.anticipate();
  if (restExists.error) {
    return NextResponse.json(
      {
        error: true,
        message: "Restaurant not found",
      },
      { status: 404 },
    );
  }

  // Delete the PlanRestaurant document
  const planRestaurant = await deleteRestaurantFromPlan(planId, restaurantId);
  const perr = planRestaurant.anticipate();
  if (perr.error) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to delete restaurant from plan: ${perr.message}`,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Successfully deleted restaurant from plan",
    value: planRestaurant.unwrap(),
  });
};

// GET (Verify if restaurant is in the plan)
export const GET = async function (
  req: NextRequest,
  { params }: { params: { planId: string; restaurantId: string } },
): Promise<NextResponse<APIResult<PlanRestaurantDocument>>> {
  await dbConnect();

  const { planId, restaurantId } = await params;

  // Check if planId is valid
  if (!planId)
    return NextResponse.json(
      {
        error: true,
        message: "Plan ID required",
        value: undefined,
      },
      { status: 400 },
    );

  try {
    await PlanModel.findById(planId);
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
      {
        error: true,
        message: "Restaurant ID required",
        value: undefined,
      },
      { status: 400 },
    );

  const restaurant = await getRestaurantById(restaurantId);
  const restExists = restaurant.anticipate();
  if (restExists.error) {
    return NextResponse.json(
      {
        error: true,
        message: "Restaurant not found",
        value: undefined,
      },
      { status: 404 },
    );
  }

  // Check if restaurant is in the plan
  // returns NULL if restaurant is not in the plan
  // returns the planRestaurant document if restaurant is in the plan
  const planRestaurant = await getPlanRestaurant(planId, restaurantId);
  const perr = planRestaurant.anticipate();
  if (perr.error) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to find plan restaurant: ${perr.message}`,
        value: undefined,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Successfully found plan restaurant",
    value: planRestaurant.unwrap(),
  });
};
