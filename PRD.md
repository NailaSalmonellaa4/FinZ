# Product Requirement Document (PRD) — FinZ (Gamified Micro-Investing & Budgeting)

**Project Name:** FinZ (Gamified Micro-Investing & Budgeting)  
**Team:** Tim FinZ  
**Document Version:** 2.0.0 (Next.js App Router Edition)  
**Status:** Approved for MVP Development  

---

## 1. Problem Statement

Kemampuan mengelola keuangan pribadi merupakan keterampilan hidup yang krusial untuk dibangun sejak usia pelajar (SMP/SMA/SMK). Namun, mayoritas pelajar dan pemula masih menghadapi tiga masalah utama (*pain points*):
1. **Kesulitan Mengontrol Arus Kas & Anggaran:** Pemula sering kali gagal membedakan antara kebutuhan dan keinginan, sehingga pengeluaran melampaui batas anggaran (*overbudget*) dan target tabungan gagal tercapai.
2. **Ketidakkonsistenan Pencatatan Manual:** Mencatat keuangan secara manual terasa membosankan dan repetitif, menyebabkan pengguna cepat berhenti mencatat di tengah jalan dan kehilangan jejak finansial mereka.
3. **Ketakutan & Risiko Kerugian dalam Belajar Investasi:** Konsep investasi (unit aset, portofolio, fluktuasi harga) terasa rumit dan mengintimidasi bagi pemula. Mencoba terjun langsung menggunakan uang sungguhan tanpa literasi yang matang berisiko menimbulkan kerugian finansial nyata.

**Dampak Masalah:** Tanpa media pembelajaran yang aman, terstruktur, dan memotivasi, generasi muda rentan terjebak dalam perilaku konsumtif, gagal membangun dana tabungan, serta rentan terhadap kesalahan keputusan investasi.

**Solusi FinZ:** Platform aplikasi web modern berbasis **Next.js** yang menyatukan pencatatan transaksi, pengelolaan anggaran bulanan (*budgeting*), pelacakan target tabungan (*saving goals*), dan simulasi investasi menggunakan **saldo virtual** serta **data harga contoh**, yang dibalut dengan mekanisme **gamifikasi (XP, Level, dan Misi)** untuk membentuk kebiasaan finansial secara menyenangkan dan bebas risiko.

> **Disclaimer Produk:** FinZ murni merupakan platform edukasi literasi keuangan, bukan layanan keuangan berizin ataupun pemberi rekomendasi investasi. Seluruh saldo investasi dan harga aset di dalam platform bersifat virtual/simulasi untuk tujuan pembelajaran.

---

## 2. Goals & Objectives

| Goal | Metrik Keberhasilan (Success Metrics) | Target Terukur (MVP) |
| :--- | :--- | :--- |
| **Meningkatkan Konsistensi Pencatatan Keuangan** | Persentase pengguna aktif yang mencatat minimal $5$ transaksi dan menyelesaikan minimal $1$ misi mingguan. | $\ge 70\%$ dari total pengguna terdaftar pada sesi pengujian. |
| **Membantu Disiplin Anggaran & Tabungan** | Persentase pengguna yang berhasil membuat minimal $1$ kategori anggaran bulanan dan $1$ target tabungan aktif. | $\ge 80\%$ dari pengguna baru dalam $7$ hari pertama. |
| **Menurunkan Hambatan Belajar Investasi** | Persentase pengguna yang melakukan minimal $2$ transaksi simulasi (beli/jual aset virtual) tanpa kebingungan alur UI. | $\ge 75\%$ pengguna mencoba fitur simulasi investasi. |
| **Keandalan & Keamanan Isolasi Data** | Tingkat keberhasilan autentikasi JWT pada Next.js Middleware dan isolasi data antar-pengguna pada Route Handlers REST API. | $100\%$ endpoint terproteksi dari akses lintas akun (*zero unauthorized data leak*). |

---

## 3. Target Users

