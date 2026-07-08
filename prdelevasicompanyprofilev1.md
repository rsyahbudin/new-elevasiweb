# PRD — Website Company Profile & Portofolio Elevasi Design Build

| | |
|---|---|
| **Versi** | 2.0 (Direkonsiliasi dengan MVP yang sudah dibangun — lihat Catatan Revisi) |
| **Tanggal** | 8 Juli 2026 |
| **Owner** | Rafly (Product Owner, Elevasi Design Build) |
| **Status** | MVP terbangun & berjalan di lingkungan development; menunggu migrasi konten asli, hardening keamanan, dan deployment produksi |

> **Catatan Revisi (v1.2 → v2.0):** Dokumen ini awalnya ditulis sebagai spesifikasi *sebelum* development. Setelah build MVP selesai, beberapa keputusan teknis bergeser dari rencana awal berdasarkan pilihan eksplisit yang diambil saat eksekusi (paling signifikan: animasi tidak memakai GSAP, melainkan hook JS vanilla agar 1:1 dengan prototype yang sudah disetujui, dan lebih ringan dari budget performa). Revisi ini menyelaraskan setiap bagian dengan kondisi aktual kode, dan memisahkan dengan jelas mana yang **sudah selesai**, mana yang **terbangun tapi belum diverifikasi/dikeraskan**, dan mana yang **belum dikerjakan**. Requirement yang sudah tidak berlaku dicoret dengan alasan, bukan dihapus diam-diam, supaya jejak keputusan tetap terbaca.

---

## 1. Executive Summary

### Problem Statement

Elevasi Design Build belum memiliki kehadiran digital yang merepresentasikan kualitas hasil kerjanya; portofolio proyek saat ini hanya tersebar di dokumentasi internal dan dibagikan manual (WhatsApp/PDF), sehingga kredibilitas di mata calon klien dan investor bergantung pada presentasi ad-hoc yang tidak konsisten.

### Proposed Solution

Website company profile publik dengan pengalaman visual premium (animasi scroll-reveal & parallax ringan, disiplin terhadap budget performa — lihat US-2 untuk keputusan mengganti GSAP dengan hook vanilla) untuk menampilkan portofolio proyek, ditenagai dashboard admin (Filament) agar staf non-teknis dapat mempublikasikan proyek baru secara mandiri tanpa keterlibatan developer.

### Success Criteria (KPI Terukur)

| # | KPI | Target | Cara Ukur |
|---|-----|--------|-----------|
| S1 | Core Web Vitals mobile (halaman Home & Detail Proyek) | LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms | Lighthouse (throttled Moto G4 / Slow 4G) + CrUX setelah live — **belum diukur**, baru diverifikasi manual (render benar, tanpa profiling formal) |
| S2 | Lighthouse Performance score **dengan animasi aktif** | ≥ 85 (mobile), ≥ 95 (desktop) | CI check per deploy — **belum ada CI gate**; lihat §4.7 dan §4.4 |
| S3 | Waktu publish 1 proyek baru (10 foto) oleh staf non-teknis | ≤ 10 menit, tanpa bantuan developer | Uji tugas dengan staf marketing saat UAT — **belum dilakukan**, dashboard sudah bisa dipakai tapi belum diuji ke staf non-teknis nyata |
| S4 | Indexability | Semua halaman publik ter-render server-side, ter-index Google ≤ 14 hari pasca launch | Google Search Console — SSR sudah tersedia (entry point `resources/js/ssr.jsx`, dibundel Vite), **proses SSR belum di-supervisi** (baru jalan via `php artisan serve` dev server, belum via Node process terkelola Supervisor seperti disyaratkan §4.1) |
| S5 | Inbound inquiry | ≥ 1 klik CTA WhatsApp/kontak per 20 sesi (5% CTR) dalam 3 bulan pertama | Event tracking (Umami/GA4) — **analytics belum dipasang** (§4.1 masih [TBD]); CTA WhatsApp & form kontak sendiri sudah berfungsi |

> Catatan: S1–S2 adalah *gate* rilis, bukan aspirasi. Halaman yang gagal budget performa tidak boleh naik ke produksi meskipun animasinya "sudah bagus". **Status saat ini: gate ini belum bisa ditegakkan otomatis karena Lighthouse CI belum dikonfigurasi (§4.7) — jangan anggap S1–S2 lolos sampai benar-benar diukur.**

---

## 2. User Experience & Functionality

### 2.1 User Personas

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **P1 — Calon Klien** | Pemilik rumah/bisnis di Indonesia mencari kontraktor design-build. Mayoritas akses via HP mid-range, koneksi 4G. | Bukti hasil kerja nyata (foto before/after, skala proyek), cara kontak cepat (WhatsApp). |
| **P2 — Investor / Partner** | Menerima link website dari founder. Akses via desktop, ekspektasi presentasi profesional. | Kesan "perusahaan ini serius": narasi perusahaan, breadth portofolio, kualitas visual. |
| **P3 — Admin Konten (non-teknis)** | Staf marketing/admin Elevasi. Familiar dengan Instagram & Google Drive, tidak familiar dengan kode. | Upload foto drag-drop, form sederhana, preview sebelum publish. |
| **P4 — Admin Teknis (Rafly)** | Product owner + developer. | Kontrol penuh konten, konfigurasi, dan kemampuan intervensi cepat. |

