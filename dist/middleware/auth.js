"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(401).send("You are not authorized for this resource");
    }
};
const isAdmin = (req, res, next) => { };
exports.default = { isAuth, isAdmin };
