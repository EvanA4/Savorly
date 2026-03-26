import PlanModel from "@/models/Plan";
import PlanRestaurantModel from "@/models/PlanRestaurant";

import dbConnect from "@/utils/dbconnect";
import {
  deletePlan,
  getRestaurantsInPlan,
  updatePlan,
} from "@/utils/server/plan";
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

  const planRes = await deletePlan(planId);
  const perr = planRes.anticipate();
  if (perr.error) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to delete plan: ${perr.message}`,
        value: undefined,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(planRes.unwrap());
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

  try {
    const plan = await PlanModel.findById(planId);
    console.log(plan);
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
        message: `Failed to get plan: ${err.message}`,
        value: undefined,
      },
      { status: 400 },
    );
  }

  // get all restaurants in the plan
  const restaurants = await getRestaurantsInPlan(planId);
  const rerr = restaurants.anticipate();
  if (rerr.error) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to get restaurants in plan: ${rerr.message}`,
        value: undefined,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Successfully retrieved planRestaurants.",
    value: restaurants.unwrap(),
  });
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

  let body: { name?: string } | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: true, message: "Plan name required in body" },
      { status: 400 },
    );
  }
  const name = body?.name;
  if (!name) {
    return NextResponse.json(
      { error: true, message: "Plan name required" },
      { status: 400 },
    );
  }

  const updated = await updatePlan(planId, name);
  const perr = updated.anticipate();
  if (perr.error) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to update plan: ${perr.message}`,
        value: undefined,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(updated.unwrap(), { status: 200 });
};
