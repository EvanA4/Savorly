import { Restaurant } from "@/types/restaurant";
import { APIResult, Result } from "@/types/results";

export async function poiSearchRests(toSearch: {
  searchStr: string;
  lat: number;
  lng: number;
  cuisine: string;
  restrictions: string[];
}): Promise<Result<Restaurant[]>> {
  const rawRes = await fetch("/api/poi", {
    method: "POST",
    body: JSON.stringify(toSearch),
  });

  return new Result((await rawRes.json()) as APIResult<Restaurant[]>);
}
