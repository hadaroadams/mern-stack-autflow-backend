import { Response } from "express";
import { CustomRequest } from "../interfaces/UserRequest";
import { BadRequest, NotFound } from "../errors";
import Product from "../models/Product";
import Order, { SingleOrder } from "../models/Order";
import { StatusCodes } from "http-status-codes";
import { checkPermission } from "../util";

const fakeStripeApi = async ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) => {
  const client_secrete = "someRondomValue";
  return { client_secrete, amount };
};

const createOrder = async (req: CustomRequest, res: Response) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1)
    throw new BadRequest("No cart Items provided");
  if (!tax || !shippingFee) {
    throw new BadRequest("Please provide tax and shipping fee");
  }
  let orderItems: SingleOrder[] = [];
  let subTotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) throw new NotFound(`No product with id : ${item.product}`);

    const { name, price, image, _id } = dbProduct;

    const singleOrderItem: SingleOrder = {
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
  const paymentIntent = await fakeStripeApi({ amount: total, currency: "GHS" });
  const order = await Order.create({
    orderItems,
    total,
    subTotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secrete,
    user: req.user?.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req: CustomRequest, res: Response) => {
  const order = await Order.find({});
  res.status(StatusCodes.OK).json({ order });
};

const getSingleProduct = async (req: CustomRequest, res: Response) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) throw new NotFound(`No order with id:${orderId} found`);
  checkPermission(req.user!, order?.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentOrder = async (req: CustomRequest, res: Response) => {
  const order = await Order.find({ user: req.user?.userId });
  res.status(StatusCodes.OK).json({ order });
};

const updateOrder = async (req: CustomRequest, res: Response) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) throw new NotFound(`No order with id:${orderId} found`);
  checkPermission(req.user!, order?.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

export {
  createOrder,
  getAllOrders,
  getSingleProduct,
  getCurrentOrder,
  updateOrder,
};
