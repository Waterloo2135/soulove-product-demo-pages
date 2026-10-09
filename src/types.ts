export type Persona = "guest" | "free" | "plus";

export type ScreenId =
  | "home"
  | "chats"
  | "characters"
  | "generate"
  | "account"
  | "character-detail"
  | "character-album"
  | "chat-room"
  | "create-character"
  | "generate-image"
  | "generate-result"
  | "gallery"
  | "subscriptions"
  | "tokens"
  | "short-drama"
  | "short-drama-watch"
  | "film-scenes"
  | "drama-remix"
  | "ad-landing"
  | "profile"
  | "settings"
  | "invitation"
  | "bonus"
  | "login"
  | "pay"
  | "pay-success"
  | "contact-us"

export type MainTab = "home" | "chats" | "short-drama" | "generate" | "account";

export type OverlayType =
  | "login"
  | "subscribe"
  | "gems"
  | "bonus"
  | "shortDrama"
  | "shortDrama2"
  | "toast"
  | "gift"
  | "dress"
  | "askMedia"
  | "dramaRecommend";

export type SubscribeScene =
  | "generic"
  | "chatLimit"
  | "unlockBlur"
  | "askPhoto"
  | "playVoice"
  | "drawLimit"
  | "shortDrama"
  | "dressUp"
  | "askVideo"
  | "remixGenerate";

export type HomeClassify = "forYou" | "hot" | "new" | "lover";

export type Overlay = {
  type: OverlayType;
  scene?: SubscribeScene;
  message?: string;
  tab?: "image" | "video";
} | null;

export type NavItem = {
  id: ScreenId;
  params?: Record<string, string>;
};

export type Character = {
  id: string;
  name: string;
  age: number;
  tag: string;
  tags: string[];
  greetCount: string;
  bio: string;
  greeting: string;
  image: string;
  online: boolean;
  lockedAlbum: boolean;
  hasDrama?: boolean;
  dramaId?: string;
  classify: Array<"forYou" | "hot" | "new">;
};

export type ChatSession = {
  id: string;
  characterId: string;
  lastMessage: string;
  time: string;
  unread: number;
};

export type DramaActor = {
  name: string;
  avatar: string;
  characterId: string;
};

export type Drama = {
  id: string;
  title: string;
  cover: string;
  watchCover: string;
  episodes: number;
  lockedFrom: number;
  episodeTitle: string;
  synopsis: string;
  likeCount: string;
  duration: string;
  actors: DramaActor[];
  firstEpisodeUrl: string;
  landscape?: boolean;
  publishedAt: number;
  lastEpisodeAt: number;
};
export type LandingDrama = {
  id: string;
  title: string;
  cover: string;
  videoUrl?: string;
  watchId: string;
  featured?: boolean;
};


