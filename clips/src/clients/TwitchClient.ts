import axios, { AxiosInstance } from "axios";

export class TwitchClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      url: "",
    });
  }
}
