# Claude Code 使用教程

## 一、什么是 Claude Code

Claude Code 是 Anthropic 官方推出的 AI 编程助手，深度融合于开发工作流程中。它不仅仅是一个代码生成工具，而是一个能够理解整个项目上下文、执行复杂任务、与开发环境无缝集成的智能助手。

### 核心能力

| 能力 | 说明 |
|------|------|
| 代码理解与修改 | 读取、分析、修改代码文件，支持多种编程语言 |
| Shell 命令执行 | 在终端中执行命令，管理文件系统 |
| 代码库探索 | 搜索文件、查找代码定义、分析项目结构 |
| Git/GitHub 集成 | 执行 Git 操作、创建 PR、审查代码 |
| 任务自动化 | 创建任务列表、分步骤执行复杂任务 |
| 记忆系统 | 持久化存储项目信息和用户偏好 |

### 使用方式

Claude Code 支持多种使用场景：

1. **命令行 (CLI)** - 在终端中直接使用
2. **VS Code 扩展** - 在编辑器中集成使用
3. **JetBrains 插件** - 支持 IntelliJ、PyCharm 等 IDE
4. **网页版** - 通过浏览器使用
5. **API 调用** - 集成到自定义工作流中

---

## 二、安装与配置

### 2.1 安装要求

- Node.js 18+ 或更高版本
- npm 或 yarn 包管理器
- Anthropic API Key

### 2.2 安装方式

**通过 npm 安装：**
```bash
npm install -g @anthropic-ai/claude-code
```

**通过 Homebrew 安装（macOS）：**
```bash
brew install claude
```

### 2.3 初始配置

首次启动需要进行身份认证：

```bash
claude
```

系统会引导你完成 API Key 的配置。也可以手动设置环境变量：

```bash
export ANTHROPIC_API_KEY=your_api_key_here
```

### 2.4 VS Code 扩展安装

1. 打开 VS Code 扩展市场
2. 搜索 "Claude Code"
3. 点击安装
4. 使用 API Key 登录

---

## 三、核心名词解释

### 3.1 工具 (Tools)

Claude Code 可以调用的能力单元，每个工具负责特定功能：

| 工具名 | 功能说明 |
|--------|----------|
| `Read` | 读取文件内容（支持代码、图片、PDF、Excel） |
| `Write` | 创建或覆盖文件 |
| `Edit` | 编辑文件（精确字符串替换） |
| `Bash` | 执行 Shell 命令 |
| `Agent` | 启动子 Agent 处理复杂任务 |
| `AskUserQuestion` | 向用户提问获取信息 |
| `TaskCreate/TaskList/TaskUpdate` | 任务管理 |
| `Skill` | 调用预定义的技能/命令 |
| `Grep` | 搜索文件内容 |
| `Glob` | 按模式匹配文件名 |
| `WebSearch` | 搜索网络获取最新信息 |
| `WebFetch` | 获取网页内容 |

### 3.2 技能 (Skills)

技能是预定义的任务模板，通过斜杠命令调用：

| 命令 | 功能 |
|------|------|
| `/init` | 初始化项目的 CLAUDE.md 文档 |
| `/review` | 审查 Pull Request |
| `/loop` | 设置循环任务 |
| `/help` | 获取帮助 |
| `/compact` | 压缩对话历史 |
| `/clear` | 清除对话 |
| `/permissions` | 管理权限设置 |
| `/remember` | 保存记忆 |
| `/forget` | 删除记忆 |
| `/config` | 打开配置界面 |
| `/model` | 切换模型 |
| `/fast` | 启用快速模式 |
| `/plan` | 进入规划模式 |

### 3.3 权限 (Permissions)

控制 Claude Code 可以执行哪些操作：

| 权限类型 | 说明 |
|----------|------|
| `allow` | 允许自动执行的操作 |
| `deny` | 禁止执行的操作 |
| `ask` | 每次执行前询问用户 |

**权限配置示例：**
```json
{
  "permissions": {
    "allow": [
      "Bash(npm install *)",
      "Bash(git status)",
      "Read"
    ],
    "deny": [
      "Bash(rm -rf *)"
    ]
  }
}
```

**配置文件位置：**

| 文件 | 作用域 | 路径 |
|------|--------|------|
| 全局配置 | 所有项目 | `~/.claude/settings.json` |
| 项目配置 | 当前项目 | `.claude/settings.local.json` |

