import { google, youtube_v3 } from "googleapis";
import fs from "fs";
import path from "path";
import { handleError } from "src/utils/handleError";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export class YoutubeClient {
  private youtubeInstance: youtube_v3.Youtube;
  private pathToCompletedDir = path.resolve(__dirname, "../../completed");

  constructor(accessToken: string) {
    this.youtubeInstance = google.youtube("v3");

    oauth2Client.setCredentials({ access_token: accessToken });
  }

  uploadVideo(
    title: string,
    description: string,
    tags: string[],
    fileName: string
  ): boolean {
    try {
      this.youtubeInstance.videos.insert(
        {
          auth: oauth2Client,
          part: ["snippet, status"],
          requestBody: {
            snippet: {
              title,
              description,
              tags,
              categoryId: "24",
              defaultLanguage: "pl",
              defaultAudioLanguage: "pl",
            },
            status: {
              privacyStatus: "private",
            },
          },
          media: {
            body: fs.createReadStream(
              path.resolve(this.pathToCompletedDir, fileName)
            ),
          },
        },
        (err, response) => {
          if (err) {
            handleError(err);
            return;
          }

          console.log(response?.data);
        }
      );

      return true;
    } catch (e) {
      handleError(e);
      return false;
    }
  }
}
