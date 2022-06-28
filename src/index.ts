// Imports
import cors from "cors";
require("dotenv").config();
import passport from "passport";
import mysql2 from "mysql2/promise";
import session from "express-session";
import express, { Express } from "express";
import { authenticate } from "./utils/helpers";
import { options, sessionOptions } from "./database";

// Routes
import { authRoutes } from "./routes/auth";
import { testRoutes } from "./routes/test";
import { usersRoutes } from "./routes/users";
import config from "./utils/config";

// Auth strategies
require("./strategies/local");

// Constants
const app: Express = express();
const port = process.env.APP_PORT;
const IN_PROD = process.env.NODE_ENV === "production";

// Session store
const connection = mysql2.createPool(options);
const MySQLStore = require("express-mysql-session")(session);
const sessionStore = new MySQLStore(sessionOptions, connection);

// Middleware
app.use(cors({ origin: process.env.WHITE_LIST_URLS?.split(" ") }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    name: process.env.SESSION_NAME,
    cookie: {
      secure: IN_PROD,
      maxAge: Number(config.sessionLength),
    },
    secret: process.env.SESSION_SECRET || "secret",
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  console.log("[express-session]: ", req.session);
  console.log("[PASSPORT]: ", req.user);
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/test", testRoutes);

// Protected Routes
app.use(authenticate);
app.use("/users", usersRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running at https://localhost:${port}`);
});
