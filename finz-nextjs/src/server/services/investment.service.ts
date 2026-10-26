// src/server/services/investment.service.ts — Layanan Simulasi Investasi Virtual & Portofolio
// Referensi: PRD.md Section 5.1 G & AGENTS.md Section 4 Rule 5 (Atomic prisma.$transaction)

import { MissionType, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { gamificationService } from "@/server/services/gamification.service";
import { NotFoundError, ValidationError } from "@/server/utils/api-response";
import {
  XP_REWARDS,
  type VirtualAssetItem,
  type PortfolioItem,
  type InvestmentHistoryItem,
} from "@/types";
import type { TradeAssetInput, QueryHistoryInput } from "@/server/validators/investment.schema";

export function formatVirtualAsset(asset: {
  id: string;
  code: string;
  name: string;
  category: string;
  riskProfile: string;
  currentPrice: bigint;
  description: string;
}): VirtualAssetItem {
  return {
    id: asset.id,
    code: asset.code,
    name: asset.name,
    category: asset.category,
    riskProfile: asset.riskProfile,
    currentPrice: asset.currentPrice.toString(),
    description: asset.description,
  };
}

export class InvestmentService {
  /**
   * Mengambil seluruh katalog aset investasi edukasi contoh.
   */
  async getAssets(): Promise<VirtualAssetItem[]> {
    const assets = await prisma.virtualAsset.findMany({
      orderBy: { currentPrice: "asc" },
    });
    return assets.map(formatVirtualAsset);
  }

  /**
   * Simulasi Fluktuasi Harga Pasar Contoh (FR-SIM-01)
   * Mengacak harga aset dalam rentang terkontrol (±1% s/d ±5%) untuk tujuan edukasi.
   */
  async simulatePriceFluctuation() {
    const assets = await prisma.virtualAsset.findMany();

    const updates = await Promise.all(
      assets.map(async (asset) => {
        // Rentang fluktuasi acak: antara -5.00% hingga +5.00% (min ±1%)
        const sign = Math.random() < 0.5 ? -1 : 1;
        const pctChange = sign * (1 + Math.random() * 4);
        const roundedPct = Math.round(pctChange * 100) / 100;

        const oldPriceNum = Number(asset.currentPrice);
        const delta = Math.round(oldPriceNum * (roundedPct / 100));
        const newPriceNum = Math.max(10000, oldPriceNum + delta);

        const updated = await prisma.virtualAsset.update({
          where: { id: asset.id },
          data: {
            currentPrice: BigInt(newPriceNum),
          },
        });

        return {
          id: updated.id,
          code: updated.code,
          name: updated.name,
          oldPrice: oldPriceNum.toString(),
          newPrice: newPriceNum.toString(),
          percentageChange: roundedPct,
        };
      })
    );

    return updates;
  }

  /**
   * Simulasi Pembelian Unit Aset Menggunakan Saldo Virtual.
   * Wajib dieksekusi secara atomik menggunakan prisma.$transaction().
   */
  async buyAsset(userId: string, input: TradeAssetInput) {
    const unitsDecimal = new Prisma.Decimal(input.units);

    return await prisma.$transaction(async (tx) => {
      // 1. Ambil data aset yang akan dibeli
      const asset = await tx.virtualAsset.findUnique({
        where: { id: input.assetId },
      });

      if (!asset) {
        throw new NotFoundError("Aset investasi simulasi tidak ditemukan.");
      }

      // 2. Ambil saldo virtual pengguna saat ini
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, virtualBalance: true },
      });

      if (!user) {
        throw new NotFoundError("Data pengguna tidak ditemukan.");
      }

      // 3. Hitung total biaya pembelian (units * currentPrice)
      const totalCostNum = Math.round(input.units * Number(asset.currentPrice));
      const totalCost = BigInt(totalCostNum);

      if (totalCost > user.virtualBalance) {
        throw new ValidationError(
          `Saldo virtual Anda tidak mencukupi untuk melakukan simulasi pembelian ini. ` +
            `Dibutuhkan: Rp ${totalCost.toLocaleString("id-ID")}, Saldo tersedia: Rp ${user.virtualBalance.toLocaleString("id-ID")}`
        );
      }

      // 4. Potong saldo virtual pengguna
      const newVirtualBalance = user.virtualBalance - totalCost;
      await tx.user.update({
        where: { id: userId },
        data: { virtualBalance: newVirtualBalance },
      });

      // 5. Perbarui atau buat portofolio kepemilikan aset
      const existingPortfolio = await tx.portfolio.findUnique({
        where: {
          userId_assetId: {
            userId,
            assetId: asset.id,
          },
        },
      });

      let updatedPortfolio;
      if (existingPortfolio) {
        // Hitung harga beli rata-rata baru (weighted average price)
        const oldUnits = Number(existingPortfolio.units);
        const oldAvgPrice = Number(existingPortfolio.averageBuyPrice);
        const addedUnits = input.units;
        const totalUnits = oldUnits + addedUnits;

        const newAvgPrice = Math.round(
          (oldUnits * oldAvgPrice + totalCostNum) / totalUnits
        );

        updatedPortfolio = await tx.portfolio.update({
          where: { id: existingPortfolio.id },
          data: {
            units: new Prisma.Decimal(totalUnits),
            averageBuyPrice: BigInt(newAvgPrice),
          },
        });
      } else {
        updatedPortfolio = await tx.portfolio.create({
          data: {
            userId,
            assetId: asset.id,
            units: unitsDecimal,
            averageBuyPrice: asset.currentPrice,
          },
        });
      }

      // 6. Catat ke tabel riwayat simulasi investasi
      const history = await tx.investmentHistory.create({
        data: {
          userId,
          assetId: asset.id,
          tradeType: "BUY",
          units: unitsDecimal,
          pricePerUnit: asset.currentPrice,
          totalAmount: totalCost,
          balanceAfter: newVirtualBalance,
        },
      });

      // 7. Gamifikasi: Berikan +30 XP dan lacak misi SIMULATE_INVESTMENT
      let totalXpGained = 0;
      let leveledUp = false;

      const xpResult = await gamificationService.awardXp(
        userId,
        XP_REWARDS.SIMULATE_INVESTMENT,
        tx
      );
      totalXpGained += xpResult.xpGained;
      leveledUp = leveledUp || xpResult.leveledUp;

      const missionResult = await gamificationService.trackMissionProgress(
        userId,
        MissionType.SIMULATE_INVESTMENT,
        tx
      );
      totalXpGained += missionResult.xpGained;
      leveledUp = leveledUp || missionResult.leveledUp;

      const updatedUser = await tx.user.findUnique({
        where: { id: userId },
        select: { level: true, xp: true },
      });

      return {
        trade: {
          id: history.id,
          tradeType: "BUY" as const,
          assetCode: asset.code,
          assetName: asset.name,
          units: input.units.toString(),
          pricePerUnit: asset.currentPrice.toString(),
          totalAmount: totalCost.toString(),
          balanceAfter: newVirtualBalance.toString(),
          portfolioUnits: updatedPortfolio.units.toString(),
          averageBuyPrice: updatedPortfolio.averageBuyPrice.toString(),
        },
        meta: {
          xpGained: totalXpGained,
          leveledUp,
          currentLevel: updatedUser?.level ?? 1,
          currentXp: updatedUser?.xp ?? 0,
        },
      };
    });
  }

  /**
   * Simulasi Penjualan Unit Aset dari Portofolio Pengguna.
   * Wajib dieksekusi secara atomik menggunakan prisma.$transaction().
   */
  async sellAsset(userId: string, input: TradeAssetInput) {
    return await prisma.$transaction(async (tx) => {
      // 1. Ambil data aset yang akan dijual
      const asset = await tx.virtualAsset.findUnique({
        where: { id: input.assetId },
      });

      if (!asset) {
        throw new NotFoundError("Aset investasi simulasi tidak ditemukan.");
      }

      // 2. Ambil kepemilikan unit di portofolio pengguna
      const portfolio = await tx.portfolio.findUnique({
        where: {
          userId_assetId: {
            userId,
            assetId: asset.id,
          },
        },
      });

      if (!portfolio) {
        throw new ValidationError("Anda belum memiliki unit pada aset investasi ini di portofolio.");
      }

      const currentUnits = Number(portfolio.units);
      if (input.units > currentUnits) {
        throw new ValidationError(
          `Unit aset tidak mencukupi untuk penjualan ini. ` +
            `Unit dimiliki: ${currentUnits}, Unit diajukan untuk dijual: ${input.units}`
        );
      }

      // 3. Hitung penerimaan penjualan (units * currentPrice)
      const totalRevenueNum = Math.round(input.units * Number(asset.currentPrice));
      const totalRevenue = BigInt(totalRevenueNum);

      // 4. Tambahkan saldo virtual pengguna
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { virtualBalance: true },
      });

      const newVirtualBalance = (user?.virtualBalance ?? BigInt(0)) + totalRevenue;
      await tx.user.update({
        where: { id: userId },
        data: { virtualBalance: newVirtualBalance },
      });

      // 5. Perbarui unit portofolio
      const remainingUnits = currentUnits - input.units;
      let remainingUnitsStr = "0";

      if (remainingUnits <= 0.00001) {
        // Hapus entri portofolio jika seluruh unit sudah terjual habis
        await tx.portfolio.delete({
          where: { id: portfolio.id },
        });
        remainingUnitsStr = "0";
      } else {
        const updated = await tx.portfolio.update({
          where: { id: portfolio.id },
          data: {
            units: new Prisma.Decimal(remainingUnits),
          },
        });
        remainingUnitsStr = updated.units.toString();
      }

      // 6. Catat ke riwayat simulasi investasi
      const history = await tx.investmentHistory.create({
        data: {
          userId,
          assetId: asset.id,
          tradeType: "SELL",
          units: new Prisma.Decimal(input.units),
          pricePerUnit: asset.currentPrice,
          totalAmount: totalRevenue,
          balanceAfter: newVirtualBalance,
        },
      });

      // 7. Gamifikasi: Berikan +30 XP dan lacak misi SIMULATE_INVESTMENT
      let totalXpGained = 0;
      let leveledUp = false;

      const xpResult = await gamificationService.awardXp(
        userId,
        XP_REWARDS.SIMULATE_INVESTMENT,
        tx
      );
      totalXpGained += xpResult.xpGained;
      leveledUp = leveledUp || xpResult.leveledUp;

      const missionResult = await gamificationService.trackMissionProgress(
        userId,
        MissionType.SIMULATE_INVESTMENT,
        tx
      );
      totalXpGained += missionResult.xpGained;
      leveledUp = leveledUp || missionResult.leveledUp;

      const updatedUser = await tx.user.findUnique({
        where: { id: userId },
        select: { level: true, xp: true },
      });

      return {
        trade: {
          id: history.id,
          tradeType: "SELL" as const,
          assetCode: asset.code,
          assetName: asset.name,
          units: input.units.toString(),
          pricePerUnit: asset.currentPrice.toString(),
          totalAmount: totalRevenue.toString(),
          balanceAfter: newVirtualBalance.toString(),
          portfolioUnits: remainingUnitsStr,
        },
        meta: {
          xpGained: totalXpGained,
          leveledUp,
          currentLevel: updatedUser?.level ?? 1,
          currentXp: updatedUser?.xp ?? 0,
        },
      };
    });
  }

  /**
   * Mengambil portofolio investasi pengguna lengkap dengan nilai pasar dan kalkulasi keuntungan/kerugian (unrealized P/L).
   */
  async getPortfolio(userId: string) {
    const [user, portfolios] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { virtualBalance: true },
      }),
      prisma.portfolio.findMany({
        where: { userId },
        include: { asset: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    let totalMarketValue = BigInt(0);
    let totalCostBasis = BigInt(0);

    const items: PortfolioItem[] = portfolios.map((p) => {
      const unitsNum = Number(p.units);
      const currentPriceNum = Number(p.asset.currentPrice);
      const avgPriceNum = Number(p.averageBuyPrice);

      const marketValueNum = Math.round(unitsNum * currentPriceNum);
      const costBasisNum = Math.round(unitsNum * avgPriceNum);
      const profitLossNum = marketValueNum - costBasisNum;

      totalMarketValue += BigInt(marketValueNum);
      totalCostBasis += BigInt(costBasisNum);

      const profitLossPercentage =
        costBasisNum > 0
          ? Math.round((profitLossNum / costBasisNum) * 10000) / 100
          : 0;

      return {
        id: p.id,
        assetId: p.asset.id,
        assetCode: p.asset.code,
        assetName: p.asset.name,
        assetCategory: p.asset.category,
        units: p.units.toString(),
        averageBuyPrice: p.averageBuyPrice.toString(),
        currentPrice: p.asset.currentPrice.toString(),
        marketValue: marketValueNum.toString(),
        profitLoss: profitLossNum.toString(),
        profitLossPercentage,
      };
    });

    const totalProfitLoss = totalMarketValue - totalCostBasis;
    const totalProfitLossPercentage =
      totalCostBasis > BigInt(0)
        ? Math.round((Number(totalProfitLoss) / Number(totalCostBasis)) * 10000) / 100
        : 0;

    return {
      virtualBalance: (user?.virtualBalance ?? BigInt(0)).toString(),
      totalPortfolioValue: totalMarketValue.toString(),
      totalInvested: totalCostBasis.toString(),
      totalProfitLoss: totalProfitLoss.toString(),
      totalProfitLossPercentage,
      totalNetWorth: ((user?.virtualBalance ?? BigInt(0)) + totalMarketValue).toString(),
      holdings: items,
    };
  }

  /**
   * Mengambil riwayat seluruh transaksi simulasi investasi pengguna.
   */
  async getHistory(userId: string, query: QueryHistoryInput) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [historyItems, totalCount] = await Promise.all([
      prisma.investmentHistory.findMany({
        where: { userId },
        include: { asset: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.investmentHistory.count({
        where: { userId },
      }),
    ]);

    const items: InvestmentHistoryItem[] = historyItems.map((h) => ({
      id: h.id,
      assetCode: h.asset.code,
      assetName: h.asset.name,
      tradeType: h.tradeType,
      units: h.units.toString(),
      pricePerUnit: h.pricePerUnit.toString(),
      totalAmount: h.totalAmount.toString(),
      balanceAfter: h.balanceAfter.toString(),
      createdAt: h.createdAt.toISOString(),
    }));

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}

export const investmentService = new InvestmentService();
