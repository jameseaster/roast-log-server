// Imports
import passport from "passport";
import { db } from "../database/index";
import { sql } from "../utils/sqlStatements";
import { hashPassword, resErrors } from "../utils/helpers";
import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import { authenticateSignupParams } from "../utils/helpers";

// Constants
const router = Router();

// Login
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Logged in");
});

// Logged in status
router.get("/loggedin", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).send(req.user);
  } else {
    return res.status(401).send("Not logged in");
  }
});

// Logout
router.post("/logout", async (req: any, res) => {
  req.logout((err: any) => {
    return err
      ? res.status(400).send(`Failed to logout: ${err}`)
      : res.status(200).send("Successfully logged out");
  });
});

// Sign up with validated email & password
router.post(
  "/signup",
  authenticateSignupParams(),
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
      res.status(201).send({ message: "Created user" });
    } catch (err) {
      console.log(err);
      res.status(404).send(resErrors(["Error creating user"]));
    }
  }
);

export { router as authRoutes };
