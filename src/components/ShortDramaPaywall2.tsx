import { useMemo, useRef, useState, type ReactNode } from "react";
import { DRAMAS } from "../mock";
import { useStore } from "../store";

/** Real short-drama character retention VO. Some dramas are motion-only. */
const RETENTION_VO_URL = "https://d2tntkfu60is0z.cloudfront.net/sl/config/335bcdd7c8fb408287b3c0904f742e70.mp4";

const FAN_LAYOUT = [
  { w: 72, h: 96, rotate: -10, left: -25, top: 29.5, z: 1, pos: "22% 40%" },
  { w: 81, h: 108, rotate: -5, left: 53, top: 12, z: 2, pos: "38% 32%" },
  { w: 90, h: 120, rotate: 0, left: 143, top: 0, z: 5, pos: "50% 50%" },
  { w: 81, h: 108, rotate: 5, left: 233, top: 10, z: 3, pos: "62% 32%" },
  { w: 72, h: 96, rotate: 10, left: 313, top: 30, z: 1, pos: "78% 40%" },
] as const;

const FEATURES: { label: string; badge?: string; icon: ReactNode }[] = [
  {
    label: "More Spicy\nSeries",
    icon: (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden>
        <rect x="1" y="1" width="7.4" height="7.4" rx="1.6" />
        <rect x="11.6" y="1" width="7.4" height="7.4" rx="1.6" />
        <rect x="1" y="11.6" width="7.4" height="7.4" rx="1.6" />
        <rect x="11.6" y="11.6" width="7.4" height="7.4" rx="1.6" />
      </svg>
    ),
  },
  {
    label: "NSFW Chat with\nHer",
    badge: "N",
    icon: (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden>
        <path d="M3.2 3.4h13.6c.9 0 1.6.7 1.6 1.6v7.4c0 .9-.7 1.6-1.6 1.6H8.1L4 17.6V14H3.2c-.9 0-1.6-.7-1.6-1.6V5c0-.9.7-1.6 1.6-1.6Z" />
      </svg>
    ),
  },
  {
    label: "Ask her for\nSpicy Videos",
    icon: (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden>
        <rect x="1.4" y="5.2" width="11.4" height="9.6" rx="2.2" />
        <path d="M13.6 8.1 18.2 5.6v8.8l-4.6-2.5V8.1Z" />
      </svg>
    ),
  },
  {
    label: "Ask her for any\nPics",
    icon: (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden>
        <rect x="2" y="3.6" width="16" height="12.8" rx="2.2" />
        <circle cx="7.1" cy="8.1" r="1.5" fill="#1A101C" />
        <path d="M4.4 14.4 8.2 10.8l2.3 2.2 3.1-3.6 3.8 5H4.4Z" fill="#1A101C" />
      </svg>
    ),
  },
];

function useDrama() {
  const store = useStore();
  return DRAMAS.find((item) => item.id === store.current.params?.id) || DRAMAS[0];
}

function unlockPlus(store: ReturnType<typeof useStore>, way: string) {
  store.dispatch({ type: "setPersona", persona: "plus" });
  store.dispatch({ type: "closeOverlay" });
  store.toast("Plus unlocked · " + way);
}

function PayWays({ onPay }: { onPay: (way: string) => void }) {
  return (
    <div className="sd2-ways">
      {[
        { way: "Credit Card", cls: "card", icon: "/short-drama/pay-card.svg" },
        { way: "Paypal", cls: "paypal", icon: "/short-drama/pay-paypal.svg" },
        { way: "Apple Pay", cls: "apple", icon: "/short-drama/pay-apple.svg" },
      ].map((item) => (
        <button
          key={item.way}
          type="button"
          className={"sub-pay-way " + item.cls}
          onClick={() => onPay(item.way)}
        >
          <span className="sub-pay-ico" aria-hidden>
            <img src={item.icon} alt="" />
          </span>
          <span className="sub-pay-label">{item.way}</span>
        </button>
      ))}
    </div>
  );
}

