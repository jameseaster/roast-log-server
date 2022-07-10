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
const sqlStatements_1 = require("@utils/sqlStatements");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const helpers_1 = require("@utils/helpers");
// Constants
const router = (0, express_1.Router)();
exports.roastRoutes = router;
// Get current user's roasts
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sqlStr = sqlStatements_1.sql.getRoastsByUserEmail(req.user.email);
        const [rows] = yield index_1.db.promise().query(sqlStr);
        res.status(200).send(rows);
    }
    catch (err) {
        res.status(400).send((0, helpers_1.resErrors)(["Failed to get roasts"]));
    }
}));
// Get all roasts
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sqlString = sqlStatements_1.sql.getAllRoasts();
        const result = yield index_1.db.promise().query(sqlString);
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
        const sqlStr = sqlStatements_1.sql.createRoast(Object.assign(Object.assign({}, req.body), { user_email: req.user.email }));
        yield index_1.db.promise().query(sqlStr);
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
        const whereStr = ` where user_email = '${req.user.email}' and id = ${id}`;
        const sqlStr = "select * from roasts " + whereStr;
        let [result] = yield index_1.db.promise().query(sqlStr);
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
        const updateStr = sqlStatements_1.sql.update("roasts", whereStr, updatedValues);
        yield index_1.db.promise().query(updateStr);
        res.status(200).send("Successfully updated");
    }
    catch (err) {
        console.log(err);
        res.status(400).send((0, helpers_1.resErrors)(["Failed to update roast"]));
    }
}));
// Delete roast by id & user email
router.delete("/", (0, helpers_1.validateRoastId)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const e = (0, express_validator_1.validationResult)(req);
    if (!e.isEmpty())
        return res.status(404).json({ errors: e.array() });
    try {
        const whereStr = ` where user_email = '${req.user.email}' and id = ${req.body.id}`;
        const deleteSqlStr = "delete from roasts" + whereStr;
        yield index_1.db.promise().query(deleteSqlStr);
        res.status(200).send("Successfully deleted roast");
    }
    catch (err) {
        res.status(400).send((0, helpers_1.resErrors)(["Failed to delete roast"]));
    }
}));
// Delete roast by roast id
router.delete("/:id", (0, helpers_1.validateDeleteParam)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const e = (0, express_validator_1.validationResult)(req);
    if (!e.isEmpty())
        return res.status(404).json({ errors: e.array() });
    try {
        const deleteSqlStr = `delete from roasts where user_email = '${req.user.email}' and id = '${req.params.id}'`;
        yield index_1.db.promise().query(deleteSqlStr);
        res.status(200).send("Successfully deleted roast");
    }
    catch (err) {
        console.log(err);
        res.status(400).send((0, helpers_1.resErrors)(["Failed to delete roast"]));
    }
}));
