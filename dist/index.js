"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const passport_1 = __importDefault(require("passport"));
const promise_1 = __importDefault(require("mysql2/promise"));
const express_session_1 = __importDefault(require("express-session"));
const express_1 = __importDefault(require("express"));
const helpers_1 = require("./utils/helpers");
const database_1 = require("./database");
// Routes
const auth_1 = require("./routes/auth");
const users_1 = require("./routes/users");
const config_1 = __importDefault(require("./utils/config"));
// Auth strategies
require("./strategies/local");
// Constants
const app = (0, express_1.default)();
const port = process.env.APP_PORT;
const IN_PROD = process.env.NODE_ENV === "production";
// Session store
const connection = promise_1.default.createPool(database_1.options);
const MySQLStore = require("express-mysql-session")(express_session_1.default);
const sessionStore = new MySQLStore(database_1.sessionOptions, connection);
// Middleware
app.use((0, cors_1.default)({
    credentials: true,
    origin: (_a = process.env.WHITE_LIST_URLS) === null || _a === void 0 ? void 0 : _a.split(" "),
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_session_1.default)({
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    name: process.env.SESSION_NAME,
    cookie: {
        secure: IN_PROD,
        maxAge: Number(config_1.default.sessionLength),
    },
    secret: process.env.SESSION_SECRET || "secret",
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Logging middleware
app.use((req, res, next) => {
    // console.log(`${req.method}: ${req.url}`);
    // console.log("[express-session]: ", req.session);
    // console.log("IS AUTH", req.isAuthenticated());
    next();
});
// Routes
app.use("/API/auth", auth_1.authRoutes);
// Protected Routes
app.use(helpers_1.authenticate);
app.use("/API/users", users_1.usersRoutes);
app.listen(port, () => {
    console.log(`🚀 Server running at https://localhost:${port}`);
});
