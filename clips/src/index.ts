import * as dotenv from "dotenv";
import express from "express";
import passport from "passport";
import session from "express-session";

import OAuth2Strategy from "passport-oauth2";
import { TwitchClient } from "./clients/TwitchClient";
import { DownloadClient } from "./clients/DownloadClient";
import { VideoClient } from "./clients/VideoClient";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { YoutubeClient } from "./clients/YoutubeClient";

dotenv.config();

const server = express();

server.use(express.json());

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

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    (
      request: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      done(null, profile);
    }
  )
);

// Declare clients used by multiple endpoints

const downloadClient = new DownloadClient();
const videoClient = new VideoClient(downloadClient.dirPath);

server.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "email",
      "profile",
      "https://www.googleapis.com/auth/youtube.upload",
    ],
  })
);

server.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/google",
    failureRedirect: "/google",
  })
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

// If user has an authenticated session, display it, otherwise display link to authenticate
server.get("/", async (req, res) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    const broadcasterName = "h2p_gucio";

    const twitchClient = new TwitchClient(
      req.session.passport.user.accessToken
    );
    const twitchUsers = await twitchClient.getUsersByLogin([broadcasterName]);

    const clips = await twitchClient.getClipsByBroadcasterId(twitchUsers[0].id);

    const clipsDuration = clips.reduce(
      (duration, currentClip) => (duration += currentClip.duration),
      0
    );

    const clipsTime = new Date(0);
    clipsTime.setSeconds(clipsDuration);

    console.log(`Clips duration: ${clipsTime.toISOString().slice(14, 19)}`);

    const downloadEntities = twitchClient.normalizeClipsForDownload(clips);

    const downloadedEntities = await Promise.all(
      downloadEntities.map((entity) =>
        downloadClient.downloadFileByEntity(entity)
      )
    );

    const fileNames = downloadedEntities.map((entity) => entity.fileName);
    const outputName = `twitch-most-viewed-clips-of-the-week-${broadcasterName}.mp4`;

    videoClient.mergeFiles(fileNames, outputName);

    res.send(
      `<html>
        <h1>Download finished.</h1>
        <h2>whole clips duration: ${clipsTime.toISOString().slice(14, 19)}</h2>
        <a href="/google">Upload to youtube</a>
        </html`
    );
  } else {
    res.send(
      '<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch">Download clips</a></html>'
    );
  }
});

server.get("/google", async (req, res) => {
  if (req.session && req.session.passport) {
    const youtubeClient = new YoutubeClient(
      req.session.passport.user.accessToken
    );

    const fileName = "twitch-most-viewed-clips-of-the-week-h2p_gucio.mp4";

    const title = fileName.replace(/-/g, " ").slice(0, -4);

    const tags = fileName.slice(0, -4).split("-");

    // TODO: description
    const description = "Temporary description";

    const result = youtubeClient.uploadVideo(
      title,
      description,
      tags,
      fileName
    );

    console.log(result);

    res.send(`
      <html>
        <h1>Successfully authenticated by google</h1>
      </html>
    `);
  } else {
    res.send(
      '<html><head><title>Google Auth Sample</title></head><a href="/auth/google">Log in</a></html>'
    );
  }
});

server.post("/mute-video-parts", (req, res) => {
  if (req.body) {
    const { fileName, videoParts } = req.body;

    videoClient.muteVideoByParts(videoParts, fileName);

    res.sendStatus(200);
  }
});

server.listen(port, () => {
  console.log(`Example server listening on port ${port}`);
});
