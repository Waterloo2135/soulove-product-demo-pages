const fs = require("fs");

let misc = fs.readFileSync("src/screens/MiscScreens.tsx", "utf8");
if (!misc.includes("function DramaRecentRail")) {
  misc = misc.replace(
    "export function ShortDramaScreen() {",
    `function DramaRecentRail({
  items,
  onOpen,
}: {
  items: typeof DRAMAS;
  onOpen: (id: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ on: false, x: 0, left: 0, moved: false, pid: -1 });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    if (!el) return;
    drag.current = { on: true, x: e.clientX, left: el.scrollLeft, moved: false, pid: e.pointerId };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.on || e.pointerId !== drag.current.pid) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    if (scroller.current) scroller.current.scrollLeft = drag.current.left - dx;
  };
  const endPointer = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.on || e.pointerId !== drag.current.pid) return;
    drag.current.on = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      ref={scroller}
      className="drama-recent"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      {items.map((item) => (
        <button
          key={item.id}
          className="drama-recent-card"
          onClick={() => {
            if (drag.current.moved) return;
            onOpen(item.id);
          }}
        >
          <span className="drama-recent-cover">
            <img src={item.cover} alt="" draggable={false} />
          </span>
          <em>{item.title}</em>
        </button>
      ))}
    </div>
  );
}

export function ShortDramaScreen() {`
  );
}

misc = misc.replace(
            `<div className="drama-recent">
              {recent.map((item) => (
                <button
                  key={item.id}
                  className="drama-recent-card"
                  onClick={() => store.push("short-drama-watch", { id: item.id })}
                >
                  <span className="drama-recent-cover">
                    <img src={item.cover} alt="" />
                  </span>
                  <em>{item.title}</em>
                </button>
              ))}
            </div>`,
            `<DramaRecentRail items={recent} onOpen={(id) => store.push("short-drama-watch", { id })} />`
);
fs.writeFileSync("src/screens/MiscScreens.tsx", misc);

let css = fs.readFileSync("src/index.css", "utf8");
const oldCss = `.drama-recent-sec { margin: 4px 0 14px; }
.drama-recent {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 8px 4px;
  scrollbar-width: none;
}
.drama-recent::-webkit-scrollbar { display: none; }
.drama-recent-card {
  flex: none;
  width: 108px;
  text-align: left;
  color: #fff;
}
.drama-recent-cover {
  display: block;
  width: 108px;
  height: 144px;
  border-radius: 8px;
  overflow: hidden;
  background: #2a1d27;
}
.drama-recent-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.drama-recent-card em {
  display: block;
  margin-top: 6px;
  font-style: normal;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
  color: rgba(255,255,255,0.82);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`;
const newCss = `.drama-recent-sec { margin: 4px 0 14px; min-width: 0; }
.drama-recent {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 8px 8px;
  width: 100%;
  min-width: 0;
  touch-action: pan-x;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  cursor: grab;
}
.drama-recent:active { cursor: grabbing; }
.drama-recent::-webkit-scrollbar { display: none; }
.drama-recent-card {
  flex: 0 0 108px;
  width: 108px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  color: #fff;
}
.drama-recent-cover {
  flex: none;
  width: 108px;
  height: 144px;
  border-radius: 8px;
  overflow: hidden;
  background: #2a1d27;
}
.drama-recent-cover img {
  width: 108px;
  height: 144px;
  object-fit: cover;
  object-position: center top;
  display: block;
  pointer-events: none;
}
.drama-recent-card em {
  flex: none;
  margin-top: 6px;
  height: 2.6em;
  font-style: normal;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
  color: rgba(255,255,255,0.82);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}`;
if (!css.includes(oldCss)) throw new Error("recent css missing");
fs.writeFileSync("src/index.css", css.replace(oldCss, newCss));
console.log("ok");
