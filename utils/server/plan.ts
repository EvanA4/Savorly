import PlanModel, { PlanDocument } from "@/models/Plan";
import PlanRestaurantModel, {
  PlanRestaurantDocument,
} from "@/models/PlanRestaurant";
import { Result } from "@/types/results";

import dbConnect from "../dbconnect";
import { startSession } from "mongoose";
import { Restaurant } from "@/types/restaurant";
import { getRestaurantById } from "./restaurant";
import { PopulatedPlan } from "@/types/plan";

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

// GET plan/user/[userId] (gets all plans with their restaurants for a user)
export async function getUserPlans(
  userId: string,
): Promise<Result<PopulatedPlan[]>> {
  try {
    await dbConnect();

    // Get all plans for yser
    const plans = (await PlanModel.find({
      creatorId: userId,
    })) as PlanDocument[];

    // Get all planRestaurants for ALL plans (avoid duplicate fetches)
    const planIds = plans.map((p) => p._id);
    const allPlanRestaurants = (await PlanRestaurantModel.find({
      planId: { $in: planIds as unknown as string[] },
    })) as PlanRestaurantDocument[];

    // Fetch all unique restaurants in parallel (avoid duplicate fetches)
    const uniqueRestaurantIds = [
      ...new Set(allPlanRestaurants.map((pr) => pr.restaurantId)),
    ];
    const restaurantResults = (await Promise.all(
      uniqueRestaurantIds.map((id) => getRestaurantById(id)),
    )) as Result<Restaurant>[];

    // Build a map for quick lookup
    const restaurantMap = new Map<string, Restaurant>();
    restaurantResults.forEach((result, i) => {
      if (!result.anticipate().error) {
        restaurantMap.set(uniqueRestaurantIds[i], result.unwrap());
      }
    });

    // Assemble populated plans
    const populatedPlans = plans.map((plan) => {
      const planRestaurants = allPlanRestaurants
        .filter((pr) => pr.planId.toString() === plan._id.toString())
        .map((pr) => restaurantMap.get(pr.restaurantId))
        .filter(Boolean) as Restaurant[];

      return {
        name: plan.name,
        creatorId: userId,
        planId: plan._id.toString(),
        restaurants: planRestaurants,
      };
    });

    return new Result<PopulatedPlan[]>({
      error: false,
      message: "Successfully retrieved collections.",
      value: populatedPlans,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<PopulatedPlan[]>({
      error: true,
      message: err.message ?? "Failed to retrieve collections.",
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
): Promise<Result<Restaurant[]>> {
  try {
    await dbConnect();

    const planRestaurants = await PlanRestaurantModel.find({ planId });
    const restaurantIds = planRestaurants.map((pr) => pr.restaurantId);

    const restaurantResults = await Promise.all(
      restaurantIds.map((id) => getRestaurantById(id)),
    );

    // Filter out any failed lookups
    const restaurants = restaurantResults
      .filter((result) => !result.anticipate().error)
      .map((result) => result.unwrap());
    console.log(restaurants);

    return new Result<Restaurant[]>({
      error: false,
      message: "Successfully retrieved planRestaurants.",
      value: restaurants,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<Restaurant[]>({
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

// DELETE plan/[planId]/restaurant/[restaurantId]
export async function deleteRestaurantFromPlan(
  planId: string,
  restaurantId: string,
): Promise<Result<PlanRestaurantDocument>> {
  try {
    await dbConnect();

    const planRest = await PlanRestaurantModel.findOneAndDelete({
      planId,
      restaurantId,
    });

    if (!planRest) {
      return new Result<PlanRestaurantDocument>({
        error: true,
        message: "Restaurant not found in plan.",
        value: undefined,
      });
    }

    return new Result<PlanRestaurantDocument>({
      error: false,
      message: "Successfully deleted restaurant from plan.",
      value: planRest,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<PlanRestaurantDocument>({
      error: true,
      message:
        err.message != undefined
          ? err.message
          : "Failed to delete restaurant from plan.",
      value: undefined,
    });
  }
}

// TODO: GET plan/[planId]/restaurant/[restaurantId]
export async function getPlanRestaurant(
  planId: string,
  restaurantId: string,
): Promise<Result<PlanRestaurantDocument>> {
  try {
    await dbConnect();
    const planRest = await PlanRestaurantModel.findOne({
      planId,
      restaurantId,
    });

    if (!planRest) {
      return new Result<PlanRestaurantDocument>({
        error: true,
        message: "Plan restaurant not found.",
        value: undefined,
      });
    }
    return new Result<PlanRestaurantDocument>({
      error: false,
      message: "Successfully found plan restaurant.",
      value: planRest,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<PlanRestaurantDocument>({
      error: true,
      message:
        err.message != undefined
          ? err.message
          : "Failed to find plan restaurant.",
      value: undefined,
    });
  }
}
