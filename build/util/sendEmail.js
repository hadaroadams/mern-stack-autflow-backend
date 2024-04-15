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
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailerConfig_1 = __importDefault(require("../config/nodemailerConfig"));
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, html }) {
    let testAcount = yield nodemailer_1.default.createTestAccount();
    const transporter = nodemailer_1.default.createTransport(nodemailerConfig_1.default);
    return transporter.sendMail({
        from: '"Hadaro Adams" <hadaroadams1234@gmail.com',
        to,
        subject,
        html,
    });
});
exports.default = sendEmail;
