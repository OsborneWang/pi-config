#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$ROOT/agent"
AGENT_DIR="${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}"
BACKUP_DIR="$AGENT_DIR/backups/pi-config-$(date +%Y%m%d%H%M%S)"

if ! command -v pi >/dev/null 2>&1; then
  echo "pi is not installed or not on PATH. Install it first:" >&2
  echo "  curl -fsSL https://pi.dev/install.sh | sh" >&2
  exit 1
fi

backup_path() {
  local path="$1"
  if [ -e "$AGENT_DIR/$path" ]; then
    mkdir -p "$BACKUP_DIR/$(dirname "$path")"
    cp -R "$AGENT_DIR/$path" "$BACKUP_DIR/$path"
  fi
}

install_file() {
  local path="$1"
  backup_path "$path"
  mkdir -p "$AGENT_DIR/$(dirname "$path")"
  cp "$SOURCE_DIR/$path" "$AGENT_DIR/$path"
}

install_dir() {
  local path="$1"
  backup_path "$path"
  rm -rf "$AGENT_DIR/$path"
  mkdir -p "$AGENT_DIR/$(dirname "$path")"
  cp -R "$SOURCE_DIR/$path" "$AGENT_DIR/$path"
}

mkdir -p "$AGENT_DIR"

install_file settings.json
install_file keybindings.json
install_file models.json
install_file sidebar-tui.json
install_dir extensions
install_dir prompts

pi update --extensions

cat <<EOF
Pi config installed to: $AGENT_DIR
Backup directory: $BACKUP_DIR

Set these model API key variables on this machine before using custom providers:
  PI_MODEL_API_KEY_NT
  PI_MODEL_API_KEY_ZLY
  PI_MODEL_API_KEY_WORKBUDDY_SELF
  PI_MODEL_API_KEY_STEPFUN

Then start Pi with:
  pi
EOF
