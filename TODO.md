# TODO.md — Pelacak Progres & Memori Proyek FinZ (Next.js Edition)

File ini berfungsi sebagai *Single Source of Truth* untuk melacak progres pengerjaan proyek **FinZ**. AI Coding Agent wajib memeriksa file ini sebelum memulai tugas dan memperbarui statusnya segera setelah tugas selesai.

## 1. Status Legend
* `[ ]` **Todo**: Tugas belum dikerjakan.
* `[/]` **In Progress**: Tugas sedang dikerjakan saat ini.
* `[x]` **Done**: Tugas telah selesai, lulus uji validasi, dan memenuhi *Definition of Done*.
* `[~]` **Blocked**: Tugas tertahan karena ketergantungan atau menunggu keputusan pengguna.
* `[-]` **Cancelled**: Tugas dibatalkan atau dikeluarkan dari *scope*.

---

## 2. Task Backlog Terstruktur

### 🔥 High Priority (Foundation & Core MVP / P0)

#### A. Next.js Project Setup & Database Layer
* `[x]` **TASK-01**: Inisialisasi proyek Next.js 15 (App Router + TypeScript + Tailwind CSS), konfigurasi `.env.example`, dan install dependencies utama (`prisma`, `@prisma/client`, `bcryptjs`, `jose`, `zod`, `lucide-react`, `recharts`).
* `[x]` **TASK-02**: Implementasi `prisma/schema.prisma` sesuai spesifikasi $9$ tabel pada `ARCHITECTURE.md` serta buat singleton `src/lib/prisma.ts` dan helper serialisasi `BigInt` di `src/lib/formatters.ts`.
* `[x]` **TASK-03**: Buat dan jalankan `prisma/seed.ts` untuk mengisi $4$ aset investasi simulasi contoh (Reksa Dana Pasar Uang, Reksa Dana Pendapatan Tetap, Saham Edukasi, Emas Virtual) dan $5$ misi pemula.

