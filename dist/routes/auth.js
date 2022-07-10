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
const constants_1 = require("@utils/constants");
const sqlQueries_1 = require("@utils/sqlQueries");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const helpers_1 = require("@utils/helpers");
// Constants
const router = (0, express_1.Router)();
exports.authRoutes = router;
// Sign In
router.post("/signin", passport_1.default.authenticate("local"), (req, res) => {
    res.status(200).send("Signed in");
});
// Authenticated status
router.get("/authenticated", (req, res) => {
    return req.isAuthenticated()
        ? res.status(200).send(req.user)
        : res.status(401).send("Not authenticated");
});
// Sign Out
router.post("/signout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.logout((err) => {
        return err
            ? res.status(400).send(`Failed to sign out: ${err}`)
            : res.status(200).send("Successfully signed out");
    });
}));
// Register account with validated email & password
router.post("/register", (0, helpers_1.validateSignup)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const e = (0, express_validator_1.validationResult)(req);
    if (!e.isEmpty())
        return res.status(404).json({ errors: e.array() });
    try {
        const { email } = req.body;
        const password = (0, helpers_1.hashPassword)(req.body.password);
        const args = { table: constants_1.constants.userTable, values: { email, password } };
        yield (0, sqlQueries_1.newRow)(args);
        res.status(201).send({ message: "Registered user" });
    }
    catch (err) {
        console.log(err);
        res.status(404).send((0, helpers_1.resErrors)(["Error registering user"]));
    }
}));
