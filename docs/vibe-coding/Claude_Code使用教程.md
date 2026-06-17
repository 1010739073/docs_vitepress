---
title: Claude Code 使用教程
description: Claude Code 的安装、认证、CLI 命令、权限、记忆、MCP、Hooks 与常见工作流。
---

# Claude Code 使用教程

## 一、文档完整性检查

原文已经覆盖了 Claude Code 的基本概念、安装、权限、MCP、Hooks 和常见场景，但还不够完善，主要问题是：

- 安装方式需要更新：官方现在更推荐原生安装脚本，Homebrew 包名是 `claude-code`，npm 仍可作为可选方式。
- 配置作用域不完整：应区分 Managed、User、Project、Local，不应只写 `~/.claude/settings.json` 和 `.claude/settings.local.json`。
- 记忆系统描述需要校准：核心文件是不同层级的 `CLAUDE.md`，会话内通过 `/memory` 管理；旧版 `/remember`、`/forget` 不是主要入口。
- 权限模式需要补充：除 allow/deny/ask 规则外，还应说明 `default`、`acceptEdits`、`plan`、`auto`、`dontAsk`、`bypassPermissions` 等启动模式。
- Hooks 示例需要使用 `type: "command"` 的结构，并补充常见事件，如 `Notification`、`PermissionRequest`、`ConfigChange`。
- 缺少非交互模式、背景会话、工作树、代码审查、安全建议和团队共享实践。

以下内容按当前官方文档和实际使用场景整理。

## 二、什么是 Claude Code

Claude Code 是 Anthropic 面向开发者的 AI 编程助手，可以在终端、IDE、桌面应用和 Web 工作流中读取项目、编辑文件、执行命令、审查代码并协助完成复杂开发任务。

### 核心能力

| 能力 | 说明 |
|------|------|
| 代码库理解 | 读取文件、搜索代码、分析架构、解释模块关系 |
| 文件编辑 | 修改、创建、重构代码和文档 |
| 命令执行 | 运行测试、构建、格式化、Git、脚本等命令 |
| 规划与任务拆解 | 对复杂任务先规划，再分步骤实现 |
| 权限控制 | 通过模式和规则控制哪些操作需要确认 |
| 记忆与项目指令 | 使用 `CLAUDE.md` 持久化项目规范和个人偏好 |
| MCP 扩展 | 连接 GitHub、Figma、数据库、浏览器等外部工具 |
| Hooks 自动化 | 在工具调用、通知、配置变化等事件上执行脚本 |
| 并行工作 | 使用 background sessions、agents、worktrees 处理大型任务 |

### 常见使用形态

| 形态 | 适合场景 |
|------|----------|
| 终端 CLI | 日常开发、调试、重构、代码审查 |
| IDE 集成 | 结合当前打开文件、选区和编辑器上下文 |
| Desktop / Web | 远程控制、跨设备继续会话、云端任务 |
| Print 模式 `-p` | 脚本、CI、一次性查询和自动化输出 |
| Agent SDK | 将 Claude Code 能力集成到自定义程序 |

## 三、安装与认证

### 3.1 环境要求

- macOS 13.0+、Windows 10 1809+、Ubuntu 20.04+、Debian 10+ 或 Alpine Linux 3.19+
- 4 GB 以上内存，x64 或 ARM64 处理器
- Bash、Zsh、PowerShell 或 CMD
- 可访问 Anthropic 服务的网络环境
- Claude Pro、Max、Team、Enterprise 或 Console 账号；免费 Claude.ai 计划不包含 Claude Code 访问权限

### 3.2 推荐安装方式

macOS、Linux、WSL：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell：

```powershell
irm https://claude.ai/install.ps1 | iex
```

Windows CMD：

