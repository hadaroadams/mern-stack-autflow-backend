import { StatusCodes } from "http-status-codes";

import { CustomError } from "./CustomError";

export class Unauthorized extends CustomError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
