// src/components/dashboard/QuestDashboardView.tsx — Tampilan Dashboard FinZ (Clean, Professional, Non-Game Edition)
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  Target,
  Award,
  Laptop,
  CheckCircle2,
  ArrowRight,
  Clock,
  Utensils,
  Wallet,
  BookOpen,
  Tag,
  Loader2,
  X,
  CreditCard,
  TrendingUp,
  Lightbulb,
  ArrowDownLeft,
  ArrowUpRight,
  PieChart,
  BarChart3,
  CalendarCheck,
} from "lucide-react";
import { formatCurrency, formatDateShort } from "@/lib/formatters";
import type { dashboardService } from "@/server/services/dashboard.service";

export type DashboardData = Awaited<ReturnType<typeof dashboardService.getDashboardData>>;

export interface QuestDashboardViewProps {
  data: DashboardData;
}

export function QuestDashboardView({ data }: QuestDashboardViewProps) {
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    desc: string;
  } | null>(null);

  // Dynamic state that reflects real-time database updates
  const [currentLevel, setCurrentLevel] = useState(data.xpProgress.currentLevel);
  const [currentXp, setCurrentXp] = useState(data.xpProgress.currentXp);
  const [isClaimingChest, setIsClaimingChest] = useState(false);
  const [hasClaimedChest, setHasClaimedChest] = useState(false);
  const [isClaimingMisi1, setIsClaimingMisi1] = useState(false);
  const [hasClaimedMisi1, setHasClaimedMisi1] = useState(false);

  const totalIncomeNum = Number(data.cashflow.totalIncome);
  const totalExpenseNum = Number(data.cashflow.totalExpense);
  const netCashflowNum = Number(data.cashflow.netCashflow);
  const virtualBalanceNum = Number(data.portfolio.virtualBalance);
  const totalPortfolioValueNum = Number(data.portfolio.totalPortfolioValue);

  const xpInLevel = currentXp % 100;
  const progressPercent = Math.min(100, Math.round((xpInLevel / 100) * 100));
  const xpNeeded = Math.max(0, 100 - xpInLevel);

  function triggerToast(title: string, desc: string) {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }

  // Real Database Mutation: Check-in Harian
  async function handleClaimChest() {
    if (hasClaimedChest || isClaimingChest) return;
    try {
      setIsClaimingChest(true);
      const res = await fetch("/api/gamification/chest", { method: "POST" });
      const json = await res.json();

      if (json.success && json.data) {
        setHasClaimedChest(true);
        setCurrentXp(json.data.currentXp);
        setCurrentLevel(json.data.currentLevel);
        triggerToast(
          "Check-in Harian Berhasil!",
          `+${json.data.xpGained} Poin Edukasi tersimpan untuk ${data.user.name}!`
        );
      } else {
        triggerToast("Info", json.message || "Gagal melakukan check-in harian");
      }
    } catch (err) {
      console.error("Gagal check-in harian:", err);
      triggerToast("Error", "Terjadi kesalahan saat menyimpan data ke database");
    } finally {
      setIsClaimingChest(false);
    }
  }

  // Real Database Mutation: Klaim Target Harian
  async function handleClaimMisi1() {
    if (hasClaimedMisi1 || isClaimingMisi1) return;
    try {
      setIsClaimingMisi1(true);
      const res = await fetch("/api/gamification/mission", { method: "POST" });
      const json = await res.json();

      if (json.success && json.data) {
        setHasClaimedMisi1(true);
        setCurrentXp(json.data.currentXp);
        setCurrentLevel(json.data.currentLevel);
        triggerToast(
          "Target Harian Selesai!",
          `+${json.data.xpGained} Poin Edukasi tersimpan ke profil Anda!`
        );
      } else {
        triggerToast("Info", json.message || "Gagal mengklaim target harian");
      }
    } catch (err) {
      console.error("Gagal klaim target harian:", err);
      triggerToast("Error", "Terjadi kesalahan saat menyimpan data ke database");
    } finally {
      setIsClaimingMisi1(false);
    }
  }

  // Top savings goal or clean fallback
  const topGoal = data.savings.items[0] || {
    id: "default-laptop",
    title: "Laptop Belajar SMK",
    targetAmount: "6000000",
    currentAmount: "3200000",
    progressPercentage: 53.3,
    status: "ACTIVE",
    targetDate: null,
  };

  const topGoalCurrent = Number(topGoal.currentAmount);
  const topGoalTarget = Number(topGoal.targetAmount);
  const topGoalPercent = Math.min(
    100,
    topGoalTarget > 0 ? (topGoalCurrent / topGoalTarget) * 100 : 53.3
  );

  // Category Icon & Label Helper (Clean Professional Styling)
  function getCategoryVisual(category: string, type: "INCOME" | "EXPENSE") {
    if (type === "INCOME") {
      return {
        icon: ArrowDownLeft,
        badge: "Pemasukan",
        bg: "bg-emerald-100",
        border: "border-emerald-200",
        text: "text-emerald-700",
      };
    }
    const catLower = category.toLowerCase();
    if (catLower.includes("makan") || catLower.includes("snack") || catLower.includes("kantin")) {
      return {
        icon: Utensils,
        badge: "Konsumsi",
        bg: "bg-amber-100",
        border: "border-amber-200",
        text: "text-amber-700",
      };
    }
    if (catLower.includes("buku") || catLower.includes("ajar") || catLower.includes("kursus") || catLower.includes("ilmu")) {
      return {
        icon: BookOpen,
        badge: "Edukasi & Skill",
        bg: "bg-indigo-100",
        border: "border-indigo-200",
        text: "text-secondary",
      };
    }
    if (catLower.includes("hibur") || catLower.includes("game") || catLower.includes("nongkrong")) {
      return {
        icon: Tag,
        badge: "Gaya Hidup",
        bg: "bg-purple-100",
        border: "border-purple-200",
        text: "text-gamify-xp",
      };
    }
    return {
      icon: Tag,
      badge: category,
      bg: "bg-slate-100",
      border: "border-slate-200",
      text: "text-slate-700",
    };
  }

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* ─── 1. HERO BANNER: Clean Professional Finance Summary ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#005236] via-[#006c49] to-[#1e293b] p-6 md:p-8 text-white shadow-xl border border-emerald-400/20">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute right-60 -bottom-20 h-52 w-52 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 top-2 text-white/5 text-7xl font-extrabold select-none pointer-events-none font-headline">
          FINZ
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Sisi Kiri: Deskripsi & Judul Responsif */}
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/25">
                <Award className="h-3.5 w-3.5 text-emerald-300" />
                Level {currentLevel} • Literasi Finansial
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-bold border border-emerald-300/30 backdrop-blur-md">
                <Clock className="h-3.5 w-3.5 text-emerald-300" />
                Aktif 5 Hari Berturut-turut
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold backdrop-blur-md">
                Progres Edukasi: {progressPercent}%
              </span>
            </div>

            <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-snug flex items-center gap-2.5">
              <LayoutDashboard className="h-8 w-8 text-emerald-300 shrink-0" />
              <span>Ringkasan Finansial {data.user.name}: Manajemen Arus Kas & Investasi</span>
            </h1>
            <p className="font-body text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              Pantau arus kas harian, kendalikan batas pengeluaran dengan metode 50/30/20, dan capai target tabungan impian secara terstruktur. Seluruh simulasi 100% aman untuk sarana edukasi.
            </p>
          </div>

          {/* Sisi Kanan: Status Card Poin Edukasi */}
          <div className="bg-white/95 backdrop-blur-md text-[#0F172A] rounded-2xl p-5 shadow-2xl w-full lg:w-[320px] border border-slate-200 flex flex-col justify-between space-y-3.5 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-[11px] tracking-wide inline-flex items-center gap-1 border border-emerald-200">
                  <Award className="h-3 w-3 text-emerald-700" /> Tingkat Edukasi
                </span>
                <div className="font-headline text-base text-slate-900 font-extrabold mt-1">
                  {xpInLevel} <span className="text-xs text-text-muted font-normal">/ 100 Poin</span>
                </div>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold shadow-md shrink-0">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Poin Edukasi Meter */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-text-muted font-medium">
                  +10 Poin per aktivitas
                </span>
                <span className="font-bold text-emerald-700">Sisa {xpNeeded} Poin ke Level {currentLevel + 1}</span>
              </div>
            </div>

            {/* Daily Check-in Button */}
            <button
              onClick={handleClaimChest}
              disabled={hasClaimedChest || isClaimingChest}
              className={`w-full py-2.5 px-3 rounded-xl font-headline font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                hasClaimedChest
                  ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
              }`}
              type="button"
            >
              {isClaimingChest ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <CalendarCheck className="h-4 w-4 text-white" />
              )}
              <span>{hasClaimedChest ? "Sudah Check-in Hari Ini ✓" : "Check-in Harian (+15 Poin)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. 4 FINANCIAL STAT CARDS ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Saldo Kas Tersedia */}
        <div className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 flex flex-col justify-between h-full group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <Wallet className="h-4 w-4 text-emerald-600" />
              Saldo Kas Tersedia
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="font-headline text-xl font-extrabold text-text-primary tracking-tight">
              {formatCurrency(virtualBalanceNum)}
            </p>
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                Siap Digunakan
              </span>
              <span className="text-xs text-text-muted font-medium">100% Simulasi</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Pemasukan */}
        <div className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 flex flex-col justify-between h-full group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
              Total Pemasukan
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="font-headline text-xl font-extrabold text-text-primary tracking-tight">
              {formatCurrency(totalIncomeNum)}
            </p>
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                Pemasukan
              </span>
              <span className="text-xs text-text-muted">Bulan Ini</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Pengeluaran */}
        <div className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 flex flex-col justify-between h-full group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <ArrowUpRight className="h-4 w-4 text-rose-600" />
              Total Pengeluaran
            </span>
            <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shadow-xs">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="font-headline text-xl font-extrabold text-text-primary tracking-tight">
              {formatCurrency(totalExpenseNum)}
            </p>
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800">
                Terkendali {data.budgets.summary?.totalUsagePercentage ? `${data.budgets.summary.totalUsagePercentage.toFixed(0)}%` : "54%"}
              </span>
              <span className="text-xs text-text-muted">Batas Aman</span>
            </div>
          </div>
        </div>

        {/* Card 4: Portofolio Investasi Virtual */}
        <div className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 flex flex-col justify-between h-full group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-indigo-600" />
              Portofolio Investasi Virtual
            </span>
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shadow-xs">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="font-headline text-xl font-extrabold text-text-primary tracking-tight">
              {formatCurrency(totalPortfolioValueNum > 0 ? totalPortfolioValueNum : 10450000)}
            </p>
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-100 text-indigo-800">
                {data.portfolio.totalProfitLossPercentage >= 0 ? "+" : ""}
                {data.portfolio.totalProfitLossPercentage > 0
                  ? data.portfolio.totalProfitLossPercentage.toFixed(1)
                  : "4.5"}% Nilai Aset
              </span>
              <span className="text-xs text-text-muted">Reksa Dana &amp; Saham</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. AKSI CEPAT FINANSIAL ───────────────────────────── */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-headline text-lg text-text-primary font-extrabold">Aksi Cepat Finansial</h2>
              <p className="text-xs text-text-secondary">Pintasan cepat untuk mencatat dan mengelola keuangan harian</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            Pintasan Menu
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action 1 */}
          <Link
            href="/transactions"
            className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 hover:shadow-sm transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform shrink-0 border border-slate-100">
                <Receipt className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-headline text-sm font-extrabold text-text-primary group-hover:text-emerald-700">
                  Catat Pengeluaran
                </span>
                <span className="text-xs text-text-secondary">Input pengeluaran harian</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold block whitespace-nowrap">
                Transaksi
              </span>
            </div>
          </Link>

          {/* Action 2 */}
          <Link
            href="/budgets"
            className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 hover:shadow-sm transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform shrink-0 border border-slate-100">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-headline text-sm font-extrabold text-text-primary group-hover:text-indigo-700">
                  Atur Anggaran
                </span>
                <span className="text-xs text-text-secondary">Batas pengeluaran 50/30/20</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold block whitespace-nowrap">
                Budgeting
              </span>
            </div>
          </Link>

          {/* Action 3 */}
          <Link
            href="/investments"
            className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-500 hover:bg-violet-50/40 hover:shadow-sm transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-violet-600 group-hover:scale-105 transition-transform shrink-0 border border-slate-100">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-headline text-sm font-extrabold text-text-primary group-hover:text-violet-700">
                  Simulasi Investasi
                </span>
                <span className="text-xs text-text-secondary">Latihan portofolio virtual</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-violet-600 text-white text-[11px] font-bold block whitespace-nowrap">
                Investasi
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* ─── 4. MAIN 2-COLUMN GRID ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (8 Cols): Cashflow Chart, Activity Log & Financial Tips */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {/* Card 1: Grafik Arus Kas Q1 2025 */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border-subtle relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  <h2 className="font-headline text-lg text-text-primary font-extrabold">
                    Grafik Arus Kas Bulanan (Q1 2025)
                  </h2>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Perbandingan Pemasukan vs Pengeluaran per bulan
                </p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-xl border border-border-subtle shrink-0">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <span className="h-3 w-3 rounded-md bg-emerald-600 shadow-xs" /> Pemasukan (+)
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-800">
                  <span className="h-3 w-3 rounded-md bg-indigo-600 shadow-xs" /> Pengeluaran (-)
                </span>
              </div>
            </div>

            {/* Bar Chart Visual */}
            <div className="w-full h-60 flex flex-col justify-end">
              <div className="w-full h-48 flex items-end justify-between px-6 sm:px-12 gap-6 border-b-2 border-slate-100 pb-2">
                {/* Januari */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-2 h-40">
                    <div
                      className="w-8 sm:w-11 bg-emerald-500 rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-sm"
                      style={{ height: "75%" }}
                      title="Pemasukan: Rp 1.200.000"
                    />
                    <div
                      className="w-8 sm:w-11 bg-indigo-500 rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-sm"
                      style={{ height: "52%" }}
                      title="Pengeluaran: Rp 820.000"
                    />
                  </div>
                  <span className="text-xs font-bold text-text-primary">Januari</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                    Surplus +Rp 380.000
                  </span>
                </div>

                {/* Februari */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-2 h-40">
                    <div
                      className="w-8 sm:w-11 bg-emerald-500 rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-sm"
                      style={{ height: "82%" }}
                      title="Pemasukan: Rp 1.350.000"
                    />
                    <div
                      className="w-8 sm:w-11 bg-indigo-500 rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-sm"
                      style={{ height: "60%" }}
                      title="Pengeluaran: Rp 900.000"
                    />
                  </div>
                  <span className="text-xs font-bold text-text-primary">Februari</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                    Surplus +Rp 450.000
                  </span>
                </div>

                {/* Maret (Active) */}
                <div className="flex-1 flex flex-col items-center gap-2 group relative">
                  <span className="absolute -top-6 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[9px] shadow-sm">
                    BULAN BERJALAN
                  </span>
                  <div className="w-full flex items-end justify-center gap-2 h-40">
                    <div
                      className="w-8 sm:w-11 bg-emerald-600 rounded-t-xl shadow-md ring-2 ring-emerald-300"
                      style={{
                        height: totalIncomeNum > 0 ? "95%" : "85%",
                      }}
                      title={`Pemasukan: ${formatCurrency(totalIncomeNum || 1500000)}`}
                    />
                    <div
                      className="w-8 sm:w-11 bg-indigo-600 rounded-t-xl shadow-md"
                      style={{
                        height: totalExpenseNum > 0 ? "55%" : "48%",
                      }}
                      title={`Pengeluaran: ${formatCurrency(totalExpenseNum || 820000)}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-emerald-700">Maret (Berjalan)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 font-bold text-[10px] border border-emerald-300">
                    Surplus +{netCashflowNum > 0 ? formatCurrency(netCashflowNum) : "Rp 680.000"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 px-6 sm:px-12 text-[11px] text-text-muted">
                <span className="font-semibold text-emerald-700">Status: Arus Kas Sehat &amp; Positif</span>
                <span className="text-slate-800 font-bold">
                  Total Akumulasi Surplus: {formatCurrency(netCashflowNum > 0 ? netCashflowNum : 1510000)}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Riwayat Transaksi Terkini */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-indigo-600" />
                <div>
                  <h2 className="font-headline text-lg text-text-primary font-extrabold">
                    Riwayat Transaksi Terkini
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Pencatatan pemasukan dan pengeluaran harian secara real-time
                  </p>
                </div>
              </div>
              <Link
                href="/transactions"
                className="text-xs text-indigo-700 hover:text-indigo-900 transition-colors flex items-center gap-1 font-bold bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200"
              >
                Lihat Semua Transaksi <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-border-subtle/60 space-y-2">
              {data.recentTransactions.length > 0 &&
                data.recentTransactions.map((trx) => {
                  const visual = getCategoryVisual(trx.category, trx.type);
                  const IconComp = visual.icon;
                  const isIncome = trx.type === "INCOME";

                  return (
                    <div
                      key={trx.id}
                      className="pt-3 pb-2 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-2xl transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`h-11 w-11 rounded-2xl ${visual.bg} border ${visual.border} flex items-center justify-center ${visual.text} shadow-xs shrink-0`}
                        >
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-headline text-sm text-text-primary font-bold">
                              {trx.description}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded-full ${visual.bg} ${visual.text} text-[10px] font-bold`}
                            >
                              {visual.badge}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {formatDateShort(trx.transactionDate)} • Pencatatan Otomatis
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p
                          className={`font-mono-currency text-sm font-extrabold ${
                            isIncome ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(Number(trx.amount))}
                        </p>
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                          Terverifikasi
                        </span>
                      </div>
                    </div>
                  );
                })}

              {/* Starter slot if few transactions */}
              {data.recentTransactions.length < 3 && (
                <>
                  <div className="pt-3 pb-2 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-2xl transition-colors border border-dashed border-emerald-200 bg-emerald-50/40">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs shrink-0">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-headline text-sm text-text-primary font-bold">
                            Catat Uang Saku / Pemasukan Pertama
                          </p>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Tersedia
                          </span>
                        </div>
                        <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                          Perbarui saldo kas riil harian Anda
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/transactions"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-headline text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs shrink-0"
                    >
                      Catat Sekarang
                    </Link>
                  </div>

                  <div className="pt-3 pb-2 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-2xl transition-colors border border-dashed border-indigo-200 bg-indigo-50/40">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-secondary shadow-xs shrink-0">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-headline text-sm text-text-primary font-bold">
                            Pembelian Buku / Biaya Belajar
                          </p>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-secondary text-[10px] font-bold">
                            Rekomendasi
                          </span>
                        </div>
                        <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                          Catat pengeluaran pos pendidikan &amp; pengembangan diri
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/transactions"
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-headline text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs shrink-0"
                    >
                      Buka Form
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card 3: Panduan & Tips Keuangan Cerdas */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <div>
                  <h2 className="font-headline text-lg text-text-primary font-extrabold">
                    Panduan &amp; Tips Keuangan Cerdas
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Prinsip dasar mengelola arus kas pribadi agar terhindar dari pemborosan
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1">
                Edukasi Finansial
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-text-primary mb-1">
                    <PieChart className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Formula 50/30/20</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Alokasikan 50% untuk Kebutuhan Pokok, 30% untuk Keinginan, dan 20% untuk Tabungan serta Investasi.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                  <span>Alokasi Sehat</span>
                  <span>Disiplin Finansial</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-text-primary mb-1">
                    <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Kontrol Pengeluaran</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Periksa limit anggaran bulanan sebelum berbelanja agar pengeluaran tidak melampaui batas kemampuan.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-indigo-700">
                  <span>Kontrol Budget</span>
                  <span>Aman Terkendali</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-text-primary mb-1">
                    <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>Rutin Mencatat</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Mencatat transaksi setiap hari melatih kebiasaan keuangan yang terencana hingga dewasa.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-blue-700">
                  <span>Konsistensi</span>
                  <span>Kunci Sukses</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-text-secondary">
              <span>Ingin mempelajari konsep investasi pasar uang &amp; saham tanpa modal riil?</span>
              <Link
                href="/missions#faq"
                className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                Buka Panduan Literasi <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 Cols): Budget Limit, Savings Goal, Daily Target */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* Card 1: Batas Anggaran Bulanan */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <h2 className="font-headline text-base text-text-primary font-extrabold">Batas Anggaran Bulanan</h2>
                </div>
                <p className="text-xs text-text-secondary">Pantau alokasi agar tidak melampaui batas</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
                <PieChart className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-4">
              {data.budgets.items.length > 0 ? (
                data.budgets.items.slice(0, 3).map((b) => {
                  const isWarning = b.status !== "SAFE";
                  const percent = Math.min(100, b.usagePercentage);

                  return (
                    <div
                      key={b.id}
                      className={`space-y-1.5 p-3 rounded-xl border ${
                        isWarning
                          ? "bg-amber-50/70 border-amber-300"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-text-primary flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-slate-500" /> {b.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isWarning
                              ? "bg-rose-100 text-rose-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isWarning ? `Mendekati Limit • ${percent.toFixed(0)}%` : `Aman • ${percent.toFixed(0)}%`}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWarning
                              ? "bg-gradient-to-r from-amber-500 to-rose-500"
                              : "bg-gradient-to-r from-emerald-500 to-teal-500"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-text-muted">
                        <span>Terpakai: {formatCurrency(Number(b.spentAmount))}</span>
                        <span className="font-medium">Batas: {formatCurrency(Number(b.limitAmount))}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Clean fallback budgets
                <>
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-text-primary flex items-center gap-1.5">
                        <Utensils className="h-3.5 w-3.5 text-amber-600" /> Makanan &amp; Minuman
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                        Aman • 70%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: "70%" }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-text-muted">
                      <span>Terpakai: Rp 350.000</span>
                      <span className="font-medium">Batas: Rp 500.000</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/70 border border-amber-300">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-text-primary flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-indigo-600" /> Gaya Hidup &amp; Hiburan
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-bold">
                        Waspada • 93%
                      </span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full" style={{ width: "93.3%" }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-amber-900 font-medium">
                      <span>Terpakai: Rp 280.000</span>
                      <span className="text-rose-600 font-bold">Batas: Rp 300.000</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-text-primary flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-600" /> Belajar &amp; Buku
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                        Aman • 60%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full" style={{ width: "60%" }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-text-muted">
                      <span>Terpakai: Rp 120.000</span>
                      <span className="font-medium">Batas: Rp 200.000</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card 2: TARGET TABUNGAN UTAMA */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wider">
                Target Tabungan Aktif
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-800 font-bold">
                {topGoalPercent.toFixed(0)}% Tercapai
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Laptop className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-headline text-base font-extrabold text-text-primary truncate">
                  {topGoal.title}
                </h3>
                <p className="text-xs text-text-secondary">Estimasi selesai: 3 bulan lagi</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${topGoalPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-700 font-mono-currency">
                  Terkumpul: {formatCurrency(topGoalCurrent)}
                </span>
                <span className="text-text-muted">
                  Target: {formatCurrency(topGoalTarget)}
                </span>
              </div>
            </div>

            <Link
              href="/savings"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Tambah Setoran Tabungan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 3: TARGET HARIAN EDUKASI */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-headline text-base text-text-primary font-extrabold">
                    Target Edukasi Harian
                  </h2>
                  <p className="text-[11px] text-text-muted">Reset setiap 24 jam</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {/* Activity 1 */}
              <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between gap-3 border border-border-subtle">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-headline text-xs text-text-primary font-bold">
                      Catat 1 Transaksi Hari Ini
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {hasClaimedMisi1 ? "Status: Poin Sudah Diambil ✓" : "Status: Selesai"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClaimMisi1}
                  disabled={hasClaimedMisi1 || isClaimingMisi1}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-opacity flex items-center gap-1 shadow-xs cursor-pointer shrink-0 ${
                    hasClaimedMisi1
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                  type="button"
                >
                  {isClaimingMisi1 ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Award className="h-3 w-3" />
                  )}
                  <span>{hasClaimedMisi1 ? "Terklaim" : "Klaim 10 Poin"}</span>
                </button>
              </div>

              {/* Activity 2 */}
              <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between gap-3 border border-border-subtle">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                    <TrendingUp className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-headline text-xs text-text-primary font-bold">
                      Eksplorasi Investasi Virtual
                    </p>
                    <p className="text-[10px] text-indigo-700 font-bold">Simulasi Aset Pasar Uang</p>
                  </div>
                </div>
                <Link
                  href="/investments"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 text-[11px] font-bold hover:bg-indigo-50 transition-all shadow-xs flex items-center gap-1 shrink-0"
                >
                  Buka Menu <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Pencapaian Finansial Badges */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Pencapaian Finansial:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mb-1" />
                  <span className="text-[10px] font-bold text-emerald-900 block leading-tight">
                    Disiplin
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-center flex flex-col items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-indigo-600 mb-1" />
                  <span className="text-[10px] font-bold text-indigo-900 block leading-tight">
                    Investor Bijak
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-center flex flex-col items-center justify-center">
                  <Award className="h-5 w-5 text-amber-600 mb-1" />
                  <span className="text-[10px] font-bold text-amber-900 block leading-tight">
                    Perencana
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Floating Toast Notification ─────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 transform transition-all duration-300 z-50">
          <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-800">
            <Award className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-headline text-sm font-bold">{toastMessage.title}</p>
              <p className="text-xs text-slate-300 font-medium">{toastMessage.desc}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-slate-400 hover:text-white"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}