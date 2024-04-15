"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = exports.sendVerificationEmail = exports.sendEmail = exports.createTokenUser = exports.isTokenValid = exports.createJWT = exports.attachCookiesToResponse = void 0;
const jwt_1 = require("./jwt");
Object.defineProperty(exports, "attachCookiesToResponse", { enumerable: true, get: function () { return jwt_1.attachCookiesToResponse; } });
Object.defineProperty(exports, "createJWT", { enumerable: true, get: function () { return jwt_1.createJWT; } });
Object.defineProperty(exports, "isTokenValid", { enumerable: true, get: function () { return jwt_1.isTokenValid; } });
const createTokenUser_1 = require("./createTokenUser");
Object.defineProperty(exports, "createTokenUser", { enumerable: true, get: function () { return createTokenUser_1.createTokenUser; } });
const sendVerifiactionEmail_1 = require("./sendVerifiactionEmail");
Object.defineProperty(exports, "sendVerificationEmail", { enumerable: true, get: function () { return sendVerifiactionEmail_1.sendVerificationEmail; } });
const sendEmail_1 = __importDefault(require("./sendEmail"));
exports.sendEmail = sendEmail_1.default;
const checkPermissions_1 = require("./checkPermissions");
Object.defineProperty(exports, "checkPermission", { enumerable: true, get: function () { return checkPermissions_1.checkPermission; } });