### 2.2 User Stories & Acceptance Criteria

**US-1 — Melihat portofolio (P1, P2)**
*Sebagai calon klien, saya ingin menelusuri proyek-proyek Elevasi berdasarkan kategori agar bisa menilai apakah kualitas dan jenis pekerjaannya sesuai kebutuhan saya.*

Acceptance Criteria:
- Halaman `/proyek` menampilkan grid proyek dengan filter kategori (mis. Residensial, Komersial, Interior, Renovasi) tanpa full page reload. **Selesai** (navigasi Inertia, `ProjectController::index` dengan `inCategory` scope).
- **Pagination server-side wajib** (12 proyek/halaman). **Selesai** (`paginate(12)`). Catatan: klaim "30+ proyek dan bertumbuh" di §4.6 belum tercermin di data — baru **9 proyek sample** ter-seed; pagination tetap berjalan benar secara teknis untuk volume berapa pun. Filter kategori menampilkan jumlah proyek per kategori — **belum diverifikasi di UI**.
- Setiap kartu proyek menampilkan: foto cover, nama proyek, kategori, lokasi (kota), tahun. **Selesai.**
- Halaman detail proyek menampilkan: galeri foto, deskripsi, scope pekerjaan, lokasi, tahun selesai, dan CTA kontak. **Selesai**, kecuali **lightbox foto galeri — belum dibangun** (galeri saat ini tampil sebagai grid statis, klik-untuk-perbesar belum ada).
- Semua gambar lazy-load dengan placeholder (LQIP/blur) — tidak ada layout shift saat gambar masuk (kontribusi ke CLS ≤ 0.1). **Belum berlaku secara utuh saat ini**: foto proyek asli belum tersedia (lihat §4.6), placeholder yang tampil adalah SVG garis-garis dekoratif berukuran tetap (bukan LQIP dari foto asli) — dimensi eksplisit sudah mencegah CLS, tapi behavior lazy-load+blur baru bisa diuji setelah foto asli di-upload.
- Grid tetap fungsional penuh saat JavaScript gagal dimuat (progressive enhancement — konten dari SSR). **SSR sudah dibangun** (`ssr.jsx`, dibundel via Vite) **namun belum dijalankan sebagai proses tersupervisi**; progressive enhancement belum diuji dengan JS dimatikan.

**US-2 — Merasakan brand experience (P1, P2)**
*Sebagai pengunjung, saya ingin website terasa halus dan premium agar persepsi saya terhadap kualitas kerja Elevasi meningkat.*

> **Keputusan revisi (v2.0):** ~~GSAP + ScrollTrigger~~ **diganti hook JS vanilla** (`useScrollReveal`, `useParallax`) yang meniru perilaku prototype asli persis. Alasan: (1) prototype yang disetujui klien sudah dibangun dengan IntersectionObserver + `requestAnimationFrame`, jadi mereplikasinya lebih murah & lebih rendah risiko regresi visual daripada menerjemahkan ke GSAP; (2) menghapus ~70 KB gzip dari budget JS (§4.4) — bundle publik saat ini **±117 KB gzip terukur**, jauh di bawah plafon 200 KB walau nanti ditambah galeri/lightbox. Trade-off yang diterima: kita kehilangan fitur timeline/easing kompleks GSAP; jika brief animasi masa depan butuh koreografi rumit (staggered timeline, scrub-to-scroll granular), evaluasi ulang keputusan ini.

Acceptance Criteria:
- Animasi entrance (hero, reveal section, parallax ringan pada foto) menggunakan hook custom `useScrollReveal` (IntersectionObserver, threshold 0.12, fallback rAF 2.5s) dan `useParallax` (rAF per scroll-event, GPU-accelerated `translateY`). **Selesai.**
- **Semua animasi hanya memanipulasi `transform` dan `opacity`** (GPU-composited). Properti yang memicu layout/paint (`width`, `top`, `margin`, dsb.) dilarang. **Selesai** — diterapkan di `resources/css/app.css` & kedua hook.
- Observer/listener di-init per-section secara lazy (attach saat komponen mount, bukan satu observer global saat load). **Selesai.**
- `prefers-reduced-motion: reduce` menonaktifkan seluruh animasi non-esensial. **Selesai** (`app.css`, `useParallax.js`).
- ~~Smooth scrolling (Lenis/GSAP ScrollSmoother) aktif hanya di desktop~~ **Tidak dibangun.** MVP memakai native scroll di semua breakpoint — konsisten dengan prototype yang disetujui dan menghindari risiko INP di §4.4. Jika smooth-scroll tetap diinginkan, ini scope tambahan v1.1 (lihat §5.1), bukan bagian MVP yang sudah selesai.
- Tidak ada animasi yang menunda visibilitas konten LCP (hero text/gambar tampil ≤ 2.5s; animasi boleh memperindah, tidak boleh menyandera). **Perilaku sudah sesuai desain** (reveal tidak menyembunyikan konten awal), **belum diverifikasi dengan Lighthouse** — lihat S1.

**US-3 — Mengelola proyek (P3, P4)**
*Sebagai admin konten, saya ingin menambah dan mengedit proyek lewat dashboard agar portofolio selalu up-to-date tanpa menunggu developer.*

