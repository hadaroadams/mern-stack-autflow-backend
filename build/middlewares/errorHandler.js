"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorHandleMiddleware = (err, req, res, next) => {
    console.log(err);
    let customError = {
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong try again later",
    };
    if (err.name === "ValidatorError") {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    if (err.code && err.code === 11000) {
        customError.msg = `Duplication value enterd for ${Object.keys(err.keyValue)}`;
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    if (err.name === "castError") {
        customError.msg = `No Item found with id:${err.value}`;
    }
    return res.status(customError.statusCode).json({ msg: customError.msg });
};
exports.default = errorHandleMiddleware;
