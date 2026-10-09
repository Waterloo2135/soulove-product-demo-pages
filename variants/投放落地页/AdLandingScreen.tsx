import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import handImg from "../assets/hand.webp";
import openInExBrowserImg from "../assets/openInExBrowser.png";
import { LANDING_DRAMAS } from "../mock";
import { useStore } from "../store";

const CARD_W = 296;
const CARD_H = 396;
const CARD_GAP = 16;
const SIDE_SCALE = 0.8667;

function PlayGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3l14 9-14 9V3z" fill="#fff" />
    </svg>
  );
}

function MuteGlyph() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h3.2L12 19.5V4.5L7.2 9H4z" fill="#fff" />
      <path d="M16.2 9.2 20.8 14.8M20.8 9.2 16.2 14.8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function AdLandingScreen() {
  const store = useStore();
  const featuredIndex = Math.max(0, LANDING_DRAMAS.findIndex((item) => item.featured));
  const [index, setIndex] = useState(featuredIndex);
  const [muted, setMuted] = useState(true);
  const [browserGuide, setBrowserGuide] = useState<string | null>(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, from: featuredIndex });
  const current = LANDING_DRAMAS[index] ?? LANDING_DRAMAS[0];

  useEffect(() => {
    setMuted(true);
  }, [index]);

  useEffect(() => {
    const screen = document.querySelector(".screen");
    if (screen) screen.scrollTop = 0;
  }, []);
  useLayoutEffect(() => {
    if (!browserGuide) return;
    const phone = document.querySelector(".phone");
    const el = document.querySelector(".ad-landing-guide");
    if (!phone || !el || !(el instanceof HTMLElement)) return;
    const box = phone.getBoundingClientRect();
    el.style.position = "fixed";
    el.style.top = `${box.top}px`;
    el.style.left = `${box.left}px`;
    el.style.width = `${box.width}px`;
    el.style.height = `${box.height}px`;
  }, [browserGuide]);


  const go = (next: number) => {
    const max = LANDING_DRAMAS.length - 1;
    setIndex(Math.max(0, Math.min(max, next)));
  };

  const openWatch = (watchId: string) => {
    store.push("short-drama-watch", { id: watchId, autoplay: "1", from: "landing" });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = { active: true, startX: event.clientX, startY: event.clientY, from: index };
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    dragRef.current.active = false;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      go(dragRef.current.from + (dx < 0 ? 1 : -1));
    }
  };

  const offset = (LANDING_DRAMAS.length - 1) / 2 - index;
  const shift = offset * (((SIDE_SCALE + 1) / 2) * CARD_W + CARD_GAP);

  return (
    <div className="ad-landing">
      <section className="ad-landing-hero">
        <p className="ad-landing-kicker">Watch her story. Make it yours.</p>
        <div
          className="ad-landing-viewport"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="ad-landing-track" style={{ transform: `translateX(${shift}px)` }}>
            {LANDING_DRAMAS.map((item, idx) => {
              const active = idx === index;
              return (
                <div key={item.id} className={"ad-landing-slot" + (active ? " on" : "")}>
                  <button
                    type="button"
                    className="ad-landing-card"
                    aria-label={item.title}
                    onClick={() => go(idx)}
                    style={{
                      width: CARD_W,
                      height: CARD_H,
                      transform: active ? "scale(1)" : `scale(${SIDE_SCALE})`,
                      opacity: active ? 1 : 0.8,
                    }}
                  >
                    {active && item.videoUrl ? (
                      <video
                        className="ad-landing-media"
                        src={item.videoUrl}
                        poster={item.cover}
                        muted={muted}
                        playsInline
                        autoPlay
                        loop
                      />
                    ) : (
                      <img className="ad-landing-media" src={item.cover} alt="" />
                    )}
                    {!(active && item.videoUrl) ? (
                      <span className="ad-landing-play">
                        <PlayGlyph />
                      </span>
                    ) : null}
                  </button>
                  {active && item.videoUrl ? (
                    <button
                      type="button"
                      className="ad-landing-mute"
                      aria-label={muted ? "Unmute" : "Mute"}
                      onClick={() => setMuted((value) => !value)}
                    >
                      <MuteGlyph />
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <p className="ad-landing-title">{current.title}</p>
        <button
          type="button"
          className="ad-landing-cta"
          onClick={() => openWatch(current.watchId)}
        >
          Watch Now
          <img src={handImg} alt="" />
        </button>
      </section>

      <section className="ad-landing-list" aria-label="More dramas">
        {LANDING_DRAMAS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="ad-landing-row"
            onClick={() => setBrowserGuide(item.watchId)}
          >
            <img src={item.cover} alt="" />
            <span>{item.title}</span>
          </button>
        ))}
      </section>

      {browserGuide ? (
        <div className="ad-landing-guide" onClick={() => setBrowserGuide(null)}>
          <div className="ad-landing-guide-panel" onClick={(event) => event.stopPropagation()}>
            <img className="ad-landing-guide-arrow" src={openInExBrowserImg} alt="" />
            <p>Can't open it? Try clicking here.</p>
            <div className="ad-landing-guide-step">Step 1: Tap ···</div>
            <button
              type="button"
              className="ad-landing-guide-step"
              onClick={() => {
                const id = browserGuide;
                setBrowserGuide(null);
                openWatch(id);
              }}
            >
              Step 2: Open in external browser
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}




