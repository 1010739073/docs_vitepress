---
title: Codex CLI 使用教程
description: OpenAI Codex CLI 的安装、登录、交互模式、非交互模式、配置、权限、MCP、Hooks 与常见开发工作流。
---

# Codex CLI 使用教程

## 一、什么是 Codex CLI

Codex CLI 是 OpenAI 的本地终端 AI 编程代理。它可以在指定工作目录中读取代码、修改文件、运行命令、审查 diff、调用 MCP 工具，并通过沙箱与审批策略控制风险。

它适合这些场景：

| 场景 | 说明 |
|------|------|
| 理解代码库 | 分析目录结构、技术栈、核心模块和潜在风险 |
| 实现功能 | 按项目规则修改代码并运行验证命令 |
| 调试问题 | 读取日志、复现失败、定位根因并提交最小修复 |
| 代码审查 | 对工作区、提交或分支 diff 做本地审查 |
| 自动化 | 使用 `codex exec` 在脚本或 CI 中执行一次性任务 |
| 扩展工具 | 通过 MCP、Hooks、Skills、Plugins 连接外部系统或固化工作流 |

Codex 也有 IDE 扩展、桌面应用、Web/Cloud 等形态。本页聚焦 CLI。

## 二、安装与登录

### 2.1 推荐安装方式

macOS、Linux：

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

