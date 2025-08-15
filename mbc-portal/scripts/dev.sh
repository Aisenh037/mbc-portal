#!/usr/bin/env bash
set -euo pipefail
(cd backend && npm run dev) &
(cd frontend && npm run dev) &
wait
