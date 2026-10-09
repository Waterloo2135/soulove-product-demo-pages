import { useEffect, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { CHARACTERS, DRAMAS, SESSIONS, characterById } from "../mock";
import { IconBack } from "../components/Icons";
import { useStore } from "../store";

/** Demo default; production cost comes from remote config. */
const REMIX_COST_CONFIG = 45;
const EXTEND_COST_CONFIG = 35;
const MAX_CAST = 3;

type DurationOpt = 5 | 10;
type QualityOpt = "480P" | "720P";
type RemixStatus = "generating" | "ready" | "failed";
type Aspect = "portrait" | "landscape";

type Gender = "female" | "male";

type RemixChar = {
  id: string;
  name: string;
  image: string;
  source: "drama" | "mine" | "recent";
  gender: Gender;
};

type RemixSegment = {
  id: string;
  prompt: string;
  duration: DurationOpt;
  quality: QualityOpt;
  cost: number;
  createdAt: number;
  cover: string;
};

type RemixItem = {
  id: string;
  dramaId: string;
  /** Full story arc after merges */
  prompt: string;
  cover: string;
  /** Last-frame image used when continuing the plot */
  tailFrame: string;
  cast: RemixChar[];
  duration: DurationOpt;
  quality: QualityOpt;
  cost: number;
  status: RemixStatus;
  createdAt: number;
  videoUrl?: string;
  aspect: Aspect;
  /** Total runtime after all extends */
  totalSec: number;
  segments: RemixSegment[];
  extendCount: number;
};

type Phase = "ideas" | "idea-view" | "create" | "library" | "viewer" | "extend";
type RemixGrade = "green" | "soft" | "explicit";
type RemixPlat = "all" | "web" | "ios" | "android";

type RemixIdea = {
  id: string;
  dramaId: string;
  dramaTitle: string;
  author: string;
  prompt: string;
  cover: string;
  tailFrame: string;
  videoUrl: string;
  cast: RemixChar[];
  duration: DurationOpt;
  quality: QualityOpt;
  grade: RemixGrade;
  memberOnly: boolean;
  plats: RemixPlat[];
  aspect: Aspect;
};

/** Ops-configured Remix defaults per drama (demo mock of admin CMS). */
type DramaRemixPreset = {
  id: string;
  /** Character ids bound to this tuned prompt */
  castIds: string[];
  prompt: string;
};

/**
 * Backend shape mock: each short drama has N tuned Remix prompts.
 * castIds + prompt are always shipped together.
 */
const REMIX_PRESETS_BY_DRAMA: Record<string, DramaRemixPreset[]> = {
  d1: [
    {
      id: "d1-p1",
      castIds: ["elena", "maya"],
      prompt:
        "@Elena was shot in the wrist by @Maya. The iron bar flew from her hand, and she stared in terror at the approaching bodyguards.",
    },
    {
      id: "d1-p2",
      castIds: ["elena"],
      prompt: "@Elena freezes as the door opens. She lowers the iron bar, breathing hard, waiting for your next move.",
    },
    {
      id: "d1-p3",
      castIds: ["maya", "elena"],
      prompt: "@Maya pins @Elena against the hallway wall. The camera shakes. Neither of them looks away.",
    },
    {
      id: "d1-p4",
      castIds: ["elena", "maya"],
      prompt: "Rain hits the car roof. @Elena looks at @Maya and whispers the truth she swore she would never say.",
    },
    {
      id: "d1-p5",
      castIds: ["maya"],
      prompt: "@Maya texts you at 2:17 AM: \"Don't come over.\" The door is already unlocked.",
    },
  ],
  d2: [
    {
      id: "d2-p1",
      castIds: ["maya"],
      prompt: "@Maya sends the text she swore she would never send. Your phone lights up the dark bedroom.",
    },
    {
      id: "d2-p2",
      castIds: ["maya"],
      prompt: "@Maya is already at your door. She does not wait for you to unlock it.",
    },
  ],
  d3: [
    {
      id: "d3-p1",
      castIds: ["nora", "luna"],
      prompt: "@Nora and @Luna share one hotel key. Room service knocks. She does not answer.",
    },
    {
      id: "d3-p2",
      castIds: ["luna", "nora"],
      prompt: "The party noise fades. @Luna grabs @Nora's wrist and leads them onto the empty balcony.",
    },
    {
      id: "d3-p3",
      castIds: ["nora"],
      prompt: "@Nora sits on the edge of the bed and asks you to stay until morning.",
    },
  ],
  d4: [
    {
      id: "d4-p1",
      castIds: ["aria"],
      prompt: "@Aria heard you come home. The apartment is small, and she is not wearing much.",
    },
    {
      id: "d4-p2",
      castIds: ["aria"],
      prompt: "@Aria leaves the bathroom light on. She wants you to walk in.",
    },
  ],
  "d-landing": [
    {
      id: "dl-p1",
      castIds: ["elena"],
      prompt: "@Elena looks so well-behaved... until she throws herself at you in the hallway.",
    },
    {
      id: "dl-p2",
      castIds: ["elena"],
      prompt: "@Elena says it was just one drink. The way she looks at you says otherwise.",
    },
  ],
};

const EXTEND_PRESET_TEXTS = [
  (a: string, b?: string) =>
    b
      ? `From the last frame: @${a} and @${b} keep kissing while slowly undressing each other.`
      : `From the last frame: @${a} pulls you closer and the kiss deepens.`,
  (a: string, b?: string) =>
    b
      ? `Continuing the scene: @${a} whispers to @${b}, then leads them toward the bed without breaking eye contact.`
      : `Continuing the scene: @${a} locks the door and comes back to you.`,
  (a: string, b?: string) =>
    b
      ? `Next beat: clothes drop. @${a} and @${b} do not stop kissing.`
      : `Next beat: @${a} climbs on top of you and does not look away.`,
];

function resolveChar(id: string, dramaCast: RemixChar[]): RemixChar | null {
  const fromDrama = dramaCast.find((c) => c.id === id);
  if (fromDrama) return withGender({ ...fromDrama });
  const c = CHARACTERS.find((x) => x.id === id);
  if (!c) return null;
  return withGender({ id: c.id, name: c.name, image: c.image, source: "drama" });
}

function presetsForDrama(dramaId: string, dramaCast: RemixChar[]): Array<{ id: string; cast: RemixChar[]; prompt: string }> {
  const raw = REMIX_PRESETS_BY_DRAMA[dramaId] || REMIX_PRESETS_BY_DRAMA.d1;
  return raw
    .map((preset) => {
      const cast = preset.castIds
        .map((id) => resolveChar(id, dramaCast))
        .filter((x): x is RemixChar => Boolean(x))
        .slice(0, MAX_CAST);
      // Fallback: if configured ids missing, use leading drama cast
      const finalCast = cast.length ? cast : dramaCast.slice(0, Math.min(2, dramaCast.length || 1));
      return { id: preset.id, cast: finalCast, prompt: preset.prompt };
    })
    .filter((p) => p.cast.length > 0);
}

function buildExtendPrompt(templateIndex: number, cast: RemixChar[]): string {
  const a = cast[0]?.name || "Elena";
  const b = cast[1]?.name;
  return EXTEND_PRESET_TEXTS[templateIndex % EXTEND_PRESET_TEXTS.length](a, b);
}


/** Demo gender map — production comes with character profile. */
const CHAR_GENDER: Record<string, Gender> = {
  elena: "female",
  maya: "female",
  nora: "female",
  aria: "female",
  luna: "female",
  sienna: "female",
};

const MALE_AVATAR =
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80";

/** Per-drama male lead (ops). Used when an intent needs a male and cast lacks one. */
const DRAMA_MALE_LEAD: Record<string, { id: string; name: string; image: string }> = {
  d1: { id: "d1-cassian", name: "Cassian", image: MALE_AVATAR },
  d2: { id: "d2-you", name: "You", image: MALE_AVATAR },
  d3: { id: "d3-adrian", name: "Adrian", image: MALE_AVATAR },
  d4: { id: "d4-you", name: "You", image: MALE_AVATAR },
  "d-landing": { id: "dl-you", name: "You", image: MALE_AVATAR },
};

/**
 * Intent chips — labels + templates are ops-configurable.
 * Scheme B: keep cast (auto-fill missing gender), rewrite action prompt.
 */
type RemixIntent = {
  id: string;
  label: string;
  /** Slot genders in template order (A, B, ...) */
  slots: Gender[];
  build: (a: string, b?: string) => string;
};

const REMIX_INTENT_CHIPS: RemixIntent[] = [
  {
    id: "kiss",
    label: "Kiss",
    slots: ["female", "male"],
    build: (a, b) =>
      b
        ? `@${a} pulls @${b} into a deep kiss, hands on his chest, breath close, unwilling to let go.`
        : `@${a} leans in and kisses you hard, slow at first, then deeper.`,
  },
  {
    id: "undress",
    label: "Undress",
    slots: ["female", "male"],
    build: (a, b) =>
      b
        ? `@${a} undresses @${b} piece by piece, eyes locked, clothes dropping to the floor.`
        : `@${a} slowly undresses in front of you, letting each piece fall.`,
  },
  {
    id: "blowjob",
    label: "Blowjob",
    slots: ["female", "male"],
    build: (a, b) =>
      b
        ? `@${a} drops to her knees in front of @${b}, takes him in her mouth, and starts a focused blowjob.`
        : `@${a} kneels, wraps her lips around you, and gives a slow, wet blowjob.`,
  },
  {
    id: "missionary",
    label: "Missionary",
    slots: ["female", "male"],
    build: (a, b) =>
      b
        ? `@${a} lies back for @${b} in missionary, legs open, pulling him deeper with every thrust.`
        : `@${a} lies back under you in missionary, eyes on yours, matching your rhythm.`,
  },
  {
    id: "makeout",
    label: "Make out",
    slots: ["female", "female"],
    build: (a, b) =>
      b
        ? `@${a} and @${b} make out against the wall, hands in hair, breathless between kisses.`
        : `@${a} makes out with you like she has been waiting all night.`,
  },
  {
    id: "against-wall",
    label: "Against wall",
    slots: ["female", "male"],
    build: (a, b) =>
      b
        ? `@${b} pins @${a} against the wall, her leg hooked around him as the kiss turns rough.`
        : `You pin @${a} against the wall; she gasps and pulls you closer.`,
  },
  {
    id: "cowgirl",
    label: "Cowgirl",
    slots: ["female", "male"],
    build: (a, b) =>
      b
        ? `@${a} climbs on top of @${b} in cowgirl, rolling her hips, hands on his shoulders.`
        : `@${a} climbs on top of you in cowgirl and sets the pace.`,
  },
  {
    id: "tease",
    label: "Tease",
    slots: ["female"],
    build: (a) =>
      `@${a} teases you on purpose — slow touches, almost-kisses, watching your reaction.`,
  },
];

function withGender(c: Omit<RemixChar, "gender"> & { gender?: Gender }): RemixChar {
  const g = c.gender || CHAR_GENDER[c.id] || (c.id.includes("you") || c.id.includes("male") || c.id.includes("cassian") || c.id.includes("adrian") ? "male" : "female");
  return { ...c, gender: g };
}

function dramaMaleLead(dramaId: string): RemixChar {
  const m = DRAMA_MALE_LEAD[dramaId] || DRAMA_MALE_LEAD.d1;
  return withGender({ id: m.id, name: m.name, image: m.image, source: "drama", gender: "male" });
}

/** Ensure cast satisfies intent slot genders; prefer keeping current picks (scheme B). */
function ensureCastForIntent(
  intent: RemixIntent,
  current: RemixChar[],
  pool: RemixChar[],
  dramaId: string
): RemixChar[] {
  const next = current.map((c) => withGender(c));
  const fullPool = uniqueChars([...pool.map(withGender), dramaMaleLead(dramaId)]);

  const countGender = (list: RemixChar[], g: Gender) => list.filter((c) => c.gender === g).length;
  const need: Record<Gender, number> = { female: 0, male: 0 };
  for (const g of intent.slots) need[g] += 1;

  for (const g of ["female", "male"] as Gender[]) {
    while (countGender(next, g) < need[g] && next.length < MAX_CAST) {
      const candidate =
        fullPool.find((c) => c.gender === g && !next.some((x) => x.id === c.id)) ||
        null;
      if (!candidate) break;
      next.push(candidate);
    }
  }

  // Order names for template slots: pick matching gender in slot order without reuse
  const used = new Set<string>();
  const ordered: RemixChar[] = [];
  for (const g of intent.slots) {
    const hit = next.find((c) => c.gender === g && !used.has(c.id));
    if (hit) {
      used.add(hit.id);
      ordered.push(hit);
    }
  }
  // Keep any extras after ordered (up to MAX)
  for (const c of next) {
    if (!used.has(c.id) && ordered.length < MAX_CAST) {
      used.add(c.id);
      ordered.push(c);
    }
  }
  return ordered.slice(0, MAX_CAST);
}

function buildIntentPrompt(intent: RemixIntent, cast: RemixChar[]): string {
  const a = cast[0]?.name || "Her";
  const b = cast[1]?.name;
  return intent.build(a, b);
}

/**
 * Horizontal chip scroller.
 * - Touch: native overflow-x pan (clicks stay on buttons)
 * - Mouse: drag only after 8px threshold (tap still clicks)
 * - Wheel/trackpad: map to horizontal
 */
function HScroll({ className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointerId: number | null;
    startX: number;
    startLeft: number;
    dragging: boolean;
  }>({ pointerId: null, startX: 0, startLeft: 0, dragging: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const THRESHOLD = 8;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth + 1) return;
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!dx) return;
      e.preventDefault();
      el.scrollLeft += dx;
    };

    // Mouse-only drag. Touch keeps native scrolling + native clicks.
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startLeft: el.scrollLeft,
        dragging: false,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (drag.current.pointerId !== e.pointerId) return;
      const delta = e.clientX - drag.current.startX;
      if (!drag.current.dragging) {
        if (Math.abs(delta) < THRESHOLD) return;
        drag.current.dragging = true;
        el.classList.add("is-dragging");
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      el.scrollLeft = drag.current.startLeft - delta;
      e.preventDefault();
    };

    const endDrag = (e: PointerEvent) => {
      if (drag.current.pointerId !== e.pointerId) return;
      const wasDragging = drag.current.dragging;
      drag.current.pointerId = null;
      drag.current.dragging = false;
      el.classList.remove("is-dragging");
      try {
        if (wasDragging) el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      if (wasDragging) {
        // One-shot: block the synthetic click that follows a drag, not normal taps.
        const block = (ev: Event) => {
          ev.preventDefault();
          ev.stopPropagation();
          el.removeEventListener("click", block, true);
        };
        el.addEventListener("click", block, true);
        window.setTimeout(() => el.removeEventListener("click", block, true), 50);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("pointerleave", endDrag);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("pointerleave", endDrag);
    };
  }, []);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}

