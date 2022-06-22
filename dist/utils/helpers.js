"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.comparePasswords = exports.hashPassword = void 0;
// Imports
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Returns hashed password
function hashPassword(password) {
    const salt = bcryptjs_1.default.genSaltSync(10);
    const hash = bcryptjs_1.default.hashSync(password, salt);
    return hash;
}
exports.hashPassword = hashPassword;
// Returns compares password with hash
function comparePasswords(raw, hash) {
    return bcryptjs_1.default.compareSync(raw, hash);
}
exports.comparePasswords = comparePasswords;
// Checks for user object on request
const authenticate = (req, res, next) => {
    if (req.user)
        next();
    else
        res.status(401).send("Not logged in");
};
exports.authenticate = authenticate;
