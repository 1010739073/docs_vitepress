# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Language Rules

- 始终使用简体中文回复
- 即使用户使用英文提问，也必须中文回答
- 代码保留英文，但解释必须中文
- 错误分析必须中文
- commit message 使用中文
- 文档生成使用中文

## 项目概述

这是一个用于后端开发笔记和技术文档的 VitePress 文档站点。使用 VitePress 1.6+ 并配合 `vitepress-sidebar` 插件自动生成导航侧边栏。

## 常用命令

- `npm run docs:dev` - 启动开发服务器
- `npm run docs:build` - 构建生产站点（输出到 `docs/.vitepress/dist`）
- `npm run docs:preview` - 本地预览构建后的生产站点

## 架构

### 项目结构

```
docs/                      # VitePress 内容根目录
  .vitepress/
    config.mts             # 主配置文件
    theme/
      index.js             # 主题入口（注册自定义组件）
      style.css            # 品牌色、字体（亮色/暗色模式）
      custom.css           # 侧边栏样式自定义
      components/
        wheel.vue          # 自定义 Vue 组件（转盘）
  backend/                 # 后端开发笔记
    PHP/ Python/ Go/       # 编程语言
    MySQL/ SQLServer/ PostgreSQL/  # 数据库
    Redis/ Elasticsearch/  # 缓存与搜索
    Linux/ Nginx/          # 运维
    Kafka/ RabbitMQ/       # 消息队列
    Distributed/           # 分布式系统
    tools/                 # 工具
  bigdata/                 # 大数据
    Hadoop/
  aicode/                  # AI 编程
  nas/                     # NAS 相关
  public/                  # 静态资源
  index.md                 # 首页
```

### 配置架构

**[config.mts](docs/.vitepress/config.mts)** 包含两部分：

1. **vitePressOptions**：标准 VitePress 配置（站点信息、导航菜单、搜索、主题设置）
2. **vitePressSidebarOptions**：`vitepress-sidebar` 插件配置数组，每个对象定义一个区块的侧边栏生成规则

关键配置项：
- `documentRootPath` / `scanStartPath` / `resolvePath`：定义扫描路径和 URL 前缀
- `useTitleFromFrontmatter` / `useTitleFromFileHeading` / `useFolderTitleFromIndexFile`：标题来源优先级
- `sortMenusOrderNumericallyFromLink` + `removePrefixAfterOrdering`：按数字前缀排序后移除前缀
- `prefixSeparator`：前缀分隔符（默认 `.`）
- `collapsed`：是否默认折叠

### 内容组织

**Frontmatter 格式：**
```yaml
---
title: 页面标题
description: 可选描述
---
```

**文件命名规范：**
- 使用数字前缀排序（如 `1.简介.md`、`2.核心概念.md`）
- 前缀分隔符为 `.`，排序后自动从显示标题中移除
- `index.md` 定义文件夹显示标题

**样式自定义：**
- 品牌色定义在 `style.css`（亮色/暗色模式分别配置）
- 侧边栏样式定义在 `custom.css`

## 部署

通过 `.github/workflows/deploy.yml` 自动部署到 GitHub Pages：
- 触发：推送到 `main` 分支
- Node.js 22
- 输出目录：`docs/.vitepress/dist`

## 添加新内容

1. 在 `docs/` 相应子目录创建 markdown 文件
2. 添加包含 `title` 的 frontmatter
3. 使用数字前缀控制排序
4. 若创建新的主要区块，需在 config.mts 的 `vitePressSidebarOptions` 中添加配置项