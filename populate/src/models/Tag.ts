import { Tag } from "@/types/tag";
import { Model, Schema, model, models, Document } from "mongoose";

const tagSchema = new Schema({
  restaurantId: {
    type: String,
    ref: "User",
    required: true,
  },
  reviewId: {
    type: Schema.Types.ObjectId,
    ref: "Review",
    required: true,
  },
  label: {
    type: String,
    default: true,
  },
});

export type TagDocument = Tag & Document;
const TagModel =
  (models.Tag as Model<TagDocument>) || model<TagDocument>("Tag", tagSchema);

export default TagModel;
