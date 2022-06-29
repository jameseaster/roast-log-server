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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const passport_1 = __importDefault(require("passport"));
const database_1 = require("../database");
const passport_local_1 = require("passport-local");
const sqlStatements_1 = require("../utils/sqlStatements");
const helpers_1 = require("../utils/helpers");
// Use these fields from database
const customFields = {
    usernameField: "email",
    passwordField: "password",
};
// Used to verify the user
const verifyCallback = (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for email & password
        if (!email || !password) {
            return done(null, false, { message: "Missing credentials" });
        }
        // Check for exisiting user
        const sqlStr = sqlStatements_1.sql.getUserByEmail(email);
        const [rows] = yield database_1.db.promise().query(sqlStr);
        const dbUser = rows[0];
        // If user is not found
        if (!dbUser) {
            return done(null, false, { message: "User not found" });
        }
        // Check password hashes
        const isValid = (0, helpers_1.comparePasswords)(password, dbUser.password);
        return isValid
            ? done(null, dbUser)
            : done(null, false, { message: "Incorrect credentials" });
    }
    catch (err) {
        done(err);
    }
});
// Serialize user
passport_1.default.serializeUser((req, user, done) => {
    done(null, user.email);
});
// Deserialize user
passport_1.default.deserializeUser((email, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get user by email
        const sqlStr = sqlStatements_1.sql.getUserByEmail(email);
        const [rows] = yield database_1.db.promise().query(sqlStr);
        const dbUser = rows[0];
        const { password: _ } = dbUser, rest = __rest(dbUser, ["password"]);
        return !dbUser ? done(null, false) : done(null, rest);
    }
    catch (err) {
        done(err);
    }
}));
// Local strategy
const strategy = new passport_local_1.Strategy(customFields, verifyCallback);
// Passport middleware
passport_1.default.use(strategy);
