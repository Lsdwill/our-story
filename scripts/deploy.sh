#!/usr/bin/env bash
set -euo pipefail

SERVER_HOST="${SERVER_HOST:-24.233.2.106}"
SERVER_PORT="${SERVER_PORT:-13608}"
SERVER_USER="${SERVER_USER:-root}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/mathai-love}"
REMOTE_NGINX_SITE="${REMOTE_NGINX_SITE:-/etc/nginx/sites-enabled/mathai.tech}"
REMOTE_NGINX_CONF="${REMOTE_NGINX_CONF:-/tmp/mathai.tech.remote.conf}"
DOMAIN="${DOMAIN:-mathai.tech}"

SSH_OPTS=(
  -p "$SERVER_PORT"
  -o StrictHostKeyChecking=accept-new
)

RSYNC_RSH="ssh -p $SERVER_PORT -o StrictHostKeyChecking=accept-new"

echo "==> Building site"
npm run build

echo "==> Creating remote directory: $REMOTE_DIR"
ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" "mkdir -p '$REMOTE_DIR'"

echo "==> Uploading dist/ to $SERVER_USER@$SERVER_HOST:$REMOTE_DIR"
rsync -az --delete -e "$RSYNC_RSH" dist/ "$SERVER_USER@$SERVER_HOST:$REMOTE_DIR/"

echo "==> Uploading Nginx config"
scp -P "$SERVER_PORT" -o StrictHostKeyChecking=accept-new \
  deploy/mathai.tech.remote.conf \
  "$SERVER_USER@$SERVER_HOST:$REMOTE_NGINX_CONF"

echo "==> Installing Nginx config and reloading"
ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" "
  set -e
  if [ -f '$REMOTE_NGINX_SITE' ]; then
    cp '$REMOTE_NGINX_SITE' '$REMOTE_NGINX_SITE.bak-'\"\$(date +%Y%m%d%H%M%S)\"
  fi
  cp '$REMOTE_NGINX_CONF' '$REMOTE_NGINX_SITE'
  nginx -t
  systemctl reload nginx
"

echo "==> Verifying public endpoints"
curl -fsSI --connect-timeout 10 "https://$DOMAIN/love.html" >/dev/null
curl -fsSI --connect-timeout 10 "https://$DOMAIN/photos/beihai/cover.png" >/dev/null
curl -fsSI --connect-timeout 10 "https://$DOMAIN/photos/beihai/cartoon_we.png" >/dev/null

cat <<EOF
==> Deploy complete
Site: https://$DOMAIN/love.html
Remote files: $SERVER_USER@$SERVER_HOST:$REMOTE_DIR
Nginx site: $REMOTE_NGINX_SITE
EOF
