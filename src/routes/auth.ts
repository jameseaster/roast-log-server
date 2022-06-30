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

// Sign In
router.post("/signin", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Signed in");
});

// Authenticated status
router.get("/authenticated", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).send(req.user);
  } else {
    return res.status(401).send("Not authenticated");
  }
});

// Sign Out
router.post("/signout", async (req: any, res) => {
  req.logout((err: any) => {
    return err
      ? res.status(400).send(`Failed to sign out: ${err}`)
      : res.status(200).send("Successfully signed out");
  });
});

// Register account with validated email & password
router.post(
  "/register",
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
      res.status(201).send({ message: "Registered user" });
    } catch (err) {
      console.log(err);
      res.status(404).send(resErrors(["Error registering user"]));
    }
  }
);

export { router as authRoutes };