Acceptance Criteria:
- CRUD proyek dengan field: nama, slug (auto-generate, bisa diedit), kategori, lokasi, tahun, scope pekerjaan, deskripsi (rich text sederhana), foto cover, galeri foto. **Selesai** (`ProjectResource`, `ProjectForm` — tab ID/EN via `PacksTranslatableFields`).
- Upload multi-file drag-drop; reorder galeri via drag-drop; hapus foto individual. **Selesai** (`SpatieMediaLibraryFileUpload`, tabel `reorderable()`).
- Sistem otomatis meng-generate varian gambar (thumbnail, medium, large) dalam format WebP + fallback — admin cukup upload JPG/PNG asli. **Konversi thumbnail/medium/large terdaftar** (`registerMediaConversions` di `Project`), **belum diverifikasi**: format output aktual (WebP vs format asli), fallback, dan blur placeholder (LQIP) yang disyaratkan US-1 belum dicek end-to-end.
- Status `Draft` / `Published`; draft tidak muncul di publik dan tidak ter-index. **Selesai** (`ProjectStatus` enum, `PublishedScope`).
- Validasi: cover wajib, minimal 1 foto galeri, ukuran file maksimal per foto (mis. 15 MB) dengan pesan error berbahasa Indonesia. **Belum diverifikasi** — validasi upload di form Filament belum ditinjau terhadap batas ukuran/pesan bahasa Indonesia secara eksplisit.
- Role: `Admin` (full akses) dan `Editor` (kelola konten saja, tanpa akses pengaturan situs & user). **Sebagian:** kolom `role` + `UserRole` enum + `FilamentUser` sudah ada; **kebijakan otorisasi per-resource (Editor tidak boleh akses `ManageSiteSettings`/user) belum diimplementasikan** — saat ini kedua role punya akses yang sama ke semua resource terdaftar.

**US-4 — Mengelola konten statis (P3, P4)**
*Sebagai admin, saya ingin mengubah konten halaman (hero, tentang kami, layanan, testimoni, kontak) tanpa deploy.*

Acceptance Criteria:
- Section editable: hero (headline, subheadline, media), Tentang Kami, daftar Layanan, Testimoni (CRUD), info kontak & nomor WhatsApp, link sosial media. **Selesai** (`ManageSiteSettings` page + `Testimonial` resource).
- Perubahan tampil di publik ≤ 1 menit (cache invalidation otomatis). **Belum dibangun** — halaman publik saat ini membaca langsung dari database tiap request (tidak ada response cache), jadi perubahan tampil instan secara *de facto*, tapi ini karena **belum ada caching sama sekali**, bukan karena invalidation yang disengaja. Redis dikonfigurasi untuk cache driver (§4.1) namun belum dipakai untuk response caching konten publik — perlu ditambahkan sebelum traffic produksi supaya R6 (§5.2) benar-benar teratasi.

**US-5 — Menerima inquiry (P1 → P4)**
*Sebagai calon klien, saya ingin menghubungi Elevasi dengan mudah.*

Acceptance Criteria:
- CTA utama: tombol WhatsApp (deep link `wa.me` dengan template pesan) — konsisten di header/footer/detail proyek. **Selesai** (`settings.whatsappUrl` dibagikan lewat `HandleInertiaRequests`).
- Form kontak sekunder (nama, kontak, pesan) → tersimpan di dashboard (inbox inquiry) + notifikasi email ke admin. **Selesai** (`KontakController::store`, `SubmitInquiry` action, `NewInquiryReceived` queued mail notification ke semua user `Admin`, `InquiryResource` read-only + `ViewInquiry` menandai `read_at`).
- Anti-spam: honeypot + rate limiting (tanpa CAPTCHA pihak ketiga yang membebani page load). **Selesai** (field honeypot `company` dicek di controller, `throttle:5,1` per IP di route).

**US-6 — Konten bilingual ID/EN (P1, P2, P3)**
*Sebagai investor/partner berbahasa Inggris, saya ingin membaca seluruh konten dalam bahasa Inggris agar bisa menilai perusahaan tanpa hambatan bahasa.*

Acceptance Criteria:
- Default locale: **ID** (root URL); EN tersedia di prefix `/en/...` dengan language switcher persisten di header (mempertahankan halaman saat ini saat berganti bahasa). **Selesai** — diimplementasikan lewat pendaftaran rute ganda (bukan parameter `{locale?}`; Laravel tidak mendukung parameter opsional di awal URI) + helper `route()` locale-aware di frontend (`resources/js/route.js`) yang otomatis mem-prefix `en.` pada nama rute sesuai locale aktif. `altLocaleUrl` dibagikan lewat Inertia untuk language switcher.
- Semua konten editable (proyek, halaman statis, testimoni, layanan) memiliki field ID dan EN di dashboard — disajikan sebagai tab per bahasa di form Filament. **Selesai** (`spatie/laravel-translatable`, tab ID/EN di `ProjectForm`, `CategoryForm`, `TestimonialForm`, `ManageSiteSettings`).
- **Fallback rule:** jika terjemahan EN sebuah field kosong, tampilkan versi ID (bukan halaman kosong/error). Proyek boleh dipublikasikan dengan EN belum lengkap. **Selesai untuk `SiteSetting`** (`SiteSetting::translated()` fallback eksplisit ke ID). **Belum diverifikasi untuk `Project`/`Category`/`Testimonial`** — field translatable Spatie di model-model ini belum ditinjau apakah fallback locale-nya dikonfigurasi (default Spatie translatable *tidak* fallback ke locale lain kecuali `fallbackLocale` di-set eksplisit per model).
- SEO: tag `hreflang` (id-ID, en, x-default) + sitemap.xml mencakup kedua locale. **Belum dibangun** — tidak ada `<link rel="alternate" hreflang>` di layout maupun `sitemap.xml` di route manapun. Ini berdampak langsung ke S4 (indexability); perlu masuk sebagai pending item sebelum launch, bukan sekadar nice-to-have.
- Slug proyek tetap satu (tidak diterjemahkan) untuk kesederhanaan. **Selesai** — kolom `slug` non-translatable di migrasi.
- UI statis (label tombol, navigasi, pesan form) dikelola via file lang Laravel, bukan hardcode. **Selesai** (`lang/id/site.php`, `lang/en/site.php`, dibagikan sebagai prop `t`).

