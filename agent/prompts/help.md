---
description: 显示当前自定义命令及用途
argument-hint: "[topic]"
---

请显示当前可用的用户自定义命令帮助。

范围参数：${@:-commands}

要求：
- 默认只展示用户自定义命令，不展示 pi 内置命令。
- 读取 Pi 用户配置目录下的 `prompts/`（默认 `~/.pi/agent/prompts/`，或 `$PI_CODING_AGENT_DIR/prompts/`）中的 prompt template 文件，提取文件名、frontmatter 中的 `description`、`argument-hint`，并结合正文简短说明用途。
- 输出要简短清晰，适合日常查询；每个命令包含：命令名、用途、参数格式、常见示例。
- 当前应至少包含 `/promote`、`/push`、`/help`。
- 如果用户在 `/help` 后面带了参数，例如 `/help push`，只展示匹配命令或主题的详细说明。
- 如果未来存在 skills、extensions、项目脚本等更多自定义能力，只有当范围参数明确要求时才展示，例如 `skills`、`extensions`、`all`。
- 不要执行命令本身，只做说明。
