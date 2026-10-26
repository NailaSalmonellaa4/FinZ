# SKILL.md — Pustaka Pola Prompt Berulang (Next.js Prompt Library FinZ)

Dokumen ini berisi kumpulan template prompt standar yang siap digunakan oleh Developer maupun AI Coding Agent untuk menjaga kualitas pengujian, keamanan, performa, dan dokumentasi selama pengembangan **FinZ** berbasis **Next.js (App Router) & TypeScript**.

---

## 1. Testing Prompts (Unit & Integration Testing)

### 1.1 Prompt: Generate Service & Next.js Route Handler Test
> **Gunakan prompt ini setelah menyelesaikan satu modul fitur di `src/server/services/` atau `src/app/api/`:**
>
> "Bertindaklah sebagai Senior QA Automation Engineer. Buatkan rangkaian pengujian otomatis menggunakan **Vitest** untuk service dan Next.js Route Handler modul `[NAMA_MODUL, misal: Virtual Investment / Budgeting]` pada proyek FinZ.
> Pastikan pengujian mencakup:
> 1. **Happy Path**: Skenario sukses sesuai `PRD.md`, termasuk verifikasi penambahan XP, serialisasi `BigInt`, dan pembaruan state database.
> 2. **Validation & Edge Cases**: Payload JSON dengan nominal $0$, angka negatif, string kosong, atau tipe data tidak valid harus ditolak oleh `Zod` dan mengembalikan HTTP `400 Bad Request`.
> 3. **Business Logic Constraints**: (Khusus Investasi) Pembelian aset ketika `totalAmount > virtualBalance` harus gagal dan saldo tidak boleh berubah; penjualan unit melebihi kepemilikan portofolio harus ditolak.
> 4. **Security & Data Isolation (IDOR Check)**: Pastikan User A tidak dapat membaca, mengubah, atau menghapus data milik User B (harus mengembalikan `403` atau `404`)."

### 1.2 Checklist Manual & Automated Test per Modul
* [ ] **Auth & Middleware**: Register email duplikat ditolak (`409`); Login password salah ditolak (`401`); Akses halaman `/dashboard` atau endpoint `/api/*` privat tanpa sesi JWT valid ditolak/di-redirect.
* [ ] **Budgeting**: Pengeluaran $\text{Rp}85.000$ dari batas anggaran $\text{Rp}100.000$ menghasilkan persentase $85\%$ dengan status `WARNING`.
* [ ] **Savings**: Kontribusi yang membuat `currentAmount >= targetAmount` otomatis mengubah status menjadi `COMPLETED`.
* [ ] **Investment**: Transaksi `BUY` mengurangi `virtualBalance`, menambah `units` di `Portfolio`, menghitung ulang `averageBuyPrice`, dan mencatat `balanceAfter` yang akurat di `InvestmentHistory`.

---

## 2. Security Review Prompts (Audit Keamanan Next.js)

### 2.1 Prompt: Next.js App Router & API Security Audit
> **Gunakan prompt ini sebelum menandai tugas selesai:**
>
> "Lakukan audit keamanan menyeluruh (berdasarkan standar OWASP Top 10 dan Next.js Security Best Practices) terhadap file `[NAMA_FILE]`. Periksa dan perbaiki jika ditemukan celah berikut:
> 1. **Broken Access Control (IDOR)**: Apakah setiap query Prisma (`findUnique`, `findMany`, `update`, `delete`) sudah memfilter secara ketat berdasarkan `userId` dari sesi JWT yang terverifikasi (`getAuthUser`)?
> 2. **Server/Client Boundary Leak**: Apakah ada variabel environment rahasia atau query Prisma yang tidak sengaja diimpor ke dalam Client Component (`"use client"`)?
> 3. **Injection & Input Validation**: Apakah seluruh input dari `await request.json()`, `searchParams`, dan `params` sudah divalidasi dengan skema `Zod`?
> 4. **Sensitive Data Exposure**: Apakah `passwordHash` sudah dikecualikan (`omit` / `select` eksplisit) dari objek User sebelum dikirim melalui `NextResponse.json()`?"

---

## 3. Refactoring & Performance Prompts

### 3.1 Prompt: Prisma Query & Next.js Route Optimization
> **Gunakan prompt ini untuk mengoptimalkan endpoint Dashboard dan Simulasi Investasi:**
>
> "Review kode pada `[NAMA_FILE_SERVICE_ATAU_ROUTE]`. Optimalkan performa dan kebersihan kode TypeScript dengan ketentuan berikut:
> 1. Gabungkan query Prisma yang independen pada layanan Dashboard menggunakan `Promise.all()` untuk memangkas *latency*.
> 2. Gunakan agregasi tingkat database (`prisma.transaction.groupBy` atau `aggregate`) alih-alih menarik ribuan baris transaksi ke memori Node.js hanya untuk menghitung total pemasukan/pengeluaran.
> 3. Pastikan operasi multi-tabel (seperti jual/beli aset + tambah XP) dibungkus dalam `prisma.$transaction()` agar bebas dari *race condition*.
> 4. Pastikan seluruh tipe data TypeScript terdefinisi secara ketat tanpa penggunaan `any`."

### 3.2 Prompt: React Component & App Router Refactoring
> **Gunakan prompt ini untuk merapikan komponen UI di `src/components/` dan `src/app/`:**
>
> "Refactor komponen Next.js pada `[NAMA_FILE_TSX]` agar lebih modular, bersih, dan responsif:
> 1. Pecah komponen yang terlalu besar ($> 250$ baris) menjadi sub-komponen kecil dengan tanggung jawab tunggal (*Single Responsibility*).
> 2. Pastikan setiap form dan tombol aksi (*submit*, beli/jual aset) memiliki *loading state* (`isSubmitting`) dan dinonaktifkan sementara saat request berlangsung untuk mencegah *double submission*.
> 3. Pastikan tampilan tabel dan kartu ringkasan tetap rapi di layar mobile maupun desktop menggunakan *responsive prefixes* Tailwind CSS (`sm:`, `md:`, `lg:`)."

---

## 4. Documentation Prompts

### 4.1 Prompt: Next.js API Route & Component Documentation
> **Gunakan prompt ini setiap kali selesai membuat Route Handler atau komponen kunci:**
>
> "Buatkan dokumentasi teknis singkat dan presisi untuk `[NAMA_FILE_ROUTE_ATAU_KOMPONEN]` dengan format:
> - **Method & Route Path** (atau Nama Komponen & Props Interface)
> - **Authentication Required** (Yes/No - JWT Cookie/Bearer)
> - **Zod Validation Schema / Request Payload**
> - **Success Response Example (`200 OK` / `201 Created`)**
> - **Error Response Examples (`400`, `401`, `403`, `404`, `409`)**"