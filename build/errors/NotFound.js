"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = void 0;
const http_status_codes_1 = require("http-status-codes");
const CustomError_1 = require("./CustomError");
class NotFound extends CustomError_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
}
exports.NotFound = NotFound;
