import { Response } from "express";
import { CustomRequest } from "../interfaces/UserRequest";
import Product from "../models/Product";
import { BadRequest, NotFound } from "../errors";
import Review from "../models/Review";
import { StatusCodes } from "http-status-codes";
import { checkPermission } from "../util";
import { ObjectId } from "mongoose";

const createReview = async (req: CustomRequest, res: Response) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new NotFound(`No Product with id:${productId}`);
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user?.userId,
  });
  if (alreadySubmitted) {
    throw new BadRequest("Already submitted review for this product");
  }
  req.body.user = req.user?.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req: CustomRequest, res: Response) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req: CustomRequest, res: Response) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) throw new NotFound(`No review with id${reviewId}`);
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req: CustomRequest, res: Response) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) throw new NotFound(`No review with id:${reviewId}`);
  review.user;
  checkPermission(req.user!, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ msg: "success! Review removed" });
};
const deleteReview = async (req: CustomRequest, res: Response) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOneAndDelete({ _id: reviewId });
  if (!review) throw new NotFound(`NO review with id:${reviewId}`);
  checkPermission(req.user!, review.user);
  res.status(StatusCodes.OK).json({ msg: "Success! Review removed" });
};

const getSingleProductReviews = async (req: CustomRequest, res: Response) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

export {
  createReview,
  getAllReviews,
  getSingleReview,
  getSingleProductReviews,
  updateReview,
};
