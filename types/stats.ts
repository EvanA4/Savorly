import { IImage } from "./imagedb/image";

export type BudgetLevel = "low" | "medium" | "high";

export type Stats = {
  poiId: string;
  rating: number;
  budget: BudgetLevel;
  reviews: number;
  image: IImage;
};
