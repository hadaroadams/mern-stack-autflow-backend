"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentiction_1 = require("../middlewares/authentiction");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(authentiction_1.authenticateUser, orderController_1.createOrder)
    .get(authentiction_1.authenticateUser, (0, authentiction_1.authorizePermissions)("admin"), orderController_1.getAllOrders);
router.route("/showAllMyOrders").get(authentiction_1.authenticateUser, orderController_1.getCurrentOrder);
router
    .route("/:id")
    .get(authentiction_1.authenticateUser, orderController_1.getSingleProduct)
    .patch(authentiction_1.authenticateUser, orderController_1.updateOrder);
exports.default = router;
