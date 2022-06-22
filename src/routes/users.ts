// Imports
import { db } from "../database";
import { Router, Request, Response } from "express";

// Constants
const router = Router();

// Routes
router.get("/emails", async (req: Request, res: Response) => {
  try {
    const sqlString = "select email from users;";
    const result = await db.promise().query(sqlString);
    res.status(200).send(result[0]);
  } catch (err) {
    res.status(400).send("Failed to get users");
  }
});

export { router as usersRoutes };
