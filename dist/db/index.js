"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbCreate = exports.dbQuery = exports.db = exports.sessionOptions = exports.options = void 0;
// Imports
require("dotenv").config();
const config_1 = __importDefault(require("@utils/config"));
const mysql2_1 = __importDefault(require("mysql2"));
// DB Options
exports.options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
};
// Options for mysql session table
exports.sessionOptions = Object.assign(Object.assign({}, exports.options), { createDatabaseTable: true, expiration: config_1.default.sessionLength, checkExpirationInterval: config_1.default.checkSessionInterval });
// Connect to db
const connection = mysql2_1.default.createConnection(exports.options);
exports.db = connection;
// Log connection status
connection.connect((err) => err
    ? console.log(`📦 ERROR connecting MySql: ${process.env.DB_NAME}`, err)
    : console.log(`📦 Connected to MySql: ${process.env.DB_NAME}`));
// Returns a promise to await from querying the database
const dbQuery = (sqlStatement) => connection.promise().query(sqlStatement);
exports.dbQuery = dbQuery;
// Returns a promise to await from creating a row in a table
const dbCreate = (sqlStatement) => connection.promise().query(sqlStatement);
exports.dbCreate = dbCreate;
