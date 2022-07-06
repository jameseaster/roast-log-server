// Imports
import { db } from "../database";
import { RowDataPacket } from "mysql2";
import { sql } from "../utils/sqlStatements";
import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  resErrors,
  validateRoastId,
  validateRoastNumber,
  validateCreateRoast,
} from "../utils/helpers";

// Types FIXME: DUPLICATED
interface IResponseUser extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

// Constants
const router = Router();

// Get current user's roasts
router.get("/", async (req: Request, res: Response) => {
  try {
    const sqlStr = sql.getRoastsByUserEmail(req.user.email);
    const [rows] = await db.promise().query<IResponseUser[]>(sqlStr);
    res.status(200).send(rows);
  } catch (err) {
    res.status(400).send(resErrors(["Failed to get roasts"]));
  }
});

// Get all roasts
router.get("/all", async (req: Request, res: Response) => {
  try {
    const sqlString = sql.getAllRoasts();
    const result = await db.promise().query(sqlString);
    res.status(200).send(result[0]);
  } catch (err) {
    res.status(400).send(resErrors(["Failed to get roasts"]));
  }
});

// Create new roast
router.post("/", validateCreateRoast(), async (req: Request, res: Response) => {
  const e = validationResult(req);
  if (!e.isEmpty()) return res.status(404).json({ errors: e.array() });
  try {
    const sqlStr = sql.createRoast({ ...req.body, user_email: req.user.email });
    await db.promise().query(sqlStr);
    res.status(201).send("Created roast");
  } catch (err) {
    console.log(err);
    res.status(400).send(resErrors(["Failed to create roast"]));
  }
});

// Update existing roast by roast_number & user email
router.patch(
  "/",
  validateRoastNumber(),
  async (req: Request, res: Response) => {
    const e = validationResult(req);
    if (!e.isEmpty()) return res.status(404).json({ errors: e.array() });
    try {
      // Get roast that matches user & roast_number
      const { roast_number, ...rest } = req.body;
      const whereStr = ` where user_email = '${req.user.email}' and roast_number = ${req.body.roast_number}`;
      const sqlStr = "select * from roasts " + whereStr;
      let [result] = await db.promise().query<IResponseUser[]>(sqlStr);
      const roast = result[0];
      if (!roast) throw new Error("No roast exists");
      // Extract updated values that exist on roast object
      const updatedValues: any = {};
      Object.keys(rest).forEach((key) => {
        if (roast[key] !== undefined) updatedValues[key] = req.body[key];
      });
      // Update row
      const updateStr = sql.update("roasts", whereStr, updatedValues);
      await db.promise().query<IResponseUser[]>(updateStr);
      res.status(200).send("Successfully updated");
    } catch (err) {
      console.log(err);
      res.status(400).send(resErrors(["Failed to update roast"]));
    }
  }
);

// Delete roast by roast_number & user email
router.delete(
  "/",
  validateRoastNumber(),
  async (req: Request, res: Response) => {
    const e = validationResult(req);
    if (!e.isEmpty()) return res.status(404).json({ errors: e.array() });
    try {
      const { roast_number } = req.body;
      const whereStr = ` where user_email = '${req.user.email}' and roast_number = ${req.body.roast_number}`;
      const deleteSqlStr = "delete from roasts" + whereStr;
      await db.promise().query<IResponseUser[]>(deleteSqlStr);
      res.status(200).send("Successfully deleted roast");
    } catch (err) {
      res.status(400).send(resErrors(["Failed to delete roast"]));
    }
  }
);

// Delete roast by roast id
router.delete(
  "/by-id",
  validateRoastId(),
  async (req: Request, res: Response) => {
    const e = validationResult(req);
    if (!e.isEmpty()) return res.status(404).json({ errors: e.array() });
    try {
      const deleteSqlStr = `delete from roasts where id = '${req.body.id}'`;
      await db.promise().query<IResponseUser[]>(deleteSqlStr);
      res.status(200).send("Successfully deleted roast");
    } catch (err) {
      console.log(err);
      res.status(400).send(resErrors(["Failed to delete roast"]));
    }
  }
);

export { router as roastRoutes };
