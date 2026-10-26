# ARCHITECTURE.md — Rencana Implementasi & Struktur Sistem FinZ (Next.js Edition)

Dokumen ini mendefinisikan cetak biru arsitektur, pemilihan teknologi berbasis **Next.js (App Router)**, struktur direktori proyek, skema database relasional, serta tahapan implementasi untuk platform **FinZ (Gamified Micro-Investing & Budgeting)**.

---

## 1. Tech Stack Overview

| Layer | Teknologi | Kegunaan & Alasan Pemilihan |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 15 (App Router) + TypeScript | Menyediakan arsitektur Full-Stack terpadu (UI React + REST API Route Handlers) dengan *type-safety* tinggi dan performa optimal. |
| **Frontend UI & Styling** | React 19 + Tailwind CSS + Lucide React | Membangun komponen antarmuka yang modular, responsif, dan bertema gamifikasi tanpa ketergantungan CSS eksternal yang berat. |
| **Data Visualization** | Recharts | Menampilkan grafik interaktif berbasis komponen React untuk perbandingan pemasukan vs pengeluaran dan alokasi portofolio. |
| **Backend REST API** | Next.js Route Handlers (`/api/*`) + Service Layer | Mengimplementasikan endpoint REST API terstruktur yang memisahkan *Route/Controller*, *Middleware*, dan *Business Logic Service*. |
| **Database & ORM** | PostgreSQL / MySQL + Prisma ORM | Menyimpan data pengguna, transaksi, anggaran, tabungan, gamifikasi, dan portofolio dengan dukungan transaksi atomik (`ACID`). |
| **Authentication & Security** | `jose` (JWT) + `bcryptjs` + Next.js Middleware | Mengamankan akun dengan *password hashing* dan memvalidasi token JWT di `HttpOnly` Cookie / `Bearer` Header pada level Edge Middleware. |
| **Validation** | `zod` | Memvalidasi seluruh input form di sisi client dan payload JSON di sisi server secara konsisten. |
| **Testing** | Vitest + React Testing Library | Menguji unit fungsi logika bisnis (XP, anggaran, portofolio) serta integrasi komponen dan endpoint API. |

---

## 2. Project Directory Structure

