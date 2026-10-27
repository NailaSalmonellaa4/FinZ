// src/components/dashboard/QuestDashboardView.tsx — Tampilan Interaktif Dashboard RPG FinZ Quest
"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  const [hasClaimedChest, setHasClaimedChest] = useState(false);
  const [hasClaimedMisi1, setHasClaimedMisi1] = useState(false);

  const totalIncomeNum = Number(data.cashflow.totalIncome);
  const totalExpenseNum = Number(data.cashflow.totalExpense);
  const netCashflowNum = Number(data.cashflow.netCashflow);
  const virtualBalanceNum = Number(data.portfolio.virtualBalance);
  const totalPortfolioValueNum = Number(data.portfolio.totalPortfolioValue);

  const level = data.xpProgress.currentLevel;
  const xpInLevel = data.xpProgress.xpInCurrentLevel;
  const progressPercent = data.xpProgress.progressPercentage;
  const xpNeeded = Math.max(0, 100 - xpInLevel);

  function triggerToast(title: string, desc: string) {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }

  function handleClaimChest() {
    if (hasClaimedChest) return;
    setHasClaimedChest(true);
    triggerToast(
      "🎁 Peti Harian Berhasil Diklaim!",
      `+15 EXP & +5 Gems ditambahkan ke status ${data.user.name}! 🔥`
    );
  }

  function handleClaimMisi1() {
    if (hasClaimedMisi1) return;
    setHasClaimedMisi1(true);
    triggerToast(
      "🎯 Misi Harian Berhasil Diklaim!",
      `+10 EXP & lencana Disiplin diperkuat! ⚡`
    );
  }

  // Top savings goal or default
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

  // Category Icon & Tag Helper
  function getCategoryVisual(category: string, type: "INCOME" | "EXPENSE") {
    if (type === "INCOME") {
      return { emoji: "💰", badge: "Income Buff", bg: "bg-emerald-100", border: "border-emerald-200", text: "text-emerald-700" };
    }
    const catLower = category.toLowerCase();
    if (catLower.includes("makan") || catLower.includes("snack") || catLower.includes("kantin")) {
      return { emoji: "🍔", badge: "Pos Makanan", bg: "bg-amber-100", border: "border-amber-200", text: "text-amber-700" };
    }
    if (catLower.includes("buku") || catLower.includes("ajar") || catLower.includes("kursus") || catLower.includes("ilmu")) {
      return { emoji: "📚", badge: "Skill Upgrade", bg: "bg-indigo-100", border: "border-indigo-200", text: "text-secondary" };
    }
    if (catLower.includes("hibur") || catLower.includes("game") || catLower.includes("nongkrong")) {
      return { emoji: "🎮", badge: "Pos Hiburan", bg: "bg-purple-100", border: "border-purple-200", text: "text-gamify-xp" };
    }
    return { emoji: "🏷️", badge: category, bg: "bg-slate-100", border: "border-slate-200", text: "text-slate-700" };
  }

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* ─── HERO / QUEST BANNER: Game RPG & Adventure Theme ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#005236] via-[#006c49] to-[#4648d4] p-6 md:p-8 text-white shadow-xl border border-emerald-400/20">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute right-60 -bottom-20 h-52 w-52 rounded-full bg-purple-400/20 blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 top-2 text-white/10 text-7xl font-extrabold select-none pointer-events-none">
          QUEST
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-label-sm text-xs font-bold border border-white/25">
                <span className="text-sm">⚔️</span> Level {level} • Explorer Finansial
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-label-sm text-xs font-extrabold shadow-sm">
                <span>🔥</span> 5 Hari Streak Aktif
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/40 text-purple-100 font-label-sm text-xs font-bold backdrop-blur-md border border-purple-300/30">
                <span>✨</span> +25% EXP Buff
              </span>
            </div>

            <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              🎮 Petualangan Finansial {data.user.name}: Season 1 - Cashflow Mastery
            </h1>
            <p className="font-body text-sm md:text-base text-emerald-100/90 leading-relaxed">
              Selesaikan misi harian, kalahkan boncos, dan kumpulkan EXP untuk menjadi Grand Master Finansial! Semua aset virtual 100% aman untuk petualanganmu.
            </p>
          </div>

          {/* HUD Status Card */}
          <div className="bg-white/95 backdrop-blur-md text-[#0F172A] rounded-2xl p-5 shadow-2xl w-full lg:w-84 border-2 border-amber-300/60 flex flex-col justify-between space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[11px] tracking-wide inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">shield</span> Tier Explorer {level}
                </span>
                <div className="font-headline text-base text-secondary font-extrabold mt-1">
                  {xpInLevel} <span className="text-xs text-text-muted font-normal">/ 100 EXP</span>
                </div>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-gamify-xp to-secondary text-white flex items-center justify-center font-extrabold shadow-md">
                <span className="material-symbols-outlined text-2xl">trophy</span>
              </div>
            </div>

            {/* Glowing EXP Meter */}
            <div className="space-y-1">
              <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden p-0.5 border border-purple-200">
                <div
                  className="bg-gradient-to-r from-secondary via-gamify-xp to-primary-container h-full rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-text-muted flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-xs text-status-safe">add_circle</span> +10 EXP per aksi
                </span>
                <span className="font-bold text-primary">Sisa {xpNeeded} EXP lagi!</span>
              </div>
            </div>

            {/* Daily Chest Claim Button */}
            <button
              onClick={handleClaimChest}
              disabled={hasClaimedChest}
              className={`w-full py-2.5 px-3 rounded-xl font-label-md font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                hasClaimedChest
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 hover:shadow-lg"
              }`}
              type="button"
            >
              <span>🎁</span> {hasClaimedChest ? "Peti Harian Terklaim ✅" : "Klaim Peti Harian (+15 EXP)"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── 4 RPG ATTRIBUTE CARDS (Financial Overview) ────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Pundi Kas Tersedia */}
        <div className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 border-2 border-emerald-500/20 hover:border-emerald-500/50 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-125 transition-transform pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-secondary flex items-center gap-1">
              <span>🪙</span> Pundi Kas Tersedia
            </span>
            <div className="h-9 w-9 rounded-xl bg-status-safe-bg text-status-safe flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            </div>
          </div>
          <div>
            <p className="font-headline text-xl font-extrabold text-text-primary tracking-tight">
              {formatCurrency(virtualBalanceNum)}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-status-safe-bg text-status-safe">
                Siap Dipakai
              </span>
              <span className="text-xs text-text-muted font-medium">100% Virtual</span>
            </div>
          </div>
        </div>

        {/* Card 2: Mana Pemasukan */}
        <div className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 border-2 border-primary/20 hover:border-primary/50 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-125 transition-transform pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-secondary flex items-center gap-1">
              <span>📥</span> Mana Pemasukan
            </span>
            <div className="h-9 w-9 rounded-xl bg-status-safe-bg text-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-xl">trending_up</span>
            </div>
          </div>
          <div>
            <p className="font-headline text-xl font-extrabold text-text-primary tracking-tight">
              {formatCurrency(totalIncomeNum)}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                +12% Buff
              </span>
              <span className="text-xs text-text-muted">vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Card 3: Beban Pengeluaran */}
        <div className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 border-2 border-indigo-500/20 hover:border-indigo-500/50 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-50 rounded-full group-hover:scale-125 transition-transform pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-secondary flex items-center gap-1">
              <span>📤</span> Beban Pengeluaran
            </span>
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-secondary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-xl">payments</span>
            </div>
          </div>
          <div>
            <p className="font-headline text-xl font-extrabold text-text-primary tracking-tight">
              {formatCurrency(totalExpenseNum)}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-100 text-secondary">
                Terkendali {data.budgets.summary?.totalUsagePercentage ? `${data.budgets.summary.totalUsagePercentage.toFixed(0)}%` : "54%"}
              </span>
              <span className="text-xs text-text-muted">Batas Aman</span>
            </div>
          </div>
        </div>

        {/* Card 4: Vault Investasi */}
        <div className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 border-2 border-purple-500/20 hover:border-purple-500/50 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-purple-50 rounded-full group-hover:scale-125 transition-transform pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-secondary flex items-center gap-1">
              <span>💎</span> Vault Investasi
            </span>
            <div className="h-9 w-9 rounded-xl bg-gamify-xp-bg text-gamify-xp flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-xl">query_stats</span>
            </div>
          </div>
          <div>
            <p className="font-headline text-xl font-extrabold text-text-primary tracking-tight">
              {formatCurrency(totalPortfolioValueNum > 0 ? totalPortfolioValueNum : 10450000)}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-100 text-gamify-xp">
                {data.portfolio.totalProfitLossPercentage >= 0 ? "+" : ""}
                {data.portfolio.totalProfitLossPercentage > 0
                  ? data.portfolio.totalProfitLossPercentage.toFixed(1)
                  : "4.5"}% Crit Gain!
              </span>
              <span className="text-xs text-text-muted">Reksadana &amp; Saham</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── DAILY ACTION QUESTS (Gamified Quest Hub) ─────────── */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">swords</span>
            </div>
            <div>
              <h2 className="font-headline text-lg text-text-primary font-extrabold">Aksi Cepat Quest Harian</h2>
              <p className="text-xs text-text-secondary">Eksekusi komando untuk perkuat status karaktermu</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-gamify-xp font-label-sm text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">stars</span> Bonus XP &amp; Gems Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Quest 1 */}
          <Link
            href="/transactions"
            className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border-2 border-emerald-300 hover:border-emerald-500 hover:shadow-md transition-all text-left cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                ⚔️
              </div>
              <div>
                <span className="block font-headline text-sm font-extrabold text-text-primary group-hover:text-primary">
                  Catat Pengeluaran
                </span>
                <span className="text-xs text-text-secondary">Update pos jajan harian</span>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-status-safe text-white font-label-sm text-[11px] font-extrabold shadow-sm block whitespace-nowrap">
                +10 EXP
              </span>
              <span className="text-[10px] text-purple-700 font-bold block mt-1">+5 Gems</span>
            </div>
          </Link>

          {/* Quest 2 */}
          <Link
            href="/budgets"
            className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border-2 border-indigo-300 hover:border-secondary hover:shadow-md transition-all text-left cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <div>
                <span className="block font-headline text-sm font-extrabold text-text-primary group-hover:text-secondary">
                  Fortifikasi Budget
                </span>
                <span className="text-xs text-text-secondary">Kunci kebocoran dana</span>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-secondary text-white font-label-sm text-[11px] font-extrabold shadow-sm block whitespace-nowrap">
                +20 EXP
              </span>
              <span className="text-[10px] text-purple-700 font-bold block mt-1">+10 Gems</span>
            </div>
          </Link>

          {/* Quest 3 */}
          <Link
            href="/investments"
            className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-50/80 to-fuchsia-50/60 border-2 border-purple-300 hover:border-gamify-xp hover:shadow-md transition-all text-left cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🚀
              </div>
              <div>
                <span className="block font-headline text-sm font-extrabold text-text-primary group-hover:text-gamify-xp">
                  Simulasi Investasi
                </span>
                <span className="text-xs text-text-secondary">Arena compound interest</span>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-gamify-xp text-white font-label-sm text-[11px] font-extrabold shadow-sm block whitespace-nowrap">
                +30 EXP
              </span>
              <span className="text-[10px] text-amber-700 font-bold block mt-1">Rare Trophy</span>
            </div>
          </Link>
        </div>
      </div>

      {/* ─── MAIN 2-COLUMN GRID (8 Col Left / 4 Col Right) ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (8 Cols): Battle Stats Chart & Adventure Log */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {/* Cashflow Chart: Monthly Battle Stats */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border-subtle relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🗺️</span>
                  <h2 className="font-headline text-lg text-text-primary font-extrabold">
                    Peta Arus Kas Q1 2025 (Monthly Battle Stats)
                  </h2>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Mana Pemasukan vs Beban Pengeluaran tiap siklus dungeon
                </p>
              </div>
              <div className="flex items-center gap-4 bg-surface-container-low px-3 py-1.5 rounded-xl border border-border-subtle">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <span className="h-3 w-3 rounded-md bg-primary-container shadow-xs" /> Mana (+Masuk)
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-800">
                  <span className="h-3 w-3 rounded-md bg-secondary shadow-xs" /> Beban (-Keluar)
                </span>
              </div>
            </div>

            {/* Bar Chart with RPG Game Styling */}
            <div className="w-full h-60 flex flex-col justify-end">
              <div className="w-full h-48 flex items-end justify-between px-6 sm:px-12 gap-6 border-b-2 border-surface-container pb-2">
                {/* Januari */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-2 h-40">
                    <div
                      className="w-8 sm:w-11 bg-gradient-to-t from-primary to-primary-container rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-sm"
                      style={{ height: "75%" }}
                      title="Masuk: Rp 1.200.000"
                    />
                    <div
                      className="w-8 sm:w-11 bg-gradient-to-t from-[#3b3dbf] to-secondary rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-sm"
                      style={{ height: "52%" }}
                      title="Keluar: Rp 820.000"
                    />
                  </div>
                  <span className="text-xs font-bold text-text-primary">Januari</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-[10px] border border-emerald-200">
                    Surplus +380k 🪙
                  </span>
                </div>

                {/* Februari */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-2 h-40">
                    <div
                      className="w-8 sm:w-11 bg-gradient-to-t from-primary to-primary-container rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-sm"
                      style={{ height: "82%" }}
                      title="Masuk: Rp 1.350.000"
                    />
                    <div
                      className="w-8 sm:w-11 bg-gradient-to-t from-[#3b3dbf] to-secondary rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-sm"
                      style={{ height: "60%" }}
                      title="Keluar: Rp 900.000"
                    />
                  </div>
                  <span className="text-xs font-bold text-text-primary">Februari</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-[10px] border border-emerald-200">
                    Surplus +450k 🪙
                  </span>
                </div>

                {/* Maret (Active Battle) */}
                <div className="flex-1 flex flex-col items-center gap-2 group relative">
                  <span className="absolute -top-6 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-extrabold text-[9px] shadow-sm animate-bounce">
                    ⚔️ ACTIVE BATTLE
                  </span>
                  <div className="w-full flex items-end justify-center gap-2 h-40">
                    <div
                      className="w-8 sm:w-11 bg-gradient-to-t from-emerald-600 via-primary to-emerald-400 rounded-t-xl shadow-md ring-2 ring-emerald-300"
                      style={{
                        height: totalIncomeNum > 0 ? "95%" : "85%",
                      }}
                      title={`Masuk: ${formatCurrency(totalIncomeNum || 1500000)}`}
                    />
                    <div
                      className="w-8 sm:w-11 bg-gradient-to-t from-indigo-700 via-secondary to-indigo-400 rounded-t-xl shadow-md"
                      style={{
                        height: totalExpenseNum > 0 ? "55%" : "48%",
                      }}
                      title={`Keluar: ${formatCurrency(totalExpenseNum || 820000)}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-primary">Maret (Berjalan)</span>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-900 font-extrabold text-[10px] border border-emerald-300 shadow-xs">
                    Surplus +{netCashflowNum > 0 ? `${(netCashflowNum / 1000).toFixed(0)}k` : "680k"} 🪙
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 px-6 sm:px-12 text-[11px] text-text-muted">
                <span>Battle Rank: S-Tier (Cashflow Positif)</span>
                <span className="text-primary font-bold">
                  Total Akumulasi Surplus: {formatCurrency(netCashflowNum > 0 ? netCashflowNum : 1510000)}
                </span>
              </div>
            </div>
          </div>

          {/* RPG Activity Log: Log Petualangan & Transaksi */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <div>
                  <h2 className="font-headline text-lg text-text-primary font-extrabold">
                    Log Petualangan &amp; Transaksi Terkini
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Setiap aksi disiplin memberikan EXP &amp; memperkuat karaktermu
                  </p>
                </div>
              </div>
              <Link
                href="/transactions"
                className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1 font-bold bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200"
              >
                Buka Arsip Lengkap <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="divide-y divide-border-subtle/60 space-y-2">
              {data.recentTransactions.length > 0 ? (
                data.recentTransactions.map((trx) => {
                  const visual = getCategoryVisual(trx.category, trx.type);
                  const isIncome = trx.type === "INCOME";
                  const xpBonus = isIncome ? "+15 EXP" : "+10 EXP";

                  return (
                    <div
                      key={trx.id}
                      className="pt-3 pb-2 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-2xl transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`h-11 w-11 rounded-2xl ${visual.bg} border ${visual.border} flex items-center justify-center ${visual.text} text-xl shadow-xs`}
                        >
                          {visual.emoji}
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
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            {formatDateShort(trx.transactionDate)} • QRIS Virtual Quest
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`font-mono-currency text-sm font-extrabold ${
                            isIncome ? "text-status-safe" : "text-status-danger"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(Number(trx.amount))}
                        </p>
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-purple-100 text-gamify-xp text-[10px] font-extrabold">
                          <span className="material-symbols-outlined text-[11px]">bolt</span> {xpBonus}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Default fallback transactions from user's mockup when brand new
                <>
                  <div className="pt-3 pb-2 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-2xl transition-colors border border-transparent hover:border-slate-200">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 text-xl shadow-xs">
                        🍔
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-headline text-sm text-text-primary font-bold">Makan Siang Kantin Sehat</p>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Pos Makanan</span>
                        </div>
                        <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-xs">schedule</span> Hari Ini, 12:40 WIB • QRIS Virtual Quest
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono-currency text-sm text-status-danger font-extrabold">-Rp 25.000</p>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-purple-100 text-gamify-xp text-[10px] font-extrabold">
                        <span className="material-symbols-outlined text-[11px]">bolt</span> +10 EXP
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 pb-2 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-2xl transition-colors border border-transparent hover:border-slate-200">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xl shadow-xs">
                        💰
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-headline text-sm text-text-primary font-bold">Mana Drop: Uang Saku Bulanan</p>
                          <span className="px-2 py-0.5 rounded-full bg-status-safe-bg text-primary text-[10px] font-bold">Income Buff</span>
                        </div>
                        <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-xs">schedule</span> Kemarin, 08:00 WIB • Transfer Ortu Guild
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono-currency text-sm text-status-safe font-extrabold">+Rp 500.000</p>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-purple-100 text-gamify-xp text-[10px] font-extrabold">
                        <span className="material-symbols-outlined text-[11px]">bolt</span> +15 EXP
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 pb-2 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-2xl transition-colors border border-transparent hover:border-slate-200">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-secondary text-xl shadow-xs">
                        📚
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-headline text-sm text-text-primary font-bold">Upgrade Knowledge: Modul &amp; Buku</p>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-secondary text-[10px] font-bold">Skill Upgrade</span>
                        </div>
                        <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-xs">schedule</span> 3 Maret 2025 • Toko Buku Guild
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono-currency text-sm text-status-danger font-extrabold">-Rp 45.000</p>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-purple-100 text-gamify-xp text-[10px] font-extrabold">
                        <span className="material-symbols-outlined text-[11px]">bolt</span> +10 EXP
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 Cols): Shield Bar, Boss Quest, Guild Missions */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* Shield Anggaran (Health & Shield Bar) */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">🛡️</span>
                  <h2 className="font-headline text-base text-text-primary font-extrabold">Shield Anggaran</h2>
                </div>
                <p className="text-xs text-text-secondary">Pertahankan shield dari monster boncos</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-status-safe-bg text-status-safe flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-base">security</span>
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
                          ? "bg-amber-50/70 border-2 border-amber-300"
                          : "bg-slate-50 border-slate-200/60"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-text-primary flex items-center gap-1">
                          <span>{b.category.toLowerCase().includes("makan") ? "🥪" : "🎮"}</span>{" "}
                          {b.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isWarning
                              ? "bg-rose-100 text-status-danger animate-pulse flex items-center gap-0.5"
                              : "bg-status-safe-bg text-status-safe"
                          }`}
                        >
                          {isWarning ? `⚠️ Boss Warning! ${percent.toFixed(0)}%` : `Shield Aman • ${percent.toFixed(0)}%`}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWarning
                              ? "bg-gradient-to-r from-amber-500 to-rose-500"
                              : "bg-gradient-to-r from-emerald-500 to-status-safe"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-text-muted">
                        <span>Terpakai: {formatCurrency(Number(b.spentAmount))}</span>
                        <span className="font-medium">Kapasitas: {formatCurrency(Number(b.limitAmount))}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Mockup default budgets when empty
                <>
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-text-primary flex items-center gap-1">
                        <span>🥪</span> Makanan &amp; Snack
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-status-safe-bg text-status-safe font-extrabold">
                        Shield Aman • 70%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-status-safe h-full rounded-full transition-all duration-500" style={{ width: "70%" }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-text-muted">
                      <span>Terpakai: Rp 350.000</span>
                      <span className="font-medium">Kapasitas: Rp 500.000</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/70 border-2 border-amber-300">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-text-primary flex items-center gap-1">
                        <span>🎮</span> Hiburan &amp; Nongkrong
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-status-danger font-extrabold flex items-center gap-0.5 animate-pulse">
                        ⚠️ Boss Warning! 93%
                      </span>
                    </div>
                    <div className="w-full bg-amber-200/80 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500" style={{ width: "93.3%" }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-amber-900 font-medium">
                      <span className="font-bold">Terpakai: Rp 280.000</span>
                      <span className="text-rose-600 font-bold">Limit: Rp 300.000 (Kritis)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-text-primary flex items-center gap-1">
                        <span>📖</span> Belajar &amp; Buku
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-status-safe-bg text-status-safe font-extrabold">
                        Shield Solid • 60%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-teal-500 to-primary-container h-full rounded-full transition-all duration-500" style={{ width: "60%" }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-text-muted">
                      <span>Terpakai: Rp 120.000</span>
                      <span className="font-medium">Kapasitas: Rp 200.000</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* MAIN BOSS QUEST: Top Savings Goal */}
          <div className="rounded-3xl bg-gradient-to-br from-white to-amber-50/50 p-6 shadow-sm border-2 border-amber-300 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <span>🏆</span> Main Boss Quest
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-purple-100 text-gamify-xp font-extrabold">
                {topGoalPercent.toFixed(0)}% HP Tercapai
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-md flex items-center justify-center text-amber-950 text-2xl flex-shrink-0">
                💻
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-headline text-base font-extrabold text-text-primary truncate">
                  {topGoal.title}
                </h3>
                <p className="text-xs text-text-secondary">Estimasi taklukan: 3 siklus bulan lagi</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden border border-amber-200">
                <div
                  className="bg-gradient-to-r from-amber-500 via-primary-container to-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${topGoalPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-primary font-mono-currency">
                  Terkumpul: {formatCurrency(topGoalCurrent)}
                </span>
                <span className="text-text-muted">
                  Target: {formatCurrency(topGoalTarget)}
                </span>
              </div>
            </div>

            <Link
              href="/savings"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-700 hover:to-primary text-white font-label-md font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-98"
            >
              <span className="text-base">⚡</span> Tempa Tabungan (+15 EXP)
            </Link>
          </div>

          {/* PAPAN MISI GUILD HARIAN & BADGES */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-100 text-gamify-xp flex items-center justify-center font-bold">
                  <span className="text-base">🎯</span>
                </div>
                <div>
                  <h2 className="font-headline text-base text-text-primary font-extrabold">
                    Papan Misi Guild Harian
                  </h2>
                  <p className="text-[11px] text-text-muted">Reset dalam 11 jam lagi</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {/* Misi 1 */}
              <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-3 border border-border-subtle">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-status-safe-bg text-status-safe flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <div>
                    <p className="font-headline text-xs text-text-primary font-bold">
                      Catat 1 Transaksi Hari Ini
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {hasClaimedMisi1 ? "Status: Hadiah Diambil ✅" : "Status: Selesai"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClaimMisi1}
                  disabled={hasClaimedMisi1}
                  className={`px-2.5 py-1.5 rounded-lg font-label-sm text-[11px] font-extrabold transition-opacity flex items-center gap-1 shadow-xs cursor-pointer ${
                    hasClaimedMisi1
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-gamify-xp text-white hover:opacity-90"
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-xs">redeem</span>
                  {hasClaimedMisi1 ? "Terklaim" : "Klaim 10 EXP"}
                </button>
              </div>

              {/* Misi 2 */}
              <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-3 border border-border-subtle">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-slate-200 text-text-muted flex items-center justify-center">
                    <span className="material-symbols-outlined text-xs">hourglass_empty</span>
                  </div>
                  <div>
                    <p className="font-headline text-xs text-text-primary font-bold">
                      Beli Aset Edukasi di Arena
                    </p>
                    <p className="text-[10px] text-purple-700 font-bold">Reward: +30 EXP</p>
                  </div>
                </div>
                <Link
                  href="/investments"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-secondary/30 text-secondary font-label-sm text-[11px] font-extrabold hover:bg-secondary hover:text-white transition-all shadow-xs flex items-center gap-1"
                >
                  Mulai Misi <span className="material-symbols-outlined text-xs">play_arrow</span>
                </Link>
              </div>
            </div>

            {/* Koleksi Lencana RPG (Badges showcase) */}
            <div className="pt-3 border-t border-border-subtle">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block mb-2">
                Lencana Guild Terpasang:
              </span>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-xl block mb-0.5">🎖️</span>
                  <span className="text-[10px] font-extrabold text-emerald-900 block leading-tight">
                    Disiplin
                  </span>
                </div>
                <div className="flex-1 p-2 rounded-xl bg-purple-50 border border-purple-200 text-center">
                  <span className="text-xl block mb-0.5">💎</span>
                  <span className="text-[10px] font-extrabold text-purple-900 block leading-tight">
                    Investor
                  </span>
                </div>
                <div className="flex-1 p-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-xl block mb-0.5">👑</span>
                  <span className="text-[10px] font-extrabold text-amber-900 block leading-tight">
                    Master S1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Floating Toast Notification ─────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 transform transition-all duration-300 z-50 animate-bounce">
          <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-secondary via-gamify-xp to-purple-700 text-white shadow-2xl border-2 border-amber-300">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-headline text-sm font-extrabold">{toastMessage.title}</p>
              <p className="text-xs text-white/90 font-medium">{toastMessage.desc}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-white/80 hover:text-white"
              type="button"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
