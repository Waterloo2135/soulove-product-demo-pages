const fs = require("fs");
let misc = fs.readFileSync("src/screens/MiscScreens.tsx", "utf8");
misc = misc.replace(
  'import { getRecentDramaIds } from "../dramaGuide";',
  'import { dramaBadge, getRecentDramaIds } from "../dramaGuide";'
);
if (!misc.includes("function DramaFlag")) {
  misc = misc.replace(
    "function DramaRecentRail({",
    `function DramaFlag({ kind }: { kind: "NEW" | "Update" | null }) {
  if (!kind) return null;
  return <span className={"drama-flag " + (kind === "NEW" ? "new" : "upd")}>{kind}</span>;
}

function DramaRecentRail({`
  );
}
misc = misc.replace(
          `<span className="drama-recent-cover">
            <img src={item.cover} alt="" draggable={false} />
          </span>`,
          `<span className="drama-recent-cover">
            <img src={item.cover} alt="" draggable={false} />
            <DramaFlag kind={dramaBadge(item) === "Update" ? "Update" : null} />
          </span>`
);
misc = misc.replace(
            `<button key={item.id} className="shorts-card" onClick={() => store.push("short-drama-watch", { id: item.id })}>
              <img src={item.cover} alt={item.title} />
            </button>`,
            `<button key={item.id} className="shorts-card" onClick={() => store.push("short-drama-watch", { id: item.id })}>
              <img src={item.cover} alt={item.title} />
              <DramaFlag kind={dramaBadge(item)} />
            </button>`
);
fs.writeFileSync("src/screens/MiscScreens.tsx", misc);

let css = fs.readFileSync("src/index.css", "utf8");
if (!css.includes(".drama-flag")) {
  css = css.replace(
    `.shorts-card {
  height: 234px; border-radius: 8px; overflow: hidden; background: #2a1d27;
}`,
    `.shorts-card {
  position: relative;
  height: 234px; border-radius: 8px; overflow: hidden; background: #2a1d27;
}`
  );
  css += `
.drama-flag {
  position: absolute;
  left: 6px;
  top: 6px;
  z-index: 2;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1.2;
  color: #1d141c;
}
.drama-flag.new { background: #ff4fa3; color: #fff; }
.drama-flag.upd { background: #ffe38a; color: #3a2a10; }
.drama-recent-cover { position: relative; }
`;
  fs.writeFileSync("src/index.css", css);
}
console.log("ui ok");
