const fs = require("fs");
const path = "src/index.css";
let s = fs.readFileSync(path, "utf8");
const old = `.player-live-ava {
  position: relative;
  width: 48px;
  height: 48px;
  padding: 0;
  margin-bottom: 2px;
  display: grid;
  place-items: center;
}
.player-live-ava img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 2;
  border: 2px solid #fff;
  background: #2a1d27;
  animation: player-live-swap 0.35s ease;
}
@keyframes player-live-swap {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
.player-live-wave {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(57, 255, 136, 0.75);
  animation: player-live-ripple 1.8s ease-out infinite;
  pointer-events: none;
}
.player-live-wave.delay { animation-delay: 0.9s; }
@keyframes player-live-ripple {
  0% { transform: scale(1); opacity: 0.65; }
  100% { transform: scale(1.85); opacity: 0; }
}
.player-live-dot {
  position: absolute;
  right: 1px;
  bottom: 1px;
  z-index: 3;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #39FF88;
  border: 2px solid #1d141c;
  font-style: normal;
}
.player-live-ava.land {
  width: 40px;
  height: 40px;
}
.player-live-ava.land img,
.player-live-ava.land .player-live-wave {
  width: 36px;
  height: 36px;
}`;
if (!s.includes(old)) throw new Error("css block missing");
const neu = `.player-live-stack {
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
}
.player-live-peek.hide { opacity: 0; }
.player-live-peek img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255,255,255,0.5);
  opacity: 0.78;
  filter: brightness(0.82);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.28);
}
.player-live-window {
  position: relative;
  z-index: 2;
  width: 48px;
  height: 48px;
  overflow: hidden;
  border-radius: 50%;
  background: #2a1d27;
}
.player-live-stack.land .player-live-window {
  width: 40px;
  height: 40px;
}
.player-live-window > img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-sizing: border-box;
  background: #2a1d27;
}
.player-live-stack.land .player-live-window > img {
  width: 40px;
  height: 40px;
}
.player-live-track {
  display: flex;
  height: 100%;
  width: 300%;
  margin-left: -100%;
  will-change: transform;
}
.player-live-track.smooth {
  transition: transform 0.28s cubic-bezier(0.22, 0.9, 0.28, 1);
}
.player-live-track img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex: none;
  border: 2px solid #fff;
  box-sizing: border-box;
  background: #2a1d27;
  pointer-events: none;
}
.player-live-stack.land .player-live-track img {
  width: 40px;
  height: 40px;
}
.player-live-fx {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  display: grid;
  place-items: center;
}
.player-live-wave {
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
.player-live-dot {
  position: absolute;
  right: 1px;
  bottom: 1px;
  z-index: 3;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #39FF88;
  border: 2px solid #1d141c;
  font-style: normal;
}
.player-live-stack.land .player-live-dot {
  width: 8px;
  height: 8px;
}`;
s = s.replace(old, neu);
fs.writeFileSync(path, s);
console.log("css ok");
