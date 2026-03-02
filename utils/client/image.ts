import { IImage } from "@/types/imagedb/image";
import { Result } from "@/types/results";

export async function getImagesByReviewId(
  id: string,
): Promise<Result<IImage[]>> {
  const rawRes = await fetch(`/api/images/?reviewId=${id}`);
  const apiRes = await rawRes.json();
  return new Result<IImage[]>(apiRes);
}
