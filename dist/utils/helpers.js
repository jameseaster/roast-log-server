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
exports.validateCreateRoast = exports.validateRoastNumber = exports.comparePasswords = exports.validateRoastId = exports.validateSignup = exports.authenticate = exports.hashPassword = exports.resErrors = void 0;
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
// Checks to see if user is authenticated
const authenticate = (req, res, next) => {
    if (req.isAuthenticated())
        next();
    else
        res.status(401).send(resErrors(["Not logged in"]));
};
exports.authenticate = authenticate;
/**
 * Validate sign up email & password values
 */
const validateSignup = () => [
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
exports.validateSignup = validateSignup;
/**
 * Validate create roast values
 */
const validateCreateRoast = () => [
    (0, express_validator_1.check)("roast_number")
        .notEmpty()
        .withMessage("roast_number cannot be empty")
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const { roast_number } = req.body;
        const sqlStr = `select * from roasts where user_email = '${req.user.email}' and roast_number = ${roast_number};`;
        const [rows] = yield index_1.db.promise().query(sqlStr);
        const prevRoast = rows[0];
        if (prevRoast)
            throw new Error("Roast number already recorded");
        else
            return value;
    })),
    (0, express_validator_1.check)("country").notEmpty().withMessage("Country cannot be empty"),
    (0, express_validator_1.check)("region").notEmpty().withMessage("Region cannot be empty"),
    (0, express_validator_1.check)("process").notEmpty().withMessage("Process cannot be empty"),
    (0, express_validator_1.check)("date").notEmpty().withMessage("Date cannot be empty"),
    (0, express_validator_1.check)("time").notEmpty().withMessage("Time cannot be empty"),
    (0, express_validator_1.check)("green_weight").notEmpty().withMessage("Green Weight cannot be empty"),
    (0, express_validator_1.check)("roasted_weight")
        .notEmpty()
        .withMessage("Roasted Weight cannot be empty"),
    (0, express_validator_1.check)("first_crack").notEmpty().withMessage("First Crack cannot be empty"),
    (0, express_validator_1.check)("cool_down").notEmpty().withMessage("Cool Down cannot be empty"),
    (0, express_validator_1.check)("vac_to_250").notEmpty().withMessage("Vac to 250 cannot be empty"),
];
exports.validateCreateRoast = validateCreateRoast;
/**
 * Validate roast_number value
 */
const validateRoastNumber = () => (0, express_validator_1.check)("roast_number").notEmpty().withMessage("Roast Number cannot be empty");
exports.validateRoastNumber = validateRoastNumber;
/**
 * Validate roast id value
 */
const validateRoastId = () => (0, express_validator_1.check)("id").notEmpty().withMessage("ID cannot be empty");
exports.validateRoastId = validateRoastId;
// Returns an error object with an array of error messages
const resErrors = (errors) => {
    return { errors: errors.map((e) => ({ message: e })) };
};
exports.resErrors = resErrors;
