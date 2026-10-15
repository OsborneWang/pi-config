# 个人 Pi 配置

这个仓库用于同步当前机器上 Pi 的可迁移配置，方便在其他电脑快速恢复同样的使用习惯。

仓库包含：

- 用户级 `settings.json`、快捷键和 sidebar 配置
- `pi-sidebar-tui` 响应式宽度补丁（侧栏随窗格缩放、过窄自动隐藏）
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

## 响应式 sidebar（本地补丁）

`agent/sidebar-tui.json` 使用了上游 `pi-sidebar-tui` 1.7.8 还不支持的字段：

| 字段 | 含义 | 当前值 |
| --- | --- | --- |
| `autoWidth` | 侧栏宽度随终端宽度缩放，过窄时自动隐藏 | `true` |
| `widthRatio` | 目标宽度占终端列数的比例（0.15–0.5） | `0.35` |
| `hideBelow` | 终端窄于此列数时完全隐藏侧栏（40–200） | `70` |
| `minMainWidth` | 主区域至少保留的列数（20–200） | `45` |
| `width` | 自动模式下的宽度上限；手动模式下的固定宽度 | `45` |

要让这些字段生效，需要把 `agent/patches/pi-sidebar-tui-responsive-width.patch` 应用到已安装的扩展上。`bootstrap.sh` 会在 `pi update --extensions` 之后自动尝试应用；如果上游版本变化导致失败，只打印警告并回退到固定宽度。

手动应用或回滚：

```bash
EXT="${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/npm/node_modules/pi-sidebar-tui"
patch -p1 -d "$EXT" < agent/patches/pi-sidebar-tui-responsive-width.patch   # 应用
patch -p1 -R -d "$EXT" < agent/patches/pi-sidebar-tui-responsive-width.patch # 回滚
```

已运行的会话里可以用命令即时调整（会写回 `sidebar-tui.json`）：

```
/sidebar-tui auto on|off      # 开关自动宽度
/sidebar-tui ratio <0.15-0.5> # 宽度比例
/sidebar-tui hidebelow <40-200>
/sidebar-tui minmain <20-200>
/sidebar-tui width <10-120>   # 自动模式下是上限
```

参考宽度曲线（`ratio=0.35`、`minMainWidth=45`、`hideBelow=70`）：终端 200/120/90/81/70 列时，侧栏分别为 45/42/31/28/25 列，69 列及以下隐藏。

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
