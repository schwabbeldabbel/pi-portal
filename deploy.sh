#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="pi-portal-api"
REPO_DIR="$HOME/pi-portal"
WEB_DIST="$REPO_DIR/dist/web/browser"
API_ENTRY="$REPO_DIR/dist/api/main.js"
WEB_ROOT="/var/www/pi-portal"

echo "==> Wechsel ins Repo"
cd "$REPO_DIR"

echo "==> Hole neuesten Stand"
git pull

echo "==> Installiere Abhängigkeiten"
npm ci

echo "==> Baue Frontend"
npx nx build web

echo "==> Baue Backend"
npx nx build api

echo "==> Prüfe Build-Artefakte"
test -f "$WEB_DIST/index.html"
test -f "$API_ENTRY"

echo "==> Deploye Frontend nach $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo rm -rf "$WEB_ROOT"/*
sudo cp -r "$WEB_DIST"/* "$WEB_ROOT"/

echo "==> Starte oder restarte Backend mit PM2"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME"
else
  pm2 start "$API_ENTRY" --name "$APP_NAME"
fi

echo "==> Speichere PM2 Prozessliste"
pm2 save

echo "==> Prüfe Nginx-Konfiguration"
sudo nginx -t

echo "==> Lade Nginx neu"
sudo systemctl reload nginx

echo "==> Deployment abgeschlossen"
echo "Frontend: http://$(hostname -I | awk '{print $1}')"
