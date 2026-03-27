import { PlanDocument } from "@/models/Plan";
import { PlanRestaurantDocument } from "@/models/PlanRestaurant";
import { PopulatedPlan } from "@/types/plan";
import { Restaurant } from "@/types/restaurant";
import { Result } from "@/types/results";

export async function createPlan(
  userId: string,
  planName: string,
): Promise<Result<PlanDocument>> {
  const rawRes = await fetch(`/api/plan/user/${userId}`, {
    method: "POST",
    body: JSON.stringify({
      name: planName,
    }),
  });
  return new Result<PlanDocument>(await rawRes.json());
}

export async function getUserPlans(
  userId: string,
): Promise<Result<PopulatedPlan[]>> {
  const rawRes = await fetch(`/api/plan/user/${userId}`);
  return new Result<PopulatedPlan[]>(await rawRes.json());
}

export async function deletePlan(
  planId: string,
): Promise<Result<PlanDocument>> {
  const rawRes = await fetch(`/api/plan/${planId}`, {
    method: "DELETE",
  });
  return new Result<PlanDocument>(await rawRes.json());
}

export async function getRestaurantsInPlan(
  planId: string,
): Promise<Result<Restaurant[]>> {
  const rawRes = await fetch(`/api/plan/${planId}`);
  return new Result<Restaurant[]>(await rawRes.json());
}

export async function updatePlan(
  planId: string,
  name: string,
): Promise<Result<PlanDocument>> {
  const rawRes = await fetch(`/api/plan/${planId}`, {
    method: "PUT",
    body: JSON.stringify({
      name: name,
    }),
  });
  return new Result<PlanDocument>(await rawRes.json());
}

export async function addRestaurantToPlan(
  planId: string,
  restaurantId: string,
): Promise<Result<PlanRestaurantDocument>> {
  const rawRes = await fetch(`/api/plan/${planId}/restaurant/${restaurantId}`, {
    method: "POST",
  });
  return new Result<PlanRestaurantDocument>(await rawRes.json());
}

export async function deleteRestaurantFromPlan(
  planId: string,
  restaurantId: string,
): Promise<Result<PlanRestaurantDocument>> {
  const rawRes = await fetch(`/api/plan/${planId}/restaurant/${restaurantId}`, {
    method: "DELETE",
  });
  return new Result<PlanRestaurantDocument>(await rawRes.json());
}