function uniqueChars(list: RemixChar[]): RemixChar[] {
  const seen = new Set<string>();
  return list.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}


function highlightPrompt(text: string, names: string[]) {
  if (!text) return null;
  const escaped = names
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) return text;
  const re = new RegExp("(@(?:" + escaped.join("|") + "))", "g");
  const parts = text.split(re);
  return parts.map((part, idx) =>
    part.startsWith("@") && names.some((n) => part === "@" + n) ? (
      <span key={idx} className="rx-mention">
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

function costFor(duration: DurationOpt, quality: QualityOpt, base: number) {
  let cost = base;
  if (duration === 10) cost += 20;
  if (quality === "720P") cost += 15;
  return cost;
}


function ideaCast(id: string, source: RemixChar["source"] = "drama"): RemixChar | null {
  const c = CHARACTERS.find((x) => x.id === id);
  if (!c) return null;
  return withGender({ id: c.id, name: c.name, image: c.image, source });
}

function seedIdeas(): RemixIdea[] {
  const clips = [
    "https://d2tntkfu60is0z.cloudfront.net/sl/config/335bcdd7c8fb408287b3c0904f742e70.mp4",
    "https://d2tntkfu60is0z.cloudfront.net/sl/config/b8118ff064574df18409b61b692820ef.mp4",
    "https://d2tntkfu60is0z.cloudfront.net/sl/config/bbfe026ad76349aaaa63b0e75d9c06f1.mp4",
    "https://d2tntkfu60is0z.cloudfront.net/sl/config/15754461a4864cb08197a2d05b7a8b22.mp4",
    "https://d2tntkfu60is0z.cloudfront.net/sl/config/b088ef7be9c8493bb1b638f4734ed64b.mp4",
  ];
  const elena = ideaCast("elena")!;
  const maya = ideaCast("maya")!;
  const nora = ideaCast("nora")!;
  const luna = ideaCast("luna")!;
  const aria = ideaCast("aria")!;
  return [
    {
      id: "idea-d1-green", aspect: "portrait" as Aspect,
      dramaId: "d1",
      dramaTitle: "She Moved In Next Door",
      author: "Studio pick",
      prompt: "@Elena leaves the door unlocked. She looks back once, then lets you follow her in.",
      cover: CHARACTERS[0].image,
      tailFrame: CHARACTERS[0].image,
      videoUrl: clips[0],
      cast: [elena],
      duration: 5,
      quality: "480P",
      grade: "green",
      memberOnly: false,
      plats: ["all"],
    },
    {
      id: "idea-d1-soft", aspect: "portrait" as Aspect,
      dramaId: "d1",
      dramaTitle: "She Moved In Next Door",
      author: "@nate",
      prompt: "@Elena pins @Maya against the hallway wall. The kiss is slow, then she pulls her closer.",
      cover: CHARACTERS[1].image,
      tailFrame: CHARACTERS[1].image,
      videoUrl: clips[1],
      cast: [elena, maya],
      duration: 5,
      quality: "480P",
      grade: "soft",
      memberOnly: false,
      plats: ["all"],
    },
    {
      id: "idea-d1-explicit", aspect: "landscape" as Aspect,
      dramaId: "d1",
      dramaTitle: "She Moved In Next Door",
      author: "@milo",
      prompt: "@Elena drops to her knees in front of @Cassian, takes him in her mouth, and starts a focused blowjob.",
      cover: CHARACTERS[0].image,
      tailFrame: CHARACTERS[0].image,
      videoUrl: clips[2],
      cast: [elena],
      duration: 10,
      quality: "720P",
      grade: "explicit",
      memberOnly: true,
      plats: ["all"],
    },
    {
      id: "idea-d1-soft-2", aspect: "portrait" as Aspect,
      dramaId: "d1",
      dramaTitle: "She Moved In Next Door",
      author: "Studio pick",
      prompt: "@Maya undresses in the kitchen light. She does not look away when you step closer.",
      cover: CHARACTERS[1].image,
      tailFrame: CHARACTERS[1].image,
      videoUrl: clips[3],
      cast: [maya],
      duration: 5,
      quality: "480P",
      grade: "soft",
      memberOnly: false,
      plats: ["web", "android"],
    },
    {
      id: "idea-d1-blur-p", aspect: "portrait" as Aspect,
      dramaId: "d1",
      dramaTitle: "She Moved In Next Door",
      author: "@leo",
      prompt: "@Elena lies back under you in missionary, eyes on yours, matching your rhythm.",
      cover: CHARACTERS[0].image,
      tailFrame: CHARACTERS[0].image,
      videoUrl: clips[4],
      cast: [elena],
      duration: 10,
      quality: "720P",
      grade: "explicit",
      memberOnly: true,
      plats: ["all"],
    },
    {
      id: "idea-d1-blur-p2", aspect: "portrait" as Aspect,
      dramaId: "d1",
      dramaTitle: "She Moved In Next Door",
      author: "Studio pick",
      prompt: "@Maya climbs on top of you in cowgirl and sets the pace.",
      cover: CHARACTERS[1].image,
      tailFrame: CHARACTERS[1].image,
      videoUrl: clips[0],
      cast: [maya],
      duration: 5,
      quality: "480P",
      grade: "explicit",
      memberOnly: true,
      plats: ["all"],
    },
    {
      id: "idea-d3-green", aspect: "landscape" as Aspect,
      dramaId: "d3",
      dramaTitle: "Hotel After Midnight",
      author: "@kira",
      prompt: "@Nora and @Luna share one hotel key. Room service knocks. She does not answer.",
      cover: CHARACTERS[2].image,
      tailFrame: CHARACTERS[4].image,
      videoUrl: clips[1],
      cast: [nora, luna],
      duration: 5,
      quality: "720P",
      grade: "green",
      memberOnly: false,
      plats: ["all"],
    },
    {
      id: "idea-d4-explicit", aspect: "portrait" as Aspect,
      dramaId: "d4",
      dramaTitle: "Secret Roommate",
      author: "Studio pick",
      prompt: "@Aria climbs on top of you in cowgirl and sets the pace, eyes locked on yours.",
      cover: CHARACTERS[3].image,
      tailFrame: CHARACTERS[3].image,
      videoUrl: clips[2],
      cast: [aria],
      duration: 10,
      quality: "720P",
      grade: "explicit",
      memberOnly: true,
      plats: ["all"],
    },
    {
      id: "idea-d3-p2", aspect: "portrait" as Aspect,
      dramaId: "d3",
      dramaTitle: "Hotel After Midnight",
      author: "@jun",
      prompt: "@Luna pulls @Nora onto the balcony. The city lights hit her dress as they kiss.",
      cover: CHARACTERS[4].image,
      tailFrame: CHARACTERS[4].image,
      videoUrl: clips[1],
      cast: [luna, nora],
      duration: 5,
      quality: "480P",
      grade: "soft",
      memberOnly: false,
      plats: ["all"],
    },
    {
      id: "idea-d4-p2", aspect: "portrait" as Aspect,
      dramaId: "d4",
      dramaTitle: "Secret Roommate",
      author: "Studio pick",
      prompt: "@Aria heard you come home. The apartment is small, and she is not wearing much.",
      cover: CHARACTERS[3].image,
      tailFrame: CHARACTERS[3].image,
      videoUrl: clips[2],
      cast: [aria],
      duration: 5,
      quality: "480P",
      grade: "soft",
      memberOnly: false,
      plats: ["all"],
    },
    {
      id: "idea-d2-more", aspect: "landscape" as Aspect,
      dramaId: "d2",
      dramaTitle: "Don't Text Your Ex",
      author: "@eve",
      prompt: "@Maya sends the text she swore she would never send. Your phone lights up the dark bedroom.",
      cover: CHARACTERS[1].image,
      tailFrame: CHARACTERS[1].image,
      videoUrl: clips[3],
      cast: [maya],
      duration: 5,
      quality: "480P",
      grade: "green",
      memberOnly: false,
      plats: ["all"],
    },
    {
      id: "idea-ios-only", aspect: "portrait" as Aspect,
      dramaId: "d2",
      dramaTitle: "Don't Text Your Ex",
      author: "Ops hidden",
      prompt: "This card is iOS-only in CMS and should not show on web demo.",
      cover: CHARACTERS[1].image,
      tailFrame: CHARACTERS[1].image,
      videoUrl: clips[3],
      cast: [maya],
      duration: 5,
      quality: "480P",
      grade: "soft",
      memberOnly: false,
      plats: ["ios"],
    },
  ];
}

function ideaToRemix(idea: RemixIdea): RemixItem {
  return {
    id: idea.id,
    dramaId: idea.dramaId,
    prompt: idea.prompt,
    cover: idea.cover,
    tailFrame: idea.tailFrame,
    cast: idea.cast.map((c) => ({ ...c })),
    duration: idea.duration,
    quality: idea.quality,
    cost: 0,
    status: "ready",
    createdAt: Date.now(),
    videoUrl: idea.videoUrl,
    aspect: idea.aspect,
    totalSec: idea.duration,
    extendCount: 0,
    segments: [
      {
        id: idea.id + "-s1",
        prompt: idea.prompt,
        duration: idea.duration,
        quality: idea.quality,
        cost: 0,
        createdAt: Date.now(),
        cover: idea.cover,
      },
    ],
  };
}

function seedRemixes(): RemixItem[] {
  const elena = withGender({ id: "elena", name: "Elena", image: CHARACTERS[0].image, source: "drama" as const });
  const maya = withGender({ id: "maya", name: "Maya", image: CHARACTERS[1].image, source: "drama" as const });
  const nora = withGender({ id: "nora", name: "Nora", image: CHARACTERS[2].image, source: "mine" as const });
  const luna = withGender({ id: "luna", name: "Luna", image: CHARACTERS[4].image, source: "mine" as const });
  const clip = DRAMAS[0].firstEpisodeUrl;
  return [
    {
      id: "seed-1",
      dramaId: "d1",
      prompt: "@Elena pulls you inside. The door clicks shut behind you.",
      cover: CHARACTERS[0].image,
      tailFrame: CHARACTERS[0].image,
      cast: [elena],
      duration: 5,
      quality: "480P",
      cost: 45,
      status: "ready",
      createdAt: Date.now() - 86400000,
      videoUrl: clip,
      aspect: "portrait",
      totalSec: 5,
      extendCount: 0,
      segments: [
        {
          id: "seed-1-s1",
          prompt: "@Elena pulls you inside. The door clicks shut behind you.",
          duration: 5,
          quality: "480P",
          cost: 45,
          createdAt: Date.now() - 86400000,
          cover: CHARACTERS[0].image,
        },
      ],
    },
    {
      id: "seed-2",
      dramaId: "d3",
      prompt: "@Nora and @Luna share one hotel key. Then they keep going — clothes on the floor, still kissing.",
      cover: CHARACTERS[2].image,
      tailFrame: CHARACTERS[1].image,
      cast: [nora, luna],
      duration: 5,
      quality: "720P",
      cost: 160,
      status: "ready",
      createdAt: Date.now() - 172800000,
      videoUrl: clip,
      aspect: "landscape",
      totalSec: 15,
      extendCount: 2,
      segments: [
        {
          id: "seed-2-s1",
          prompt: "@Nora and @Luna share one hotel key.",
          duration: 5,
          quality: "720P",
          cost: 60,
          createdAt: Date.now() - 172800000,
          cover: CHARACTERS[2].image,
        },
        {
          id: "seed-2-s2",
          prompt: "From the last frame: they keep kissing while undressing each other.",
          duration: 5,
          quality: "720P",
          cost: 50,
          createdAt: Date.now() - 172000000,
          cover: CHARACTERS[4].image,
        },
        {
          id: "seed-2-s3",
          prompt: "Next beat: clothes drop. They do not stop kissing.",
          duration: 5,
          quality: "720P",
          cost: 50,
          createdAt: Date.now() - 171000000,
          cover: CHARACTERS[1].image,
        },
      ],
    },
    {
      id: "seed-3",
      dramaId: "d1",
      prompt: "@Elena and @Maya freeze as the bodyguards approach.",
      cover: CHARACTERS[1].image,
      tailFrame: CHARACTERS[1].image,
      cast: [elena, maya],
      duration: 5,
      quality: "480P",
      cost: 45,
      status: "ready",
      createdAt: Date.now() - 200000000,
      videoUrl: clip,
      aspect: "portrait",
      totalSec: 5,
      extendCount: 0,
      segments: [
        {
          id: "seed-3-s1",
          prompt: "@Elena and @Maya freeze as the bodyguards approach.",
          duration: 5,
          quality: "480P",
          cost: 45,
          createdAt: Date.now() - 200000000,
          cover: CHARACTERS[1].image,
        },
      ],
    },
  ];
}


function segmentStarts(segments: RemixSegment[]): number[] {
  const starts: number[] = [];
  let t = 0;
  for (const seg of segments) {
    starts.push(t);
    t += seg.duration;
  }
  return starts;
}

function activeSegmentIndex(currentSec: number, segments: RemixSegment[]): number {
  if (!segments.length) return 0;
  const total = segments.reduce((sum, s) => sum + s.duration, 0) || 1;
  let t = ((currentSec % total) + total) % total;
  let acc = 0;
  for (let i = 0; i < segments.length; i++) {
    acc += segments[i].duration;
    if (t < acc) return i;
  }
  return segments.length - 1;
}


function RemixViewer({
  item,
  fallbackUrl,
  playing,
  setPlaying,
  onBack,
  onExtend,
  onRemix,
  canExtend,
  locked,
  author,
}: {
  item: RemixItem;
  fallbackUrl: string;
  playing: boolean;
  setPlaying: (v: boolean | ((p: boolean) => boolean)) => void;
  onBack: () => void;
  onExtend: () => void;
  onRemix: () => void;
  canExtend: boolean;
  locked?: boolean;
  author?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSec, setCurrentSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const starts = useMemo(() => segmentStarts(item.segments), [item.segments]);
  const shotIndex = activeSegmentIndex(currentSec, item.segments);
  const activeSeg = item.segments[shotIndex] || item.segments[0];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => {
      const mediaDur = video.duration || 0;
      setDurationSec(mediaDur);
      // Map real media clock onto the merged story timeline for chip highlight.
      if (mediaDur > 0 && item.totalSec > 0) {
        setCurrentSec((video.currentTime / mediaDur) * item.totalSec);
      } else {
        setCurrentSec(video.currentTime || 0);
      }
    };
    video.addEventListener("timeupdate", sync);
    video.addEventListener("loadedmetadata", sync);
    return () => {
      video.removeEventListener("timeupdate", sync);
      video.removeEventListener("loadedmetadata", sync);
    };
  }, [item.id, item.totalSec]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) void video.play().catch(() => undefined);
    else video.pause();
  }, [playing, item.id]);

  const seekToShot = (index: number) => {
    const video = videoRef.current;
    if (!video) return;
    const start = starts[index] || 0;
    // Map story timeline onto the real media length (demo clip may be shorter than merged total).
    const mediaDur = video.duration || durationSec || item.totalSec || 1;
    const storyTotal = item.totalSec || 1;
    const ratio = Math.min(0.999, start / storyTotal);
    video.currentTime = ratio * mediaDur;
    setCurrentSec(start);
    setPlaying(true);
  };

  const progress = item.totalSec > 0 ? Math.min(1, (currentSec % item.totalSec) / item.totalSec) : 0;

  return (
    <div className="rx-viewer">
      <video
        ref={videoRef}
        className={"rx-viewer-video" + (locked ? " rx-idea-media-blur" : "")}
        src={item.videoUrl || fallbackUrl}
        poster={activeSeg?.cover || item.cover}
        muted
        loop
        playsInline
        onClick={() => setPlaying((v) => !v)}
      />
      {locked ? <div className="rx-idea-mosaic" /> : null}
      <div className="rx-viewer-fog" />
      <div className="rx-viewer-top">
        <button className="rx-back" onClick={onBack} aria-label="Back">
          <IconBack />
        </button>
        <div className="rx-viewer-meta">
          <b>
            {item.totalSec}s · {item.quality}
          </b>
          <span>
            {author ||
              (item.segments.length > 1 ? item.segments.length + " shots merged" : "Original shot")}
            {item.status === "generating" ? " · generating" : ""}
          </span>
        </div>
        <span className="rx-back ghost" />
      </div>
      {!playing ? (
        <button className="rx-viewer-play" onClick={() => setPlaying(true)}>
          ▶
        </button>
      ) : null}
      <div className="rx-viewer-bottom">
        <div className="rx-viewer-cast">
          {item.cast.map((c) => (
            <img key={c.id} src={c.image} alt="" />
          ))}
        </div>
        <p className="rx-viewer-prompt">{activeSeg?.prompt || item.prompt}</p>
        <div className="rx-viewer-bar">
          <i style={{ width: progress * 100 + "%" }} />
        </div>
        {item.segments.length > 1 ? (
          <div className="rx-shot-scroll" style={{ margin: "8px 0 10px" }}>
            {item.segments.map((seg, i) => (
              <button
                key={seg.id}
                className={"rx-shot-chip" + (i === shotIndex ? " on" : "")}
                onClick={() => seekToShot(i)}
              >
                <img src={seg.cover} alt="" />
                <em>#{i + 1}</em>
                <small>{seg.duration}s</small>
              </button>
            ))}
          </div>
        ) : null}
        <div className="rx-idea-actions rx-idea-actions-lg">
          <button className="rx-tile-extend" disabled={!canExtend} onClick={onExtend}>
            Extend
          </button>
          <button className="rx-idea-use" onClick={onRemix}>
            Remix
          </button>
        </div>
      </div>
    </div>
  );
}

