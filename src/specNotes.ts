import type { ScreenId } from "./types";

export type SpecBlock = {
  title: string;
  items: string[];
};

export type ScreenSpec = {
  name: string;
  goal: string;
  blocks: SpecBlock[];
};

const REMIX: ScreenSpec = {
  name: "短剧 Remix",
  goal: "从短剧播放进入创作：先看别人怎么拍，再自己 Generate / Extend。商业化在制作，不在看词。",
  blocks: [
    {
      title: "入口",
      items: [
        "播放页仅右侧 🎬 Remix；进入前暂停短剧。",
        "默认先到 Inspiration，不直接进 Creation。",
        "底栏固定悬浮 Create Myself（主色 #ee0097），叠在列表上，不另占一条底栏。",
      ],
    },
    {
      title: "Inspiration",
      items: [
        "标题 Inspiration。本剧样片在上，分割线后 More from Soulove。",
        "双列瀑布流，竖屏 9:16 + 横屏混排（同 My Remixes）。",
        "进入视口可静音自动播（含模糊样例）。点击进放大播放页。",
        "Prompt 全文可看，不拦截。卡片操作：Extend / Remix。",
        "memberOnly 非会员：马赛克仍播放；点击走解锁 Private photo 同类会员墙（unlockBlur），不用短剧付费墙。",
        "plats 过滤：如 iOS-only 示例在 Web Demo 不出现。",
      ],
    },
    {
      title: "放大播放页（Inspiration / My Remixes 共用）",
      items: [
        "同一套全屏样式：片源、prompt、Extend、Remix。",
        "多段成片显示 shot chips，播放同步高亮。",
        "Extend = 尾帧续写并合并；Remix = 带入 Creation 再生成一版。",
        "自己的 clip 不满意也可以 Remix。",
      ],
    },
    {
      title: "Creation / Extend",
      items: [
        "运营预设：每剧绑定 cast + prompt；刷新换下一套并清空自选角色。",
        "My Characters 固定，右侧本剧角色横滑点选（最多 3）。",
        "@ 只能点已选 cast；My Characters 弹窗 Recent chats / My lovers。",
        "Intent 一行横滑（Kiss / Blowjob 等，文案可运营配）。方案 B：保角色、按性别补人、重写动作句。",
        "↻ 刷新是工具级，可覆盖 Intent。",
        "规格 5s·480P ›，5s/10s、480P/720P；价走配置。",
        "Extend 页顶部：左播成片、右尾帧图。",
        "Extend 他人与自己 Remix 同价。",
      ],
    },
    {
      title: "My Remixes",
      items: [
        "瀑布流。生成中不可 Extend。",
        "列表与放大页都有 Extend / Remix。",
      ],
    },
  ],
};

const DRAW: ScreenSpec = {
  name: "Draw",
  goal: "现网 /generate 是 Draw / Photos / Videos 内容流。Try Her 和 Generate Photo & Video 进入 /generate-image 创作表单。",
  blocks: [
    {
      title: "主路径",
      items: [
        "现网 /generate：Draw 精选流、Photos 我的图、Videos 我的视频。文案 Draw/Photos/Videos、Try Her、Generate Photo & Video。",
        "创作页 /generate-image：Creation Center，Generate Photo / Generate Video，文案对齐 DrawGenerate。",
        "Video：选角色、加动作、5s 生成。未选动作 Toast。",
        "结果页：生成中 → 成功图/失败态。Send to chat 是主 CTA。",
      ],
    },
    {
      title: "Persona",
      items: [
        "Guest 点 Generate → Login。",
        "Free 可成功 1 张 Classic；第 2 张、2+ 张、NSFW、Video、PRO 标签 → drawLimit。",
        "Plus 不打断。结果里 NSFW/Video 对非会员模糊 Unlock。",
        "Gems 不足仍走已有 gems overlay，不在 Generate 按钮上展示价格。",
      ],
    },
  ],
};

const SPECS: Partial<Record<ScreenId, ScreenSpec>> = {
  generate: DRAW,
  "generate-result": DRAW,
  "drama-remix": REMIX,
  "short-drama-watch": {
    name: "短剧播放",
    goal: "全屏看剧；右侧 Remix 是创作入口。",
    blocks: [
      {
        title: "要点",
        items: [
          "点 Remix 必须暂停播放。",
          "底部 Film Scenes / Plot / Album 本期隐藏保留。",
        ],
      },
    ],
  },
  "short-drama": {
    name: "短剧列表",
    goal: "选一部剧进入播放，再走 Remix。",
    blocks: [{ title: "要点", items: ["点卡片进播放页。"] }],
  },
};

const FALLBACK: ScreenSpec = {
  name: "当前屏",
  goal: "对照左侧手机框体验。完整地图见 docs/screen-map.md。",
  blocks: [
    {
      title: "说明",
      items: ["本屏暂无单独需求卡。短剧 Remix 相关请跳到「短剧 Remix」。"],
    },
  ],
};

export function specForScreen(id: ScreenId): ScreenSpec {
  return SPECS[id] || { ...FALLBACK, name: id };
}