### 2.3 Sitemap Publik (MVP)

```
/                  Home (hero, highlight proyek, layanan, testimoni, CTA)
/proyek            Index portofolio + filter kategori
/proyek/{slug}     Detail proyek
/tentang           Profil perusahaan, tim (opsional), nilai
/layanan           Detail layanan design-build
/kontak            Form + WhatsApp + peta lokasi

/en/...            Mirror seluruh rute di atas dalam bahasa Inggris
                   (path segment tetap: /en/proyek/{slug} — lihat US-6)
```

### 2.4 Non-Goals (Eksplisit TIDAK dibangun di MVP)

| Non-Goal | Rasional |
|---|---|
| Bahasa ketiga atau lokalisasi regional (selain ID/EN) | Bilingual ID/EN masuk MVP (US-6); di luar itu tidak ada kebutuhan teridentifikasi. |
| Blog / artikel SEO | SEO prioritas #4. Fase 2 jika terbukti dibutuhkan. |
| Login area untuk investor | Itu pola proyek Renjana, bukan kebutuhan Elevasi. Investor cukup halaman publik. |
| Halaman karir, e-brochure generator, integrasi ERP Elevasi | Scope creep. Website ini berdiri sendiri, terpisah dari ERP internal. |
| Video hosting sendiri | Jika butuh video, embed YouTube/Vimeo (lazy, facade pattern). |
| Admin dashboard ber-animasi/custom React | Dashboard adalah alat kerja, bukan etalase. Filament standar. |

---

## 3. AI System Requirements

**Tidak berlaku.** Tidak ada fitur AI di produk ini. (Penggunaan AI hanya pada proses pengembangan — mis. generasi konten placeholder — bukan pada sistem berjalan.)

---

## 4. Technical Specifications

### 4.1 Stack (Rekomendasi — konfirmasi sebelum eksekusi)

| Layer | Pilihan | Rasional |
|---|---|---|
| Backend | **Laravel 13, PHP 8.3 minimum — provision VPS dengan PHP 8.4** (Laravel 13.3+ menarik komponen Symfony 8 yang butuh 8.4) | Konsisten dengan ekosistem tim; Filament, Inertia, dan Spatie sudah kompatibel L13. **Selesai** — di-scaffold dan berjalan. |
| Frontend publik | **Inertia.js v2 + React 18 dengan SSR** | SSR wajib untuk S4 (indexability) dan LCP. **Kode SSR selesai** (`resources/js/ssr.jsx`, dibundel Vite); **proses Node belum dijalankan tersupervisi** — lingkungan development saat ini hanya memakai `php artisan serve` (CSR). Menjalankan `php artisan inertia:start-ssr` di balik Supervisor adalah pekerjaan deployment yang masih pending. |
| Animasi | ~~GSAP 3.13+ (core + ScrollTrigger; ScrollSmoother/SplitText opsional)~~ **Diganti hook JS vanilla** (`useScrollReveal` via IntersectionObserver, `useParallax` via `requestAnimationFrame`) | Lihat rasional lengkap di US-2. Ringkas: mereplikasi prototype yang sudah disetujui persis, tanpa menambah dependency ~70 KB. Konsekuensi: tidak ada timeline/easing library-grade; cukup untuk entrance/reveal/parallax ringan yang jadi scope MVP. |
| Admin | Filament 4 | CRUD + media management production-grade dengan effort minimal. **Selesai** — path non-default `/kelola`, resource untuk Project/Category/Testimonial/Inquiry + halaman `ManageSiteSettings`. |
| Media | Spatie Media Library + konversi otomatis (WebP, 3 ukuran, blur placeholder) | Menjamin S1 tanpa disiplin manual dari admin. **Sebagian**: koleksi media + 3 konversi (thumbnail/medium/large) terdaftar di model `Project`; **format WebP, fallback, dan blur placeholder (LQIP) belum diverifikasi berjalan** — perlu smoke test dengan foto asli sebelum diklaim selesai. |
| Database | PostgreSQL 16 | Konsisten dengan proyek-proyek lain tim. **Selesai** — migrasi & seeder berjalan di Postgres lokal. |
| Cache/Queue | Redis — **statusnya WAJIB (bukan opsional)** untuk response cache + queue konversi gambar | Volume konten (±300–500 foto asli, lihat §4.6) membuat konversi sinkron tidak layak. **Redis terpasang & terkonfigurasi sebagai cache driver**; **queue untuk konversi gambar & response cache untuk halaman publik belum diimplementasikan** — saat ini konversi media dan query halaman publik berjalan sinkron/langsung. Ini jadi pending item penting sebelum migrasi 300+ foto asli (§4.6) atau traffic produksi (R6, §5.2). |
| Storage | Lokal VPS (MVP). Cloudflare R2 jika total media > ~20 GB atau butuh CDN. **[TBD]** | Skala awal kecil; R2 adalah jalur upgrade yang sudah dikenal tim. Belum relevan — baru foto placeholder, belum ada foto asli ter-upload. |
| Web server | Nginx + PHP-FPM, single VPS | Sesuai pola deployment tim. **Belum di-deploy** — aplikasi baru berjalan di lingkungan development, VPS produksi belum diprovisi (lihat Open Question §5.3). |
| Analytics | Umami self-host atau GA4 **[TBD]** | Untuk S5. **Belum dipasang.** |

