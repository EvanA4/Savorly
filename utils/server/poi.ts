import { MapBoxResponse } from "@/types/mapbox/lookupResponse";
import { Restaurant } from "@/types/restaurant";
import { Result } from "@/types/results";
import dbConnect from "../dbconnect";

export async function poiSearchRests(toSearch: {
  searchStr: string;
  lat: number;
  lng: number;
  cuisine: string;
  restrictions: string[];
}): Promise<Result<Restaurant[]>> {
  try {
    await dbConnect();

    toSearch.cuisine =
      toSearch.cuisine == "All cuisines"
        ? "restaurant"
        : toSearch.cuisine.toLowerCase().replaceAll(" ", "_") + "_restaurant";
    // console.log(body);

    let rawRes: Response;
    if (toSearch.searchStr) {
      // if only a query lookup
      if (!toSearch.cuisine) {
        rawRes = await fetch(
          "https://api.mapbox.com/search/searchbox/v1/forward?" +
            new URLSearchParams({
              q: toSearch.searchStr,
              limit: "10",
              access_token: process.env.MAPBOX_KEY!,
            }),
        );
      }

      // if more values provided
      else {
        rawRes = await fetch(
          "https://api.mapbox.com/search/searchbox/v1/forward?" +
            new URLSearchParams({
              q: toSearch.searchStr,
              limit: "10",
              proximity: `${toSearch.lng},${toSearch.lat}`,
              poi_category: toSearch.cuisine,
              access_token: process.env.MAPBOX_KEY!,
            }),
        );
      }
    } else {
      rawRes = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/category/${toSearch.cuisine}?` +
          new URLSearchParams({
            access_token: process.env.MAPBOX_KEY!,
            language: "en",
            limit: "10",
            proximity: `${toSearch.lng},${toSearch.lat}`,
          }),
      );
    }
    const res: MapBoxResponse = await rawRes.json();
    // console.log(res);

    if (res.features) {
      const restaurants: Restaurant[] = res.features.map((val) => ({
        mapboxId: val.properties.mapbox_id,
        name: val.properties.name,
        website: val.properties.metadata?.website,
        phone: val.properties.metadata?.phone,
        lng: val.geometry.coordinates[0],
        lat: val.geometry.coordinates[1],
      }));
      // console.log(restaurants);

      return new Result<Restaurant[]>({
        error: false,
        message: "Successfully searched for restaurants.",
        value: restaurants,
      });
    }

    return new Result<Restaurant[]>({
      error: true,
      message: `Failed to search for restaurants: ${JSON.stringify(res)}`,
      value: undefined,
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<Restaurant[]>({
      error: true,
      message:
        err.message != undefined
          ? err.message
          : "Failed to perform POI search for restaurants.",
      value: undefined,
    });
  }
}
