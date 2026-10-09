import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CHARACTERS } from "../mock";
import { useStore } from "../store";

const GIFTS = [
  { id: "rose", name: "Rose", cost: "Free", vip: false, img: CHARACTERS[0].image },
  { id: "teddy", name: "Teddy", cost: "12", vip: false, img: CHARACTERS[1].image },
  { id: "perfume", name: "Perfume", cost: "28", vip: false, img: CHARACTERS[2].image },
  { id: "necklace", name: "Necklace", cost: "VIP", vip: true, img: CHARACTERS[3].image },
  { id: "lingerie", name: "Lingerie", cost: "VIP", vip: true, img: CHARACTERS[4].image },
  { id: "car", name: "Sports Car", cost: "99", vip: false, img: CHARACTERS[5].image },
  { id: "ring", name: "Ring", cost: "48", vip: false, img: CHARACTERS[0].image },
  { id: "wine", name: "Wine", cost: "18", vip: false, img: CHARACTERS[2].image },
  { id: "yacht", name: "Yacht", cost: "VIP", vip: true, img: CHARACTERS[1].image },
];

const DRESSES = [
  { id: "casual", name: "Casual", tag: "Free", vip: false, img: CHARACTERS[0].image },
  { id: "silk", name: "Silk robe", tag: "Plus", vip: true, img: CHARACTERS[1].image },
  { id: "office", name: "Office", tag: "40", vip: false, img: CHARACTERS[2].image },
  { id: "party", name: "Party", tag: "Plus", vip: true, img: CHARACTERS[3].image },
  { id: "sport", name: "Sporty", tag: "Free", vip: false, img: CHARACTERS[4].image },
  { id: "night", name: "Night out", tag: "60", vip: false, img: CHARACTERS[5].image },
  { id: "bikini", name: "Bikini", tag: "Plus", vip: true, img: CHARACTERS[0].image },
  { id: "gown", name: "Evening gown", tag: "80", vip: false, img: CHARACTERS[2].image },
  { id: "lingerie", name: "Lingerie", tag: "Plus", vip: true, img: CHARACTERS[4].image },
];

const ASK_IMAGE_SAFE = [
  { id: "smile", label: "Smile", img: CHARACTERS[0].image },
  { id: "hug", label: "Hug", img: CHARACTERS[1].image },
  { id: "coffee", label: "Coffee", img: CHARACTERS[2].image },
  { id: "sunset", label: "Sunset", img: CHARACTERS[3].image },
  { id: "casual", label: "Casual", img: CHARACTERS[4].image },
  { id: "sleep", label: "Sleepy", img: CHARACTERS[5].image },
  { id: "selfie", label: "Selfie", img: CHARACTERS[0].image },
  { id: "park", label: "Park", img: CHARACTERS[1].image },
];
const ASK_IMAGE_SPICY = [
  { id: "kiss", label: "Kiss", img: CHARACTERS[0].image },
  { id: "bedroom", label: "Bedroom", img: CHARACTERS[1].image },
  { id: "bath", label: "Bath", img: CHARACTERS[2].image },
  { id: "lingerie", label: "Lingerie", img: CHARACTERS[3].image },
  { id: "closeup", label: "Close-up", img: CHARACTERS[4].image },
  { id: "night", label: "Night", img: CHARACTERS[5].image },
  { id: "tease", label: "Tease", img: CHARACTERS[0].image },
  { id: "wet", label: "After shower", img: CHARACTERS[2].image },
];
const ASK_VIDEO_SAFE = [
  { id: "wave", label: "Wave", img: CHARACTERS[0].image },
  { id: "walk", label: "Walk", img: CHARACTERS[1].image },
  { id: "laugh", label: "Laugh", img: CHARACTERS[2].image },
  { id: "hello", label: "Hello", img: CHARACTERS[3].image },
  { id: "dance", label: "Dance", img: CHARACTERS[4].image },
  { id: "stretch", label: "Stretch", img: CHARACTERS[5].image },
  { id: "wink", label: "Wink", img: CHARACTERS[0].image },
  { id: "blow", label: "Blow kiss", img: CHARACTERS[1].image },
];
const ASK_VIDEO_SPICY = [
  { id: "tease", label: "Tease", img: CHARACTERS[0].image },
  { id: "slow", label: "Slow dance", img: CHARACTERS[1].image },
  { id: "bathv", label: "Bath", img: CHARACTERS[2].image },
  { id: "bedv", label: "Bedroom", img: CHARACTERS[3].image },
  { id: "closev", label: "Close-up", img: CHARACTERS[4].image },
  { id: "nightv", label: "Night", img: CHARACTERS[5].image },
  { id: "strip", label: "Undress", img: CHARACTERS[0].image },
  { id: "moan", label: "Soft moan", img: CHARACTERS[2].image },
];

