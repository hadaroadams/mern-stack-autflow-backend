"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unauthenticated = void 0;
const http_status_codes_1 = require("http-status-codes");
const CustomError_1 = require("./CustomError");
class Unauthenticated extends CustomError_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.StatusCodes.UNAUTHORIZED;
    }
}
exports.Unauthenticated = Unauthenticated;
