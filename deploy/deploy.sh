#!/usr/bin/env bash
# Deploy Elevasi ke Hostinger VPS.
# Jalankan dari root project di server:
#   bash deploy/deploy.sh
#
# Prasyarat: PHP 8.3+, Composer, Node 20+, Redis, Supervisor, PostgreSQL/MySQL.

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

echo "==> [1/9] Pull latest code"
git pull --ff-only

echo "==> [2/9] Composer install"
composer install --no-dev --optimize-autoloader --no-interaction

echo "==> [3/9] NPM install + build (client + SSR)"
npm ci --ignore-scripts
npm run build

echo "==> [4/9] Migrate database"
php artisan migrate --force

echo "==> [5/9] Optimize CMS images (WebP)"
php artisan images:optimize-cms

echo "==> [6/9] Storage link"
php artisan storage:link || true

echo "==> [7/9] Cache config/routes/views"
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache || true
php artisan filament:optimize || true

echo "==> [8/9] Restart Supervisor processes"
sudo supervisorctl restart elevasi-ssr:* || sudo supervisorctl restart elevasi-ssr || true
sudo supervisorctl restart elevasi-worker:* || sudo supervisorctl restart elevasi-worker || true

echo "==> [9/9] Health checks"
php artisan inertia:check-ssr || echo "WARN: SSR belum jalan — cek supervisor / bootstrap/ssr/ssr.js"
php artisan about --only=environment

echo "Deploy selesai."