### Persona 1: Andi — Pelajar SMK/SMA ($16$ Tahun)
* **Peran:** Pelajar sekolah menengah yang menerima uang saku mingguan/bulanan.
* **Kebutuhan:** Ingin menabung untuk membeli perangkat belajar/hobi dan penasaran bagaimana cara kerja investasi tanpa harus memakai uang saku asli.
* **Pain Points:** Uang saku sering habis sebelum akhir bulan untuk jajan impulsif; malas mencatat pengeluaran karena aplikasi keuangan biasa terlalu kaku dan membosankan.
* **Skenario Penggunaan:** Andi membuka aplikasi web FinZ sepulang sekolah untuk mencatat pengeluaran makan siang, memantau sisa *budget* kategori "Makanan", dan klaim XP dari misi harian untuk menaikkan level akunnya.

### Persona 2: Rina — Pemula Literasi Keuangan ($18$ Tahun)
* **Peran:** Lulusan baru / anggota komunitas edukasi finansial pemula.
* **Kebutuhan:** Memahami konsep portofolio, unit aset, harga beli rata-rata, serta cara membagi porsi pengeluaran bulanan.
* **Pain Points:** Takut rugi jika langsung mencoba aplikasi investasi nyata; bingung membaca istilah investasi yang terlalu teknis.
* **Skenario Penggunaan:** Rina menggunakan saldo virtual awal di FinZ untuk melakukan simulasi pembelian aset edukasi, memantau perubahan nilai portofolio simulasi, dan mempelajari riwayat transaksinya.

---

## 4. User Stories

| ID | User Story | Prioritas |
| :--- | :--- | :---: |
| **US-01** | Sebagai **pengguna baru**, saya ingin **mendaftar akun dan login** supaya **data transaksi, anggaran, tabungan, dan portofolio simulasi saya tersimpan aman dan terpisah dari pengguna lain**. | P0 |
| **US-02** | Sebagai **pengguna**, saya ingin **melihat Dashboard Keuangan interaktif** supaya **saya dapat langsung mengetahui ringkasan pemasukan/pengeluaran bulanan, saldo virtual, progres tabungan, serta level dan XP saya saat ini**. | P0 |
| **US-03** | Sebagai **pengguna**, saya ingin **mencatat pemasukan dan pengeluaran beserta kategori, deskripsi, nominal, dan tanggalnya** supaya **riwayat arus kas saya terdokumentasi dengan rapi**. | P0 |
| **US-04** | Sebagai **pengguna**, saya ingin **menetapkan batas anggaran (*budget*) bulanan per kategori** supaya **sistem dapat membandingkan pengeluaran aktual saya dengan batas anggaran dan memperingatkan jika hampir/sudah melampaui batas**. | P0 |
| **US-05** | Sebagai **pengguna**, saya ingin **membuat target tabungan dan mencatat penambahan saldo tabungan** supaya **saya bisa memantau persentase progres pencapaian tujuan keuangan saya**. | P0 |
| **US-06** | Sebagai **pengguna**, saya ingin **mendapatkan XP dan menaikkan level saat menyelesaikan misi atau aktivitas keuangan** supaya **saya termotivasi untuk terus disiplin mengelola keuangan**. | P0 |
| **US-07** | Sebagai **pemula investasi**, saya ingin **melakukan simulasi pembelian dan penjualan aset menggunakan saldo virtual serta melihat riwayatnya** supaya **saya memahami konsep unit aset dan portofolio tanpa risiko kehilangan uang asli**. | P0 |
| **US-08** | Sebagai **pengguna**, saya ingin **melihat halaman panduan/FAQ singkat mengenai fitur dan literasi dasar** supaya **saya tidak bingung saat pertama kali menggunakan platform**. | P1 |

---

## 5. Functional Requirements

### 5.1 Prioritas P0 (Kritis / Core MVP)

