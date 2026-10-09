const fs = require("fs");
const p = "src/components/Overlays.tsx";
let s = fs.readFileSync(p, "utf8");
const old = "100% anonymous. Cancel anytime. Then renews monthly at .99";
const neu = "100% anonymous. Cancel anytime. Then renews monthly at $13.99";
if (!s.includes(old)) throw new Error("broken copy missing");
fs.writeFileSync(p, s.replace(old, neu));
console.log("ok");
