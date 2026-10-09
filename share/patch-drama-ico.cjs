const fs = require("fs");

fs.writeFileSync("src/components/TabBar.tsx", `import { IconChat, IconDraw, IconHome, IconMe } from "./Icons";
import { useStore } from "../store";
import type { MainTab } from "../types";

const DRAMA_TAB =
  "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/0e843eaa168e4cdbb4d53f755f74d459.png";
const DRAMA_TAB_ON =
  "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/4e0d39b75d384712a7592f4a93f6dbe4.png";

const ITEMS: Array<{ id: MainTab; label: string; icon: typeof IconHome }> = [
  { id: "home", label: "Home", icon: IconHome },
  { id: "chats", label: "Chats", icon: IconChat },
  { id: "short-drama", label: "Drama", icon: IconHome },
  { id: "generate", label: "Draw", icon: IconDraw },
  { id: "account", label: "Me", icon: IconMe },
];

export function TabBar() {
  const { current, openTab } = useStore();
  return (
    <nav className="tabbar">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = current.id === item.id;
        return (
          <button key={item.id} className={"tab" + (active ? " active" : "")} onClick={() => openTab(item.id)}>
            <span style={{ position: "relative" }}>
              {item.id === "short-drama" ? (
                <img className="tab-drama-ico" src={active ? DRAMA_TAB_ON : DRAMA_TAB} alt="" />
              ) : (
                <Icon />
              )}
              {item.id === "chats" ? <span className="badge">2</span> : null}
            </span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
`);

let css = fs.readFileSync("src/index.css", "utf8");
if (!css.includes(".tab-drama-ico")) {
  css = css.replace(
    ".tab svg { width: 22px; height: 22px; }",
    `.tab svg { width: 22px; height: 22px; }
.tab-drama-ico {
  height: 22px;
  width: auto;
  max-width: 58px;
  object-fit: contain;
  display: block;
}`
  );
  fs.writeFileSync("src/index.css", css);
}
console.log("ok");
