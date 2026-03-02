import { IMovie, Movie } from "@/models/Movie";
import { Result } from "@/types/results";
import dbConnect from "../dbconnect";

export async function fetch3Movies(): Promise<Result<IMovie[]>> {
  try {
    dbConnect();
    return new Result<IMovie[]>({
      error: false,
      message: "Successfully fetched three movies.",
      value: (await Movie.find().limit(3)) as IMovie[],
    });
  } catch (e) {
    const err = e as { message?: string };
    return new Result<IMovie[]>({
      error: true,
      message:
        err.message != undefined ? err.message : "Failed to fetch movies.",
      value: undefined,
    });
  }
}
