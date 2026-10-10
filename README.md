# 个人 Pi 配置

这个仓库用于同步当前机器上 Pi 的可迁移配置，方便在其他电脑快速恢复同样的使用习惯。

仓库包含：

- 用户级 `settings.json`、快捷键和 sidebar 配置
- 自定义模型 provider 配置，真实 API Key 已改为环境变量引用
- 本地 extensions 和 prompt templates
- `settings.json` 中声明的 Pi packages

仓库不会保存登录状态、OAuth token、会话历史、信任状态、日志、缓存或已安装的 `node_modules`。

## 在新电脑安装

如果新电脑还没有安装 Pi，先执行：

```bash
curl -fsSL https://pi.dev/install.sh | sh
```

然后克隆本仓库并执行安装脚本：

```bash
git clone https://github.com/OsborneWang/pi-config.git
cd pi-config
./bootstrap.sh
```

脚本会写入 `${PI_CODING_AGENT_DIR:-~/.pi/agent}`。如果目标位置已有同名配置文件或目录，脚本会先备份到 `~/.pi/agent/backups/` 下，再替换受管配置。

## API Key 环境变量

`agent/models.json` 不提交真实密钥，而是使用环境变量插值。每台机器按需配置：

```bash
export PI_MODEL_API_KEY_NT="..."
export PI_MODEL_API_KEY_ZLY="..."
export PI_MODEL_API_KEY_WORKBUDDY_SELF="..."
export PI_MODEL_API_KEY_STEPFUN="..."
```

建议把这些值放在本机私有 shell 配置、密码管理器或系统密钥管理工具中，不要提交到这个仓库。

## 更新本仓库

从当前机器的 Pi 用户目录复制稳定配置后，提交前必须重新检查 `agent/models.json` 是否已经脱敏。

不要复制或提交这些内容：

- `auth.json`
- `mcp-auth.json`
- `sessions/`
- `trust.json`
- `crashes.json`
- `models-store.json`
- `npm/`
- `bin/`

手动修改配置后，已运行的 Pi 会话里可以执行 `/reload` 使改动生效。