#### A. Autentikasi & Manajemen Akun (`Auth Module` - Next.js Route Handlers & Middleware)
* **FR-AUTH-01:** Sistem menyediakan fitur Registrasi (`POST /api/auth/register`) dengan input: `name`, `email`, dan `password`.
* **FR-AUTH-02:** Sistem secara otomatis menginisialisasi akun baru dengan:
  * `level = 1`, `xp = 0`
  * `virtual_balance = 10000000` ($\text{Rp}10.000.000$ saldo virtual awal untuk simulasi investasi).
* **FR-AUTH-03:** Sistem menyediakan fitur Login (`POST /api/auth/login`) yang memverifikasi *hash password* dan mengembalikan *JSON Web Token (JWT)* (disimpan di `HttpOnly` cookie dan/atau mendukung `Bearer Token`).
* **FR-AUTH-04:** Next.js `middleware.ts` memproteksi seluruh halaman privat (`/dashboard`, `/transactions`, `/budgets`, `/savings`, `/investments`, `/missions`) serta rute `/api/*` privat.
* **Validasi & Edge Cases:**
  * Email harus berformat valid dan unik (kembalikan `409 Conflict` jika email sudah terdaftar).
  * Password minimal $8$ karakter (kombinasi huruf dan angka).
  * Password wajib disimpan menggunakan algoritma hashing (`bcryptjs` dengan *salt rounds* $\ge 10$).

#### B. Dashboard Keuangan (`Dashboard Module`)
* **FR-DASH-01:** Endpoint `GET /api/dashboard` dan halaman `/dashboard` menampilkan agregasi data bulan berjalan: total pemasukan, total pengeluaran, selisih arus kas (*net cashflow*), saldo virtual investasi, profil level & XP, progres bar menuju level berikutnya, ringkasan anggaran, dan daftar target tabungan aktif.
* **Edge Cases:** Jika pengguna baru belum memiliki transaksi sama sekali, semua metrik numerik harus mengembalikan nilai $0$ (bukan `null` atau `NaN`) disertai komponen React *Empty State* yang informatif.

#### C. Pencatatan Pemasukan & Pengeluaran (`Transaction Module`)
* **FR-TRX-01:** Pengguna dapat menambah transaksi (`POST /api/transactions`) dengan atribut: `type` (`INCOME` | `EXPENSE`), `category` (`Makanan`, `Transportasi`, `Hiburan`, `Belajar`, `Uang Saku`, `Lainnya`), `amount`, `description`, dan `transactionDate`.
* **FR-TRX-02:** Pengguna dapat melihat daftar riwayat transaksi miliknya (`GET /api/transactions`) dengan filter bulan/tahun dan kategori, serta menghapus transaksi miliknya (`DELETE /api/transactions/[id]`).
* **Validasi & Edge Cases:**
  * `amount` harus berupa angka bulat positif ($> 0$). Input negatif, nol, atau string non-numerik ditolak dengan `400 Bad Request`.
  * Pengguna yang mencoba menghapus transaksi milik `userId` lain harus ditolak dengan `403 Forbidden` atau `404 Not Found`.

#### D. Budgeting / Anggaran Bulanan (`Budget Module`)
* **FR-BDG-01:** Pengguna dapat membuat atau memperbarui batas anggaran bulanan per kategori (`POST /api/budgets`) untuk periode bulan dan tahun tertentu (`month`, `year`, `category`, `limitAmount`).
* **FR-BDG-02:** Sistem menghitung total pengeluaran (`EXPENSE`) pada kategori dan bulan yang sama secara otomatis, lalu mengembalikan nilai terpakai (`spentAmount`), sisa anggaran (`remainingAmount`), persentase pemakaian:
  $$\text{Usage Percentage} = \left( \frac{\text{spentAmount}}{\text{limitAmount}} \right) \times 100\%$$
  serta status indikator (`SAFE` $< 80\%$, `WARNING` $80\% - 99.9\%$, `OVERBUDGET` $\ge 100\%$).
* **Edge Cases:** Duplikasi kategori pada bulan dan tahun yang sama untuk satu pengguna ditangani secara otomatis dengan mekanisme *upsert* (perbarui `limitAmount` jika sudah ada).

