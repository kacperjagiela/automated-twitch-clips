type BroadcasterType = "partner" | "affiliate" | "";

type UserType = "staff" | "admin" | "global_mod" | "";

// Typing for /users

export type TwitchUser = {
  id: string;
  login: string;
  display_name: string;
  type: UserType;
  broadcaster_type: BroadcasterType;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
  created_at: string;
};

export type TwitchUsersResponse = {
  data: TwitchUser[];
};

// Typing for /clips

export type TwitchClip = {
  id: string;
  url: string;
  embed_url: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  video_id: string;
  game_id: string;
  language: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
};

export type TwitchClipsResponse = {
  data: TwitchClip[];
  pagination?: {
    cursor: string;
  };
};
