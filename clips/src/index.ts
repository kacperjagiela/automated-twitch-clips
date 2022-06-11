import * as dotenv from "dotenv";
import express from "express";
import passport from "passport";
import session from "express-session";
import handlebars from "handlebars";

import OAuth2Strategy from "passport-oauth2";
import { TwitchClient } from "./clients/TwitchClient";

dotenv.config();

const server = express();

server.use(
  session({
    secret: "raldkjlkznvlkbjlkadbf",
    resave: false,
    saveUninitialized: false,
  })
);
server.use(passport.initialize());
server.use(passport.session());

const port = process.env.SERVER_PORT;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, { id } as Express.User);
});

passport.use(
  "twitch",
  new OAuth2Strategy(
    {
      authorizationURL: "https://id.twitch.tv/oauth2/authorize",
      tokenURL: "https://id.twitch.tv/oauth2/token",
      clientID: `${process.env.TWITCH_CLIENT_ID}`,
      clientSecret: `${process.env.TWITCH_SECRET}`,
      callbackURL: "http://localhost:3000/auth/twitch/callback",
    },
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;

      done(null, profile);
    }
  )
);

// Set route to start OAuth link, this is where you define scopes to request
server.get(
  "/auth/twitch",
  passport.authenticate("twitch", { scope: "user_read" })
);

// Set route for OAuth redirect
server.get(
  "/auth/twitch/callback",
  passport.authenticate("twitch", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

// Define a simple template to safely generate HTML with values from user's profile
const template = handlebars.compile(`
<html><head><title>Twitch Auth Sample</title></head>
<table>
    <tr><th>Access Token</th><td>{{accessToken}}</td></tr>
    <tr><th>Refresh Token</th><td>{{refreshToken}}</td></tr>
</table></html>`);

// If user has an authenticated session, display it, otherwise display link to authenticate
server.get("/", async (req, res) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    // user logged in to twitch here
    const twitchClient = new TwitchClient(
      req.session.passport.user.accessToken
    );

    const twitchUsers = await twitchClient.getUsersByLogin([
      "h2p_gucio",
      "vysotzky",
      "parisplatynov",
    ]);

    console.log(await twitchClient.getClipsByBroadcasterId(twitchUsers[0].id));

    res.send(template(req.session.passport.user));
  } else {
    res.send(
      '<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch">Connect to twitch</a></html>'
    );
  }
});

server.listen(port, () => {
  console.log(`Example server listening on port ${port}`);
});
