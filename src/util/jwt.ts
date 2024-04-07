import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenUser } from "../interfaces/UserRequest";

interface Payload extends JwtPayload {
  user: TokenUser;
  refreshToken?: string;
}

interface AttachCookiesToResponse {
  res: Response;
  user: TokenUser;
  refreshToken?: string;
}

const createJWT = ({ payload }: { payload: Payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN!);
  return token;
};

const isTokenValid = (token: string): Payload =>
  jwt.verify(token, process.env.JWT_SECRET_TOKEN!) as Payload;

const attachCookiesToResponse = ({
  res,
  user,
  refreshToken,
}: AttachCookiesToResponse) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 24 * 60 * 60 * 1000;
  const longerExp = 30 * 24 * 60 * 60 * 1000;
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
