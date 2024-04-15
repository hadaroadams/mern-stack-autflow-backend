"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentiction_1 = require("../middlewares/authentiction");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(authentiction_1.authenticateUser, (0, authentiction_1.authorizePermissions)("admin"), productController_1.createProduct)
    .get(productController_1.getAllProducts);
router
    .route("/uploadImage")
    .post(authentiction_1.authenticateUser, (0, authentiction_1.authorizePermissions)("admin"));
router
    .route("/:id")
    .get(productController_1.getSingleProduct)
    .patch(authentiction_1.authenticateUser, (0, authentiction_1.authorizePermissions)("admin"), productController_1.updateProduct)
    .delete(authentiction_1.authenticateUser, (0, authentiction_1.authorizePermissions)("admin"), productController_1.deleteProduct);
exports.default = router;
