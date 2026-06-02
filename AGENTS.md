# 仓库指南

## 项目结构与模块组织
本仓库是一个 VitePress 文档站点。Markdown 内容位于 `docs/`，按主题组织：`docs/backend/`、`docs/bigdata/`、`docs/aicode/`、`docs/nas/`。VitePress 配置在 `docs/.vitepress/config.mts`；主题入口、样式和 Vue 组件位于 `docs/.vitepress/theme/`。静态资源放在 `docs/public/`，引用时使用站点根路径，例如 `/logo.png`。

## 构建、测试与本地开发命令
- `npm run docs:dev`：启动本地 VitePress 开发服务器。
- `npm run docs:build`：构建生产站点，输出到 `docs/.vitepress/dist`。
- `npm run docs:preview`：本地预览生产构建结果。
- `npm ci`：根据 `package-lock.json` 安装依赖，适合干净环境和 CI。

修改导航、VitePress 配置、主题文件或 Markdown 目录结构后，提交前应运行 `npm run docs:build`。

## 编码风格与命名约定
文档内容以简体中文为主。Markdown 应简洁清晰，必要时添加 frontmatter：

```yaml
---
title: 页面标题
description: 可选描述
---
```

有顺序要求的内容文件使用数字前缀和点分隔符，例如 `1.简介.md`、`2.核心概念.md`；侧边栏插件会按该前缀排序，并在展示标题中移除前缀。目录首页使用 `index.md`。修改 TypeScript/Vue 配置时，保持与 `config.mts` 现有缩进和对象布局一致。

## 初始化语言约束
初始化项目、创建新栏目或生成首批文档时，默认页面标题、说明文案、导航名称、frontmatter 和提交信息必须使用简体中文。除非维护者明确要求，不要生成英文占位内容，例如 `Getting Started`、`Overview` 或 `TODO`。

## 测试规范
当前没有独立的一方测试框架。主要校验方式是 VitePress 生产构建。内容变更后，用 `npm run docs:dev` 检查链接、标题层级和侧边栏位置；配置、主题或工作流变更后，运行 `npm run docs:build`。

## 提交与 Pull Request 规范
近期提交多使用简短中文摘要，例如 `数据库`、`面试题补充`。建议使用能说明变更主题的中文提交信息，例如 `补充 Kafka 面试题`、`调整 VitePress 导航`。PR 应说明影响范围、列出已执行的校验；涉及主题或布局变化时附截图。有关联 issue 时应在 PR 中链接。

## 部署与配置提示
GitHub Pages 部署由 `.github/workflows/deploy.yml` 触发，在推送到 `main` 时执行，使用 Node.js 22 和 `npm ci`。不要提交 `docs/.vitepress/dist` 或缓存文件，除非维护者明确要求。
