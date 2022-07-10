// Imports
import { dbQuery } from "@db/index";
import { ICreateRoast } from "src/types";
import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import { newRow, selectAll, updateRow, deleteRow } from "@utils/sqlStatements";
import {
  resErrors,
  validateRoastId,
  validateCreateRoast,
  validateDeleteParam,
} from "@utils/helpers";
import { constants } from "@utils/constants";

// Constants
const router = Router();

// Get current user's roasts
router.get("/", async (req: Request, res: Response) => {
  try {
    const args = {
      table: constants.roastTable,
      order: ["date desc", "time"],
      where: { user_email: req.user.email },
    };
    const roastsByEmail = selectAll(args);
    const [rows] = await dbQuery(roastsByEmail);
    res.status(200).send(rows);
  } catch (err) {
    res.status(400).send(resErrors(["Failed to get roasts"]));
  }
});

// Get all roasts
router.get("/all", async (req: Request, res: Response) => {
  try {
    const args = { table: constants.roastTable, order: ["date desc", "time"] };
    const allRoasts = selectAll(args);
    const result = await dbQuery(allRoasts);
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
    const table = constants.roastTable;
    const values: ICreateRoast = { ...req.body, user_email: req.user.email };
    const newRoast = newRow({ table, values });
    await dbQuery(newRoast);
    res.status(201).send("Created roast");
  } catch (err) {
    console.log(err);
    res.status(400).send(resErrors(["Failed to create roast"]));
  }
});

// Update existing roast by id & user email
router.patch("/", validateRoastId(), async (req: Request, res: Response) => {
  const e = validationResult(req);
  if (!e.isEmpty()) return res.status(404).json({ errors: e.array() });
  try {
    // Get roast that matches user & roast id
    const { id, ...rest } = req.body;
    const user_email = req.user.email;
    const args = {
      table: constants.roastTable,
      order: ["date desc", "time"],
      where: { user_email, id },
    };
    const roastByEmailAndId = selectAll(args);
    let [result] = await dbQuery(roastByEmailAndId);
    const roast = result[0];
    if (!roast) throw new Error("No roast exists");
    // Extract updated values that exist on roast object
    const updatedValues: any = {};
    Object.keys(rest).forEach((key) => {
      if (roast[key] !== undefined) updatedValues[key] = req.body[key];
    });
    // Update row
    const updateArgs = {
      table: constants.roastTable,
      where: { user_email, id },
      values: updatedValues,
    };
    const updateStr = updateRow(updateArgs);
    await dbQuery(updateStr);
    res.status(200).send("Successfully updated");
  } catch (err) {
    console.log(err);
    res.status(400).send(resErrors(["Failed to update roast"]));
  }
});

// Delete roast by roast id
router.delete(
  "/:id",
  validateDeleteParam(),
  async (req: Request, res: Response) => {
    const e = validationResult(req);
    if (!e.isEmpty()) return res.status(404).json({ errors: e.array() });
    try {
      const args = {
        table: constants.roastTable,
        where: { user_email: req.user.email, id: req.params.id },
      };
      const deleteRoast = deleteRow(args);
      await dbQuery(deleteRoast);
      res.status(200).send("Successfully deleted roast");
    } catch (err) {
      console.log(err);
      res.status(400).send(resErrors(["Failed to delete roast"]));
    }
  }
);

export { router as roastRoutes };