### 3.4 模型 (Models)

Claude Code 支持多种模型，可根据任务复杂度选择：

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| Claude Opus 4 | 最强大，深度推理 | 复杂架构设计、困难 bug |
| Claude Sonnet 4 | 平衡性能与速度 | 日常开发、代码审查 |
| Claude Haiku 3.5 | 快速响应 | 简单任务、快速问答 |

可通过 `/config` 或 `/model` 切换模型。

### 3.5 Hooks（钩子）

在特定事件时自动执行的 Shell 命令：

| 钩子类型 | 触发时机 |
|----------|----------|
| `PreToolUse` | 工具调用前执行 |
| `PostToolUse` | 工具调用后执行 |
| `Notification` | 收到通知时执行 |
| `Stop` | 会话停止时执行 |

**配置示例：**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": ["echo '即将执行命令: $(date)'"]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": ["echo '文件已修改: $(date)' >> ~/.claude/change.log"]
      }
    ]
  }
}
```

### 3.6 MCP (Model Context Protocol)

允许 Claude Code 连接外部服务和数据源的协议，极大扩展能力边界：

**常用 MCP 服务器：**

| 服务器 | 功能 |
|--------|------|
| `filesystem` | 文件系统访问 |
| `github` | GitHub API 集成 |
| `postgres` | PostgreSQL 数据库操作 |
| `slack` | Slack 集成 |
| `google-drive` | Google Drive 访问 |

**配置示例：**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/path/to/allowed/dir"]
    }
  }
}
```

### 3.7 Worktree（工作树）

Git 工作树的隔离环境，用于并行开发多个功能而不互相干扰：

```bash
# 创建新的工作树
git worktree add ../feature-a -b feature-a

# 在新工作树中使用 Claude Code
cd ../feature-a
claude "实现功能 A"
```

---

## 四、常用命令

### 4.1 启动与会话

```bash
claude                          # 启动交互式会话
claude "修复登录页面的 bug"      # 直接执行任务
claude -c                       # 继续上次会话
claude -r                       # 恢复之前会话
claude --resume <session-id>    # 恢复指定会话
```

### 4.2 非交互模式

适用于脚本和自动化场景：

```bash
# 执行单个任务并退出
claude -p "分析这个项目的架构"

# 读取 stdin
cat error.log | claude -p "分析这些错误日志"

# 输出 JSON 格式
claude -p "列出所有 TODO" --output-format json
```

### 4.3 模型与配置

```bash
/config                 # 打开配置界面
/model                  # 切换模型
/fast                   # 切换快速模式（使用 Haiku）
```

### 4.4 内置斜杠命令

```
/help                    # 获取帮助
/init                    # 初始化 CLAUDE.md
/clear                   # 清除对话
/compact                 # 压缩对话历史
/permissions             # 管理权限
/remember                # 保存记忆
/forget                  # 删除记忆
/doctor                  # 诊断配置问题
/vim                     # 切换 Vim 模式
```

### 4.5 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+C` | 取消当前操作 |
| `Ctrl+D` | 退出会话 |
| `↑` / `↓` | 浏览历史命令 |
| `Tab` | 自动补全 |
| `Ctrl+R` | 搜索历史 |

---

## 五、CLAUDE.md 配置文件

### 5.1 什么是 CLAUDE.md

CLAUDE.md 是项目级别的指令文件，让 Claude Code 了解项目规范、约定和上下文。放置在项目根目录，Claude Code 每次启动时会自动读取。

### 5.2 基础结构

```markdown
# 项目名称

## 项目概述
简要描述项目的用途和技术栈。

## 常用命令
- `npm run dev` - 启动开发服务器
- `npm test` - 运行测试

## 架构说明
描述项目结构和关键模块。

## 代码规范
- 使用 2 空格缩进
- 变量命名使用 camelCase
- 组件名使用 PascalCase

## 注意事项
- 修改 API 时需要更新文档
- 提交前运行 lint 检查
```

### 5.3 高级配置示例