**Tradeoff yang sadar diambil:** Inertia SSR menambah satu proses Node yang harus dijaga (Supervisor) — kompleksitas operasional kecil, dibayar dengan SEO & LCP. Alternatif yang ditolak: React SPA murni (gagal S4), Next.js terpisah (memecah stack, ditolak juga di proyek CXP sebelumnya), Livewire untuk publik (integrasi animasi imperative lebih kompleks melawan DOM-diffing Livewire).

### 4.2 Arsitektur & Alur Data

```
Pengunjung ──> Nginx ──> Laravel (Inertia SSR) ──> PostgreSQL
                 │              │
                 │              └──> Redis (page/data cache)
                 └──> /storage (gambar WebP ter-versi, immutable cache headers)

Admin ──> Nginx ──> Laravel (Filament) ──> PostgreSQL
                          │
                          └──> Queue (Redis) ──> Worker: konversi gambar (Spatie)
```

> **Status:** diagram di atas menggambarkan arsitektur target, **bukan kondisi saat ini**. Yang sudah berjalan: Laravel → PostgreSQL (langsung, tanpa cache layer) dan Filament → PostgreSQL. Yang belum ada: response cache Redis di jalur publik, queue Redis untuk konversi gambar (konversi berjalan sinkron), dan Nginx/proses SSR tersupervisi (aplikasi masih dijalankan via `php artisan serve` di lingkungan development). Lihat §4.1, §4.6, dan roadmap MVP (§5.1) untuk daftar pending item yang menutup gap ini.

- Halaman publik di-cache (response cache) dengan invalidation saat model Proyek/Konten berubah → memenuhi US-4 (≤ 1 menit). **Belum diimplementasikan** (lihat US-4).
- Gambar disajikan dengan `Cache-Control: immutable` + nama file ber-hash. **Belum diverifikasi.**

### 4.3 Model Data (Inti)

```
projects        (id uuid, title, slug uniq, category_id, location_city,
                 year_completed, scope_of_work, description, status
                 [draft|published], published_at, sort_order, timestamps,
                 soft deletes)
categories      (id, name, slug)
media           (Spatie: polymorphic — cover & gallery collections,
                 custom property: sort order, alt text)
testimonials    (id, client_name, project_id nullable, quote, is_visible)
site_settings   (key-value / structured JSON per section)
inquiries       (id, name, contact, message, source_page, created_at)
users           (Filament auth; role: admin | editor)
```

Field konten (title, description, scope_of_work, quote, konten site_settings, nama kategori) bersifat **translatable sejak awal** via `spatie/laravel-translatable` — kolom JSON `{"id": "...", "en": "..."}`. Field non-konten (slug, location_city, year, status) tetap single-value. Filament plugin translatable menyediakan tab per-locale di form admin (US-6).

### 4.4 Performance Engineering (Kontrak, bukan saran)

1. **Budget JS halaman publik ≤ 200 KB gzipped.** ~~Termasuk GSAP (~70 KB core+ScrollTrigger)~~ — tidak relevan lagi karena GSAP tidak dipakai (lihat §4.1/US-2). Code-splitting per halaman via Vite. **Selesai & terukur:** bundle inti `app.js` ±117 KB gzip, halaman individual <2 KB gzip masing-masing — jauh di bawah budget bahkan sebelum ditambah komponen lightbox galeri (US-1) yang belum dibangun.
2. Gambar: WebP, `srcset` responsif, dimensi eksplisit (anti-CLS), lazy kecuali LCP image (`fetchpriority="high"`). **Belum diverifikasi** — belum ada foto asli untuk diuji; placeholder SVG saat ini sudah punya dimensi eksplisit (anti-CLS) tapi tidak merepresentasikan perilaku gambar asli.
3. Font: maksimal 2 family, `font-display: swap`, subset, self-hosted. **Selesai** — Archivo Variable + Instrument Serif via `@fontsource`, self-hosted, di-import di `app.css`.
4. Animasi: aturan `transform`/`opacity`-only ditegakkan lewat code review checklist; `will-change` hanya sesaat sebelum animasi. **Aturan dipatuhi di kode saat ini** (hook & CSS hanya pakai transform/opacity); **checklist code review formal belum didokumentasikan**.
5. CI gate: Lighthouse CI pada Home + 1 detail proyek; deploy diblokir jika skor < S2. **Belum dibangun** — tidak ada pipeline CI sama sekali di repo saat ini (lihat §4.7). Ini blocker langsung untuk S2 dan untuk klaim "deploy gate" di §1.

