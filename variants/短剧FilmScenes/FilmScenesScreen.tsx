import { useEffect, useMemo, useRef, useState } from "react";
import { DRAMAS } from "../mock";
import { filmScenesForDrama, type FilmAction, type FilmScene } from "../filmScenes";
import { IconBack } from "../components/Icons";
import { useStore } from "../store";

type Phase = "pick" | "play" | "done";
type Pending = { sceneId: string; action: FilmAction; layer: 1 | 2 };

export function FilmScenesScreen() {
  const store = useStore();
  const drama = DRAMAS.find((item) => item.id === store.current.params?.id) || DRAMAS[0];
  const scenes = useMemo(() => filmScenesForDrama(drama), [drama]);
  const girl = drama.actors[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingRef = useRef<Pending | null>(null);

  const [phase, setPhase] = useState<Phase>("pick");
  const [scene, setScene] = useState<FilmScene | null>(null);
  const [layer, setLayer] = useState<1 | 2>(1);
  const [actions, setActions] = useState<FilmAction[]>([]);
  const [playing, setPlaying] = useState(false);
  const [clip, setClip] = useState("");
  const [lastAction, setLastAction] = useState<FilmAction | null>(null);
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [stageCover, setStageCover] = useState(drama.cover);

  const allDone = doneIds.length >= scenes.length && scenes.length > 0;

  const openScene = (item: FilmScene) => {
    setScene(item);
    setPhase("play");
    setLayer(1);
    setActions(item.actions);
    setPlaying(false);
    setClip("");
    setLastAction(null);
    setStageCover(item.cover);
  };

  const playAction = (action: FilmAction, nextLayer: 1 | 2) => {
    setLastAction(action);
    setClip(action.videoUrl);
    setPlaying(true);
    setLayer(nextLayer);
    if (nextLayer === 2) setActions(action.next || []);
  };

  const requestAction = (action: FilmAction) => {
    if (playing) return;
    if (store.persona !== "plus") {
      pendingRef.current = { sceneId: scene?.id || "", action, layer };
      store.dispatch({ type: "openOverlay", overlay: { type: "subscribe", scene: "shortDrama" } });
      return;
    }
    playAction(action, layer);
  };

  useEffect(() => {
    if (store.persona !== "plus" || store.overlay) return;
    const pending = pendingRef.current;
    if (!pending || !scene || pending.sceneId !== scene.id) return;
    pendingRef.current = null;
    playAction(pending.action, pending.layer);
  }, [store.persona, store.overlay, scene]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !clip) return;
    video.currentTime = 0;
    void video.play().catch(() => undefined);
  }, [clip]);

  const onEnded = () => {
    setPlaying(false);
    if (layer === 1 && lastAction?.next?.length) {
      setActions(lastAction.next);
      setLayer(2);
      return;
    }
    if (scene) setDoneIds((prev) => (prev.includes(scene.id) ? prev : [...prev, scene.id]));
    setPhase("done");
  };

  const goChat = () => {
    const context = lastAction && scene
      ? "You just chose \"" + lastAction.label + "\" in " + scene.title + " of " + drama.title + ". Stay with me."
      : "Continue " + drama.title + " with me.";
    store.push("chat-room", {
      id: girl?.characterId || "elena",
      from: "film-scenes",
      context,
    });
  };

  const ordered = [...scenes].sort((a, b) => Number(doneIds.includes(a.id)) - Number(doneIds.includes(b.id)));

  return (
    <div className="fs-page">
      <div
        className="fs-stage"
        style={{ backgroundImage: "url(" + (scene?.cover || drama.cover) + ")" }}
      >
        {clip ? (
          <video
            ref={videoRef}
            className="fs-video"
            src={clip}
            poster={stageCover}
            muted
            playsInline
            onEnded={onEnded}
          />
        ) : null}
        <div className="fs-fog" />
        <div className="fs-top">
          <button className="fs-back" onClick={() => (phase === "pick" ? store.back() : setPhase("pick"))}>
            <IconBack />
          </button>
          <div className="fs-title">{phase === "pick" ? "Film Scenes" : scene?.title}</div>
          <span className="fs-back ghost" />
        </div>
      </div>

      {phase === "pick" ? (
        <div className="fs-body">
          <p className="fs-kicker">{drama.title}</p>
          {allDone ? (
            <div className="fs-end">
              <button className="fs-primary" onClick={goChat}>Chat with {girl?.name || "her"}</button>
              <button className="fs-secondary" onClick={store.back}>Back to episode</button>
            </div>
          ) : null}
          <div className="fs-grid">
            {ordered.map((item) => (
              <button key={item.id} className="fs-card" onClick={() => openScene(item)}>
                <img src={item.cover} alt="" />
                {doneIds.includes(item.id) ? <span className="fs-played">Played</span> : null}
                <div className="fs-card-meta">
                  <b>{item.title}</b>
                  <span>{item.hook}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {phase === "play" && scene ? (
        <div className="fs-body">
          <p className="fs-hook">{playing ? "She follows your move..." : scene.hook}</p>
          <div className="fs-actions">
            {actions.map((action) => (
              <button
                key={action.id}
                className="fs-action"
                disabled={playing}
                onClick={() => requestAction(action)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {phase === "done" && scene ? (
        <div className="fs-body fs-end">
          <p className="fs-hook">That scene is over. Pick another, or talk to her.</p>
          <button className="fs-primary" onClick={() => setPhase("pick")}>Explore other scenes</button>
          <button className="fs-secondary" onClick={goChat}>Chat with {girl?.name || "her"}</button>
        </div>
      ) : null}
    </div>
  );
}
