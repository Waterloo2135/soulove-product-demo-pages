import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { CHARACTERS, DRAMAS, GEM_PACKS, characterById } from "../mock";
import { IconBack } from "../components/Icons";
import { UpgradeMembershipScreen } from "../../variants/会员订阅套餐/UpgradeMembership";
import { dramaBadge, getRecentDramaIds } from "../dramaGuide";
import { useStore } from "../store";
import type { ScreenId } from "../types";

function Shell({ title, children }: { title: string; children?: ReactNode }) {
  const store = useStore();
  return (
    <div>
      <div className="top">
        <button className="back" onClick={store.back}><IconBack /></button>
        <div className="h-title">{title}</div>
        <span />
      </div>
      {children}
    </div>
  );
}

export function CharacterAlbumScreen() {
  const store = useStore();
  const girl = characterById(store.current.params?.id);
  return (
    <Shell title={girl.name + "'s Album"}>
      <div className="grid">
        {[girl.image, girl.image, girl.image, girl.image].map((src, idx) => (
          <button key={idx} className="card" onClick={() => store.requirePlus("unlockBlur")}>
            <img src={src} alt="" style={{ filter: idx > 0 ? "blur(10px)" : undefined }} />
            {idx > 0 ? <div className="lock">Plus</div> : null}
          </button>
        ))}
      </div>
    </Shell>
  );
}

export function GalleryScreen() {
  return (
    <Shell title="My Album">
      <div className="grid">
        {CHARACTERS.slice(0, 4).map((item) => (
          <div key={item.id} className="card">
            <img src={item.image} alt="" />
            <div className="meta"><div className="name">{item.name}</div></div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function SubscriptionsScreen() {
  return <UpgradeMembershipScreen />;
}

export function TokensScreen() {
  const store = useStore();
  const [packId, setPackId] = useState(GEM_PACKS[3]?.id || GEM_PACKS[0].id);
  const pack = GEM_PACKS.find((item) => item.id === packId) || GEM_PACKS[0];
  const buy = (way: string) => {
    store.dispatch({ type: "setGems", gems: store.gems + pack.gems + (pack.extra || 0) });
    store.toast("+" + (pack.gems + (pack.extra || 0)) + " Gems · " + way);
  };
  return (
    <Shell title="Gems">
      <div className="gem-page">
        <div className="gem-page-bal">
          <span>Balance</span>
          <b>💎 {store.gems}</b>
        </div>
        <div className="gem-grid">
          {GEM_PACKS.map((item) => (
            <button
              key={item.id}
              className={"gem-pack" + (item.id === packId ? " on" : "") + (item.tag === "First" ? " once" : "")}
              onClick={() => setPackId(item.id)}
            >
              {item.tag ? <i className={"gem-tag " + item.tag.toLowerCase()}>{item.tag}</i> : null}
              <span className="gem-amt">{item.gems + (item.extra || 0)}</span>
              <span className="gem-ico" aria-hidden>💎</span>
              {item.extra ? <span className="gem-extra">+{item.extra}</span> : <span className="gem-extra ghost">&nbsp;</span>}
              <em>{item.price}</em>
            </button>
          ))}
        </div>
        <p className="sub-anon">100% anonymous. No automatic renewal.</p>
        <div className="sub-pays">
          {[
            { way: "Credit Card", cls: "card" },
            { way: "Paypal", cls: "paypal" },
            { way: "Apple Pay", cls: "apple" },
          ].map((item) => (
            <button key={item.way} type="button" className={"sub-pay-way " + item.cls} onClick={() => buy(item.way)}>
              <span className="sub-pay-ico" aria-hidden>
                {item.way === "Apple Pay" ? "" : item.way === "Paypal" ? "P" : "C"}
              </span>
              <span className="sub-pay-label">{item.way}</span>
            </button>
          ))}
        </div>
        <button className="cta-ghost" onClick={() => store.push("subscriptions")}>
          Plus is a better deal
        </button>
      </div>
    </Shell>
  );
}

const SHORTS_HERO =
  "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/4370e7a029364b4cb61af15ac623105b.png";

function DramaFlag({ kind }: { kind: "NEW" | "Update" | null }) {
  if (!kind) return null;
  return <span className={"drama-flag " + (kind === "NEW" ? "new" : "upd")}>{kind}</span>;
}

function DramaRecentRail({
  items,
  onOpen,
}: {
  items: typeof DRAMAS;
  onOpen: (id: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ on: false, x: 0, left: 0, moved: false, pid: -1 });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    if (!el) return;
    drag.current = { on: true, x: e.clientX, left: el.scrollLeft, moved: false, pid: e.pointerId };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.on || e.pointerId !== drag.current.pid) return;
    const dx = e.clientX - drag.current.x;
    if (!drag.current.moved && Math.abs(dx) > 8) {
      drag.current.moved = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    if (drag.current.moved && scroller.current) scroller.current.scrollLeft = drag.current.left - dx;
  };
  const endPointer = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.on || e.pointerId !== drag.current.pid) return;
    const moved = drag.current.moved;
    drag.current.on = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (moved) return;
    const card = (e.target as HTMLElement).closest(".drama-recent-card");
    const id = card?.getAttribute("data-id");
    if (id) onOpen(id);
  };

  return (
    <div
      ref={scroller}
      className="drama-recent"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          data-id={item.id}
          className="drama-recent-card"
          onClick={(ev) => ev.preventDefault()}
        >
          <span className="drama-recent-cover">
            <img src={item.cover} alt="" draggable={false} />
            <DramaFlag kind={dramaBadge(item) === "Update" ? "Update" : null} />
          </span>
          <em>{item.title}</em>
        </button>
      ))}
    </div>
  );
}

