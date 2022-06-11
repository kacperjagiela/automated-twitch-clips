import axios, { AxiosInstance } from "axios";
import { handleError } from "src/utils/handleError";
import {
  TwitchClip,
  TwitchClipsResponse,
  TwitchUser,
  TwitchUsersResponse,
} from "./types/twitchResponses";

export class TwitchClient {
  private instance: AxiosInstance;

  constructor(accessToken: string) {
    this.instance = axios.create({
      baseURL: "https://api.twitch.tv/helix/",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": `${process.env.TWITCH_CLIENT_ID}`,
      },
    });
  }

  public async getUsersByLogin(logins: string[]): Promise<TwitchUser[]> {
    try {
      let url = `/users/?login=${logins[0]}`;

      logins.slice(1).forEach((login) => {
        url += `&login=${login}`;
      });

      const {
        data: { data },
      } = await this.instance.get<TwitchUsersResponse>(url);

      return data;
    } catch (e) {
      handleError(e);
      return null as unknown as TwitchUser[];
    }
  }

  public async getClipsByBroadcasterId(
    broadcasterId: string
  ): Promise<TwitchClip[]> {
    try {
      // Get date 7 days ago
      const startDateOfClips = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();

      const {
        data: { data },
      } = await this.instance.get<TwitchClipsResponse>(
        `/clips?broadcaster_id=${broadcasterId}&started_at=${startDateOfClips}`
      );

      return data;
    } catch (e) {
      handleError(e);
      return null as unknown as TwitchClip[];
    }
  }
}