```markdown
# 电商平台后端

## 项目概述
基于 Spring Boot 的电商后端服务，使用 MySQL + Redis。

## 技术栈
- Java 17
- Spring Boot 3.2
- MySQL 8.0
- Redis 7.0
- Maven

## 目录结构
```
src/main/java/com/example/
├── controller/    # REST API 控制器
├── service/       # 业务逻辑层
├── repository/    # 数据访问层
├── entity/        # 实体类
└── dto/           # 数据传输对象
```

## 代码规范
- Controller 只负责请求处理，不包含业务逻辑
- Service 层处理所有业务逻辑
- 使用 @Transactional 管理事务
- 统一使用 Result<T> 包装响应

## 测试规范
- 单元测试放在 src/test/java
- 测试类命名: XxxxTest.java
- 使用 @SpringBootTest 进行集成测试

## API 文档
- 使用 Swagger 自动生成
- 访问地址: http://localhost:8080/swagger-ui.html

## 注意事项
- 不要直接修改数据库，使用 Flyway 迁移
- 敏感配置使用环境变量
- 所有 API 需要认证（除登录注册）
```

---

## 六、记忆系统

### 6.1 概述

Claude Code 的记忆系统可以持久化存储重要信息，分为多个类型：

| 类型 | 目录 | 说明 |
|------|------|------|
| `user` | `~/.claude/memory/user/` | 用户偏好、角色信息 |
| `feedback` | `~/.claude/memory/feedback/` | 用户反馈的指导原则 |
| `project` | `.claude/memory/project/` | 项目相关信息 |
| `reference` | `.claude/memory/reference/` | 外部资源引用 |

### 6.2 使用方式

```bash
# 保存记忆
/remember 我偏好使用 TypeScript

# 保存项目相关记忆
/remember --project 这个项目使用 monorepo 结构

# 查看所有记忆
/remember --list

# 删除记忆
/forget 我偏好使用 TypeScript
```

### 6.3 记忆文件格式

记忆以 Markdown 文件存储：

```markdown
# 用户偏好

- 偏好使用 TypeScript 而非 JavaScript
- 使用 VS Code 编辑器
- 喜欢详细的代码注释

# 项目上下文

- 这是一个电商项目
- 使用微服务架构
- 数据库使用 PostgreSQL
```

---

## 七、实际应用场景

### 7.1 代码重构

```
我需要重构 UserService，将其拆分为更小的服务类。
请先分析当前代码结构，然后提出重构方案。
```

### 7.2 Bug 调试

```
用户反馈登录时偶尔会失败，请帮我排查可能的原因。
相关日志在 logs/error.log 文件中。
```

### 7.3 新功能开发

```
需要添加一个用户积分系统，包括：
1. 积分获取规则（登录、购买、评价）
2. 积分消费规则（兑换优惠券）
3. 积分过期机制

请先设计数据库表结构，然后逐步实现。
```

### 7.4 代码审查

```
请审查 src/features/payment 目录下的代码，
关注安全性、性能和代码规范。
```

### 7.5 文档生成

```
为 src/api 目录下的所有接口生成 API 文档，
使用 Markdown 格式，包含请求参数和响应示例。
```

### 7.6 测试编写

```
为 OrderService 编写单元测试，覆盖以下场景：
- 正常下单流程
- 库存不足的情况
- 价格计算边界值
```

### 7.7 项目迁移

```
需要将这个项目从 JavaScript 迁移到 TypeScript。
请先分析需要修改的文件，然后创建迁移计划。
```

---

## 八、配置文件详解

### 8.1 settings.json 完整结构

```json
{
  "permissions": {
    "allow": [
      "Bash(npm install *)",
      "Bash(npm run *)",
      "Bash(git *)",
      "Bash(pip install *)",
      "Read",
      "Write",
      "Edit"
    ],
    "deny": [
      "Bash(rm -rf /*)",
      "Bash(sudo *)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": ["logger 'Claude 正在执行命令'"]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": ["git add -A"]
      }
    ]
  },
  "env": {
    "NODE_ENV": "development"
  },
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### 8.2 权限匹配规则

权限支持通配符匹配：

| 规则 | 匹配示例 |
|------|----------|
| `Bash(git *)` | `git status`, `git commit`, `git push` |
| `Bash(npm *)` | `npm install`, `npm run build` |
| `Read(*.ts)` | 读取所有 `.ts` 文件 |
| `Write` | 所有写入操作 |

---

## 九、常见问题及解决方案

### Q1: 每次执行命令都要确认，很麻烦

**解决方案**：配置权限白名单

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm *)",
      "Bash(pip install *)",
      "Bash(python *)",
      "Bash(go *)"
    ]
  }
}
```

