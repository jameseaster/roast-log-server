"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Time in milliseconds
const sessionLength = 1000 * 60 * 1;
exports.default = {
    sessionLength,
    checkSessionInterval: sessionLength + 10,
};
