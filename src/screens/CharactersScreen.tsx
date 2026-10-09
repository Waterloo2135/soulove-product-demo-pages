import { CHARACTERS } from "../mock";
import { useStore } from "../store";

export function CharactersScreen() {
  const store = useStore();
  const mine = CHARACTERS.slice(0, 4);
  const guest = store.persona === "guest";
  return (
    <div className="lover-page">
      <div className="lover-head">
        <div className="lover-title">myGirls</div>
        {guest ? (
          <button className="ui-login" onClick={() => store.requireUser()}>Log in</button>
        ) : (
          <button className="ui-gems" onClick={() => store.push("tokens")}>💎 {store.gems}</button>
        )}
      </div>
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
          <div className="lover-create-wrap">
            <button className="cta" onClick={() => store.push("create-character")}>
              Create your lover
            </button>
          </div>
        </>
      )}
    </div>
  );
}