### 4.5 Security & Privacy

- Filament di path non-default. **Selesai** (`/kelola`). Rate limit login + password policy + 2FA untuk role Admin — **belum diimplementasikan**: `AdminPanelProvider` saat ini hanya `->login()` standar tanpa throttle eksplisit maupun plugin 2FA. Ini gap keamanan nyata untuk dashboard yang akan menyimpan PII (data inquiry) — prioritaskan sebelum akses admin dibuka ke jaringan publik.
- Upload divalidasi (MIME sniffing, bukan ekstensi); gambar di-reprocess (strip EXIF — foto lokasi proyek bisa bocorkan koordinat GPS klien). **Belum diverifikasi** — belum ditinjau apakah Spatie Media Library dikonfigurasi strip EXIF secara default (secara umum tidak, perlu manipulasi eksplisit).
- Form kontak: honeypot + throttle per IP; data inquiry berisi PII → jangan log ke pihak ketiga. **Selesai** untuk honeypot + throttle. Kebijakan "jangan log ke pihak ketiga" belum jadi item yang diperiksa eksplisit (mis. memastikan tidak ada APM/error-tracker pihak ketiga yang menangkap payload request berisi PII).
- HTTPS wajib, HSTS; backup DB harian. **Belum relevan** — belum ada deployment produksi; ini tetap requirement untuk fase deployment (§5.3, domain & VPS masih [TBD]).

### 4.6 Volume Konten & Kapasitas (Data Aktual vs. Status Build)

Input dari owner: **30+ proyek eksisting, masing-masing 10+ gambar** → estimasi 300–500 file asli saat launch, bertumbuh. **Ini masih target migrasi, belum kondisi database saat ini.** Database MVP baru berisi **9 proyek sample** (`ProjectSeeder`) dengan cover & galeri berupa placeholder SVG bergaris diagonal — dipakai untuk membuktikan tata letak/komponen, bukan konten final. Jangan salah baca status ini sebagai "30 proyek sudah masuk" saat membaca dashboard demo.

| Implikasi | Keputusan | Status |
|---|---|---|
| Storage: ±300–500 asli @ 5–8 MB ≈ 2–4 GB + varian konversi ≈ 1–2 GB | Lokal VPS masih aman (di bawah ambang R2 ~20 GB). Monitor disk; R2 tetap jalur upgrade. | Belum relevan — 0 foto asli ter-upload. |
| Konversi gambar: ratusan file × 3 varian + placeholder | **Wajib async via queue** (Redis + worker Supervisor). Konversi sinkron akan membuat form admin timeout. Status konversi tampil di dashboard (foto "processing" vs "ready"). | **Belum dibangun** — konversi media saat ini terdaftar tapi berjalan sinkron (lihat §4.1); tidak akan skalabel ke ratusan foto tanpa queue. Ini blocker nyata untuk fase migrasi konten di bawah. |
| Halaman index: 30+ kartu | Pagination server-side (US-1). | **Selesai** — teknis sudah benar untuk volume berapa pun (12/halaman), tapi belum pernah diuji dengan 30+ data nyata. |
| Galeri detail: 10+ foto/proyek | Hanya 6–8 thumbnail pertama dimuat eager; sisanya lazy saat lightbox/scroll. | **Belum dibangun** — lightbox sendiri belum ada (lihat US-1); strategi eager/lazy split belum diterapkan. |
| **Migrasi konten awal** — meng-input 30 proyek via form adalah kerja 2–4 hari staf | Direncanakan sebagai fase eksplisit di roadmap (bukan diasumsikan). Opsi akselerasi: import berbasis struktur folder (1 folder = 1 proyek, dev menjalankan command sekali) → staf tinggal melengkapi deskripsi via Filament. **[Pilih mekanisme saat kickoff]** | **Belum dimulai.** Ini sekarang jadi jalur kritis: queue konversi gambar (baris di atas) sebaiknya selesai *sebelum* migrasi 300+ foto dimulai, supaya staf tidak mengalami timeout saat upload. |

### 4.7 Standar Kualitas Kode ("Clean Code" yang Terukur)

Requirement "clean code" diterjemahkan menjadi kontrak yang bisa diperiksa — bukan preferensi selera:

1. **Formatting:** Laravel Pint (preset `laravel`), dijalankan di pre-commit hook + CI. Kode tak lolos Pint tidak bisa merge. **Sebagian:** `laravel/pint` ^1.27 sudah ada di `composer.json` (`require-dev`), tapi **belum ada `pint.json` (preset custom), belum ada pre-commit hook, dan belum ada CI** yang menjalankannya — saat ini tidak ada yang menegakkan formatting selain disiplin manual.
2. **Static analysis:** Larastan **level 6 minimum** di CI; error baru = build gagal. **Belum dikerjakan sama sekali** — `larastan/larastan` (atau `phpstan/phpstan`) belum ada di `composer.json`, tidak ada `phpstan.neon`. Ini requirement yang paling jauh dari selesai di seluruh dokumen.
3. **Arsitektur:**
   - Controller tipis: validasi di Form Request, logika bisnis di Action class per use-case (`PublishProject`, `ReorderGalleryImages`) — controller hanya orkestrasi. **Selesai** (`app/Actions/Projects/`, `app/Http/Requests/StoreInquiryRequest.php`).
   - Query Eloquent lewat scope/repository method bernama, tidak ditulis inline di controller/komponen. **Selesai** (`PublishedScope`, `InCategoryScope` pada `Project`).
   - Frontend React: komponen presentasional dipisah dari logika animasi (custom hooks: `useScrollReveal`, `useParallax`) agar animasi bisa dimatikan/diuji terisolasi. **Selesai** — dan diperkuat oleh keputusan v2.0 di US-2 (vanilla hooks, bukan GSAP terikat ke komponen).
   - Tidak ada magic string untuk status/kategori — gunakan PHP Enum. **Selesai** (`ProjectStatus`, `UserRole`).
