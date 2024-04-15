import mongoose from "mongoose";
import { env } from "process";

export const connectDB = async () => {
  try {
    console.log(env.DATABASE_URL);
    await mongoose.connect(env.DATABASE_URL!, {});
  } catch (error) {
    console.log(error);
  }
};
