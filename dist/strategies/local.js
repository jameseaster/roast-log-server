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
// Imports
const database_1 = require("../database");
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const helpers_1 = require("../utils/helpers");
passport_1.default.serializeUser((req, user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = user;
        // Get user by email
        const sqlStr = `select * from users where email = '${email}';`;
        const [rows] = yield database_1.db.promise().query(sqlStr);
        const dbUser = rows[0];
        if (!dbUser)
            done(new Error("User not found"), false);
        done(null, dbUser /* This is what will be stored on the req.user object */);
    }
    catch (err) {
        done(err, false);
    }
}));
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email" }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for email & password
        if (!email || !password)
            done(new Error("Missing credentials"), null);
        const sqlStr = `select * from users where email = '${email}';`;
        const [rows] = yield database_1.db.promise().query(sqlStr);
        const dbUser = rows[0];
        // If user is not found
        if (!dbUser)
            done(new Error("User not found"), null);
        // Check password hashes
        const isValid = (0, helpers_1.comparePasswords)(password, dbUser.password);
        if (isValid)
            done(null, dbUser);
        else
            done(new Error("Incorrect credentials"), null);
    }
    catch (err) {
        done(err, null);
    }
})));
