// Imports
require("dotenv").config();
import config from "@utils/config";
import { IResponseUser } from "@utils/types";
import mysql, { ResultSetHeader } from "mysql2";

// DB Options
export const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
};

// Options for mysql session table
export const sessionOptions = {
  ...options,
  createDatabaseTable: true,
  expiration: config.sessionLength,
  checkExpirationInterval: config.checkSessionInterval,
};

// Connect to db
const connection = mysql.createConnection(options);

// Log connection status
connection.connect((err) =>
  err
    ? console.log(`📦 ERROR connecting MySql: ${process.env.DB_NAME}`, err)
    : console.log(`📦 Connected to MySql: ${process.env.DB_NAME}`)
);

// Returns a promise to await from querying the database
const dbQuery = (sqlStatement: string) =>
  connection.promise().query<IResponseUser[]>(sqlStatement);

// Returns a promise to await from creating a row in a table
const dbCreate = (sqlStatement: string) =>
  connection.promise().query<ResultSetHeader>(sqlStatement);

export { connection as db, dbQuery, dbCreate };
