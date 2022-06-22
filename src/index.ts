// Imports
require("dotenv").config();
import passport from "passport";
import session from "express-session";
import express, { Express } from "express";
import { authenticate } from "./utils/helpers";

// Routes
import { authRoutes } from "./routes/auth";
import { usersRoutes } from "./routes/users";

// Auth strategies
require("./strategies/local");

// Constants
const app: Express = express();
const day = 86_400_000;
const port = process.env.SERVER_PORT;
const memoryStore = new session.MemoryStore();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    resave: false,
    store: memoryStore,
    cookie: { maxAge: day },
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "secret",
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);

// Protected Routes
app.use(authenticate);
app.use("/users", usersRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running at https://localhost:${port}`);
});
