# WORKFLOW.md — SOP & Aturan Main Kolaborasi AI (FinZ Next.js Project)

Dokumen ini menetapkan prosedur operasional standar (*Standard Operating Procedure* / *Rules of Engagement*) bagi AI Coding Agent selama berkolaborasi dengan Developer dalam membangun aplikasi **FinZ** berbasis **Next.js**.

---

## 1. Prinsip Umum

1. **Context-First Execution:** Sebelum menulis atau memodifikasi kode apa pun, AI wajib membaca dan menyelaraskan solusi dengan spesifikasi di `PRD.md`, aturan di `AGENTS.md`, struktur di `ARCHITECTURE.md`, dan status terbaru di `TODO.md`.
2. **Incremental & Verifiable Delivery:** Kerjakan satu tugas atau satu modul secara tuntas dan teruji sebelum berpindah ke tugas berikutnya. Jangan mengubah puluhan file sekaligus tanpa verifikasi bertahap.
3. **Zero Regression & Type Safety:** Setiap kode yang ditulis harus menjaga keutuhan fitur yang sudah berjalan dan wajib lolos pemeriksaan tipe TypeScript (`tsc --noEmit`).
4. **Transparansi & Kejelasan Komunikasi:** Jelaskan secara ringkas file apa yang akan dibuat/diubah, alasan teknisnya, dan bagaimana cara mengujinya.

---

## 2. Kapan Wajib Minta Izin (Ask Permission First)

AI Coding Agent **WAJIB berhenti dan meminta persetujuan eksplisit** kepada pengguna sebelum melakukan tindakan berisiko tinggi berikut:

1. ⚠️ **Mengubah Skema Database (`prisma/schema.prisma`) secara Destruktif:**
   * Menghapus tabel, menghapus kolom, atau mengubah tipe data kolom yang berpotensi menghilangkan data yang sudah ada.
2. ⚠️ **Menambah atau Menghapus Dependency Utama (`package.json`):**
   * Menginstal library eksternal baru di luar daftar yang telah disetujui pada `ARCHITECTURE.md`.
3. ⚠️ **Menghapus File atau Folder Inti:**
   * Menghapus Route Handler, Service, atau komponen halaman yang sudah dibuat sebelumnya.
4. ⚠️ **Mengubah Konfigurasi Infrastruktur & Keamanan:**
   * Mengubah logika inti verifikasi token pada `src/middleware.ts`, pengaturan `next.config.ts`, atau menjalankan perintah deployment ke environment *production*.

---

## 3. Kapan Boleh Jalan Sendiri (Autonomous Actions)

AI Coding Agent **diizinkan bekerja secara mandiri (otonom)** tanpa perlu menunggu konfirmasi berlapis untuk tindakan aman berikut:

1. ✅ Membuat file Route Handler (`route.ts`), Service (`*.service.ts`), Validator (`*.schema.ts`), dan komponen React (`*.tsx`) baru sesuai pohon direktori di `ARCHITECTURE.md`.
2. ✅ Memperbaiki *bug* terisolasi, *error* kompilasi TypeScript, atau *linting warning* pada file yang sedang dikerjakan.
3. ✅ Menulis dan menjalankan *Unit Test* / *Integration Test* pada folder `tests/`.
4. ✅ Merapikan tampilan UI dengan *utility classes* Tailwind CSS agar lebih responsif dan sesuai tema visual FinZ.
5. ✅ Memperbarui status tugas pada `TODO.md` setelah menyelesaikan suatu pekerjaan.

---

## 4. Kriteria Selesai (Definition of Done / DoD)

Sebuah tugas atau fitur di dalam proyek FinZ **HANYA** boleh ditandai selesai (`[x]`) apabila seluruh syarat pada checklist berikut terpenuhi:

* [ ] **Memenuhi Acceptance Criteria PRD:** Seluruh kebutuhan fungsional, aturan bisnis (termasuk kalkulasi XP, batas anggaran, dan saldo virtual), serta *edge cases* di `PRD.md` telah terimplementasi.
* [ ] **Patuh Konvensi `AGENTS.md`:** Tidak ada penggunaan `any` / `@ts-ignore`, tidak ada *hardcoded secret*, dan tidak ada kebocoran kode server ke dalam komponen `"use client"`.
* [ ] **Data Isolation Terjamin:** Semua operasi baca/tulis database terikat secara ketat ke `userId` milik pengguna yang sedang login.
* [ ] **Bebas Error Build & Typecheck:** Kode lolos pemeriksaan TypeScript (`npx tsc --noEmit`) dan tidak menimbulkan error saat dijalankan pada Next.js.
* [ ] **Teruji (Tested):** Skenario *happy path* maupun *error handling* (input negatif, saldo kurang, akses tanpa login) telah diuji dan mengembalikan respons JSON standar.
* [ ] **`TODO.md` Diperbarui:** Status tugas terkait di dalam `TODO.md` telah diubah dari `[/]` menjadi `[x]`.

---

## 5. Protokol Pelaporan Setiap Sesi

Setiap kali AI Coding Agent selesai mengerjakan satu tugas dari `TODO.md`, AI wajib memberikan laporan penutup yang ringkas dengan format berikut:

1. **Tugas yang Diselesaikan:** Sebutkan ID dan nama tugas (contoh: `[x] TASK-05: Implementasi Auth Service & Route Handlers`).
2. **Daftar File yang Dibuat / Diperbarui:** Sebutkan path file secara spesifik.
3. **Ringkasan Teknis & Validasi:** Jelaskan secara singkat logika penting yang diterapkan (misal: validasi Zod, transaksi Prisma, atau proteksi JWT).
4. **Langkah Selanjutnya (Next Step):** Sebutkan tugas berikutnya pada antrean `TODO.md` dan tanyakan apakah pengguna siap melanjutkannya.