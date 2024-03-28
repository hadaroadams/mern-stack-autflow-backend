import { NextFunction, Request, Response, Errback } from "express";
import { StatusCodes } from "http-status-codes";

interface MyErrors {
  message: string;
}

const errorHandleMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    console.log(err)
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };
  if (err.name === "ValidatorError") {
    customError.msg = Object.values(err.errors)
      .map((item: any): string => item.message)
      .join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplication value enterd for ${Object.keys(
      err.keyValue
    )}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "castError") {
    customError.msg = `No Item found with id:${err.value}`;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandleMiddleware;
