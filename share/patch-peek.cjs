const fs = require("fs");
const p = "src/index.css";
let s = fs.readFileSync(p, "utf8");
const old1 = `.player-live-peek {
  position: absolute;
  left: -9px;
  top: 5px;
  z-index: 1;
  width: 36px;
  height: 36px;
  pointer-events: none;
  transition: opacity 0.16s ease;
}
.player-live-stack.land .player-live-peek {
  left: -7px;
  top: 4px;
  width: 30px;
  height: 30px;
}`;
const new1 = `.player-live-peek {
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
if (!s.includes(old1)) throw new Error("peek pos missing");
s = s.replace(old1, new1);
const old2 = `.player-live-peek img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255,255,255,0.5);
  opacity: 0.78;
  filter: brightness(0.82);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.28);
}`;
const new2 = `.player-live-peek img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.78);
  opacity: 0.92;
  filter: brightness(0.92);
  box-shadow: 0 1px 4px rgba(0,0,0,0.45);
}`;
if (!s.includes(old2)) throw new Error("peek img missing");
s = s.replace(old2, new2);
fs.writeFileSync(p, s);
console.log("ok");
