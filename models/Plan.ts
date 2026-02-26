import { Plan } from "@/types/plan";
import { Model, Schema, model, models, Document } from "mongoose";

const PlanSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  restaurants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      default: [],
    },
  ],
});

export type PlanDocument = Plan & Document;
const PlanModel =
  (models.Plan as Model<PlanDocument>) ||
  model<PlanDocument>("Plan", PlanSchema);

export default PlanModel;
