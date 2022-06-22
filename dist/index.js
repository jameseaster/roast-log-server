"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
require("dotenv").config();
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const express_1 = __importDefault(require("express"));
const helpers_1 = require("./utils/helpers");
// Routes
const auth_1 = require("./routes/auth");
const users_1 = require("./routes/users");
// Auth strategies
require("./strategies/local");
// Constants
const app = (0, express_1.default)();
const day = 86400000;
const port = process.env.SERVER_PORT;
const memoryStore = new express_session_1.default.MemoryStore();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_session_1.default)({
    resave: false,
    store: memoryStore,
    cookie: { maxAge: day },
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "secret",
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routes
app.use("/auth", auth_1.authRoutes);
// Protected Routes
app.use(helpers_1.authenticate);
app.use("/users", users_1.usersRoutes);
app.listen(port, () => {
    console.log(`🚀 Server running at https://localhost:${port}`);
});
