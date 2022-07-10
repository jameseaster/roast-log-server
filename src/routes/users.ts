// Imports
import { dbQuery } from "@db/index";
import { resErrors } from "@utils/helpers";
import { constants } from "@utils/constants";
import { selectAll } from "@utils/sqlStatements";
import { Router, Request, Response } from "express";

// Constants
const router = Router();

// All users
router.get("/", async (req: Request, res: Response) => {
  try {
    const args = { table: constants.userTable };
    const sqlString = selectAll(args);
    const result = await dbQuery(sqlString);
    res.status(200).send(result[0]);
  } catch (err) {
    console.log(err);
    res.status(400).send(resErrors(["Failed to get all users"]));
  }
});

// All user emails
router.get("/emails", async (req: Request, res: Response) => {
  try {
    const args = { table: constants.userTable, column: "email" };
    const allUserEmails = selectAll(args);
    const result = await dbQuery(allUserEmails);
    res.status(200).send(result[0]);
  } catch (err) {
    console.log(err);
    res.status(400).send(resErrors(["Failed to get user emails"]));
  }
});

export { router as usersRoutes };
