import { Image } from "../models/Image";
import { TagDocument } from "../models/Tag";

export type Review = {
  userId: string;
  restaurantId: string;
  rating: number;
  budget: number;
  description: string;
  title: string;
};

export type PopulatedReview = {
  userId: string;
  restaurantId: string;
  rating: number;
  description: string;
  title: string;
  budget: number;
  images: Image[];
  tags: TagDocument[];
} & Document;
