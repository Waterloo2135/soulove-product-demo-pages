import { useEffect, useRef, useState } from "react";
import { CHARACTERS } from "../mock";
import { useStore } from "../store";

const REMIX_CLIPS = [
  "https://d2tntkfu60is0z.cloudfront.net/sl/config/335bcdd7c8fb408287b3c0904f742e70.mp4",
  "https://d2tntkfu60is0z.cloudfront.net/sl/config/b8118ff064574df18409b61b692820ef.mp4",
  "https://d2tntkfu60is0z.cloudfront.net/sl/config/bbfe026ad76349aaaa63b0e75d9c06f1.mp4",
  "https://d2tntkfu60is0z.cloudfront.net/sl/config/15754461a4864cb08197a2d05b7a8b22.mp4",
  "https://d2tntkfu60is0z.cloudfront.net/sl/config/b088ef7be9c8493bb1b638f4734ed64b.mp4",
];

type DrawFeedItem = {
  id: string;
  name: string;
  image: string;
  likes: string;
  prompt: string;
  media: "image" | "video";
  videoUrl?: string;
};

const DRAW_FEED: DrawFeedItem[] = CHARACTERS.map((item, index) => {
  const prompt = "Realistic photo of " + item.name + ", " + item.tag.toLowerCase() + ". " + item.bio;
  const isVideo = index % 2 === 1;
  return {
    id: isVideo ? item.id + "-video" : item.id,
    name: item.name,
    image: item.image,
    likes: item.greetCount,
    prompt,
    media: isVideo ? "video" : "image",
    videoUrl: isVideo ? REMIX_CLIPS[index % REMIX_CLIPS.length] : undefined,
  };
});

function DrawCardMedia({ item }: { item: DrawFeedItem }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (item.media !== "video") return;
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.4)),
      { threshold: [0.4] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [item.media]);

  if (item.media !== "video") {
    return <img src={item.image} alt={item.name} />;
  }

  return (
    <div ref={wrapRef} className="draw-card-media">
      {inView ? (
        <video src={item.videoUrl} poster={item.image} autoPlay muted loop playsInline />
      ) : (
        <img src={item.image} alt={item.name} />
      )}
      <span className="draw-video-thumb">
        <img src={item.image} alt="" />
      </span>
    </div>
  );
}

export function GenerateScreen() {
  const store = useStore();
  const tab = store.generateTab;
  const [previewId, setPreviewId] = useState<string | null>(null);
  const preview = DRAW_FEED.find((item) => item.id === previewId) || null;

  const setTab = (next: "draw" | "photos" | "videos") => {
    store.dispatch({ type: "setGenerateTab", tab: next });
    setPreviewId(null);
  };

  const openCreate = (id?: string, type: "photo" | "video" = "photo") => {
    const characterId = id?.replace(/-video$/, "");
    store.push("generate-image", characterId ? { id: characterId, type } : { type });
  };

  return (
    <div className="draw-feed">
      <div className="draw-feed-top">
        <div className="draw-feed-tabs">
          {(["draw", "photos", "videos"] as const).map((item) => (
            <button key={item} className={tab === item ? "on" : ""} onClick={() => setTab(item)}>
              {item === "draw" ? "Draw" : item === "photos" ? "Photos" : "Videos"}
            </button>
          ))}
        </div>
        {store.persona === "guest" ? (
          <button className="draw-feed-login" onClick={() => store.requireUser()}>Login</button>
        ) : (
          <button className="draw-feed-gems" onClick={() => store.push("tokens")}>💎 {store.gems}</button>
        )}
      </div>

      <div className="draw-feed-body">
        {tab === "videos" ? (
          <p className="draw-privacy">
            For privacy, creation history is stored for 7 days only. <span>Detail &gt;&gt;</span>
          </p>
        ) : null}

        {tab === "draw" ? (
          <div className="draw-masonry">
            {DRAW_FEED.map((item) => (
              <button key={item.id} className="draw-card" onClick={() => setPreviewId(item.id)}>
                <DrawCardMedia item={item} />
                <div className="draw-card-bar">
                  <span>♡ {item.likes}</span>
                  <i
                    onClick={(e) => {
                      e.stopPropagation();
                      openCreate(item.id, item.media === "video" ? "video" : "photo");
                    }}
                  >
                    Try Her
                  </i>
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {tab === "photos" ? (
          store.persona === "plus" ? (
            <div className="draw-masonry">
              {CHARACTERS.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  className="draw-card"
                  onClick={() => store.push("generate-result", { type: "photo", id: item.id, status: "success" })}
                >
                  <img src={item.image} alt={item.name} />
                  <div className="draw-card-bar center">
                    <i
                      onClick={(e) => {
                        e.stopPropagation();
                        store.requirePlus("drawLimit");
                      }}
                    >
                      Undress
                    </i>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="draw-empty">No photos yet</div>
          )
        ) : null}

        {tab === "videos" ? (
          store.persona === "plus" ? (
            <div className="draw-masonry">
              {CHARACTERS.slice(0, 2).map((item, index) => (
                <button
                  key={item.id}
                  className="draw-card"
                  onClick={() => store.push("generate-result", { type: "video", id: item.id, status: "success" })}
                >
                  <div className="draw-card-media">
                    <video src={REMIX_CLIPS[index]} poster={item.image} autoPlay muted loop playsInline />
                    <span className="draw-video-thumb"><img src={item.image} alt="" /></span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="draw-empty">No videos yet</div>
          )
        ) : null}
      </div>

      <div className="draw-fab">
        <button className="cta" onClick={() => openCreate(undefined, tab === "videos" ? "video" : "photo")}>
          Generate Image&Video
        </button>
      </div>

      {preview ? (
        <div className="draw-preview-mask" onClick={() => setPreviewId(null)}>
          <div className="draw-preview-sheet" onClick={(e) => e.stopPropagation()}>
            <button className="draw-preview-close" onClick={() => setPreviewId(null)}>×</button>
            {preview.media === "video" ? (
              <video src={preview.videoUrl} poster={preview.image} autoPlay muted loop playsInline />
            ) : (
              <img src={preview.image} alt={preview.name} />
            )}
            <div className="draw-preview-details">
              <div className="draw-preview-details-top">
                <b>Details</b>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(preview.prompt);
                    store.toast("Copy Success");
                  }}
                >
                  Copy
                </button>
              </div>
              <p>{preview.prompt}</p>
            </div>
            <button className="cta" onClick={() => openCreate(preview.id, preview.media === "video" ? "video" : "photo")}>Try Her</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
