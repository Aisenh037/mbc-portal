#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../services/analytics"
if [[ -d .venv ]]; then
	. .venv/bin/activate
fi
if ! command -v uvicorn >/dev/null 2>&1; then
	echo "Install FastAPI deps: python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt"
	exit 1
fi
uvicorn main:app --host 0.0.0.0 --port 8000