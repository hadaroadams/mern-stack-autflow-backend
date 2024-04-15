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
exports.sendResendPasswordEmail = void 0;
const sendEmail_1 = __importDefault(require("./sendEmail"));
const sendResendPasswordEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, token, origin, }) {
    const resetUrl = `${origin}/api/v1/auth/reset-password?token=${token}&email=${email}`;
    const message = `<p>Please reset your password by clicking on the following link <a href='${resetUrl}'>Reset Password</a></p>`;
    return (0, sendEmail_1.default)({
        to: email,
        subject: "Reset Password",
        html: `<h4>Hello, ${name}</h4> ${message}`,
    });
});
exports.sendResendPasswordEmail = sendResendPasswordEmail;
