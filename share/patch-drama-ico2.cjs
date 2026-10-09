const fs = require("fs");
let tsx = fs.readFileSync("src/components/TabBar.tsx", "utf8");
tsx = tsx.replace(
  `{item.id === "chats" ? <span className="badge">2</span> : null}
            </span>
            {item.label}`,
  `{item.id === "chats" ? <span className="badge">2</span> : null}
            </span>
            {item.id === "short-drama" ? null : item.label}`
);
fs.writeFileSync("src/components/TabBar.tsx", tsx);
let css = fs.readFileSync("src/index.css", "utf8");
css = css.replace(
`.tab-drama-ico {
  height: 22px;
  width: auto;
  max-width: 58px;
  object-fit: contain;
  display: block;
}`,
`.tab-drama-ico {
  height: 24px;
  width: auto;
  max-width: 64px;
  object-fit: contain;
  display: block;
}`
);
fs.writeFileSync("src/index.css", css);
console.log("ok");
