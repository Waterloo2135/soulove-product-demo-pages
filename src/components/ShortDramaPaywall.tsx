import { useMemo, useState } from "react";
import { DRAMAS } from "../mock";
import { useStore } from "../store";

const FAN_LAYOUT = [
  { w: 72, h: 96, rotate: -10, left: -25, top: 29.5, z: 1 },
  { w: 81, h: 108, rotate: -5, left: 53, top: 12, z: 2 },
  { w: 90, h: 120, rotate: 0, left: 143, top: 0, z: 5 },
  { w: 81, h: 108, rotate: 5, left: 233, top: 10, z: 3 },
  { w: 72, h: 96, rotate: 10, left: 313, top: 30, z: 1 },
] as const;

function useDrama() {
  const store = useStore();
  return DRAMAS.find((item) => item.id === store.current.params?.id) || DRAMAS[0];
}

function unlockPlus(store: ReturnType<typeof useStore>, way: string) {
  store.dispatch({ type: "setPersona", persona: "plus" });
  store.dispatch({ type: "closeOverlay" });
  store.toast("Plus unlocked · " + way);
}

function ShortDramaVipSheet({ onDismiss }: { onDismiss: () => void }) {
  const store = useStore();
  const covers = useMemo(() => {
    const list = DRAMAS.map((item) => item.cover);
    while (list.length < 5) list.push(list[list.length % DRAMAS.length] || list[0]);
    return list.slice(0, 5);
  }, []);

  return (
    <div className="sd-pay-root" onClick={onDismiss}>
      <div className="sd-pay-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sd-pay-handle" />
        <div className="sd-pay-title">
          <span>Unlock</span>
          <em>All Access</em>
        </div>
        <div className="sd-pay-fan">
          {covers.map((src, index) => {
            const layout = FAN_LAYOUT[index];
            return (
              <div
                key={src + index}
                className="sd-pay-fan-box"
                style={{
                  left: layout.left,
                  top: layout.top,
                  zIndex: layout.z,
                }}
              >
                <img src={src} alt="" style={{ width: layout.w, height: layout.h, transform: "rotate(" + layout.rotate + "deg)" }} />
              </div>
            );
          })}
        </div>
        <p className="sd-pay-sub">
          Get access to early premieres and unique series, available to unlock only with VIP membership.
        </p>
        <div className="sd-pay-card">
          <div className="sd-pay-card-top">
            <div className="sd-pay-prime">Prime</div>
            <span className="sd-pay-pill">Just for $0.33/Day</span>
          </div>
          <p className="sd-pay-more">
            Get More <em>Benefit</em>
          </p>
          <div className="sd-pay-icons">
            <img src="/short-drama/paywall-benefit-clapper.png" alt="" />
            <img src="/short-drama/paywall-benefit-play.png" alt="" />
            <img src="/short-drama/paywall-benefit-gallery.png" alt="" />
          </div>
        </div>
        <p className="sd-pay-plan">Prime: 1 Month, Total $9.99</p>
        <div className="sd-pay-ways">
          {[
            { way: "Credit Card", cls: "card" },
            { way: "Paypal", cls: "paypal" },
            { way: "Apple Pay", cls: "apple" },
          ].map((item) => (
            <button
              key={item.way}
              type="button"
              className={"sub-pay-way " + item.cls}
              onClick={() => unlockPlus(store, item.way)}
            >
              <span className="sub-pay-ico" aria-hidden>
                {item.way === "Apple Pay" ? "" : item.way === "Paypal" ? "P" : "C"}
              </span>
              <span className="sub-pay-label">{item.way}</span>
            </button>
          ))}
        </div>
        <p className="sd-pay-anon">100% anonymous. No automatic renewal.</p>
      </div>
    </div>
  );
}

function ShortDramaRetention({ onLater }: { onLater: () => void }) {
  const store = useStore();
  const drama = useDrama();
  const [playing, setPlaying] = useState(true);

  return (
    <div className="sd-keep-root">
      <div className="sd-keep-card">
        <div className="sd-keep-cover">
          {playing ? (
            <video
              className="sd-keep-media"
              src={drama.firstEpisodeUrl}
              poster={drama.watchCover || drama.cover}
              muted
              playsInline
              loop
              autoPlay
            />
          ) : (
            <img className="sd-keep-media" src={drama.watchCover || drama.cover} alt="" />
          )}
          <button
            type="button"
            className="sd-keep-play"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => setPlaying((v) => !v)}
          >
            <img src="/short-drama/paywall-retention-play.svg" alt="" />
          </button>
        </div>
        <h3>Stay with me for what happens next</h3>
        <div className="sd-keep-box">
          <p>Unlock Prime to watch the next episodes</p>
          <b>Only $0.33/day</b>
        </div>
        <div className="sd-keep-actions">
          <button type="button" className="sd-keep-stay" onClick={() => unlockPlus(store, "Stay with Her")}>
            Stay with Her
          </button>
          <button type="button" className="sd-keep-later" onClick={onLater}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

export function ShortDramaPaywallHost() {
  const store = useStore();
  const [step, setStep] = useState<"vip" | "retention">("vip");

  if (step === "retention") {
    return <ShortDramaRetention onLater={() => store.dispatch({ type: "closeOverlay" })} />;
  }
  return <ShortDramaVipSheet onDismiss={() => setStep("retention")} />;
}
