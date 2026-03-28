import { Restaurant } from "./restaurant";

export type Plan = {
  name: string;
  creatorId: string;
};

export type PopulatedPlan = {
  name: string;
  creatorId: string;
  planId: string;
  restaurants: (Restaurant & { avgRating: number })[];
};
