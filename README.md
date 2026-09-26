# PixelSpace · 光域画板

以**电脑端像素画**为主：16×16 像素画板的创作、存档与展示（画板 / 画廊 / 联机房间）。**LED 灯板联动为辅**——把画好的作品以像素画形式传到灯板展示（见下文「灯板接入」）。

线上地址：<https://pixel-space-9bn.pages.dev>

## 项目主线（当前）

下述「特性 / 页面 / API / 部署」都是当前线上版本（Cloudflare Pages + KV）。
早期用 Vue 3 亲手搭的**像素画作品集**没有被删——完整保留在文末附录「我的像素画作品集（历史）」，那是我的成果。

## 特性

- **16×16 在线画板**（自带撤销、橡皮擦、颜料桶、命名上传）
- **作品名 / 作者名分开填**：单人作品标「作品名 + 一位作者」；联机发布的多人作品自动标「房间作品名 + 全部画家名（顿号分隔）」
- **草稿自动保存**（本地草稿，刷新/返回不丢失）
- **作品库**：画板展示最新 10 条，更多走 `/gallery` 卡片流，滚动懒加载（每页 24 张）
- **点赞 + 佳作展示**：画廊每张作品可点赞（本地防重复），顶部 Top 5 支持**总榜 / 今日 / 本周**切换（按赞数，`range=today|week|all`）
- **深色模式**：画板 / 画廊 / 房间三页均可切换，自动记住偏好并跟随系统
- **联机房间**：`/room` 创建或加入房间，最多 **3 人**在一张 16×16 画布上协同作画（轮询同步）。房间有**共享作品名**，谁都能改、实时同步，发布到画板时用这个名字。最后一个成员退出时房间**立即删除**；就算有人没走退出流程（断线/直接关页），KV 30 分钟 TTL 也会自动清掉，不留僵尸房间
- **一键回载**：浏览器本地记住本人上传的作品，画板历史区可一键「载入编辑」后继续画
- **键盘快捷键**：`B` 画笔 / `E` 橡皮 / `F` 填充 / `C` 颜色 / `Z` 撤销
- **自定义颜色**：画板与房间都支持直接输入 `#RRGGBB` 取色，房间另有系统调色板；工具栏用 emoji（✏️ 画笔 / 🧽 橡皮 / 🪣 颜料桶 / 🎨 颜色 / ↩️ 撤销）
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
| `POST /api/set` | 上传作品。body：`{ "pixels": [[r,g,b]×256], "workName": "作品名(可空)", "author": "作者名(可空，多人用顿号分隔)" }`；兼容旧 `name` 字段（作为作者名）。`name`（展示名）= 作品名或作者名，灯板显示作品名优先。内容完全一致返回 409；历史超 1000 自动删最旧；每 IP 5 分钟限 1 次（429）；成功返回 `time` |
| `GET /api/get` | 返回最新作品 + 历史。`?after=<时间戳>` 无新作时随机回退旧图；`?limit=N&offset=M` 分页；`?single=1` 只返回随机一张（灯板用）；`?locate=<时间戳>` 返回该作品在列表中的第几条（用于分享定位） |
| `POST /api/admin/delete` | 按 `{ "time": 时间戳 }` 删除单条，header 需 `x-admin-key` |
| `POST /api/admin/clear` | 清空全部，header 需 `x-admin-key` |
| `GET /api/admin/verify` | 校验密钥，header 需 `x-admin-key` |
| `POST /api/like` | 点赞。body：`{ "time": 时间戳 }`，累加该作品赞数并返回最新值 |
| `GET /api/like?top=N` | 按赞数降序返回 Top N 作品（默认 10）。`range=today|week|all` 按区间过滤，`tz=<分钟>` 指定时区偏移（东八区 480） |
| `POST /api/room` | 房间统一入口。`action=create/join/leave/draw/title`；`title` 更新共享作品名（需已在房间，最长 20 字）；房间码 6 位，最多 3 人，闲置 30 分钟自动过期 |
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

> 目录里遗留的 `src/`（Vue 3 旧版作品集合页）已不再参与部署，仅作历史保留，详细文档见文末附录。

## 部署配置（Cloudflare Pages 控制台）

- **Functions → Bindings**：添加 KV 绑定
  - Variable name：`LIGHTFIELD_KV`
  - KV namespace：`lightfield`
- **环境变量**：`ADMIN_KEY`（管理后台的密钥，页面和 `api/admin/*` 共用）
- 构建指令：不用构建，直接部署 `public/` 目录即可（保留 `functions/`）

---

## 附录：我的像素画作品集（历史）

这是我早期用 **Vue 3** 亲手搭建的像素画作品集（作品与页面在 `src/`，旧版曾部署上线；现在并入本仓库历史保留，作品文档如下，原样保存）。

### 技术栈

- [Vue 3](https://cn.vuejs.org/) + `<script setup>` 组合式 API
- [Vite](https://vite.dev/) 构建
- [Pinia](https://pinia.vuejs.org/) 状态管理
- [Vue Router](https://router.vuejs.org/)
- 像素字体 [TerrarumSansBitmap](https://github.com/gameboy47/terrarumsansbitmap)(本地 `src/assets/fonts`)

### 页面

导航目前由 `App.vue` 里的 `currentPage` 简单切换:

- **作品集(Gallery)** — 主页面
  - 卡片展示,按 `size` 字段自适应图片大小
  - 顶部搜索框按标题过滤
  - 点击卡片弹出详情窗(category 按类别着色:自然/食物/风景)
- **开始创作(Create)** — 目前只有一个 canvas 占位,还没实现
- 关于 / 联系 / 我的作品 / 设置 — 暂无内容

### 项目结构

```
pixel-space/
├── index.html
├── vite.config.js            # @ 指向 src 的别名
└── src/
    ├── main.js               # 入口,挂载 Pinia + Router
    ├── App.vue               # 顶栏导航 + 页面切换
    ├── assets/
    │   ├── fonts/            # 像素字体
    │   ├── svgs/             # 顶栏图标
    │   ├── global.css        # CSS 变量 + 类别配色
    ├── components/
    │   ├── pixelCard.vue     # 作品卡片
    │   └── imageModal.vue    # 详情弹窗
    ├── composables/
    │   └── getPixelImages.js # 按标题查作品图片
    ├── data/
    │   └── PixelArts.json    # 作品数据
    ├── router/index.js       # 路由(暂未用,列表为空)
    ├── stores/counter.js     # 示例 store
    └── views/
        ├── Gallery.vue
        └── Create.vue
```

### 作品数据格式

新增作品改 `src/data/PixelArts.json` 即可,图片放 `public/images/`。

```json
{
    "id": 5,
    "title": "三叶草",
    "description": "找了半天也没找到四叶的,先画个三叶的。",
    "image": "/images/三叶草.png",
    "date": "2025-xx-xx",
    "category": "自然",
    "size": 2,
    "author": "tux",
    "like": 0
}
```

| 字段 | 说明 |
| --- | --- |
| `category` | 类别:自然 / 食物 / 风景,决定卡片和弹窗的配色 |
| `size` | 展示大小 `0/1/2`,卡片与弹窗据此自适应图片尺寸 |
| `author` | 作者 |
| `like` | 点赞数 |

### 本地开发（旧版）

```sh
npm install      # 安装依赖
npm run dev      # 启动开发服务器(热更新)
npm run build    # 打包到 dist/
npm run preview  # 预览打包结果
```

需要 Node.js `^22.18.0` 或 `>=24.12.0`。