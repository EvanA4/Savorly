import PlanModel, { PlanDocument } from "@/models/Plan";
import { Result } from "@/types/results";

import dbConnect from "../dbconnect";

export async function createPlan(
  userId: string,
  planName: string,
): Promise<Result<PlanDocument>> {
  try {
    await dbConnect();

    let plan: PlanDocument | undefined = undefined;

    plan = (await PlanModel.create({
      name: planName,
      creatorId: userId,
    })) as PlanDocument;

    return new Result<PlanDocument>({
      error: false,
      message: "Successfully created plan.",
      value: plan,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<PlanDocument>({
      error: true,
      message:
        err.message != undefined ? err.message : "Failed to create plan.",
      value: undefined,
    });
  }
}

export async function getUserPlans(
  userId: string,
): Promise<Result<PlanDocument[]>> {
  try {
    await dbConnect();
    const plans = (await PlanModel.find({
      creatorId: userId,
    })) as PlanDocument[];
    return new Result<PlanDocument[]>({
      error: false,
      message: "Successfully retrieved plans.",
      value: plans,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<PlanDocument[]>({
      error: true,
      message:
        err.message != undefined ? err.message : "Failed to look up plans.",
      value: undefined,
    });
  }
}
