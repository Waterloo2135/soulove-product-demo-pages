const fs = require("fs");
let css = fs.readFileSync("src/index.css", "utf8");
const old = `.home-lover {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 87px;
}
.home-lover .lover-grid { padding-top: 8px; }
.home-lover-create {
  margin-top: auto;
  position: sticky;
  bottom: 87px;
  z-index: 6;
  padding: 0 12px;
}`;
const neu = `.home-lover {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 15px;
}
.home-lover .lover-grid { padding-top: 8px; }
.home-lover-create {
  margin-top: auto;
  position: sticky;
  bottom: 15px;
  z-index: 6;
  padding: 0 12px;
}`;
if (!css.includes(old)) throw new Error("css missing");
fs.writeFileSync("src/index.css", css.replace(old, neu));
console.log("ok");