#### E. Target Tabungan (`Savings Goal Module`)
* **FR-SAV-01:** Pengguna dapat membuat target tabungan (`POST /api/savings`) dengan `title`, `targetAmount`, dan `targetDate` (opsional).
* **FR-SAV-02:** Pengguna dapat menambahkan nominal tabungan ke dalam target tertentu (`POST /api/savings/[id]/contribute`) dan sistem memperbarui `currentAmount` serta persentase progres:
  $$\text{Progress} = \min\left(100, \left(\frac{\text{currentAmount}}{\text{targetAmount}}\right) \times 100\right)$$
* **Validasi & Edge Cases:**
  * `targetAmount` dan nominal kontribusi harus $> 0$.
  * Jika `currentAmount` mencapai atau melampaui `targetAmount`, status target otomatis berubah menjadi `COMPLETED` dan memicu pemberian bonus XP satu kali.

#### F. Gamifikasi: XP, Level, dan Misi (`Gamification Module`)
* **FR-GAM-01:** Sistem memberikan XP secara otomatis ketika pengguna melakukan aksi produktif:
  * Mencatat transaksi keuangan: $+10\text{ XP}$
  * Membuat anggaran bulanan baru: $+20\text{ XP}$
  * Membuat/menambah alokasi target tabungan: $+25\text{ XP}$
  * Melakukan transaksi simulasi investasi: $+30\text{ XP}$
  * Menyelesaikan misi khusus: sesuai bobot XP misi ($+50\text{ XP}$ s/d $+100\text{ XP}$).
* **FR-GAM-02:** Perhitungan kenaikan level menggunakan formula ambang batas (*threshold*):
  $$\text{Level} = \left\lfloor \frac{\text{Total XP}}{100} \right\rfloor + 1$$
  Setiap kelipatan $100\text{ XP}$, level pengguna naik $1$ tingkat.
* **FR-GAM-03:** Sistem menyediakan daftar misi edukasi (`GET /api/missions`) beserta pelacakan status penyelesaiannya (`IN_PROGRESS`, `COMPLETED`).
* **Edge Cases:** Pencegahan *XP farming* melalui spam buat-hapus transaksi: XP penambahan transaksi dibatasi maksimal $5$ kali klaim per hari per pengguna, dan penghapusan transaksi tidak menambah XP baru.

#### G. Simulasi Investasi Virtual & Riwayat (`Virtual Investment Module`)
* **FR-INV-01:** Sistem menyediakan katalog aset edukasi contoh (`GET /api/investments/assets`) dengan harga simulasi (misal: Reksa Dana Pasar Uang Edu, Reksa Dana Pendapatan Tetap Edu, Saham Bluechip Edu, Emas Digital Edu).
* **FR-INV-02:** Pengguna dapat membeli aset (`POST /api/investments/buy`) dan menjual aset (`POST /api/investments/sell`) menggunakan saldo virtual (`virtualBalance`).
* **FR-INV-03:** Sistem mencatat portofolio kepemilikan unit aset pengguna (`GET /api/investments/portfolio`) dengan perhitungan nilai pasar saat ini dan rata-rata harga beli (*average buy price*):
  $$\text{Total Cost} = \text{units} \times \text{pricePerUnit}$$
* **FR-INV-04:** Sistem mencatat dan menampilkan riwayat seluruh transaksi beli/jual simulasi (`GET /api/investments/history`) mencakup jenis transaksi (`BUY`/`SELL`), nama aset, jumlah unit, harga eksekusi contoh, total nominal, dan **saldo virtual setelah transaksi**.
* **Validasi & Edge Cases:**
  * Pembelian ditolak (`400 Bad Request - Saldo virtual tidak mencukupi`) apabila $\text{Total Cost} > \text{virtualBalance}$.
  * Penjualan ditolak (`400 Bad Request - Unit aset tidak mencukupi`) apabila jumlah unit yang dijual melebihi jumlah unit yang dimiliki di portofolio.
  * Seluruh operasi perubahan `virtualBalance`, `Portfolio`, dan pencatatan `InvestmentHistory` wajib dieksekusi di dalam **Database Transaction (`prisma.$transaction`)** untuk mencegah *race condition* atau saldo korup.

