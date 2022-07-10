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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
// Imports
const index_1 = require("@db/index");
const sqlStatements_1 = require("@utils/sqlStatements");
const helpers_1 = require("@utils/helpers");
const express_1 = require("express");
// Constants
const router = (0, express_1.Router)();
exports.usersRoutes = router;
// All users
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sqlString = sqlStatements_1.sql.getAllUsers();
        const result = yield index_1.db.promise().query(sqlString);
        res.status(200).send(result[0]);
    }
    catch (err) {
        console.log(err);
        res.status(400).send((0, helpers_1.resErrors)(["Failed to get all users"]));
    }
}));
// All user emails
router.get("/emails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sqlString = sqlStatements_1.sql.getAllEmails();
        const result = yield index_1.db.promise().query(sqlString);
        res.status(200).send(result[0]);
    }
    catch (err) {
        console.log(err);
        res.status(400).send((0, helpers_1.resErrors)(["Failed to get user emails"]));
    }
}));