```cmd
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

Homebrew：

```bash
brew install --cask claude-code
```

WinGet：

```powershell
winget install Anthropic.ClaudeCode
```

npm 可选安装方式：

```bash
npm install -g @anthropic-ai/claude-code
```

验证安装：

```bash
claude --version
claude doctor
```

### 3.3 登录与账号

首次运行：

```bash
claude
```

常用认证命令：

```bash
claude auth login              # 登录 Anthropic 账号
claude auth login --console    # 使用 Anthropic Console 账号
claude auth status             # 查看认证状态
claude auth logout             # 退出登录
```

如果在远程或无浏览器环境中使用，可以结合设备码、远程端口转发或企业提供的 token 方案。不要把 API Key、OAuth token、`~/.claude.json`、`~/.claude/settings.json` 中的敏感内容提交到仓库。

### 3.4 更新

原生安装通常会自动后台更新。手动更新：

```bash
claude update
```

Homebrew 和 WinGet 安装默认不会通过 Claude Code 自动更新：

```bash
brew upgrade claude-code
winget upgrade Anthropic.ClaudeCode
```

npm 安装升级：

```bash
npm install -g @anthropic-ai/claude-code@latest
```

## 四、核心 CLI 命令

### 4.1 启动与会话

```bash
claude                                  # 启动交互式会话
claude "解释这个项目的模块结构"          # 带初始提示启动
claude -c                               # 继续当前目录最近一次会话
claude -r "<session-id-or-name>"        # 恢复指定会话
claude -n "支付模块重构"                 # 给会话命名，方便恢复
```

### 4.2 Print 模式

`-p` 适合脚本、流水线和一次性问题，执行后直接退出：

```bash
claude -p "总结这个仓库的技术栈"
cat error.log | claude -p "分析日志中的主要错误"
claude -p "列出最近改动的风险点" --output-format json
```

常用参数：

| 参数 | 作用 |
|------|------|
| `--model` | 为当前会话指定模型 |
| `--effort` | 设置推理强度，如 `low`、`medium`、`high`、`xhigh` |
| `--permission-mode` | 设置权限模式 |
| `--allowedTools` | 临时允许某些工具或命令 |
| `--disallowedTools` | 临时拒绝某些工具或命令 |
| `--add-dir` | 允许访问额外目录 |
| `--settings` | 使用指定 settings JSON 或内联 JSON |
| `--output-format` | Print 模式输出格式，常用 `text`、`json`、`stream-json` |
| `--max-turns` | 限制非交互模式最大轮数 |
| `--worktree` | 在隔离 Git worktree 中启动 |
| `--bg` | 启动 background session 并返回会话 ID |

### 4.3 项目与后台任务

```bash
claude agents                 # 打开 agent view，监控后台会话
claude --bg "调查 flaky test"  # 后台运行一个任务
claude attach <id>            # 接入后台会话
claude logs <id>              # 查看后台会话日志
claude stop <id>              # 停止后台会话
claude project purge --dry-run # 预览清理本地项目状态
```

### 4.4 常用斜杠命令

在交互会话中输入 `/` 可以查看当前版本支持的命令。

| 命令 | 用途 |
|------|------|
| `/help` | 查看帮助 |
| `/init` | 为项目生成 `CLAUDE.md` |
| `/memory` | 编辑 `CLAUDE.md`，管理 auto-memory |
| `/permissions` | 管理 allow、ask、deny 权限规则 |
| `/model` | 切换模型 |
| `/effort` | 调整推理强度 |
| `/fast` | 开关 fast mode |
| `/plan` | 进入规划模式 |
| `/clear` | 开启新会话上下文 |
| `/compact` | 压缩当前会话上下文 |
| `/diff` | 查看 Claude 产生的改动 |
| `/code-review` | 审查当前 diff，可指定强度和 `--fix` |
| `/review` | 本地审查 Pull Request |
| `/security-review` | 审查安全风险 |
| `/mcp` | 管理 MCP 连接 |
| `/hooks` | 查看 Hooks 配置 |
| `/skills` | 查看和选择技能 |
| `/agents` | 管理 agents 和并行工作 |
| `/status` | 查看版本、模型、账号、上下文等状态 |
| `/doctor` | 诊断安装和设置 |
| `/theme` | 调整主题 |
| `/exit` | 退出 CLI |

## 五、权限与安全

### 5.1 权限模式

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| `default` | 默认交互模式，敏感操作需要确认 | 日常开发 |
| `acceptEdits` | 文件编辑更少打断，命令仍保持确认 | 大量重构、文档整理 |
| `plan` | 先输出计划，不直接执行实现 | 复杂或不明确任务 |
| `auto` | 自动模式，结合分类器减少确认 | 相对可信的仓库和任务 |
| `dontAsk` | 尽量不弹出确认，但仍受工具与策略限制 | 受控本地环境 |
| `bypassPermissions` | 跳过权限提示，风险最高 | 只在隔离环境或明确可信任务中使用 |

启动时指定：

```bash
claude --permission-mode plan
claude --permission-mode acceptEdits
```

### 5.2 settings.json 作用域

| 作用域 | 位置 | 是否共享 |
|--------|------|----------|
| Managed | 管理员或系统策略 | 组织级，用户不可覆盖 |
| User | `~/.claude/settings.json` | 仅当前用户 |
| Project | `.claude/settings.json` | 建议提交到仓库，团队共享 |
| Local | `.claude/settings.local.json` | 当前项目个人配置，通常不提交 |

优先级大致为：Managed 最高，其次命令行参数、Local、Project、User。权限规则会合并，而不是简单覆盖。

### 5.3 权限规则示例

`.claude/settings.json`：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Read(./docs/**)"
    ],
    "ask": [
      "Bash(npm install *)",
      "Bash(git push *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  }
}
```

