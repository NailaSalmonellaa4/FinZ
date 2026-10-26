// src/server/services/budget.service.ts — Layanan Manajemen Anggaran Bulanan (Budgeting)
// Referensi: PRD.md Section 5.1 D & ARCHITECTURE.md Section 4

import { MissionType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { gamificationService } from "@/server/services/gamification.service";
import { XP_REWARDS, type BudgetItem, type BudgetStatusEnum } from "@/types";
import type { UpsertBudgetInput, QueryBudgetInput } from "@/server/validators/finance.schema";

export function determineBudgetStatus(usagePercentage: number): BudgetStatusEnum {
  if (usagePercentage < 80) return "SAFE";
  if (usagePercentage < 100) return "WARNING";
  return "OVERBUDGET";
}

export class BudgetService {
  /**
   * Membuat atau memperbarui (upsert) batas anggaran bulanan per kategori.
   */
  async upsertBudget(userId: string, input: UpsertBudgetInput) {
    // 1. Cek apakah anggaran sudah pernah dibuat sebelumnya
    const existingBudget = await prisma.budget.findUnique({
      where: {
        userId_category_month_year: {
          userId,
          category: input.category,
          month: input.month,
          year: input.year,
        },
      },
    });

    const isNewBudget = !existingBudget;

    // 2. Upsert ke database
    const budget = await prisma.budget.upsert({
      where: {
        userId_category_month_year: {
          userId,
          category: input.category,
          month: input.month,
          year: input.year,
        },
      },
      update: {
        limitAmount: input.limitAmount,
      },
      create: {
        userId,
        category: input.category,
        limitAmount: input.limitAmount,
        month: input.month,
        year: input.year,
      },
    });

    // 3. Gamifikasi: Berikan +20 XP jika anggaran kategori ini baru pertama kali dibuat pada periode ini
    let totalXpGained = 0;
    let leveledUp = false;

    if (isNewBudget) {
      const xpResult = await gamificationService.awardXp(userId, XP_REWARDS.CREATE_BUDGET);
      totalXpGained += xpResult.xpGained;
      leveledUp = leveledUp || xpResult.leveledUp;

      const missionResult = await gamificationService.trackMissionProgress(
        userId,
        MissionType.CREATE_BUDGET
      );
      totalXpGained += missionResult.xpGained;
      leveledUp = leveledUp || missionResult.leveledUp;
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, xp: true },
    });

    // 4. Hitung pengeluaran aktual pada kategori & bulan ini
    const calculatedBudget = await this.calculateSingleBudget(userId, budget);

    return {
      budget: calculatedBudget,
      meta: {
        xpGained: totalXpGained,
        leveledUp,
        currentLevel: updatedUser?.level ?? 1,
        currentXp: updatedUser?.xp ?? 0,
      },
    };
  }

  /**
   * Mengambil seluruh daftar anggaran pada bulan dan tahun tertentu dengan kalkulasi status & sisa.
   */
  async getBudgets(userId: string, query: QueryBudgetInput) {
    const month = query.month ?? new Date().getMonth() + 1;
    const year = query.year ?? new Date().getFullYear();

    // 1. Ambil semua batas anggaran pengguna pada periode terkait
    const budgets = await prisma.budget.findMany({
      where: {
        userId, // Strict IDOR isolation
        month,
        year,
      },
      orderBy: { category: "asc" },
    });

    // 2. Ambil pengeluaran aktual per kategori untuk bulan dan tahun yang sama
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const expensesByCategory = await prisma.transaction.groupBy({
      by: ["category"],
      where: {
        userId,
        type: "EXPENSE",
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const expenseMap = new Map<string, bigint>();
    for (const group of expensesByCategory) {
      if (group._sum.amount) {
        expenseMap.set(group.category, group._sum.amount);
      }
    }

    let totalBudgetLimit = BigInt(0);
    let totalBudgetSpent = BigInt(0);

    const items: BudgetItem[] = budgets.map((b) => {
      const spent = expenseMap.get(b.category) ?? BigInt(0);
      const limit = b.limitAmount;

      totalBudgetLimit += limit;
      totalBudgetSpent += spent;

      const remaining = limit > spent ? limit - spent : BigInt(0);
      const usagePercentage =
        limit > BigInt(0)
          ? Math.round((Number(spent) / Number(limit)) * 10000) / 100
          : 0;

      const status = determineBudgetStatus(usagePercentage);

      return {
        id: b.id,
        category: b.category,
        limitAmount: limit.toString(),
        spentAmount: spent.toString(),
        remainingAmount: remaining.toString(),
        usagePercentage,
        status,
        month: b.month,
        year: b.year,
      };
    });

    const totalUsagePercentage =
      totalBudgetLimit > BigInt(0)
        ? Math.round((Number(totalBudgetSpent) / Number(totalBudgetLimit)) * 10000) / 100
        : 0;

    return {
      items,
      summary: {
        totalLimit: totalBudgetLimit.toString(),
        totalSpent: totalBudgetSpent.toString(),
        totalRemaining: (totalBudgetLimit > totalBudgetSpent
          ? totalBudgetLimit - totalBudgetSpent
          : BigInt(0)
        ).toString(),
        totalUsagePercentage,
        status: determineBudgetStatus(totalUsagePercentage),
        month,
        year,
      },
    };
  }

  /**
   * Helper internal untuk menghitung penggunaan satu anggaran
   */
  private async calculateSingleBudget(
    userId: string,
    budget: { id: string; category: string; limitAmount: bigint; month: number; year: number }
  ): Promise<BudgetItem> {
    const startDate = new Date(budget.year, budget.month - 1, 1);
    const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59, 999);

    const aggregate = await prisma.transaction.aggregate({
      where: {
        userId,
        category: budget.category,
        type: "EXPENSE",
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const spent = aggregate._sum.amount ?? BigInt(0);
    const limit = budget.limitAmount;
    const remaining = limit > spent ? limit - spent : BigInt(0);
    const usagePercentage =
      limit > BigInt(0)
        ? Math.round((Number(spent) / Number(limit)) * 10000) / 100
        : 0;

    return {
      id: budget.id,
      category: budget.category,
      limitAmount: limit.toString(),
      spentAmount: spent.toString(),
      remainingAmount: remaining.toString(),
      usagePercentage,
      status: determineBudgetStatus(usagePercentage),
      month: budget.month,
      year: budget.year,
    };
  }
}

export const budgetService = new BudgetService();
