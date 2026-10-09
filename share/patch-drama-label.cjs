const fs = require("fs");
const p = "src/components/TabBar.tsx";
let s = fs.readFileSync(p, "utf8");
if (!s.includes("{item.id === \"short-drama\" ? null : item.label}")) throw new Error("label branch missing");
s = s.replace("{item.id === \"short-drama\" ? null : item.label}", "{item.label}");
fs.writeFileSync(p, s);
console.log("ok");
