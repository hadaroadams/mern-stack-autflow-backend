"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashString = void 0;
const { createHash } = require("crypto");
const hashString = (string) => createHash("md5").update(string).digest("hex");
exports.hashString = hashString;
