# SL 主站 Mobile 页面地图

> 基线范围：Soulove SL 主站 Mobile。对照仓库：`soullove-webapp`、`soulove-web-server`。
> 不做：PC、SEM、Peek、Live-Pro、纯直播站、Android。
> 骨架覆盖：`覆盖` = Demo 可点击；`占位` = 地图已收录、点进去是轻量页；`二期` = 明确暂不进入基线深度；`排除` = 非 SL 主站 Mobile。

## 1. 底栏主屏

来源：`FooterMenuForMobile.tsx` + `main-screen-paths.constant.ts`

SL 数字人主站底栏固定 5 个：

| 顺序 | 产品名 | 路径 | 前端模块 | Demo screen | 覆盖 |
|---|---|---|---|---|---|
| 1 | Home | `/` | `Home/HomePageForMobile` | `home` | 覆盖 |
| 2 | Chats | `/chats` | `Chats/SessionList` | `chats` | 覆盖 |
| 3 | Lover | `/characters` | `Characters/CharactersPageMb` | `characters` | 覆盖 |
| 4 | Draw | `/generate` | `GenerateImage/GenerateImageNewPageMb` | `generate` | 覆盖 |
| 5 | Me | `/account` | `Account` | `account` | 覆盖 |

## 2. Home 内分类

来源：`Home/utils/home.constant.ts`

SL Mobile 数字人主站（Live 开关打开时）：

| Tab | code | 内容 | 覆盖 |
|---|---|---|---|
| For You | `-1` / forYou | 角色双列卡片，默认落地 | 覆盖 |
| Hot | `1` / hot | 热门角色 | 覆盖 |
| New | `4` / new | 新角色 | 覆盖 |
| Shorts | `shorts` | 实际是短剧列表 `ShortDramaListPageMb` | 覆盖，跳短剧 |
| Live | `live` | 现网可开关。**本 Demo 基线按产品要求从首页删除，不展示。** | 排除 |

## 3. 页面全表

### 3.1 发现与角色

| 路径 | 页面 | 入口 | 前端 | 后端 | Demo | 覆盖 |
|---|---|---|---|---|---|---|
| `/` | 首页角色流 | 底栏 Home | Home | RobotInfo / Banner | home | 覆盖 |
| `/characters` | 我的角色 | 底栏 Lover | CharactersPageMb | RobotInfo | characters | 覆盖 |
| `/characters/new` | 创建角色 | Lover 底栏 CTA、Home 创建 | CharactersNewPageMb 约 12 步 | RobotInfo / DrawImage | create-character | 覆盖（骨架收成 3 步） |
| `/character-detail` | 角色详情 | Home 卡片、会话头像 | CharacterDetail | RobotInfo / Gallery | character-detail | 覆盖 |
| `/character-detail/album` | 角色相册 | 详情相册入口 | CharacterDetailAlbum | UserGallery | character-album | 覆盖 |
| `/character-detail/album/preview` | 相册预览 | 相册缩略图 | preview | UserGallery | character-album | 占位，相册内点图 |
| `/characters/[robotCode]` | SEO 角色页 | 外链 | 同详情 | RobotInfo | 不单独做 | 二期 |

生产创建流步骤（骨架未逐页展开，改创建需求时必须回看）：Style → Avatar → Ethnicity → Hair → Body → Personality → Relationship → Occupation → Bio → Greeting/Scenario → Photo/Voice → Bring to life。

### 3.2 聊天

| 路径 | 页面 | 入口 | 前端 | 后端 | Demo | 覆盖 |
|---|---|---|---|---|---|---|
| `/chats` | 会话列表 | 底栏 | SessionListForMobile | Chat | chats | 覆盖 |
| `/chat-room` | 聊天室 | 会话、详情 Chat Now | ChatRoomPageMb | Chat / Voice / Gift | chat-room | 覆盖 |
| `/chat-room/story` | 角色故事 | 聊天室更多 | ChatRoomStory | Chat | 占位 | 占位 |
| `/chat-room/group` | 群聊 | Home Groups（PC 更重） | ChatGroupPage | GroupChat | 二期 | 二期 |

聊天室关键中断点（比页面更重要）：

| 动作 | Free | Plus | Overlay scene |
|---|---|---|---|
| 未登录点 Chat | Login | - | `login` |
| 发送过多文本 | 会员墙 | 通过 | `chatLimit` |
| 点锁定相册/模糊图 | 会员墙 | 通过 | `unlockBlur` |
| Ask photo | 会员墙 | 通过 | `askPhoto` |
| Play voice | 会员墙 | 通过 | `playVoice` |
| 礼物 / 换装 | 可走 Gems 或会员 | 通过 | `generic` / `gems` |

### 3.3 生成与相册