无人值守安装：

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=1 sh
```

Windows PowerShell：

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

npm：

```bash
npm install -g @openai/codex
```

Homebrew：

```bash
brew install --cask codex
```

验证：

```bash
codex --version
codex doctor
```

### 2.2 登录方式

首次运行：

```bash
codex
```

Codex 会引导你选择登录方式：

- 使用 ChatGPT 登录：适合 Plus、Pro、Business、Edu、Enterprise 等订阅内的 Codex 使用。
- 使用 API key 登录：适合按 API 用量计费或自动化环境。

常用认证命令：

```bash
codex login
codex login --device-auth
codex logout
```

如果企业环境提供访问 token：

```bash
printenv CODEX_ACCESS_TOKEN | codex login --with-access-token
```

自动化场景可为单次 `codex exec` 设置 `CODEX_API_KEY`，不要把 key 设置为整个 CI job 的全局环境变量，避免被构建脚本、依赖生命周期脚本或仓库代码读取。

## 三、交互模式

### 3.1 启动方式

```bash
codex
codex "解释这个项目的结构"
codex --cd services/api "修复登录失败问题"
codex --model gpt-5.5
codex --search "查询最新依赖升级建议"
```

常用全局参数：

| 参数 | 作用 |
|------|------|
| `--cd, -C` | 设置工作目录 |
| `--model, -m` | 覆盖当前模型 |
| `--profile, -p` | 叠加指定 profile 配置 |
| `--config, -c` | 单次覆盖配置项 |
| `--sandbox, -s` | 设置沙箱模式 |
| `--ask-for-approval, -a` | 设置审批策略 |
| `--add-dir` | 增加可访问目录 |
| `--image, -i` | 附加截图或图片 |
| `--search` | 启用实时 Web 搜索 |
| `--remote` | 连接远程 app-server |

日常开发推荐组合：

```bash
codex --sandbox workspace-write --ask-for-approval on-request
```

### 3.2 会话恢复

```bash
codex resume              # 选择最近会话
codex resume --last       # 恢复当前目录最近一次会话
codex resume --all        # 查看所有目录的会话
codex resume <SESSION_ID> # 恢复指定会话
```

### 3.3 常用快捷操作

- `/status`：查看模型、权限、沙箱、上下文、token 等状态。
- `/diff`：查看 Codex 当前产生的 Git diff。
- `/copy` 或 `Ctrl+O`：复制最近一次完整输出。
- `Ctrl+C` 或 `/exit`：退出当前交互会话。
- `Tab`：在 Codex 执行中排队下一条提示、斜杠命令或 `!` shell 命令。
- `Ctrl+R`：搜索提示历史。

## 四、核心命令

| 命令 | 用途 |
|------|------|
| `codex` | 启动交互式 TUI |
| `codex "prompt"` | 用初始提示启动并执行 |
| `codex resume` | 恢复交互会话 |
| `codex doctor` | 生成本地诊断报告 |
| `codex completion` | 生成 Shell 补全脚本 |
| `codex exec` | 非交互运行 Codex |
| `codex app` | 从终端打开 Codex 桌面应用 |
| `codex mcp` | 管理 MCP 服务器 |
| `codex features` | 查看或切换功能开关 |
| `codex cloud` | 管理或启动 Codex Cloud 任务 |
| `codex apply` | 将 Cloud 任务 diff 应用到本地 |
| `codex update` | 检查或执行 CLI 更新，具体取决于安装方式 |

Shell 补全示例：

```bash
eval "$(codex completion zsh)"
```

## 五、斜杠命令

在 Codex TUI 输入 `/` 可以打开命令列表。常用命令如下：

| 命令 | 用途 |
|------|------|
| `/init` | 生成当前目录的 `AGENTS.md` |
| `/permissions` | 调整审批和权限模式 |
| `/model` | 切换模型和推理设置 |
| `/plan` | 进入计划模式 |
| `/status` | 查看会话配置和资源使用 |
| `/diff` | 查看当前工作区改动 |
| `/review` | 对当前工作区或指定 diff 做审查 |
| `/compact` | 压缩会话上下文 |
| `/clear` | 清空当前对话并开始新上下文 |
| `/mcp` | 查看已配置的 MCP 工具 |
| `/skills` | 选择或查看本地 Skills |
| `/hooks` | 查看生命周期 Hooks |
| `/theme` | 设置 TUI 主题 |
| `/side` 或 `/btw` | 开启临时旁路对话 |
| `/fork` | 从当前会话分叉新线程 |
| `/resume` | 在 TUI 中恢复保存的会话 |
| `/goal` | 设置、查看、暂停或清除任务目标 |
| `/exit` 或 `/quit` | 退出 CLI |

## 六、权限、审批与沙箱

### 6.1 审批策略

| 策略 | 说明 |
|------|------|
| `untrusted` | 更保守，适合不可信仓库 |
| `on-request` | 常用交互模式，必要时请求用户批准 |
| `never` | 不请求批准，适合非交互脚本或隔离环境 |

启动时设置：

```bash
codex --ask-for-approval on-request
codex --ask-for-approval never
```

### 6.2 沙箱模式

| 模式 | 说明 |
|------|------|
| `read-only` | 只读，适合咨询、审查、分析 |
| `workspace-write` | 可写当前工作区，日常开发推荐 |
| `danger-full-access` | 不限制文件系统范围，风险最高 |

启动时设置：

```bash
codex --sandbox read-only
codex --sandbox workspace-write
```

危险选项：

```bash
codex --dangerously-bypass-approvals-and-sandbox
```

只应在外层已经隔离和加固的环境中使用，例如临时容器、一次性 CI runner 或专门沙箱。

### 6.3 推荐组合

| 场景 | 推荐设置 |
|------|----------|
| 阅读代码、做方案 | `--sandbox read-only --ask-for-approval on-request` |
| 日常开发 | `--sandbox workspace-write --ask-for-approval on-request` |
| 非交互只读分析 | `codex exec` 默认只读即可 |
| 非交互自动修复 | `codex exec --sandbox workspace-write --ask-for-approval never` |
| 临时隔离环境 | 按需使用 `danger-full-access`，但不要在主机工作区直接使用 |

## 七、配置文件

### 7.1 配置位置

Codex 使用 TOML 配置：

| 文件 | 作用 |
|------|------|
| `~/.codex/config.toml` | 用户级默认配置 |
| `.codex/config.toml` | 项目级配置，仅在信任项目后加载 |
| `~/.codex/<profile>.config.toml` | Profile 配置，通过 `--profile` 启用 |
| `/etc/codex/config.toml` | Unix 系统级配置 |

优先级从高到低：

1. CLI 参数和 `--config`
2. 项目 `.codex/config.toml`
3. `--profile` 指定的 profile
4. 用户配置
5. 系统配置
6. 内置默认值

### 7.2 基础配置示例

`~/.codex/config.toml`：

```toml
model = "gpt-5.5"
model_reasoning_effort = "high"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
web_search = "cached"

