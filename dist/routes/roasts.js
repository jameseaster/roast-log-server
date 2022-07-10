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
Object.defineProperty(exports, "__esModule", { value: true });
exports.roastRoutes = void 0;
// Imports
const index_1 = require("@db/index");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const sqlStatements_1 = require("@utils/sqlStatements");
const helpers_1 = require("@utils/helpers");
const constants_1 = require("@utils/constants");
// Constants
const router = (0, express_1.Router)();
exports.roastRoutes = router;
// Get current user's roasts
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const args = {
            table: constants_1.constants.roastTable,
            order: ["date desc", "time"],
            where: { user_email: req.user.email },
        };
        const roastsByEmail = (0, sqlStatements_1.selectAll)(args);
        const [rows] = yield (0, index_1.dbQuery)(roastsByEmail);
        res.status(200).send(rows);
    }
    catch (err) {
        res.status(400).send((0, helpers_1.resErrors)(["Failed to get roasts"]));
    }
}));
// Get all roasts
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const args = { table: constants_1.constants.roastTable, order: ["date desc", "time"] };
        const allRoasts = (0, sqlStatements_1.selectAll)(args);
        const result = yield (0, index_1.dbQuery)(allRoasts);
        res.status(200).send(result[0]);
    }
    catch (err) {
        res.status(400).send((0, helpers_1.resErrors)(["Failed to get roasts"]));
    }
}));
// Create new roast
router.post("/", (0, helpers_1.validateCreateRoast)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const e = (0, express_validator_1.validationResult)(req);
    if (!e.isEmpty())
        return res.status(404).json({ errors: e.array() });
    try {
        const table = constants_1.constants.roastTable;
        const values = Object.assign(Object.assign({}, req.body), { user_email: req.user.email });
        const newRoast = (0, sqlStatements_1.newRow)({ table, values });
        yield (0, index_1.dbQuery)(newRoast);
        res.status(201).send("Created roast");
    }
    catch (err) {
        console.log(err);
        res.status(400).send((0, helpers_1.resErrors)(["Failed to create roast"]));
    }
}));
// Update existing roast by id & user email
router.patch("/", (0, helpers_1.validateRoastId)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const e = (0, express_validator_1.validationResult)(req);
    if (!e.isEmpty())
        return res.status(404).json({ errors: e.array() });
    try {
        // Get roast that matches user & roast id
        const _a = req.body, { id } = _a, rest = __rest(_a, ["id"]);
        const user_email = req.user.email;
        const args = {
            table: constants_1.constants.roastTable,
            order: ["date desc", "time"],
            where: { user_email, id },
        };
        const roastByEmailAndId = (0, sqlStatements_1.selectAll)(args);
        let [result] = yield (0, index_1.dbQuery)(roastByEmailAndId);
        const roast = result[0];
        if (!roast)
            throw new Error("No roast exists");
        // Extract updated values that exist on roast object
        const updatedValues = {};
        Object.keys(rest).forEach((key) => {
            if (roast[key] !== undefined)
                updatedValues[key] = req.body[key];
        });
        // Update row
        const updateArgs = {
            table: constants_1.constants.roastTable,
            where: { user_email, id },
            values: updatedValues,
        };
        const updateStr = (0, sqlStatements_1.updateRow)(updateArgs);
        yield (0, index_1.dbQuery)(updateStr);
        res.status(200).send("Successfully updated");
    }
    catch (err) {
        console.log(err);
        res.status(400).send((0, helpers_1.resErrors)(["Failed to update roast"]));
    }
}));
// Delete roast by roast id
router.delete("/:id", (0, helpers_1.validateDeleteParam)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const e = (0, express_validator_1.validationResult)(req);
    if (!e.isEmpty())
        return res.status(404).json({ errors: e.array() });
    try {
        const args = {
            table: constants_1.constants.roastTable,
            where: { user_email: req.user.email, id: req.params.id },
        };
        const deleteRoast = (0, sqlStatements_1.deleteRow)(args);
        yield (0, index_1.dbQuery)(deleteRoast);
        res.status(200).send("Successfully deleted roast");
    }
    catch (err) {
        console.log(err);
        res.status(400).send((0, helpers_1.resErrors)(["Failed to delete roast"]));
    }
}));