function SheetFrame({
  title,
  onClose,
  children,
  gems,
  footer,
  onGemsClick,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  gems?: number;
  footer?: ReactNode;
  onGemsClick?: () => void;
}) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet chat-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="chat-sheet-head">
          <div className="h-title">{title}</div>
          {gems != null ? (
            <button className="chat-sheet-gems" type="button" onClick={onGemsClick || onClose}>
              Gems: <span>💎 {gems}</span> ›
            </button>
          ) : (
            <button type="button" onClick={onClose}>
              ✕
            </button>
          )}
        </div>
        <div className="chat-sheet-body">{children}</div>
        {footer}
      </div>
    </div>
  );
}

export function GiftSheet() {
  const store = useStore();
  const [active, setActive] = useState(GIFTS[0].id);
  const [withVideo, setWithVideo] = useState(true);
  const gift = GIFTS.find((item) => item.id === active) || GIFTS[0];
  return (
    <SheetFrame
      title="Gifts"
      onClose={() => store.dispatch({ type: "closeOverlay" })}
      gems={store.gems}
      onGemsClick={() => {
        store.dispatch({ type: "closeOverlay" });
        store.push("tokens");
      }}
      footer={
        <div className="chat-sheet-foot">
          <label className="sheet-check">
            <span className={"sheet-box" + (withVideo ? " on" : "")} onClick={() => setWithVideo((v) => !v)} />
            Show Video🔥
            {!withVideo || store.persona === "plus" ? null : <em className="plus-pill">Plus</em>}
          </label>
          <button
            className="cta gift-cta"
            onClick={() => {
              if (gift.vip && store.persona !== "plus") {
                store.dispatch({ type: "openOverlay", overlay: { type: "subscribe", scene: "generic" } });
                return;
              }
              if (withVideo && store.persona !== "plus") {
                store.dispatch({ type: "openOverlay", overlay: { type: "subscribe", scene: "generic" } });
                return;
              }
              if (gift.cost !== "Free" && gift.cost !== "VIP") {
                const cost = Number(gift.cost);
                if (store.gems < cost) {
                  store.dispatch({ type: "openOverlay", overlay: { type: "gems" } });
                  return;
                }
                store.dispatch({ type: "setGems", gems: store.gems - cost });
              }
              store.toast(`Gift sent: ${gift.name}`);
            }}
          >
            BUY FOR HER
          </button>
        </div>
      }
    >
      <p className="sheet-hint">Sending her a gift will get a picture reply</p>
      <div className="gift-grid">
        {GIFTS.map((item) => (
          <button
            key={item.id}
            className={"gift-card" + (item.id === active ? " on" : "")}
            onClick={() => setActive(item.id)}
          >
            <div className="gift-thumb">
              <img src={item.img} alt="" />
              <span className="gift-media">{withVideo ? "🎬" : "📷"}</span>
            </div>
            <div className={"gift-name" + (item.id === active ? " hot" : "")}>{item.name}</div>
            <div className="gift-cost">
              {item.cost === "VIP" ? "Plus" : item.cost === "Free" ? "Free" : <>💎 {item.cost}</>}
            </div>
          </button>
        ))}
      </div>
    </SheetFrame>
  );
}

