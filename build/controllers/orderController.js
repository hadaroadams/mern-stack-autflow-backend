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
exports.updateOrder = exports.getCurrentOrder = exports.getSingleProduct = exports.getAllOrders = exports.createOrder = void 0;
const errors_1 = require("../errors");
const Product_1 = __importDefault(require("../models/Product"));
const Order_1 = __importDefault(require("../models/Order"));
const http_status_codes_1 = require("http-status-codes");
const util_1 = require("../util");
const fakeStripeApi = (_a) => __awaiter(void 0, [_a], void 0, function* ({ amount, currency, }) {
    const client_secrete = "someRondomValue";
    return { client_secrete, amount };
});
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { items: cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 1)
        throw new errors_1.BadRequest("No cart Items provided");
    if (!tax || !shippingFee) {
        throw new errors_1.BadRequest("Please provide tax and shipping fee");
    }
    let orderItems = [];
    let subTotal = 0;
    for (const item of cartItems) {
        const dbProduct = yield Product_1.default.findOne({ _id: item.product });
        if (!dbProduct)
            throw new errors_1.NotFound(`No product with id : ${item.product}`);
        const { name, price, image, _id } = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id,
        };
        orderItems = [...orderItems, singleOrderItem];
        subTotal += item.amount * price;
    }
    const total = tax + shippingFee + subTotal;
    const paymentIntent = yield fakeStripeApi({ amount: total, currency: "GHS" });
    const order = yield Order_1.default.create({
        orderItems,
        total,
        subTotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secrete,
        user: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId,
    });
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ order, clientSecret: order.clientSecret });
});
exports.createOrder = createOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order_1.default.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ order });
});
exports.getAllOrders = getAllOrders;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: orderId } = req.params;
    const order = yield Order_1.default.findOne({ _id: orderId });
    if (!order)
        throw new errors_1.NotFound(`No order with id:${orderId} found`);
    (0, util_1.checkPermission)(req.user, order === null || order === void 0 ? void 0 : order.user);
    res.status(http_status_codes_1.StatusCodes.OK).json({ order });
});
exports.getSingleProduct = getSingleProduct;
const getCurrentOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const order = yield Order_1.default.find({ user: (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ order });
});
exports.getCurrentOrder = getCurrentOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;
    const order = yield Order_1.default.findOne({ _id: orderId });
    if (!order)
        throw new errors_1.NotFound(`No order with id:${orderId} found`);
    (0, util_1.checkPermission)(req.user, order === null || order === void 0 ? void 0 : order.user);
    order.paymentIntentId = paymentIntentId;
    order.status = "paid";
    yield order.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ order });
});
exports.updateOrder = updateOrder;
