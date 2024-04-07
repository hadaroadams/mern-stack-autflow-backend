import { Request, Response } from "express";
import { CustomRequest } from "../interfaces/UserRequest";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound, Unauthenticated } from "../errors";
import {
  attachCookiesToResponse,
  checkPermission,
  createTokenUser,
} from "../util";

const getAllUsers = async (req: CustomRequest, res: Response) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req: CustomRequest, res: Response) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) throw new NotFound(`No user with id:${req.params.id}`);
  checkPermission(req.user!, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req: CustomRequest, res: Response) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req: CustomRequest, res: Response) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new BadRequest("Please provide email and name");
  }
  const user = await User.findOne({ _id: req.user?.userId });
  if (!user) throw new NotFound("User not found");
  user.email = email;
  user.name = name;

  await user.save();
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req: CustomRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new BadRequest("please provide old and new password");
  const user = await User.findOne({ _id: req.user?.userId });

  const isPasswordCorrect = await user?.comparePassword(oldPassword);
  if (!isPasswordCorrect) throw new Unauthenticated("Invalid credentials");
  user!.password = newPassword;
  await user?.save();
  res.status(StatusCodes.OK).json({ msg: "success! Password Updated" });
};

export {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
};
