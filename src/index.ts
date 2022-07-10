// Imports
import cors from "cors";
require("dotenv").config();
import "module-alias/register";
import passport from "passport";
import mysql2 from "mysql2/promise";
import session from "express-session";
import express, { Express } from "express";
import { authenticate } from "@utils/helpers";
import { options, sessionOptions } from "@db/index";

// Routes
import config from "@utils/config";
import { authRoutes } from "@routes/auth";
import { usersRoutes } from "@routes/users";
import { roastRoutes } from "@routes/roasts";

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
app.use(
  cors({
    credentials: true,
    origin: process.env.WHITE_LIST_URLS?.split(" "),
  })
);
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
  // console.log(`${req.method}: ${req.url}`);
  // console.log("[express-session]: ", req.session);
  // console.log("IS AUTH", req.isAuthenticated());
  next();
});

// Routes
app.use("/API/auth", authRoutes);

// Protected Routes
app.use(authenticate);
app.use("/API/users", usersRoutes);
app.use("/API/roasts", roastRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running at https://localhost:${port}`);
});
