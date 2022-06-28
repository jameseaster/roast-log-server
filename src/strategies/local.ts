// Imports
import passport from "passport";
import { db } from "../database";
import { RowDataPacket } from "mysql2";
import { Strategy } from "passport-local";
import { sql } from "../utils/sqlStatements";
import { comparePasswords } from "../utils/helpers";

// Types
interface IUser {
  id: number;
  email: string;
  password: string;
}

// Types
interface IResponseUser extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

passport.serializeUser<any, any>((req, user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user: IUser, done) => {
  try {
    const { email } = user;
    // Get user by email
    const sqlStr = sql.getUserByEmail(email);
    const [rows] = await db.promise().query<IResponseUser[]>(sqlStr);
    const dbUser = rows[0];
    if (!dbUser) done(new Error("User not found"), false);
    done(null, dbUser /* This is what will be stored on the req.user object */);
  } catch (err) {
    done(err, false);
  }
});

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      // Check for email & password
      if (!email || !password) done(new Error("Missing credentials"), null);
      const sqlStr = sql.getUserByEmail(email);
      const [rows] = await db.promise().query<IResponseUser[]>(sqlStr);
      const dbUser = rows[0];
      // If user is not found
      if (!dbUser) done(new Error("User not found"), null);
      // Check password hashes
      const isValid = comparePasswords(password, dbUser.password);
      if (isValid) done(null, dbUser);
      else done(new Error("Incorrect credentials"), null);
    } catch (err) {
      done(err, null);
    }
  })
);
