import { useMemo, useState } from "react";
import { DRAMAS } from "../mock";
import { useStore } from "../store";

function formatGems(n: number) {
  return n.toLocaleString();
}

export function ShortDramaGemsUnlock() {
  const store = useStore();
  const overlay = store.overlay;
  const drama = DRAMAS.find((item) => item.id === overlay?.dramaId) || DRAMAS[0];
  const targetEp = Math.max(1, Number(overlay?.episode || drama.gemsFrom || 5));
  const gemsFrom = drama.gemsFrom || 5;
  const gemPrice = drama.episodeGemPrice || 20;
  const unlocked = store.gemsUnlocked[drama.id] || [];

  const gemsLockedEps = useMemo(() => {
    const list: number[] = [];
    for (let ep = gemsFrom; ep <= drama.episodes; ep += 1) {
      if (!unlocked.includes(ep)) list.push(ep);
    }
    return list;
  }, [drama.episodes, gemsFrom, unlocked]);

  const fromTarget = gemsLockedEps.filter((ep) => ep >= targetEp);
  const batchEps = fromTarget.slice(0, 5);
  const batchPrice = batchEps.length * gemPrice;
  const allPrice = drama.unlockAllPrice || gemsLockedEps.length * gemPrice;
  const [selected, setSelected] = useState<"BATCH_5" | "ALL">(batchEps.length ? "BATCH_5" : "ALL");

  const choiceEps = selected === "BATCH_5" ? batchEps : gemsLockedEps;
  const choicePrice = selected === "BATCH_5" ? batchPrice : allPrice;
  const confirmDisabled = choiceEps.length <= 0 || choicePrice <= 0;

  const confirm = () => {
    if (confirmDisabled) return;
    if (store.gems < choicePrice) {
      store.dispatch({ type: "openOverlay", overlay: { type: "gems" } });
      return;
    }
    store.dispatch({
      type: "unlockDramaGems",
      dramaId: drama.id,
      episodes: choiceEps,
      cost: choicePrice,
    });
    store.dispatch({ type: "closeOverlay" });
    store.toast("Unlocked · " + choiceEps.length + " episodes");
  };

  return (
    <div className="sd-gems-mask" onClick={() => store.dispatch({ type: "closeOverlay" })}>
      <div className="sd-gems-dlg" onClick={(e) => e.stopPropagation()}>
        <div className="sd-gems-head">
          <h3>Unlock more episodes</h3>
          <button
            className="sd-gems-x"
            aria-label="Close"
            onClick={() => store.dispatch({ type: "closeOverlay" })}
          >
            ✕
          </button>
        </div>
        <p className="sd-gems-sub">
          You've watched all episodes included with your membership. Choose an unlock plan to keep watching this story.
        </p>
        <div className="sd-gems-opts">
          <button
            type="button"
            className={"sd-gems-opt" + (selected === "BATCH_5" ? " on" : "")}
            disabled={batchEps.length <= 0}
            onClick={() => setSelected("BATCH_5")}
          >
            <span>Unlock {batchEps.length || 5} episodes</span>
            <em>
              <i>💎</i>
              {batchPrice > 0 ? formatGems(batchPrice) + " Gems" : "—"}
            </em>
          </button>
          <button
            type="button"
            className={"sd-gems-opt" + (selected === "ALL" ? " on" : "")}
            disabled={gemsLockedEps.length <= 0}
            onClick={() => setSelected("ALL")}
          >
            <span>Unlock all</span>
            <em>
              <i>💎</i>
              {allPrice > 0 ? formatGems(allPrice) + " Gems" : "—"}
            </em>
          </button>
        </div>
        <button className="sd-gems-confirm" disabled={confirmDisabled} onClick={confirm}>
          Confirm
        </button>
        <p className="sd-gems-bal">Gems Balance: {formatGems(store.gems)}</p>
        <button
          type="button"
          className="sd-gems-pro"
          onClick={() =>
            store.dispatch({
              type: "openOverlay",
              overlay: { type: "subscribe", scene: "generic", message: "dramaPass" },
            })
          }
        >
          Pro / Lifetime: watch all dramas free
        </button>
        <p className="sd-gems-pro-sub">Every episode, no Gems. Higher plan, no per-episode spend.</p>
      </div>
    </div>
  );
}
