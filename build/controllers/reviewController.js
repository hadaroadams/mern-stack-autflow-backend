"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReview = exports.getSingleProductReviews = exports.getSingleReview = exports.getAllReviews = exports.createReview = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const errors_1 = require("../errors");
const Review_1 = __importDefault(require("../models/Review"));
const http_status_codes_1 = require("http-status-codes");
const util_1 = require("../util");
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { product: productId } = req.body;
    const isValidProduct = yield Product_1.default.findOne({ _id: productId });
    if (!isValidProduct) {
        throw new errors_1.NotFound(`No Product with id:${productId}`);
    }
    const alreadySubmitted = yield Review_1.default.findOne({
        product: productId,
        user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
    });
    if (alreadySubmitted) {
        throw new errors_1.BadRequest("Already submitted review for this product");
    }
    req.body.user = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const review = yield Review_1.default.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ review });
});
exports.createReview = createReview;
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ reviews, count: reviews.length });
});
exports.getAllReviews = getAllReviews;
const getSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: reviewId } = req.params;
    const review = yield Review_1.default.findOne({ _id: reviewId });
    if (!review)
        throw new errors_1.NotFound(`No review with id${reviewId}`);
    res.status(http_status_codes_1.StatusCodes.OK).json({ review });
});
exports.getSingleReview = getSingleReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;
    const review = yield Review_1.default.findOne({ _id: reviewId });
    if (!review)
        throw new errors_1.NotFound(`No review with id:${reviewId}`);
    review.user;
    (0, util_1.checkPermission)(req.user, review.user);
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    yield review.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "success! Review removed" });
});
exports.updateReview = updateReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: reviewId } = req.params;
    const review = yield Review_1.default.findOneAndDelete({ _id: reviewId });
    if (!review)
        throw new errors_1.NotFound(`NO review with id:${reviewId}`);
    (0, util_1.checkPermission)(req.user, review.user);
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Success! Review removed" });
});
const getSingleProductReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productId } = req.params;
    const reviews = yield Review_1.default.find({ product: productId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ reviews, count: reviews.length });
});
exports.getSingleProductReviews = getSingleProductReviews;
