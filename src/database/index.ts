// Imports
require("dotenv").config();
import mysql from "mysql2";

// Connect to db
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

// Log connection status
connection.connect((err) =>
  err
    ? console.log(
        `📦 ERROR connecting db -> MySql: ${process.env.DB_NAME}`,
        err
      )
    : console.log(`📦 Database connected -> MySql: ${process.env.DB_NAME}`)
);

export { connection as db };
