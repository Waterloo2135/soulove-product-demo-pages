import { useMemo, useState } from "react";
import { CHARACTERS, characterById } from "../mock";
import { IconBack, IconChat, IconDraw } from "../components/Icons";
import { useStore } from "../store";

const GIFTS = [
  { name: "Rose", count: 128, img: CHARACTERS[0].image },
  { name: "Teddy", count: 56, img: CHARACTERS[1].image },
  { name: "Perfume", count: 34, img: CHARACTERS[2].image },
  { name: "Necklace", count: 19, img: CHARACTERS[3].image },
];

const ATTRS = [
  { icon: "💖", label: "Loyal" },
  { icon: "🔥", label: "Passionate" },
  { icon: "🧠", label: "Smart" },
  { icon: "🌙", label: "Night owl" },
];

export function CharacterDetailScreen() {
  const store = useStore();
  const girl = characterById(store.current.params?.id);
  const [expanded, setExpanded] = useState(false);
  const photos = useMemo(() => {
    const base = [girl.image, ...CHARACTERS.filter((item) => item.id !== girl.id).map((item) => item.image)];
    return base.slice(0, 6);
  }, [girl.id, girl.image]);
  const story = girl.bio + " She remembers the small things you say and turns ordinary nights into something private.";
  const short = story.length > 90 ? story.slice(0, 90) + "..." : story;

  return (
    <div className="cd">
      <div className="cd-scroll">
      <div className="cd-hero">
        <img src={girl.image} alt={girl.name} />
        <div className="cd-hero-mask" />
        <div className="cd-top">
          <button className="cd-icon-btn" onClick={store.back}>
            <IconBack />
          </button>
          <button className="cd-icon-btn" aria-label="More">
            ⋯
          </button>
        </div>
      </div>

      <div className="cd-body">
        <section className="cd-info">
          <h1>{girl.name}</h1>
          <p>
            {expanded ? story : short}
            {story.length > 90 ? (
              <button className="cd-more" onClick={() => setExpanded((v) => !v)}>
                {expanded ? "Close <<" : "All >>"}
              </button>
            ) : null}
          </p>
          <div className="cd-chips">
            <span>Age: {girl.age}</span>
            <span>Gender: ♀</span>
            <span className="cd-owner">User: Soulove</span>
          </div>
          <div className="cd-tags">
            {girl.tags.map((tag) => (
              <em key={tag}>{tag}</em>
            ))}
          </div>
        </section>

        <section className="cd-section">
          <div className="cd-sec-head">
            <h3>Photos ({photos.length})</h3>
            <button onClick={() => store.push("character-album", { id: girl.id })}>More &gt;&gt;</button>
          </div>
          <div className="cd-photos">
            {photos.map((src, idx) => (
              <button
                key={src + idx}
                className="cd-photo"
                onClick={() => {
                  if (idx > 1 && store.persona !== "plus") {
                    store.requirePlus("unlockBlur");
                    return;
                  }
                  store.push("character-album", { id: girl.id });
                }}
              >
                <img src={src} alt="" style={{ filter: idx > 1 && store.persona !== "plus" ? "blur(10px)" : undefined }} />
                {idx > 1 && store.persona !== "plus" ? <div className="cd-lock">Plus</div> : null}
              </button>
            ))}
          </div>
        </section>

        <section className="cd-section">
          <div className="cd-sec-head">
            <h3>Gifts</h3>
          </div>
          <div className="cd-gifts">
            {GIFTS.map((item) => (
              <div key={item.name} className="cd-gift">
                <div className="cd-gift-box">
                  <img src={item.img} alt="" />
                  <span>{item.count}</span>
                </div>
                <em>{item.name}</em>
              </div>
            ))}
          </div>
        </section>

        <section className="cd-section cd-personality">
          <h3>Personality Attributes</h3>
          <div className="cd-attrs">
            {ATTRS.map((item) => (
              <div key={item.label} className="cd-attr">
                <i>{item.icon}</i>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
        <div className="cd-spacer" />
      </div>
      </div>

      <div className="cd-bottom">
        <button
          className="cd-action"
          onClick={() => store.requireUser(() => store.openTab("generate"))}
        >
          <IconDraw />
          Photo & Video
        </button>
        <button
          className="cd-action"
          onClick={() => store.requireUser(() => store.push("chat-room", { id: girl.id }))}
        >
          <IconChat />
          Chat Now
        </button>
      </div>
    </div>
  );
}
