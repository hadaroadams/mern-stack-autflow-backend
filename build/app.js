"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
require("express-async-errors");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnect_1 = require("./config/dbConnect");
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const notFound_1 = require("./middlewares/notFound");
const process_1 = require("process");
const authRoutes_1 = __importDefault(require("./routers/authRoutes"));
const userRoutes_1 = __importDefault(require("./routers/userRoutes"));
const productRoutes_1 = __importDefault(require("./routers/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routers/orderRoutes"));
(0, dbConnect_1.connectDB)();
const PORT = Number(process_1.env.PORT) || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
}));
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET_TOKEN));
app.use((0, express_fileupload_1.default)({ useTempFiles: true }));
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/users", userRoutes_1.default);
app.use("/api/v1/products", productRoutes_1.default);
app.use("/api/v1/orders", orderRoutes_1.default);
app.use(notFound_1.notFound);
app.use(errorHandler_1.default);
mongoose_1.default.connection.once("open", () => {
    console.log("connected to mongoDB");
    app.listen(PORT, () => {
        console.log(`server is runnning on port:${PORT}`);
    });
});
