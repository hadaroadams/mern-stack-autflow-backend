import express, { Application, Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import "express-async-errors";
// require("express-async-errors");
import helmet from "helmet";
import cors from "cors";

config();
// expressAsync()
const app: Application = express();
const PORT = Number(process.env.PORT) || 5000;

app.get("/", (req: Request, res: Response, next: NextFunction) => {
//   console.log(req.header);
  res.send("This is my initial page");
//   next();
});

app.listen(PORT, () => {
  console.log(`server is runnning on port:${PORT}`);
});
