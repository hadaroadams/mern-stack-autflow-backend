"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const errors_1 = require("../errors");
const checkPermission = (requestUser, resourcesUserId) => {
    console.log(requestUser);
    console.log(resourcesUserId);
    if (requestUser.role === "admin")
        return;
    if (requestUser.userId === resourcesUserId.toString()) {
        throw new errors_1.Unauthorized("Not authorized to access this route");
    }
};
exports.checkPermission = checkPermission;