```text
finz-nextjs/
├── prisma/
│   ├── schema.prisma                  # Definisi 9 tabel database & relasi
│   └── seed.ts                        # Script seeding katalog aset contoh & daftar misi awal
├── public/
│   └── images/                        # Aset gambar statis, logo FinZ, dan ikon badge level
├── src/
│   ├── middleware.ts                  # Next.js Edge Middleware untuk proteksi rute & verifikasi JWT
│   ├── app/
│   │   ├── layout.tsx                 # Root layout, font setup, dan Global Toast/Notification Provider
│   │   ├── page.tsx                   # Landing page FinZ & pengenalan fitur edukasi
│   │   ├── globals.css                # Konfigurasi Tailwind CSS & custom theme variables
│   │   ├── (auth)/                    # Route group untuk halaman autentikasi publik
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Halaman Login
│   │   │   └── register/
│   │   │       └── page.tsx           # Halaman Registrasi Akun Baru
│   │   ├── (dashboard)/               # Route group terproteksi dengan Sidebar & Navbar Gamifikasi
│   │   │   ├── layout.tsx             # Layout utama aplikasi (Navbar XP/Level + Sidebar Navigasi)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx           # Halaman Dashboard Ringkasan Keuangan & Gamifikasi
│   │   │   ├── transactions/
│   │   │   │   └── page.tsx           # Halaman Pencatatan Pemasukan & Pengeluaran
│   │   │   ├── budgets/
│   │   │   │   └── page.tsx           # Halaman Pengaturan & Pemantauan Anggaran Bulanan
│   │   │   ├── savings/
│   │   │   │   └── page.tsx           # Halaman Target Tabungan & Kontribusi Progres
│   │   │   ├── investments/
│   │   │   │   └── page.tsx           # Halaman Simulasi Investasi Virtual, Portofolio & Riwayat
│   │   │   └── missions/
│   │   │       └── page.tsx           # Halaman Misi Gamifikasi, Level & Panduan Literasi/FAQ
│   │   └── api/                       # Backend REST API (Next.js Route Handlers / Controllers)
│   │       ├── auth/
│   │       │   ├── register/route.ts  # POST /api/auth/register
│   │       │   ├── login/route.ts     # POST /api/auth/login
│   │       │   ├── logout/route.ts    # POST /api/auth/logout
│   │       │   └── me/route.ts        # GET /api/auth/me
│   │       ├── dashboard/
│   │       │   └── route.ts           # GET /api/dashboard
│   │       ├── transactions/
│   │       │   ├── route.ts           # GET, POST /api/transactions
│   │       │   └── [id]/route.ts      # DELETE /api/transactions/[id]
│   │       ├── budgets/
│   │       │   └── route.ts           # GET, POST /api/budgets
│   │       ├── savings/
│   │       │   ├── route.ts           # GET, POST /api/savings
│   │       │   └── [id]/contribute/route.ts # POST /api/savings/[id]/contribute
│   │       ├── missions/
│   │       │   └── route.ts           # GET /api/missions
│   │       └── investments/
│   │           ├── assets/route.ts    # GET /api/investments/assets
│   │           ├── buy/route.ts       # POST /api/investments/buy
│   │           ├── sell/route.ts      # POST /api/investments/sell
│   │           ├── portfolio/route.ts # GET /api/investments/portfolio
│   │           ├── history/route.ts   # GET /api/investments/history
│   │           └── simulate/route.ts  # POST /api/investments/simulate (Simulasi fluktuasi harga contoh)
│   ├── components/
│   │   ├── ui/                        # Komponen UI dasar reusable (Button, Card, Modal, Input, Badge, ProgressBar)
│   │   ├── layout/                    # Navbar, Sidebar,XpHeaderBar, SimulationDisclaimer
│   │   ├── dashboard/                 # CashflowChart, SummaryCards, RecentActivityList
│   │   ├── finance/                   # TransactionForm, BudgetCard, SavingsGoalCard
│   │   ├── investment/                # AssetCatalogCard, TradeModal, PortfolioTable, TradeHistoryTable
│   │   └── gamification/              # MissionCard, LevelUpModal, XpToast
│   ├── server/                        # Layer Backend Terpusat (Hanya berjalan di Server)
│   │   ├── services/                  # Business Logic Layer
│   │   │   ├── auth.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── budget.service.ts
│   │   │   ├── savings.service.ts
│   │   │   ├── gamification.service.ts
│   │   │   └── investment.service.ts
│   │   ├── validators/                # Skema validasi Zod untuk seluruh input API
│   │   │   ├── auth.schema.ts
│   │   │   ├── finance.schema.ts
│   │   │   └── investment.schema.ts
│   │   └── utils/
│   │       ├── api-response.ts        # Helper standarisasi respons JSON & penanganan error
│   │       └── auth-session.ts        # Helper ekstraksi & verifikasi JWT di Route Handlers
│   ├── lib/
│   │   ├── prisma.ts                  # Singleton instance PrismaClient
│   │   ├── jwt.ts                     # Fungsi sign & verify JWT menggunakan library jose
│   │   └── formatters.ts              # Helper format mata uang Rupiah (IDR), tanggal, dan serialisasi BigInt
│   └── types/
│       └── index.ts                   # Definisi tipe data TypeScript bersama (DTO & API Responses)
├── tests/                             # Unit & Integration tests (Vitest)
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Data Models / Database Schema

Berikut adalah rancangan skema database relasional (`prisma/schema.prisma`) yang mendukung seluruh fitur FinZ:

```prisma
datasource db {
  provider = "postgresql" // Dapat disesuaikan ke "mysql" sesuai environment
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum TransactionType {
  INCOME
  EXPENSE
}

enum SavingsStatus {
  ACTIVE
  COMPLETED
}

enum InvestmentTradeType {
  BUY
  SELL
}

enum MissionType {
  RECORD_TRANSACTION
  CREATE_BUDGET
  CREATE_SAVINGS
  SIMULATE_INVESTMENT
}

// 1. Tabel Pengguna (Menyimpan Kredensial, Level, XP, dan Saldo Virtual)
model User {
  id              String   @id @default(uuid())
  name            String
  email           String   @unique
  passwordHash    String   @map("password_hash")
  level           Int      @default(1)
  xp              Int      @default(0)
  virtualBalance  BigInt   @default(10000000) @map("virtual_balance") // Default Rp 10.000.000
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  transactions       Transaction[]
  budgets            Budget[]
  savingsGoals       SavingsGoal[]
  portfolios         Portfolio[]
  investmentHistory  InvestmentHistory[]
  userMissions       UserMission[]

  @@map("users")
}

// 2. Tabel Pencatatan Pemasukan & Pengeluaran
model Transaction {
  id              String          @id @default(uuid())
  userId          String          @map("user_id")
  type            TransactionType
  category        String          // Contoh: Makanan, Transportasi, Hiburan, Belajar, Uang Saku
  amount          BigInt          // Dalam Rupiah penuh (> 0)
  description     String
  transactionDate DateTime        @map("transaction_date")
  createdAt       DateTime        @default(now()) @map("created_at")

  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, transactionDate])
  @@map("transactions")
}

