// src/server/services/savings.service.ts — Layanan Target Tabungan (Savings Goals)
// Referensi: PRD.md Section 5.1 E & ARCHITECTURE.md Section 4

import { MissionType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { gamificationService } from "@/server/services/gamification.service";
import { NotFoundError, ValidationError } from "@/server/utils/api-response";
import { XP_REWARDS, type SavingsGoalItem } from "@/types";
import type {
  CreateSavingsGoalInput,
  ContributeSavingsInput,
} from "@/server/validators/finance.schema";

const BONUS_COMPLETED_SAVINGS_XP = 50;
const SAVINGS_CONTRIBUTION_XP = 10;

export function formatSavingsGoal(goal: {
  id: string;
  title: string;
  targetAmount: bigint;
  currentAmount: bigint;
  targetDate: Date | null;
  status: "ACTIVE" | "COMPLETED";
  createdAt: Date;
}): SavingsGoalItem {
  const target = goal.targetAmount;
  const current = goal.currentAmount;

  const progressPercentage =
    target > BigInt(0)
      ? Math.min(100, Math.round((Number(current) / Number(target)) * 10000) / 100)
      : 0;

  return {
    id: goal.id,
    title: goal.title,
    targetAmount: target.toString(),
    currentAmount: current.toString(),
    progressPercentage,
    targetDate: goal.targetDate ? goal.targetDate.toISOString() : null,
    status: goal.status,
    createdAt: goal.createdAt.toISOString(),
  };
}

export class SavingsService {
  /**
   * Membuat target tabungan baru dan memberikan XP gamifikasi.
   */
  async createSavingsGoal(userId: string, input: CreateSavingsGoalInput) {
    const goal = await prisma.savingsGoal.create({
      data: {
        userId,
        title: input.title,
        targetAmount: input.targetAmount,
        currentAmount: BigInt(0),
        targetDate: input.targetDate,
        status: "ACTIVE",
      },
    });

    // Gamifikasi: +25 XP untuk pembuatan target tabungan baru
    let totalXpGained = 0;
    let leveledUp = false;

    const xpResult = await gamificationService.awardXp(userId, XP_REWARDS.CREATE_SAVINGS);
    totalXpGained += xpResult.xpGained;
    leveledUp = leveledUp || xpResult.leveledUp;

    const missionResult = await gamificationService.trackMissionProgress(
      userId,
      MissionType.CREATE_SAVINGS
    );
    totalXpGained += missionResult.xpGained;
    leveledUp = leveledUp || missionResult.leveledUp;

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, xp: true },
    });

    return {
      goal: formatSavingsGoal(goal),
      meta: {
        xpGained: totalXpGained,
        leveledUp,
        currentLevel: updatedUser?.level ?? 1,
        currentXp: updatedUser?.xp ?? 0,
      },
    };
  }

  /**
   * Mengambil semua daftar target tabungan milik pengguna yang sedang login.
   */
  async getSavingsGoals(userId: string) {
    const goals = await prisma.savingsGoal.findMany({
      where: { userId }, // Strict IDOR isolation
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    let totalSaved = BigInt(0);
    let totalTarget = BigInt(0);
    let completedCount = 0;

    const items = goals.map((g) => {
      totalSaved += g.currentAmount;
      totalTarget += g.targetAmount;
      if (g.status === "COMPLETED") completedCount++;

      return formatSavingsGoal(g);
    });

    const overallProgress =
      totalTarget > BigInt(0)
        ? Math.min(100, Math.round((Number(totalSaved) / Number(totalTarget)) * 10000) / 100)
        : 0;

    return {
      items,
      summary: {
        totalGoals: goals.length,
        activeGoals: goals.length - completedCount,
        completedGoals: completedCount,
        totalSaved: totalSaved.toString(),
        totalTarget: totalTarget.toString(),
        overallProgress,
      },
    };
  }

  /**
   * Menambahkan dana tabungan ke target tertentu.
   * Mengubah status menjadi COMPLETED otomatis jika target telah tercapai.
   */
  async contributeToGoal(
    userId: string,
    goalId: string,
    input: ContributeSavingsInput
  ) {
    // 1. Verifikasi kepemilikan data (anti-IDOR)
    const existing = await prisma.savingsGoal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundError("Target tabungan tidak ditemukan atau Anda tidak memiliki akses.");
    }

    if (existing.status === "COMPLETED") {
      throw new ValidationError("Target tabungan ini sudah tercapai (selesai).");
    }

    // 2. Hitung jumlah akumulasi baru
    const newCurrentAmount = existing.currentAmount + input.amount;
    const isNowCompleted = newCurrentAmount >= existing.targetAmount;
    const nextStatus = isNowCompleted ? "COMPLETED" : "ACTIVE";

    const updated = await prisma.savingsGoal.update({
      where: { id: goalId },
      data: {
        currentAmount: newCurrentAmount,
        status: nextStatus,
      },
    });

    // 3. Gamifikasi: Berikan bonus XP
    // +50 XP jika berhasil menyelesaikan target tabungan, atau +10 XP untuk kontribusi reguler
    const xpReward = isNowCompleted ? BONUS_COMPLETED_SAVINGS_XP : SAVINGS_CONTRIBUTION_XP;

    const xpResult = await gamificationService.awardXp(userId, xpReward);

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, xp: true },
    });

    return {
      goal: formatSavingsGoal(updated),
      meta: {
        xpGained: xpResult.xpGained,
        leveledUp: xpResult.leveledUp,
        currentLevel: updatedUser?.level ?? 1,
        currentXp: updatedUser?.xp ?? 0,
        goalCompleted: isNowCompleted,
      },
    };
  }
}

export const savingsService = new SavingsService();
