import { PlanDocument } from "@/models/Plan";
import { PopulatedPlan } from "@/types/plan";
import { APIResult } from "@/types/results";
import dbConnect from "@/utils/dbconnect";
import { createPlan, getUserPlans } from "@/utils/server/plan";
import { getUserById } from "@/utils/server/users";
import { NextRequest, NextResponse } from "next/server";

// POST (create new plan)
export const POST = async function (
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  await dbConnect();

  const { userId } = await params;

  if (!userId)
    return NextResponse.json(
      { error: true, message: "User Id required" },
      { status: 400 },
    );

  // Get plan name from body of request
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
  if (!name)
    return NextResponse.json(
      { error: true, message: "Plan name required" },
      { status: 400 },
    );

  // Check if userId is valid
  const user = await getUserById(userId);

  if (!user)
    return NextResponse.json(
      { error: true, message: "User ID is invalid" },
      { status: 400 },
    );

  // Create plan
  const plan = await createPlan(userId, name);
  const perr = plan.anticipate();
  if (perr.error) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to create plan: ${perr.message}`,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(plan.unwrap());
};

// GET (get all of a user's plans as populatedPlans)
export const GET = async function (
  req: NextRequest,
  { params }: { params: { userId: string } },
): Promise<NextResponse<APIResult<PopulatedPlan[]>>> {
  await dbConnect();

  const { userId } = await params;

  if (!userId) {
    return NextResponse.json(
      {
        error: true,
        message: "User ID required",
        value: undefined,
      },
      { status: 400 },
    );
  }
  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json(
      {
        error: true,
        message: "User ID is invalid",
        value: undefined,
      },
      { status: 400 },
    );
  }

  const planRes = await getUserPlans(userId);
  const perr = planRes.anticipate();
  if (perr.error) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to get plans: ${perr.message}`,
        value: undefined,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    error: false,
    message: "Successfully got all plans",
    value: planRes.unwrap(),
  });
};
