"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SingleOrderSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    product: {
        type: mongoose_1.Types.ObjectId,
        re: "Product",
        required: true,
    },
});
const OrderSchema = new mongoose_1.Schema({
    tax: {
        type: Number,
        required: true,
    },
    shippingFee: {
        type: Number,
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    orderItems: [SingleOrderSchema],
    status: {
        type: String,
        enum: ["pending", "failed", "paid", "delivered", "canceled"],
        default: "pending",
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    clientSecret: {
        type: String,
        required: true,
    },
    paymentIntentId: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Order", OrderSchema);
