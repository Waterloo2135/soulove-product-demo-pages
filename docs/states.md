# 用户状态机

Demo Lab 可切换以下状态。方案讨论时必须声明作用在哪个状态。

## Persona

| 状态 | 含义 | Demo 默认能力 |
|---|---|---|
| Guest | 未登录游客 | 可逛 Home，聊天/创建/账户关键操作弹出 Login |
| Free | 已登录免费用户 | 可首聊，媒体/次数/短剧解锁弹出会员墙；Gems 不足弹出充值墙 |
| Plus | 已登录会员 | 主路径不打断，Gems 仍可能用于生图增强 |

## 资源

- Gems：Free 默认 12，Plus 默认 120
- 免费聊天条数：Free 在聊天室发送第 3 条后触发 `chatLimit` 会员墙
- 相册/模糊图：Free 点击锁定内容触发 `unlockBlur`
- 语音/要照片：Free 触发对应会员墙
- 短剧：Free 解锁集数触发 `shortDrama`（播放页主路径，不改）
- 短剧会员墙 v2：仅 Demo Lab 触发 `shortDrama2`，漏斗倒置；Maybe Later 只关闭，不进聊天

## 禁止

- 不要把所有用户都设计成会员成功态
- 不要在 Guest 状态下假设已有会话和相册
- 不要让 Gems 入口比会员 CTA 更强
