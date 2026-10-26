# ⚡ FinZ — Gamified Micro-Investing & Budgeting Platform

> **Platform Web Edukasi Pengelolaan Keuangan & Simulasi Investasi untuk Pemula dan Gen Z**  
> Menggabungkan pencatatan anggaran, target tabungan, misi gamifikasi (XP & Level), serta simulasi investasi menggunakan saldo virtual.

---

## 1. Studi Kasus

FinZ merupakan platform web edukasi keuangan yang membantu pengguna belajar mengatur pemasukan, pengeluaran, anggaran, dan target tabungan melalui fitur yang interaktif dan menyenangkan.

### Fitur Utama:
1. **Akun Pengguna (Register & Login)**: Data transaksi, anggaran, target tabungan, dan simulasi investasi tersimpan secara terpisah dan privat untuk setiap akun dengan keamanan password hash (bcrypt) dan autentikasi token JWT.
2. **Dashboard Keuangan**: Ringkasan pemasukan & pengeluaran bulanan, saldo virtual untuk simulasi, level pengguna, XP, streak aktif, dan progres target tabungan.
3. **Pencatatan Pemasukan & Pengeluaran**: Pengguna dapat menambahkan transaksi dengan kategori, keterangan, jumlah uang, dan tanggal, melihat riwayat transaksi, serta menghapus transaksi.
4. **Budgeting / Anggaran Bulanan**: Menentukan batas pengeluaran per kategori (Makanan & Minuman, Transportasi, Hiburan, dll). Sistem membandingkan jumlah pengeluaran riil dengan batas anggaran dan memberikan peringatan jika melebihi batas.
5. **Target Tabungan**: Menentukan nama tujuan, nominal target, dan target tanggal. Progres ditampilkan dalam bentuk nominal dan persentase, serta pengguna dapat menyetor tabungan bertahap.
6. **Gamifikasi (XP, Level, Misi & Kuis)**: Pengguna memperoleh XP dari aktivitas mencatat keuangan, membuat target tabungan, atau mencoba simulasi investasi. XP menaikkan level akun. Dilengkapi kuis literasi keuangan interaktif dengan penjelasan edukatif.
7. **Simulasi Investasi Virtual**: Pengguna dapat mempelajari konsep unit aset, saldo, pembelian, penjualan, dan portofolio menggunakan **uang virtual gratis (Rp 5.000.000)** tanpa risiko uang nyata.
8. **Riwayat Simulasi Investasi**: Transparansi histori pembelian & penjualan aset simulasi, harga contoh, unit yang ditransaksikan, serta saldo virtual setelah transaksi.

> **Catatan Penting**: FinZ merupakan **platform edukasi**, bukan layanan keuangan atau rekomendasi investasi. Saldo virtual dan harga aset contoh hanya digunakan untuk tujuan latihan.

---

## 2. Latar Belakang

Kemampuan mengelola keuangan merupakan keterampilan penting yang perlu dipelajari sejak dini. Namun, sebagian orang masih kesulitan membedakan kebutuhan dan keinginan, mengatur pengeluaran, menentukan target tabungan, serta memahami konsep dasar investasi.

Pencatatan keuangan secara manual seringkali tidak konsisten dan membosankan. Di sisi lain, mencoba investasi langsung dengan uang nyata tanpa pemahaman yang cukup berisiko menimbulkan kerugian finansial.

FinZ hadir sebagai jembatan pembelajaran yang aman dan menyenangkan melalui konsep gamifikasi (XP, level, dan misi harian) serta simulasi portofolio tanpa risiko.

---

## 3. Arsitektur & Teknologi

FinZ telah berevolusi menjadi arsitektur produksi modern berbasis **Next.js 15 (App Router)** di direktori `finz-nextjs/` dengan basis data terintegrasi **MySQL** via Prisma ORM:

### FinZ Next.js 15 (App Router Edition) — `finz-nextjs/`
- **Framework:** Next.js 15.3.3 (App Router, Server & Client Components)
- **Frontend & UI:** React 19, Tailwind CSS, Lucide React, Recharts
- **Backend API:** Next.js Route Handlers (`src/app/api/.../route.ts`)
- **Database & ORM:** MySQL dengan Prisma ORM 6.9 (`finz_db`)
- **Autentikasi & Keamanan:** Edge-compatible JWT via `jose`, bcryptjs, dan validasi skema Zod
- **Representasi Uang:** `BigInt` pada seluruh nominal Rupiah (bebas floating-point error)
- **Testing:** 27 Unit Tests (`node --import tsx --test`)
- **Simulasi Investasi:** Transaksi atomik `prisma.$transaction()` & `<SimulationDisclaimer />`

### Prototype Legacy — `server/` & `client/`
- Server prototipe Express 5 & Client Vite + React (arsitektur fase inisial).

---

## 4. Cara Menjalankan

### A. Menjalankan FinZ Next.js 15 (Direkomendasikan)
```bash
cd finz-nextjs

# 1. Konfigurasi environment (sudah disesuaikan ke MySQL)
# Database URL: mysql://root:@localhost:3306/finz_db

# 2. Sinkronisasi database & data awal (Aset & Misi)
npm run db:push
npm run db:seed

# 3. Jalankan unit test
npm test

# 4. Jalankan development server
npm run dev
# Akses di http://localhost:3000

# 5. Atau jalankan production build
npm run build
npm run start
```

### B. Menjalankan Prototype Legacy (Express + Vite)
```bash
# Backend Express di port 5000
npm start

# Frontend Vite di port 5173
npm run client
```
