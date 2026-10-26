// src/app/(dashboard)/dashboard/page.tsx — Halaman Dashboard Utama FinZ

import React from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Award,
  Target,
  PieChart,
  PlusCircle,
  Receipt,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { getAuthUser } from "@/server/utils/auth-session";
import { dashboardService } from "@/server/services/dashboard.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency, formatDateShort } from "@/lib/formatters";
import { CashflowChart } from "@/components/dashboard/CashflowChart";

export default async function DashboardPage() {
  const authUser = await getAuthUser();
  if (!authUser) return null;

  const data = await dashboardService.getDashboardData(authUser.sub);

  const totalIncomeNum = Number(data.cashflow.totalIncome);
  const totalExpenseNum = Number(data.cashflow.totalExpense);
  const netCashflowNum = Number(data.cashflow.netCashflow);
  const virtualBalanceNum = Number(data.portfolio.virtualBalance);
  const totalPortfolioValueNum = Number(data.portfolio.totalPortfolioValue);
  const totalProfitLossNum = Number(data.portfolio.totalProfitLoss);

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Gamification Banner & Greeting ───────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 p-6 text-white shadow-xl shadow-blue-500/15 sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Petualangan Finansial Gen Z</span>
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
              Halo, {data.user.name}! 👋
            </h1>
            <p className="mt-1 text-sm text-blue-100 max-w-xl">
              Terus disiplin mencatat keuangan dan kelola portofolio simulasimu untuk
              membuka misi dan naik ke level berikutnya.
            </p>
          </div>

          {/* Level & XP Box */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/15 sm:min-w-[260px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-amber-950 font-black text-sm">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                    Peringkat Level
                  </div>
                  <div className="text-base font-extrabold text-white">
                    Level {data.xpProgress.currentLevel}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-blue-200">Total Akumulasi</div>
                <div className="text-sm font-bold text-amber-300">
                  {data.xpProgress.currentXp} XP
                </div>
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs font-semibold text-blue-100">
                <span>Progres Level {data.xpProgress.currentLevel + 1}</span>
                <span>{data.xpProgress.xpInCurrentLevel}/100 XP</span>
              </div>
              <ProgressBar
                percentage={data.xpProgress.progressPercentage}
                variant="xp"
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* ─── 4 Financial Metric Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Saldo Virtual */}
        <Card className="border-blue-100 bg-gradient-to-b from-blue-50/50 to-white">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Wallet className="h-5 w-5" />
            </div>
            <Badge variant="info">Simulasi</Badge>
          </CardHeader>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Saldo Virtual Kas
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {formatCurrency(virtualBalanceNum)}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Siap dialokasikan untuk simulasi investasi
          </p>
        </Card>

        {/* Card 2: Pemasukan Bulan Ini */}
        <Card>
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <span className="text-xs text-slate-400">Bulan ini</span>
          </CardHeader>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Pemasukan
          </div>
          <div className="mt-1 text-2xl font-black text-emerald-600">
            {formatCurrency(totalIncomeNum)}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Arus kas masuk yang dicatat
          </p>
        </Card>

        {/* Card 3: Pengeluaran Bulan Ini */}
        <Card>
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <span className="text-xs text-slate-400">Bulan ini</span>
          </CardHeader>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Pengeluaran
          </div>
          <div className="mt-1 text-2xl font-black text-rose-600">
            {formatCurrency(totalExpenseNum)}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Pengeluaran aktual bulan berjalan
          </p>
        </Card>

        {/* Card 4: Net Cashflow */}
        <Card>
          <CardHeader>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                netCashflowNum >= 0
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-600"
              }`}
            >
              <TrendingUp className="h-5 w-5" />
            </div>
            <Badge variant={netCashflowNum >= 0 ? "safe" : "danger"}>
              {netCashflowNum >= 0 ? "Surplus" : "Defisit"}
            </Badge>
          </CardHeader>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Sisa Arus Kas Bersih
          </div>
          <div
            className={`mt-1 text-2xl font-black ${
              netCashflowNum >= 0 ? "text-slate-900" : "text-rose-600"
            }`}
          >
            {formatCurrency(netCashflowNum)}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Selisih pemasukan dikurangi pengeluaran
          </p>
        </Card>
      </div>

      {/* ─── Recharts Visualization Section (TASK-20) ─────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <PieChart className="h-4 w-4" />
            </div>
            <CardTitle>Analisis Visual Arus Kas & Pos Belanja</CardTitle>
          </div>
          <Badge variant="info">Grafik Dinamis</Badge>
        </CardHeader>
        <CardContent>
          <CashflowChart
            totalIncome={totalIncomeNum}
            totalExpense={totalExpenseNum}
            categoryExpenses={data.budgets.items.map((b) => ({
              category: b.category,
              amount: Number(b.spentAmount),
            }))}
          />
        </CardContent>
      </Card>

      {/* ─── Grid 2 Columns: Anggaran & Investasi ──────────────── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Ringkasan Anggaran */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <PieChart className="h-4 w-4" />
              </div>
              <CardTitle>Pantauan Anggaran Bulanan</CardTitle>
            </div>
            <Link
              href="/budgets"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Atur Anggaran
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>

          <CardContent>
            {data.budgets.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <PieChart className="mx-auto h-8 w-8 text-slate-300" />
                <h4 className="mt-2 text-sm font-bold text-slate-700">
                  Belum Ada Anggaran
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Buat batas anggaran per kategori untuk mengontrol pengeluaran dan
                  dapatkan +20 XP!
                </p>
                <Link
                  href="/budgets"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Buat Anggaran Sekarang
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.budgets.items.slice(0, 4).map((b) => (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{b.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">
                          {formatCurrency(Number(b.spentAmount))} /{" "}
                          {formatCurrency(Number(b.limitAmount))}
                        </span>
                        <Badge
                          variant={
                            b.status === "SAFE"
                              ? "safe"
                              : b.status === "WARNING"
                              ? "warning"
                              : "danger"
                          }
                          size="sm"
                        >
                          {b.status === "SAFE"
                            ? "Aman"
                            : b.status === "WARNING"
                            ? "Waspada"
                            : "Overbudget"}
                        </Badge>
                      </div>
                    </div>
                    <ProgressBar
                      percentage={b.usagePercentage}
                      variant={
                        b.status === "SAFE"
                          ? "emerald"
                          : b.status === "WARNING"
                          ? "amber"
                          : "rose"
                      }
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ringkasan Portofolio Simulasi Investasi */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              <CardTitle>Portofolio Simulasi Investasi</CardTitle>
            </div>
            <Link
              href="/investments"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Simulasi Trading
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>

          <CardContent>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">
                    Nilai Aset Portofolio
                  </div>
                  <div className="mt-1 text-xl font-black text-slate-900">
                    {formatCurrency(totalPortfolioValueNum)}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {data.portfolio.holdingsCount} instrumen aset dimiliki
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">
                    Unrealized Profit / Loss
                  </div>
                  <div
                    className={`mt-1 text-xl font-black ${
                      totalProfitLossNum >= 0
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {totalProfitLossNum >= 0 ? "+" : ""}
                    {formatCurrency(totalProfitLossNum)}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    ({data.portfolio.totalProfitLossPercentage >= 0 ? "+" : ""}
                    {data.portfolio.totalProfitLossPercentage.toFixed(2)}%)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
              <span>Total Kekayaan Bersih (Kas + Investasi):</span>
              <span className="font-extrabold text-slate-900">
                {formatCurrency(Number(data.portfolio.totalNetWorth))}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Grid 2 Columns: Target Tabungan & Transaksi Terakhir ─ */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Target Tabungan Aktif */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <Target className="h-4 w-4" />
              </div>
              <CardTitle>Target Tabungan Aktif</CardTitle>
            </div>
            <Link
              href="/savings"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Lihat Semua
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>

          <CardContent>
            {data.savings.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <Target className="mx-auto h-8 w-8 text-slate-300" />
                <h4 className="mt-2 text-sm font-bold text-slate-700">
                  Belum Ada Target Tabungan
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Tentukan tujuan tabunganmu (laptop, dana darurat, kursus) dan raih
                  +25 XP!
                </p>
                <Link
                  href="/savings"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Buat Target Tabungan
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.savings.items.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="rounded-xl border border-slate-100 p-3.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800">{goal.title}</span>
                      <span className="text-blue-600">
                        {goal.progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar
                        percentage={goal.progressPercentage}
                        variant="blue"
                        size="sm"
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                      <span>Terkumpul: {formatCurrency(Number(goal.currentAmount))}</span>
                      <span>Target: {formatCurrency(Number(goal.targetAmount))}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 5 Transaksi Terakhir */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Receipt className="h-4 w-4" />
              </div>
              <CardTitle>Transaksi Terakhir</CardTitle>
            </div>
            <Link
              href="/transactions"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Semua Transaksi
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>

          <CardContent>
            {data.recentTransactions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <Receipt className="mx-auto h-8 w-8 text-slate-300" />
                <h4 className="mt-2 text-sm font-bold text-slate-700">
                  Belum Ada Transaksi
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Mulai catat pengeluaran atau uang saku hari ini untuk mendapatkan +10 XP!
                </p>
                <Link
                  href="/transactions"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Catat Transaksi Pertama
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {data.recentTransactions.map((trx) => (
                  <div
                    key={trx.id}
                    className="flex items-center justify-between py-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          trx.type === "INCOME"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {trx.type === "INCOME" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{trx.description}</div>
                        <div className="text-[11px] text-slate-400">
                          {trx.category} • {formatDateShort(trx.transactionDate)}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`font-black text-sm ${
                        trx.type === "INCOME"
                          ? "text-emerald-600"
                          : "text-slate-900"
                      }`}
                    >
                      {trx.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(Number(trx.amount))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
