const fs = require("fs");

const tsxPath = "src/screens/MiscScreens.tsx";
let tsx = fs.readFileSync(tsxPath, "utf8");

const oldReturn = `  const label = current.name + " online" + (multi ? ", " + String(index + 1) + " of " + String(n) : "");

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
      {multi ? (
        <span className={"player-live-peek" + (Math.abs(dragX) > 6 ? " hide" : "")} aria-hidden="true">
          <img src={next.avatar} alt="" />
        </span>
      ) : null}
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
  );
}`;

const newReturn = `  const label = current.name + " online" + (multi ? ", " + String(index + 1) + " of " + String(n) : "");
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
}`;

if (!tsx.includes(oldReturn)) throw new Error("return block missing");
tsx = tsx.replace(oldReturn, newReturn);
fs.writeFileSync(tsxPath, tsx);

const cssPath = "src/index.css";
let css = fs.readFileSync(cssPath, "utf8");
const oldStack = `.player-live-stack {
  position: relative;
  width: 48px;
  height: 48px;
  flex: none;
  margin-bottom: 2px;
  touch-action: none;
  cursor: pointer;
  overflow: visible;
}
.player-live-stack.land {
  width: 40px;
  height: 40px;
}
.player-live-peek {
  position: absolute;
  left: auto;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  width: 38px;
  height: 38px;
  pointer-events: none;
  transition: opacity 0.16s ease;
}
.player-live-stack.land .player-live-peek {
  right: -5px;
  width: 32px;
  height: 32px;
}
.player-live-peek.hide { opacity: 0; }
.player-live-peek img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255,255,255,0.55);
  opacity: 0.9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.35);
}
.player-live-window {
  position: relative;
  z-index: 2;
  width: 48px;
  height: 48px;
  overflow: hidden;
  border-radius: 50%;
  background: #2a1d27;
}`;
const newStack = `.player-live-stack {
  position: relative;
  width: 48px;
  flex: none;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  touch-action: none;
  cursor: pointer;
  overflow: visible;
}
.player-live-stack.land {
  width: 40px;
}
.player-live-ava-wrap {
  position: relative;
  width: 48px;
  height: 48px;
  flex: none;
}
.player-live-stack.land .player-live-ava-wrap {
  width: 40px;
  height: 40px;
}
.player-live-window {
  position: relative;
  z-index: 2;
  width: 48px;
  height: 48px;
  overflow: hidden;
  border-radius: 50%;
  background: #2a1d27;
}`;
if (!css.includes(oldStack)) throw new Error("stack css missing");
css = css.replace(oldStack, newStack);

const oldFx = `.player-live-fx {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  display: grid;
  place-items: center;
}`;
const newFx = `.player-live-fx {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  display: grid;
  place-items: center;
}
.player-live-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 6px;
}
.player-live-dots i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255,255,255,0.32);
  font-style: normal;
}
.player-live-dots i.on {
  background: rgba(255,255,255,0.82);
}
.player-live-stack.land .player-live-dots {
  height: 5px;
  gap: 2px;
}
.player-live-stack.land .player-live-dots i {
  width: 3px;
  height: 3px;
}`;
if (!css.includes(oldFx)) throw new Error("fx css missing");
css = css.replace(oldFx, newFx);
fs.writeFileSync(cssPath, css);
console.log("ok");
