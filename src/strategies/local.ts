// Imports
import passport from "passport";
import { Strategy } from "passport-local";
import { constants } from "@utils/constants";
import { selectAll } from "@utils/sqlQueries";
import { comparePasswords } from "@utils/helpers";

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
    const args = { table: constants.userTable, where: { email } };
    const [rows] = await selectAll(args);
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
    const args = { table: constants.userTable, where: { email } };
    const [rows] = await selectAll(args);
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