// 3. Tabel Anggaran Bulanan (Budgeting)
model Budget {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  category    String
  limitAmount BigInt   @map("limit_amount")
  month       Int      // 1 - 12
  year        Int      // Contoh: 2026
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, category, month, year])
  @@map("budgets")
}

// 4. Tabel Target Tabungan (Savings Goals)
model SavingsGoal {
  id            String        @id @default(uuid())
  userId        String        @map("user_id")
  title         String
  targetAmount  BigInt        @map("target_amount")
  currentAmount BigInt        @default(0) @map("current_amount")
  targetDate    DateTime?     @map("target_date")
  status        SavingsStatus @default(ACTIVE)
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("savings_goals")
}

// 5. Tabel Master Aset Simulasi Investasi (Harga Contoh untuk Edukasi)
model VirtualAsset {
  id           String   @id @default(uuid())
  code         String   @unique // Contoh: RDPU-EDU, SAHAM-EDU, EMAS-EDU
  name         String   // Contoh: Reksa Dana Pasar Uang Edukasi
  category     String   // Reksa Dana, Saham Edukasi, Emas Virtual
  riskProfile  String   @map("risk_profile") // Rendah, Sedang, Tinggi
  currentPrice BigInt   @map("current_price") // Harga contoh per unit dalam Rupiah
  description  String
  updatedAt    DateTime @updatedAt @map("updated_at")

  portfolios        Portfolio[]
  investmentHistory InvestmentHistory[]

  @@map("virtual_assets")
}

// 6. Tabel Portofolio Simulasi Pengguna
model Portfolio {
  id              String       @id @default(uuid())
  userId          String       @map("user_id")
  assetId         String       @map("asset_id")
  units           Decimal      @db.Decimal(18, 4) // Mendukung pecahan unit
  averageBuyPrice BigInt       @map("average_buy_price")
  updatedAt       DateTime     @updatedAt @map("updated_at")

  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  asset           VirtualAsset @relation(fields: [assetId], references: [id], onDelete: Restrict)

  @@unique([userId, assetId])
  @@map("portfolios")
}

// 7. Tabel Riwayat Transaksi Simulasi Investasi
model InvestmentHistory {
  id             String              @id @default(uuid())
  userId         String              @map("user_id")
  assetId        String              @map("asset_id")
  tradeType      InvestmentTradeType @map("trade_type") // BUY atau SELL
  units          Decimal             @db.Decimal(18, 4)
  pricePerUnit   BigInt              @map("price_per_unit")
  totalAmount    BigInt              @map("total_amount")
  balanceAfter   BigInt              @map("balance_after") // Saldo virtual setelah transaksi
  createdAt      DateTime            @default(now()) @map("created_at")

  user           User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  asset          VirtualAsset        @relation(fields: [assetId], references: [id], onDelete: Restrict)

  @@index([userId, createdAt])
  @@map("investment_history")
}

