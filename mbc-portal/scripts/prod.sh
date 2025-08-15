#!/usr/bin/env bash
set -euo pipefail
(
	cd "$(dirname "$0")/../frontend" && npm run build
)
(
	cd "$(dirname "$0")/../backend" && npm run start
)