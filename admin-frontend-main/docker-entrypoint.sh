#!/bin/sh
set -e

TARGET_DIR="/usr/share/nginx/html"
NORMALIZED_BASENAME=$(echo "$BASENAME" | sed 's:/*$::')
DEST_DIR="${TARGET_DIR}${NORMALIZED_BASENAME}"

# If running in STANDALONE mode and BASENAME is not root
# STANDALONE mode is when the application is not running behind a reverse proxy - the Nginx serves the static files directly
if [ "$STANDALONE" = "true" ] && [ -n "$NORMALIZED_BASENAME" ] && [ "$NORMALIZED_BASENAME" != "/" ]; then
  echo "[entrypoint] STANDALONE mode detected. Copying static files to $DEST_DIR..."
  mkdir -p "$DEST_DIR"
  find "$TARGET_DIR" -mindepth 1 -maxdepth 1 ! -name "$(basename "$DEST_DIR")" -exec cp -r {} "$DEST_DIR/" \;
  TARGET_DIR="$DEST_DIR"
else
echo "[entrypoint] Skipping static file copy: either STANDALONE is not enabled or BASENAME is empty or '/'."
fi

# Inject environment variables into env-config.js
echo "[entrypoint] Injecting environment values into $TARGET_DIR/env-config.js"
sed -i 's~CONFIGURATION_API_URL: "null"~CONFIGURATION_API_URL: "'${CONFIGURATION_API_URL}'"~g' "$TARGET_DIR/env-config.js"
sed -i 's~KEYCLOAK_URL: "null"~KEYCLOAK_URL: "'${KEYCLOAK_URL}'"~g' "$TARGET_DIR/env-config.js"
sed -i 's~TENANT: "null"~TENANT: "'${TENANT}'"~g' "$TARGET_DIR/env-config.js"
sed -i 's~BACKEND_URL: "null"~BACKEND_URL: "'${BACKEND_URL}'"~g' "$TARGET_DIR/env-config.js"
sed -i 's~SENTRY_DSN: "null"~SENTRY_DSN: "'${SENTRY_DSN}'"~g' "$TARGET_DIR/env-config.js"
sed -i 's~BASENAME: "null"~BASENAME: "'${BASENAME}'"~g' "$TARGET_DIR/env-config.js"
sed -i 's~DD_APP_ID: "null"~DD_APP_ID: "'${DD_APP_ID}'"~g' "$TARGET_DIR/env-config.js"
sed -i 's~DD_CLIENT_TOKEN: "null"~DD_CLIENT_TOKEN: "'${DD_CLIENT_TOKEN}'"~g' "$TARGET_DIR/env-config.js"

exec "$@"
