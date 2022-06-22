// Imports
import bcrypt from "bcryptjs";
import { RequestHandler } from "express";

// Returns hashed password
function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

// Returns compares password with hash
function comparePasswords(raw: string, hash: string) {
  return bcrypt.compareSync(raw, hash);
}

// Checks for user object on request
const authenticate: RequestHandler = (req, res, next) => {
  if (req.user) next();
  else res.status(401).send("Not logged in");
};

export { hashPassword, comparePasswords, authenticate };