建议：

- 只允许明确可控的命令，不要使用过宽的 `Bash(*)`。
- 对安装依赖、推送代码、数据库迁移、部署命令使用 `ask`。
- 对 `.env`、密钥、证书、生产数据、系统目录使用 `deny`。
- `bypassPermissions` 只在临时容器、CI 隔离环境或一次性沙箱中使用。

## 六、CLAUDE.md 与记忆

### 6.1 记忆类型

| 类型 | 位置 | 用途 |
|------|------|------|
| 企业策略 | macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`，Linux `/etc/claude-code/CLAUDE.md`，Windows `C:\ProgramData\ClaudeCode\CLAUDE.md` | 组织级规范 |
| 项目记忆 | `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | 团队共享的项目说明 |
| 用户记忆 | `~/.claude/CLAUDE.md` | 个人跨项目偏好 |
| 本地项目记忆 | `./CLAUDE.local.md` | 已逐步被导入语法替代，不建议新项目依赖 |

Claude Code 启动时会按层级读取 `CLAUDE.md`。更靠近当前目录的内容会提供更具体的项目上下文。

### 6.2 初始化项目记忆

```bash
/init
/memory
```

也可以直接创建 `CLAUDE.md`：

```markdown
# 项目指南

## 常用命令
- `npm run lint`：检查代码风格
- `npm test`：运行测试
- `npm run build`：生产构建

## 代码规范
- 新增公共函数需要补测试
- 修改接口返回结构时同步更新文档
- 不要直接修改生成文件

## 提交前检查
- 运行 `npm test`
- 确认 `git diff` 中没有密钥或临时日志
```

### 6.3 导入其他文件

`CLAUDE.md` 支持使用 `@path/to/file` 导入其他文件：

```markdown
请阅读 @README.md 了解项目概览。
后端接口规范见 @docs/api.md。
个人本地偏好见 @~/.claude/my-project-notes.md。
```

### 6.4 Auto-memory

较新版本的 Claude Code 支持 auto-memory。它会在本机项目目录下维护 `MEMORY.md` 和相关主题文件，用于保存会话中可复用的信息。使用 `/memory` 可以查看、编辑或关闭相关功能。

## 七、MCP 扩展

MCP（Model Context Protocol）用于把外部工具和数据源接入 Claude Code。常见用途：

| 服务 | 用途 |
|------|------|
| GitHub | PR、Issue、仓库信息 |
| Figma | 读取设计稿 |
| Playwright / Chrome | 浏览器自动化与页面测试 |
| PostgreSQL / MySQL | 查询开发数据库 |
| Sentry | 读取错误日志 |
| Context7 | 获取第三方库文档 |

常用命令：

```bash
claude mcp
/mcp
```

项目级 MCP 通常放在 `.mcp.json`，用户级和本地状态会写入 `~/.claude.json`。团队共享 MCP 时要注意不要把 token 写进仓库，优先使用环境变量。

示例：

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

## 八、Hooks 自动化

Hooks 是确定性的生命周期脚本，适合做格式化、通知、阻断危险操作、审计配置变化等事情。

### 8.1 常见事件

| 事件 | 触发时机 |
|------|----------|
| `SessionStart` | 会话开始、恢复或压缩后 |
| `UserPromptSubmit` | 用户提交提示后、Claude 处理前 |
| `PreToolUse` | 工具执行前，可阻断 |
| `PermissionRequest` | 权限弹窗出现前 |
| `PostToolUse` | 工具成功执行后 |
| `PostToolUseFailure` | 工具执行失败后 |
| `Notification` | Claude 等待输入或权限确认时 |
| `ConfigChange` | 配置文件变化时 |
| `Stop` | 会话停止时 |

### 8.2 编辑后自动格式化

`.claude/settings.json`：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

### 8.3 阻止修改敏感文件

`.claude/hooks/protect-files.sh`：

