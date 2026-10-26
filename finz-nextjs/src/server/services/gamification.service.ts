// src/server/services/gamification.service.ts — Layanan Gamifikasi (XP, Level, dan Pelacakan Misi)
// Referensi: PRD.md Section 5.1 F & ARCHITECTURE.md Section 4

import { MissionType, PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";
import { XP_PER_LEVEL, MAX_DAILY_TRANSACTION_XP_CLAIMS } from "@/types";

type PrismaTx = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export interface XpAwardResult {
  xpGained: number;
  leveledUp: boolean;
  currentLevel: number;
  currentXp: number;
}

export interface MissionProgressResult {
  xpGained: number;
  leveledUp: boolean;
  completedMissions: string[];
}

export class GamificationService {
  /**
   * Menghitung level berdasarkan total XP: floor(XP / 100) + 1
   */
  calculateLevel(xp: number): number {
    return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
  }

  /**
   * Memberikan XP ke pengguna dan memeriksa apakah terjadi kenaikan level.
   */
  async awardXp(
    userId: string,
    xpAmount: number,
    client: PrismaTx = prisma
  ): Promise<XpAwardResult> {
    if (xpAmount <= 0) {
      const user = await client.user.findUnique({
        where: { id: userId },
        select: { level: true, xp: true },
      });
      return {
        xpGained: 0,
        leveledUp: false,
        currentLevel: user?.level ?? 1,
        currentXp: user?.xp ?? 0,
      };
    }

    const user = await client.user.findUnique({
      where: { id: userId },
      select: { level: true, xp: true },
    });

    if (!user) {
      throw new Error(`Pengguna dengan ID ${userId} tidak ditemukan`);
    }

    const currentXp = user.xp;
    const currentLevel = user.level;
    const newXp = currentXp + xpAmount;
    const newLevel = this.calculateLevel(newXp);
    const leveledUp = newLevel > currentLevel;

    await client.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel,
      },
    });

    return {
      xpGained: xpAmount,
      leveledUp,
      currentLevel: newLevel,
      currentXp: newXp,
    };
  }

  /**
   * Memeriksa apakah pengguna masih berhak mendapatkan XP dari pencatatan transaksi hari ini.
   * Dibatasi maksimal 5 transaksi per hari untuk mencegah spam XP (PRD Section 5.1 F).
   */
  async canEarnTransactionXpToday(
    userId: string,
    client: PrismaTx = prisma
  ): Promise<boolean> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const countToday = await client.transaction.count({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return countToday < MAX_DAILY_TRANSACTION_XP_CLAIMS;
  }

  /**
   * Memperbarui progres misi pengguna untuk jenis misi tertentu (UserMission).
   * Memberikan bonus XP misi jika target tercapai.
   */
  async trackMissionProgress(
    userId: string,
    missionType: MissionType,
    client: PrismaTx = prisma
  ): Promise<MissionProgressResult> {
    // 1. Ambil semua misi aktif yang sesuai dengan tipe aksi
    const activeMissions = await client.mission.findMany({
      where: { missionType },
    });

    if (activeMissions.length === 0) {
      return { xpGained: 0, leveledUp: false, completedMissions: [] };
    }

    let totalBonusXp = 0;
    const completedMissionTitles: string[] = [];

    // 2. Periksa dan perbarui progres UserMission untuk tiap misi
    for (const mission of activeMissions) {
      let userMission = await client.userMission.findUnique({
        where: {
          userId_missionId: {
            userId,
            missionId: mission.id,
          },
        },
      });

      if (!userMission) {
        userMission = await client.userMission.create({
          data: {
            userId,
            missionId: mission.id,
            currentCount: 0,
            isCompleted: false,
          },
        });
      }

      // Jika misi belum selesai, tingkatkan progres
      if (!userMission.isCompleted) {
        const nextCount = userMission.currentCount + 1;
        const isNowCompleted = nextCount >= mission.targetCount;

        await client.userMission.update({
          where: { id: userMission.id },
          data: {
            currentCount: nextCount,
            isCompleted: isNowCompleted,
            completedAt: isNowCompleted ? new Date() : null,
          },
        });

        if (isNowCompleted) {
          totalBonusXp += mission.xpReward;
          completedMissionTitles.push(mission.title);
        }
      }
    }

    // 3. Berikan total XP dari misi yang selesai
    if (totalBonusXp > 0) {
      const xpResult = await this.awardXp(userId, totalBonusXp, client);
      return {
        xpGained: totalBonusXp,
        leveledUp: xpResult.leveledUp,
        completedMissions: completedMissionTitles,
      };
    }

    return { xpGained: 0, leveledUp: false, completedMissions: [] };
  }

  /**
   * Mengambil daftar seluruh misi beserta status dan progres milik pengguna saat ini.
   */
  async getUserMissions(userId: string) {
    const allMissions = await prisma.mission.findMany({
      orderBy: { targetCount: "asc" },
      include: {
        userMissions: {
          where: { userId },
        },
      },
    });

    return allMissions.map((mission) => {
      const userProgress = mission.userMissions[0];
      return {
        id: mission.id,
        title: mission.title,
        description: mission.description,
        missionType: mission.missionType,
        targetCount: mission.targetCount,
        xpReward: mission.xpReward,
        currentCount: userProgress ? userProgress.currentCount : 0,
        isCompleted: userProgress ? userProgress.isCompleted : false,
        completedAt: userProgress?.completedAt ? userProgress.completedAt.toISOString() : null,
      };
    });
  }
}

export const gamificationService = new GamificationService();
