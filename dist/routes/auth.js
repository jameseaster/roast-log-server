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
exports.authRoutes = void 0;
// Imports
const passport_1 = __importDefault(require("passport"));
const index_1 = require("../database/index");
const express_1 = require("express");
const helpers_1 = require("../utils/helpers");
const express_validator_1 = require("express-validator");
// Constants
const router = (0, express_1.Router)();
exports.authRoutes = router;
// Login
router.post("/login", passport_1.default.authenticate("local"), (req, res) => {
    res.status(200).send("Logged in");
});
// Sign up
router.post("/signup", [
    (0, express_validator_1.check)("email")
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isLength({ min: 3 })
        .withMessage("Email must be at least 3 characters"),
    (0, express_validator_1.check)("password")
        .notEmpty()
        .withMessage("Password cannot be empty")
        .isLength({ min: 3 })
        .withMessage("Password must be at least 3 characters"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(404).json({ errors: errors.array() });
    }
    try {
        // Sign up
        const { email } = req.body;
        // Search for existing user by email
        const sqlStr = `select * from users where email = '${email}';`;
        const [rows] = yield index_1.db.promise().query(sqlStr);
        const dbUser = rows[0];
        if (dbUser) {
            res.status(400).send({ msg: "User already exists" });
        }
        else {
            const password = (0, helpers_1.hashPassword)(req.body.password);
            const sqlString = `insert into users(email, password) values('${email}', '${password}');`;
            yield index_1.db.promise().query(sqlString);
            res.status(201).send("Created user");
        }
    }
    catch (err) {
        console.log(err);
        res.status(404).send("Error creating user");
    }
}));