```bash
#!/bin/bash

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

case "$FILE_PATH" in
  *.env|*.env.*|*secrets/*|*.pem)
    echo "Blocked protected file: $FILE_PATH" >&2
    exit 2
    ;;
esac

exit 0
```

注册 Hook：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect-files.sh"
          }
        ]
      }
    ]
  }
}
```

### 8.4 通知提醒

macOS 示例：

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt|idle_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code needs your attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

## 九、常见工作流

### 9.1 理解新项目

```text
请先阅读 README、package.json 和主要目录，输出：
1. 技术栈
2. 启动和测试命令
3. 核心模块职责
4. 你建议写入 CLAUDE.md 的项目规则
```

### 9.2 修复 Bug

```text
用户登录偶尔失败。相关日志在 logs/error.log。
请先定位可能原因，不要直接修改代码；给出验证方案后再实施最小改动。
```

### 9.3 重构代码

```text
重构 src/services/UserService.ts。
目标：
1. 拆分过长方法
2. 保持对外 API 不变
3. 补充或更新测试
4. 完成后运行 npm test
```

### 9.4 代码审查

```bash
/diff
/code-review high
/security-review
```

也可以直接提示：

```text
请审查当前 git diff，优先找 correctness bug、边界条件、安全风险和缺失测试，不要修改文件。
```

### 9.5 文档生成

```text
为 src/api 下的接口生成 Markdown 文档。
要求包含：
1. 路由和方法
2. 请求参数
3. 响应示例
4. 错误码
```

### 9.6 使用 worktree 隔离大改动

```bash
claude --worktree feature-auth "在隔离工作树中实现登录重构"
```

或者手动：

```bash
git worktree add ../feature-auth -b feature-auth
cd ../feature-auth
claude
```

## 十、最佳实践

### 10.1 提示词结构

推荐包含四类信息：

```text
目标：要完成什么改动。
上下文：相关文件、日志、报错、设计约束。
限制：不要改哪些文件、保持哪些 API、使用哪些命令。
完成标准：测试通过、构建通过、文档更新、diff 可审查。
```

### 10.2 团队共享

- 将 `CLAUDE.md` 和 `.claude/settings.json` 中适合团队共享的规则提交到仓库。
- 将 `.claude/settings.local.json`、本地 token、个人路径、临时配置加入 `.gitignore`。
- 为常用命令写清楚前置条件，例如测试数据库、环境变量、构建缓存。
- Hooks 先从低风险任务开始，如格式化和通知；阻断类 Hook 要给出明确错误信息。

### 10.3 安全建议

- 在 Git 仓库中使用 Claude Code，方便通过 `git diff` 审查和回滚。
- 不要让 Claude 自动读取或提交 `.env`、密钥、证书、生产数据。
- 不要在公共仓库 CI 中直接暴露长期 API Key。
- 对部署、数据库写入、删除文件、权限变更、依赖安装使用显式确认。
- 大型重构优先使用 `plan` 模式或 worktree。

## 十一、故障排除

| 问题 | 排查方式 |
|------|----------|
| 命令不存在 | 检查安装路径，运行 `claude --version` |
| 登录失败 | 运行 `claude auth status`，必要时重新 `claude auth login` |
| 配置不生效 | 运行 `/status`、`/config` 或检查 settings 作用域优先级 |
| 权限频繁弹窗 | 用 `/permissions` 添加窄范围 allow 规则 |
| Claude 忽略项目规范 | 检查 `CLAUDE.md` 是否在当前目录链路中，运行 `/memory` |
| Hook 不执行 | 运行 `/hooks` 检查是否注册，确认脚本可执行且 JSON 有效 |
| 上下文过长 | 使用 `/compact`，或 `/clear` 开新会话 |
| 改动不可控 | 使用 `git diff`、`/diff`，必要时回滚工作区改动 |

重置配置前先备份：

```bash
cp ~/.claude/settings.json ~/.claude/settings.json.bak
```

谨慎清理本地项目状态：

```bash
claude project purge --dry-run
```

## 十二、参考资料

- Claude Code 官方安装文档：https://code.claude.com/docs/en/setup
- Claude Code CLI Reference：https://code.claude.com/docs/en/cli-usage
- Claude Code Settings：https://code.claude.com/docs/en/configuration
- Claude Code Commands：https://code.claude.com/docs/en/commands
- Claude Code Memory：https://code.claude.com/docs/en/memory
- Claude Code Hooks：https://code.claude.com/docs/en/hooks-guide
