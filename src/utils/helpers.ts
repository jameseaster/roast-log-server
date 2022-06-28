// Imports
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { db } from "../database/index";
import { RequestHandler } from "express";
import { check } from "express-validator";

// Types
interface IResponseUser extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

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
  else res.status(401).send(resErrors(["Not logged in"]));
};

/**
 * Authenticate sign up POST request
 * Check for email length, if email already exists,
 * password length, passwords match
 */
const authenticateSignupRequest = () => [
  check("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isLength({ min: 3, max: 40 })
    .withMessage("Email must be 5 to 40 characters")
    // Search for existing user by email
    .custom(async (value, { req }) => {
      const { email } = req.body;
      const sqlStr = `select * from users where email = '${email}';`;
      const [rows] = await db.promise().query<IResponseUser[]>(sqlStr);
      const dbUser = rows[0];
      if (dbUser) throw new Error("Email already in use");
      else return value;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 3, max: 20 })
    .withMessage("Password must be 5 to 30 characters"),
  check("password2")
    .notEmpty()
    .withMessage("Password confirmation cannot be empty")
    .custom((value, { req }) => {
      if (value === req.body.password) return value;
      throw new Error("Passwords must match");
    }),
];

// Returns an error object with an array of error messages
const resErrors = (errors: string[]) => {
  return { errors: errors.map((e) => ({ msg: e })) };
};

export {
  resErrors,
  hashPassword,
  authenticate,
  comparePasswords,
  authenticateSignupRequest,
};
