import session from "express-session";
import { TwitchUser } from "./user";

export = session;

declare module "express-session" {
  interface SessionData {
    passport: {
      user: TwitchUser;
    };
  }
}
