# PixelSpace

一个用 Vue 3 搭建的像素画作品展示站。目前主要收录了作者逐步摸索像素画的过程,顺便当个作品集放在这里。

## 技术栈

- [Vue 3](https://cn.vuejs.org/) + `<script setup>` 组合式 API
- [Vite](https://vite.dev/) 构建
- [Pinia](https://pinia.vuejs.org/) 状态管理
- [Vue Router](https://router.vuejs.org/)
- 像素字体 [TerrarumSansBitmap](https://github.com/gameboy47/terrarumsansbitmap)(本地 `src/assets/fonts`)

## 页面

导航目前由 `App.vue` 里的 `currentPage` 简单切换:

- **作品集(Gallery)** — 主页面
  - 卡片展示,按 `size` 字段自适应图片大小
  - 顶部搜索框按标题过滤
  - 点击卡片弹出详情窗(category 按类别着色:自然/食物/风景)
- **开始创作(Create)** — 目前只有一个 canvas 占位,还没实现
- 关于 / 联系 / 我的作品 / 设置 — 暂无内容

## 项目结构

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

## 作品数据格式

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

## 本地开发

```sh
npm install      # 安装依赖
npm run dev      # 启动开发服务器(热更新)
npm run build    # 打包到 dist/
npm run preview  # 预览打包结果
```

需要 Node.js `^22.18.0` 或 `>=24.12.0`。