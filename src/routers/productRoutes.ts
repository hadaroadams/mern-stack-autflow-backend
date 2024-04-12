import { Router } from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentiction";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController";

const router = Router();

router
  .route("/")
  .post(authenticateUser, authorizePermissions("admin"), createProduct)
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post(authenticateUser, authorizePermissions("admin"));

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermissions("admin"), updateProduct)
  .delete(authenticateUser, authorizePermissions("admin"), deleteProduct);

export default router;
