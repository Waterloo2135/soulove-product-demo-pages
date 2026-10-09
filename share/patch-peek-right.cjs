const fs = require("fs");

const tsxPath = "src/screens/MiscScreens.tsx";
let tsx = fs.readFileSync(tsxPath, "utf8");
const oldFx = `      <span className="player-live-fx">
        <span className="player-live-wave" />
        <span className="player-live-wave delay" />
        <i className="player-live-dot" />
      </span>`;
const newFx = `      <span className="player-live-fx">
        <i className="player-live-dot" />
      </span>`;
if (!tsx.includes(oldFx)) throw new Error("fx block missing");
tsx = tsx.replace(oldFx, newFx);
fs.writeFileSync(tsxPath, tsx);

const cssPath = "src/index.css";
let css = fs.readFileSync(cssPath, "utf8");
const oldPeek = `.player-live-peek {
  position: absolute;
  left: -11px;
  top: 8px;
  z-index: 1;
  width: 42px;
  height: 42px;
  pointer-events: none;
  transition: opacity 0.16s ease;
}
.player-live-stack.land .player-live-peek {
  left: -8px;
  top: 6px;
  width: 34px;
  height: 34px;
}`;
const newPeek = `.player-live-peek {
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
}`;
if (!css.includes(oldPeek)) throw new Error("peek css missing");
css = css.replace(oldPeek, newPeek);

css = css.replace(`.player-live-peek img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.78);
  opacity: 0.92;
  filter: brightness(0.92);
  box-shadow: 0 1px 4px rgba(0,0,0,0.45);
}`, `.player-live-peek img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255,255,255,0.55);
  opacity: 0.9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.35);
}`);

const oldWave = `.player-live-wave {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(57, 255, 136, 0.75);
  animation: player-live-ripple 1.8s ease-out infinite;
  pointer-events: none;
}
.player-live-stack.land .player-live-wave {
  width: 36px;
  height: 36px;
}
.player-live-wave.delay { animation-delay: 0.9s; }
@keyframes player-live-ripple {
  0% { transform: scale(1); opacity: 0.65; }
  100% { transform: scale(1.85); opacity: 0; }
}
`;
if (!css.includes(oldWave)) throw new Error("wave css missing");
css = css.replace(oldWave, "");
fs.writeFileSync(cssPath, css);
console.log("ok");
