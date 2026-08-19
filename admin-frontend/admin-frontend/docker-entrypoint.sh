#!/bin/sh
# Runs before nginx starts — the official nginx image executes every script in
# /docker-entrypoint.d/ and then starts the server itself, so this script only
# writes the file and exits.
#
# This is what makes build-once possible for a Vite SPA: the bundle is
# environment-agnostic, and the environment arrives here, at container start.
#
# Anything written to this file is public — it is served to the browser.
# Never put a secret in it.
set -eu

: "${API_BASE_URL:=}"

cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL}",
  STAGE: "${APP_STAGE:-local}"
};
EOF

echo "[app-config] config.js written (API_BASE_URL=${API_BASE_URL}, stage=${APP_STAGE:-local})"
