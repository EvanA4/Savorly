import { Restaurant, RestaurantStats } from "@/types/restaurant";
import { Result } from "@/types/results";

export async function getRestaurantById(id: string) {
  const rawRes = await fetch(`/api/poi/${id}`);
  return new Result<Restaurant>(await rawRes.json());
}

export async function getRestaurantStatsById(id: string) {
  const rawRes = await fetch(`/api/stats/${id}`);
  return new Result<RestaurantStats>(await rawRes.json());
}
