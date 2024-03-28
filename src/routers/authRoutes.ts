import express from "express";
import { login, register, verifyEmail } from "./../controllers/authController";

const Route = express.Router();

Route.post("/register", register);

Route.post("/login", login);

Route.post("/verify-email", verifyEmail);

export default Route;
