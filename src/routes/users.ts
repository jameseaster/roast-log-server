// Imports
import { db } from "@db/index";
import { sql } from "@utils/sqlStatements";
import { resErrors } from "@utils/helpers";
import { Router, Request, Response } from "express";

// Constants
const router = Router();

// All users
router.get("/", async (req: Request, res: Response) => {
  try {
    const sqlString = sql.getAllUsers();
    const result = await db.promise().query(sqlString);
    res.status(200).send(result[0]);
  } catch (err) {
    console.log(err);
    res.status(400).send(resErrors(["Failed to get all users"]));
  }
});

// All user emails
router.get("/emails", async (req: Request, res: Response) => {
  try {
    const sqlString = sql.getAllEmails();
    const result = await db.promise().query(sqlString);
    res.status(200).send(result[0]);
  } catch (err) {
    console.log(err);
    res.status(400).send(resErrors(["Failed to get user emails"]));
  }
});

export { router as usersRoutes };
