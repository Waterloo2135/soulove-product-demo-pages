import { CHARACTERS } from "../mock";
import { useStore } from "../store";
import type { Character } from "../types";

function LoverCard({ item, onClick }: { item: Character; onClick: () => void }) {
  const relation = item.tags[0] || item.tag;
  const occupation = item.tags[1];
  return (
    <button type="button" className="lover-card" onClick={onClick}>
      <img src={item.image} alt={item.name} />
      <div className="lover-scrim" />
      <div className="lover-meta">
        <div className="lover-name-row">
          <div className="lover-name">{item.name}</div>
          <span className="lover-cake" aria-hidden>
            🎂
          </span>
          <div className="lover-age">{item.age}</div>
        </div>
        {relation || occupation ? (
          <div className="lover-tags">
            {relation ? <span className="lover-tag-item">{relation}</span> : null}
            {relation && occupation ? <span className="lover-tag-sep" /> : null}
            {occupation ? <span className="lover-tag-item shrink">{occupation}</span> : null}
          </div>
        ) : null}
      </div>
    </button>
  );
}

export function CharactersScreen() {
  const store = useStore();
  const mine = CHARACTERS.slice(0, 4);
  const guest = store.persona === "guest";
  return (
    <div className="lover-page">
      <div className="lover-head">
        <div className="lover-title">myGirls</div>
        {guest ? (
          <button className="ui-login" onClick={() => store.requireUser()}>
            Log in
          </button>
        ) : (
          <button className="ui-gems" onClick={() => store.push("tokens")}>
            💎 {store.gems}
          </button>
        )}
      </div>

      {guest ? (
        <div className="lover-empty">
          <div className="lover-empty-title">
            Create your own
            <br />
            AI Girlfriend
          </div>
          <p>Customize her look, personality, and story. Start chatting in minutes.</p>
          <button className="cta" onClick={() => store.requireUser(() => store.push("create-character"))}>
            Create your lover
          </button>
        </div>
      ) : (
        <>
          <div className="lover-grid">
            {mine.map((item) => (
              <LoverCard
                key={item.id}
                item={item}
                onClick={() => store.push("character-detail", { id: item.id })}
              />
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
