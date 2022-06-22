"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// Imports
require("dotenv").config();
const mysql2_1 = __importDefault(require("mysql2"));
// Connect to db
const connection = mysql2_1.default.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});
exports.db = connection;
// Log connection status
connection.connect((err) => err
    ? console.log(`📦 ERROR connecting db -> MySql: ${process.env.DB_NAME}`, err)
    : console.log(`📦 Database connected -> MySql: ${process.env.DB_NAME}`));
