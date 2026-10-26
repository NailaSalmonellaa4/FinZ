# AGENTS.md — Aturan Teknis & Konvensi Koding AI (FinZ Next.js Project)

Dokumen ini adalah sumber kebenaran teknis (*Single Source of Truth*) yang **WAJIB** dibaca dan dipatuhi oleh AI Coding Agent (Claude, Cursor, Windsurf, Copilot, dll.) pada setiap sesi pengerjaan kode proyek **FinZ**.

---

## 1. Project Identity

* **Project Name:** FinZ (Gamified Micro-Investing & Budgeting)
* **Project Type:** Full-Stack Web Application berbasis **Next.js (App Router)** dengan RESTful API Route Handlers.
* **Core Domain:** Edukasi Literasi Keuangan, *Budgeting*, Target Tabungan, Gamifikasi (XP/Level/Misi), dan Simulasi Investasi Virtual.
* **Tech Stack Utama:**
  * **Framework:** Next.js 15 (App Router) dengan TypeScript (`strict: true`).
  * **Frontend & UI:** React 19, Tailwind CSS, `lucide-react` (ikon), `recharts` (visualisasi grafik keuangan).
  * **Backend REST API:** Next.js Route Handlers (`src/app/api/.../route.ts`) dengan arsitektur berlapis (`Middleware -> Route Handler / Controller -> Service Layer -> Prisma ORM`).
  * **Database & ORM:** PostgreSQL / MySQL dengan Prisma ORM.
  * **Authentication & Validation:** `jose` (JWT untuk kompatibilitas penuh dengan Next.js Edge Runtime / Middleware), `bcryptjs` (hashing password), dan `zod` (validasi skema data).
* **Karakter Desain & UI:**
  * *Youth-Friendly, Energetic & Trustworthy*: Menggabungkan kesan profesional finansial (Slate/Navy & Biru) dengan aksen gamifikasi yang cerah (Amber/Gold untuk XP & Level, Emerald untuk profit/tabungan aman, Rose/Crimson untuk *overbudget*).
  * Setiap halaman yang berkaitan dengan investasi **wajib** menampilkan komponen `<SimulationDisclaimer />` bahwa saldo dan harga aset adalah simulasi edukasi.

---

## 2. Tech Stack Notice (Next.js App Router Guardrails)

1. **Next.js App Router (`src/app`) — Bukan Pages Router:**
   * Gunakan konvensi App Router (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, dan `route.ts`). **Dilarang** membuat folder `src/pages/` atau menggunakan `getServerSideProps` / `getStaticProps`.
2. **Server Components vs. Client Components:**
   * Secara default, semua komponen di App Router adalah **React Server Components (RSC)**.
   * Tambahkan direktif `"use client"` di baris paling atas **hanya** pada komponen yang membutuhkan interaktivitas browser (`useState`, `useEffect`, *event listeners* `onClick`/`onSubmit`, atau grafik `recharts`).
3. **Next.js 15 Async Request APIs:**
   * Pada Next.js 15, `cookies()`, `headers()`, dan `params` pada halaman/route dinamis bersifat **asynchronous**. Selalu gunakan `await cookies()` dan `const { id } = await context.params` di dalam Route Handlers maupun Server Components.
4. **Prisma Client Singleton & Monetary Types:**
   * Selalu impor instance Prisma dari `src/lib/prisma.ts` (pola *global singleton*) untuk mencegah *connection exhaustion* saat *hot-reload* di mode development.
   * Gunakan `BigInt` atau `Decimal` untuk seluruh nominal uang (`amount`, `virtualBalance`, `pricePerUnit`) dan konversikan secara eksplisit ke `Number` atau `string` terformat melalui helper serialisasi sebelum dikirim melalui `NextResponse.json()`. **Dilarang menggunakan tipe `Float`** untuk perhitungan uang.
5. **Edge-Compatible Middleware:**
   * File `src/middleware.ts` berjalan di Edge Runtime. Gunakan library `jose` (`jwtVerify`, `SignJWT`) untuk verifikasi JWT di middleware, bukan `jsonwebtoken` bawaan Node.js yang tidak mendukung Edge Runtime.