function IdeaFeedClip({
  idea,
  locked,
  onOpen,
}: {
  idea: RemixIdea;
  locked: boolean;
  onOpen: () => void;
}) {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.55)),
      { threshold: [0.55] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const autoplay = inView;

  return (
    <button ref={wrapRef} className="rx-idea-media" onClick={onOpen}>
      {autoplay ? (
        <video
          src={idea.videoUrl}
          poster={idea.cover}
          autoPlay
          muted
          loop
          playsInline
          className={locked ? "rx-idea-media-blur" : undefined}
        />
      ) : (
        <img src={idea.cover} alt="" className={locked ? "rx-idea-media-blur" : undefined} />
      )}
      {locked ? <div className="rx-idea-mosaic" /> : null}
    </button>
  );
}
export function DramaRemixScreen() {
  const store = useStore();
  const drama = DRAMAS.find((item) => item.id === store.current.params?.id) || DRAMAS[0];
  const startOnLibrary = store.current.params?.view === "library";
  const startExtendId = store.current.params?.extendId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const dramaCast = useMemo(() => {
    const females = drama.actors.map((actor) => {
      const linked = CHARACTERS.find((c) => c.id === actor.characterId);
      return withGender({
        id: actor.characterId,
        name: actor.name,
        image: linked?.image || actor.avatar,
        source: "drama" as const,
        gender: "female",
      });
    });
    // Full drama roster for Remix/Extend chips: heroines + configured male lead
    return uniqueChars([...females, dramaMaleLead(drama.id)]);
  }, [drama]);

  const recentPool = useMemo(
    () =>
      uniqueChars(
        SESSIONS.map((s) => {
          const c = characterById(s.characterId);
          return withGender({ id: c.id, name: c.name, image: c.image, source: "recent" as const });
        })
      ),
    []
  );

  const minePool = useMemo(
    () =>
      uniqueChars(
        CHARACTERS.map((c) =>
          withGender({
            id: c.id,
            name: c.name,
            image: c.image,
            source: "mine" as const,
          })
        )
      ),
    []
  );

  const dramaPresets = useMemo(() => presetsForDrama(drama.id, dramaCast), [drama.id, dramaCast]);
  const defaultPreset = dramaPresets[0] || {
    id: "fallback",
    cast: dramaCast.slice(0, Math.min(2, dramaCast.length || 1)),
    prompt: "",
  };

  const [phase, setPhase] = useState<Phase>(() => {
    if (startExtendId) return "extend";
    if (startOnLibrary) return "library";
    if (store.current.params?.view === "create") return "create";
    return "ideas";
  });
  const [cast, setCast] = useState<RemixChar[]>(() => defaultPreset.cast.map((c) => ({ ...c })));
  const [promptIndex, setPromptIndex] = useState(0);
  const [prompt, setPrompt] = useState(() => defaultPreset.prompt);
  const [editing, setEditing] = useState(false);
  const [duration, setDuration] = useState<DurationOpt>(5);
  const [quality, setQuality] = useState<QualityOpt>("480P");
  const [specOpen, setSpecOpen] = useState(false);
  const [atPickerOpen, setAtPickerOpen] = useState(false);
  const [rosterOpen, setRosterOpen] = useState(false);
  const [rosterTab, setRosterTab] = useState<"drama" | "chats" | "mine">("drama");
  const [remixes, setRemixes] = useState<RemixItem[]>(() => seedRemixes());
  const [activeId, setActiveId] = useState<string | null>(startExtendId || null);
  const [viewerPlaying, setViewerPlaying] = useState(true);
  const [activeIntentId, setActiveIntentId] = useState<string | null>(null);
  const [ideas] = useState<RemixIdea[]>(() => seedIdeas());
  const [openPromptId, setOpenPromptId] = useState<string | null>(null);
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);

  const activeItem = remixes.find((r) => r.id === activeId) || null;
  const isExtend = phase === "extend";
  const castNames = cast.map((c) => c.name);
  const costBase = isExtend ? EXTEND_COST_CONFIG : REMIX_COST_CONFIG;
  const cost = costFor(duration, quality, costBase);

  // Re-bind create defaults when drama changes (ops config per title)
  useEffect(() => {
    if (phase !== "create") return;
    if (!dramaPresets.length) return;
    const preset = dramaPresets[0];
    setPromptIndex(0);
    setCast(preset.cast.map((c) => ({ ...c })));
    setPrompt(preset.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drama.id]);

  useEffect(() => {
    const timers = remixes
      .filter((item) => item.status === "generating")
      .map((item) =>
        window.setTimeout(() => {
          setRemixes((list) =>
            list.map((row) =>
              row.id === item.id
                ? {
                    ...row,
                    status: "ready" as const,
                    videoUrl: drama.firstEpisodeUrl,
                    tailFrame: row.cast[row.cast.length - 1]?.image || row.cover,
                  }
                : row
            )
          );
        }, 3800)
      );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [remixes, drama.firstEpisodeUrl]);

  const applyPreset = (index: number) => {
    // Refresh is allowed to overwrite an applied Intent.
    setActiveIntentId(null);
    if (isExtend) {
      const next = index % EXTEND_PRESET_TEXTS.length;
      setPromptIndex(next);
      setPrompt(buildExtendPrompt(next, cast));
      setEditing(false);
      return;
    }
    if (!dramaPresets.length) return;
    const next = ((index % dramaPresets.length) + dramaPresets.length) % dramaPresets.length;
    const preset = dramaPresets[next];
    setPromptIndex(next);
    setCast(preset.cast.map((c) => withGender(c)));
    setPrompt(preset.prompt);
    setEditing(false);
  };

  /** Scheme B: keep cast, auto-fill missing male/female from drama roster, rewrite action prompt. */
  const applyIntent = (intent: RemixIntent) => {
    const filled = ensureCastForIntent(intent, cast, dramaCast, drama.id);
    if (filled.length < intent.slots.length) {
      store.toast("Not enough cast for this act");
      return;
    }
    setCast(filled);
    setPrompt(buildIntentPrompt(intent, filled));
    setActiveIntentId(intent.id);
    setEditing(false);
  };

  const openMentionPicker = () => {
    if (cast.length === 0) {
      store.toast("Add a character first");
      setRosterOpen(true);
      return;
    }
    setAtPickerOpen(true);
  };

  const insertMention = (item: RemixChar) => {
    const insert = "@" + item.name;
    setPrompt((prev) => {
      let base = prev.replace(/@\s*$/, "").trimEnd();
      if (base.includes(insert)) return base.endsWith(insert) ? base + " " : prev.replace(/@\s*$/, "");
      if (!base) return insert + " ";
      return base + " " + insert + " ";
    });
    setEditing(true);
    window.setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const addToCast = (item: RemixChar, opts?: { mention?: boolean }) => {
    if (cast.some((c) => c.id === item.id)) {
      if (opts?.mention) insertMention(item);
      setRosterOpen(false);
      return;
    }
    if (cast.length >= MAX_CAST) {
      store.toast("Up to " + MAX_CAST + " characters");
      return;
    }
    setCast((prev) => [...prev, item]);
    if (opts?.mention !== false) insertMention(item);
    setRosterOpen(false);
  };

  const removeCharacter = (id: string) => {
    const target = cast.find((c) => c.id === id);
    setCast((prev) => prev.filter((c) => c.id !== id));
    if (target) {
      setPrompt((prev) =>
        prev
          .replace(new RegExp("@" + target.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g"), "")
          .replace(/\s{2,}/g, " ")
          .trim()
      );
    }
  };

  const openExtend = (item: RemixItem) => {
    if (item.status !== "ready") {
      store.toast("Wait until this remix is ready");
      return;
    }
    setActiveId(item.id);
    setCast(item.cast.map((c) => ({ ...c })));
    setDuration(5);
    setQuality(item.quality);
    setPromptIndex(0);
    setPrompt(buildExtendPrompt(0, item.cast));
    setEditing(false);
    setPhase("extend");
  };

  const openViewer = (item: RemixItem) => {
    setActiveId(item.id);
    setViewerPlaying(item.status === "ready");
    setPhase("viewer");
  };

  const handleGenerate = () => {
    store.requireUser(() => {
      if (!prompt.trim()) {
        store.toast("Write a scene first");
        return;
      }
      if (cast.length < 1) {
        store.toast("Pick at least 1 character");
        return;
      }
      if (!store.requirePlus("remixGenerate")) return;
      if (store.gems < cost) {
        store.dispatch({ type: "openOverlay", overlay: { type: "gems" } });
        return;
      }
      store.dispatch({ type: "setGems", gems: store.gems - cost });

      if (isExtend && activeItem) {
        const seg: RemixSegment = {
          id: activeItem.id + "-s" + (activeItem.segments.length + 1),
          prompt: prompt.trim(),
          duration,
          quality,
          cost,
          createdAt: Date.now(),
          cover: activeItem.tailFrame,
        };
        setRemixes((list) =>
          list.map((row) => {
            if (row.id !== activeItem.id) return row;
            return {
              ...row,
              status: "generating" as const,
              prompt: row.prompt + " → " + prompt.trim(),
              duration,
              quality,
              cost: row.cost + cost,
              totalSec: row.totalSec + duration,
              extendCount: row.extendCount + 1,
              segments: [...row.segments, seg],
              // keep showing last frame while generating the merged cut
              cover: row.tailFrame,
            };
          })
        );
        setPhase("library");
        store.toast("Extend shot · -" + cost + " Gems · will merge");
        return;
      }

      const id = "rx-" + Date.now();
      const aspect: Aspect = Math.random() > 0.35 ? "portrait" : "landscape";
      const item: RemixItem = {
        id,
        dramaId: drama.id,
        prompt: prompt.trim(),
        cover: cast[0].image,
        tailFrame: cast[cast.length - 1]?.image || cast[0].image,
        cast: [...cast],
        duration,
        quality,
        cost,
        status: "generating",
        createdAt: Date.now(),
        aspect,
        totalSec: duration,
        extendCount: 0,
        segments: [
          {
            id: id + "-s1",
            prompt: prompt.trim(),
            duration,
            quality,
            cost,
            createdAt: Date.now(),
            cover: cast[0].image,
          },
        ],
      };
      setRemixes((list) => [item, ...list]);
      setActiveId(id);
      setPhase("library");
      store.toast("Remix started · -" + cost + " Gems");
    });
  };

  const title =
    phase === "library"
      ? "My Remixes"
      : phase === "viewer"
        ? "Remix"
        : phase === "extend"
          ? "Extend scene"
          : phase === "ideas"
            ? "Inspiration"
            : "Remix";

  const onBack = () => {
    if (phase === "viewer" || phase === "extend") {
      setPhase("library");
      return;
    }
    if (phase === "idea-view") {
      setPhase("ideas");
      setActiveIdeaId(null);
      return;
    }
    if (phase === "create" || phase === "library") {
      setPhase("ideas");
      return;
    }
    store.back();
  };

  const goCreate = () => {
    setCast(defaultPreset.cast.map((c) => ({ ...c })));
    setPrompt(defaultPreset.prompt);
    setPromptIndex(0);
    setActiveIntentId(null);
    setPhase("create");
  };

  const extendFromIdea = (idea: RemixIdea) => {
    const item = ideaToRemix(idea);
    setRemixes((list) => (list.some((row) => row.id === item.id) ? list : [item, ...list]));
    openExtend(item);
  };

  const demoPlat: RemixPlat = "web";
  const visibleIdeas = ideas.filter((idea) => idea.plats.includes("all") || idea.plats.includes(demoPlat));
  const thisDramaIdeas = visibleIdeas.filter((idea) => idea.dramaId === drama.id);
  const otherIdeas = visibleIdeas.filter((idea) => idea.dramaId !== drama.id);
  const canWatchFull = (idea: RemixIdea) => !idea.memberOnly || store.persona === "plus";



  const openIdea = (idea: RemixIdea) => {
    if (!canWatchFull(idea)) {
      store.requirePlus("unlockBlur");
      return;
    }
    setActiveIdeaId(idea.id);
    setPhase("idea-view");
  };

  const useIdeaPrompt = (idea: RemixIdea) => {
    setCast(idea.cast.map((c) => ({ ...c })));
    setPrompt(idea.prompt);
    setActiveIntentId(null);
    setPhase("create");
  };

  const renderIdeaCard = (idea: RemixIdea) => {
    const locked = !canWatchFull(idea);
    const promptOpen = openPromptId === idea.id;
    return (
      <article key={idea.id} className={"rx-idea-card rx-tile rx-tile-" + idea.aspect + (locked ? " locked" : "")}>
        <IdeaFeedClip
          idea={idea}
          locked={locked}
          onOpen={() => openIdea(idea)}
        />
        <div className="rx-idea-body">
          <div className="rx-idea-meta">
            <div className="rx-lib-cast">
              {idea.cast.slice(0, 3).map((c) => (
                <img key={c.id} src={c.image} alt="" />
              ))}
            </div>
            <small>{idea.author} · {idea.duration}s</small>
          </div>
          <p className={"rx-idea-prompt" + (promptOpen ? " open" : "")}>{idea.prompt}</p>
          <button className="rx-idea-prompt-toggle" onClick={() => setOpenPromptId((id) => (id === idea.id ? null : idea.id))}>
            {promptOpen ? "Hide prompt" : "Full prompt"}
          </button>
          <div className="rx-idea-actions">
            <button className="rx-tile-extend" onClick={() => extendFromIdea(idea)}>
              Extend
            </button>
            <button className="rx-idea-use" onClick={() => useIdeaPrompt(idea)}>
              Remix
            </button>
          </div>
        </div>
      </article>
    );
  };

  const activeIdea = ideas.find((idea) => idea.id === activeIdeaId) || null;

  // ---------- Viewer (merged long video + shot chips) ----------
  if (phase === "idea-view" && activeIdea) {
    const locked = !canWatchFull(activeIdea);
    return (
      <RemixViewer
        item={ideaToRemix(activeIdea)}
        fallbackUrl={activeIdea.videoUrl}
        playing={viewerPlaying}
        setPlaying={setViewerPlaying}
        onBack={onBack}
        onExtend={() => extendFromIdea(activeIdea)}
        onRemix={() => useIdeaPrompt(activeIdea)}
        canExtend={!locked}
        locked={locked}
        author={activeIdea.author}
      />
    );
  }

  if (phase === "viewer" && activeItem) {
    return (
      <RemixViewer
        item={activeItem}
        fallbackUrl={drama.firstEpisodeUrl}
        playing={viewerPlaying}
        setPlaying={setViewerPlaying}
        onBack={onBack}
        onExtend={() => openExtend(activeItem)}
        onRemix={() => {
          setCast(activeItem.cast.map((c) => ({ ...c })));
          setPrompt(activeItem.prompt);
          setActiveIntentId(null);
          setPhase("create");
        }}
        canExtend={activeItem.status === "ready"}
      />
    );
  }

  // ---------- Create / Extend editor ----------
  const editor = (
    <>
      <div className="rx-body">
        {!isExtend ? (
          <button className="rx-my-remixes" onClick={() => setPhase("library")}>
            <span className="rx-my-ico">🎬</span>
            <em>My Remixes</em>
            <i>›</i>
          </button>
        ) : null}

        {isExtend && activeItem ? (
          <div className="rx-extend-anchor">
            <div className="rx-extend-dual">
              <div className="rx-extend-pane rx-extend-pane-video">
                <video
                  src={activeItem.videoUrl || drama.firstEpisodeUrl}
                  poster={activeItem.cover}
                  muted
                  loop
                  autoPlay
                  playsInline
                />
                <span className="rx-extend-pane-label">Current remix</span>
              </div>
              <div className="rx-extend-pane rx-extend-pane-tail">
                <img src={activeItem.tailFrame || activeItem.cover} alt="" />
                <span className="rx-extend-pane-label on">Last frame · start here</span>
              </div>
            </div>
            <p className="rx-extend-hint">Watch the clip, then write what happens after the last frame.</p>
            <p className="rx-extend-prev">
              Previous: {activeItem.prompt.length > 110 ? activeItem.prompt.slice(0, 110) + "…" : activeItem.prompt}
            </p>
            <div className="rx-extend-stats">
              <span>
                {activeItem.totalSec}s total · {activeItem.extendCount + 1} shot
                {activeItem.extendCount ? "s" : ""}
              </span>
              <span>New clip merges into one video</span>
            </div>
          </div>
        ) : null}

        <div className="rx-char-row">
          <button
            className="rx-add-char"
            onClick={() => {
              setRosterTab("drama");
              setRosterOpen(true);
            }}
          >
            <span>+</span>
            <em>Add</em>
          </button>
          <div className="rx-char-scroll-wrap">
            <HScroll className="rx-char-scroll">
              {cast.map((item) => (
                <div key={item.id} className="rx-sel">
                  <div className="rx-sel-ava">
                    <img src={item.image} alt="" />
                    <button className="rx-sel-x" onClick={() => removeCharacter(item.id)} aria-label={"Remove " + item.name}>
                      ×
                    </button>
                  </div>
                  <em>{item.name}</em>
                </div>
              ))}
              {cast.length === 0 ? <span className="rx-sel-hint">Up to {MAX_CAST}</span> : null}
            </HScroll>
          </div>
        </div>

        <div className="rx-prompt-card">
          {isExtend ? <div className="rx-prompt-kicker">What happens next?</div> : null}
          {editing ? (
            <textarea
              ref={textareaRef}
              className="rx-prompt-input"
              value={prompt}
              onChange={(e) => {
                const next = e.target.value;
                const prev = prompt;
                setPrompt(next);
                const pos = e.target.selectionStart ?? next.length;
                const typedAt = next.length >= prev.length && next[pos - 1] === "@";
                if (typedAt) openMentionPicker();
              }}
              onBlur={() => {
                if (!atPickerOpen) setEditing(false);
              }}
              placeholder={isExtend ? "Continue the scene from the last frame..." : "Describe the scene. Use @ to tag characters..."}
              rows={5}
              autoFocus
            />
          ) : (
            <button className="rx-prompt-view" onClick={() => setEditing(true)}>
              {prompt.trim() ? (
                highlightPrompt(prompt, castNames)
              ) : (
                <span className="rx-ph">{isExtend ? "Continue the scene from the last frame..." : "Describe the scene. Use @ to tag characters..."}</span>
              )}
            </button>
          )}

          <div className="rx-intent-wrap">
            <HScroll className="rx-intent-row" aria-label="Quick acts">
              {REMIX_INTENT_CHIPS.map((intent) => (
                <button
                  key={intent.id}
                  type="button"
                  className={"rx-intent-chip" + (activeIntentId === intent.id ? " on" : "")}
                  onClick={() => applyIntent(intent)}
                >
                  {intent.label}
                </button>
              ))}
            </HScroll>
          </div>

          <div className="rx-prompt-tools">
            <button
              className="rx-tool"
              onClick={openMentionPicker}
              aria-label="Mention character"
            >
              @
            </button>
            <button className="rx-tool" onClick={() => applyPreset(promptIndex + 1)} aria-label="Refresh prompt">
              ↻
            </button>
            <button
              className="rx-tool"
              onClick={() => {
                setPrompt("");
                setActiveIntentId(null);
                setEditing(true);
              }}
              aria-label="Clear prompt"
            >
              🗑
            </button>
          </div>
        </div>
      </div>

      <div className="rx-foot">
        <button className="rx-spec" onClick={() => setSpecOpen(true)} aria-label="Duration and quality">
          <b>
            {duration}s · {quality}
          </b>
          <i>›</i>
        </button>
        <button className="rx-generate" onClick={handleGenerate}>
          <span className="rx-cost">✦ {cost}</span>
          {isExtend ? "Extend" : "Generate"}
        </button>
      </div>
    </>
  );

  return (
    <div className="rx-page">
      <div className="rx-top">
        <button className="rx-back" onClick={onBack} aria-label="Back">
          <IconBack />
        </button>
        <div className="rx-title">{title}</div>
        {phase === "library" ? (
          <button className="rx-top-link" onClick={goCreate}>
            Create
          </button>
        ) : phase === "ideas" ? (
          <button className="rx-top-link" onClick={() => setPhase("library")}>
            My Remixes
          </button>
        ) : (
          <span className="rx-back ghost" />
        )}
      </div>

      {phase === "ideas" ? (
        <div className="rx-ideas-page">
          <div className="rx-body rx-ideas">
            <p className="rx-ideas-lead"><strong>Inspiring &amp; Bold</strong>: Beyond the script: See, adapt, create.</p>
            <div className="rx-ideas-kicker">From this drama</div>
            <div className="rx-masonry">{thisDramaIdeas.map(renderIdeaCard)}</div>
            {otherIdeas.length ? (
              <>
                <div className="rx-ideas-split">More from Soulove</div>
                <div className="rx-masonry">{otherIdeas.map(renderIdeaCard)}</div>
              </>
            ) : null}
          </div>
          <div className="rx-ideas-fab">
            <button className="rx-ideas-create" onClick={goCreate}>
              Create Myself
            </button>
          </div>
        </div>
      ) : null}

      {phase === "create" || phase === "extend" ? editor : null}

      {phase === "library" ? (
        <div className="rx-body rx-library">
          {remixes.length === 0 ? (
            <div className="rx-empty-remixes solid">
              <div className="rx-empty-ico">🎬</div>
              <p>No remixes yet. Create your first scene from this drama.</p>
              <button className="rx-empty-cta" onClick={() => setPhase("create")}>
                Start creating
              </button>
            </div>
          ) : (
            <div className="rx-masonry">
              {remixes.map((item) => (
                <article key={item.id} className={"rx-tile rx-tile-" + item.aspect + (item.status === "generating" ? " loading" : "")}>
                  <button className="rx-tile-media" onClick={() => openViewer(item)}>
                    <img src={item.cover} alt="" />
                    {item.status === "generating" ? (
                      <div className="rx-lib-overlay">
                        <div className="rx-spinner" />
                        <span>Generating…</span>
                        <small>
                          {item.duration}s · {item.quality}
                          {item.extendCount > 0 ? " · merging" : ""}
                        </small>
                      </div>
                    ) : (
                      <span className="rx-tile-play">▶</span>
                    )}
                    <div className="rx-lib-badge">
                      {item.totalSec}s · {item.quality}
                      {item.extendCount > 0 ? ` · +${item.extendCount}` : ""}
                    </div>
                  </button>
                  <div className="rx-tile-foot">
                    <div className="rx-lib-cast">
                      {item.cast.slice(0, 3).map((c) => (
                        <img key={c.id} src={c.image} alt="" />
                      ))}
                    </div>
                    <p>{item.prompt}</p>
                    {item.status === "generating" ? (
                      <em className="rx-lib-status">{item.extendCount > 0 ? "Merging extend…" : "In queue"}</em>
                    ) : (
                      <div className="rx-tile-actions">
                        <button className="rx-tile-extend" onClick={() => openExtend(item)}>
                          Extend
                        </button>
                        <button
                          className="rx-idea-use"
                          onClick={() => {
                            setCast(item.cast.map((c) => ({ ...c })));
                            setPrompt(item.prompt);
                            setActiveIntentId(null);
                            setPhase("create");
                          }}
                        >
                          Remix
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
          <button
            className="rx-fab-create"
            onClick={() => {
              setCast(defaultPreset.cast.map((c) => ({ ...c })));
              setPrompt(defaultPreset.prompt);
              setPromptIndex(0);
              setPhase("create");
            }}
          >
            + New Remix
          </button>
        </div>
      ) : null}

      {atPickerOpen ? (
        <div className="rx-picker" onClick={() => setAtPickerOpen(false)}>
          <div className="rx-picker-card" onClick={(e) => e.stopPropagation()}>
            <div className="rx-picker-head">
              <h4>Mention in prompt</h4>
              <button onClick={() => setAtPickerOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <p className="rx-picker-hint">Only characters already added above.</p>
            <div className="rx-picker-list">
              {cast.length === 0 ? (
                <div className="rx-picker-empty">No cast yet. Add characters first.</div>
              ) : (
                cast.map((item) => (
                  <button
                    key={item.id}
                    className="rx-picker-item"
                    onClick={() => {
                      insertMention(item);
                      setAtPickerOpen(false);
                    }}
                  >
                    <img src={item.image} alt="" />
                    <div>
                      <b>@{item.name}</b>
                      <small>Insert mention</small>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}

      {rosterOpen ? (
        <div className="rx-picker" onClick={() => setRosterOpen(false)}>
          <div className="rx-picker-card tall" onClick={(e) => e.stopPropagation()}>
            <div className="rx-picker-head">
              <h4>Add characters</h4>
              <button onClick={() => setRosterOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="rx-roster-tabs">
              <button className={rosterTab === "drama" ? "on" : ""} onClick={() => setRosterTab("drama")}>
                In drama
              </button>
              <button className={rosterTab === "chats" ? "on" : ""} onClick={() => setRosterTab("chats")}>
                Recent chats
              </button>
              <button className={rosterTab === "mine" ? "on" : ""} onClick={() => setRosterTab("mine")}>
                My lovers
              </button>
            </div>
            <div className="rx-picker-list">
              {(rosterTab === "drama" ? dramaCast : rosterTab === "chats" ? recentPool : minePool).map((item) => {
                const selected = cast.some((c) => c.id === item.id);
                const sub = rosterTab === "drama" ? "In this drama" : rosterTab === "chats" ? "Recent chat" : "Your character";
                return (
                  <button
                    key={item.id}
                    className={"rx-picker-item" + (selected ? " on" : "")}
                    onClick={() => addToCast(item, { mention: true })}
                    disabled={selected}
                  >
                    <img src={item.image} alt="" />
                    <div>
                      <b>{item.name}</b>
                      <small>{sub}</small>
                    </div>
                    {selected ? <em>In cast</em> : null}
                  </button>
                );
              })}
              {rosterTab === "mine" ? (
                <button
                  className="rx-picker-item create"
                  onClick={() => {
                    setRosterOpen(false);
                    store.push("create-character");
                  }}
                >
                  <span className="rx-picker-plus">+</span>
                  <div>
                    <b>Create character</b>
                    <small>Bring your own digital human</small>
                  </div>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {specOpen ? (
        <div className="rx-picker" onClick={() => setSpecOpen(false)}>
          <div className="rx-spec-card" onClick={(e) => e.stopPropagation()}>
            <div className="rx-picker-head">
              <h4>Video settings</h4>
              <button onClick={() => setSpecOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="rx-spec-block">
              <div className="rx-spec-label">Duration</div>
              <div className="rx-spec-seg">
                {([5, 10] as DurationOpt[]).map((d) => (
                  <button key={d} className={duration === d ? "on" : ""} onClick={() => setDuration(d)}>
                    {d}s
                  </button>
                ))}
              </div>
            </div>
            <div className="rx-spec-block">
              <div className="rx-spec-label">Quality</div>
              <div className="rx-spec-seg">
                {(["480P", "720P"] as QualityOpt[]).map((q) => (
                  <button key={q} className={quality === q ? "on" : ""} onClick={() => setQuality(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <p className="rx-spec-note">
              Cost preview <b>✦ {cost}</b>
              <span> · final price from config</span>
            </p>
            <button className="rx-spec-done" onClick={() => setSpecOpen(false)}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}



















