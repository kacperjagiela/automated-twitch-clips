declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TWITCH_CLIENT_ID: string;
      TWITCH_SECRET: string;
      SERVER_PORT: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
    }
  }
  namespace Express {
    interface Session {
      passport?: User;
    }
  }
}

export {};
