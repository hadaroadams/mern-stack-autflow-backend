import { Response } from "express";
import { CustomRequest } from "../interfaces/UserRequest";
import Product from "../models/Product";
import { StatusCodes } from "http-status-codes";
import { threadId } from "worker_threads";
import { BadRequest, NotFound } from "../errors";
import path from "path";

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

const deleteProduct = async (req: CustomRequest, res: Response) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndDelete({ _id: productId });

  if (!product) throw new NotFound(`No product found with id:${productId}`);
  res.status(StatusCodes.OK).json({ msg: "Success! Product removed" });
};

const uploadImage = async (req: CustomRequest, res: Response) => {
  if (!req.files) throw new BadRequest("No file uploaded");
  const productImage = req.files.image;
  if ((!productImage as any).mimetype.startswith("image"))
    throw new BadRequest("please upload image");

  const maxSize = 1024 * 1024;
  if ((productImage as any).size > maxSize)
    throw new BadRequest("Please upload image smaller than 1MB");

  const imagePath = path.join(
    __dirname,
    "../public/uploads" + `${(productImage as any).name}`
  );
  await (productImage as any).mv();
  res
    .status(StatusCodes.OK)
    .json({ image: `/uploads/${(productImage as any).name}` });
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
