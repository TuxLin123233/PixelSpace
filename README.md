# PixelSpace · 光域画板

一个挂在 **Cloudflare Pages** 上的 16×16 像素画板，实时联动 LED 灯板（16×16 灯阵）。浏览器里画的每一笔，都能以像素画的形式传给灯板展示。

线上地址：<https://pixel-space-9bn.pages.dev>

## 特性

- **16×16 在线画板**（自带撤销、橡皮擦、颜料桶、命名上传）
- **草稿自动保存**（本地草稿，刷新/返回不丢失）
- **作品库**：画板展示最新 10 条，更多走 `/gallery` 卡片流，滚动懒加载（每页 24 张）
- **点赞 + 佳作展示**：画廊每张作品可点赞（本地防重复），顶部 Top 5 支持**总榜 / 今日 / 本周**切换（按赞数，`range=today|week|all`）
- **深色模式**：画板 / 画廊 / 房间三页均可切换，自动记住偏好并跟随系统
- **联机房间**：`/room` 创建或加入房间，最多 **3 人**在一张 16×16 画布上协同作画（轮询同步），可一键发布到画板
- **一键回载**：浏览器本地记住本人上传的作品，画板历史区可一键「载入编辑」后继续画
- **键盘快捷键**：`B` 画笔 / `E` 橡皮 / `F` 填充 / `C` 颜色 / `Z` 撤销
- **分享单张**：画廊预览弹窗可「复制链接」，`/gallery?t=<时间戳>` 直达该作品并高亮
- **上传限流**：每 IP 5 分钟最多上传 1 次（429），防刷压力配额
- **LED 灯板支持**：`GET /api/get?single=1` 每次只回一张随机作品，保证灯板缓存轻量
- **历史容量**：最多保留 **1000** 条，超出自动删除最旧
- **防抄袭**：历史/画廊仅可预览，不能载入；内容完全相同的作品拒绝重复发布（409）
- **管理后台**：密钥校验，支持删除单条 / 清空（可配合举报）
- **纯色提醒**：画板提示尽量少用纯黑，避免灯板出现"熄灭空洞"

## 技术栈

- 前端：原生 HTML / CSS / JS（单文件页面，无框架）
- 后端：Cloudflare Pages Functions
- 存储：Cloudflare KV（`LIGHTFIELD_KV`）

## 页面

| 路由 | 说明 |
| --- | --- |
| `/paint` | 画板主页（编辑 + 上传 + 最新 10 条） |
| `/gallery` | 全部作品卡片流（懒加载，可预览 + 点赞） |
| `/room` | 联机房间（创建 / 加入，3 人协同作画） |
| `/admin` | 管理后台（`x-admin-key` 校验） |
| `/terms` | 服务条款 |

## API

所有接口都在 `functions/api/`，均为 Pages Functions。

| 接口 | 说明 |
| --- | --- |
| `POST /api/set` | 上传作品。body：`{ "pixels": [[r,g,b]×256], "name": "可选" }`；内容完全一致返回 409；历史超 1000 自动删最旧；每 IP 5 分钟限 1 次（429）；成功返回 `time` |
| `GET /api/get` | 返回最新作品 + 历史。`?after=<时间戳>` 无新作时随机回退旧图；`?limit=N&offset=M` 分页；`?single=1` 只返回随机一张（灯板用）；`?locate=<时间戳>` 返回该作品在列表中的第几条（用于分享定位） |
| `POST /api/admin/delete` | 按 `{ "time": 时间戳 }` 删除单条，header 需 `x-admin-key` |
| `POST /api/admin/clear` | 清空全部，header 需 `x-admin-key` |
| `GET /api/admin/verify` | 校验密钥，header 需 `x-admin-key` |
| `POST /api/like` | 点赞。body：`{ "time": 时间戳 }`，累加该作品赞数并返回最新值 |
| `GET /api/like?top=N` | 按赞数降序返回 Top N 作品（默认 10）。`range=today|week|all` 按区间过滤，`tz=<分钟>` 指定时区偏移（东八区 480） |
| `POST /api/room` | 房间统一入口。`action=create/join/leave/draw`；房间码 6 位，最多 3 人，闲置 30 分钟自动过期 |
| `GET /api/room?code=XXX` | 拉取房间当前画布、版本号与成员 |

## 灯板接入

轮询即可，每次返回单张随机作品（不含历史，响应体小）：

```
GET /api/get?single=1
→ { "pixels": [[r,g,b]×256], "name": "...", "time": 1234..., "random": true }
```

## 本地开发

```sh
npm install
npx wrangler pages dev public
```

本地 KV 绑定见 `wrangler.toml` 中的注释：把 `id` 换成你 `lightfield` namespace 的 ID 才能读写 KV。

> 目录里遗留的 `src/`（Vue 3 旧版作品集合页）已不再参与部署，仅作历史保留。

## 部署配置（Cloudflare Pages 控制台）

- **Functions → Bindings**：添加 KV 绑定
  - Variable name：`LIGHTFIELD_KV`
  - KV namespace：`lightfield`
- **环境变量**：`ADMIN_KEY`（管理后台的密钥，页面和 `api/admin/*` 共用）
- 构建指令：不用构建，直接部署 `public/` 目录即可（保留 `functions/`）