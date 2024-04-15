import mongoose, { ObjectId, Schema, Types, model, mongo } from "mongoose";
import { Type } from "typescript";

export interface SingleOrder {
  name: string;
  image: string;
  price: number;
  amount: number;
  product: ObjectId | Types.ObjectId;
}
interface Order {
  tax: number;
  shippingFee: number;
  subTotal: number;
  total: number;
  orderItems: SingleOrder[];
  status: string;
  user: ObjectId | Types.ObjectId;
  clientSecret: string;
  paymentIntentId: string;
}
const SingleOrderSchema = new Schema<SingleOrder>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: Types.ObjectId,
    re: "Product",
    required: true,
  },
});

const OrderSchema = new Schema<Order>(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Order", OrderSchema);
