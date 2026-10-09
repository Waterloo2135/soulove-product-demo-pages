const fs = require("fs");
const path = "src/screens/MiscScreens.tsx";
let s = fs.readFileSync(path, "utf8");

s = s.replace(
  'import { useEffect, useRef, useState, type ReactNode } from "react";',
  'import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";'
);

const component = `function PlayerLiveActors({
  actors,
  land,
  onOpen,
}: {
  actors: { name: string; avatar: string; characterId: string }[];
  land?: boolean;
  onOpen: (characterId: string) => void;
}) {
  const multi = actors.length > 1;
  const size = land ? 40 : 48;
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [smooth, setSmooth] = useState(false);
  const [hold, setHold] = useState(false);
  const drag = useRef({ on: false, x: 0, y: 0, moved: false, pointer: -1 });
  const dragXRef = useRef(0);
  const busy = useRef(false);
  const holdRef = useRef(false);
  const resumeTimer = useRef(0);
  const snapTimer = useRef(0);
  const n = actors.length;
  const current = actors[((index % n) + n) % n] || actors[0];
  const next = actors[(((index + 1) % n) + n) % n];
  const prev = actors[(((index - 1) % n) + n) % n];
  holdRef.current = hold;

  const setDx = (value: number) => {
    dragXRef.current = value;
    setDragX(value);
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(resumeTimer.current);
      window.clearTimeout(snapTimer.current);
    };
  }, []);

  const slide = (dir: 1 | -1) => {
    if (!multi || busy.current) return;
    busy.current = true;
    setSmooth(true);
    setDx(-dir * size);
    window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(() => {
      setSmooth(false);
      setIndex((i) => (i + dir + n) % n);
      setDx(0);
      busy.current = false;
    }, 280);
  };

  useEffect(() => {
    if (!multi) return;
    const timer = window.setInterval(() => {
      if (holdRef.current || drag.current.on || busy.current) return;
      slide(1);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [multi, n, size]);

  const armHold = () => {
    holdRef.current = true;
    setHold(true);
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      holdRef.current = false;
      setHold(false);
    }, 3000);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!multi || busy.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { on: true, x: e.clientX, y: e.clientY, moved: false, pointer: e.pointerId };
    setSmooth(false);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.on) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (!drag.current.moved && Math.abs(dx) + Math.abs(dy) > 6) drag.current.moved = true;
    if (Math.abs(dx) >= Math.abs(dy)) {
      e.preventDefault();
      setDx(Math.max(-size, Math.min(size, dx)));
    }
  };

  const endPointer = (e: PointerEvent<HTMLDivElement>, cancel = false) => {
    if (!drag.current.on) return;
    if (drag.current.pointer !== -1 && e.pointerId !== drag.current.pointer) return;
    const dx = dragXRef.current;
    const moved = drag.current.moved;
    drag.current.on = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    if (cancel) {
      setSmooth(true);
      setDx(0);
      return;
    }
    if (!moved && Math.abs(dx) < 8) {
      setDx(0);
      onOpen(current.characterId);
      return;
    }
    armHold();
    if (dx <= -size * 0.28) slide(1);
    else if (dx >= size * 0.28) slide(-1);
    else {
      setSmooth(true);
      setDx(0);
    }
  };

  const label = current.name + " online" + (multi ? ", " + String(index + 1) + " of " + String(n) : "");

  return (
    <div
      className={"player-live-stack" + (land ? " land" : "") + (multi ? " multi" : "")}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => {
        if (multi) return;
        onOpen(current.characterId);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => endPointer(e)}
      onPointerCancel={(e) => endPointer(e, true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(current.characterId);
        }
      }}
    >
      {multi ? (
        <span className={"player-live-peek" + (Math.abs(dragX) > 6 ? " hide" : "")} aria-hidden="true">
          <img src={next.avatar} alt="" />
        </span>
      ) : null}
      <div className="player-live-window">
        {multi ? (
          <div
            className={"player-live-track" + (smooth ? " smooth" : "")}
            style={{ transform: "translateX(" + dragX + "px)" }}
          >
            <img src={prev.avatar} alt="" draggable={false} />
            <img src={current.avatar} alt="" draggable={false} />
            <img src={next.avatar} alt="" draggable={false} />
          </div>
        ) : (
          <img src={current.avatar} alt="" draggable={false} />
        )}
      </div>
      <span className="player-live-fx">
        <span className="player-live-wave" />
        <span className="player-live-wave delay" />
        <i className="player-live-dot" />
      </span>
    </div>
  );
}

`;

if (!s.includes("export function ShortDramaWatchScreen()")) throw new Error("watch screen missing");
if (s.includes("function PlayerLiveActors")) throw new Error("already inserted");
s = s.replace("export function ShortDramaWatchScreen() {", component + "export function ShortDramaWatchScreen() {");

s = s.replace("  const [actorIndex, setActorIndex] = useState(0);\r\n", "");

const oldFx = `  const actors = drama.actors.length ? drama.actors : [{ name: "Elena", avatar: characterById("elena").image, characterId: "elena" }];
  useEffect(() => {
    setActorIndex(0);
    if (actors.length < 2) return;
    const timer = window.setInterval(() => {
      setActorIndex((i) => (i + 1) % actors.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [drama.id, actors.length]);
  const liveActor = actors[actorIndex % actors.length] || actors[0];
`;
if (!s.includes(oldFx)) throw new Error("old actor fx missing");
s = s.replace(oldFx, `  const actors = drama.actors.length ? drama.actors : [{ name: "Elena", avatar: characterById("elena").image, characterId: "elena" }];
`);

const oldLand = `          <button
            className="player-live-ava land"
            onClick={() => openActorHome(liveActor.characterId)}
            aria-label={liveActor.name + " online"}
          >
            <span className="player-live-wave" />
            <span className="player-live-wave delay" />
            <img key={liveActor.characterId} src={liveActor.avatar} alt="" />
            <i className="player-live-dot" />
          </button>`;
const newLand = `          <PlayerLiveActors key={drama.id + "-land"} actors={actors} land onOpen={openActorHome} />`;
if (!s.includes(oldLand)) throw new Error("old land ava missing");
s = s.replace(oldLand, newLand);

const oldPort = `        <button
          className="player-live-ava"
          onClick={() => openActorHome(liveActor.characterId)}
          aria-label={liveActor.name + " online"}
        >
          <span className="player-live-wave" />
          <span className="player-live-wave delay" />
          <img key={liveActor.characterId} src={liveActor.avatar} alt="" />
          <i className="player-live-dot" />
        </button>`;
const newPort = `        <PlayerLiveActors key={drama.id} actors={actors} onOpen={openActorHome} />`;
if (!s.includes(oldPort)) throw new Error("old port ava missing");
s = s.replace(oldPort, newPort);

if (s.includes("liveActor")) throw new Error("liveActor still referenced");
fs.writeFileSync(path, s);
console.log("tsx ok");