### Q2: 对话太长，响应变慢

**解决方案**：
- 使用 `/compact` 压缩对话历史
- 使用 `/clear` 清除对话重新开始
- 开启新会话处理新任务

### Q3: Claude 忘记了之前的上下文

**解决方案**：
- 使用 `/remember` 保存重要信息
- 创建 `CLAUDE.md` 记录项目规范
- 使用 `-c` 继续上次会话

### Q4: 想让 Claude 自动执行某些操作

**解决方案**：配置 Hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": ["npm run lint"]
      }
    ]
  }
}
```

### Q5: 如何让 Claude 遵循项目规范

**解决方案**：创建详细的 CLAUDE.md 文件，包含：
- 代码风格指南
- 目录结构说明
- 测试规范
- 提交规范

### Q6: Git 操作需要频繁确认

**解决方案**：

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git push *)",
      "Bash(git pull *)"
    ]
  }
}
```

### Q7: 想切换模型或调整设置

**解决方案**：
- 使用 `/config` 打开交互式配置
- 使用 `/model` 快速切换模型
- 直接编辑 `settings.json`

### Q8: 任务太复杂，Claude 难以处理

**解决方案**：
- 使用 `/plan` 进入规划模式
- 让 Claude 创建任务列表
- 拆分成多个小任务逐步执行

### Q9: 如何处理敏感信息

**解决方案**：
- 使用环境变量存储密钥
- 在 `.gitignore` 中排除敏感文件
- 配置 `deny` 权限禁止读取敏感文件

```json
{
  "permissions": {
    "deny": [
      "Read(*.env)",
      "Read(*.pem)"
    ]
  }
}
```

### Q10: 如何在团队中共享配置

**解决方案**：
- 将 `CLAUDE.md` 提交到代码仓库
- 创建 `.claude/settings.local.json.example` 作为模板
- 使用统一的 hooks 配置

---

## 十、最佳实践

### 10.1 任务描述技巧

**好的描述：**
```
在 UserService 中添加邮箱验证功能：
1. 发送验证码邮件
2. 验证码有效期 5 分钟
3. 最多尝试 3 次
```

**不好的描述：**
```
加个邮箱验证
```

### 10.2 权限配置建议

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm *)",
      "Bash(pip *)",
      "Bash(python *)",
      "Bash(go *)",
      "Bash(make *)",
      "Read",
      "Write",
      "Edit"
    ],
    "deny": [
      "Bash(rm -rf /*)",
      "Bash(sudo *)",
      "Bash(chmod 777 *)"
    ]
  }
}
```

### 10.3 CLAUDE.md 编写建议

1. **简洁明了**：避免冗长，突出重点
2. **结构清晰**：使用标题和列表组织内容
3. **包含示例**：对于复杂规范，提供代码示例
4. **保持更新**：项目变化时同步更新

### 10.4 高效使用技巧

1. **明确描述任务**：具体说明目标，而不是模糊请求
2. **善用权限配置**：减少不必要的确认
3. **使用记忆系统**：保存常用偏好和上下文
4. **分步处理复杂任务**：让 Claude 创建计划，逐步完成
5. **定期清理会话**：使用 `/compact` 或 `/clear` 保持响应速度

---

## 十一、故障排除

### 11.1 诊断命令

```bash
/doctor                  # 运行诊断检查
claude --version         # 检查版本
claude --help            # 查看帮助
```

### 11.2 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| API Key 无效 | 密钥过期或错误 | 重新配置 API Key |
| 权限被拒绝 | 权限配置限制 | 检查 settings.json |
| 连接超时 | 网络问题 | 检查网络连接 |
| 内存不足 | 会话过长 | 使用 `/compact` 压缩 |

### 11.3 重置配置

```bash
# 重置全局配置
rm -rf ~/.claude/settings.json

# 重置项目配置
rm -rf .claude/settings.local.json

# 清除所有记忆
rm -rf ~/.claude/memory
```

---

## 十二、获取帮助

- **内置帮助**：`/help` 命令
- **诊断工具**：`/doctor` 命令
- **GitHub Issues**：https://github.com/anthropics/claude-code/issues
- **官方文档**：https://docs.anthropic.com/claude-code
- **社区讨论**：https://discord.gg/anthropic
