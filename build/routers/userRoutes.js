"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentiction_1 = require("../middlewares/authentiction");
const userController_1 = require("../controllers/userController");
const Routes = express_1.default.Router();
Routes.get("/", authentiction_1.authenticateUser, (0, authentiction_1.authorizePermissions)("admin", "user"), userController_1.getAllUsers);
Routes.get("/showMe", authentiction_1.authenticateUser, userController_1.showCurrentUser);
Routes.patch("updateUser", authentiction_1.authenticateUser, userController_1.updateUser);
Routes.patch("updateUserPassword", authentiction_1.authenticateUser, userController_1.updateUserPassword);
Routes.get("/:id", authentiction_1.authenticateUser, userController_1.getSingleUser);
exports.default = Routes;
