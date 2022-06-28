// Imports
import passport from "passport";
import { db } from "../database/index";
import { sql } from "../utils/sqlStatements";
import { hashPassword, resErrors } from "../utils/helpers";
import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import { authenticateSignupRequest } from "../utils/helpers";

// Constants
const router = Router();

// Login
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Logged in");
});

// Sign up with validated email & password
router.post(
  "/signup",
  authenticateSignupRequest(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    try {
      const { email } = req.body;
      const password = hashPassword(req.body.password);
      const sqlString = sql.addUser(email, password);
      await db.promise().query(sqlString);
      res.status(201).send({ msg: "Created user" });
    } catch (err) {
      console.log(err);
      res.status(404).send(resErrors(["Error creating user"]));
    }
  }
);

export { router as authRoutes };
