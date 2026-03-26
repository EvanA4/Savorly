import PlanModel, { PlanDocument } from "@/models/Plan";
import PlanRestaurantModel, {
  PlanRestaurantDocument,
} from "@/models/PlanRestaurant";
import { Result } from "@/types/results";

import dbConnect from "../dbconnect";
import { startSession } from "mongoose";

// POST plan/user/[userId]
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

// GET plan/user/[userId]
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

// DELETE plan/[planId]
export async function deletePlan(
  planId: string,
): Promise<Result<PlanDocument>> {
  try {
    await dbConnect();

    const session = await startSession();
    let plan: PlanDocument | undefined = undefined;
    let numPlanRestDeleted = 0;
    let didError = "";

    try {
      await session.withTransaction(async () => {
        // delete plan
        plan = (await PlanModel.findByIdAndDelete(planId)) as PlanDocument;
        numPlanRestDeleted = (
          await PlanRestaurantModel.deleteMany({
            planId: planId,
          })
        ).deletedCount;
      });
    } catch (e) {
      const err = e as { message?: string };
      didError = err.message || "Failed to delete all restaurants.";
    } finally {
      session.endSession();
    }

    if (!plan || didError != "") {
      return new Result<PlanDocument>({
        error: true,
        message: didError ? didError : "Failed to delete all restaurants.",
      });
    }

    return new Result<PlanDocument>({
      error: false,
      message: `Successfully deleted a plan, ${numPlanRestDeleted} restaurant(s)`,
      value: plan as unknown as PlanDocument,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<PlanDocument>({
      error: true,
      message:
        err.message != undefined
          ? err.message
          : "Failed to delete all restaurants.",
      value: undefined,
    });
  }
}

// GET plan/[planId]
export async function getRestaurantsInPlan(
  planId: string,
): Promise<Result<PlanRestaurantDocument[]>> {
  try {
    await dbConnect();

    const planRestaurants = (await PlanRestaurantModel.find({
      planId: planId,
    })) as PlanRestaurantDocument[];
    return new Result<PlanRestaurantDocument[]>({
      error: false,
      message: "Successfully retrieved planRestaurants.",
      value: planRestaurants,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<PlanRestaurantDocument[]>({
      error: true,
      message:
        err.message != undefined
          ? err.message
          : "Failed to look up planRestaurants.",
      value: undefined,
    });
  }
}

// PUT plan/[planId]
export async function updatePlan(
  planId: string,
  name: string,
): Promise<Result<PlanDocument>> {
  try {
    await dbConnect();

    const updated = await PlanModel.findByIdAndUpdate(
      planId,
      { name: name },
      { returnDocument: "after" },
    );

    return new Result<PlanDocument>({
      error: false,
      message: "Successfully updated plan.",
      value: updated,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<PlanDocument>({
      error: true,
      message:
        err.message != undefined ? err.message : "Failed to update plan.",
      value: undefined,
    });
  }
}

// POST plan/[planId]/restaurant/[restaurantId]
export async function addRestaurantToPlan(
  planId: string,
  restaurantId: string,
): Promise<Result<PlanRestaurantDocument>> {
  try {
    await dbConnect();

    const planRestaurant = await PlanRestaurantModel.create({
      planId: planId,
      restaurantId: restaurantId,
    });

    return new Result<PlanRestaurantDocument>({
      error: false,
      message: "Successfully added restaurant to plan.",
      value: planRestaurant,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<PlanRestaurantDocument>({
      error: true,
      message:
        err.message != undefined
          ? err.message
          : "Failed to add restaurant to plan.",
      value: undefined,
    });
  }
}

// TODO: DELETE plan/[planId]/restaurant/[restaurantId]

// TODO: GET plan/[planId]/restaurant/[restaurantId]
