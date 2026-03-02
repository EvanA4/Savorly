import { Restaurant } from "@/types/restaurant";
import { Result } from "@/types/results";

export async function getRestaurantById(id: string) {
  const rawRes = await fetch(`/api/poi/${id}`);
  return new Result<Restaurant>(await rawRes.json());
}