export function DressSheet() {
  const store = useStore();
  const [active, setActive] = useState(DRESSES[0].id);
  const [withVideo, setWithVideo] = useState(true);
  const dress = DRESSES.find((item) => item.id === active) || DRESSES[0];
  return (
    <SheetFrame
      title="Dress Up"
      onClose={() => store.dispatch({ type: "closeOverlay" })}
      gems={store.gems}
      onGemsClick={() => {
        store.dispatch({ type: "closeOverlay" });
        store.push("tokens");
      }}
      footer={
        <div className="chat-sheet-foot">
          <label className="sheet-check">
            <span className={"sheet-box" + (withVideo ? " on" : "")} onClick={() => setWithVideo((v) => !v)} />
            Show Video🔥
            {store.persona === "plus" ? null : <em className="plus-pill">Plus</em>}
          </label>
          <button
            className="cta gift-cta"
            onClick={() => {
              if (dress.vip && store.persona !== "plus") {
                store.dispatch({ type: "openOverlay", overlay: { type: "subscribe", scene: "dressUp" } });
                return;
              }
              if (withVideo && store.persona !== "plus") {
                store.dispatch({ type: "openOverlay", overlay: { type: "subscribe", scene: "dressUp" } });
                return;
              }
              if (dress.tag !== "Free" && dress.tag !== "Plus") {
                const cost = Number(dress.tag);
                if (store.gems < cost) {
                  store.dispatch({ type: "openOverlay", overlay: { type: "gems" } });
                  return;
                }
                store.dispatch({ type: "setGems", gems: store.gems - cost });
              }
              store.toast(`Dressed: ${dress.name}`);
            }}
          >
            Dress up Her
          </button>
        </div>
      }
    >
      <div className="dress-grid">
        {DRESSES.map((item) => (
          <button
            key={item.id}
            className={"dress-card" + (item.id === active ? " on" : "")}
            onClick={() => setActive(item.id)}
          >
            <img src={item.img} alt="" />
            <span className={"dress-tag" + (item.tag === "Plus" ? " vip" : "")}>
              {item.tag === "Plus" || item.tag === "Free" ? item.tag : <>💎 {item.tag}</>}
            </span>
            {withVideo ? <span className="dress-video">🎬</span> : null}
            <div className="dress-name">{item.name}</div>
          </button>
        ))}
      </div>
    </SheetFrame>
  );
}

export function AskMediaSheet({ tab }: { tab: "image" | "video" }) {
  const store = useStore();
  const [media, setMedia] = useState<"image" | "video">(tab);
  const [spicy, setSpicy] = useState(false);
  const [picked, setPicked] = useState("");

  useEffect(() => {
    setMedia(tab);
    setPicked("");
  }, [tab]);

  useEffect(() => {
    setPicked("");
  }, [spicy, media]);

  const list = useMemo(() => {
    if (media === "image") return spicy ? ASK_IMAGE_SPICY : ASK_IMAGE_SAFE;
    return spicy ? ASK_VIDEO_SPICY : ASK_VIDEO_SAFE;
  }, [media, spicy]);

  const choose = (id: string, label: string) => {
    setPicked(id);
    if (store.persona !== "plus") {
      store.dispatch({
        type: "openOverlay",
        overlay: { type: "subscribe", scene: media === "video" ? "askVideo" : "askPhoto" },
      });
      return;
    }
    store.toast((media === "video" ? "Asked video: " : "Asked photo: ") + label);
  };

  const toggleSpicy = () => {
    setSpicy((v) => !v);
  };

  return (
    <div className="overlay ask-overlay" onClick={() => store.dispatch({ type: "closeOverlay" })}>
      <div className={"ask-sheet" + (spicy ? " spicy-on" : "")} onClick={(e) => e.stopPropagation()}>
        <div className="ask-top">
          <div className="ask-tabs">
            <button className={media === "image" ? "on" : ""} onClick={() => setMedia("image")}>
              📷 Image
            </button>
            <button className={media === "video" ? "on" : ""} onClick={() => setMedia("video")}>
              🎬 Video
            </button>
          </div>
          <div className="ask-spicy">
            <span>Spicy</span>
            <button className={"ask-switch" + (spicy ? " on" : "")} onClick={toggleSpicy} type="button" aria-label="Spicy" />
          </div>
        </div>

        <div className="ask-mode">
          {spicy ? "Spicy on · NSFW actions unlocked" : "Safe mode · everyday moments"}
        </div>

        <div className="ask-desc">
          {media === "image" ? "Ask for photos" : "Ask for videos"}
          {media === "video" ? <span>5s</span> : null}
        </div>

        <div className="ask-grid" key={`${media}-${spicy ? "spicy" : "safe"}`}>
          <button
            className="ask-card"
            onClick={() => {
              const item = list[Math.floor(Math.random() * list.length)];
              if (item) choose(item.id, "Random · " + item.label);
            }}
          >
            <div className={"ask-random" + (spicy ? " spicy" : "")}>↺</div>
            <em>Random</em>
          </button>
          {list.map((item) => (
            <button
              key={item.id}
              className={"ask-card" + (picked === item.id ? " on" : "")}
              onClick={() => choose(item.id, item.label)}
            >
              <div className={"ask-thumb" + (spicy ? " spicy" : "")}>
                <img src={item.img} alt="" />
                {spicy ? <i className="ask-flame">🔥</i> : null}
              </div>
              <em>{item.label}</em>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