[features]
hooks = true
shell_snapshot = true

[shell_environment_policy]
include_only = ["PATH", "HOME", "LANG", "LC_ALL", "NODE_ENV"]
```

单次覆盖：

```bash
codex -c model_reasoning_effort=\"medium\" "分析当前失败测试"
codex -c log_dir=./.codex-log
```

## 八、AGENTS.md 项目指令

Codex 会在开始工作前读取 `AGENTS.md`。它适合存放长期项目约定，而不是一次性任务要求。

### 8.1 发现顺序

- 全局：`~/.codex/AGENTS.override.md` 优先于 `~/.codex/AGENTS.md`。
- 项目：从 Git 根目录到当前目录逐级查找 `AGENTS.override.md`、`AGENTS.md` 和配置的 fallback 文件名。
- 越靠近当前目录的文件越具体，会覆盖更上层的通用规则。

### 8.2 示例

```markdown
# 仓库指南

## 常用命令
- `npm run lint`：检查代码风格
- `npm test`：运行测试
- `npm run build`：生产构建

## 开发约定
- 修改公共 API 时同步更新文档
- 新增业务逻辑需要补充测试
- 不要提交 `dist`、缓存和本地日志

## 验证要求
- 前端改动运行 `npm run build`
- 后端改动运行相关单元测试
```

初始化：

```bash
/init
```

验证 Codex 是否读取：

```bash
codex --ask-for-approval never "总结当前加载的项目指令"
```

## 九、MCP 配置

MCP 用于给 Codex 接入外部工具和上下文，例如文档、GitHub、Figma、Playwright、Sentry、数据库等。

### 9.1 CLI 添加

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
codex mcp --help
```

在 TUI 内查看：

```text
/mcp
```

### 9.2 config.toml 示例

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]

