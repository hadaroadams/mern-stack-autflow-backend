import express from "express";
import {
  forgottenPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "./../controllers/authController";
import { authenticateUser } from "../middlewares/authentiction";

const Route = express.Router();

Route.post("/register", register);
Route.post("/login", login);
Route.post("/verify-email", verifyEmail);
Route.delete("/logout", authenticateUser, logout);
Route.post("/reset-password", resetPassword);
Route.post("/forgot-password", forgottenPassword);

export default Route;
