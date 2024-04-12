import mongoose from "mongoose";
import { ObjectId, Schema, Types, model } from "mongoose";

interface Review {
  rating: number;
  title: string;
  comment: string;
  user: ObjectId;
  product: ObjectId;
}

const ReviewSchema = new Schema<Review>(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "please provide review title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "please provide review text"],
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Review", ReviewSchema);
