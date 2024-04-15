import { env, exit } from "process";
import { connectDB } from "./config/dbConnect";
import orders from "./mockData/orders.json";
import Order from "./models/Order";
import mongoose, { Types } from "mongoose";
import { config } from "dotenv";
config();

const start = async () => {
  try {
    await connectDB();
    let mitOrder: any[] = [];
    for (const item of orders as any) {
      item.user = new Types.ObjectId("661c6666a41d2b93259dbeac");
      mitOrder = [...mitOrder, item];
    }
    await Order.create(orders);
    console.log("success!!!");
    exit(0);
  } catch (erro) {
    console.log(erro);
    exit(1);
  }
};

start();
