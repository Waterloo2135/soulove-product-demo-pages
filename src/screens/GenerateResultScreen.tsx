import { useEffect, useState } from "react";
import { characterById } from "../mock";
import { IconBack } from "../components/Icons";
import { useStore } from "../store";

export function GenerateResultScreen() {
  const store = useStore();
  const girl = characterById(store.current.params?.id);
  const type = store.current.params?.type || "photo";
  const prompt = store.current.params?.prompt || "";
  const model = store.current.params?.model || "classic";
  const forced = store.current.params?.status;
  const count = Number(store.current.params?.count || 1);
  const list = Array.from({ length: Math.min(Math.max(count, 1), 4) }, (_, i) => i);
  const [phase, setPhase] = useState<"generating" | "success" | "fail">(
    forced === "fail" ? "fail" : forced === "success" ? "success" : "generating",
  );

  useEffect(() => {
    if (forced === "fail" || forced === "success") return;
    const timer = window.setTimeout(() => setPhase("success"), 900);
    return () => window.clearTimeout(timer);
  }, [forced]);

  const locked = store.persona !== "plus" && (type === "video" || model === "nsfw");

  return (
    <div className="gen-result">
      <div className="top">
        <button className="back" onClick={store.back}><IconBack /></button>
        <div className="h-title">{phase === "fail" ? "Generation failed" : type === "video" ? "Generated video" : "Generated photo"}</div>
        <span />
      </div>

      {phase === "generating" ? (
        <div className="gen-result-loading">
          <img src={girl.image} alt="" />
          <div className="gen-result-loading-mask">
            <i />
            <p>{type === "video" ? "Creating her video..." : "Creating her photo..."}</p>
          </div>
        </div>
      ) : null}

      {phase === "fail" ? (
        <div className="gen-result-fail">
          <img src={girl.image} alt="" />
          <p>Couldn’t create this one. Try another prompt or action.</p>
        </div>
      ) : null}

      {phase === "success" ? (
        <>
          {prompt ? <p className="gen-result-prompt">{prompt}</p> : null}
          <div className={"gen-result-grid" + (list.length === 1 ? " one" : "")}>
            {list.map((i) => (
              <button
                key={i}
                className="gen-result-card"
                onClick={() => {
                  if (locked) store.requirePlus("drawLimit");
                }}
              >
                <img src={girl.image} alt="" />
                {type === "video" ? <span className="gen-result-play">▶</span> : null}
                {locked ? (
                  <span className="gen-result-lock">
                    Unlock
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </>
      ) : null}

      <div className={"gen-result-foot" + (phase === "fail" ? " one" : "")}>
        {phase === "fail" ? (
          <button className="cta" onClick={() => store.openTab("generate")}>Try Again</button>
        ) : (
          <>
            <button className="cta-ghost" onClick={() => store.openTab("generate")}>Re-Generate</button>
            <button className="cta" onClick={() => store.push("chat-room", { id: girl.id })}>
              Send to chat
            </button>
          </>
        )}
      </div>
    </div>
  );
}
