import type { Character, ChatSession, Drama, LandingDrama } from "./types";

export const CHARACTERS: Character[] = [
  {
    id: "elena",
    name: "Elena",
    age: 24,
    tag: "Girl next door",
    tags: ["Girlfriend", "Soft"],
    greetCount: "128.6k",
    bio: "Soft-spoken neighbor who remembers the little things and texts first when the night gets quiet.",
    greeting: "You're home late again. I kept the light on.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    online: true,
    lockedAlbum: true,
    hasDrama: true,
    dramaId: "d1",
    classify: ["forYou", "hot"],
  },
  {
    id: "maya",
    name: "Maya",
    age: 27,
    tag: "Playful muse",
    tags: ["Playful", "Muse"],
    greetCount: "86.2k",
    bio: "Teases you, then gets unexpectedly sincere. Loves late-night voice notes.",
    greeting: "Tell me what you were actually thinking about.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
    online: true,
    lockedAlbum: true,
    classify: ["forYou", "new"],
  },
  {
    id: "nora",
    name: "Nora",
    age: 31,
    tag: "Mature girlfriend",
    tags: ["Mature", "Wife"],
    greetCount: "64.1k",
    bio: "Calm, expensive energy. Makes ordinary evenings feel chosen.",
    greeting: "Come sit. I already poured you a drink.",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
    online: false,
    lockedAlbum: true,
    classify: ["forYou", "hot"],
  },
  {
    id: "aria",
    name: "Aria",
    age: 22,
    tag: "Shy crush",
    tags: ["Shy", "Crush"],
    greetCount: "41.9k",
    bio: "Looks away, then says something that stays with you all day.",
    greeting: "I almost didn't send this. But I wanted to.",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
    online: true,
    lockedAlbum: false,
    classify: ["new", "forYou"],
  },
  {
    id: "luna",
    name: "Luna",
    age: 26,
    tag: "Dark romance",
    tags: ["Dark", "Romance"],
    greetCount: "97.3k",
    bio: "Quiet intensity. Speaks less, means more.",
    greeting: "Don't pretend you weren't waiting for me.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
    online: true,
    lockedAlbum: true,
    hasDrama: true,
    dramaId: "d3",
    classify: ["hot", "forYou"],
  },
  {
    id: "sienna",
    name: "Sienna",
    age: 29,
    tag: "Warm wife energy",
    tags: ["Warm", "Intimate"],
    greetCount: "53.0k",
    bio: "Home, skin, slow mornings. Makes loyalty feel exciting.",
    greeting: "I made space for you tonight. Come closer.",
    image:
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=80",
    online: false,
    lockedAlbum: true,
    classify: ["new", "hot"],
  },
];

export const SESSIONS: ChatSession[] = [
  { id: "s1", characterId: "elena", lastMessage: "You're home late again.", time: "2m", unread: 2 },
  { id: "s2", characterId: "maya", lastMessage: "Send me a voice note?", time: "1h", unread: 0 },
  { id: "s3", characterId: "nora", lastMessage: "I saved us a table.", time: "Yesterday", unread: 0 },
];

const DAY = 86400000;
const DRAMA_NOW = Date.now();

