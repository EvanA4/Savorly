import { MAPIUser } from "@/types/auth0/mapi_user";
import { Result } from "@/types/results";
import { UserStats } from "@/types/userstats";

export async function getUserStatsById(id: string) {
  const rawRes = await fetch(`/api/users/stats/${id}`);
  return new Result<UserStats>(await rawRes.json());
}

export async function getUserById(id: string): Promise<MAPIUser | undefined> {
  const rawRes = await fetch(`/api/users/${id}`);
  return await rawRes.json();
}
