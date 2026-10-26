# FinZ — Gamified Micro-Investing & Budgeting Platform

FinZ adalah platform edukasi literasi keuangan generasi Z yang menggabungkan pencatatan anggaran harian (*budgeting*), target tabungan berorientasi impian (*savings goals*), sistem gamifikasi level & XP (*gamified milestones*), serta simulator investasi mikro virtual (*zero-risk educational investment simulation*).

Dibangun menggunakan arsitektur modern **Next.js 15 (App Router)** dengan **TypeScript Strict Mode**, **Prisma ORM**, dan **Tailwind CSS**.

---

## 🚀 Fitur Utama

1. **Dashboard Finansial Terpadu (`/dashboard`)**:
   * Ringkasan saldo kas, total tabungan, nilai portofolio investasi virtual, dan saldo kas virtual.
   * Visualisasi interaktif menggunakan Recharts: BarChart Arus Kas Bulanan (Pemasukan vs Pengeluaran) & PieChart Alokasi Pengeluaran per Kategori.
   * Indikator Gamifikasi: XP Progress Bar, Badge Level, dan ringkasan progres misi aktif.
2. **Pencatatan Transaksi & Ekspor CSV (`/transactions`)**:
   * Manajemen transaksi pemasukan (*income*) dan pengeluaran (*expense*).
   * Filter dinamis berdasarkan tipe transaksi.
   * Ekspor riwayat transaksi ke format `.csv` dengan UTF-8 BOM encoding.
   * Gamifikasi: Mendapatkan +10 XP untuk setiap transaksi tercatat (dibatasi 5x/hari untuk mencegah spam).
3. **Manajemen Anggaran Kategori (`/budgets`)**:
   * Penetapan limit anggaran bulanan per kategori (*Makanan*, *Transportasi*, *Belanja*, dll.).
   * Pelacakan real-time pengeluaran vs batas limit dengan progress bar warna cerdas:
     * Hijau (*Safe*, < 80%)
     * Kuning (*Warning*, 80% - 99.9%)
     * Merah (*Overbudget*, $\ge$ 100%)
4. **Target Tabungan Berorientasi Impian (`/savings`)**:
   * Pembuatan target tabungan dengan target tanggal dan nominal.
   * Fitur setor tabungan (*contribute*) dengan kalkulasi progres otomatis.
   * Gamifikasi: Mendapatkan +50 XP ketika target tabungan tercapai 100%.
5. **Simulator Investasi Virtual Edukasi (`/investments`)**:
   * Katalog aset virtual terkurasi: RDPU Edukasi (Risiko Rendah), RDPT Edukasi (Risiko Menengah), Saham Indeks Edukasi (Risiko Tinggi), Emas Digital Edukasi.
   * Modal Beli/Jual unit aset dengan validasi saldo virtual dan kalkulasi *Weighted Average Buy Price*.
   * Semua transaksi mutasi saldo virtual dibungkus dalam `prisma.$transaction()` atomik.
   * Fitur simulasi fluktuasi harga pasar secara interaktif (`POST /api/investments/simulate`) dengan rentang aman $\pm 1\%$ s/d $\pm 5\%$.
   * Banner `<SimulationDisclaimer />` wajib di setiap tampilan investasi.
6. **Misi Literasi & Edukasi Keuangan (`/missions`)**:
   * Misi pencapaian otomatis (Pencatat Pemula, Investor Cilik, Penabung Disiplin, dll.) dengan hadiah XP.
   * Akordion FAQ & Panduan Literasi Finansial (Aturan 50/30/20, Investasi vs Judi, Dana Darurat, Manajemen Risiko).
7. **Gamifikasi & Selebrasi Interaktif**:
   * Komponen perayaan `<LevelUpModal />` saat naik level (formula: $\lfloor \text{XP}/100 \rfloor + 1$).
   * Notifikasi mengambang `<XpToast />` saat memperoleh XP dari aktivitas aplikasi.

---

## 🛠️ Tech Stack & Architecture

* **Framework:** Next.js 15.3.3 (App Router, Server & Client Components)
* **Frontend:** React 19, Tailwind CSS 3.4, Lucide React, Recharts 2.15
* **Backend:** Next.js Route Handlers (`src/app/api/.../route.ts`)
* **Layered Architecture:** `Middleware -> Route Handler / Controller -> Service Layer -> Prisma ORM`
* **Database & ORM:** PostgreSQL / SQLite / MySQL dengan Prisma ORM 6.9
* **Authentication:** Stateless JWT via `jose` (Edge-compatible subpaths `jose/jwt/sign` & `jose/jwt/verify`) & `bcryptjs`
* **Validation:** Zod 3.25 untuk validasi skema payload di Route Handlers
* **Monetary Representation:** Tipe `BigInt` untuk seluruh nominal uang, diserialisasi aman via `src/lib/formatters.ts` (bebas *floating-point precision error*)
* **Testing:** Node.js native test runner + `tsx` (27 unit tests)

