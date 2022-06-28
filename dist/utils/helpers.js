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
exports.authenticateSignupRequest = exports.comparePasswords = exports.authenticate = exports.hashPassword = exports.resErrors = void 0;
// Imports
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = require("../database/index");
const express_validator_1 = require("express-validator");
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
        res.status(401).send(resErrors(["Not logged in"]));
};
exports.authenticate = authenticate;
/**
 * Authenticate sign up POST request
 * Check for email length, if email already exists,
 * password length, passwords match
 */
const authenticateSignupRequest = () => [
    (0, express_validator_1.check)("email")
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isLength({ min: 3, max: 40 })
        .withMessage("Email must be 5 to 40 characters")
        // Search for existing user by email
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.body;
        const sqlStr = `select * from users where email = '${email}';`;
        const [rows] = yield index_1.db.promise().query(sqlStr);
        const dbUser = rows[0];
        if (dbUser)
            throw new Error("Email already in use");
        else
            return value;
    })),
    (0, express_validator_1.check)("password")
        .notEmpty()
        .withMessage("Password cannot be empty")
        .isLength({ min: 3, max: 20 })
        .withMessage("Password must be 5 to 30 characters"),
    (0, express_validator_1.check)("password2")
        .notEmpty()
        .withMessage("Password confirmation cannot be empty")
        .custom((value, { req }) => {
        if (value === req.body.password)
            return value;
        throw new Error("Passwords must match");
    }),
];
exports.authenticateSignupRequest = authenticateSignupRequest;
// Returns an error object with an array of error messages
const resErrors = (errors) => {
    return { errors: errors.map((e) => ({ msg: e })) };
};
exports.resErrors = resErrors;
