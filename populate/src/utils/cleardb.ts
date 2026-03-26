import { ImageModel } from "../models/Image";
import ReviewModel from "../models/Review";
import TagModel from "../models/Tag";
import { Result } from "../types/results";

export async function clearDB(): Promise<Result<number>> {
  try {
    let numDeleted = 0;
    numDeleted += (await ReviewModel.deleteMany({})).deletedCount;
    numDeleted += (await TagModel.deleteMany({})).deletedCount;

    // sketchy solution:
    // - delete all image documents
    // - call sync on image database
    numDeleted += (await ImageModel.deleteMany({})).deletedCount;
    const imagedbRes = await fetch(`${process.env.IMAGEDB_HOST}/sync`, {
      method: "POST",
      body: JSON.stringify({
        password: process.env.IMAGEDB_PASS,
      }),
      headers: {
        "Content-Type": "application/json", // Not including this causes body not to send
      },
    });
    const apiRes = (await imagedbRes.json()) as {
      error: boolean;
      message: string;
    };

    if (!apiRes.error) {
      return new Result({
        error: false,
        message: apiRes.message,
        value: numDeleted,
      });
    } else {
      return new Result({
        error: true,
        message: apiRes.message,
      });
    }
  } catch (e) {
    const err = e as { message?: string };
    return new Result<number>({
      error: true,
      message:
        err.message != undefined ? err.message : "Failed to fetch movies.",
    });
  }
}
