import { useStore } from "../store";

const LINKS: Array<{ id: "invitation" | "bonus" | "settings" | "contact-us"; title: string; extra?: string; icon: string }> = [
  { id: "invitation", title: "Invitation Reward", extra: "Free 30-Day VIP", icon: "🎁" },
  { id: "bonus", title: "Free Gems", extra: "Tasks", icon: "💎" },
  { id: "contact-us", title: "Feedback", icon: "✉️" },
  { id: "settings", title: "Set Up", icon: "⚙️" },
];

export function AccountScreen() {
  const store = useStore();
  const guest = store.persona === "guest";
  const plus = store.persona === "plus";
  return (
    <div className="me">
      <div className="me-bar">
        <button className="me-id" onClick={() => store.toast("ID copied")}>
          ID: 882910 <span>⧉</span>
        </button>
        <button className="me-fb" onClick={() => store.push("contact-us")} aria-label="Feedback">
          ✉
        </button>
      </div>
      <div className="me-profile">
        <button className={"me-avatar" + (plus ? " plus" : "")} onClick={() => (guest ? store.requireUser() : store.push("profile"))}>
          {guest ? "SL" : ""}
        </button>
        <button className="me-name" onClick={() => (guest ? store.requireUser() : store.push("profile"))}>
          {guest ? "Log in" : "Alex"}
          {!guest ? <span>✎</span> : null}
        </button>
      </div>
      <div className="me-pair">
        <button className="me-tile" onClick={() => store.requireUser(() => store.push("tokens"))}>
          <div className="me-tile-title">{store.gems}</div>
          <span className="me-pill">Recharge</span>
          <div className="me-gem-deco">💎</div>
        </button>
        <button className="me-tile" onClick={() => store.requireUser(() => store.push("subscriptions"))}>
          <div className="me-tile-title">{plus ? "Plus" : "Premium"}</div>
          <span className="me-pill">{plus ? "Manage" : "Upgrade"}</span>
          <div className="me-vip-deco">👑</div>
        </button>
      </div>
      <button className="me-gallery" onClick={() => store.requireUser(() => store.push("gallery"))}>
        Secret Gallery
        <span>›</span>
      </button>
      <div className="me-links">
        {LINKS.map((item) => (
          <button key={item.id} className="me-link" onClick={() => store.push(item.id)}>
            <span className="me-ico">{item.icon}</span>
            <span className="me-link-title">{item.title}</span>
            <span className="me-extra">{item.extra || ""}</span>
            <span className="me-chevron">›</span>
          </button>
        ))}
        <button className="me-link" onClick={() => store.push("settings")}>
          <span className="me-ico">🛡️</span>
          <span className="me-link-title">Trust & Safety</span>
          <span className="me-chevron">›</span>
        </button>
      </div>
    </div>
  );
}
