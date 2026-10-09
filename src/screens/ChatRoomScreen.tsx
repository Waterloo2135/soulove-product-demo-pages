import { useState } from "react";
import { CHARACTERS, DRAMAS, characterById } from "../mock";
import { DRAMA_ENTRY_ICON } from "../dramaGuide";
import { IconBack } from "../components/Icons";
import { useStore } from "../store";

export function ChatRoomScreen() {
  const store = useStore();
  const girl = characterById(store.current.params?.id);
  const [text, setText] = useState("");
  const [mine, setMine] = useState<string[]>([]);
  const sent = store.sentCount[girl.id] || 0;
  const drama = DRAMAS.find((item) => item.actors.some((actor) => actor.characterId === girl.id));
  const album = CHARACTERS.filter((item) => item.id === girl.id || item.classify.includes("hot")).slice(0, 3);

  const send = () => {
    const value = text.trim();
    if (!value) return;
    if (!store.requireUser()) return;
    if (store.persona === "free" && sent >= 2) {
      store.requirePlus("chatLimit");
      return;
    }
    setMine((prev) => [...prev, value]);
    store.dispatch({ type: "bumpSent", characterId: girl.id });
    setText("");
  };

  return (
    <div className="chat-live">
      <img className="chat-bg" src={girl.image} alt="" />
      <div className="chat-dim" />
      <div className="chat-top">
        <button className="chat-back" onClick={() => store.back()}><IconBack /></button>
        <button className="chat-who" onClick={() => store.push("character-detail", { id: girl.id })}>
          <span className="chat-who-ring">
            <img src={girl.image} alt="" />
          </span>
          <span>{girl.name}</span>
        </button>
        <button className="chat-more" aria-label="More">⋯</button>
      </div>
      <button className="chat-album" onClick={() => store.push("character-album", { id: girl.id })}>
        {album.map((item, idx) => (
          <img key={item.id + idx} src={item.image} alt="" style={{ zIndex: 3 - idx }} />
        ))}
      </button>
      <div className="chat-right">
        <button className="chat-heart" onClick={() => store.requirePlus("generic")} aria-label="Heart level">
          <span className="chat-heart-ico">❤</span>
          <small>Lv.1</small>
        </button>
        {store.dramaPlat ? (
          <button
            className="chat-drama"
            aria-label="Drama"
            onClick={() => {
              if (drama) store.push("short-drama-watch", { id: drama.id });
              else store.push("short-drama");
            }}
          >
            <img src={DRAMA_ENTRY_ICON} alt="" />
          </button>
        ) : null}
      </div>
      <div className="chat-stream">
        {store.current.params?.context ? <div className="bubble her">{store.current.params.context}</div> : null}
        <div className="bubble her">{girl.greeting}</div>
        <button className="chat-photo" onClick={() => store.requirePlus("unlockBlur")}>
          <img src={girl.image} alt="" />
          {store.persona !== "plus" ? <div className="chat-photo-lock">Plus</div> : null}
        </button>
        {mine.map((item, idx) => (
          <div className="bubble me" key={idx}>{item}</div>
        ))}
      </div>
      <div className="chat-dock">
        <div className="chat-tools">
          <button onClick={() => store.requireUser(() => store.dispatch({ type: "openOverlay", overlay: { type: "dress" } }))}><i>👗</i>Dress Up</button>
          <button onClick={() => store.requireUser(() => store.dispatch({ type: "openOverlay", overlay: { type: "gift" } }))}><i>🎁</i>Gift</button>
          <button onClick={() => store.requireUser(() => store.dispatch({ type: "openOverlay", overlay: { type: "askMedia", tab: "image" } }))}><i>📷</i>Photo</button>
          <button onClick={() => store.requireUser(() => store.dispatch({ type: "openOverlay", overlay: { type: "askMedia", tab: "video" } }))}><i>🎬</i>Video</button>
        </div>
        <div className="chat-input">
          <button className="chat-prompt" type="button">✦</button>
          <input
            value={text}
            placeholder="Enter to send texts"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="chat-action" type="button">(Action)</button>
          <button className="chat-send" onClick={send}>➤</button>
        </div>
      </div>
    </div>
  );
}