export function ShortDramaScreen() {
  const store = useStore();
  const recent = getRecentDramaIds()
    .map((id) => DRAMAS.find((item) => item.id === id))
    .filter((item): item is (typeof DRAMAS)[number] => Boolean(item));
  return (
    <div className="drama-tab-page">
      <div className="shorts-page">
        <div className="drama-hero">
          <img src={SHORTS_HERO} alt="" />
          <div className="drama-hero-top">
            <h1 className="drama-hero-title">Drama<span className="drama-hero-spark" aria-hidden>✦</span></h1>
            {store.persona === "guest" ? (
              <button className="ui-login" onClick={() => store.requireUser()}>Log in</button>
            ) : (
              <button className="ui-gems" onClick={() => store.push("tokens")}>💎 {store.gems}</button>
            )}
          </div>
        </div>
        {recent.length > 0 ? (
          <section className="drama-recent-sec">
            <h2 className="drama-sec-title">Continue Watching</h2>
            <DramaRecentRail items={recent} onOpen={(id) => store.push("short-drama-watch", { id })} />
          </section>
        ) : null}
        <h2 className="drama-sec-title">All Dramas</h2>
        <div className="shorts-grid">
          {DRAMAS.map((item) => (
            <button key={item.id} className="shorts-card" onClick={() => store.push("short-drama-watch", { id: item.id })}>
              <img src={item.cover} alt={item.title} />
              <DramaFlag kind={dramaBadge(item)} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerLiveActors({
  actors,
  land,
  onOpen,
}: {
  actors: { name: string; avatar: string; characterId: string }[];
  land?: boolean;
  onOpen: (characterId: string) => void;
}) {
  const multi = actors.length > 1;
  const size = land ? 40 : 48;
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [smooth, setSmooth] = useState(false);
  const [hold, setHold] = useState(false);
  const drag = useRef({ on: false, x: 0, y: 0, moved: false, pointer: -1 });
  const dragXRef = useRef(0);
  const busy = useRef(false);
  const holdRef = useRef(false);
  const resumeTimer = useRef(0);
  const snapTimer = useRef(0);
  const n = actors.length;
  const current = actors[((index % n) + n) % n] || actors[0];
  const next = actors[(((index + 1) % n) + n) % n];
  const prev = actors[(((index - 1) % n) + n) % n];
  holdRef.current = hold;

  const setDx = (value: number) => {
    dragXRef.current = value;
    setDragX(value);
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(resumeTimer.current);
      window.clearTimeout(snapTimer.current);
    };
  }, []);

  const slide = (dir: 1 | -1) => {
    if (!multi || busy.current) return;
    busy.current = true;
    setSmooth(true);
    setDx(-dir * size);
    window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(() => {
      setSmooth(false);
      setIndex((i) => (i + dir + n) % n);
      setDx(0);
      busy.current = false;
    }, 280);
  };

  useEffect(() => {
    if (!multi) return;
    const timer = window.setInterval(() => {
      if (holdRef.current || drag.current.on || busy.current) return;
      slide(1);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [multi, n, size]);

  const armHold = () => {
    holdRef.current = true;
    setHold(true);
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      holdRef.current = false;
      setHold(false);
    }, 3000);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!multi || busy.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { on: true, x: e.clientX, y: e.clientY, moved: false, pointer: e.pointerId };
    setSmooth(false);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.on) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (!drag.current.moved && Math.abs(dx) + Math.abs(dy) > 6) drag.current.moved = true;
    if (Math.abs(dx) >= Math.abs(dy)) {
      e.preventDefault();
      setDx(Math.max(-size, Math.min(size, dx)));
    }
  };

  const endPointer = (e: PointerEvent<HTMLDivElement>, cancel = false) => {
    if (!drag.current.on) return;
    if (drag.current.pointer !== -1 && e.pointerId !== drag.current.pointer) return;
    const dx = dragXRef.current;
    const moved = drag.current.moved;
    drag.current.on = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    if (cancel) {
      setSmooth(true);
      setDx(0);
      return;
    }
    if (!moved && Math.abs(dx) < 8) {
      setDx(0);
      onOpen(current.characterId);
      return;
    }
    armHold();
    if (dx <= -size * 0.28) slide(1);
    else if (dx >= size * 0.28) slide(-1);
    else {
      setSmooth(true);
      setDx(0);
    }
  };

  const label = current.name + " online" + (multi ? ", " + String(index + 1) + " of " + String(n) : "");
  const dotCount = Math.min(n, 3);
  const activeDot = n <= 3 ? index : index === 0 ? 0 : index === n - 1 ? 2 : 1;

  return (
    <div
      className={"player-live-stack" + (land ? " land" : "") + (multi ? " multi" : "")}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => {
        if (multi) return;
        onOpen(current.characterId);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => endPointer(e)}
      onPointerCancel={(e) => endPointer(e, true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(current.characterId);
        }
      }}
    >
      <div className="player-live-ava-wrap">
        <div className="player-live-window">
          {multi ? (
            <div
              className={"player-live-track" + (smooth ? " smooth" : "")}
              style={{ transform: "translateX(" + dragX + "px)" }}
            >
              <img src={prev.avatar} alt="" draggable={false} />
              <img src={current.avatar} alt="" draggable={false} />
              <img src={next.avatar} alt="" draggable={false} />
            </div>
          ) : (
            <img src={current.avatar} alt="" draggable={false} />
          )}
        </div>
        <span className="player-live-fx">
          <i className="player-live-dot" />
        </span>
      </div>
      {multi ? (
        <span className="player-live-dots" aria-hidden="true">
          {Array.from({ length: dotCount }, (_, i) => (
            <i key={i} className={i === activeDot ? "on" : undefined} />
          ))}
        </span>
      ) : null}
    </div>
  );
}

export function ShortDramaWatchScreen() {
  const store = useStore();
  const drama = DRAMAS.find((item) => item.id === store.current.params?.id) || DRAMAS[0];
  const autoplay = store.current.params?.autoplay !== "0";
  const fromLanding = store.current.params?.from === "landing";
  const resumeSec = Number(store.current.params?.t || 0) || 0;
  const firstFree = Math.max(1, Math.min(drama.lockedFrom - 1, drama.episodes) || 1);
  const [playing, setPlaying] = useState(autoplay);
  const [showMuteIcon, setShowMuteIcon] = useState(fromLanding);
  const [episodesOpen, setEpisodesOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [plotOpen, setPlotOpen] = useState(false);
  const [plotPick, setPlotPick] = useState("");
  const [liked, setLiked] = useState(false);
  const [currentEp, setCurrentEp] = useState(firstFree);
  const [currentSec, setCurrentSec] = useState(resumeSec);
  const [durationSec, setDurationSec] = useState(0);
  const [landMode, setLandMode] = useState(Boolean(drama.landscape) || store.current.params?.land === "1");
  const videoRef = useRef<HTMLVideoElement>(null);

  const isLocked = (ep: number) => ep >= drama.lockedFrom && store.persona !== "plus";
  const openActorHome = (characterId: string) => {
    setEpisodesOpen(false);
    store.push("character-detail", { id: characterId, from: "short-drama" });
  };
  const openVipForEpisode = () => {
    setEpisodesOpen(false);
    store.requirePlus("shortDrama");
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => setCurrentSec(video.currentTime || 0);
    const onMeta = () => setDurationSec(video.duration || 0);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onMeta);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, [drama.id, currentEp]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const apply = async () => {
      try {
        if (resumeSec > 0 && currentEp === firstFree && Math.abs((video.currentTime || 0) - resumeSec) > 0.5) {
          video.currentTime = resumeSec;
        }
        video.muted = fromLanding ? showMuteIcon : true;
        if (isLocked(currentEp)) {
          video.pause();
          return;
        }
        if (playing) {
          video.muted = true;
          await video.play();
        } else {
          video.pause();
        }
      } catch {
        // autoplay may be blocked; keep UI state
      }
    };
    void apply();
  }, [playing, resumeSec, drama.id, currentEp, firstFree, store.persona, fromLanding, showMuteIcon]);

  const progress = durationSec > 0 ? Math.min(1, currentSec / durationSec) : playing ? 0.12 : 0;
  const fmt = (sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  };
  const epTitle = currentEp === 1 ? drama.episodeTitle : "Episode " + String(currentEp).padStart(2, "0");
  const accessLabel = isLocked(currentEp) ? "VIP" : currentEp >= drama.lockedFrom ? "UNLOCKED" : "FREE";


  const actors = drama.actors.length ? drama.actors : [{ name: "Elena", avatar: characterById("elena").image, characterId: "elena" }];

  const lead = drama.actors[0];
  const openRemix = () => {
    setPlaying(false);
    try { videoRef.current?.pause(); } catch { /* ignore */ }
    store.push("drama-remix", { id: drama.id, ep: String(currentEp) });
  };
  const openLeadChat = () => {
    store.push("chat-room", {
      id: (lead && lead.characterId) || "elena",
      from: "short-drama",
      context: "You just watched " + drama.title + ". Continue this story with me.",
    });
  };
  const selectLandEpisode = (ep: number) => {
    if (isLocked(ep)) {
      openVipForEpisode();
      return;
    }
    setCurrentEp(ep);
    setPlaying(true);
    const video = videoRef.current;
    if (video) {
      try {
        video.currentTime = 0;
      } catch {
        // seek can fail before metadata
      }
    }
  };

  const landPlayer = (
    <div className="player-land">
      <div className="player-land-stage">
        <video
          ref={videoRef}
          className="player-land-video"
          src={drama.firstEpisodeUrl}
          poster={drama.watchCover || drama.cover}
          muted
          playsInline
          loop
          autoPlay
          preload="auto"
          onCanPlay={(e) => {
            const el = e.currentTarget;
            el.muted = true;
            void el.play().then(() => setPlaying(true)).catch(() => undefined);
          }}
        />
        <button className="player-land-x" onClick={store.back}>✕</button>
        <div className="player-land-side">
          <PlayerLiveActors key={drama.id + "-land"} actors={actors} land onOpen={openActorHome} />
          <button className={"player-land-ico" + (liked ? " on" : "")} onClick={() => setLiked((v) => !v)}>
            <span>❤</span>
            <small>{drama.likeCount}</small>
          </button>
          <button className="player-land-ico" onClick={openRemix} aria-label="Remix">
            <span>🎬</span>
            <small>Remix</small>
          </button>
          <button className="player-land-ico" onClick={() => setLandMode(false)} aria-label="Portrait">
            <span>⛶</span>
          </button>
        </div>
        {!playing ? (
          <button
            className="player-play"
            onClick={() => {
              if (isLocked(currentEp)) openVipForEpisode();
              else setPlaying(true);
            }}
            aria-label="Play"
          >▶</button>
        ) : (
          <button className="player-land-tap" onClick={() => setPlaying(false)} aria-label="Pause" />
        )}
        <div className="player-land-hud">
          <span>{fmt(currentSec)} / {durationSec > 0 ? fmt(durationSec) : drama.duration}</span>
          <div className="player-land-scrub" aria-hidden="true">
            <i style={{ width: progress * 100 + "%" }} />
          </div>
        </div>
      </div>
      <div className="player-land-body">
        <div className="player-land-head">
          <h3 className="player-land-title">{drama.title}</h3>
          <span className="player-land-count">{drama.episodes} Eps</span>
        </div>
        <div className="player-land-now">
          <b>EP.{currentEp}</b>
          <span>{epTitle}</span>
          <em className={isLocked(currentEp) ? "vip" : ""}>{accessLabel}</em>
        </div>
        <p className="player-land-syn">{drama.synopsis}</p>
        <div className="player-land-eps-head">
          <span>Episodes</span>
          <em>1–{drama.episodes}</em>
        </div>
        <div className="player-land-eps">
          {Array.from({ length: drama.episodes }, (_, i) => i + 1).map((ep) => {
            const locked = isLocked(ep);
            const current = ep === currentEp;
            return (
              <button
                key={ep}
                className={"player-land-ep-item" + (current ? " on" : "") + (locked ? " lock" : "")}
                onClick={() => selectLandEpisode(ep)}
                aria-label={locked ? "Episode " + ep + " locked" : "Episode " + ep}
                aria-current={current ? "true" : undefined}
              >
                {ep}
                {current && !locked ? <span className="ep-playing" aria-hidden="true"><i /><i /><i /></span> : null}
                {locked ? <span className="ep-lock" aria-hidden="true">🔒</span> : null}
              </button>
            );
          })}
        </div>
        {drama.actors.length > 0 ? (
          <div className="player-land-cast">
            <div className="player-land-cast-head">Play with the actors</div>
            <div className="player-land-soft">
              <div className="player-land-soft-avas">
                {drama.actors.slice(0, 3).map((actor) => (
                  <button
                    key={actor.characterId}
                    type="button"
                    aria-label={actor.name}
                    onClick={() => store.push("character-detail", { id: actor.characterId, from: "short-drama" })}
                  >
                    <img src={actor.avatar} alt="" />
                  </button>
                ))}
              </div>
              <div className="player-land-soft-copy">
                <b>{drama.actors.map((actor) => actor.name).join(", ")}</b>
              </div>
              <button type="button" className="player-land-chat-soft" onClick={openLeadChat}>Chat</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  if (landMode) {
    return <div className="player-land-page">{landPlayer}</div>;
  }

  return (
    <div
      className="player"
      style={{
        backgroundImage: "url(" + (drama.watchCover || drama.cover) + ")",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      <video
        ref={videoRef}
        className="player-stage-video"
        src={drama.firstEpisodeUrl}
        poster={drama.watchCover || drama.cover}
        muted={fromLanding ? showMuteIcon : true}
        playsInline
        loop
        autoPlay={playing}
        preload="auto"
      />
      <div className="player-fog" />
      <div className="player-top">
        <button className="player-close" onClick={store.back}>✕</button>
        <div className="player-ep">EP {String(currentEp).padStart(2, "0")} / {String(drama.episodes).padStart(2, "0")}</div>
        <span className="player-close ghost" />
      </div>
      {playing && showMuteIcon ? (
        <button
          className="player-mute"
          aria-label="Unmute"
          onClick={(event) => {
            event.stopPropagation();
            setShowMuteIcon(false);
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9v6h3.2L12 19.5V4.5L7.2 9H4z" fill="#fff" />
            <path d="M16.2 9.2 20.8 14.8M20.8 9.2 16.2 14.8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
      {!playing ? (
        <button
          className="player-play"
          onClick={() => {
            if (isLocked(currentEp)) openVipForEpisode();
            else setPlaying(true);
          }}
          aria-label="Play"
        >▶</button>
      ) : (
        <button className="player-tap" onClick={() => setPlaying(false)} aria-label="Pause" />
      )}
      <div className="player-side">
        <PlayerLiveActors key={drama.id} actors={actors} onOpen={openActorHome} />
        <button className={"player-act" + (liked ? " on" : "")} onClick={() => setLiked((v) => !v)}>
          <span>❤</span>
          <small>{drama.likeCount}</small>
        </button>
        <button className="player-act" onClick={() => setEpisodesOpen(true)}>
          <span>☰</span>
          <small>EP</small>
        </button>
        <button
          className="player-act player-act-remix"
          onClick={openRemix}
        >
          <span>🎬</span>
          <small>Remix</small>
        </button>
        <button className="player-act" onClick={() => setLandMode(true)} aria-label="Landscape">
          <span>⛶</span>
        </button>
      </div>
      <div className="player-bottom">
        {/* Bottom entry strip hidden while Remix ships first. Keep markup for later. */}
        <div className="player-cast player-cast-hidden" aria-hidden="true">
          <button className="player-entry player-entry-remix" tabIndex={-1} onClick={() => { setPlaying(false); try { videoRef.current?.pause(); } catch {} store.push("drama-remix", { id: drama.id, ep: String(currentEp) }); }}>
            <span className="player-entry-ava player-entry-remix-ava">
              <span className="player-remix-emoji">🎬</span>
            </span>
            <em>Remix</em>
          </button>
          <button className="player-entry" tabIndex={-1} onClick={() => store.push("film-scenes", { id: drama.id })}>
            <span className="player-entry-ava">
              <img src="/short-drama/entry-film-scenes.png" alt="" />
            </span>
            <em>Film Scenes</em>
          </button>
          <button className="player-entry" onClick={() => store.push("chat-room", { id: (drama.actors[0] && drama.actors[0].characterId) || "elena", from: "short-drama", context: "You just watched " + drama.title + ". Continue this story with me." })}>
            <span className="player-entry-ava">
              <img src="/short-drama/entry-customize-plot.png" alt="" />
            </span>
            <em>Customize the Plot</em>
          </button>
          <button
            className="player-entry"
            onClick={() => store.push("character-album", { id: (drama.actors[0] && drama.actors[0].characterId) || "elena" })}
          >
            <span className="player-entry-ava">
              <img src="/short-drama/entry-album.png" alt="" />
            </span>
            <em>{(drama.actors[0] ? drama.actors[0].name : "Elena") + "'s Album"}</em>
          </button>
        </div>
        <div className="player-meta">
          <b>{epTitle}</b>
          <span>{accessLabel}</span>
        </div>
        <div className="player-bar">
          <i style={{ width: progress * 100 + "%" }} />
          <em style={{ left: progress * 100 + "%" }} />
        </div>
        <div className="player-time">
          <span>{fmt(currentSec)}</span>
          <span>{durationSec > 0 ? fmt(durationSec) : drama.duration}</span>
        </div>
      </div>
      {filmOpen ? (
        <div className="player-sheet" onClick={() => setFilmOpen(false)}>
          <div className="player-sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="ep-handle" />
            <div className="ep-head">
              <div className="ep-title-row"><h4>Film Scenes</h4></div>
              <p className="ep-syn">Stills from this episode. Tap to keep watching.</p>
            </div>
            <div className="film-grid">
              {[drama.cover, drama.watchCover, ...DRAMAS.map((item) => item.cover)].filter(Boolean).slice(0, 6).map((srcImg, idx) => (
                <button key={srcImg + idx} className="film-cell" onClick={() => setFilmOpen(false)}>
                  <img src={srcImg} alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {plotOpen ? (
        <div className="player-sheet" onClick={() => setPlotOpen(false)}>
          <div className="player-sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="ep-handle" />
            <div className="ep-head">
              <div className="ep-title-row"><h4>Customize the Plot</h4></div>
              <p className="ep-syn">Pick how this scene goes. Demo only — does not change the video file.</p>
            </div>
            <div className="plot-list">
              {["She leaves the door unlocked", "You walk in on her", "Rewrite the ending"].map((item) => (
                <button
                  key={item}
                  className={"plot-item" + (plotPick === item ? " on" : "")}
                  onClick={() => {
                    setPlotPick(item);
                    store.toast("Plot set · " + item);
                    setPlotOpen(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {episodesOpen ? (
        <div className="player-sheet" onClick={() => setEpisodesOpen(false)}>
          <div className="player-sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="ep-handle" />
            <div className="ep-head">
              <div className="ep-title-row">
                <h4>{drama.title}</h4>
                <span className="ep-range">1 - {drama.episodes}</span>
              </div>
              <p className="ep-syn">{drama.synopsis}</p>
            </div>
            {drama.actors.length > 0 ? (
              <div className="ep-cast">
                {drama.actors.map((actor) => (
                  <button key={actor.characterId} className="player-actor" onClick={() => openActorHome(actor.characterId)}>
                    <span className="player-actor-ava">
                      <img src={actor.avatar} alt="" />
                      <i>💬</i>
                    </span>
                    <em>{actor.name}</em>
                  </button>
                ))}
              </div>
            ) : null}
            <div className="player-eps">
              {Array.from({ length: drama.episodes }, (_, i) => i + 1).map((ep) => {
                const locked = isLocked(ep);
                const current = ep === currentEp;
                return (
                  <button
                    key={ep}
                    className={"player-ep-item" + (current ? " on" : "") + (locked ? " lock" : "")}
                    onClick={() => {
                      if (locked) {
                        openVipForEpisode();
                        return;
                      }
                      setCurrentEp(ep);
                      setPlaying(true);
                      setEpisodesOpen(false);
                    }}
                    aria-label={locked ? "Episode " + ep + " locked" : "Episode " + ep}
                  >
                    {ep}
                    {current ? <span className="ep-playing" aria-hidden><i /><i /><i /></span> : null}
                    {locked ? <span className="ep-lock" aria-hidden>🔒</span> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SimpleScreen({ title, body, next }: { title: string; body: string; next?: { id: ScreenId; label: string } }) {
  const store = useStore();
  return (
    <Shell title={title}>
      <div className="placeholder">
        {body}
        {next ? (
          <div style={{ marginTop: 14 }}>
            <button className="cta" onClick={() => store.push(next.id)}>{next.label}</button>
          </div>
        ) : null}
      </div>
    </Shell>
  );
}














