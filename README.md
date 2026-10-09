# Soulove Product Demo

SL 主站 Mobile 可点击产品沙盒。这是产品方案的工作台，不是生产站，也不接真实后端。

## 启动

```bash
npm install
npm run dev
```

打开终端里的本地地址。左侧是 390px 手机 Demo，右侧是 Demo Lab（切换 Guest/Free/Plus、跳转页面、触发弹窗）。

## 文档

- `docs/ia.md` 信息架构
- `docs/screen-map.md` 完整页面地图与主路径
- `docs/states.md` 用户状态
- `docs/handoff.md` 给下游 UI 的交接模板
- `variants/` 新需求变体，不要覆盖 `src/` 基线

## 范围

只做 Soulove SL 主站 Mobile。PC / SEM / Peek / Live-Pro 不在基线里。

Codex Skill：`soulove-product-demo`
PRD 输出：`D:\\code\\soullove-openspec\\SL\\PRD\\`