function StayOrPay({ onPay }: { onPay: (way: string) => void }) {
  const [showPay, setShowPay] = useState(false);
  return (
    <div className="sd2-cta">
      {showPay ? (
        <PayWays onPay={onPay} />
      ) : (
        <button type="button" className="sd2-stay" onClick={() => setShowPay(true)}>
          Stay with Her
        </button>
      )}
    </div>
  );
}

function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const unmute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 1;
    void el.play().catch(() => undefined);
    setMuted(false);
  };

  const toggleMuted = () => {
    if (muted) unmute();
    else {
      const el = videoRef.current;
      if (el) el.muted = true;
      setMuted(true);
    }
  };

  return (
    <div className="sd2-video-wrap">
      <video
        ref={videoRef}
        className="sd2-video"
        src={src}
        poster={poster}
        muted={muted}
        playsInline
        loop
        autoPlay
        onClick={unmute}
      />
      <button type="button" className="sd2-sound" onClick={toggleMuted}>
        {muted ? "Tap to hear her" : "Sound on"}
      </button>
    </div>
  );
}

function ShortDrama2Hero({ onDismiss }: { onDismiss: () => void }) {
  const store = useStore();
  const drama = useDrama();

  return (
    <div className="sd2-root" onClick={onDismiss}>
      <div className="sd2-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sd2-handle" />
        <HeroVideo src={RETENTION_VO_URL} poster={drama.watchCover || drama.cover} />
        <button type="button" className="sd2-close" aria-label="Close" onClick={onDismiss}>
          ×
        </button>
        <div className="sd2-panel">
          <h2>The next episode is locked</h2>
          <p className="sd2-lead">Unlock Prime for what happens next</p>
          <b className="sd2-price">Only $0.33/day</b>
          <p className="sd2-plan">Prime: 1 Month, Total $9.99</p>
          <StayOrPay onPay={(way) => unlockPlus(store, way)} />
          <p className="sd2-anon">100% anonymous. No automatic renewal.</p>
        </div>
      </div>
    </div>
  );
}

function ShortDrama2More({ onLater }: { onLater: () => void }) {
  const store = useStore();
  const drama = useDrama();
  const poster = drama.watchCover || drama.cover;
  const covers = useMemo(() => {
    const rest = DRAMAS.map((item) => item.cover).filter((src) => src !== poster);
    return FAN_LAYOUT.map((_, index) => (index === 2 ? poster : rest[index] || rest[0] || poster));
  }, [poster]);

  return (
    <div className="sd2-more-root" onClick={onLater}>
      <div className="sd2-more-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sd2-more-head">
          <h2>Not just this episode</h2>
          <p className="sd2-more-sub">Prime keeps her — spicy series, chat, pics, and videos.</p>
        </div>
        <div className="sd2-fan" aria-hidden>
          {covers.map((src, index) => {
            const layout = FAN_LAYOUT[index];
            return (
              <div
                key={src + index}
                className="sd2-fan-box"
                style={{
                  left: layout.left,
                  top: layout.top,
                  zIndex: layout.z,
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{
                    width: layout.w,
                    height: layout.h,
                    objectPosition: layout.pos,
                    transform: "rotate(" + layout.rotate + "deg)",
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="sd2-features">
          {FEATURES.map((item) => (
            <div key={item.label} className="sd2-feat">
              <span className="sd2-feat-ico">{item.icon}</span>
              <span className="sd2-feat-label">{item.label}</span>
              {item.badge ? <i className="sd2-feat-n">{item.badge}</i> : null}
            </div>
          ))}
        </div>
        <div className="sd2-more-box">
          <b>
            Only <em>$0.33</em>/day
          </b>
          <span className="sd2-plan">Prime: 1 Month, Total $9.99</span>
        </div>
        <div className="sd2-more-cta">
          <StayOrPay onPay={(way) => unlockPlus(store, way)} />
          <button type="button" className="sd2-later" onClick={onLater}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

export function ShortDramaPaywall2Host() {
  const store = useStore();
  const [step, setStep] = useState<"hero" | "more">("hero");

  if (step === "more") {
    return <ShortDrama2More onLater={() => store.dispatch({ type: "closeOverlay" })} />;
  }
  return <ShortDrama2Hero onDismiss={() => setStep("more")} />;
}
