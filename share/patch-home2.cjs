const fs = require("fs");
let home = fs.readFileSync("src/screens/HomeScreen.tsx", "utf8");
home = home.replace('{ id: "shorts", label: "Shorts" }', '{ id: "lover", label: "My Lover" }');
home = home.replace(/\r?\nconst SHORTS_TAB =[\s\S]*?const SHORTS_HERO =[\s\S]*?;\r?\n/, "\n");
home = home.replace(
  /\{tab\.id === "shorts" \? \([\s\S]*?\) : \(\s*tab\.label\s*\)\}/,
  "{tab.label}"
);
home = home.replace(
  '<div className={"home-tabs" + (store.homeTab === "shorts" ? " on-shorts" : "")}>',
  '<div className="home-tabs">'
);
home = home.replace(
  /function ShortsFeed\(\) \{[\s\S]*?\n\}\r?\n\r?\nexport function HomeScreen/,
  `function LoverFeed() {
  const store = useStore();
  const mine = CHARACTERS.slice(0, 4);
  const guest = store.persona === "guest";
  return (
    <div className="home-lover">
      {guest ? (
        <div className="lover-empty">
          <p>Create your dream AI girlfriend and start chatting.</p>
          <button className="cta" onClick={() => store.requireUser(() => store.push("create-character"))}>
            Create your lover
          </button>
        </div>
      ) : (
        <>
          <div className="lover-grid">
            {mine.map((item) => (
              <button
                key={item.id}
                className="lover-card"
                onClick={() => store.push("character-detail", { id: item.id })}
              >
                <img src={item.image} alt={item.name} />
                <div className="lover-meta">
                  <div className="lover-name">{item.name}</div>
                  <div className="lover-tag">{item.tag}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="home-lover-create">
            <button className="cta" onClick={() => store.push("create-character")}>
              Create your lover
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function HomeScreen`
);
home = home.replace(
  '<div className={"home-root" + (homeTab === "shorts" ? " shorts-mode" : "")}>',
  '<div className="home-root">'
);
home = home.replace(
  '{homeTab === "shorts" ? <ShortsFeed /> : null}',
  '{homeTab === "lover" ? <LoverFeed /> : null}'
);
if (home.includes("ShortsFeed") || home.includes("shorts")) throw new Error("shorts leftover: " + (home.match(/shorts/gi)||[]).slice(0,5));
fs.writeFileSync("src/screens/HomeScreen.tsx", home);

let misc = fs.readFileSync("src/screens/MiscScreens.tsx", "utf8");
misc = misc.replace(
  /export function ShortDramaScreen\(\) \{[\s\S]*?\n\}\r?\n\r?\nfunction PlayerLiveActors/,
  `const SHORTS_HERO =
  "https://d2tntkfu60is0z.cloudfront.net/sl/h5/resource/4370e7a029364b4cb61af15ac623105b.png";

export function ShortDramaScreen() {
  const store = useStore();
  return (
    <div className="drama-tab-page">
      <div className="lover-head">
        <div className="lover-title">Drama</div>
        {store.persona === "guest" ? (
          <button className="ui-login" onClick={() => store.requireUser()}>Log in</button>
        ) : (
          <button className="ui-gems" onClick={() => store.push("tokens")}>💎 {store.gems}</button>
        )}
      </div>
      <div className="shorts-page">
        <div className="shorts-hero">
          <img src={SHORTS_HERO} alt="" />
        </div>
        <p className="shorts-sub">Binge her story. Unlock every episode with Plus.</p>
        <div className="shorts-grid">
          {DRAMAS.map((item) => (
            <button key={item.id} className="shorts-card" onClick={() => store.push("short-drama-watch", { id: item.id })}>
              <img src={item.cover} alt={item.title} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerLiveActors`
);
if (!misc.includes("drama-tab-page")) throw new Error("drama screen not replaced");
fs.writeFileSync("src/screens/MiscScreens.tsx", misc);
console.log("ok");
