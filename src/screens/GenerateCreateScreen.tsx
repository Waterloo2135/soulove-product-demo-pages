import { useState } from "react";
import { CHARACTERS, DRAW_ACTION_CATS, DRAW_STYLES } from "../mock";
import { IconBack } from "../components/Icons";
import { useStore } from "../store";

const VIDEO_ACTIONS = [
  { id: "Dancing", nsfw: false, img: CHARACTERS[0].image },
  { id: "Smiling", nsfw: false, img: CHARACTERS[1].image },
  { id: "Posing", nsfw: false, img: CHARACTERS[3].image },
  { id: "Titty-Drop", nsfw: true, img: CHARACTERS[2].image },
  { id: "Bouncing Boobs", nsfw: true, img: CHARACTERS[4].image },
  { id: "Swing", nsfw: false, img: CHARACTERS[1].image },
];

const PLUS_OUTPUT = 2;
let freePhotoUsed = 0;

export function GenerateCreateScreen() {
  const store = useStore();
  const isPlus = store.persona === "plus";
  const startType = store.current.params?.type === "video" ? "video" : "photo";
  const startChar = store.current.params?.id || "";

  const [tab, setTab] = useState<"photo" | "video">(startType);
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [selectedChar, setSelectedChar] = useState(startChar);
  const [prompt, setPrompt] = useState("");
  const [outputCount, setOutputCount] = useState(1);
  const [model, setModel] = useState<"classic" | "nsfw">("classic");
  const [actionCat, setActionCat] = useState(DRAW_ACTION_CATS[0].name);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [videoAction, setVideoAction] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const girl = CHARACTERS.find((item) => item.id === selectedChar);
  const activeCat = DRAW_ACTION_CATS.find((item) => item.name === actionCat) || DRAW_ACTION_CATS[0];
  const filledPrompt = [selectedTags.join(", "), prompt].filter(Boolean).join(". ");
  const effectiveModel = isPlus ? model : "classic";
  const hasContent = Boolean(selectedChar || prompt || selectedTags.length || videoAction || selectedAction);

  const toggleTag = (tag: string, vip?: boolean) => {
    if (vip && !isPlus) {
      store.requirePlus("drawLimit");
      return;
    }
    setSelectedAction("");
    setSelectedTags((list) => (list.includes(tag) ? list.filter((item) => item !== tag) : [...list, tag]));
  };

  const pickAction = (item: (typeof DRAW_ACTION_CATS)[0]["actions"][number]) => {
    if (item.vip && !isPlus) {
      store.requirePlus("drawLimit");
      return;
    }
    setSelectedAction(item.name);
    setSelectedTags([]);
    setPrompt("prompt" in item && item.prompt ? item.prompt : item.name);
  };

  const randomFill = () => {
    const picks = DRAW_ACTION_CATS.filter((cat) => cat.kind !== "cards").map((cat) => {
      const pool = cat.actions.filter((item) => isPlus || !item.vip);
      return pool[Math.floor(Math.random() * pool.length)]?.name;
    }).filter(Boolean) as string[];
    setSelectedAction("");
    setSelectedTags(picks);
    setPrompt("");
  };

  const onBack = () => {
    if (hasContent) setLeaveOpen(true);
    else store.back();
  };

  const goResult = (type: "photo" | "video") => {
    store.push("generate-result", {
      type,
      id: girl?.id || CHARACTERS[0].id,
      prompt: type === "video" ? videoAction || "" : filledPrompt || (girl ? selectedStyle + " of " + girl.name : selectedStyle),
      count: type === "video" ? "1" : String(outputCount),
      model: effectiveModel,
      style: selectedStyle,
    });
  };

  const handleGeneratePhoto = () => {
    store.requireUser(() => {
      if (!isPlus && (outputCount >= PLUS_OUTPUT || effectiveModel === "nsfw" || freePhotoUsed >= 1)) {
        store.requirePlus("drawLimit");
        return;
      }
      if (store.persona === "free") freePhotoUsed += 1;
      goResult("photo");
    });
  };

  const handleGenerateVideo = () => {
    store.requireUser(() => {
      if (!girl) {
        store.toast("Please select a reference photo first!");
        return;
      }
      if (!videoAction) {
        store.toast("Please add action to her first!");
        return;
      }
      store.requirePlus("drawLimit", () => goResult("video"));
    });
  };

  return (
    <div className="draw-page">
      <div className="top">
        <button className="back" onClick={onBack}><IconBack /></button>
        <div className="h-title">Creation Center</div>
        <span />
      </div>
      <div className="draw-tabs pair">
        <button className={tab === "photo" ? "on" : ""} onClick={() => setTab("photo")}>Generate Photo</button>
        <button className={tab === "video" ? "on" : ""} onClick={() => setTab("video")}>Generate Video</button>
      </div>
      <div className="draw-scroll">
        {tab === "photo" ? (
          <>
            <div className="draw-section">
              <div className="draw-label">Image Style</div>
              <div className="draw-styles">
                {DRAW_STYLES.map((item) => (
                  <button key={item.name} className={"draw-style" + (selectedStyle === item.name ? " on" : "")} onClick={() => setSelectedStyle(item.name)}>
                    <img src={item.image} alt="" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="draw-section">
              <div className="draw-label">Face Reference (Optional)</div>
              {girl ? (
                <button className="draw-face-card" onClick={() => setPickerOpen(true)}>
                  <img src={girl.image} alt={girl.name} />
                  <span>{girl.name}</span>
                  <i className="draw-face-change">Change</i>
                </button>
              ) : (
                <button className="draw-choose" onClick={() => setPickerOpen(true)}>Choose Character</button>
              )}
            </div>
            <div className="draw-section">
              <div className="draw-label">Details</div>
              <div className="draw-details">
                {selectedTags.length ? (
                  <div className="draw-filled inner">
                    {selectedTags.map((tag) => (
                      <button key={tag} onClick={() => toggleTag(tag)}>{tag}.</button>
                    ))}
                  </div>
                ) : null}
                <textarea
                  className="draw-prompt"
                  placeholder="E.g., one stormy night, a beautiful blonde girl was walking down the street alone..."
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value.slice(0, 1000));
                    setSelectedAction("");
                  }}
                />
                <div className="draw-details-bar">
                  <button className="draw-random" onClick={randomFill}>
                    <img src="/randomIcon.png" alt="" />
                    Random
                  </button>
                  <em>{prompt.length}/1000</em>
                </div>
              </div>
            </div>
            <div className="draw-section">
              <div className="draw-label">Suggestions</div>
              <p className="draw-hint">Select a style to auto-fill prompts.</p>
              <div className="draw-cats">
                {DRAW_ACTION_CATS.map((cat) => (
                  <button key={cat.name} className={actionCat === cat.name ? "on" : ""} onClick={() => setActionCat(cat.name)}>
                    {cat.name}
                  </button>
                ))}
              </div>
              {activeCat.kind === "cards" ? (
                <div className="draw-suggest-row">
                  {activeCat.actions.map((item) => (
                    <button
                      key={item.name}
                      className={"draw-suggest-card" + (selectedAction === item.name ? " on" : "")}
                      onClick={() => pickAction(item)}
                    >
                      <img src={item.image} alt="" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="draw-suggest-dots">
                  {activeCat.actions.map((item) => (
                    <button
                      key={item.name}
                      className={selectedTags.includes(item.name) ? "on" : ""}
                      onClick={() => toggleTag(item.name, item.vip)}
                    >
                      <img src={item.image} alt="" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="draw-section">
              <div className="draw-label req">Output Numbers</div>
              <div className="draw-count nums">
                {[1, 2, 3, 4].map((n) => (
                  <button key={n} className={outputCount === n ? "on" : ""} onClick={() => n >= PLUS_OUTPUT ? store.requirePlus("drawLimit", () => setOutputCount(n)) : setOutputCount(n)}>
                    {n}
                    {n >= PLUS_OUTPUT ? <b className="draw-pro">VIP</b> : null}
                  </button>
                ))}
              </div>
            </div>
            <div className="draw-section">
              <div className="draw-label req">Graph Model</div>
              <div className="draw-models stack">
                <button className={"draw-model-row" + (effectiveModel === "classic" ? " on" : "")} onClick={() => setModel("classic")}>
                  <img src="/graphClassicModel.webp" alt="" />
                  <div>
                    <strong>Classic Model</strong>
                    <span>High quality images</span>
                  </div>
                  {effectiveModel === "classic" ? <i className="draw-check" /> : null}
                </button>
                <button className={"draw-model-row" + (effectiveModel === "nsfw" ? " on" : "")} onClick={() => store.requirePlus("drawLimit", () => setModel("nsfw"))}>
                  <img src="/graphNsfwModel.webp" alt="" />
                  <div>
                    <strong>Bold model <b className="draw-vip">VIP</b></strong>
                    <span>More exciting, more tempting</span>
                  </div>
                  {effectiveModel === "nsfw" ? <i className="draw-check" /> : null}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="draw-section">
              <div className="draw-label">Choose Image / Character</div>
              {girl ? (
                <button className="draw-face-card" onClick={() => setPickerOpen(true)}>
                  <img src={girl.image} alt={girl.name} />
                  <span>{girl.name}</span>
                  <i className="draw-face-change">Change</i>
                </button>
              ) : (
                <button className="draw-choose" onClick={() => setPickerOpen(true)}>Choose<br />Image / Character</button>
              )}
            </div>
            <div className="draw-section">
              <div className="draw-label">Add action to her</div>
              <p className="draw-hint">Match the action to your image to avoid glitches or distortions.</p>
              <div className="draw-video-actions">
                {VIDEO_ACTIONS.map((item) => (
                  <button
                    key={item.id}
                    className={"draw-video-action" + (videoAction === item.id ? " on" : "")}
                    onClick={() => {
                      if (item.nsfw && !isPlus) {
                        store.requirePlus("drawLimit");
                        return;
                      }
                      setVideoAction(item.id);
                    }}
                  >
                    <img src={item.img} alt="" />
                    <span>{item.id}</span>
                    {item.nsfw ? <b className="draw-pro">PRO</b> : null}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="draw-foot">
        <button className="draw-gen-cta" onClick={tab === "video" ? handleGenerateVideo : handleGeneratePhoto}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M4 5h12a2 2 0 0 1 2 2v2.2l3.2-2.1a1 1 0 0 1 1.6.8v9.2a1 1 0 0 1-1.6.8L18 15.8V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>
          Generate
        </button>
        {tab === "video" ? <p className="draw-duration">5s · 480P</p> : null}
      </div>

      {pickerOpen ? (
        <div className="draw-sheet-mask" onClick={() => setPickerOpen(false)}>
          <div className="draw-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="draw-sheet-title">From Lover</div>
            <div className="draw-sheet-grid">
              {CHARACTERS.map((item) => (
                <button
                  key={item.id}
                  className={selectedChar === item.id ? "on" : ""}
                  onClick={() => {
                    setSelectedChar(item.id);
                    setPickerOpen(false);
                  }}
                >
                  <img src={item.image} alt="" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {leaveOpen ? (
        <div className="draw-sheet-mask" onClick={() => setLeaveOpen(false)}>
          <div className="draw-leave" onClick={(e) => e.stopPropagation()}>
            <h3>Custom</h3>
            <p>Are you sure you want to give up creating? If you do, the selected content will not be saved</p>
            <div className="draw-leave-row">
              <button className="cta-ghost" onClick={() => { setLeaveOpen(false); store.back(); }}>Confirm</button>
              <button className="cta" onClick={() => setLeaveOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