| 路径 | 页面 | 入口 | 前端 | 后端 | Demo | 覆盖 |
|---|---|---|---|---|---|---|
| `/generate` | 生图/生视频 | 底栏 Draw | GenerateImageNewPageMb，tab=image/video | DrawImage | generate | 覆盖 |
| `/generate-image` | 生图表单（历史路由） | 旧入口 | 同生成 | DrawImage | generate | 合并 |
| `/generate/photos/preview` | 生图结果 | 生成完成 | CreateResult | DrawImage | generate-result | 覆盖 |
| `/generate/videos/preview` | 生视频结果 | 生成完成 | GenerateVideoResultDialog | DrawImage | generate-result | 占位 |
| `/gallery` | 我的相册 | Account | Gallery | UserGallery | gallery | 覆盖 |
| `/gallery/preview` | 相册预览 | Gallery | preview | UserGallery | gallery | 占位 |

Draw 会员墙 scene：`drawLimit`。

### 3.4 短剧

| 路径 | 页面 | 入口 | 前端 | 后端 | Demo | 覆盖 |
|---|---|---|---|---|---|---|
| Home Shorts | 短剧列表 | Home tab | ShortDramaListPageMb | ShortDramaContent | short-drama | 覆盖 |
| `/short-drama` | 短剧列表页 | 活动/运营位 | 同上 | 同上 | short-drama | 覆盖 |
| /short-drama/watch | 播放页 | 卡片 | ShortDramaWatchPageMb | 同上 | short-drama-watch | 覆盖 |
| Remix Creation | 短剧 Remix 创作 | 播放页 Remix | Demo | - | drama-remix | 覆盖（方案） |
| `/en/drama-list/:id` | 投放落地页（播放中） | Demo Lab 查看入口 | dramamates drama-list 落地页 | 广告落地 | ad-landing | 覆盖，不进底栏 |

解锁弹窗：`ShortDramaUnlockDialog` → overlay `shortDrama`。

### 3.5 商业化

| 路径 | 页面 | 入口 | 前端 | 后端 | Demo | 覆盖 |
|---|---|---|---|---|---|---|
| `/subscriptions` | 会员页 | Account VIP、全局会员墙 See plans | SubscriptionsPageMb | Member / Product / Pay | subscriptions | 覆盖 |
| `/tokens` | Gems 页 | Account Gems，需弱化 | TokensPageMb | Product / Pay | tokens | 覆盖，入口弱于会员 |
| `/pay` | 收银台 | 会员/Gems 继续支付 | PayPage | Pay / Order | pay | 占位 |
| `/paySuccess` | 支付成功 | 支付回调 | PaySuccess | Order | pay-success | 占位 |
| `/only-pay` | 独立支付 | 特殊链路 | only-pay | Pay | 二期 | 二期 |
| `/pay-shopify` | Shopify 支付 | 特定渠道 | pay-shopify | Pay | 排除 | 排除 |

会员档位（AccountMidBlock）：Free / Basic / Plus / Pro / Lifetime。骨架先做 Free vs Plus，其余档位在地图保留。

会员墙场景（`newSubscriptionsScene.config.tsx`）：

`imageToVideo` `textToVideo` `unlockBlur` `askPhoto` `chatLimit` `shortDrama` `dressUp` `askVideo` `playVoice` `drawLimit` `generic`

### 3.6 账户与增长

| 路径 | 页面 | 入口 | 前端 | 后端 | Demo | 覆盖 |
|---|---|---|---|---|---|---|
| `/account` | 我的 | 底栏 | Account | UserLogin / Member | account | 覆盖 |
| `/profile` | 资料编辑 | 头像 | ProfilePageContent | User | profile | 覆盖 |
| `/login` | 登录页 | 未登录 CTA | LoginDlgOrPage | UserLogin | login | 覆盖，主形态是弹层 |
| `/login/confirm` | 登录确认 | 邮件魔法链 | LoginOverrideConfirm | UserLogin | 二期 | 二期 |
| `/invitation` | 邀请奖励 | Account Invitation Reward | Invite | SocialInvitation | invitation | 覆盖 |
| `/bonus` | Free Gems / 任务 | Account Free Gems | Bonus | Task / Checkin | bonus | 覆盖 |
| `/setting` | 设置 | Account Set Up | Setting | Config | settings | 覆盖 |
| `/setting/account-management` | 账号管理 | 设置 | account-management | User | settings | 占位 |
| `/setting/membership-management` | 会员管理 | 设置 | MembershipManagement | Member | settings | 占位 |
| `/contact-us` | 反馈 | Account Feedback | ContactUs | ContactUs | contact-us | 占位 |
| `/contact-us/robot-report` | 举报角色 | 聊天更多 | robot-report | ContactUs | 二期 | 二期 |
| `/discord-weekly-rewards` | Discord 周奖励 | 运营 | Activity | Promotion | 二期 | 二期 |
| `/crypto-wallet` | 加密钱包 | 账户（消费站） | CryptoWalletPageMb | Pay | 二期 | 二期 |
| `/assistant` | Love Assistant | 账户 | LoveAssistant | Chat | 二期 | 二期 |
| `/account/follow-info` | 关注 | 资料 | FollowDetail | Followers | 二期 | 二期 |
| `/user` | 用户公开页 | 外链 | User | User | 二期 | 二期 |
| `/pwa/guide` | PWA 引导 | 系统 | PWA | - | 排除 | 排除 |
| `/earning/*` | 收益/代理 | 现网 SL 路由多为 false | Earning | Income | 排除 | 排除 |
| `/affiliate` | 联盟 | Dreammates DN | Affiliate | Affiliate | 排除 | 排除 |

