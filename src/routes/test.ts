// Imports
import { db } from "../database";
import { resErrors } from "../utils/helpers";
import { sql } from "../utils/sqlStatements";
import { Router, Request, Response } from "express";

// Constants
const router = Router();

// Routes
router.get("/sessions", async (req: Request, res: Response) => {
  try {
    const sqlString = sql.getSessionInfo();
    const result = await db.promise().query(sqlString);
    res.status(200).send(result[0]);
  } catch (err) {
    res.status(400).send(resErrors(["Failed to get sessions"]));
  }
});

export { router as testRoutes };
