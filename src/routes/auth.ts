// Imports
import passport from "passport";
import { constants } from "@utils/constants";
import { newRow } from "@utils/sqlQueries";
import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import { hashPassword, resErrors, validateSignup } from "@utils/helpers";

// Constants
const router = Router();

// Sign In
router.post("/signin", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Signed in");
});

// Authenticated status
router.get("/authenticated", (req, res) => {
  return req.isAuthenticated()
    ? res.status(200).send(req.user)
    : res.status(401).send("Not authenticated");
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
  validateSignup(),
  async (req: Request, res: Response) => {
    const e = validationResult(req);
    if (!e.isEmpty()) return res.status(404).json({ errors: e.array() });
    try {
      const { email } = req.body;
      const password = hashPassword(req.body.password);
      const args = { table: constants.userTable, values: { email, password } };
      await newRow(args);
      res.status(201).send({ message: "Registered user" });
    } catch (err) {
      console.log(err);
      res.status(404).send(resErrors(["Error registering user"]));
    }
  }
);

export { router as authRoutes };
