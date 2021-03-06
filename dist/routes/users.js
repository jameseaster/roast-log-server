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
const helpers_1 = require("@utils/helpers");
const constants_1 = require("@utils/constants");
const sqlQueries_1 = require("@utils/sqlQueries");
const express_1 = require("express");
// Constants
const router = (0, express_1.Router)();
exports.usersRoutes = router;
// All users
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const args = { table: constants_1.constants.userTable };
        const result = yield (0, sqlQueries_1.selectAll)(args);
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
        const args = { table: constants_1.constants.userTable, column: "email" };
        const result = yield (0, sqlQueries_1.selectAll)(args);
        res.status(200).send(result[0]);
    }
    catch (err) {
        console.log(err);
        res.status(400).send((0, helpers_1.resErrors)(["Failed to get user emails"]));
    }
}));
