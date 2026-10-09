const fs = require("fs");

let home = fs.readFileSync("src/screens/HomeScreen.tsx", "utf8");
const old = `    <div className="home-lover">
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
    </div>`;
const neu = `    <div className="home-lover">
      {guest ? (
        <div className="lover-empty">
          <p>Create your dream AI girlfriend and start chatting.</p>
        </div>
      ) : (
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
      )}
      <div className="home-lover-create">
        <button
          className="cta"
          onClick={() => store.requireUser(() => store.push("create-character"))}
        >
          Create your lover
        </button>
      </div>
    </div>`;
if (!home.includes(old)) throw new Error("lover feed missing");
fs.writeFileSync("src/screens/HomeScreen.tsx", home.replace(old, neu));

let css = fs.readFileSync("src/index.css", "utf8");
const oldCss = `.home-lover { padding: 0 0 20px; }
.home-lover .lover-grid { padding-top: 8px; }
.home-lover-create { padding: 4px 12px 12px; }`;
const newCss = `.home-root {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.home-lover {
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
}
.home-lover-create .cta { width: 100%; }`;
if (!css.includes(oldCss)) throw new Error("lover css missing");
fs.writeFileSync("src/index.css", css.replace(oldCss, newCss));
console.log("ok");
