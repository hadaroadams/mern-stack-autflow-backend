"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermissions = exports.authenticateUser = void 0;
const errors_1 = require("../errors");
const util_1 = require("../util");
const Token_1 = __importDefault(require("../models/Token"));
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken, accessToken } = req.signedCookies;
    try {
        if (accessToken) {
            const payload = (0, util_1.isTokenValid)(accessToken);
            req.user = payload.user;
            return next();
        }
        const payload = (0, util_1.isTokenValid)(refreshToken);
        const existingToken = yield Token_1.default.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken,
        });
        if (!existingToken || !(existingToken === null || existingToken === void 0 ? void 0 : existingToken.isValid)) {
            return next(new errors_1.Unauthenticated("Authention Invalid"));
        }
        (0, util_1.attachCookiesToResponse)({
            res,
            user: payload.user,
            refreshToken: existingToken.refreshToken,
        });
        req.user = payload.user;
        next();
    }
    catch (err) {
        next(new errors_1.Unauthenticated("Authentication Invalid"));
    }
});
exports.authenticateUser = authenticateUser;
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        var _a;
        console.log(req.user);
        if (!roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
            throw new errors_1.Unauthorized("Unauthorized to access this Route");
        }
        next();
    };
};
exports.authorizePermissions = authorizePermissions;
