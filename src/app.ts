import express, { Application, Request, Response, NextFunction } from "express";
import { config } from "dotenv";
config();
require("express-async-errors");
import helmet from "helmet";
import cors from "cors";
import limiter from "express-rate-limit";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import { connectDB } from "./config/dbConnect";
import errorHandler from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import authRoute from "./routers/authRoutes";
import { env } from "process";
import userRoute from "./routers/userRoutes";

connectDB();

const PORT = Number(env.PORT) || 5000;
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(ExpressMongoSanitize());
// app.use(
//   limiter({
//     windowMs: 15 * 60 * 1000,
//     max: 10,
//   })
// );
app.use(cookieParser(process.env.JWT_SECRET_TOKEN));
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

app.use(notFound);
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`server is runnning on port:${PORT}`);
  });
});