4. **Testing (Pest):** feature test untuk jalur kritis — publish/unpublish proyek, fallback locale (US-6), form inquiry + anti-spam, otorisasi role Admin vs Editor. Target bukan coverage %, tapi **daftar jalur kritis 100% tertutup**. **Belum dikerjakan** — `tests/Feature/ExampleTest.php` dan `tests/Unit/ExampleTest.php` masih file default dari `laravel new`, belum ada satu pun test nyata untuk jalur di atas. Ini juga berarti klaim "otorisasi role Admin vs Editor" di US-3 belum punya jaring pengaman regresi karena fiturnya sendiri belum diimplementasikan (lihat US-3).
5. **Dokumentasi:** `AGENT.md` konvensi codebase agar kontributor — manusia maupun AI tooling — konsisten. **Belum dibuat.**

> **Ringkasan §4.7:** dari 5 kontrak kualitas kode, hanya arsitektur (poin 3) yang benar-benar selesai. Formatting terpasang tapi tidak ditegakkan; static analysis, testing, dan dokumentasi konvensi belum dimulai. Ini adalah gap terbesar antara PRD dan kondisi kode saat ini — jadikan prioritas sebelum menganggap MVP "production-ready", karena tanpa Pest test untuk fallback locale dan anti-spam, regresi di dua area itu tidak akan terdeteksi otomatis.


---

## 5. Risks & Roadmap

### 5.1 Phased Rollout

**MVP (target: fondasi 1 sprint konten + build):**
Home, Proyek (index + detail), Tentang, Kontak, dashboard Filament (US-3, US-4, US-5), **bilingual ID/EN (US-6)**, performance gate aktif. Animasi: entrance + scroll reveal + parallax ringan. *Definisi selesai = semua S1–S4 terpenuhi di staging, kedua locale.*

> **Status build per 8 Juli 2026:** Kode untuk seluruh halaman & dashboard di atas **sudah ada dan berjalan** di lingkungan development. "Definisi selesai" di atas **belum tercapai** — S1/S2 belum terukur (tidak ada Lighthouse CI), S4 belum tercapai penuh (SSR belum tersupervisi, tidak ada hreflang/sitemap). Sebelum MVP dianggap *done* menurut kontrak PRD ini, sisa pekerjaan konkret:
> 1. Jalankan & supervisi proses SSR (Supervisor) — prasyarat S4.
> 2. Pasang Lighthouse CI + ukur S1/S2 sungguhan di device mid-range/throttled — tanpa ini, gate performa di §1 hanya slogan.
> 3. Tambahkan `hreflang` + `sitemap.xml` (US-6).
> 4. Response cache untuk halaman publik + queue untuk konversi media (US-4, §4.6) — prasyarat sebelum migrasi konten besar.
> 5. Rate limit login + 2FA Filament (§4.5) — prasyarat sebelum dashboard diakses dari luar jaringan development.
> 6. Otorisasi Admin vs Editor per-resource (US-3) — saat ini kedua role setara.
> 7. Pint di CI, Larastan, Pest untuk jalur kritis, `AGENT.md` (§4.7).

**Fase migrasi konten (paralel dengan build, bukan setelahnya):** kurasi + input 30+ proyek eksisting (mekanisme di §4.6). Launch minimal: seluruh proyek ter-input dengan cover + galeri; deskripsi EN boleh menyusul via fallback US-6. **Belum dimulai** — baru 9 proyek sample/placeholder di database (§4.6); menunggu queue konversi gambar (poin 4 di atas) sebelum migrasi volume besar dimulai, dan menunggu foto asli dari owner (R2, §5.2).

**v1.1:**
Halaman Layanan mendalam, testimoni ter-kurasi per proyek, smooth scroll desktop (jika budget performa masih lolos), Umami events lengkap.

**v2.0 (dipicu bukti kebutuhan, bukan asumsi):**
Blog SEO (jika lead organik jadi prioritas naik), CDN/R2 (jika media membengkak).

### 5.2 Technical & Project Risks