[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
bearer_token_env_var = "FIGMA_OAUTH_TOKEN"

[mcp_servers.chrome_devtools]
url = "http://localhost:3000/mcp"
enabled_tools = ["open", "screenshot"]
default_tools_approval_mode = "prompt"
startup_timeout_sec = 20
tool_timeout_sec = 45
```

建议：

- token 放在环境变量，不写入仓库。
- 对高风险工具设置 `default_tools_approval_mode = "prompt"`。
- 对 CI 必需 MCP 设置 `required = true`，避免静默降级。

## 十、Hooks

Codex Hooks 可在工具调用、权限请求、压缩、会话开始和停止等事件上运行命令。

常用位置：

- `~/.codex/hooks.json`
- `~/.codex/config.toml`
- `.codex/hooks.json`
- `.codex/config.toml`

### 10.1 hooks.json 示例

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/pre_tool_use_policy.py\"",
            "statusMessage": "Checking Bash command"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/post_tool_use_review.py\"",
            "timeout": 30,
            "statusMessage": "Reviewing Bash output"
          }
        ]
      }
    ]
  }
}
```

### 10.2 TOML 示例

```toml
[[hooks.PreToolUse]]
matcher = "^Bash$"

[[hooks.PreToolUse.hooks]]
type = "command"
command = '/usr/bin/python3 "$(git rev-parse --show-toplevel)/.codex/hooks/pre_tool_use_policy.py"'
timeout = 30
statusMessage = "Checking Bash command"
```

注意：

- 项目级 Hooks 只在信任项目后加载。
- 新增或变更的非托管 Hooks 需要在 `/hooks` 中查看和信任。
- Hook 命令会在会话 `cwd` 下运行，项目 Hook 建议通过 `git rev-parse --show-toplevel` 定位路径。

## 十一、非交互模式 `codex exec`

`codex exec` 适合脚本、CI、定时任务、生成报告和自动化检查。

### 11.1 基础用法

```bash
codex exec "总结仓库结构，并列出 5 个风险点"
```

Codex 会把进度输出到 `stderr`，最终结果输出到 `stdout`，便于管道处理：

```bash
codex exec "生成最近 10 个提交的发布说明" | tee release-notes.md
```

从 stdin 传入上下文：

```bash
npm test 2>&1 \
  | codex exec "总结失败测试，并提出最小修复方案" \
  | tee test-summary.md
```

### 11.2 权限与沙箱

默认 `codex exec` 是只读沙箱。需要修改文件时显式开启：

```bash
codex exec --sandbox workspace-write "修复当前 CI 失败"
```

自动化环境中避免弹窗：

```bash
codex exec --sandbox workspace-write --ask-for-approval never "修复 lint 错误"
```

临时运行且不保存会话记录：

```bash
codex exec --ephemeral "分析这个项目的下一步重构建议"
```

### 11.3 JSON 输出

```bash
codex exec --json "总结仓库结构" | jq
```

只保存最终消息：

```bash
codex exec "生成变更摘要" -o ./summary.md
```

使用 JSON Schema 约束最终输出：

```json
{
  "type": "object",
  "properties": {
    "project_name": { "type": "string" },
    "languages": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["project_name", "languages"],
  "additionalProperties": false
}
```

```bash
codex exec "提取项目元数据" \
  --output-schema ./schema.json \
  -o ./project-metadata.json
```

### 11.4 恢复非交互会话

```bash
codex exec "审查当前改动中的竞态问题"
codex exec resume --last "修复刚才发现的竞态问题"
```

## 十二、常见工作流

### 12.1 新项目上手

```bash
codex "阅读 README、package.json 和主要目录，输出技术栈、启动命令、测试命令和关键模块"
```

### 12.2 先规划再实现

```text
/plan 为支付模块增加退款状态机，保持现有 API 兼容，并说明需要改哪些测试。
```

确认方案后再让 Codex 实施。

### 12.3 修复测试失败

```bash
npm test 2>&1 | codex exec --sandbox workspace-write "定位失败原因并实现最小修复，完成后说明改动"
```

### 12.4 本地审查

```text
/diff
/review
```

或直接：

```bash
codex "审查当前 git diff，优先找 correctness bug、安全问题和缺失测试，不要修改文件"
```

### 12.5 使用图片输入

```bash
codex -i screenshot.png "根据截图定位页面布局问题，并给出修复方案"
```

### 12.6 使用 Cloud 任务

```bash
codex cloud
codex cloud exec --env ENV_ID "梳理当前 open bugs"
codex apply <TASK_ID>
```

## 十三、故障排除

| 问题 | 排查方式 |
|------|----------|
| 命令不存在 | 检查安装路径，运行 `codex --version` |
| 登录失败 | 运行 `codex login` 或 `codex login --device-auth` |
| 配置不生效 | 运行 `/status`、`/debug-config`，检查配置优先级 |
| 项目规则没加载 | 检查 `AGENTS.md` 位置，重新启动 Codex |
| MCP 未出现 | 运行 `codex mcp --help` 和 `/mcp`，检查 `config.toml` |
| Hooks 不执行 | 运行 `/hooks`，确认 Hook 已信任且 matcher 命中 |
| 无法写文件 | 检查 `sandbox_mode`、`--sandbox` 和 writable roots |
| 命令需要联网 | 使用 `on-request` 审批模式，按需批准联网命令 |
| 自动化卡住 | `codex exec` 使用 `--ask-for-approval never` 并提前设置沙箱 |

## 十四、参考资料

- Codex CLI 官方页面：https://developers.openai.com/codex/cli
- Codex CLI Features：https://developers.openai.com/codex/cli/features
- Codex CLI Command Line Options：https://developers.openai.com/codex/cli/reference
- Codex Slash Commands：https://developers.openai.com/codex/cli/slash-commands
- Codex Config Basics：https://developers.openai.com/codex/config-basic
- Codex AGENTS.md：https://developers.openai.com/codex/guides/agents-md
- Codex MCP：https://developers.openai.com/codex/mcp
- Codex Hooks：https://developers.openai.com/codex/hooks
- Codex Non-interactive Mode：https://developers.openai.com/codex/noninteractive
- Codex GitHub 仓库：https://github.com/openai/codex
