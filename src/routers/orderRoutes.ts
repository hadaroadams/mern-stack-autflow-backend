import { Router } from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentiction";
import {
  createOrder,
  getAllOrders,
  getCurrentOrder,
  getSingleProduct,
  updateOrder,
} from "../controllers/orderController";

const router = Router();

router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermissions("admin"), getAllOrders);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentOrder);

router
  .route("/:id")
  .get(authenticateUser, getSingleProduct)
  .patch(authenticateUser, updateOrder);

export default router;
