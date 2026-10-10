# Personal Pi Config

This repository stores the portable parts of the local Pi setup:

- user settings, keybindings, and sidebar config
- custom model provider definitions with API keys moved to environment variables
- local extensions and prompt templates
- Pi package declarations from `settings.json`

It intentionally does not store login state, OAuth tokens, sessions, trust state, logs, caches, or installed `node_modules`.

## Install On A New Machine

Install Pi first if needed:

```bash
curl -fsSL https://pi.dev/install.sh | sh
```

Clone this private repository and run the bootstrap script:

```bash
git clone git@github.com:<owner>/<repo>.git pi-config
cd pi-config
./bootstrap.sh
```

The script writes to `${PI_CODING_AGENT_DIR:-~/.pi/agent}` and backs up existing managed files under `~/.pi/agent/backups/` before replacing them.

## Required API Key Variables

`agent/models.json` uses environment interpolation instead of committed secrets. Configure the keys you need on each machine:

```bash
export PI_MODEL_API_KEY_NT="..."
export PI_MODEL_API_KEY_ZLY="..."
export PI_MODEL_API_KEY_WORKBUDDY_SELF="..."
export PI_MODEL_API_KEY_STEPFUN="..."
```

Keep those values in your shell's private local config, password manager, or machine-specific secret manager. Do not commit them to this repository.

## Update This Repository From Current Machine

Copy stable config from the current Pi agent directory, then re-sanitize `agent/models.json` before committing. Do not copy `auth.json`, `mcp-auth.json`, `sessions/`, `trust.json`, `crashes.json`, `models-store.json`, `npm/`, or `bin/`.

After editing files manually, run Pi and use `/reload` to apply changes in an active session.
