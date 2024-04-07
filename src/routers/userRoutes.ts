import express from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentiction";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController";

const Routes = express.Router();

Routes.get(
  "/",
  authenticateUser,
  authorizePermissions("admin", "user"),
  getAllUsers
);

Routes.get("/showMe", authenticateUser, showCurrentUser);

Routes.patch("updateUser", authenticateUser, updateUser);
Routes.patch("updateUserPassword", authenticateUser, updateUserPassword);
Routes.get("/:id", authenticateUser, getSingleUser);

export default Routes;
