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

// Checks to see if user is authenticated
const authenticate: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.status(401).send(resErrors(["Not logged in"]));
};

/**
 * Validate sign up email & password values
 */
const validateSignup = () => [
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

/**
 * Validate create roast values
 */
const validateCreateRoast = () => [
  check("roast_number")
    .notEmpty()
    .withMessage("roast_number cannot be empty")
    .custom(async (value, { req }) => {
      const { roast_number } = req.body;
      const sqlStr = `select * from roasts where user_email = '${req.user.email}' and roast_number = ${roast_number};`;
      const [rows] = await db.promise().query<IResponseUser[]>(sqlStr);
      const prevRoast = rows[0];
      if (prevRoast) throw new Error("Roast number already recorded");
      else return value;
    }),
  check("coffee_origin")
    .notEmpty()
    .withMessage("Coffee Origin cannot be empty"),
  check("date").notEmpty().withMessage("Date cannot be empty"),
  check("time").notEmpty().withMessage("Time cannot be empty"),
  check("green_weight").notEmpty().withMessage("Green Weight cannot be empty"),
  check("roasted_weight")
    .notEmpty()
    .withMessage("Roasted Weight cannot be empty"),
  check("percentage_loss")
    .notEmpty()
    .withMessage("Percentage Loss cannot be empty"),
  check("first_crack").notEmpty().withMessage("First Crack cannot be empty"),
  check("cool_down").notEmpty().withMessage("Cool Down cannot be empty"),
  check("vac_to_250").notEmpty().withMessage("Vac to 250 cannot be empty"),
];

/**
 * Validate roast_number value
 */
const validateRoastNumber = () =>
  check("roast_number").notEmpty().withMessage("Roast Number cannot be empty");

/**
 * Validate roast id value
 */
const validateRoastId = () =>
  check("id").notEmpty().withMessage("ID cannot be empty");

// Returns an error object with an array of error messages
const resErrors = (errors: string[]) => {
  return { errors: errors.map((e) => ({ message: e })) };
};

export {
  resErrors,
  hashPassword,
  authenticate,
  validateSignup,
  validateRoastId,
  comparePasswords,
  validateRoastNumber,
  validateCreateRoast,
};
