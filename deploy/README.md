# Deploy Elevasi Design & Build (Hostinger VPS)

## VPS vs shared Hostinger?

| | **VPS Hostinger** (disarankan) | **Shared hosting Hostinger** |
|---|---|---|
| Laravel + Inertia + Redis | Ya | Terbatas / sering bermasalah |
| Supervisor (SSR + queue) | Ya | Biasanya tidak |
| Node SSR process | Ya | Tidak praktis |
| PostgreSQL / custom PHP | Ya | Terbatas |
| **Rekomendasi** | **Pakai ini** | Jangan untuk stack ini |

**Kesimpulan:** pakai **VPS**. Shared hosting cocok untuk WordPress, bukan Laravel + React SSR + Redis + Supervisor. Domain `elevasidesignbuild.com` tinggal diarahkan nameserver/A record ke IP VPS.

---

## Yang disiapkan di repo ini

| File | Fungsi |
|---|---|
| `config/inertia.php` | Toggle SSR via env |
| `deploy/supervisor/elevasi-ssr.conf` | Jaga proses `inertia:start-ssr` |
| `deploy/supervisor/elevasi-worker.conf` | Queue worker Redis (email + konversi gambar) |
| `deploy/nginx/elevasi.conf` | Contoh Nginx ke `public/` |
| `deploy/deploy.sh` | Script deploy berulang |
| `npm run build` | Build frontend **+** SSR bundle ke `bootstrap/ssr/` |

---

## Setup VPS sekali jalan

### 1. Stack di server
- PHP 8.3+ (FPM) + extensions: `pdo`, `pgsql`/`mysql`, `redis`, `gd`/`imagick`, `mbstring`, `xml`, `zip`, `bcmath`
- Composer, Node 20+, Nginx
- Redis
- Supervisor
- Database (PostgreSQL disarankan, sama seperti lokal; MySQL juga bisa)

### 2. Clone & .env
```bash
cd /home/uXXXXX/domains/elevasidesignbuild.com
git clone <repo-url> public_html
cd public_html
cp .env.example .env
php artisan key:generate
```

Isi minimal `.env` production (lihat juga `.env.example`):

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://elevasidesignbuild.com

INERTIA_SSR_ENABLED=true
INERTIA_SSR_URL=http://127.0.0.1:13714

CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

FILESYSTEM_DISK=public
```

Plus DB, Redis, mail (SMTP Hostinger / Resend / dll), dan nomor WhatsApp di CMS setelah live.

### 3. Nginx
Salin `deploy/nginx/elevasi.conf` → `/etc/nginx/sites-available/elevasi`, sesuaikan path/user/PHP socket, enable site, lalu Certbot SSL.

**Penting:** document root harus mengarah ke folder **`public/`**, bukan root Laravel.

### 4. Supervisor
Edit path `uXXXXX` di:
- `deploy/supervisor/elevasi-ssr.conf`
- `deploy/supervisor/elevasi-worker.conf`

Lalu:

```bash
sudo cp deploy/supervisor/elevasi-*.conf /etc/supervisor/conf.d/
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start elevasi-ssr:*
sudo supervisorctl start elevasi-worker:*
sudo supervisorctl status
```

### 5. Deploy pertama
```bash
chmod +x deploy/deploy.sh
bash deploy/deploy.sh
php artisan inertia:check-ssr   # harus: "Inertia SSR is running"
```

### 6. Domain
Di DNS `elevasidesignbuild.com`:
- A record `@` → IP VPS
- A atau CNAME `www` → VPS

Tunggu propagasi, pastikan HTTPS hijau.

### 7. Setelah live (konten — Anda isi di CMS)
- Nomor WhatsApp nyata
- Foto hero + cover & galeri proyek
- Testimoni, alamat, Instagram
- Buat user Filament: `php artisan make:filament-user`

---

## Verifikasi cepat SSR

```bash
php artisan inertia:check-ssr
curl -s https://elevasidesignbuild.com | head
# HTML harus mengandung teks konten (bukan hanya <div id="app"> kosong)
```

Kalau SSR mati, site **masih bisa dibuka** (fallback client-side), tapi SEO kurang optimal — Supervisor `autorestart=true` memastikan proses hidup lagi.

---

## Deploy berikutnya

```bash
bash deploy/deploy.sh
```

Atau manual: `git pull` → `composer install` → `npm run build` → `migrate` → `config:cache` → restart supervisor.
