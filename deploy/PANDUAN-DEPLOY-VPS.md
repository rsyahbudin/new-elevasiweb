# Panduan Deploy Elevasi ke VPS (Hostinger)

Panduan langkah demi langkah untuk men-deploy **Elevasi Design & Build** (Laravel + Inertia + React SSR) ke VPS Hostinger Anda.

> **Ringkasan:** pakai **VPS**, bukan shared hosting. Stack ini butuh PHP-FPM, Redis, Supervisor, Node.js, dan proses SSR yang jalan terus-menerus.

---

## Daftar isi

1. [Yang Anda butuhkan](#1-yang-anda-butuhkan)
2. [Persiapan VPS (sekali jalan)](#2-persiapan-vps-sekali-jalan)
3. [Clone project & konfigurasi `.env`](#3-clone-project--konfigurasi-env)
4. [Database](#4-database)
5. [Deploy pertama](#5-deploy-pertama)
6. [Nginx + HTTPS (SSL)](#6-nginx--https-ssl)
7. [Supervisor (SSR + Queue)](#7-supervisor-ssr--queue)
8. [Domain & DNS](#8-domain--dns)
9. [Setelah live (CMS & admin)](#9-setelah-live-cms--admin)
10. [Deploy berikutnya](#10-deploy-berikutnya)
11. [Deploy otomatis (GitHub Actions)](#11-deploy-otomatis-github-actions)
12. [Troubleshooting](#12-troubleshooting)
13. [Checklist cepat](#13-checklist-cepat)

---

## 1. Yang Anda butuhkan

| Item | Keterangan |
|---|---|
| **VPS Hostinger** | Minimal 2 vCPU / 4 GB RAM disarankan (SSR + build butuh memori) |
| **Domain** | Contoh: `elevasidesignbuild.com` |
| **Akses SSH** | Root atau user dengan sudo |
| **Repo Git** | GitHub / GitLab tempat kode Elevasi disimpan |
| **Database** | PostgreSQL (disarankan, sama seperti lokal) atau MySQL |

### File bantu di repo ini

| File | Fungsi |
|---|---|
| `deploy/deploy.sh` | Script deploy otomatis (pull, build, migrate, cache, restart) |
| `deploy/nginx/elevasi.conf` | Contoh konfigurasi Nginx |
| `deploy/supervisor/elevasi-ssr.conf` | Proses Inertia SSR |
| `deploy/supervisor/elevasi-worker.conf` | Queue worker (email + konversi gambar) |
| `.env.example` | Template environment production |

---

## 2. Persiapan VPS (sekali jalan)

Login ke VPS via SSH:

```bash
ssh root@IP_VPS_ANDA
# atau
ssh u123456789@IP_VPS_ANDA
```

### 2.1 Update sistem

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Install paket dasar

```bash
sudo apt install -y git curl unzip nginx redis-server supervisor
```

### 2.3 Install PHP 8.3+ dan ekstensi

```bash
sudo apt install -y php8.3-fpm php8.3-cli php8.3-pgsql php8.3-mysql \
  php8.3-redis php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip \
  php8.3-bcmath php8.3-gd php8.3-intl
```

> Jika VPS Anda memakai PHP 8.4, ganti `php8.3` → `php8.4` di semua perintah dan file config.

### 2.4 Install Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer --version
```

### 2.5 Install Node.js 20+

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # harus v20+
npm -v
```

### 2.6 Install PostgreSQL (disarankan)

```bash
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE USER elevasi WITH PASSWORD 'GANTI_PASSWORD_KUAT';"
sudo -u postgres psql -c "CREATE DATABASE elevasi OWNER elevasi;"
```

Ganti `GANTI_PASSWORD_KUAT` dengan password database Anda.

### 2.7 Pastikan Redis jalan

```bash
sudo systemctl enable redis-server
sudo systemctl start redis-server
redis-cli ping   # harus balas: PONG
```

---

## 3. Clone project & konfigurasi `.env`

### 3.1 Buat folder aplikasi

Contoh path Hostinger (sesuaikan dengan user VPS Anda):

```bash
sudo mkdir -p /home/u123456789/domains/elevasidesignbuild.com
cd /home/u123456789/domains/elevasidesignbuild.com
```

### 3.2 Clone dari Git

```bash
git clone https://github.com/USERNAME/elevasi.git public_html
cd public_html
```

Ganti URL repo dengan repo Anda yang sebenarnya.

### 3.3 Copy & edit `.env`

```bash
cp .env.example .env
php artisan key:generate
nano .env
```

Isi minimal untuk **production**:

```env
APP_NAME="Elevasi Design & Build"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://elevasidesignbuild.com

APP_LOCALE=id
APP_FALLBACK_LOCALE=id

LOG_CHANNEL=stack
LOG_LEVEL=error

# Database — sesuaikan jika pakai MySQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=elevasi
DB_USERNAME=elevasi
DB_PASSWORD=GANTI_PASSWORD_KUAT

# Redis (wajib untuk session, cache, queue)
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

SESSION_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis

FILESYSTEM_DISK=public

# Mail — isi SMTP Hostinger / Resend / dll
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=hello@elevasidesignbuild.com
MAIL_PASSWORD=password_email_anda
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@elevasidesignbuild.com"
MAIL_FROM_NAME="${APP_NAME}"

# Google Analytics (opsional — bisa juga diisi lewat CMS)
# GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Inertia SSR — wajib untuk SEO & performa
INERTIA_SSR_ENABLED=true
INERTIA_SSR_URL=http://127.0.0.1:13714
INERTIA_SSR_ENSURE_BUNDLE_EXISTS=true
```

Simpan file (`Ctrl+O`, `Enter`, `Ctrl+X` di nano).

### 3.4 Permission folder storage

```bash
sudo chown -R $USER:www-data storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache
```

---

## 4. Database

Jalankan migrasi (pertama kali):

```bash
php artisan migrate --force
```

Opsional — seed data awal:

```bash
php artisan db:seed --force
```

---

## 5. Deploy pertama

Dari folder root project (`public_html`):

```bash
chmod +x deploy/deploy.sh
bash deploy/deploy.sh
```

Script ini otomatis menjalankan:

1. `git pull`
2. `composer install --no-dev`
3. `npm ci` + `npm run build` (frontend + SSR bundle)
4. `php artisan migrate`
5. `php artisan images:optimize-cms` (WebP untuk gambar CMS)
6. `php artisan storage:link`
7. Cache config / route / view
8. Restart Supervisor (SSR + worker)
9. Health check SSR

> **Catatan:** pada deploy **pertama**, Supervisor belum dikonfigurasi (langkah 7). Itu normal — lanjut ke langkah Nginx dan Supervisor dulu, lalu jalankan ulang `bash deploy/deploy.sh`.

---

## 6. Nginx + HTTPS (SSL)

### 6.1 Salin config Nginx

```bash
sudo cp deploy/nginx/elevasi.conf /etc/nginx/sites-available/elevasi
sudo nano /etc/nginx/sites-available/elevasi
```

**Sesuaikan minimal 3 hal ini:**

1. `server_name` → domain Anda
2. `root` → path ke folder **`public/`** Laravel, contoh:
   ```
   /home/u123456789/domains/elevasidesignbuild.com/public_html/public
   ```
3. `fastcgi_pass` → socket PHP-FPM yang benar, contoh:
   ```
   fastcgi_pass unix:/run/php/php8.3-fpm.sock;
   ```

Enable site:

```bash
sudo ln -sf /etc/nginx/sites-available/elevasi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6.2 Install SSL dengan Certbot (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d elevasidesignbuild.com -d www.elevasidesignbuild.com
```

Certbot akan mengisi blok `ssl_certificate` di config Nginx secara otomatis.

Setelah SSL aktif, pastikan `APP_URL` di `.env` sudah `https://...`, lalu:

```bash
php artisan config:cache
```

---

## 7. Supervisor (SSR + Queue)

Supervisor menjaga 2 proses penting:

| Proses | Fungsi |
|---|---|
| `elevasi-ssr` | Inertia SSR — HTML awal ter-render di server (SEO + LCP) |
| `elevasi-worker` | Queue — email inquiry + konversi gambar proyek ke WebP |

### 7.1 Edit path di file config

Buka dan ganti semua `uXXXXX` + path domain dengan path VPS Anda:

```bash
nano deploy/supervisor/elevasi-ssr.conf
nano deploy/supervisor/elevasi-worker.conf
```

Contoh yang harus disesuaikan:

- `user=u123456789`
- `directory=/home/u123456789/domains/elevasidesignbuild.com/public_html`
- `command=php /home/u123456789/.../artisan ...`
- `stdout_logfile=/home/u123456789/.../storage/logs/ssr.log`

### 7.2 Install ke Supervisor

```bash
sudo cp deploy/supervisor/elevasi-ssr.conf /etc/supervisor/conf.d/
sudo cp deploy/supervisor/elevasi-worker.conf /etc/supervisor/conf.d/
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start elevasi-ssr:*
sudo supervisorctl start elevasi-worker:*
sudo supervisorctl status
```

Output yang diharapkan:

```
elevasi-ssr                       RUNNING
elevasi-worker:elevasi-worker_00  RUNNING
```

### 7.3 Verifikasi SSR

```bash
php artisan inertia:check-ssr
```

Harus menampilkan: **Inertia SSR is running.**

Cek juga HTML halaman:

```bash
curl -s https://elevasidesignbuild.com | head -40
```

HTML harus sudah berisi teks konten (bukan hanya `<div id="app"></div>` kosong).

---

## 8. Domain & DNS

Di panel DNS domain (Hostinger / Cloudflare / dll):

| Type | Name | Value |
|---|---|---|
| A | `@` | IP VPS Anda |
| A | `www` | IP VPS Anda |

Tunggu propagasi DNS (5 menit – 48 jam). Cek:

```bash
dig elevasidesignbuild.com +short
```

Pastikan browser menampilkan **HTTPS hijau** (gembok).

---

## 9. Setelah live (CMS & admin)

### 9.1 Buat user admin Filament

```bash
php artisan make:filament-user
```

Login admin: `https://elevasidesignbuild.com/kelola`

### 9.2 Isi konten di CMS

Buka **Pengaturan Situs** (`/kelola`) dan lengkapi:

- [ ] Nomor WhatsApp bisnis (format internasional tanpa `+`, contoh `6281234567890`)
- [ ] Foto hero beranda (min. 2400×1400 px)
- [ ] Alamat, Instagram, email
- [ ] Teks footer & CTA
- [ ] Google Analytics Measurement ID (opsional)

### 9.3 Upload proyek

Di `/kelola` → **Projects**:

- Upload cover + galeri (JPG/PNG asli — sistem otomatis buat WebP)
- Publish proyek yang ingin tampil di beranda / halaman proyek

### 9.4 Optimasi gambar CMS

Otomatis saat simpan di CMS. Untuk gambar yang sudah ada sebelum deploy:

```bash
php artisan images:optimize-cms
```

### 9.5 Tes fungsional

- [ ] Beranda terbuka + splash screen (refresh)
- [ ] Halaman `/proyek` dan detail proyek
- [ ] Tombol WhatsApp (dialog inquiry)
- [ ] Ganti bahasa ID / EN
- [ ] Form kontak → redirect ke WhatsApp
- [ ] Admin `/kelola` bisa login

---

## 10. Deploy berikutnya

Setiap ada update kode dari Git, SSH ke VPS lalu:

```bash
cd /home/u123456789/domains/elevasidesignbuild.com/public_html
bash deploy/deploy.sh
```

Itu saja. Script akan pull, build, migrate, optimize gambar, cache, dan restart proses.

### Deploy manual (jika perlu)

```bash
git pull --ff-only
composer install --no-dev --optimize-autoloader
npm ci --ignore-scripts && npm run build
php artisan migrate --force
php artisan images:optimize-cms
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo supervisorctl restart elevasi-ssr:* elevasi-worker:*
php artisan inertia:check-ssr
```

---

## 11. Deploy otomatis (GitHub Actions)

**Disarankan** setelah setup VPS selesai — setiap push ke `main`, deploy jalan otomatis tanpa SSH manual.

Panduan lengkap: **[`deploy/GITHUB-ACTIONS.md`](./GITHUB-ACTIONS.md)**

### Ringkasan setup (sekali)

1. Buat SSH key → public key ke VPS, private key ke **GitHub Secrets**
2. VPS: izinkan `sudo supervisorctl` tanpa password
3. VPS: deploy key agar `git pull` jalan (repo private)
4. Isi secrets: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `DEPLOY_PATH`

### Setelah setup

```
Push / merge ke main → GitHub Actions deploy otomatis → selesai
```

Cek status di tab **Actions** di GitHub repo Anda.

Deploy manual (`bash deploy/deploy.sh`) tetap bisa dipakai kapan saja.

---

## 12. Troubleshooting

### Situs blank putih / error 500

```bash
tail -50 storage/logs/laravel.log
```

Penyebab umum:
- `APP_KEY` kosong → `php artisan key:generate`
- Permission `storage/` → `chmod -R ug+rwx storage bootstrap/cache`
- `.env` salah → cek `DB_*`, `REDIS_*`, `APP_URL`

### SSR tidak jalan

```bash
sudo supervisorctl status
tail -50 storage/logs/ssr.log
php artisan inertia:check-ssr
```

Pastikan:
- `npm run build` sudah jalan (ada file `bootstrap/ssr/ssr.js`)
- `INERTIA_SSR_ENABLED=true`
- Proses `elevasi-ssr` status **RUNNING**

Restart:

```bash
sudo supervisorctl restart elevasi-ssr:*
```

### Gambar tidak muncul

```bash
php artisan storage:link
ls -la public/storage
```

Pastikan `FILESYSTEM_DISK=public` dan folder `storage/app/public` bisa diakses.

### Queue / email tidak terkirim

```bash
sudo supervisorctl status elevasi-worker:*
tail -50 storage/logs/worker.log
```

Pastikan `QUEUE_CONNECTION=redis` dan worker **RUNNING**.

### CSS/JS lama setelah deploy

```bash
npm run build
php artisan view:clear
php artisan config:cache
```

Hard refresh browser (`Ctrl+Shift+R`).

### Permission denied saat `deploy.sh`

```bash
chmod +x deploy/deploy.sh
```

Untuk `sudo supervisorctl`, user Anda harus punya akses sudo tanpa password untuk supervisor, atau jalankan perintah restart secara manual.

---

## 13. Checklist cepat

### Setup awal (sekali)

- [ ] VPS + SSH
- [ ] PHP 8.3+, Composer, Node 20+, Nginx, Redis, PostgreSQL, Supervisor
- [ ] Clone repo ke VPS
- [ ] `.env` production lengkap
- [ ] `php artisan key:generate`
- [ ] `php artisan migrate --force`
- [ ] Nginx → root ke `public/`
- [ ] SSL Certbot aktif
- [ ] Supervisor SSR + worker RUNNING
- [ ] DNS A record ke IP VPS
- [ ] `php artisan make:filament-user`
- [ ] Isi CMS + upload proyek

### Setiap update kode

**Opsi A — otomatis (disarankan):** push ke `main` → GitHub Actions deploy sendiri.

**Opsi B — manual:**

```bash
cd /path/ke/public_html
bash deploy/deploy.sh
```

---

## Referensi

- Detail teknis singkat: [`deploy/README.md`](./README.md)
- Environment template: [`.env.example`](../.env.example)
- PRD produk: [`prdelevasicompanyprofilev1.md`](../prdelevasicompanyprofilev1.md)

---

**Butuh bantuan?** Cek log di `storage/logs/laravel.log`, `storage/logs/ssr.log`, dan `storage/logs/worker.log` — hampir semua masalah deploy terlihat di sana.