// 8. Tabel Master Misi Gamifikasi
model Mission {
  id          String      @id @default(uuid())
  title       String
  description String
  missionType MissionType @map("mission_type")
  targetCount Int         @map("target_count") // Jumlah aksi yang harus dicapai
  xpReward    Int         @map("xp_reward")
  createdAt   DateTime    @default(now()) @map("created_at")

  userMissions UserMission[]

  @@map("missions")
}

// 9. Tabel Progres Misi Pengguna
model UserMission {
  id           String    @id @default(uuid())
  userId       String    @map("user_id")
  missionId    String    @map("mission_id")
  currentCount Int       @default(0) @map("current_count")
  isCompleted  Boolean   @default(false) @map("is_completed")
  completedAt  DateTime? @map("completed_at")

  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  mission      Mission   @relation(fields: [missionId], references: [id], onDelete: Cascade)

  @@unique([userId, missionId])
  @@map("user_missions")
}
```

---

## 4. Implementation Phases

### Fase 1: Next.js Setup, Database & Auth Middleware (P0)
* Inisialisasi proyek Next.js 15 (TypeScript + Tailwind CSS), konfigurasi Prisma ORM, dan migrasi skema database.
* Buat `prisma/seed.ts` untuk mengisi data awal aset investasi contoh (`VirtualAsset`) dan daftar misi edukasi (`Mission`).
* Implementasi `src/lib/jwt.ts` (`jose`), Route Handlers `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, serta `src/middleware.ts` untuk proteksi rute halaman & API.
* **Acceptance Criteria:** Pengguna dapat registrasi dan otomatis memperoleh saldo virtual $\text{Rp}10.000.000$, login menerima cookie/token JWT, dan halaman `/dashboard` otomatis me-redirect pengguna yang belum login ke `/login`.

### Fase 2: Backend Services & API Route Handlers — Keuangan & Gamifikasi (P0)
* Implementasi `gamification.service.ts` untuk kalkulasi XP, kenaikan level ($\lfloor \text{XP}/100 \rfloor + 1$), dan progres misi.
* Implementasi Service dan Route Handlers untuk Transaksi (`/api/transactions`), Budgeting (`/api/budgets`), dan Target Tabungan (`/api/savings`).
* **Acceptance Criteria:** Seluruh input tervalidasi dengan `Zod`; pengeluaran per kategori otomatis dihitung terhadap batas anggaran; setiap aktivitas yang valid memicu penambahan XP pengguna.

### Fase 3: Virtual Investment Simulation Engine (P0)
* Implementasi `investment.service.ts` dan Route Handlers (`/api/investments/assets`, `buy`, `sell`, `portfolio`, `history`).
* Gunakan `prisma.$transaction()` untuk memastikan pemotongan/penambahan `virtualBalance`, update `units` serta `averageBuyPrice` di portofolio, dan pencatatan `balanceAfter` di riwayat berjalan secara atomik.
* **Acceptance Criteria:** Pembelian melebihi saldo virtual ditolak (`400`); penjualan melebihi unit yang dimiliki ditolak (`400`); riwayat simulasi mencatat harga contoh dan saldo akhir secara presisi.

### Fase 4: Next.js App Router UI & Dashboard Integration (P0)
* Bangun layout utama `(dashboard)/layout.tsx` lengkap dengan Sidebar navigasi dan Header bar status Level, XP Progress Bar, serta Saldo Virtual.
* Bangun halaman `/dashboard`, `/transactions`, `/budgets`, `/savings`, `/investments`, dan `/missions` menggunakan React Server/Client Components dan Tailwind CSS.
* **Acceptance Criteria:** Seluruh halaman terhubung dengan Route Handlers, menampilkan *Toast XP* saat pengguna mendapatkan XP baru, serta menampilkan komponen `<SimulationDisclaimer />`.

### Fase 5: Charts, Market Simulation & Testing Polish (P1 & P2)
* Integrasikan grafik `recharts` pada Dashboard, fitur simulasi fluktuasi harga contoh (`/api/investments/simulate`), modal selebrasi *Level Up*, dan pengujian otomatis dengan Vitest.
* **Acceptance Criteria:** `npm run build` dan `npx tsc --noEmit` berjalan sukses tanpa error sedikit pun.