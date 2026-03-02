import { IMovie } from "@/models/Movie";
import { APIResult, Result } from "@/types/results";

export async function fetch3Movies(): Promise<Result<IMovie[]>> {
  const rawRes = await fetch("/api/test");
  return new Result<IMovie[]>((await rawRes.json()) as APIResult<IMovie[]>);
}
