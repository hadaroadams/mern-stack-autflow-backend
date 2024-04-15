"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCookiesToResponse = exports.isTokenValid = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWT = ({ payload }) => {
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_TOKEN);
    return token;
};
exports.createJWT = createJWT;
const isTokenValid = (token) => jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_TOKEN);
exports.isTokenValid = isTokenValid;
const attachCookiesToResponse = ({ res, user, refreshToken, }) => {
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
exports.attachCookiesToResponse = attachCookiesToResponse;
