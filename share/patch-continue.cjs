const fs = require("fs");

fs.writeFileSync("src/dramaGuide.ts", `const WATCHED_KEY = "sl-demo-drama-watched";
const RECENT_KEY = "sl-demo-drama-recent";
const SHOWN_KEY = "sl-demo-drama-rec-at";
const WINDOW_MS = 30 * 60 * 1000;
const RECENT_MAX = 10;

export const DRAMA_ENTRY_ICON =
  "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/3ba0e7c7c67c4c409d815b19f13eb0d7.png";

export function getRecentDramaIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string" && id.length > 0);
  } catch {
    return [];
  }
}

export function markDramaWatched(dramaId?: string) {
  try {
    localStorage.setItem(WATCHED_KEY, "1");
  } catch {
    /* ignore */
  }
  if (!dramaId) return;
  try {
    const next = [dramaId, ...getRecentDramaIds().filter((id) => id !== dramaId)].slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function hasDramaWatched() {
  if (getRecentDramaIds().length > 0) return true;
  try {
    return localStorage.getItem(WATCHED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markDramaRecommendShown() {
  try {
    localStorage.setItem(SHOWN_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function shouldShowDramaRecommend() {
  if (hasDramaWatched()) return false;
  try {
    const raw = localStorage.getItem(SHOWN_KEY);
    if (!raw) return true;
    return Date.now() - Number(raw) >= WINDOW_MS;
  } catch {
    return true;
  }
}

export function resetDramaGuideCache() {
  try {
    localStorage.removeItem(WATCHED_KEY);
    localStorage.removeItem(RECENT_KEY);
    localStorage.removeItem(SHOWN_KEY);
  } catch {
    /* ignore */
  }
}
`);

let store = fs.readFileSync("src/store.tsx", "utf8");
store = store.replace(
  `    if (id === "short-drama-watch") markDramaWatched();\n    if (MAIN_TABS.includes(id as MainTab)) {`,
  `    if (id === "short-drama-watch") markDramaWatched(params.id);\n    if (MAIN_TABS.includes(id as MainTab)) {`
);
store = store.replace(
  `        if (id === "short-drama-watch") markDramaWatched();\n        dispatch({ type: "push", item: { id, params } });`,
  `        if (id === "short-drama-watch") markDramaWatched(params?.id);\n        dispatch({ type: "push", item: { id, params } });`
);
fs.writeFileSync("src/store.tsx", store);

let misc = fs.readFileSync("src/screens/MiscScreens.tsx", "utf8");
if (!misc.includes('from "../dramaGuide"')) {
  misc = misc.replace(
    'import { useStore } from "../store";',
    'import { getRecentDramaIds } from "../dramaGuide";\nimport { useStore } from "../store";'
  );
}

const oldScreen = `export function ShortDramaScreen() {
  const store = useStore();
  return (
    <div className="drama-tab-page">
      <div className="lover-head">
        <div className="lover-title">Drama</div>
        {store.persona === "guest" ? (
          <button className="ui-login" onClick={() => store.requireUser()}>Log in</button>
        ) : (
          <button className="ui-gems" onClick={() => store.push("tokens")}>💎 {store.gems}</button>
        )}
      </div>
      <div className="shorts-page">
        <div className="shorts-hero">
          <img src={SHORTS_HERO} alt="" />
        </div>
        <p className="shorts-sub">Binge her story. Unlock every episode with Plus.</p>
        <div className="shorts-grid">
          {DRAMAS.map((item) => (
            <button key={item.id} className="shorts-card" onClick={() => store.push("short-drama-watch", { id: item.id })}>
              <img src={item.cover} alt={item.title} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}`;

const newScreen = `export function ShortDramaScreen() {
  const store = useStore();
  const recent = getRecentDramaIds()
    .map((id) => DRAMAS.find((item) => item.id === id))
    .filter((item): item is (typeof DRAMAS)[number] => Boolean(item));
  return (
    <div className="drama-tab-page">
      <div className="lover-head">
        <div className="lover-title">Drama</div>
        {store.persona === "guest" ? (
          <button className="ui-login" onClick={() => store.requireUser()}>Log in</button>
        ) : (
          <button className="ui-gems" onClick={() => store.push("tokens")}>💎 {store.gems}</button>
        )}
      </div>
      <div className="shorts-page">
        <div className="shorts-hero">
          <img src={SHORTS_HERO} alt="" />
        </div>
        <p className="shorts-sub">Binge her story. Unlock every episode with Plus.</p>
        {recent.length > 0 ? (
          <section className="drama-recent-sec">
            <h2 className="drama-sec-title">Continue Watching</h2>
            <div className="drama-recent">
              {recent.map((item) => (
                <button
                  key={item.id}
                  className="drama-recent-card"
                  onClick={() => store.push("short-drama-watch", { id: item.id })}
                >
                  <span className="drama-recent-cover">
                    <img src={item.cover} alt="" />
                  </span>
                  <em>{item.title}</em>
                </button>
              ))}
            </div>
          </section>
        ) : null}
        <h2 className="drama-sec-title">All Dramas</h2>
        <div className="shorts-grid">
          {DRAMAS.map((item) => (
            <button key={item.id} className="shorts-card" onClick={() => store.push("short-drama-watch", { id: item.id })}>
              <img src={item.cover} alt={item.title} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}`;

if (!misc.includes(oldScreen)) throw new Error("drama screen missing");
misc = misc.replace(oldScreen, newScreen);
fs.writeFileSync("src/screens/MiscScreens.tsx", misc);

let css = fs.readFileSync("src/index.css", "utf8");
if (!css.includes(".drama-recent")) {
  css = css.replace(
    `.shorts-card img { width: 100%; height: 100%; object-fit: cover; }`,
    `.shorts-card img { width: 100%; height: 100%; object-fit: cover; }

.drama-sec-title {
  margin: 4px 8px 10px;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
}
.drama-recent-sec { margin: 4px 0 14px; }
.drama-recent {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 8px 4px;
  scrollbar-width: none;
}
.drama-recent::-webkit-scrollbar { display: none; }
.drama-recent-card {
  flex: none;
  width: 108px;
  text-align: left;
  color: #fff;
}
.drama-recent-cover {
  display: block;
  width: 108px;
  height: 144px;
  border-radius: 8px;
  overflow: hidden;
  background: #2a1d27;
}
.drama-recent-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.drama-recent-card em {
  display: block;
  margin-top: 6px;
  font-style: normal;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
  color: rgba(255,255,255,0.82);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`
  );
  fs.writeFileSync("src/index.css", css);
}

console.log("ok");
