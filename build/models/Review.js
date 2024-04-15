"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "please provide rating"],
    },
    title: {
        type: String,
        trim: true,
        required: [true, "please provide review title"],
        maxlength: 100,
    },
    comment: {
        type: String,
        required: [true, "please provide review text"],
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    product: {
        type: mongoose_1.Types.ObjectId,
        ref: "Product",
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Review", ReviewSchema);
