import { useMemo, useRef, useState, type ReactNode } from "react";
import { CHARACTERS, DRAMAS } from "../mock";
import { useStore } from "../store";

/** Real short-drama character retention VO. Some dramas are motion-only. */
const RETENTION_VO_URL = "https://d2tntkfu60is0z.cloudfront.net/sl/config/bbfe026ad76349aaaa63b0e75d9c06f1.mp4";
const BIKINI_PIC = "https://images.unsplash.com/photo-1583900985737-6d0495555783?auto=format&fit=crop&w=400&q=80";

function useDrama() {
  const store = useStore();
  return DRAMAS.find((item) => item.id === store.current.params?.id) || DRAMAS[0];
}

function herAvatar(drama: ReturnType<typeof useDrama>) {
  const id = drama.actors[0]?.characterId;
  return CHARACTERS.find((item) => item.id === id)?.image || drama.actors[0]?.avatar || drama.cover;
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

function PerkCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="sd2-perk">
      <div className="sd2-perk-stage">{children}</div>
      <span>{label}</span>
    </div>
  );
}

function ShortDrama2More({ onLater }: { onLater: () => void }) {
  const store = useStore();
  const drama = useDrama();
  const avatar = herAvatar(drama);
  const covers = useMemo(() => {
    const list = DRAMAS.filter((item) => item.id !== "d-landing").map((item) => item.cover);
    while (list.length < 4) list.push(drama.cover);
    return list.slice(0, 4);
  }, [drama]);

  return (
    <div className="sd2-more-root" onClick={onLater}>
      <div className="sd2-more-card" onClick={(event) => event.stopPropagation()}>
        <h2>Not just this episode</h2>
        <p className="sd2-more-sub">
          Prime keeps <em>her</em> — spicy series, chat, pics, and videos.
        </p>
        <div className="sd2-perks">
          <PerkCard label="More spicy series">
            <div className="sd2-mini-series">
              {covers.map((src, index) => (
                <img key={src + index} src={src} alt="" />
              ))}
            </div>
          </PerkCard>
          <PerkCard label="NSFW chat with her">
            <div className="sd2-mini-chat">
              <div className="sd2-mini-her">
                <img src={avatar} alt="" />
                <p>Don't stop watching me...</p>
              </div>
              <p className="sd2-mini-me">come chat with me</p>
              <div className="sd2-mini-her">
                <img src={avatar} alt="" />
                <p>I'll be as dirty as you want.</p>
              </div>
            </div>
          </PerkCard>
          <PerkCard label="Ask her for any pics">
            <div className="sd2-mini-chat">
              <p className="sd2-mini-me">show me a pic of you in a bikini</p>
              <div className="sd2-mini-her">
                <img src={avatar} alt="" />
                <div className="sd2-mini-media">
                  <img src={BIKINI_PIC} alt="" />
                </div>
              </div>
            </div>
          </PerkCard>
          <PerkCard label="Ask her for spicy videos">
            <div className="sd2-mini-chat">
              <p className="sd2-mini-me">show me a video of blowjob</p>
              <div className="sd2-mini-her">
                <img src={avatar} alt="" />
                <div className="sd2-mini-media">
                  <img src={drama.watchCover || drama.cover} alt="" />
                  <i className="sd2-perk-play" aria-hidden />
                </div>
              </div>
            </div>
          </PerkCard>
        </div>
        <div className="sd2-more-box">
          <b>Only $0.33/day</b>
          <span className="sd2-plan">Prime: 1 Month, Total $9.99</span>
        </div>
        <StayOrPay onPay={(way) => unlockPlus(store, way)} />
        <button type="button" className="sd2-later" onClick={onLater}>
          Maybe Later
        </button>
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
