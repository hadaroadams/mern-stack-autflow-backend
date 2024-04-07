import { Request } from "express";

export interface TokenUser {
  name: string;
  userId: string;
  role: "user" | "admin";
}

export interface CustomRequest extends Request {
  user?: TokenUser;
}
