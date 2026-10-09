# Soulove SL 主站 Mobile 信息架构

范围：仅 SL 主站 Mobile。不做 PC、SEM、Peek、Live-Pro、Android。

来源：`soullove-webapp` 的 `next-router-mb.config.mjs`、`FooterMenuForMobile.tsx`、`Home/utils/home.constant.ts`，以及 `soulove-web-server` 的业务 Controller。

## 产品定位

Soulove 是面向 25-45 岁北美男性的 AI girlfriend 产品。主站 Mobile 的核心不是工具，而是：

1. 先看到她
2. 尽快聊上
3. 在关系体验中转化会员
4. Token / Gems 只做增强，不抢主 CTA

## 结构

```
启动 / 年龄与登录
        │
        ▼
┌──────────────────────────────────────────┐
│ 底栏主屏（可回跳）                         │
│ Home · Chats · Lover · Draw · Me         │
└──────────────────────────────────────────┘
        │
        ├── Home 内分类：For You / Hot / New / Shorts / Live
        ├── 角色详情 / 相册
        ├── 聊天室 / Story / 群聊
        ├── 创建角色
        ├── 生图 / 生视频
        ├── 短剧列表 / 播放
        ├── 会员 / Gems / 支付
        └── 账户：Profile、邀请、任务、设置、反馈
```

## 设计原则（后续改 Demo 必须遵守）

1. CTA 突出
2. 美女优先曝光
3. 移动端优先
4. 会员转化优先
5. Token 充值弱化
6. Toast、弹窗、空态、失败态必须设计，不能只做成功态
7. 新方案用 `variants/[需求名]`，默认不覆盖基线
