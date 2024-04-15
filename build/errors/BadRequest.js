"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequest = void 0;
const http_status_codes_1 = require("http-status-codes");
const CustomError_1 = require("./CustomError");
class BadRequest extends CustomError_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
}
exports.BadRequest = BadRequest;