### 3.7 政策与系统页

政策页在生产存在，产品方案默认不当作可交互主路径：隐私、条款、未成年人、退款、Trust & Safety、内容审核、Cookies、AML 等。Demo 设置页可跳到说明占位，不逐页做。

`/system-upgrade` 系统维护页：排除。

### 3.8 明确排除

| 路径/能力 | 原因 |
|---|---|
| `/swipe` `/tokens2` `/live-pro/*` | 纯直播 / Live-Pro |
| SEM / Peek / White / Yoco 落地页 | 非 SL 主站 |
| PC 路由 | 非 Mobile |
| `tgHome` Telegram 专属 | 非主路径 |
| 支付渠道实现（Rapyd/Stripe/ApplePay 等） | 方案层只保留收银台占位 |

## 4. 全局 Overlay

这些不是独立路由，但是 SL 转化核心。骨架必须能点出。

| Overlay | 触发 | 前端 | Demo |
|---|---|---|---|
| Login 抽屉 | Guest 点聊天/创建/账户关键操作 | `LoginDrawerForMobile` | `login` |
| 会员墙 | 次数、媒体、短剧、生图限制 | `NewSubscriptionsDialogMb` | `subscribe` |
| Gems 墙 | 余额不足、礼物 | `TokensDialogMb` / `TokensGlobalDialog` | `gems` |
| 新用户奖励 | 登录后 | `NewUserBonusDlgClient` | `bonus` |
| 短剧解锁 | 播放锁定集 | `ShortDramaUnlockDialog` | `shortDrama` |
| 短剧会员墙 v2 | Demo Lab `ShortDrama2` | 方案：女主挽留视频先行，关闭后再展示更多短剧 | `shortDrama2` |
| Toast | 支付成功、复制、限制提示 | Toaster | `toast` |
| 18+ / 年龄 | 敏感内容 | `Only18Dialog` / AgeVerification | 二期 |
| 支付失败 / 重复支付 | 收银台 | PaymentFailedDialog 等 | 二期 |
| 签到 | 偏直播站 | InCheckIn | 二期 |
| 全局自动弹窗编排 | SL 主站数字人侧较弱，Yoco 等更重 | GlobalAutoPopup | 二期 |

## 5. 主路径

### P1 发现 → 详情 → 首聊（激活）

Home For You → 角色卡（美女优先）→ 详情 → Chat Now → 聊天室。Guest 在 Chat Now 出 Login。

### P2 会话 → 聊天 → 会员中断（转化）

Chats → 聊天室 → 发消息触达上限 / 点锁定媒体 → 会员墙 → 会员页 → 支付占位。

### P3 创建角色

Lover → Create your lover → 3 步骨架（描述 / 外观性格 / 预览开聊）→ 聊天室。生产是 12 步长表，后续 Agent 创建需求在 `variants/` 改，不直接当生产还原。

### P4 生图

Draw → Photo/Video tab → Generate → 结果。Free 触发 `drawLimit` 或 Gems 不足。

### P5 短剧

Home Shorts 或短剧页 → 播放 → 解锁墙。

### P6 账户与会员

Me → VIP 卡片（主 CTA）→ 会员页。Gems 卡片存在但视觉更弱。邀请 / Free Gems / 设置 / 反馈为次级。

## 6. 后端对照（只作能力边界，Demo 不接 API）

| 能力 | 主要 Controller |
|---|---|
| 聊天 | SoulloveChatController / GroupChat / Voice / LiveChat |
| 角色 | SoulloveRobotInfoController |
| 会员 | SoulLoveMemberController / SystemMemberCombo* |
| 支付商品 | SoulLovePayController / Order / Product / PriceTier |
| 相册生图 | UserGallery / DrawImage / MultichatUserGallery |
| 短剧 | ShortDramaContentController |
| 登录用户 | UserLoginInfo / TouristInfo / SocialUser |
| 任务邀请 | Task / SocialInvitation / CheckinReward |
| 直播 | LiveChatRoom / SoulloveLiveChat（本期不做深） |

## 7. 骨架已实现的可点击屏

`home` `chats` `characters` `generate` `account` `character-detail` `character-album` `chat-room` `create-character` `generate-result` `gallery` `subscriptions` `tokens` `short-drama` `short-drama-watch` `profile` `settings` `invitation` `bonus` `login` `pay` `pay-success` `contact-us` `ad-landing`

可切换 Persona：Guest / Free / Plus。可手动触发 overlay。