---

## 📂 Struktur Direktori

```
finz-nextjs/
├── prisma/
│   ├── schema.prisma          # 9 Prisma models (User, Transaction, Budget, SavingsGoal, VirtualAsset, Portfolio, InvestmentHistory, Mission, UserMission)
│   └── seed.ts                # Seeding aset contoh & misi edukasi
├── src/
│   ├── app/
│   │   ├── (auth)/            # Auth routes: /login, /register
│   │   ├── (dashboard)/       # Dashboard routes: /dashboard, /transactions, /budgets, /savings, /investments, /missions
│   │   ├── api/               # 15 RESTful API route handlers
│   │   ├── layout.tsx         # Root HTML layout & font config
│   │   ├── page.tsx           # Landing page redirect
│   │   └── globals.css        # Tailwind styles & theme variables
│   ├── components/
│   │   ├── gamification/      # LevelUpModal, XpToast, XpProgressBar
│   │   ├── layout/            # Sidebar, XpHeaderBar
│   │   ├── recharts/          # CashflowChart (Bar & Pie)
│   │   └── ui/                # Button, Card, Modal, Input, Badge, ProgressBar, SimulationDisclaimer
│   ├── lib/
│   │   ├── formatters.ts      # BigInt serialization, IDR formatters, math utilities
│   │   ├── jwt.ts             # Edge-compatible JWT sign & verify
│   │   └── prisma.ts          # Global PrismaClient singleton
│   ├── middleware.ts          # Edge middleware: JWT session check & route guard
│   ├── server/
│   │   ├── services/          # Business logic: auth, gamification, transaction, budget, savings, investment
│   │   ├── utils/             # apiResponse standard formatter & authSession helper
│   │   └── validators/        # Zod schemas for request validation
│   └── types/                 # Shared TypeScript interfaces & types
└── tests/                     # Test suites (auth-security, formatters, gamification, investment-logic)
```

---

## 🚦 Menjalankan Proyek

### 1. Prasyarat
* Node.js v18.18.0 atau lebih baru (direkomendasikan Node.js v20+ atau v24)
* PostgreSQL (atau ganti provider ke `sqlite` di `prisma/schema.prisma` jika ingin pengujian lokal tanpa database server terpisah)

### 2. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan variabel berikut di `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finz_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars-long"
PORT=3000
```

### 3. Generate Prisma Client & Database Migration
```bash
# Generate Prisma Client
npm run postinstall

# Jalankan migrasi database
npm run db:push
# atau
npm run db:migrate

# Jalankan data seed (Aset virtual awal & Misi edukasi)
npm run db:seed
```

### 4. Menjalankan Unit Tests
Proyek dilengkapi 27 unit test yang memvalidasi logika bisnis, keamanan JWT, validasi Zod, formula level XP, dan kalkulasi saldo investasi:
```bash
npm test
```

### 5. Typecheck & Linter
```bash
# Validasi TypeScript
npm run typecheck

# Validasi ESLint
npm run lint
```

### 6. Menjalankan Development Server
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 7. Production Build & Run
```bash
npm run build
npm run start
```

---

## 🔒 Aturan Keamanan & Integritas Data

1. **Anti-IDOR (Insecure Direct Object Reference)**:
   * Setiap operasi baca/tulis data transaksi, anggaran, tabungan, dan portofolio **wajib** mengambil `userId` langsung dari token JWT terverifikasi (`sub`), bukan dari request body atau URL parameter.
2. **Atomic Financial Transactions**:
   * Semua operasi mutasi saldo kas virtual dan perubahan unit portofolio pada saat transaksi jual/beli dieksekusi di dalam blok `prisma.$transaction()`.
3. **No Float for Money**:
   * Semua nominal mata uang menggunakan tipe data `BigInt` pada skema database dan diserialisasi ke `string` atau `number` aman via helper `serializeBigInt()`.
4. **Mandatory Simulation Disclaimer**:
   * Seluruh komponen antarmuka yang menampilkan aset simulasi menampilkan label peringatan edukasi bahwa nilai portofolio dan aset virtual tidak mewakili uang riil.

---

## 📄 Lisensi
Edukasi & Riset — Proyek FinZ.
