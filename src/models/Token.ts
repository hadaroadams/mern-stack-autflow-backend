import { Schema, Types, ObjectId, model } from "mongoose";

interface Token {
  refreshToken: string;
  ip: string;
  userAgent: string;
  isValid: boolean;
  user: ObjectId;
}

const TokenSchema = new Schema<Token>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    isValid: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default model("Token", TokenSchema);
