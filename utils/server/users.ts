import { MAPIUser } from "@/types/auth0/mapi_user";
import { Result } from "@/types/results";
import { UserStats } from "@/types/userstats";
import { getReviewsByUserId } from "./review";
import dbConnect from "../dbconnect";

export async function getAuth0AccessToken(): Promise<string> {
  const rawRes = await fetch(`${process.env.AUTH0_DOMAIN!}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CCAPP_CLIENT_ID!,
      client_secret: process.env.AUTH0_CCAPP_CLIENT_SECRET!,
      audience: `${process.env.AUTH0_DOMAIN!}/api/v2/`,
      grant_type: "client_credentials",
    }),
  });
  const res = await rawRes.json();

  return res.access_token ?? "";
}

export async function getUserById(id: string): Promise<MAPIUser | undefined> {
  const token = await getAuth0AccessToken();
  const rawRes = await fetch(
    `${process.env.AUTH0_DOMAIN!}/api/v2/users/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  const res = await rawRes.json();

  return res.error ? undefined : (res as MAPIUser);
}

export async function getUserStatsById(id: string): Promise<Result<UserStats>> {
  try {
    // get reviews
    const reviewsRes = await getReviewsByUserId(id);
    const reviewRerr = reviewsRes.anticipate();
    if (reviewRerr.error) {
      return new Result<UserStats>({
        error: true,
        message: `Failed to get reviews for user: ${reviewRerr.message}`,
        value: undefined,
      });
    }
    const reviews = reviewsRes.unwrap();

    // get number of unique restaurant IDs from reviews
    const numRestaurants = new Set(reviews.map((x) => x.restaurantId)).size;

    // get number of collections by userID [TODO]
    // code here

    return new Result<UserStats>({
      error: false,
      message: "Successfully extracted user statistics.",
      value: {
        numReviews: reviews.length,
        numRestaurants: numRestaurants,
        numCollections: 0,
      },
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<UserStats>({
      error: true,
      message:
        err.message != undefined
          ? err.message
          : "Failed to extract user statistics.",
      value: undefined,
    });
  }
}
