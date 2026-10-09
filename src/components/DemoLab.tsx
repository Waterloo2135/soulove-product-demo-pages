import { useStore, isMainTab } from "../store";
import { resetDramaGuideCache } from "../dramaGuide";
import type { Persona, ScreenId, SubscribeScene } from "../types";
import { specForScreen } from "../specNotes";

const PERSONAS: Persona[] = ["guest", "free", "plus"];
const JUMPS: Array<{ id: ScreenId; label: string; params?: Record<string, string> }> = [
  { id: "home", label: "Home" },
  { id: "chats", label: "Chats" },
  { id: "character-detail", label: "角色详情", params: { id: "elena" } },
  { id: "chat-room", label: "聊天室", params: { id: "elena" } },
  { id: "chat-room", label: "聊天室(非短剧角色)", params: { id: "sienna" } },
  { id: "create-character", label: "创建角色" },
  { id: "generate", label: "Draw" },
  { id: "generate-image", label: "生图表单", params: { id: "elena", type: "photo" } },
  { id: "generate-result", label: "生图结果", params: { type: "photo", id: "elena", count: "2", status: "success" } },
  { id: "generate-result", label: "生图失败", params: { type: "photo", id: "elena", status: "fail" } },
  { id: "generate-result", label: "生视频结果", params: { type: "video", id: "elena", status: "success" } },
  { id: "short-drama", label: "短剧" },
  { id: "short-drama-watch", label: "横屏短剧", params: { id: "d2", land: "1", autoplay: "1" } },
  { id: "film-scenes", label: "Film Scenes", params: { id: "d1" } },
  { id: "drama-remix", label: "短剧 Remix", params: { id: "d1" } },
  { id: "ad-landing", label: "投放落地页" },
  { id: "subscriptions", label: "会员" },
  { id: "tokens", label: "Gems" },
  { id: "account", label: "Me" },
];
const SCENES: SubscribeScene[] = ["dressUp", "unlockBlur", "askPhoto", "askVideo", "remixGenerate", "chatLimit", "playVoice", "drawLimit", "shortDrama", "generic"];

function SpecPane({ screenId }: { screenId: ScreenId }) {
  const spec = specForScreen(screenId);
  return (
    <div className="spec-pane">
      <div className="spec-name">{spec.name}</div>
      <p className="spec-goal">{spec.goal}</p>
      {spec.blocks.map((block) => (
        <div key={block.title} className="spec-block">
          <h3>{block.title}</h3>
          <ul>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function DemoLab() {
  const store = useStore();
  return (
    <aside className="lab">
      <h1>Soulove 产品沙盒</h1>
      <div className="note">
        短剧 plat（facebook/tiktok）
        <button className={store.dramaPlat ? "on" : ""} onClick={() => store.dispatch({ type: "setDramaPlat", dramaPlat: !store.dramaPlat })}>
          {store.dramaPlat ? "可见" : "关闭"}
        </button>
        <button onClick={() => { resetDramaGuideCache(); store.toast("已重置短剧推荐缓存"); }}>重置推荐缓存</button>
      </div>
      <p className="lead">
        SL 主站 Mobile 可点击骨架。左侧是产品，右侧是方案工作台。新需求默认改 variants，不覆盖这条基线。
      </p>
      <div className="note">
        当前屏 <span className="path">{store.current.id}</span>
        {" · "}Persona <span className="path">{store.persona}</span>
        {" · "}Gems <span className="path">{store.gems}</span>
      </div>
      <h2>用户状态</h2>
      <div className="seg">
        {PERSONAS.map((item) => (
          <button key={item} className={store.persona === item ? "on" : ""} onClick={() => store.dispatch({ type: "setPersona", persona: item })}>
            {item}
          </button>
        ))}
      </div>
      <h2>跳转页面</h2>
      <div className="seg">
        {JUMPS.map((item) => (
          <button
            key={item.id + (item.label || "")}
            onClick={() => {
              if (isMainTab(item.id)) store.openTab(item.id);
              else store.push(item.id, item.params);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <h2>聊天弹窗</h2>
      <div className="seg">
        <button onClick={() => store.dispatch({ type: "openOverlay", overlay: { type: "gift" } })}>送礼</button>
        <button onClick={() => store.dispatch({ type: "openOverlay", overlay: { type: "dress" } })}>换装</button>
        <button onClick={() => store.dispatch({ type: "openOverlay", overlay: { type: "askMedia", tab: "image" } })}>要图</button>
        <button onClick={() => store.dispatch({ type: "openOverlay", overlay: { type: "askMedia", tab: "video" } })}>要视频</button>
      </div>
      <h2>触发 Overlay</h2>
      <div className="seg">
        <button onClick={() => store.dispatch({ type: "openOverlay", overlay: { type: "login" } })}>Login</button>
        {SCENES.map((scene) => (
          <button key={scene} onClick={() => store.dispatch({ type: "openOverlay", overlay: { type: "subscribe", scene } })}>
            {scene}
          </button>
        ))}
        <button onClick={() => store.dispatch({ type: "openOverlay", overlay: { type: "gems" } })}>Gems 不足</button>
        <button onClick={() => store.dispatch({ type: "openOverlay", overlay: { type: "bonus" } })}>新用户奖励</button>
        <button onClick={() => store.dispatch({ type: "openOverlay", overlay: { type: "shortDrama2" } })}>ShortDrama2</button>
      </div>
      <h2>需求说明</h2>
      <SpecPane screenId={store.current.id} />
      <h2>主路径</h2>
      <div className="note">
        P1 For You Get Her→聊天室 · P2 聊天→会员墙 · P3 创建角色 · P4 生图 · P5 短剧 · P6 账户会员。首页无 Live。
        投放落地页是广告查看入口，不进底栏。完整地图见 docs/screen-map.md。
      </div>
    </aside>
  );
}