export const DRAMAS: Drama[] = [
  {
    id: "d1",
    publishedAt: DRAMA_NOW - 40 * DAY,
    lastEpisodeAt: DRAMA_NOW - 1 * DAY,
    title: "She Moved In Next Door",
    synopsis: "Your new neighbor keeps the door unlocked... until you walk in and she stops pretending.",
    cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/308368efc0104850859df1df1ad1094e.jpeg",
    watchCover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/308368efc0104850859df1df1ad1094e.jpeg",
    episodes: 12,
    lockedFrom: 2,
    episodeTitle: "She left the door unlocked",
    likeCount: "12.8k",
    duration: "00:48",
    firstEpisodeUrl: "https://d2tntkfu60is0z.cloudfront.net/sl/config/1893c15a1c5d458a976d43c087f0e0ef.mp4",
    actors: [
      { name: "Elena", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80", characterId: "elena" },
      { name: "Maya", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", characterId: "maya" },
    ],
  },
  {
    id: "d2",
    publishedAt: DRAMA_NOW - 2 * DAY,
    lastEpisodeAt: DRAMA_NOW - 2 * DAY,
    title: "Don't Text Your Ex",
    landscape: true,
    synopsis: "She swore she wouldn't send it. One late-night text later, you're back in her bed.",
    cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/e14ae6814a804e048cf9dea4e485191e.png",
    watchCover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/e14ae6814a804e048cf9dea4e485191e.png",
    episodes: 8,
    lockedFrom: 2,
    episodeTitle: "The message she shouldn't send",
    likeCount: "9.4k",
    duration: "00:41",
    firstEpisodeUrl: "https://d2tntkfu60is0z.cloudfront.net/sl/config/557b6a4abf054ccd9335119bdd49df9e.mp4",
    actors: [
      { name: "Maya", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", characterId: "maya" },
    ],
  },
  {
    id: "d3",
    publishedAt: DRAMA_NOW - 60 * DAY,
    lastEpisodeAt: DRAMA_NOW - 20 * DAY,
    title: "Hotel After Midnight",
    synopsis: "Room 1208. She said it was just one drink. The hallway camera knows better.",
    cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/e5b01cbd881d4677b55658b2e12a1b43.jpg",
    watchCover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/e5b01cbd881d4677b55658b2e12a1b43.jpg",
    episodes: 10,
    lockedFrom: 2,
    episodeTitle: "Room 1208",
    likeCount: "21.1k",
    duration: "00:52",
    firstEpisodeUrl: "https://d2tntkfu60is0z.cloudfront.net/sl/config/1893c15a1c5d458a976d43c087f0e0ef.mp4",
    actors: [
      { name: "Nora", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80", characterId: "nora" },
      { name: "Luna", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80", characterId: "luna" },
    ],
  },
  {
    id: "d4",
    publishedAt: DRAMA_NOW - 3 * DAY,
    lastEpisodeAt: DRAMA_NOW - 3 * DAY,
    title: "Secret Roommate",
    synopsis: "She heard you come home. The apartment is small, and she is not wearing much.",
    cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/dd7bebe64a4248d3beae71fb66eddcc4.jpg",
    watchCover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/dd7bebe64a4248d3beae71fb66eddcc4.jpg",
    episodes: 9,
    lockedFrom: 2,
    episodeTitle: "She heard you come home",
    likeCount: "7.6k",
    duration: "00:39",
    firstEpisodeUrl: "https://d2tntkfu60is0z.cloudfront.net/sl/config/1893c15a1c5d458a976d43c087f0e0ef.mp4",
    actors: [
      { name: "Aria", avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80", characterId: "aria" },
    ],
  },

  {
    id: "d-landing",
    publishedAt: DRAMA_NOW - 90 * DAY,
    lastEpisodeAt: DRAMA_NOW - 40 * DAY,
    title: "The Girl I Slept With Is My Stepsister",
    synopsis: "Your stepsister looks so well-behaved... so why is she throwing herself at you?",
    cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/9197de28f0c44e1985708fa93b28f4a0.jpeg",
    watchCover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/9197de28f0c44e1985708fa93b28f4a0.jpeg",
    episodes: 12,
    lockedFrom: 2,
    episodeTitle: "Yeah I just got off the plane",
    likeCount: "18.2k",
    duration: "00:46",
    firstEpisodeUrl: "https://d2tntkfu60is0z.cloudfront.net/sl/config/79c51c698ba94fc88fe652a9cef0d68a.mp4",
    actors: [
      { name: "Elena", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80", characterId: "elena" },
    ],
  },
];


export const LANDING_DRAMAS: LandingDrama[] = [
  { id: "1", title: "Stepdaughter's Coming-of-Age Gift", cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/308368efc0104850859df1df1ad1094e.jpeg", watchId: "d1" },
  { id: "2", title: "Taming the Arrogant Stepmother", cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/129dc12228a44f38a206f81035937422.jpg", watchId: "d2" },
  { id: "3", title: "My Sister-in-Law Was Starving for It", cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/7190e15f9ac24f9cb68ee04b44ba1da1.jpeg", watchId: "d3" },
  { id: "4", title: "Took My Nephew's Fiancee's First Night", cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/9ee18039861449329092cb789741e32a.jpg", watchId: "d4" },
  { id: "5", title: "The Girl I Slept With Is My Stepsister", cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/9197de28f0c44e1985708fa93b28f4a0.jpeg", videoUrl: "https://d2tntkfu60is0z.cloudfront.net/sl/config/79c51c698ba94fc88fe652a9cef0d68a.mp4", watchId: "d-landing", featured: true },
  { id: "6", title: "Damn...My Wife and Mother Are Fucking", cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/03c0f48fd7a745f6a2ad8cbeea70e251.jpg", watchId: "d3" },
  { id: "7", title: "Behind My Brother's Back: Fucking His Wife", cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/e5b01cbd881d4677b55658b2e12a1b43.jpg", watchId: "d3" },
  { id: "8", title: "Saving the Sex-Addicted Girl", cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/dd7bebe64a4248d3beae71fb66eddcc4.jpg", watchId: "d4" },
  { id: "9", title: "The Daughter-in-Law Is in My Bed", cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/7cb988200c3745dfb0ae81cd4f69ca5b.jpg", watchId: "d1" },
  { id: "10", title: "The Mature Lawyer Is Actually a Perfect Tease-Sub", cover: "https://d2tntkfu60is0z.cloudfront.net/sl/config/248158f922694efdb47845f401c5b9b5.jpg", watchId: "d2" },
];
export type SubSceneCopy = {
  highlight: string;
  before: string;
  emph: string;
  after: string;
  image: string;
  benefits: string[];
};

const CDN = "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource";

export const SUB_SCENES: Record<string, SubSceneCopy> = {
  generic: {
    highlight: "All Member Benefits",
    before: "Enjoy ",
    emph: "10+ premium benefits",
    after: " at great value.",
    image: CDN + "/a4825208f0fb49f9a04b3382a3924b05.png",
    benefits: [
      "NSFW chats, 4000 free messages monthly",
      "Unlock private albums",
      "300 free NSFW image generations monthly",
      "Hear your AI girlfriend's voice free",
    ],
  },
  chatLimit: {
    highlight: "NSFW Chats",
    before: "Unlock ",
    emph: "NSFW",
    after: " chats and get Free messages.",
    image: CDN + "/a4825208f0fb49f9a04b3382a3924b05.png",
    benefits: [
      "NSFW chats, 4000 free messages monthly",
      "Unlock private albums",
      "300 free NSFW image generations monthly",
      "Hear your AI girlfriend's voice free",
    ],
  },
  unlockBlur: {
    highlight: "Private Content",
    before: "Unlock blurred ",
    emph: "NSFW Images",
    after: " for clear viewing.",
    image: CDN + "/cfa6475d9a894d01b24c6e81370603ad.png",
    benefits: [
      "NSFW chats, 4000 free messages monthly",
      "Generate spicy videos",
      "300 free NSFW image generations monthly",
      "Hear your AI girlfriend's voice free",
    ],
  },
  askPhoto: {
    highlight: "Ask for Photo",
    before: "Ask her for any photo, including ",
    emph: "NSFW",
    after: " content.",
    image: CDN + "/6fff4bf44040422f8d5cb10b7ef5c6ba.png",
    benefits: [
      "300 free NSFW image generations monthly",
      "NSFW chats, 4000 free messages monthly",
      "Unlock private albums",
      "Hear your AI girlfriend's voice free",
    ],
  },
  playVoice: {
    highlight: "Sultry Voice",
    before: "Listen to ",
    emph: "1,000 free",
    after: " AI girlfriend voice messages.",
    image: CDN + "/9e89be4f812a47b9afe49662392656d3.png",
    benefits: [
      "NSFW chats, 4000 free messages monthly",
      "Unlock private albums",
      "300 free NSFW image generations monthly",
      "Generate spicy videos",
    ],
  },
  drawLimit: {
    highlight: "Image Generation",
    before: "Higher tiers unlock more ",
    emph: "free image generations",
    after: " monthly.",
    image: CDN + "/bec1c8354f774a21a10c0d546d144abf.png",
    benefits: [
      "300 free NSFW image generations monthly",
      "NSFW chats, 4000 free messages monthly",
      "Unlock private albums",
      "Generate spicy videos",
    ],
  },
  shortDrama: {
    highlight: "Next Episodes",
    before: "Enjoy more ",
    emph: "free episodes",
    after: " and 50% off unlocks.",
    image: CDN + "/fab1c90c670c479e954ae8ee1d7f4c53.png",
    benefits: [
      "NSFW chats, 4000 free messages monthly",
      "Unlock private albums",
      "300 free NSFW image generations monthly",
      "Hear your AI girlfriend's voice free",
    ],
  },
  dressUp: {
    highlight: "Exclusive Outfit",
    before: "Dress your AI girlfriend in the ",
    emph: "outfits you want",
    after: ".",
    image: CDN + "/bfdd7245b5594750b44d38d1de0dc1cf.png",
    benefits: [
      "NSFW chats, 4000 free messages monthly",
      "Unlock private albums",
      "300 free NSFW image generations monthly",
      "Generate spicy videos",
    ],
  },
  askVideo: {
    highlight: "Ask for Video",
    before: "Ask her for any video, including ",
    emph: "NSFW",
    after: " content.",
    image: CDN + "/74b5bc365b7043a095bae3ffe7c7ff57.png",
    benefits: [
      "NSFW chats, 4000 free messages monthly",
      "Unlock private albums",
      "300 free NSFW image generations monthly",
      "Hear your AI girlfriend's voice free",
    ],
  },
  remixGenerate: {
    highlight: "Remix Video",
    before: "Remix her story into ",
    emph: "spicy clips",
    after: " you control.",
    image: CDN + "/74b5bc365b7043a095bae3ffe7c7ff57.png",
    benefits: [
      "Generate spicy remix videos",
      "NSFW chats, 4000 free messages monthly",
      "Unlock private albums",
      "300 free NSFW image generations monthly",
    ],
  },
};

export const SUBSCRIBE_COPY: Record<string, { title: string; sub: string; cta: string }> = {
  generic: { title: "Unlock her fully", sub: "Plus members keep the conversation going without limits.", cta: "Become Plus" },
};

export const GEM_PACKS = [
  { id: "p80", gems: 80, extra: 80, price: "$0.99", tag: "First" },
  { id: "p500", gems: 500, extra: 50, price: "$4.99", tag: "" },
  { id: "p1200", gems: 1200, extra: 180, price: "$9.99", tag: "Popular" },
  { id: "p2500", gems: 2500, extra: 500, price: "$19.99", tag: "Best" },
  { id: "p6500", gems: 6500, extra: 1500, price: "$49.99", tag: "" },
  { id: "p15000", gems: 15000, extra: 4000, price: "$99.99", tag: "" },
];

export const SUB_PLANS = [
  { id: "week", name: "Weekly", month: "$2.49 / mo", total: "$9.99", off: "" },
  { id: "month", name: "Monthly", month: "$9.99 / mo", total: "", off: "" },
  { id: "quarter", name: "3 Months", month: "$6.66 / mo", total: "$19.99", off: "30% OFF" },
  { id: "life", name: "Lifetime", month: "", total: "$99.99", off: "" },
];


export function characterById(id?: string) {
  return CHARACTERS.find((item) => item.id === id) || CHARACTERS[0];
}


export const CREATE_STYLES = [
  { name: "Realistic", image: "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/createGirl/Style/Realistic.webp" },
  { name: "Anime", image: "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/createGirl/Style/Anime.webp" },
];

export const CREATE_ETHNICITY = [
  { name: "Caucasian", image: "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/3949971850744b898ac697939da97c32.webp" },
  { name: "Latina", image: "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/dd33fc894fa8473999f818e159f106df.webp" },
  { name: "Asian", image: "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/633065f0a22046df8a5670cc0da6c799.webp" },
  { name: "Arab", image: "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/6af1d8ccf9894bf18fef3e094cb08902.webp" },
  { name: "Black/Afro", image: "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/058b07037e974513aec921bedc6e2ed2.webp" },
];

export const CREATE_HAIR_STYLES = ["Straight", "Bangs", "Curly", "Bun", "Short", "Long"];
export const CREATE_HAIR_COLORS = [
  { name: "Blonde", color: "#EBEA9A" },
  { name: "Brunette", color: "#AF9481" },
  { name: "Black", color: "#000000" },
  { name: "Redhead", color: "#FF3B79" },
  { name: "Pink", color: "#FFB3E6" },
  { name: "White", color: "#FFFFFF" },
  { name: "Blue", color: "#94D9FF" },
  { name: "Purple", color: "#C0A3EB" },
];
export const CREATE_BODY = ["Small", "Medium", "Large", "Athletic"];
export const CREATE_BREAST = ["Small", "Medium", "Large", "Huge"];
export const CREATE_PERSONALITY = [
  "Lover", "Caregiver", "Nympho", "Jester", "Confidant", "Mean",
  "Experimenter", "Sage", "Innocent", "Dominant", "Temptress", "Submissive",
];
export const CREATE_RELATIONSHIP = ["Girlfriend", "Wife", "Friend", "Mistress", "Step Sister", "Step Mom"];
export const CREATE_OCCUPATION = ["Model", "Nurse", "Teacher", "Student", "Artist", "Fitness Coach", "Secretary", "Dancer", "Doctor", "Writer"];
export const CREATE_HOBBIES = ["Fitness", "Traveling", "Gaming", "Anime", "Photography", "Cooking", "Yoga", "Music", "Reading", "Parties"];
export const CREATE_VOICES = ["Soft", "Sweet", "Sultry", "Playful", "Mature"];

export const DRAW_STYLES = [
  { name: "Realistic", image: "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/acf88d59f9d64c0bac4ed35b9f20b4ed.webp" },
  { name: "Anime", image: "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/58df5c4b44054b89b7e04cabd602e565.webp" },
];

export const DRAW_ACTION_CATS = [
  {
    name: "Action",
    kind: "cards",
    actions: [
      { name: "Mermaid", vip: false, image: "/draw/mermaid.png", prompt: "A mermaid swimming underwater, long flowing hair, cinematic light." },
      { name: "Sports Babe", vip: false, image: "/draw/sports-babe.png", prompt: "Athletic woman on a grass field holding a soccer ball, sporty outfit, sunlight." },
      { name: "Tights", vip: false, image: "/draw/tights.png", prompt: "Woman walking on a city street wearing black tights and heels, fashion photography." },
      { name: "Neon", vip: false, image: "/draw/neon.png", prompt: "Woman in a neon-lit city night, leather jacket, cinematic cyberpunk lighting." },
    ],
  },
  {
    name: "Poses",
    kind: "dots",
    actions: [
      { name: "Standing", vip: false, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80" },
      { name: "Sitting", vip: false, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "One Hand On Hip", vip: false, image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80" },
      { name: "Hands Up", vip: false, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80" },
      { name: "Turn Around", vip: false, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
    ],
  },
  {
    name: "Clothing",
    kind: "dots",
    actions: [
      { name: "Bikini", vip: false, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80" },
      { name: "Pencil Dress", vip: false, image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80" },
      { name: "Evening Dress", vip: false, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Leather", vip: false, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { name: "Sports", vip: false, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80" },
      { name: "Pajamas", vip: false, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80" },
    ],
  },
  {
    name: "Scene",
    kind: "dots",
    actions: [
      { name: "Beach", vip: false, image: "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/0132a025db5948a5a87689df8d4dbe70.png" },
      { name: "Bar", vip: false, image: "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/6af0c0aa71e94306a29ac3bb98eea7be.png" },
    ],
  },
  {
    name: "Ethnic",
    kind: "dots",
    actions: [
      { name: "Caucasian", vip: false, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80" },
      { name: "Asian", vip: false, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80" },
      { name: "Afro", vip: false, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Arab", vip: false, image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80" },
      { name: "Latina", vip: false, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
    ],
  },
];
