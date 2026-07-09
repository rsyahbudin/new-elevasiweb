# GitHub Actions — Deploy Otomatis ke VPS

Setiap **push ke branch `main`**, GitHub otomatis SSH ke VPS Anda dan menjalankan `deploy/deploy.sh`.

Workflow: [`.github/workflows/deploy-production.yml`](../.github/workflows/deploy-production.yml)

---

## Alur singkat

```
Push ke main → GitHub Actions → SSH ke VPS → bash deploy/deploy.sh → live
```

Anda **tidak perlu** login SSH manual lagi untuk deploy rutin (tetap bisa manual kalau mau).

---

## Setup sekali jalan

### 1. Buat SSH key khusus untuk GitHub Actions

Di komputer lokal (bukan di VPS):

```bash
ssh-keygen -t ed25519 -C "github-actions-elevasi" -f ~/.ssh/elevasi_github_actions -N ""
```

Akan menghasilkan:
- `~/.ssh/elevasi_github_actions` → **private key** (untuk GitHub Secret)
- `~/.ssh/elevasi_github_actions.pub` → **public key** (untuk VPS)

### 2. Pasang public key di VPS

```bash
# Di komputer lokal — copy public key ke VPS
ssh-copy-id -i ~/.ssh/elevasi_github_actions.pub u123456789@IP_VPS_ANDA
```

Atau manual: tambahkan isi `.pub` ke `~/.ssh/authorized_keys` di VPS.

Tes koneksi:

```bash
ssh -i ~/.ssh/elevasi_github_actions u123456789@IP_VPS_ANDA
```

### 3. Izinkan `supervisorctl` tanpa password (wajib)

`deploy.sh` memanggil `sudo supervisorctl`. User deploy harus bisa menjalankannya tanpa prompt password.

Di VPS:

```bash
sudo visudo -f /etc/sudoers.d/elevasi-deploy
```

Tambahkan (ganti username):

```
u123456789 ALL=(ALL) NOPASSWD: /usr/bin/supervisorctl
```

Simpan, lalu tes:

```bash
sudo supervisorctl status
```

### 4. Pastikan VPS bisa `git pull` dari GitHub

#### Repo **public**
Tidak perlu langkah tambahan — `git pull` langsung jalan.

#### Repo **private** — deploy key di VPS

Di VPS:

```bash
ssh-keygen -t ed25519 -C "vps-git-pull" -f ~/.ssh/elevasi_git_pull -N ""
cat ~/.ssh/elevasi_git_pull.pub
```

1. Buka GitHub repo → **Settings** → **Deploy keys** → **Add deploy key**
2. Paste public key, centang **Allow read access** (write tidak perlu)
3. Di VPS, konfigurasi SSH untuk GitHub:

```bash
nano ~/.ssh/config
```

```
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/elevasi_git_pull
  IdentitiesOnly yes
```

```bash
chmod 600 ~/.ssh/config
ssh -T git@github.com   # harus: "Hi USER/REPO! You've successfully authenticated..."
```

Pastikan remote di folder project memakai SSH:

```bash
cd /home/u123456789/domains/elevasidesignbuild.com/public_html
git remote -v
# harus: git@github.com:USERNAME/elevasi.git
```

Kalau masih HTTPS, ubah:

```bash
git remote set-url origin git@github.com:USERNAME/elevasi.git
```

### 5. Tambahkan GitHub Secrets

Buka repo GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret | Contoh nilai | Wajib |
|---|---|---|
| `SSH_HOST` | `123.45.67.89` atau `elevasidesignbuild.com` | Ya |
| `SSH_USER` | `u123456789` | Ya |
| `SSH_PRIVATE_KEY` | Isi penuh file `elevasi_github_actions` (termasuk `-----BEGIN...`) | Ya |
| `DEPLOY_PATH` | `/home/u123456789/domains/elevasidesignbuild.com/public_html` | Ya |
| `SSH_PORT` | `22` | Tidak (default 22) |

**Cara copy private key:**

```bash
cat ~/.ssh/elevasi_github_actions
```

Copy semua baris ke secret `SSH_PRIVATE_KEY`.

---

## Cara pakai

### Otomatis
Push / merge ke `main` → deploy jalan sendiri.

### Manual dari GitHub UI
**Actions** → **Deploy production** → **Run workflow** → **Run workflow**

---

## Cek hasil deploy

1. GitHub → tab **Actions** → klik run terbaru → harus hijau ✓
2. Di VPS (opsional):

```bash
php artisan inertia:check-ssr
tail -20 storage/logs/laravel.log
```

3. Buka situs production, hard refresh (`Ctrl+Shift+R`)

---

## Troubleshooting

### `git pull` gagal di VPS (repo private)

```
Permission denied (publickey)
```

→ Deploy key belum benar. Ulangi langkah 4.

### `sudo: a password is required`

→ Sudoers belum dikonfigurasi. Ulangi langkah 3.

### `npm run build` gagal (out of memory)

VPS kehabisan RAM saat build. Opsi:
- Upgrade RAM VPS, atau
- Build di GitHub Actions lalu rsync `public/build` + `bootstrap/ssr` ke VPS (advanced — belum di-setup di workflow ini)

Untuk VPS 2 GB, build biasanya cukup jika tidak ada proses berat lain.

### Workflow hijau tapi situs belum berubah

- Cek `DEPLOY_PATH` secret — path salah?
- Cek branch di VPS: `git log -1 --oneline`
- Clear cache browser / CDN

### Ingin deploy manual saja (tanpa Actions)

Tetap bisa:

```bash
ssh u123456789@IP_VPS
cd /path/ke/public_html
bash deploy/deploy.sh
```

GitHub Actions **opsional** — mempermudah, bukan wajib.

---

## Keamanan

- SSH key GitHub Actions **hanya** untuk deploy — jangan dipakai untuk hal lain
- Deploy key VPS **read-only** — VPS tidak bisa push ke GitHub
- Jangan commit `.env` atau private key ke repo
- Pertimbangkan **branch protection** di `main` (require PR review sebelum merge)

---

Lihat juga: [`PANDUAN-DEPLOY-VPS.md`](./PANDUAN-DEPLOY-VPS.md) untuk setup VPS lengkap.
