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
exports.forgottenPassword = exports.resetPassword = exports.logout = exports.login = exports.verifyEmail = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const errors_1 = require("../errors");
const util_1 = require("../util");
const http_status_codes_1 = require("http-status-codes");
const Token_1 = __importDefault(require("../models/Token"));
const sendResetPasswordEmail_1 = require("../util/sendResetPasswordEmail");
// import { createHash } from "crypto";
const createHash_1 = require("../util/createHash");
const crypto = require("crypto");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    console.log(name);
    const emailAlreadyExist = yield User_1.default.findOne({ email });
    console.log(emailAlreadyExist);
    if (emailAlreadyExist)
        return next(new errors_1.BadRequest("Email already exist"));
    const isFirstAccount = (yield User_1.default.countDocuments({})) === 0;
    console.log(`isFirstAccount:${isFirstAccount}`);
    const role = isFirstAccount ? "admin" : "user";
    const verificationToken = crypto.randomBytes(40).toString("hex");
    const user = yield User_1.default.create({
        name,
        email,
        password,
        role,
        verificationToken,
    });
    const origin = "http://localhost:5000";
    yield (0, util_1.sendVerificationEmail)({
        name: user.name,
        email: user.email,
        origin,
        verificationToken: user.verificationToken,
    });
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ msg: "Success! Please check your email to verify account" });
});
exports.register = register;
const verifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user)
        next(new errors_1.Unauthenticated("Verification failed"));
    if ((user === null || user === void 0 ? void 0 : user.verificationToken) !== token)
        next(new errors_1.Unauthenticated("Verification failed"));
    user.isVerified = true;
    user.verificationToken = "";
    yield (user === null || user === void 0 ? void 0 : user.save());
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Email Verified" });
});
exports.verifyEmail = verifyEmail;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        next(new errors_1.BadRequest("please provide email and password"));
    const user = yield User_1.default.findOne({ email });
    console.log(user);
    if (!user)
        return next(new errors_1.NotFound("Invalid credentials1"));
    const isPasswordCorrect = yield (user === null || user === void 0 ? void 0 : user.comparePassword(password));
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect)
        return next(new errors_1.Unauthenticated("Invalid credential2"));
    if (!(user === null || user === void 0 ? void 0 : user.isVerified))
        return next(new errors_1.Unauthenticated("Please verify your email"));
    const tokenUser = (0, util_1.createTokenUser)(user);
    let refreshToken = "";
    const existingToken = yield Token_1.default.findOne({ user: user === null || user === void 0 ? void 0 : user._id });
    if (existingToken) {
        const { isValid } = existingToken;
        if (!isValid)
            next(new errors_1.Unauthenticated("Invalid Credientials3"));
        refreshToken = existingToken.refreshToken;
        (0, util_1.attachCookiesToResponse)({ res, user: tokenUser, refreshToken });
        res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
        return;
    }
    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    console.log(req.header);
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user: user === null || user === void 0 ? void 0 : user._id };
    console.log({ userAgent, ip, userToken });
    yield Token_1.default.create(userToken);
    (0, util_1.attachCookiesToResponse)({ res, user: tokenUser, refreshToken });
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield Token_1.default.findOneAndDelete({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
    res.cookie("accessToken", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.cookie("refreshToken", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user is logged out " });
});
exports.logout = logout;
const forgottenPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return next(new errors_1.BadRequest("please provide email"));
    }
    const user = yield User_1.default.findOne({ email });
    if (user) {
        const passwordToken = crypto.randomBytes(70).toString("hex");
        const origin = "http://localhost:5000";
        yield (0, sendResetPasswordEmail_1.sendResendPasswordEmail)({
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            origin,
            token: passwordToken,
        });
        const tenMinutes = 1000 * 60 * 60;
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
        user.passwordToken = (0, createHash_1.hashString)(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        yield user.save();
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ msg: "please check your email for reset pasword link" });
    }
});
exports.forgottenPassword = forgottenPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email, password } = req.body;
    if (!token || !email || !password)
        next(new errors_1.BadRequest("Please provide all values"));
    const user = yield User_1.default.findOne({ email });
    if (user) {
        const currentDate = new Date();
        if (user.passwordToken === (0, createHash_1.hashString)(token) &&
            user.passwordTokenExpirationDate > currentDate) {
            user.password = password;
            user.passwordToken = null;
            user.passwordTokenExpirationDate = null;
            yield user.save();
        }
    }
    res.send("reset password");
});
exports.resetPassword = resetPassword;
