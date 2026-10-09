import { useEffect, useMemo, useRef, useState } from "react";
import { CHARACTERS, DRAMAS } from "../mock";
import { useStore } from "../store";
import type { Character, Drama, HomeClassify } from "../types";

const TABS: Array<{ id: HomeClassify; label: string }> = [
  { id: "forYou", label: "For You" },
  { id: "hot", label: "Hot" },
  { id: "new", label: "New" },
  { id: "lover", label: "My Lover" },
];

const DRAMA_BANNERS = [
  "https://d2tntkfu60is0z.cloudfront.net/sl/config/308368efc0104850859df1df1ad1094e.jpeg",
  "https://d2tntkfu60is0z.cloudfront.net/sl/config/e14ae6814a804e048cf9dea4e485191e.png",
  "https://d2tntkfu60is0z.cloudfront.net/sl/config/e5b01cbd881d4677b55658b2e12a1b43.jpg",
  "https://d2tntkfu60is0z.cloudfront.net/sl/config/dd7bebe64a4248d3beae71fb66eddcc4.jpg",
];

const CARD_STRIDE = 316;

type ForYouItem =
  | { kind: "robot"; character: Character }
  | { kind: "drama"; drama: Drama; cover: string };

function buildForYouFeed(includeDrama: boolean): ForYouItem[] {
  const robots = CHARACTERS.filter((item) => item.classify.includes("forYou"));
  const items: ForYouItem[] = [];
  let dramaIdx = 0;
  robots.forEach((character, idx) => {
    items.push({ kind: "robot", character });
    if (includeDrama && (idx + 1) % 3 === 0 && DRAMAS[dramaIdx]) {
      items.push({
        kind: "drama",
        drama: DRAMAS[dramaIdx],
        cover: DRAMAS[dramaIdx].cover || DRAMA_BANNERS[dramaIdx],
      });
      dramaIdx += 1;
    }
  });
  return items;
}

function HomeTabs() {
  const store = useStore();
  return (
    <div className="home-tabs">
      <div className="home-tabs-row">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={"home-tab" + (store.homeTab === tab.id ? " on" : "")}
            onClick={() => store.dispatch({ type: "setHomeTab", tab: tab.id })}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {store.persona === "guest" ? (
        <button className="ui-login home-user-btn" onClick={() => store.requireUser()}>Log in</button>
      ) : (
        <button className="ui-gems home-user-btn" onClick={() => store.push("tokens")}>💎 {store.gems}</button>
      )}
    </div>
  );
}

function DramaBadge() {
  return (
    <div className="drama-badge">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 6V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 12h4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      Drama
    </div>
  );
}