#### B. Security, Auth & Next.js Middleware
* `[x]` **TASK-04**: Buat helper `src/server/utils/api-response.ts`, `src/lib/jwt.ts` (berbasis `jose`), dan `src/server/utils/auth-session.ts` untuk standarisasi respons JSON dan verifikasi sesi pengguna.
* `[x]` **TASK-05**: Implementasi `auth.service.ts` dan Route Handlers (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`) dengan inisialisasi Level $1$, XP $0$, dan Saldo Virtual $\text{Rp}10.000.000$.
* `[x]` **TASK-06**: Implementasi `src/middleware.ts` untuk memproteksi rute halaman `(dashboard)/*` dan endpoint `/api/*` privat menggunakan verifikasi JWT.

#### C. Financial Core Services & Route Handlers (Transaksi, Anggaran, Tabungan)
* `[x]` **TASK-07**: Implementasi `gamification.service.ts` untuk pemberian XP otomatis, kalkulasi kenaikan Level ($\lfloor \text{XP}/100 \rfloor + 1$), pencegahan spam XP harian, dan pelacakan progres `UserMission`.
* `[x]` **TASK-08**: Implementasi Service & Route Handlers **Transaksi** (`GET`, `POST /api/transactions` dan `DELETE /api/transactions/[id]`) dengan isolasi penuh berdasarkan `userId` dari sesi JWT.
* `[x]` **TASK-09**: Implementasi Service & Route Handlers **Budgeting** (`GET`, `POST /api/budgets`) lengkap dengan agregasi pengeluaran aktual per kategori dan kalkulasi status (`SAFE`, `WARNING`, `OVERBUDGET`).
* `[x]` **TASK-10**: Implementasi Service & Route Handlers **Target Tabungan** (`GET`, `POST /api/savings` dan `POST /api/savings/[id]/contribute`) beserta kalkulasi persentase progres dan perubahan status otomatis ke `COMPLETED`.

#### D. Virtual Investment & Dashboard API Modules
* `[x]` **TASK-11**: Implementasi Service & Route Handlers **Simulasi Investasi Virtual** (`/api/investments/assets`, `buy`, `sell`, `portfolio`, `history`) menggunakan transaksi atomik `prisma.$transaction`.
* `[x]` **TASK-12**: Implementasi endpoint agregasi **Dashboard** (`GET /api/dashboard`) dan **Misi** (`GET /api/missions`) yang merangkum arus kas bulanan, saldo virtual, status level/XP, progres anggaran, dan target tabungan.

#### E. Next.js App Router Pages & React Components
* `[x]` **TASK-13**: Bangun komponen UI dasar (`src/components/ui/*`), `<SimulationDisclaimer />`, `<XpHeaderBar />`, dan layout utama `src/app/(dashboard)/layout.tsx`.
* `[x]` **TASK-14**: Bangun halaman autentikasi `src/app/(auth)/login/page.tsx` dan `src/app/(auth)/register/page.tsx` dengan validasi form dan integrasi ke `/api/auth/*`.
* `[x]` **TASK-15**: Bangun halaman `src/app/(dashboard)/dashboard/page.tsx` untuk menampilkan kartu ringkasan keuangan, *XP Progress Bar*, badge Level, serta ringkasan tabungan dan saldo investasi virtual.
* `[x]` **TASK-16**: Bangun halaman `src/app/(dashboard)/transactions/page.tsx`, `budgets/page.tsx`, dan `savings/page.tsx` lengkap dengan form modal dan indikator progres anggaran/tabungan.
* `[x]` **TASK-17**: Bangun halaman `src/app/(dashboard)/investments/page.tsx` untuk katalog aset contoh, modal beli/jual unit aset, tabel portofolio, tabel riwayat transaksi simulasi, dan banner *disclaimer* edukasi.

---

### 🟡 Medium Priority (Secondary Features & UI/UX Polish / P1)

* `[x]` **TASK-18**: Bangun halaman `src/app/(dashboard)/missions/page.tsx` yang menampilkan daftar misi rutin/edukasi, progres bar tiap misi, serta akordion Panduan Penggunaan & FAQ Literasi Keuangan.
* `[x]` **TASK-19**: Tambahkan fitur **Simulasi Fluktuasi Harga Contoh** (`POST /api/investments/simulate`) yang mengacak perubahan harga aset contoh dalam rentang aman ($\pm 1\%$ s/d $\pm 5\%$) agar pengguna bisa belajar konsep *unrealized profit/loss*.
* `[x]` **TASK-20**: Integrasikan grafik visualisasi di Dashboard menggunakan `recharts` (BarChart Pemasukan vs Pengeluaran & PieChart Pengeluaran per Kategori).
* `[x]` **TASK-21**: Tambahkan komponen animasi `<LevelUpModal />` dan `<XpToast />` ketika respons API mengembalikan `meta.xpGained > 0` atau `meta.leveledUp === true`.

---

### 🟢 Low Priority (Technical Debt, Optimization & Nice-to-Have / P2)

* `[x]` **TASK-22**: Tulis Unit Test dan Integration Test untuk skenario kritis (validasi saldo virtual kurang saat beli aset, isolasi akses IDOR/Zod token corruption, formatters/BigInt serialization, dan kalkulasi rumus XP/Level). 27 tests passed.
* `[x]` **TASK-23**: Implementasi fitur ekspor riwayat transaksi ke file `.csv` (UTF-8 BOM, filtered dataset) pada halaman Transaksi (`src/app/(dashboard)/transactions/page.tsx`).
* `[x]` **TASK-24**: Audit penuh TypeScript (`npx tsc --noEmit`), ESLint (`npm run lint`), testing suite (27/27 tests passed), dan *production build* (`next build`) berhasil 100% tanpa error (28 static/dynamic routes + Edge Middleware).