| Risiko | Dampak | Mitigasi |
|---|---|---|
| **R1 — Animasi menggerus performa mobile** (risiko #1) | Gagal S1/S2; bounce P1 | Budget di §4.4 sebagai deploy gate. **Risiko ini menurun** sejak animasi diganti hook vanilla (117 KB gzip vs budget 200 KB) — tapi klaim "uji di device mid-range nyata" **masih belum dilakukan**; jangan tutup risiko ini sampai Lighthouse CI (roadmap MVP poin 2) benar-benar jalan. |
| R2 — Aset foto tidak siap / kualitas rendah | Website premium dengan foto buruk = kontraproduktif terhadap tujuan #1 | **Blocker eksternal, masih terbuka:** audit aset foto per proyek belum dilakukan pemilik. UI sudah dibangun dengan placeholder — begitu foto asli masuk, perlu smoke test konversi media (§4.1) sebelum dianggap selesai. Minimal 6–8 proyek layak tampil untuk launch. |
| R3 — Admin non-teknis kesulitan | S3 gagal; konten basi | UAT tugas nyata dengan staf (S3) — **belum dilakukan**; teks bantuan bahasa Indonesia di form — **belum ditinjau eksplisit**. |
| R4 — Inertia SSR process mati diam-diam | Halaman publik blank/degradasi SEO | Supervisor auto-restart + health check + fallback CSR (Inertia tetap render client-side jika SSR gagal). **Belum diimplementasikan** — proses SSR sendiri belum dijalankan tersupervisi (lihat §4.1/roadmap MVP poin 1), jadi mitigasi ini juga belum ada. |
| R5 — Scope creep (blog, bahasa ketiga, integrasi ERP) | Timeline molor | Non-Goals §2.4 sebagai kontrak; perubahan scope = revisi PRD, bukan "sekalian aja". Dipatuhi sejauh ini — tidak ada fitur di luar §2.4 yang terbangun. |
| R6 — Satu VPS untuk semua | Lonjakan traffic (viral/kampanye) menjatuhkan situs | Response cache agresif; halaman publik hampir seluruhnya cacheable → kapasitas efektif tinggi. **Belum diimplementasikan** — lihat US-4; response cache adalah pending item, bukan mitigasi aktif saat ini. |
| R7 — Copywriting dua bahasa jadi bottleneck | Bilingual di MVP menggandakan beban Open Question #4; launch tertunda menunggu terjemahan EN | Fallback rule US-6 (EN kosong → tampil ID) memungkinkan launch dengan EN parsial pada konten proyek — **fallback terkonfirmasi jalan untuk `SiteSetting`, belum terverifikasi untuk `Project`/`Testimonial`** (lihat US-6). **Halaman inti (Home, Tentang, Layanan, Kontak) wajib EN lengkap sebelum launch.** Tentukan penanggung jawab terjemahan sejak kickoff. |
| **R8 — Dashboard admin belum dikeraskan (baru)** | Path `/kelola` tanpa rate limit login/2FA rentan brute-force begitu terekspos ke internet | Selesaikan §4.5 (rate limit + 2FA) sebelum VPS produksi menerima traffic publik — jangan expose `/kelola` lebih dulu dari hardening ini. |
| **R9 — Role Admin/Editor belum dibedakan otorisasinya (baru)** | Editor bisa mengubah `site_settings`/data sensitif yang seharusnya Admin-only, bertentangan dengan US-3 | Implementasikan Filament resource-level policy per role sebelum staf Editor non-teknis (P3) diberi akun sungguhan. |

### 5.3 Open Questions (Butuh jawaban sebelum development)

1. ~~Bilingual ID/EN~~ — **TERJAWAB (7 Jul 2026): EN dibutuhkan sejak launch.** Bilingual masuk scope MVP dan **sudah dibangun** (lihat US-6, §4.3, §5.1).
2. ~~Berapa proyek yang fotonya sudah siap-tampil?~~ **SEBAGIAN TERJAWAB (7 Jul 2026): 30+ proyek, masing-masing 10+ gambar.** Yang masih terbuka: berapa yang fotonya *layak-kurasi* (komposisi, resolusi, kondisi finished — bukan foto progres lapangan)? Kuantitas ≠ kualitas; kurasi tetap langkah pertama (R2). **Masih terbuka per 8 Jul 2026** — belum ada foto asli masuk ke sistem sama sekali, database masih 9 proyek placeholder.
3. Domain & VPS: pakai infrastruktur yang sudah ada atau provisioning baru? **[TBD] — masih terbuka.** Ini sekarang jadi blocker langsung: tanpa VPS, langkah SSR/Supervisor, Nginx, HTTPS di §4.1/§4.5 tidak bisa dimulai.
4. Siapa yang menulis copy (deskripsi proyek, tentang kami)? Konten sering jadi bottleneck lebih besar daripada kode. **Masih terbuka.**
5. Identitas visual: apakah Elevasi punya brand guideline (logo, warna, font), atau perlu didefinisikan `design.md` seperti pola proyek sebelumnya? **Terjawab secara implisit oleh implementasi:** palet (off-white `#f3f3f0`, graphite, aksen hijau `#1f7a46`) dan tipografi (Archivo Variable + Instrument Serif) sudah dikunci mengikuti prototype yang disetujui klien — jika ini belum resmi jadi brand guideline Elevasi, konfirmasikan sebelum dipakai di materi non-web (kartu nama, presentasi, dsb).
6. **Baru:** Siapa yang bertanggung jawab menutup gap §4.7 (Larastan, Pest, CI) dan §4.5 (2FA, rate limit) sebelum go-live — apakah developer yang sama atau perlu bantuan tambahan mengingat volume kerja yang tersisa?
7. **Baru:** Apakah response cache (Redis) dan queue konversi gambar (§4.6) dikerjakan sebelum atau paralel dengan fase migrasi 30+ proyek? Urutan ini menentukan apakah staf non-teknis akan mengalami timeout saat upload massal.
