import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { BadRequest, NotFound, Unauthenticated } from "../errors";
import {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
} from "../util";
import { StatusCodes } from "http-status-codes";
import Token from "../models/Token";
import { CustomRequest } from "../interfaces/UserRequest";
import { sendResendPasswordEmail } from "../util/sendResetPasswordEmail";
// import { createHash } from "crypto";
import { hashString } from "../util/createHash";

const crypto = require("crypto");

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password } = req.body;
  console.log(name);

  const emailAlreadyExist = await User.findOne({ email });
  console.log(emailAlreadyExist);
  if (emailAlreadyExist) return next(new BadRequest("Email already exist"));

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  const origin = "http://localhost:5000";
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    origin,
    verificationToken: user.verificationToken,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Success! Please check your email to verify account" });
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { token, email } = req.body;
  const user = await User.findOne({ email });

  if (!user) next(new Unauthenticated("Verification failed"));

  if (user?.verificationToken !== token)
    next(new Unauthenticated("Verification failed"));

  user!.isVerified = true;
  user!.verificationToken = "";
  await user?.save();
  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password)
    next(new BadRequest("please provide email and password"));
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) return next(new NotFound("Invalid credentials1"));

  const isPasswordCorrect = await user?.comparePassword(password);
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect)
    return next(new Unauthenticated("Invalid credential2"));
  if (!user?.isVerified)
    return next(new Unauthenticated("Please verify your email"));

  const tokenUser = createTokenUser(user);

  let refreshToken = "";

  const existingToken = await Token.findOne({ user: user?._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) next(new Unauthenticated("Invalid Credientials3"));
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  console.log(req.header);
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user?._id };
  console.log({ userAgent, ip, userToken });

  await Token.create(userToken);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req: CustomRequest, res: Response) => {
  await Token.findOneAndDelete({ user: req.user?.userId });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user is logged out " });
};

const forgottenPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (!email) {
    return next(new BadRequest("please provide email"));
  }
  const user = await User.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");

    const origin = "http://localhost:5000";

    await sendResendPasswordEmail({
      name: user?.name!,
      email: user?.email!,
      origin,
      token: passwordToken,
    });

    const tenMinutes = 1000 * 60 * 60;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    user.passwordToken = hashString(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ msg: "please check your email for reset pasword link" });
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password)
    next(new BadRequest("Please provide all values"));
  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === hashString(token) &&
      user.passwordTokenExpirationDate! > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  res.send("reset password");
};
export {
  register,
  verifyEmail,
  login,
  logout,
  resetPassword,
  forgottenPassword,
};
