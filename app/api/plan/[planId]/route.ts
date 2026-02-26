import PlanModel from "@/models/Plan";

import dbConnect from "@/utils/dbconnect";
import { NextRequest, NextResponse } from "next/server";

// DELETE (delete plan)
export const DELETE = async function (
  req: NextRequest,
  { params }: { params: { planId: string } },
) {
  await dbConnect();

  if (!params.planId)
    return NextResponse.json({ message: "Plan ID required" }, { status: 400 });

  const plan = await PlanModel.findOneAndDelete({
    _id: params.planId,
  });

  if (!plan)
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  return NextResponse.json(plan, { status: 200 });
};

// GET (get plan)
export const GET = async function (
  req: NextRequest,
  { params }: { params: { planId: string } },
) {
  await dbConnect();

  if (!params.planId)
    return NextResponse.json({ message: "Plan ID required" }, { status: 400 });

  const plan = await PlanModel.find({ _id: params.planId });

  if (!plan)
    return NextResponse.json({ message: "Plan not found" }, { status: 404 });

  return NextResponse.json(plan, { status: 200 });
};