function ForYouFeed() {
  const store = useStore();
  const { dramaPlat } = useStore();
  const feed = useMemo(() => buildForYouFeed(dramaPlat), [dramaPlat]);
  const [index, setIndex] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, pointerId: -1, startX: 0, startLeft: 0, moved: false });
  const current = feed[index] || feed[0];
  const dramaId = current.kind === "drama" ? current.drama.id : null;
  const [dramaPreviewOn, setDramaPreviewOn] = useState(false);
  const previewStartedAt = useRef<number | null>(null);
  const push = store.push;

  const snapTo = (next: number, smooth = true) => {
    const clamped = Math.max(0, Math.min(feed.length - 1, next));
    setIndex(clamped);
    scroller.current?.scrollTo({ left: clamped * CARD_STRIDE, behavior: smooth ? "smooth" : "auto" });
  };

  const finishDrag = (el: HTMLDivElement | null, pointerId?: number) => {
    const state = drag.current;
    if (!state.active) return;
    state.active = false;
    if (el && pointerId != null && el.hasPointerCapture(pointerId)) {
      el.releasePointerCapture(pointerId);
    }
    const next = Math.round((el?.scrollLeft || 0) / CARD_STRIDE);
    snapTo(next);
  };

  const openDramaWatch = (id: string, continuePlay = false) => {
    const playedSec =
      continuePlay && previewStartedAt.current != null
        ? Math.max(0, (Date.now() - previewStartedAt.current) / 1000)
        : 0;
    store.push("short-drama-watch", {
      id,
      autoplay: "1",
      t: String(Math.floor(playedSec)),
    });
  };

  const openItem = (item: ForYouItem) => {
    if (item.kind === "drama") {
      openDramaWatch(item.drama.id, dramaPreviewOn);
      return;
    }
    store.requireUser(() => store.push("chat-room", { id: item.character.id }));
  };

  // Settle on drama card: 1s later preview play, 10s later go detail and continue.
  useEffect(() => {
    setDramaPreviewOn(false);
    previewStartedAt.current = null;
    if (!dramaId) return;

    const playTimer = window.setTimeout(() => {
      setDramaPreviewOn(true);
      previewStartedAt.current = Date.now();
    }, 1000);

    const jumpTimer = window.setTimeout(() => {
      const playedSec =
        previewStartedAt.current != null
          ? Math.max(0, (Date.now() - previewStartedAt.current) / 1000)
          : 0;
      push("short-drama-watch", {
        id: dramaId,
        autoplay: "1",
        t: String(Math.floor(playedSec)),
      });
    }, 10000);

    return () => {
      window.clearTimeout(playTimer);
      window.clearTimeout(jumpTimer);
    };
  }, [dramaId, push]);

  return (
    <div className="foryou">
      <div
        className="foryou-track"
        ref={scroller}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          drag.current = {
            active: true,
            pointerId: e.pointerId,
            startX: e.clientX,
            startLeft: scroller.current?.scrollLeft || 0,
            moved: false,
          };
          scroller.current?.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current.active || drag.current.pointerId !== e.pointerId || !scroller.current) return;
          const dx = e.clientX - drag.current.startX;
          if (Math.abs(dx) > 8) drag.current.moved = true;
          scroller.current.scrollLeft = drag.current.startLeft - dx;
        }}
        onPointerUp={(e) => {
          const moved = drag.current.moved;
          const targetIndex = Math.round((scroller.current?.scrollLeft || 0) / CARD_STRIDE);
          finishDrag(scroller.current, e.pointerId);
          if (!moved) {
            const item = feed[Math.max(0, Math.min(feed.length - 1, targetIndex))];
            if (item) openItem(item);
          }
        }}
        onPointerCancel={(e) => finishDrag(scroller.current, e.pointerId)}
        onLostPointerCapture={() => {
          if (drag.current.active) finishDrag(scroller.current);
        }}
      >
        {feed.map((item, i) =>
          item.kind === "robot" ? (
            <div key={item.character.id} className="foryou-card">
              <img src={item.character.image} alt={item.character.name} draggable={false} />
              {item.character.hasDrama ? <DramaBadge /> : null}
              <div className="foryou-shade">
                <div className="foryou-name">
                  {item.character.name}
                  <span />
                  {item.character.age}
                </div>
                <div className="foryou-tags">
                  {item.character.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <p>{item.character.bio}</p>
              </div>
            </div>
          ) : (
            <div key={"drama-" + item.drama.id} className="foryou-card drama-card">
              {i === index && dramaPreviewOn ? (
                <video
                  className="foryou-video"
                  src={item.drama.firstEpisodeUrl}
                  poster={item.cover}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              ) : (
                <img src={item.cover} alt={item.drama.title} draggable={false} />
              )}
              <DramaBadge />
            </div>
          ),
        )}
      </div>
      <div className="foryou-thumbs">
        {feed.map((item, i) => (
          <button
            key={item.kind === "robot" ? item.character.id : "d-" + item.drama.id}
            className={"foryou-thumb" + (i === index ? " on" : "")}
            onClick={() => snapTo(i)}
          >
            <img src={item.kind === "robot" ? item.character.image : item.cover} alt="" draggable={false} />
          </button>
        ))}
      </div>
      <div className="foryou-cta">
        <button className="get-her" onClick={() => openItem(current)}>
          {current.kind === "drama" ? "Watch Now" : "Get Her"}
        </button>
      </div>
    </div>
  );
}

function GridFeed({ tab }: { tab: "hot" | "new" }) {
  const store = useStore();
  const list = CHARACTERS.filter((item) => item.classify.includes(tab));
  return (
    <div className="hot-grid">
      {list.map((item) => (
        <button
          key={item.id}
          className="hot-card"
          onClick={() => store.requireUser(() => store.push("chat-room", { id: item.id }))}
        >
          <div className="hot-photo">
            <img src={item.image} alt={item.name} />
            {item.hasDrama ? <DramaBadge /> : null}
            <div className="hot-greet">
              <span>💬</span>
              {item.greetCount}
            </div>
            <div className="hot-video">▶</div>
          </div>
          <div className="hot-copy">
            <h3>
              {item.name} | {item.age}
            </h3>
            <p>{item.bio}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function LoverFeed() {
  const store = useStore();
  const mine = CHARACTERS.slice(0, 4);
  const guest = store.persona === "guest";
  return (
    <div className="home-lover">
      {guest ? (
        <div className="lover-empty">
          <p>Create your dream AI girlfriend and start chatting.</p>
        </div>
      ) : (
        <div className="lover-grid">
          {mine.map((item) => (
            <button
              key={item.id}
              className="lover-card"
              onClick={() => store.push("character-detail", { id: item.id })}
            >
              <img src={item.image} alt={item.name} />
              <div className="lover-meta">
                <div className="lover-name">{item.name}</div>
                <div className="lover-tag">{item.tag}</div>
              </div>
            </button>
          ))}
        </div>
      )}
      <div className="home-lover-create">
        <button
          className="cta"
          onClick={() => store.requireUser(() => store.push("create-character"))}
        >
          Create your lover
        </button>
      </div>
    </div>
  );
}

export function HomeScreen() {
  const { homeTab } = useStore();
  return (
    <div className="home-root">
      <HomeTabs />
      {homeTab === "forYou" ? <ForYouFeed /> : null}
      {homeTab === "hot" ? <GridFeed tab="hot" /> : null}
      {homeTab === "new" ? <GridFeed tab="new" /> : null}
      {homeTab === "lover" ? <LoverFeed /> : null}
    </div>
  );
}
