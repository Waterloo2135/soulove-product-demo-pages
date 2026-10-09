const fs = require("fs");

let tab = fs.readFileSync("src/components/TabBar.tsx", "utf8");
tab = tab.replace(
`export function TabBar() {
  const { current, openTab } = useStore();
  return (
    <nav className="tabbar">
      {ITEMS.map((item) => {`,
`export function TabBar() {
  const { current, openTab, dramaPlat } = useStore();
  const items = dramaPlat ? ITEMS : ITEMS.filter((item) => item.id !== "short-drama");
  return (
    <nav className={"tabbar" + (dramaPlat ? "" : " tabs-4")}>
      {items.map((item) => {`
);
fs.writeFileSync("src/components/TabBar.tsx", tab);

let css = fs.readFileSync("src/index.css", "utf8");
if (!css.includes(".tabbar.tabs-4")) {
  css = css.replace(
    "  grid-template-columns: repeat(5, 1fr);",
    `  grid-template-columns: repeat(5, 1fr);
}
.tabbar.tabs-4 {
  grid-template-columns: repeat(4, 1fr);`
  );
  fs.writeFileSync("src/index.css", css);
}

let home = fs.readFileSync("src/screens/HomeScreen.tsx", "utf8");
home = home.replace(
  "function buildForYouFeed(): ForYouItem[] {",
  "function buildForYouFeed(includeDrama: boolean): ForYouItem[] {"
);
home = home.replace(
    `    if ((idx + 1) % 3 === 0 && DRAMAS[dramaIdx]) {`,
    `    if (includeDrama && (idx + 1) % 3 === 0 && DRAMAS[dramaIdx]) {`
);
home = home.replace(
  "  const feed = useMemo(() => buildForYouFeed(), []);",
  "  const { dramaPlat } = useStore();\n  const feed = useMemo(() => buildForYouFeed(dramaPlat), [dramaPlat]);"
);
fs.writeFileSync("src/screens/HomeScreen.tsx", home);

let store = fs.readFileSync("src/store.tsx", "utf8");
store = store.replace(
`    case "setDramaPlat":
      return { ...state, dramaPlat: action.dramaPlat };`,
`    case "setDramaPlat": {
      const hideDrama = !action.dramaPlat;
      const onDrama = state.stack.some((item) => item.id === "short-drama" || item.id === "short-drama-watch");
      if (hideDrama && onDrama) {
        return { ...state, dramaPlat: false, stack: [{ id: "home" }], overlay: null };
      }
      return { ...state, dramaPlat: action.dramaPlat };
    }`
);
store = store.replace(
`    if (id === "short-drama-watch") markDramaWatched();
    if (MAIN_TABS.includes(id as MainTab)) {
      dispatch({ type: "openTab", tab: id as MainTab });
      return;
    }
    dispatch({ type: "push", item: { id, params: Object.keys(params).length ? params : undefined } });`,
`    if (id === "characters") {
      dispatch({ type: "setHomeTab", tab: "lover" });
      dispatch({ type: "openTab", tab: "home" });
      return;
    }
    if ((id === "short-drama" || id === "short-drama-watch") && !initial.dramaPlat) {
      dispatch({ type: "openTab", tab: "home" });
      return;
    }
    if (id === "short-drama-watch") markDramaWatched();
    if (MAIN_TABS.includes(id as MainTab)) {
      dispatch({ type: "openTab", tab: id as MainTab });
      return;
    }
    dispatch({ type: "push", item: { id, params: Object.keys(params).length ? params : undefined } });`
);
store = store.replace(
`      openTab: (tab) => {
        const fromChat = current.id === "chat-room";
        dispatch({ type: "openTab", tab });`,
`      openTab: (tab) => {
        if (tab === "short-drama" && !state.dramaPlat) {
          dispatch({ type: "openTab", tab: "home" });
          return;
        }
        const fromChat = current.id === "chat-room";
        dispatch({ type: "openTab", tab });`
);
store = store.replace(
`      push: (id, params) => {
        if (id === "short-drama-watch") markDramaWatched();
        dispatch({ type: "push", item: { id, params } });
      },`,
`      push: (id, params) => {
        if (id === "characters") {
          dispatch({ type: "setHomeTab", tab: "lover" });
          dispatch({ type: "openTab", tab: "home" });
          return;
        }
        if ((id === "short-drama" || id === "short-drama-watch") && !state.dramaPlat) {
          dispatch({ type: "openTab", tab: "home" });
          return;
        }
        if (id === "short-drama-watch") markDramaWatched();
        dispatch({ type: "push", item: { id, params } });
      },`
);
fs.writeFileSync("src/store.tsx", store);
console.log("ok");
