const fs = require("fs");

let types = fs.readFileSync("src/types.ts", "utf8");
if (!types.includes("publishedAt")) {
  types = types.replace(
    "  landscape?: boolean;\n};",
    "  landscape?: boolean;\n  publishedAt: number;\n  lastEpisodeAt: number;\n};"
  );
  fs.writeFileSync("src/types.ts", types);
}

let mock = fs.readFileSync("src/mock.ts", "utf8");
if (!mock.includes("publishedAt")) {
  mock = mock.replace(
    "export const DRAMAS: Drama[] = [",
    `const DAY = 86400000;
const DRAMA_NOW = Date.now();

export const DRAMAS: Drama[] = [`
  );
  const stamps = [
    ["id: \"d1\"", "publishedAt: DRAMA_NOW - 40 * DAY,\n    lastEpisodeAt: DRAMA_NOW - 1 * DAY,"],
    ["id: \"d2\"", "publishedAt: DRAMA_NOW - 2 * DAY,\n    lastEpisodeAt: DRAMA_NOW - 2 * DAY,"],
    ["id: \"d3\"", "publishedAt: DRAMA_NOW - 60 * DAY,\n    lastEpisodeAt: DRAMA_NOW - 20 * DAY,"],
    ["id: \"d4\"", "publishedAt: DRAMA_NOW - 3 * DAY,\n    lastEpisodeAt: DRAMA_NOW - 3 * DAY,"],
    ["id: \"d-landing\"", "publishedAt: DRAMA_NOW - 90 * DAY,\n    lastEpisodeAt: DRAMA_NOW - 40 * DAY,"],
  ];
  for (const [idLine, extra] of stamps) {
    mock = mock.replace(idLine, idLine + ",\n    " + extra);
  }
  fs.writeFileSync("src/mock.ts", mock);
}

fs.writeFileSync("src/dramaGuide.ts", `const WATCHED_KEY = "sl-demo-drama-watched";
const RECENT_KEY = "sl-demo-drama-recent";
const SHOWN_KEY = "sl-demo-drama-rec-at";
const WINDOW_MS = 30 * 60 * 1000;
const RECENT_MAX = 10;
const DAY = 86400000;
export const NEW_WINDOW_MS = 7 * DAY;
/** Demo stand-in for account/visitor registration time (14 days ago). */
export const DEMO_REGISTERED_AT = Date.now() - 14 * DAY;

export const DRAMA_ENTRY_ICON =
  "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/3ba0e7c7c67c4c409d815b19f13eb0d7.png";

export type DramaWatch = { id: string; at: number };

export function getRecentWatches(): DramaWatch[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (typeof item === "string") return { id: item, at: Date.now() };
        if (item && typeof item === "object" && typeof (item as DramaWatch).id === "string") {
          const at = Number((item as DramaWatch).at);
          return { id: (item as DramaWatch).id, at: Number.isFinite(at) ? at : Date.now() };
        }
        return null;
      })
      .filter((item): item is DramaWatch => Boolean(item && item.id));
  } catch {
    return [];
  }
}

export function getRecentDramaIds(): string[] {
  return getRecentWatches().map((item) => item.id);
}

export function markDramaWatched(dramaId?: string) {
  try {
    localStorage.setItem(WATCHED_KEY, "1");
  } catch {
    /* ignore */
  }
  if (!dramaId) return;
  try {
    const next = [{ id: dramaId, at: Date.now() }, ...getRecentWatches().filter((item) => item.id !== dramaId)].slice(0, RECENT_MAX);
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

export function dramaBadge(
  drama: { id: string; publishedAt: number; lastEpisodeAt: number },
  registeredAt = DEMO_REGISTERED_AT,
): "NEW" | "Update" | null {
  const watch = getRecentWatches().find((item) => item.id === drama.id);
  if (watch) return drama.lastEpisodeAt > watch.at ? "Update" : null;
  if (drama.publishedAt > registeredAt && Date.now() - drama.publishedAt < NEW_WINDOW_MS) return "NEW";
  return null;
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

console.log("guide+types+mock");
