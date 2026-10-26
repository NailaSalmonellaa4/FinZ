// src/server/services/dashboard.service.ts — Layanan Agregasi Data Dashboard Finansial & Gamifikasi
// Referensi: PRD.md Section 5.1 B & SKILL.md Section 3.1 (Prisma Promise.all Optimization)

import prisma from "@/lib/prisma";
import { NotFoundError } from "@/server/utils/api-response";
import { formatTransaction } from "@/server/services/transaction.service";
import { budgetService } from "@/server/services/budget.service";
import { savingsService } from "@/server/services/savings.service";
import { investmentService } from "@/server/services/investment.service";

export class DashboardService {
  /**
   * Mengambil agregasi lengkap dashboard keuangan untuk pengguna yang login pada bulan berjalan.
   */
  async getDashboardData(userId: string) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    // Jalankan seluruh query database independen secara paralel (Promise.all)
    const [
      user,
      cashflowGroups,
      budgetResult,
      savingsResult,
      portfolioResult,
      recentTransactions,
    ] = await Promise.all([
      // 1. Profil pengguna
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          level: true,
          xp: true,
          virtualBalance: true,
          createdAt: true,
        },
      }),

      // 2. Arus kas bulan berjalan
      prisma.transaction.groupBy({
        by: ["type"],
        where: {
          userId,
          transactionDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // 3. Ringkasan anggaran bulan berjalan
      budgetService.getBudgets(userId, {
        month: currentMonth,
        year: currentYear,
      }),

      // 4. Ringkasan target tabungan
      savingsService.getSavingsGoals(userId),

      // 5. Ringkasan portofolio investasi simulasi
      investmentService.getPortfolio(userId),

      // 6. 5 Transaksi terakhir
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { transactionDate: "desc" },
        take: 5,
      }),
    ]);

    if (!user) {
      throw new NotFoundError("Data pengguna tidak ditemukan.");
    }

    // Kalkulasi pemasukan & pengeluaran bulan berjalan
    let totalIncome = BigInt(0);
    let totalExpense = BigInt(0);

    for (const group of cashflowGroups) {
      if (group.type === "INCOME" && group._sum.amount) {
        totalIncome = group._sum.amount;
      } else if (group.type === "EXPENSE" && group._sum.amount) {
        totalExpense = group._sum.amount;
      }
    }

    const netCashflow = totalIncome - totalExpense;

    // Kalkulasi progres XP menuju level berikutnya (100 XP per level)
    const currentXpInLevel = user.xp % 100;
    const xpProgressPercentage = currentXpInLevel; // Karena 1 level = 100 XP, 0-99 = 0%-99%

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        virtualBalance: user.virtualBalance.toString(),
        createdAt: user.createdAt.toISOString(),
      },
      cashflow: {
        month: currentMonth,
        year: currentYear,
        totalIncome: totalIncome.toString(),
        totalExpense: totalExpense.toString(),
        netCashflow: netCashflow.toString(),
      },
      xpProgress: {
        currentXp: user.xp,
        currentLevel: user.level,
        xpInCurrentLevel: currentXpInLevel,
        xpForNextLevel: 100,
        progressPercentage: xpProgressPercentage,
      },
      budgets: budgetResult,
      savings: savingsResult,
      portfolio: {
        virtualBalance: portfolioResult.virtualBalance,
        totalPortfolioValue: portfolioResult.totalPortfolioValue,
        totalProfitLoss: portfolioResult.totalProfitLoss,
        totalProfitLossPercentage: portfolioResult.totalProfitLossPercentage,
        totalNetWorth: portfolioResult.totalNetWorth,
        holdingsCount: portfolioResult.holdings.length,
      },
      recentTransactions: recentTransactions.map(formatTransaction),
    };
  }
}

export const dashboardService = new DashboardService();
