// Imports
import passport from "passport";
import { RowDataPacket } from "mysql2";
import { db } from "../database/index";
import { Router, Request, Response } from "express";
import { hashPassword } from "../utils/helpers";
import { check, validationResult } from "express-validator";

// Types
interface IResponseUser extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

// Constants
const router = Router();

// Login
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Logged in");
});

// Sign up
router.post(
  "/signup",
  [
    check("email")
      .notEmpty()
      .withMessage("Email cannot be empty")
      .isLength({ min: 3 })
      .withMessage("Email must be at least 3 characters"),
    check("password")
      .notEmpty()
      .withMessage("Password cannot be empty")
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 characters"),
  ],

  async (req: Request, res: Response) => {
    // Validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(404).json({ errors: errors.array() });
    }
    try {
      // Sign up
      const { email } = req.body;
      // Search for existing user by email
      const sqlStr = `select * from users where email = '${email}';`;
      const [rows] = await db.promise().query<IResponseUser[]>(sqlStr);
      const dbUser = rows[0];
      if (dbUser) {
        res.status(400).send({ msg: "User already exists" });
      } else {
        const password = hashPassword(req.body.password);
        const sqlString = `insert into users(email, password) values('${email}', '${password}');`;
        await db.promise().query(sqlString);
        res.status(201).send("Created user");
      }
    } catch (err) {
      console.log(err);
      res.status(404).send("Error creating user");
    }
  }
);

export { router as authRoutes };
