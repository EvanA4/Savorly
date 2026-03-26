import { Review } from "@/types/review";
import { Model, Schema, model, models, Document } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: {
      type: String, // Auth0 ID not MongoDB ID, so not ObjectID
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: String, // MapBox ID not MongoDB ID, so not ObjectID
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    // photos: {
    //   type: [Schema.Types.ObjectId],
    //   ref: "Images",
    //   required: false,
    // },
    // tags: {
    //   type: [String],
    //   required: false,
    // },
  },
  { timestamps: true },
);

export type ReviewDocument = Review & Document;
const ReviewModel =
  (models.Review as Model<ReviewDocument>) ||
  model<ReviewDocument>("Review", reviewSchema);
export default ReviewModel;

// TODO
// change images to have a reviewId (DONE)
// create review creation modal
// update CRUD for Review for Tags and Images
