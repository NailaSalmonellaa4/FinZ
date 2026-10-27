// src/app/page.tsx — Halaman Depan Landing Page FinZ
// Edukasi Literasi Finansial, Budgeting 50/30/20 & Simulasi Investasi Mikro Virtual

import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/server/utils/auth-session";
import { SimulationDisclaimer } from "@/components/layout/SimulationDisclaimer";
import {
  Zap,
  Coins,
  ShieldCheck,
  TrendingUp,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Receipt,
  BookOpen,
  PieChart,
  Activity,
  Compass,
  Laptop,
  Check,
  Wallet,
  Shield,
} from "lucide-react";

export default async function HomePage() {
  // Cek apakah pengguna sudah login di browser ini
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const user = token ? await verifyToken(token) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-500 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR (STICKY & GLASSMORPHISM)                                   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Logo & Platform Badge */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white shadow-md shadow-emerald-600/20 transition group-hover:scale-105">
              <Zap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline text-xl font-extrabold tracking-tight text-slate-900">
                  Fin<span className="text-emerald-600">Z</span>
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Literasi Finansial
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                Smart Budgeting &amp; Virtual Investing
              </span>
            </div>
          </Link>

          {/* Quick Nav Anchors */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#fitur" className="transition hover:text-emerald-700">
              Fitur Utama
            </a>
            <a href="#investasi" className="transition hover:text-emerald-700">
              Simulasi Investasi
            </a>
            <a href="#tabungan" className="transition hover:text-emerald-700">
              Target Tabungan
            </a>
            <a href="#alur" className="transition hover:text-emerald-700">
              Cara Kerja
            </a>
            <a href="#edukasi" className="transition hover:text-emerald-700">
              Panduan Finansial
            </a>
            <a href="#disclaimer" className="transition hover:text-amber-700">
              Disclaimer
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm shadow-emerald-600/25 transition hover:bg-emerald-700"
              >
                <span>Buka Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Daftar Gratis</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20">
        {/* Background Radial Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-[450px] w-[650px] rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="h-[350px] w-[450px] rounded-full bg-indigo-100/50 blur-3xl ml-20" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50/90 px-4 py-1.5 text-xs font-bold text-emerald-900 shadow-xs">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Platform Edukasi Finansial &amp; Investasi Mikro Virtual untuk Gen Z</span>
          </div>

          {/* Headline */}
          <h1 className="mx-auto mt-6 max-w-4xl font-headline text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Kendalikan Keuangan, Bangun Kebiasaan Finansial{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Sehat Sejak Dini
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg lg:text-xl leading-relaxed">
            Kelola uang saku dan gaji magang dengan cerdas. Atur batas anggaran 50/30/20,
            capai target tabungan impian, dan uji insting portofolio di simulator investasi dengan modal edukasi{" "}
            <strong className="text-slate-900 font-bold">Rp 10.000.000 virtual</strong>{" "}
            tanpa risiko uang asli.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl focus:outline-none"
            >
              <Wallet className="h-5 w-5" />
              <span>{user ? "Buka Dashboard" : "Mulai Sekarang Gratis"}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="#fitur"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-7 py-4 text-base font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Compass className="h-5 w-5 text-emerald-600" />
              <span>Pelajari Fitur FinZ</span>
            </a>
          </div>

          {/* Mini Trust Highlights */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-emerald-600" />
              <span>Rp 10 Juta Saldo Virtual Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>100% Zero-Risk Edukasi</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-600" />
              <span>Panduan Literasi Keuangan Praktis</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* HERO VISUAL MOCKUP — DASHBOARD PREVIEW                                   */}
          {/* ========================================================================= */}
          <div className="mt-14 mx-auto max-w-5xl rounded-3xl border border-slate-200/90 bg-white p-3 sm:p-5 shadow-2xl shadow-slate-300/40">
            {/* Top Mockup Header Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Pratinjau Dashboard FinZ
                    </span>
                    <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                      Tingkat Edukasi • Level 3
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Pengguna Aktif • Rutin 7 Hari Terakhir
                  </p>
                </div>
              </div>

              {/* Mini Progress Bar */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-full sm:w-44 text-right">
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span className="text-emerald-400">Progres Level</span>
                    <span>180 / 300 Poin</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Stat Cards in Mockup */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              {/* Stat 1: Saldo Kas Riil */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Saldo Kas Riil
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Wallet className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-xl font-extrabold text-slate-900">
                  Rp 3.850.000
                </p>
                <p className="mt-1 text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> +Rp 2.000.000 bulan ini
                </p>
              </div>

              {/* Stat 2: Portofolio Investasi Virtual */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Portofolio Virtual
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-xl font-extrabold text-slate-900">
                  Rp 10.450.000
                </p>
                <p className="mt-1 text-[11px] font-medium text-indigo-700 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> +4.5% Profit Simulasi
                </p>
              </div>

              {/* Stat 3: Batas Anggaran */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Batas Anggaran
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-xl font-extrabold text-slate-900">
                  Status: AMAN
                </p>
                <p className="mt-1 text-[11px] font-medium text-slate-600">
                  Terpakai 56.8% dari limit bulanan
                </p>
              </div>

              {/* Stat 4: Target Tabungan */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Target Tabungan
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <Target className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-xl font-extrabold text-slate-900">
                  Laptop Belajar
                </p>
                <p className="mt-1 text-[11px] font-medium text-amber-700">
                  Rp 4.200.000 / Rp 6.000.000 (70%)
                </p>
              </div>
            </div>

            {/* Mockup Dual Columns */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              {/* Left Column: Aktivitas Finansial Harian */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      Target Finansial Harian
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    2/3 Selesai
                  </span>
                </div>
                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold text-slate-800">
                        Catat Pengeluaran Makan Siang
                      </span>
                    </div>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                      +10 Poin
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold text-slate-800">
                        Check-in Edukasi Harian
                      </span>
                    </div>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                      +15 Poin
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-2.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white">
                        <Activity className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-bold text-emerald-950">
                        Coba Simulasi Beli 1 Reksa Dana
                      </span>
                    </div>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">
                      +20 Poin
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Alokasi 50/30/20 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      Formula Alokasi 50/30/20
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Formula Sehat
                  </span>
                </div>
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>50% Kebutuhan Pokok</span>
                      <span className="text-emerald-700">Aman (42%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[42%] rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>30% Keinginan (Lifestyle)</span>
                      <span className="text-indigo-700">Terkendali (22%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[22%] rounded-full bg-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>20% Tabungan &amp; Investasi</span>
                      <span className="text-amber-700">Tercapai (26%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[26%] rounded-full bg-amber-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIMULATION DISCLAIMER BANNER                                          */}
      {/* ========================================================================= */}
      <section id="disclaimer" className="border-y border-amber-200/80 bg-amber-50/70 py-5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <SimulationDisclaimer />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FOUR CORE FEATURES                                                    */}
      {/* ========================================================================= */}
      <section id="fitur" className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
              Empat Pilar Utama
            </span>
            <h2 className="mt-4 font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Fitur Lengkap Pengelolaan Keuangan Cerdas
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Dibangun dari fondasi literasi keuangan modern yang disederhanakan
              untuk membantu Gen Z mengelola uang dengan disiplin dan terarah.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Cashflow Tracker */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300 hover:bg-white flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
                  <Receipt className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  Pencatatan Arus Kas Cepat
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Catat setiap pemasukan uang jajan, gaji magang, atau belanja harian
                  dalam 3 detik. Kategori otomatis membedakan kebutuhan vs keinginan.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/80 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> Kategori Otomatis &amp; Real-time
                </span>
              </div>
            </div>

            {/* Pillar 2: Batas Anggaran 50/30/20 */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 hover:bg-white flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  Kontrol Anggaran 50/30/20
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Pasang limit pengeluaran bulanan. Status anggaran real-time
                  (Aman, Waspada, Overbudget) langsung memperingatkanmu sebelum dana habis.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/80 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                  <CheckCircle2 className="h-4 w-4" /> Peringatan Batas Pengeluaran
                </span>
              </div>
            </div>

            {/* Pillar 3: Simulasi Investasi Mikro Virtual */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-violet-300 hover:bg-white flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 shadow-sm">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  Simulasi Investasi Mikro Virtual
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Eksplorasi Reksa Dana, Obligasi Negara, Emas Digital, dan Saham
                  menggunakan modal simulasi Rp 10 Juta tanpa risiko kehilangan uang asli.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/80 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700">
                  <CheckCircle2 className="h-4 w-4" /> Realistis Tanpa Risiko
                </span>
              </div>
            </div>

            {/* Pillar 4: Target Tabungan Terencana */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-amber-300 hover:bg-white flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  Target Tabungan Terencana
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Tentukan target menabung laptop baru, dana darurat, atau biaya sertifikasi.
                  Pantau persentase pencapaian secara visual hingga target tuntas 100%.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/80 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
                  <CheckCircle2 className="h-4 w-4" /> Visual Progress Bar
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SIMULASI INVESTASI DEEP DIVE                                           */}
      {/* ========================================================================= */}
      <section id="investasi" className="py-20 sm:py-24 bg-slate-50 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-800 uppercase tracking-wider">
                Simulasi Tanpa Rasa Cemas
              </span>
              <h2 className="mt-4 font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Latihan Sebelum Terjun ke Pasar Modal Nyata
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Banyak pemula ragu memulai karena takut rugi atau minim literasi.
                Di FinZ Simulator, Anda belajar psikologi pasar, diversifikasi aset,
                dan membaca grafik pergerakan portofolio secara aman.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Saldo Edukasi Rp 10.000.000 Otomatis
                    </h4>
                    <p className="text-xs text-slate-600">
                      Langsung aktif saat akun dibuat, siap dialokasikan ke berbagai instrumen virtual.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Bebas Simulasi Jual &amp; Beli Kapan Saja
                    </h4>
                    <p className="text-xs text-slate-600">
                      Pelajari strategi investasi berkala (DCA) atau akumulasi portofolio tanpa konsekuensi finansial riil.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Laporan Untung-Rugi (P/L) Real-Time
                    </h4>
                    <p className="text-xs text-slate-600">
                      Pantau pergerakan nilai aset secara transparan lengkap dengan persentase imbal hasil.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-700"
                >
                  <Coins className="h-4 w-4" />
                  <span>Coba Simulasi Investasi Sekarang</span>
                </Link>
              </div>
            </div>

            {/* Right Cards: 4 Simulated Asset Instruments */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Asset 1 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    Risiko Sangat Rendah
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    ~5.2% / thn
                  </span>
                </div>
                <h4 className="mt-3 font-bold text-slate-900">
                  Reksa Dana Pasar Uang
                </h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Instrumen paling stabil untuk belajar memarkir dana darurat virtual agar nilainya terlindungi.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Volatilitas:</span>
                  <span className="font-bold text-slate-800">Sangat Stabil</span>
                </div>
              </div>

              {/* Asset 2 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                    Risiko Rendah
                  </span>
                  <span className="text-xs font-extrabold text-blue-600">
                    ~6.8% / thn
                  </span>
                </div>
                <h4 className="mt-3 font-bold text-slate-900">
                  Obligasi Negara FinZ Bond
                </h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Simulasi surat utang negara dengan kupon berkala untuk memahami konsep pendapatan tetap.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Volatilitas:</span>
                  <span className="font-bold text-slate-800">Rendah</span>
                </div>
              </div>

              {/* Asset 3 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                    Risiko Moderat
                  </span>
                  <span className="text-xs font-extrabold text-amber-600">
                    Lindung Nilai
                  </span>
                </div>
                <h4 className="mt-3 font-bold text-slate-900">
                  Emas Digital Edukasi
                </h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Aset lindung nilai (hedging) klasik dunia untuk memahami cara menjaga daya beli jangka panjang.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Volatilitas:</span>
                  <span className="font-bold text-slate-800">Moderat</span>
                </div>
              </div>

              {/* Asset 4 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-violet-50 border border-violet-200 px-2.5 py-0.5 text-[10px] font-bold text-violet-800">
                    Risiko Tinggi
                  </span>
                  <span className="text-xs font-extrabold text-violet-600">
                    Pertumbuhan Tinggi
                  </span>
                </div>
                <h4 className="mt-3 font-bold text-slate-900">
                  Saham Indeks FinZ Top 30
                </h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Keranjang saham perusahaan unggulan untuk belajar dinamika pasar modal dan fluktuasi harga.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Volatilitas:</span>
                  <span className="font-bold text-slate-800">Tinggi (High Growth)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TARGET TABUNGAN SHOWCASE                                              */}
      {/* ========================================================================= */}
      <section id="tabungan" className="py-20 sm:py-24 bg-white border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
              Manajemen Target Finansial
            </span>
            <h2 className="mt-4 font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Wujudkan Rencana dengan Pemantauan Progres Nyata
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Tetapkan sasaran finansial yang realistis. Setiap setoran tabungan
              terdata secara otomatis hingga mencapai 100% tuntas.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Target 1: Dana Darurat */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Shield className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                    Prioritas Utama
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Dana Darurat Mandiri
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Target: Rp 3.000.000 (3x pengeluaran bulanan)
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Sisa: 15%</span>
                    <span className="text-emerald-700">Rp 2.550.000 (85%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[85%] rounded-full bg-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Pondasi Keamanan Finansial
              </div>
            </div>

            {/* Target 2: Laptop Belajar */}
            <div className="rounded-3xl border-2 border-indigo-200 bg-indigo-50/20 p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <Laptop className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                    Peralatan Belajar
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Laptop Coding &amp; Desain
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Target: Rp 6.000.000 untuk upgrade perangkat belajar
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Sisa: 30%</span>
                    <span className="text-indigo-700">Rp 4.200.000 (70%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-indigo-100 overflow-hidden">
                    <div className="h-full w-[70%] rounded-full bg-indigo-600" />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-indigo-200 text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" /> Target Produktivitas
              </div>
            </div>

            {/* Target 3: Sertifikasi */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-violet-800 bg-violet-100/70 px-2.5 py-0.5 rounded-full">
                    Pengembangan Diri
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Sertifikasi Profesi IT
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Target: Rp 1.500.000 untuk ujian kompetensi
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Sisa: 60%</span>
                    <span className="text-violet-700">Rp 600.000 (40%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[40%] rounded-full bg-violet-600" />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-violet-600" /> Peningkatan Karir
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CARA KERJA (ALUR PEMBELAJARAN)                                        */}
      {/* ========================================================================= */}
      <section id="alur" className="py-20 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Glow ambient */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-[400px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
              Tiga Langkah Mudah
            </span>
            <h2 className="mt-4 font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Bagaimana Cara Memulai di FinZ?
            </h2>
            <p className="mt-3 text-base text-slate-300">
              Tidak memerlukan kartu kredit dan tanpa verifikasi rekening bank yang rumit.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-800/60 p-7 relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-extrabold text-lg border border-emerald-500/30">
                01
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">
                Daftar &amp; Klaim Saldo Virtual
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Buat akun dalam 30 detik. Sistem otomatis menyediakan saldo virtual
                sebesar Rp 10.000.000 untuk sarana latihan investasi tanpa risiko uang sungguhan.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-800/60 p-7 relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 font-extrabold text-lg border border-indigo-500/30">
                02
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">
                Catat Transaksi &amp; Atur Batas
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Catat pengeluaran harianmu, terapkan formula anggaran 50/30/20,
                dan evaluasi portofolio virtual secara konsisten.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-800/60 p-7 relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400 font-extrabold text-lg border border-teal-500/30">
                03
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">
                Capai Target &amp; Mandiri Finansial
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Wujudkan tabungan impian, tingkatkan pemahaman portofolio aset,
                dan bangun kebiasaan finansial yang sehat seumur hidup.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-3.5 text-sm sm:text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
            >
              <span>Daftar Akun FinZ Sekarang</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. PANDUAN FINANSIAL (KNOWLEDGE HUB)                                     */}
      {/* ========================================================================= */}
      <section id="edukasi" className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
              Perpustakaan Literasi
            </span>
            <h2 className="mt-4 font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              3 Prinsip Dasar Pengelolaan Keuangan Cerdas
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Bukan sekadar mencatat angka, FinZ membimbingmu memahami filosofi
              pengelolaan uang yang sesungguhnya.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rule 1 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                Rumus 50/30/20: Kunci Kontrol Anggaran
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Alokasikan 50% pendapatan untuk Kebutuhan Pokok, 30% untuk Keinginan
                (lifestyle wajar), dan minimal 20% dikunci untuk Tabungan serta Investasi.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                Dana Darurat: Pondasi Sebelum Berinvestasi
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Prioritaskan memiliki dana darurat sebesar 3 hingga 6 bulan pengeluaran
                sebelum mulai berinvestasi secara agresif. Ini mencegah utang saat kondisi mendesak.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                Daya Bunga Berbunga (Compound Interest)
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Waktu adalah sekutu terkuat anak muda. Memulai investasi mikro sejak
                dini memberi ruang bagi keuntungan virtual untuk berlipat ganda secara eksponensial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. BOTTOM CTA                                                            */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950 px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-2xl">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-bold text-emerald-300">
                Pendaftaran Terbuka
              </span>
              <h2 className="mt-4 font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Siap Mengendalikan Masa Depan Finansialmu?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                Bergabunglah gratis sekarang. Kelola arus kas harian, manfaatkan modal
                edukasi virtual Rp 10.000.000, dan bangun kebiasaan finansial yang mandiri.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/register"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm sm:text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
                >
                  <Wallet className="h-5 w-5" />
                  <span>Daftar Akun Sekarang</span>
                </Link>
                <Link
                  href="/login"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-7 py-3.5 text-sm sm:text-base font-bold text-slate-200 transition hover:bg-slate-800 hover:text-white"
                >
                  <span>Sudah Punya Akun</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FOOTER                                                               */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand & Tagline */}
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <span className="font-headline text-lg font-bold text-slate-900">
                  Fin<span className="text-emerald-600">Z</span>
                </span>
                <span className="text-xs text-slate-500 block">
                  Platform Edukasi Literasi Finansial &amp; Budgeting
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-600">
              <Link href="/dashboard" className="transition hover:text-emerald-700">
                Dashboard
              </Link>
              <Link href="/transactions" className="transition hover:text-emerald-700">
                Transaksi
              </Link>
              <Link href="/budgets" className="transition hover:text-emerald-700">
                Anggaran
              </Link>
              <Link href="/investments" className="transition hover:text-emerald-700">
                Investasi Virtual
              </Link>
              <Link href="/savings" className="transition hover:text-emerald-700">
                Target Tabungan
              </Link>
              <Link href="/missions" className="transition hover:text-emerald-700">
                Edukasi &amp; Panduan
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-500 leading-relaxed">
            <p>
              © {new Date().getFullYear()} FinZ (Smart Budgeting &amp; Virtual Investing). Seluruh hak cipta dilindungi undang-undang.
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Pemberitahuan: Seluruh saldo investasi, aset portofolio, dan transaksi adalah simulasi edukasi (bukan produk perbankan atau sekuritas berizin).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}