// Imports
require("dotenv").config();
import mysql from "mysql2";
import config from "@utils/config";

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

export { connection as db };
