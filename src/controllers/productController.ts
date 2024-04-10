import { Response } from "express";
import { CustomRequest } from "../interfaces/UserRequest";
import Product from "../models/Product";
import { StatusCodes } from "http-status-codes";
import { threadId } from "worker_threads";
import { NotFound } from "../errors";

const createProduct = async (req: CustomRequest, res: Response) => {
  req.body.user = req.user?.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req: CustomRequest, res: Response) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req: CustomRequest, res: Response) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });
  if (!product) throw new NotFound(`No product found with id:${productId}`);
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req: CustomRequest, res: Response) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    runValidators: true,
    new: true,
  });
  if (!product) throw new NotFound(`No product found with id:${productId}`);
  res.status(StatusCodes.OK).json({ product });
};




