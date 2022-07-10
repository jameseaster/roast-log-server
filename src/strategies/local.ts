// Imports
import { db } from "@db/index";
import passport from "passport";
import { RowDataPacket } from "mysql2";
import { Strategy } from "passport-local";
import { sql } from "@utils/sqlStatements";
import { comparePasswords } from "@utils/helpers";

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

// Use these fields from database
const customFields = {
  usernameField: "email",
  passwordField: "password",
};

// Used to verify the user
const verifyCallback = async (email: string, password: string, done: any) => {
  try {
    // Check for email & password
    if (!email || !password) {
      return done(null, false, { message: "Missing credentials" });
    }
    // Check for exisiting user
    const sqlStr = sql.getUserByEmail(email);
    const [rows] = await db.promise().query<IResponseUser[]>(sqlStr);
    const dbUser = rows[0];
    // If user is not found
    if (!dbUser) {
      return done(null, false, { message: "User not found" });
    }
    // Check password hashes
    const isValid = comparePasswords(password, dbUser.password);
    return isValid
      ? done(null, dbUser)
      : done(null, false, { message: "Incorrect credentials" });
  } catch (err) {
    done(err);
  }
};

// Serialize user
passport.serializeUser<any, any>((req, user: any, done) => {
  done(null, user.email);
});

// Deserialize user
passport.deserializeUser(async (email: string, done) => {
  try {
    // Get user by email
    const sqlStr = sql.getUserByEmail(email);
    const [rows] = await db.promise().query<IResponseUser[]>(sqlStr);
    const dbUser = rows[0];
    const { password: _, ...rest } = dbUser;
    return !dbUser ? done(null, false) : done(null, rest);
  } catch (err) {
    done(err);
  }
});

// Local strategy
const strategy = new Strategy(customFields, verifyCallback);

// Passport middleware
passport.use(strategy);
