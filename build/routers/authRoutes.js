"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("./../controllers/authController");
const authentiction_1 = require("../middlewares/authentiction");
const Route = express_1.default.Router();
Route.post("/register", authController_1.register);
Route.post("/login", authController_1.login);
Route.post("/verify-email", authController_1.verifyEmail);
Route.delete("/logout", authentiction_1.authenticateUser, authController_1.logout);
Route.post("/reset-password", authController_1.resetPassword);
Route.post("/forgot-password", authController_1.forgottenPassword);
exports.default = Route;
