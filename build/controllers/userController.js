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
exports.showCurrentUser = exports.updateUserPassword = exports.updateUser = exports.getSingleUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const util_1 = require("../util");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user);
    const users = yield User_1.default.find({ role: "user" }).select("-password");
    res.status(http_status_codes_1.StatusCodes.OK).json({ users });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ _id: req.params.id }).select("-password");
    if (!user)
        throw new errors_1.NotFound(`No user with id:${req.params.id}`);
    (0, util_1.checkPermission)(req.user, user._id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.getSingleUser = getSingleUser;
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: req.user });
});
exports.showCurrentUser = showCurrentUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, name } = req.body;
    if (!email || !name) {
        throw new errors_1.BadRequest("Please provide email and name");
    }
    const user = yield User_1.default.findOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
    if (!user)
        throw new errors_1.NotFound("User not found");
    user.email = email;
    user.name = name;
    yield user.save();
    const tokenUser = (0, util_1.createTokenUser)(user);
    (0, util_1.attachCookiesToResponse)({ res, user: tokenUser });
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
        throw new errors_1.BadRequest("please provide old and new password");
    const user = yield User_1.default.findOne({ _id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId });
    const isPasswordCorrect = yield (user === null || user === void 0 ? void 0 : user.comparePassword(oldPassword));
    if (!isPasswordCorrect)
        throw new errors_1.Unauthenticated("Invalid credentials");
    user.password = newPassword;
    yield (user === null || user === void 0 ? void 0 : user.save());
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "success! Password Updated" });
});
exports.updateUserPassword = updateUserPassword;
