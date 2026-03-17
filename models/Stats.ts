// don't know if i actually need this...?

import { Stats } from "@/types/stats";
import { Model, Schema, model, models, Document } from "mongoose";

const statsSchema = new Schema({
  poiId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  budget: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
});

export type StatsDocument = Stats & Document;
const StatsModel =
  (models.Stats as Model<StatsDocument>) ||
  model<StatsDocument>("Stats", statsSchema);
export default StatsModel;
