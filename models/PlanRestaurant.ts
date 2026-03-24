import { PlanRestaurant } from "@/types/planRestaurant";
import { Model, Schema, model, models, Document } from "mongoose";

const PlanRestaurantSchema = new Schema({
  planId: {
    type: String,
    ref: "Plan",
    required: true,
  },
  restaurantId: {
    type: String,
    ref: "Restaurant",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export type PlanRestaurantDocument = PlanRestaurant & Document;
const PlanRestaurantModel =
  (models.PlanRestaurant as Model<PlanRestaurantDocument>) ||
  model<PlanRestaurantDocument>("PlanRestaurant", PlanRestaurantSchema);

export default PlanRestaurantModel;
