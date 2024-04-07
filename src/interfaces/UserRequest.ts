import { Request } from "express";

export interface TokenUser {
  name: string;
  userId: string;
  role: string;
}

export interface CustomRequest extends Request {
  user?: {
    name: string;
    userId: string;
    role: string;
  };
}
