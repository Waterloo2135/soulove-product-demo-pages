import { IconChat, IconDraw, IconHome, IconMe } from "./Icons";
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
  const { current, openTab, dramaPlat } = useStore();
  const items = dramaPlat ? ITEMS : ITEMS.filter((item) => item.id !== "short-drama");
  return (
    <nav className={"tabbar" + (dramaPlat ? "" : " tabs-4")}>
      {items.map((item) => {
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
