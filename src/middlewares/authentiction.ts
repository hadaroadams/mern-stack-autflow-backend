import { Request, Response, NextFunction } from "express";
import { Unauthenticated } from "../errors";
import { attachCookiesToResponse, isTokenValid } from "../util";
import Token from "../models/Token";
import { CustomRequest } from "../interfaces/UserRequest";

const authenticateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });
    if (!existingToken || !existingToken?.isValid) {
      return next(new Unauthenticated("Authention Invalid"));
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (err) {
    next(new Unauthenticated("Authentication Invalid"));
  }
};

export { authenticateUser };
