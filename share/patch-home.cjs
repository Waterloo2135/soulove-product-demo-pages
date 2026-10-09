const fs = require("fs");

function patch(file, pairs) {
  let s = fs.readFileSync(file, "utf8");
  for (const [oldV, newV, label] of pairs) {
    if (!s.includes(oldV)) throw new Error(file + " missing: " + label);
    s = s.replace(oldV, newV);
  }
  fs.writeFileSync(file, s);
}

patch("src/types.ts", [
  [
    'export type MainTab = "home" | "chats" | "characters" | "generate" | "account";',
    'export type MainTab = "home" | "chats" | "short-drama" | "generate" | "account";',
    "MainTab",
  ],
  [
    'export type HomeClassify = "forYou" | "hot" | "new" | "shorts";',
    'export type HomeClassify = "forYou" | "hot" | "new" | "lover";',
    "HomeClassify",
  ],
]);

patch("src/store.tsx", [
  [
    'const MAIN_TABS: MainTab[] = ["home", "chats", "characters", "generate", "account"];',
    'const MAIN_TABS: MainTab[] = ["home", "chats", "short-drama", "generate", "account"];',
    "MAIN_TABS",
  ],
]);

let icons = fs.readFileSync("src/components/Icons.tsx", "utf8");
if (!icons.includes("export function IconDrama")) {
  icons = icons.replace(
    "export function IconHeart() {",
    `export function IconDrama() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="7" width="17" height="13" rx="2" />
      <path d="M8 7V4.8M16 7V4.8M3.5 12h17" />
    </svg>
  );
}
export function IconHeart() {`
  );
  fs.writeFileSync("src/components/Icons.tsx", icons);
}

patch("src/components/TabBar.tsx", [
  [
    'import { IconChat, IconDraw, IconHeart, IconHome, IconMe } from "./Icons";',
    'import { IconChat, IconDraw, IconDrama, IconHome, IconMe } from "./Icons";',
    "tab import",
  ],
  [
    '{ id: "characters", label: "Lover", icon: IconHeart },',
    '{ id: "short-drama", label: "Drama", icon: IconDrama },',
    "tab item",
  ],
]);

patch("src/screens/DramaRemixScreen.tsx", [
  [
    '<p className="rx-ideas-lead">See how others remix this drama. Full prompts are open. Making the video is where it costs.</p>',
    '<p className="rx-ideas-lead"><strong>Inspiring &amp; Bold</strong>: Beyond the script: See, adapt, create.</p>',
    "ideas lead",
  ],
]);

let css = fs.readFileSync("src/index.css", "utf8");
const oldLead = `.rx-ideas-lead {
  margin: 0 0 14px;
  font-size: 12px;
  line-height: 1.45;
  color: rgba(255,255,255,0.55);
}`;
const newLead = `.rx-ideas-lead {
  margin: 0 0 14px;
  font-size: 13px;
  line-height: 1.45;
  color: rgba(255,255,255,0.55);
}
.rx-ideas-lead strong {
  color: #fff;
  font-weight: 800;
}`;
if (!css.includes(oldLead)) throw new Error("lead css missing");
css = css.replace(oldLead, newLead);
if (!css.includes(".home-lover {")) {
  css += `
.home-lover { padding: 0 0 20px; }
.home-lover .lover-grid { padding-top: 8px; }
.home-lover-create { padding: 4px 12px 12px; }
.drama-tab-page { min-height: 100%; }
`;
}
fs.writeFileSync("src/index.css", css);

console.log("patched core");
