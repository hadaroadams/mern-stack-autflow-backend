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
const process_1 = require("process");
const dbConnect_1 = require("./config/dbConnect");
const orders_json_1 = __importDefault(require("./mockData/orders.json"));
const Order_1 = __importDefault(require("./models/Order"));
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, dbConnect_1.connectDB)();
        let mitOrder = [];
        for (const item of orders_json_1.default) {
            item.user = new mongoose_1.Types.ObjectId("661c6666a41d2b93259dbeac");
            mitOrder = [...mitOrder, item];
        }
        yield Order_1.default.create(orders_json_1.default);
        console.log("success!!!");
        (0, process_1.exit)(0);
    }
    catch (erro) {
        console.log(erro);
        (0, process_1.exit)(1);
    }
});
start();