---

## 3. Coding Conventions & Best Practices

### 3.1 Naming Conventions
* **Directories & Route Segments:** Gunakan `kebab-case` (contoh: `src/app/(dashboard)/savings-goals/page.tsx`).
* **React Components:** Gunakan `PascalCase` untuk nama file dan fungsi komponen (contoh: `XpProgressBar.tsx`, `PortfolioTable.tsx`).
* **Services, Controllers, & Utilities:** Gunakan `camelCase` atau `kebab-case` dengan akhiran peran yang jelas (contoh: `investment.service.ts`, `gamification.service.ts`, `format-currency.ts`).
* **Variables & Functions:** Gunakan `camelCase` dengan tipe TypeScript yang eksplisit.
* **Constants & Enum Values:** Gunakan `UPPER_SNAKE_CASE` (contoh: `INITIAL_VIRTUAL_BALANCE`, `XP_REWARDS`).

### 3.2 Layered Backend Architecture inside Next.js
Agar tetap memenuhi kaidah pemisahan *Route, Middleware, Controller/Handler, Service, dan Database*:
* **Route Handler (`src/app/api/.../route.ts`)**: Bertindak sebagai *Controller* dan definisi *Endpoint Route*. Tugasnya hanya mengekstrak request, memvalidasi sesi user dari middleware/helper auth, memvalidasi input menggunakan skema `Zod`, memanggil `Service`, dan mengembalikan `NextResponse.json()`.
* **Service Layer (`src/server/services/*.service.ts`)**: Berisi logika bisnis murni (kalkulasi anggaran, pemberian XP & kenaikan level, eksekusi simulasi jual/beli aset dengan `prisma.$transaction`).
* **Standardized API Response Format:**
  Semua Route Handlers wajib mengembalikan struktur JSON yang seragam menggunakan helper `apiResponse()`:
  ```json
  {
    "success": true,
    "message": "Transaksi berhasil dicatat",
    "data": { ... },
    "meta": { "xpGained": 10, "leveledUp": false, "currentLevel": 2 }
  }
  ```

### 3.3 Strict TypeScript & Validation
* Setiap payload request wajib memiliki skema `Zod` di `src/server/validators/` dan tipe TypeScript-nya diturunkan menggunakan `z.infer<typeof schema>`.
* Hindari duplikasi definisi tipe antara frontend dan backend; gunakan tipe bersama di `src/types/`.

---

## 4. Core Rules ("Never Do This")

AI Coding Agent **DILARANG KERAS** melakukan hal-hal berikut:

1. 🚫 **NEVER Bypass TypeScript Type Checking:**
   * Dilarang menggunakan `any`, `@ts-ignore`, atau `@ts-expect-error`. Definisikan interface/type yang tepat.
2. 🚫 **NEVER Import Prisma or Server Services Inside `"use client"` Components:**
   * Komponen berlabel `"use client"` hanya boleh berinteraksi dengan data melalui `fetch('/api/...')` atau menerima data melalui *props* dari Server Component.
3. 🚫 **NEVER Trust `userId` from Request Body or Query Params:**
   * Jangan pernah mengambil `userId` dari `req.json()` atau query URL untuk operasi baca/tulis data. Selalu ambil `userId` secara eksklusif dari sesi JWT yang telah diverifikasi oleh server (`getAuthUser(req)`).
4. 🚫 **NEVER Hardcode Secrets or Credentials:**
   * Dilarang menulis `JWT_SECRET` atau `DATABASE_URL` secara langsung di dalam kode. Gunakan `process.env` dan jangan pernah mengekspos variabel rahasia menggunakan awalan `NEXT_PUBLIC_`.
5. 🚫 **NEVER Mutate Virtual Balance Outside a Database Transaction:**
   * Seluruh perubahan `virtualBalance`, `Portfolio`, dan `InvestmentHistory` wajib dibungkus di dalam satu blok `prisma.$transaction()`.
6. 🚫 **NEVER Add Unapproved Third-Party Libraries:**
   * Dilarang menginstal package npm baru di luar spesifikasi `ARCHITECTURE.md` tanpa meminta izin terlebih dahulu kepada developer.