import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  Target,
  Award,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Fin<span className="text-blue-600">Z</span>
              </span>
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                Edukasi
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-16 pb-20 text-center lg:pt-24 lg:pb-28">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800 shadow-sm">
            <Award className="h-4 w-4 text-amber-500" />
            Belajar Keuangan & Investasi Tanpa Risiko Uang Asli
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Kuasai Uangmu, Bangun Masa Depan dengan{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FinZ
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Platform edukasi finansial khusus Gen Z. Catat arus kas, pantau anggaran
            bulanan, tetapkan target tabungan, dan simulasi investasi dengan{" "}
            <span className="font-semibold text-slate-800">
              saldo virtual Rp 10.000.000
            </span>{" "}
            sambil meraih XP dan naik level!
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 sm:w-auto"
            >
              Mulai Sekarang Gratis
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
            >
              Sudah Punya Akun
            </Link>
          </div>
        </div>
      </section>

      {/* Educational Disclaimer Banner */}
      <section className="border-y border-amber-200 bg-amber-50/70 py-4 px-6 text-center">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 text-xs font-medium text-amber-900 sm:text-sm">
          <ShieldCheck className="h-5 w-5 shrink-0 text-amber-600" />
          <span>
            <strong>Disclaimer Edukasi:</strong> FinZ murni sarana pembelajaran
            literasi keuangan. Semua saldo, harga aset, dan transaksi investasi
            bersifat 100% virtual tanpa keterlibatan uang nyata.
          </span>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Fitur Utama FinZ
          </h2>
          <p className="mt-3 text-slate-600">
            Didesain intuitif, aman, dan berorientasi gamifikasi untuk pemula.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Pencatatan Arus Kas
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Catat pemasukan dan pengeluaran harian dengan kategori terstruktur
              agar kamu tahu ke mana setiap rupiah pergi.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Budget & Target Tabungan
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Pasang limit pengeluaran bulanan dan pantau progres tabunganmu
              hingga mencapai 100%.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Simulasi Investasi Virtual
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Coba beli reksa dana, saham edukasi, dan emas virtual memakai saldo
              simulasi Rp 10 Juta tanpa risiko rugi nyata.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Gamifikasi XP & Level
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Dapatkan +10 s/d +30 XP setiap kali mengelola keuangan, selesaikan
              misi harian, dan naikkan level profilmu!
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6">
          <p>© {new Date().getFullYear()} FinZ. Proyek Edukasi Literasi Keuangan & Budgeting untuk Generasi Z.</p>
        </div>
      </footer>
    </div>
  );
}
