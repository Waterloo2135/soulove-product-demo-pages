const fs = require("fs");
const p = "src/index.css";
let s = fs.readFileSync(p, "utf8");
const old = `.tabbar {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 72px;
  padding: 6px 8px var(--safe-bottom);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}
.tabbar.tabs-4 {
  grid-template-columns: repeat(4, 1fr);
  background: linear-gradient(180deg, rgba(29,20,28,0.72), #1d141c 36%);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--line);
}`;
const neu = `.tabbar {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  z-index: 30;
  height: 72px;
  padding: 6px 8px var(--safe-bottom);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: #1d141c;
  border-top: 1px solid var(--line);
}
.tabbar.tabs-4 {
  grid-template-columns: repeat(4, 1fr);
}`;
if (!s.includes(old)) throw new Error("tabbar css missing");
fs.writeFileSync(p, s.replace(old, neu));
console.log("ok");
