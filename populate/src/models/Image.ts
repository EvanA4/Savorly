import mongoose, { Schema } from "mongoose";

export interface Image {
  reviewId?: string;
  md5: string;
  name: string;
  extension: string;
  size: number;
  width: number;
  height: number;
  _id?: string;
  created_at?: Date;
  updated_at?: Date;
  __v?: number;
}

const imageSchema = new mongoose.Schema(
  {
    reviewId: { type: Schema.Types.ObjectId, ref: "Review", required: false },
    md5: { type: String, required: true },
    name: { type: String, required: true },
    extension: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    size: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export const ImageModel =
  mongoose.models.Image || mongoose.model("Image", imageSchema);
