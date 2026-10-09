const fs = require("fs");
const p = "src/index.css";
let s = fs.readFileSync(p, "utf8");
const old = `.player-live-dots {
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
const neu = `.player-live-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 7px;
}
.player-live-dots i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.38);
  box-shadow: 0 0 1px rgba(0,0,0,0.55);
  font-style: normal;
}
.player-live-dots i.on {
  background: rgba(255,255,255,0.92);
}
.player-live-stack.land .player-live-dots {
  height: 6px;
  gap: 3px;
}
.player-live-stack.land .player-live-dots i {
  width: 4px;
  height: 4px;
}`;
if (!s.includes(old)) throw new Error("dots css missing");
fs.writeFileSync(p, s.replace(old, neu));
console.log("ok");
