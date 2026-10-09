import { useEffect, useRef, useState, type ReactNode } from "react";
import { AskMediaSheet, DressSheet, GiftSheet } from "./ChatSheets";
import { LoginSheet } from "./LoginSheet";
import { DRAMAS, GEM_PACKS, SUB_PLANS, SUB_SCENES } from "../mock";
import { useStore } from "../store";
import type { SubscribeScene } from "../types";
import { ShortDramaPaywallHost } from "./ShortDramaPaywall";
import { ShortDramaPaywall2Host } from "./ShortDramaPaywall2";

function DramaRecommendDialog() {
  const store = useStore();
  const fromChat = store.overlay?.message !== "watch";
  const items = DRAMAS.filter((item) => item.id !== "d-landing").slice(0, 4);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, left: 0, moved: false });
  const selected = items[index] || items[0];
  const goWatch = () => {
    if (!selected) return;
    store.dispatch({ type: "closeOverlay" });
    store.push("short-drama-watch", { id: selected.id, autoplay: "1" });
  };
  const scrollTo = (i: number) => {
    const next = Math.max(0, Math.min(items.length - 1, i));
    setIndex(next);
    scroller.current?.scrollTo({ left: next * 260, behavior: "smooth" });
  };

  useEffect(() => {
    if (dragging || !selected) return;
    const timer = window.setTimeout(goWatch, 10000);
    return () => window.clearTimeout(timer);
  }, [dragging, index, selected?.id]);

  return (
    <div className="drama-rec">
      <button className="drama-rec-close" onClick={() => store.dispatch({ type: "closeOverlay" })} aria-label="Close">✕</button>
      <div className="drama-rec-inner">
        <h2 className="drama-rec-title">{fromChat ? "Watch her story. Make it yours." : "Others You May Like"}</h2>
        <div
          className="drama-rec-track"
          ref={scroller}
          onPointerDown={(e) => {
            drag.current = { x: e.clientX, left: scroller.current?.scrollLeft || 0, moved: false };
            setDragging(true);
            (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!dragging || !scroller.current) return;
            const dx = e.clientX - drag.current.x;
            if (Math.abs(dx) > 6) drag.current.moved = true;
            scroller.current.scrollLeft = drag.current.left - dx;
          }}
          onPointerUp={(e) => {
            setDragging(false);
            const dx = e.clientX - drag.current.x;
            if (dx < -40) scrollTo(index + 1);
            else if (dx > 40) scrollTo(index - 1);
            else scrollTo(index);
          }}
          onScroll={(e) => {
            if (dragging) return;
            const next = Math.round(e.currentTarget.scrollLeft / 260);
            setIndex(Math.max(0, Math.min(items.length - 1, next)));
          }}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              className={"drama-rec-card" + (i === index ? " on" : "")}
              onClick={() => {
                if (drag.current.moved) return;
                if (i === index) goWatch();
                else scrollTo(i);
              }}
            >
              {i === index ? (
                <video className="drama-rec-video" src={item.firstEpisodeUrl} poster={item.cover} muted playsInline loop autoPlay />
              ) : (
                <img src={item.cover} alt="" />
              )}
            </button>
          ))}
        </div>
        <p className="drama-rec-name">{selected ? selected.title : ""}</p>
        <button className="drama-rec-watch" onClick={goWatch}>Watch Now</button>
        <div className="drama-rec-dots">
          {items.map((item, i) => (
            <i key={item.id} className={i === index ? "on" : ""} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GemsSheet({ title }: { title: string }) {
  const store = useStore();
  const [packId, setPackId] = useState(GEM_PACKS[3]?.id || GEM_PACKS[0].id);
  const pack = GEM_PACKS.find((item) => item.id === packId) || GEM_PACKS[0];
  const buy = (way: string) => {
    store.dispatch({ type: "setGems", gems: store.gems + pack.gems + (pack.extra || 0) });
    store.dispatch({ type: "closeOverlay" });
    store.toast("+" + (pack.gems + (pack.extra || 0)) + " Gems · " + way);
  };
  return (
    <div className="gem-mask" onClick={() => store.dispatch({ type: "closeOverlay" })}>
      <div className="gem-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="gem-sheet-close" onClick={() => store.dispatch({ type: "closeOverlay" })}>✕</button>
        <h3 className="gem-sheet-title">{title}</h3>
        <p className="gem-bal center">Balance <span>💎</span> <b>{store.gems}</b></p>
        <div className="gem-sheet-scroll">
          <GemPackGrid packId={packId} setPackId={setPackId} />
          <div className="gem-benefits">
            <div className="gem-benefits-title">Gems can be used for</div>
            <div className="gem-benefit"><span>🖼</span> Generate NSFW photos</div>
            <div className="gem-benefit"><span>👗</span> Dress up lovers</div>
            <div className="gem-benefit"><span>🎁</span> Gift intimate toys</div>
            <div className="gem-benefit"><span>💬</span> Flirting in live</div>
          </div>
        </div>
        <div className="gem-sheet-foot">
          <div className="gem-pay-label">Select payment method</div>
          <div className="sub-pays">
            {[
              { way: "Credit Card", cls: "card" },
              { way: "Paypal", cls: "paypal" },
              { way: "Apple Pay", cls: "apple" },
            ].map((item) => (
              <button key={item.way} type="button" className={"sub-pay-way " + item.cls} onClick={() => buy(item.way)}>
                <span className="sub-pay-ico" aria-hidden>{item.way === "Apple Pay" ? "" : item.way === "Paypal" ? "P" : "C"}</span>
                <span className="sub-pay-label">{item.way}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HRow({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth + 1) return;
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!dx) return;
      e.preventDefault();
      el.scrollLeft += dx;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

function GemPackGrid({ packId, setPackId }: { packId: string; setPackId: (id: string) => void }) {
  return (
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
  );
}

function SubscribeDialog({ scene }: { scene: SubscribeScene }) {
  const store = useStore();
  const copy = SUB_SCENES[scene] || SUB_SCENES.generic;
  const [planId, setPlanId] = useState("month");
  return (
    <div className="sub-dlg">
      <button className="sub-close" onClick={() => store.dispatch({ type: "closeOverlay" })}>
        ✕
      </button>
      <div className="sub-scroll">
        <div className="sub-title">
          Upgrade to Access <span>{copy.highlight}</span>
        </div>
        <p className="sub-sub">
          {copy.before}
          <em>{copy.emph}</em>
          {copy.after}
        </p>
        <div className="sub-hero">
          <img src={copy.image} alt="" />
        </div>
        <div className="sub-included">
          <div>
            INCLUDED WITH <span>Plus</span>
          </div>
          <button type="button" onClick={() => { store.dispatch({ type: "closeOverlay" }); store.push("subscriptions"); }}>
            10 Benefits &gt;
          </button>
        </div>
        <ul className="sub-benefits">
          {copy.benefits.map((item) => (
            <li key={item}>
              <i>✓</i>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="sub-foot">
        <HRow className="sub-plans">
          {SUB_PLANS.map((plan) => (
            <button
              key={plan.id}
              className={"sub-plan" + (plan.id === planId ? " on" : "")}
              onClick={() => setPlanId(plan.id)}
            >
              <div className="sub-plan-name">{plan.name}</div>
              {plan.month ? <div className="sub-plan-month">{plan.month}</div> : null}
              {plan.total ? <div className="sub-plan-total">{plan.total}</div> : null}
              {plan.off ? <div className="sub-plan-off">{plan.off}</div> : null}
            </button>
          ))}
        </HRow>
        <p className="sub-anon">{planId === "life" || planId === "week"
          ? "100% anonymous. No automatic renewal."
          : planId === "quarter"
            ? "100% anonymous. Cancel anytime. Then renews quarterly at $29.97"
            : "100% anonymous. Cancel anytime. Then renews monthly at $13.99"}</p>
        <div className="sub-pays">
          {[
            { way: "Credit Card", cls: "card", icon: "Card" },
            { way: "Paypal", cls: "paypal", icon: "Pay" },
            { way: "Apple Pay", cls: "apple", icon: "" },
          ].map((item) => (
            <button
              key={item.way}
              type="button"
              className={"sub-pay-way " + item.cls}
              onClick={() => {
                store.dispatch({ type: "setPersona", persona: "plus" });
                store.toast("Plus unlocked · " + item.way);
              }}
            >
              <span className="sub-pay-ico" aria-hidden>
                {item.way === "Apple Pay" ? "" : item.way === "Paypal" ? "P" : "C"}
              </span>
              <span className="sub-pay-label">{item.way}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OverlayHost() {
  const store = useStore();
  const overlay = store.overlay;
  if (!overlay) return null;
  if (overlay.type === "toast") return <div className="toast">{overlay.message}</div>;

  if (overlay.type === "gift") return <GiftSheet />;
  if (overlay.type === "dress") return <DressSheet />;
  if (overlay.type === "askMedia") return <AskMediaSheet tab={overlay.tab || "image"} />;

  if (overlay.type === "login") {
    return <LoginSheet />;
  }

  if (overlay.type === "dramaRecommend") {
    return <DramaRecommendDialog />;
  }

  if (overlay.type === "shortDrama" || (overlay.type === "subscribe" && overlay.scene === "shortDrama")) {
    return <ShortDramaPaywallHost />;
  }

  if (overlay.type === "shortDrama2") {
    return <ShortDramaPaywall2Host />;
  }

  if (overlay.type === "subscribe") {
    return <SubscribeDialog scene={(overlay.scene || "generic") as SubscribeScene} />;
  }

  if (overlay.type === "gems") {
    return <GemsSheet title="Not enough Gems" />;
  }

  if (overlay.type === "bonus") {
    return (
      <div className="overlay" onClick={() => store.dispatch({ type: "closeOverlay" })}>
        <div className="sheet" onClick={(e) => e.stopPropagation()}>
          <h3>Welcome gift</h3>
          <p>12 Gems to start. The real unlock is Plus — don't bury that behind recharge.</p>
          <button className="cta" onClick={() => store.dispatch({ type: "closeOverlay" })}>
            Start chatting
          </button>
        </div>
      </div>
    );
  }

  return null;
}



