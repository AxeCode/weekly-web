# 蒙鼓上单 (Weekly Master)

这是一个基于 Next.js 16 和 Tailwind CSS 构建的静态周刊归档网站。该项目旨在为《科技爱好者周刊》提供一个现代、优雅且易于阅读的 Web 界面。

## ✨ 特性

- **静态生成 (SSG)**: 极速加载，SEO 友好，可部署至任何静态托管服务（GitHub Pages, Vercel, Cloudflare Pages）。
- **自动化数据处理**: 通过脚本自动解析 Markdown 原始内容，生成结构化 JSON 数据。
- **现代化 UI 设计**:
  - 响应式大卡片布局，适配移动端与桌面端。
  - **深色模式支持**: 完美适配系统主题，支持手动一键切换（白天/黑夜）。
  - 精美的侧边栏导航，支持分类筛选与计数。
- **内容优化**:
  - 自动提取封面图与摘要。
  - 智能过滤冗余的样板文字（如招聘信息、投稿指南等），专注于内容本身。
  - 支持 Markdown 渲染，保留原文格式。

## 🛠️ 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **Markdown 处理**: remark, remark-html, remark-gfm
- **工具库**: 
  - `next-themes` (主题切换)
  - `pinyin-pro` (中文转拼音 slug)
  - `date-fns` (日期处理)

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 生成数据

项目依赖外部的 Markdown 内容源。默认配置下，脚本会从 `../weekly-master/docs` 读取文件。

```bash
# 解析 Markdown 并生成 JSON 数据到 src/data
node scripts/build-data.mjs
```

> **注意**: 首次运行前，请确保你已经克隆了内容仓库，或者修改 `scripts/build-data.mjs` 中的 `CONTENT_DIR` 路径。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

## 📦 部署

本项目预配置为静态导出 (`output: 'export'`)，生成的静态文件位于 `out` 目录。

### Vercel 部署

1.  将代码推送到 GitHub（确保包含生成的 `src/data` 目录，因为 Vercel 环境下无法访问外部 Markdown 源）。
2.  在 Vercel 面板导入项目。
3.  Vercel 会自动识别 Next.js 项目，使用默认配置即可：
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `out`
4.  点击 Deploy。

### Cloudflare Pages 部署

1.  将代码推送到 GitHub。
2.  在 Cloudflare Dashboard > Pages > Connect to Git。
3.  选择仓库并配置构建设置：
    -   **Framework Preset**: Next.js (Static HTML Export)
    -   **Build Command**: `npm run build`
    -   **Build Output Directory**: `out`
4.  保存并部署。

### GitHub Pages 部署

```bash
# 构建并部署到 gh-pages 分支
npm run deploy
```

## 📂 项目结构

```
weekly-web/
├── scripts/
│   └── build-data.mjs    # 数据生成脚本：解析 Markdown -> JSON
├── src/
│   ├── app/              # Next.js App Router 页面
│   ├── components/       # UI 组件 (Sidebar, Markdown, ThemeToggle 等)
│   ├── data/             # 生成的静态 JSON 数据 (issues, categories)
│   └── lib/              # 工具函数
├── public/               # 静态资源
└── next.config.ts        # Next.js 配置
```

## 📝 配置

- **数据源路径**: 修改 `scripts/build-data.mjs` 中的 `CONTENT_DIR` 常量。
- **分类映射**: 修改 `scripts/build-data.mjs` 中的逻辑以调整分类提取规则。

## 📄 License

MIT
