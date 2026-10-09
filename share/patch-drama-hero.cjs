const fs = require("fs");
let misc = fs.readFileSync("src/screens/MiscScreens.tsx", "utf8");

const oldRailHandlers = `  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    if (!el) return;
    drag.current = { on: true, x: e.clientX, left: el.scrollLeft, moved: false, pid: e.pointerId };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.on || e.pointerId !== drag.current.pid) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    if (scroller.current) scroller.current.scrollLeft = drag.current.left - dx;
  };
  const endPointer = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.on || e.pointerId !== drag.current.pid) return;
    drag.current.on = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };`;

const newRailHandlers = `  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
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
  };`;

if (!misc.includes(oldRailHandlers)) throw new Error("rail handlers missing");
misc = misc.replace(oldRailHandlers, newRailHandlers);

misc = misc.replace(
          `        <button
          key={item.id}
          className="drama-recent-card"
          onClick={() => {
            if (drag.current.moved) return;
            onOpen(item.id);
          }}
        >`,
          `        <button
          key={item.id}
          type="button"
          data-id={item.id}
          className="drama-recent-card"
          onClick={(ev) => ev.preventDefault()}
        >`
);

const oldHead = `    <div className="drama-tab-page">
      <div className="lover-head">
        <div className="lover-title">Drama</div>
        {store.persona === "guest" ? (
          <button className="ui-login" onClick={() => store.requireUser()}>Log in</button>
        ) : (
          <button className="ui-gems" onClick={() => store.push("tokens")}>💎 {store.gems}</button>
        )}
      </div>
      <div className="shorts-page">
        <div className="shorts-hero">
          <img src={SHORTS_HERO} alt="" />
        </div>
        <p className="shorts-sub">Binge her story. Unlock every episode with Plus.</p>`;

const newHead = `    <div className="drama-tab-page">
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
        </div>`;

if (!misc.includes(oldHead)) throw new Error("head missing");
misc = misc.replace(oldHead, newHead);
fs.writeFileSync("src/screens/MiscScreens.tsx", misc);

let css = fs.readFileSync("src/index.css", "utf8");
if (!css.includes(".drama-hero {")) {
  css = css.replace(
    `.shorts-page { position: relative; padding-bottom: 16px; }
.shorts-hero { height: 210px; overflow: hidden; }
.shorts-hero img { width: 100%; height: 100%; object-fit: cover; object-position: top; }`,
    `.shorts-page { position: relative; padding-bottom: 16px; }
.shorts-hero { height: 210px; overflow: hidden; }
.shorts-hero img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.drama-hero {
  position: relative;
  height: 210px;
  overflow: hidden;
  margin-bottom: 8px;
}
.drama-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
}
.drama-hero-top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 16px 0;
}
.drama-hero-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
  text-shadow: 0 1px 8px rgba(0,0,0,0.35);
}
.drama-hero-spark {
  display: inline-block;
  margin-left: 6px;
  font-size: 14px;
  transform: translateY(-8px);
  color: #fff;
  opacity: 0.95;
}`
  );
  fs.writeFileSync("src/index.css", css);
}
console.log("ok");