### 5.2 Prioritas P1 (Penting / Secondary Features)
* **FR-SIM-01 (Simulasi Perubahan Harga Contoh):** Tombol atau endpoint simulasi perubahan harga pasar contoh ($\pm 1\%$ hingga $\pm 5\%$ secara terkontrol untuk tujuan edukasi) agar pengguna dapat mengamati konsep *unrealized gain/loss* pada portofolio mereka.
* **FR-EDU-01 (Panduan & Literasi Singkat):** Komponen akordion/halaman bantuan & FAQ yang menjelaskan konsep dasar *budgeting*, bedanya tabungan vs investasi, dan cara kerja XP di FinZ.

### 5.3 Prioritas P2 (Nice to Have)
* **FR-EXP-01:** Fitur ekspor ringkasan laporan keuangan bulanan ke format CSV.
* **FR-UI-01:** Mode tampilan gelap (*Dark Mode*) menggunakan `next-themes` dan animasi perayaan (*confetti*) saat naik level.

---

## 6. Non-Functional Requirements (NFR)

1. **Performance & Response Time:**
   * Waktu respons endpoint Next.js Route Handlers rata-rata $< 200\text{ ms}$ (p95 $< 500\text{ ms}$) pada kondisi beban normal.
   * Waktu muat awal halaman (*First Contentful Paint*) $< 1.2\text{ detik}$ dengan memanfaatkan *React Server Components (RSC)* dan optimasi *bundling* Next.js.
2. **Security (Keamanan Data):**
   * Semua password wajib di-hash dengan `bcryptjs`.
   * Seluruh rute halaman privat dan API Route Handlers wajib diverifikasi melalui JWT (`jose` + Next.js Middleware).
   * *Strict Data Isolation*: Setiap query Prisma wajib menyertakan klausa `where: { userId: authenticatedUser.id }` untuk mencegah celah *Insecure Direct Object References (IDOR)*.
   * Validasi input ketat menggunakan `Zod` di sisi client maupun server.
3. **Concurrency & Data Integrity:**
   * Mampu menangani minimal $100$ pengguna konkuren.
   * Transaksi finansial virtual dan klaim XP menggunakan transaksi database atomik (`ACID`).
4. **Usability & Responsiveness:**
   * Antarmuka responsif berbasis Tailwind CSS yang nyaman diakses pada layar Desktop ($1366 \times 768$ ke atas) maupun perangkat Mobile pelajar ($360 \times 640$ ke atas).

---

## 7. Scope

### In-Scope (MVP Saat Ini)
* Aplikasi Full-Stack Next.js (App Router) dengan TypeScript.
* Autentikasi pengguna (Register, Login, Logout, Next.js JWT Middleware).
* Dashboard ringkasan keuangan, level, XP, dan saldo virtual.
* CRUD (Create, Read, Delete) pencatatan pemasukan & pengeluaran.
* Pembuatan anggaran bulanan per kategori dan kalkulasi status pemakaian anggaran.
* Pembuatan target tabungan dan pencatatan kontribusi tabungan.
* Sistem gamifikasi (perolehan XP otomatis, kalkulasi kenaikan Level, dan daftar Misi dasar).
* Simulasi jual/beli aset investasi virtual menggunakan data harga contoh, kalkulasi portofolio, dan riwayat simulasi investasi.
* Halaman informasi panduan penggunaan & disclaimer edukasi.

### Out-of-Scope (Ditunda untuk Fase Berikutnya)
* Integrasi *payment gateway* atau deposit uang sungguhan (FinZ $100\%$ bebas uang asli).
* Integrasi *live market data feed* berbayar secara *real-time* dari bursa efek nyata.
* Fitur sosial seperti *leaderboard* publik antar-sekolah atau pengiriman saldo antar-pengguna.
* Aplikasi *native mobile* (Android/iOS) — fase ini berfokus penuh pada aplikasi Web Next.js responsif.