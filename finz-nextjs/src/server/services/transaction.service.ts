// src/server/services/transaction.service.ts — Layanan Pencatatan Transaksi Keuangan
// Referensi: PRD.md Section 5.1 C & AGENTS.md Section 4 Rule 3 (Data Isolation)

import { MissionType, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { gamificationService } from "@/server/services/gamification.service";
import { NotFoundError } from "@/server/utils/api-response";
import { XP_REWARDS, type TransactionItem } from "@/types";
import type { CreateTransactionInput, QueryTransactionInput } from "@/server/validators/finance.schema";

export function formatTransaction(trx: {
  id: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: bigint;
  description: string;
  transactionDate: Date;
  createdAt: Date;
}): TransactionItem {
  return {
    id: trx.id,
    type: trx.type,
    category: trx.category,
    amount: trx.amount.toString(),
    description: trx.description,
    transactionDate: trx.transactionDate.toISOString(),
    createdAt: trx.createdAt.toISOString(),
  };
}

export class TransactionService {
  /**
   * Mencatat transaksi baru (pemasukan atau pengeluaran) dan memberikan XP gamifikasi.
   */
  async createTransaction(userId: string, input: CreateTransactionInput) {
    // 1. Simpan transaksi di database dengan isolasi userId
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: input.type,
        category: input.category,
        amount: input.amount,
        description: input.description,
        transactionDate: input.transactionDate,
      },
    });

    // 2. Gamifikasi: Berikan +10 XP jika belum mencapai limit 5x per hari
    let totalXpGained = 0;
    let leveledUp = false;

    const canEarnDailyXp = await gamificationService.canEarnTransactionXpToday(userId);
    if (canEarnDailyXp) {
      const xpResult = await gamificationService.awardXp(
        userId,
        XP_REWARDS.RECORD_TRANSACTION
      );
      totalXpGained += xpResult.xpGained;
      leveledUp = leveledUp || xpResult.leveledUp;
    }

    // 3. Periksa progres misi tipe RECORD_TRANSACTION
    const missionResult = await gamificationService.trackMissionProgress(
      userId,
      MissionType.RECORD_TRANSACTION
    );
    totalXpGained += missionResult.xpGained;
    leveledUp = leveledUp || missionResult.leveledUp;

    // 4. Ambil status level & XP terkini pengguna
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, xp: true },
    });

    return {
      transaction: formatTransaction(transaction),
      meta: {
        xpGained: totalXpGained,
        leveledUp,
        currentLevel: updatedUser?.level ?? 1,
        currentXp: updatedUser?.xp ?? 0,
      },
    };
  }

  /**
   * Mengambil daftar transaksi pengguna dengan filter bulan, tahun, kategori, dan tipe.
   */
  async getTransactions(userId: string, query: QueryTransactionInput) {
    const where: Prisma.TransactionWhereInput = {
      userId, // Strict IDOR isolation
    };

    if (query.category) {
      where.category = query.category;
    }

    if (query.type) {
      where.type = query.type;
    }

    // Filter tanggal berdasarkan bulan & tahun jika disediakan
    if (query.month || query.year) {
      const year = query.year ?? new Date().getFullYear();
      if (query.month) {
        const startDate = new Date(year, query.month - 1, 1);
        const endDate = new Date(year, query.month, 0, 23, 59, 59, 999);
        where.transactionDate = {
          gte: startDate,
          lte: endDate,
        };
      } else {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        where.transactionDate = {
          gte: startDate,
          lte: endDate,
        };
      }
    }

    const limit = query.limit ?? 50;
    const page = query.page ?? 1;
    const skip = (page - 1) * limit;

    // Ambil data transaksi dan total item
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { transactionDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    // Hitung total nominal pemasukan dan pengeluaran pada filter aktif
    const totals = await prisma.transaction.groupBy({
      by: ["type"],
      where,
      _sum: {
        amount: true,
      },
    });

    let totalIncome = BigInt(0);
    let totalExpense = BigInt(0);

    for (const group of totals) {
      if (group.type === "INCOME" && group._sum.amount) {
        totalIncome = group._sum.amount;
      } else if (group.type === "EXPENSE" && group._sum.amount) {
        totalExpense = group._sum.amount;
      }
    }

    return {
      items: transactions.map(formatTransaction),
      summary: {
        totalIncome: totalIncome.toString(),
        totalExpense: totalExpense.toString(),
        netCashflow: (totalIncome - totalExpense).toString(),
      },
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  /**
   * Menghapus transaksi berdasarkan ID (hanya jika transaksi tersebut milik pengguna yang login).
   */
  async deleteTransaction(userId: string, transactionId: string) {
    const existing = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId, // Verifikasi kepemilikan data (anti-IDOR)
      },
    });

    if (!existing) {
      throw new NotFoundError("Transaksi tidak ditemukan atau Anda tidak memiliki akses.");
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    return { message: "Transaksi berhasil dihapus" };
  }
}

export const transactionService = new TransactionService();
