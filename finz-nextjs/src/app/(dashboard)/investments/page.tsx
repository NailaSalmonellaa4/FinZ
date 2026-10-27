// src/app/(dashboard)/investments/page.tsx — Halaman Simulasi Investasi Virtual & Portofolio
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Loader2,
  PieChart,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { SimulationDisclaimer } from "@/components/layout/SimulationDisclaimer";
import { formatCurrency, formatDateShort } from "@/lib/formatters";
import type {
  VirtualAssetItem,
  PortfolioItem,
  InvestmentHistoryItem,
} from "@/types";

export default function InvestmentsPage() {
  const [assets, setAssets] = useState<VirtualAssetItem[]>([]);
  const [portfolio, setPortfolio] = useState<{
    virtualBalance: string;
    totalPortfolioValue: string;
    totalInvested: string;
    totalProfitLoss: string;
    totalProfitLossPercentage: number;
    totalNetWorth: string;
    holdings: PortfolioItem[];
  }>({
    virtualBalance: "0",
    totalPortfolioValue: "0",
    totalInvested: "0",
    totalProfitLoss: "0",
    totalProfitLossPercentage: 0,
    totalNetWorth: "0",
    holdings: [],
  });
  const [history, setHistory] = useState<InvestmentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Trade Modal State
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [tradeMode, setTradeMode] = useState<"BUY" | "SELL">("BUY");
  const [selectedAsset, setSelectedAsset] = useState<VirtualAssetItem | null>(null);
  const [tradeUnits, setTradeUnits] = useState<string>("1");
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  async function handleSimulatePrices() {
    try {
      setIsSimulating(true);
      const res = await fetch("/api/investments/simulate", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setToastMessage("Harga aset contoh telah berfluktuasi! Amati perubahan profit/loss portofoliomu.");
        setTimeout(() => setToastMessage(null), 5000);
        fetchData();
      }
    } catch (err) {
      console.error("Gagal simulasi fluktuasi:", err);
    } finally {
      setIsSimulating(false);
    }
  }

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [assetsRes, portfolioRes, historyRes] = await Promise.all([
        fetch("/api/investments/assets"),
        fetch("/api/investments/portfolio"),
        fetch("/api/investments/history?limit=10"),
      ]);

      const [assetsData, portfolioData, historyData] = await Promise.all([
        assetsRes.json(),
        portfolioRes.json(),
        historyRes.json(),
      ]);

      if (assetsData.success) setAssets(assetsData.data || []);
      if (portfolioData.success) setPortfolio(portfolioData.data);
      if (historyData.success) setHistory(historyData.data?.items || []);
    } catch (err) {
      console.error("Gagal memuat data investasi:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cari kepemilikan unit untuk aset yang dipilih di modal
  const ownedHolding = selectedAsset
    ? portfolio.holdings.find((h) => h.assetId === selectedAsset.id)
    : null;
  const ownedUnitsNum = ownedHolding ? Number(ownedHolding.units) : 0;

  // Hitung estimasi nominal transaksi (units * currentPrice)
  const unitsNum = Number(tradeUnits) || 0;
  const priceNum = selectedAsset ? Number(selectedAsset.currentPrice) : 0;
  const totalAmountEstimated = Math.round(unitsNum * priceNum);
  const virtualBalanceNum = Number(portfolio.virtualBalance);

  function openTradeModal(asset: VirtualAssetItem, mode: "BUY" | "SELL") {
    setSelectedAsset(asset);
    setTradeMode(mode);
    setTradeUnits("1");
    setTradeError(null);
    setIsTradeOpen(true);
  }

  async function handleExecuteTrade(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAsset) return;
    setTradeError(null);

    if (unitsNum <= 0) {
      setTradeError("Jumlah unit harus lebih besar dari 0");
      return;
    }

    if (tradeMode === "BUY" && totalAmountEstimated > virtualBalanceNum) {
      setTradeError("Saldo virtual Anda tidak mencukupi untuk pembelian ini.");
      return;
    }

    if (tradeMode === "SELL" && unitsNum > ownedUnitsNum) {
      setTradeError(`Unit yang Anda miliki hanya ${ownedUnitsNum} unit.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = tradeMode === "BUY" ? "/api/investments/buy" : "/api/investments/sell";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: selectedAsset.id,
          units: unitsNum,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal mengeksekusi transaksi simulasi.");
      }

      if (data.meta?.xpGained) {
        setToastMessage(
          `Transaksi ${tradeMode === "BUY" ? "Beli" : "Jual"} Simulasi Berhasil! Kamu meraih +${data.meta.xpGained} XP!`
        );
        setTimeout(() => setToastMessage(null), 5000);
      }

      setIsTradeOpen(false);
      fetchData();
    } catch (err) {
      setTradeError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notifikasi XP */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/20 animate-in slide-in-from-top-4 duration-200">
          <Sparkles className="h-5 w-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── Simulation Disclaimer Wajib ──────────────────────── */}
      <SimulationDisclaimer />

      {/* Header Halaman */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Simulasi Investasi Virtual
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Pelajari konsep unit aset, average buy price, dan portofolio tanpa risiko finansial
          </p>
        </div>

        <Button
          onClick={handleSimulatePrices}
          isLoading={isSimulating}
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw className={`h-4 w-4 text-blue-600 ${isSimulating ? "animate-spin" : ""}`} />}
        >
          Simulasi Fluktuasi Pasar (±1% - ±5%)
        </Button>
      </div>

      {/* Ringkasan Portofolio & Saldo */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-b from-blue-50/60 to-white border-blue-100">
          <div className="text-xs font-semibold uppercase text-slate-500">
            Saldo Kas Virtual
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {formatCurrency(virtualBalanceNum)}
          </div>
          <p className="mt-1 text-xs text-slate-400">Kas simulasi siap beli</p>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase text-slate-500">
            Nilai Pasar Portofolio
          </div>
          <div className="mt-1 text-2xl font-black text-blue-600">
            {formatCurrency(Number(portfolio.totalPortfolioValue))}
          </div>
          <p className="mt-1 text-xs text-slate-400">Total nilai seluruh unit aset</p>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase text-slate-500">
            Unrealized Profit / Loss
          </div>
          <div
            className={`mt-1 text-2xl font-black ${
              Number(portfolio.totalProfitLoss) >= 0
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {Number(portfolio.totalProfitLoss) >= 0 ? "+" : ""}
            {formatCurrency(Number(portfolio.totalProfitLoss))}
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            ({portfolio.totalProfitLossPercentage >= 0 ? "+" : ""}
            {portfolio.totalProfitLossPercentage.toFixed(2)}%)
          </p>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase text-slate-500">
            Total Kekayaan Bersih
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {formatCurrency(Number(portfolio.totalNetWorth))}
          </div>
          <p className="mt-1 text-xs text-slate-400">Kas + Portofolio Aset</p>
        </Card>
      </div>

      {/* ─── Bagian 1: Katalog Aset Edukasi Contoh ─────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Katalog Aset Edukasi
            </h2>
            <p className="text-xs text-slate-500">
              Pilih aset untuk melakukan simulasi transaksi dan dapatkan +30 XP
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm font-semibold">Memuat aset investasi...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {assets.map((asset) => {
              const holding = portfolio.holdings.find((h) => h.assetId === asset.id);
              const hasHolding = holding && Number(holding.units) > 0;

              return (
                <Card key={asset.id} className="flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <Badge
                        variant={
                          asset.riskProfile === "Rendah"
                            ? "safe"
                            : asset.riskProfile === "Sedang"
                            ? "warning"
                            : "danger"
                        }
                        size="sm"
                      >
                        Risiko {asset.riskProfile}
                      </Badge>
                      <span className="text-[11px] font-bold text-slate-400">
                        {asset.code}
                      </span>
                    </CardHeader>

                    <h3 className="text-base font-bold text-slate-900">
                      {asset.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium">
                      {asset.category}
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Harga Contoh per Unit
                      </div>
                      <div className="text-lg font-black text-slate-900">
                        {formatCurrency(Number(asset.currentPrice))}
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {asset.description}
                    </p>

                    {hasHolding && (
                      <div className="mt-3 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                        Kamu memiliki: {holding.units} unit
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                    <Button
                      onClick={() => openTradeModal(asset, "BUY")}
                      size="sm"
                      variant="primary"
                    >
                      Beli
                    </Button>
                    <Button
                      onClick={() => openTradeModal(asset, "SELL")}
                      size="sm"
                      variant="outline"
                      disabled={!hasHolding}
                    >
                      Jual
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Bagian 2: Tabel Portofolio Kepemilikan Unit ───────── */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Portofolio Kepemilikan Unit
        </h2>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {portfolio.holdings.length === 0 ? (
            <div className="p-10 text-center">
              <PieChart className="mx-auto h-10 w-10 text-slate-300" />
              <h4 className="mt-2 text-sm font-bold text-slate-800">
                Portofolio Masih Kosong
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Gunakan saldo virtual Rp 10 Juta untuk membeli unit aset simulasi di atas!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-6">Instrumen Aset</th>
                    <th className="py-3.5 px-6 text-right">Unit Dimiliki</th>
                    <th className="py-3.5 px-6 text-right">Harga Beli Rata-rata</th>
                    <th className="py-3.5 px-6 text-right">Harga Terkini</th>
                    <th className="py-3.5 px-6 text-right">Nilai Pasar</th>
                    <th className="py-3.5 px-6 text-right">Profit / Loss</th>
                    <th className="py-3.5 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {portfolio.holdings.map((h) => {
                    const plNum = Number(h.profitLoss);
                    const matchingAsset = assets.find((a) => a.id === h.assetId);

                    return (
                      <tr key={h.id} className="transition hover:bg-slate-50/80">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{h.assetName}</div>
                          <div className="text-[11px] text-slate-400">{h.assetCode}</div>
                        </td>
                        <td className="py-4 px-6 text-right font-semibold">
                          {Number(h.units).toFixed(4)}
                        </td>
                        <td className="py-4 px-6 text-right text-slate-500">
                          {formatCurrency(Number(h.averageBuyPrice))}
                        </td>
                        <td className="py-4 px-6 text-right font-semibold">
                          {formatCurrency(Number(h.currentPrice))}
                        </td>
                        <td className="py-4 px-6 text-right font-black text-slate-900">
                          {formatCurrency(Number(h.marketValue))}
                        </td>
                        <td
                          className={`py-4 px-6 text-right font-black whitespace-nowrap ${
                            plNum >= 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {plNum >= 0 ? "+" : ""}
                          {formatCurrency(plNum)}
                          <div className="text-[11px] font-normal">
                            ({h.profitLossPercentage >= 0 ? "+" : ""}
                            {h.profitLossPercentage.toFixed(2)}%)
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {matchingAsset && (
                            <Button
                              onClick={() => openTradeModal(matchingAsset, "SELL")}
                              size="sm"
                              variant="outline"
                            >
                              Jual
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ─── Bagian 3: Riwayat Transaksi Simulasi Investasi ─────── */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Riwayat Simulasi Trading
        </h2>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {history.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Belum ada riwayat transaksi simulasi investasi.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-6">Waktu</th>
                    <th className="py-3 px-6">Jenis</th>
                    <th className="py-3 px-6">Aset</th>
                    <th className="py-3 px-6 text-right">Unit</th>
                    <th className="py-3 px-6 text-right">Harga Eksekusi</th>
                    <th className="py-3 px-6 text-right">Total Transaksi</th>
                    <th className="py-3 px-6 text-right">Saldo Kas Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {history.map((item) => (
                    <tr key={item.id} className="transition hover:bg-slate-50/80">
                      <td className="py-3 px-6 text-slate-400 whitespace-nowrap">
                        {formatDateShort(item.createdAt)}
                      </td>
                      <td className="py-3 px-6">
                        <Badge
                          variant={item.tradeType === "BUY" ? "safe" : "info"}
                          size="sm"
                        >
                          {item.tradeType === "BUY" ? "BELI" : "JUAL"}
                        </Badge>
                      </td>
                      <td className="py-3 px-6 font-semibold text-slate-900">
                        {item.assetName}
                      </td>
                      <td className="py-3 px-6 text-right">
                        {Number(item.units).toFixed(4)}
                      </td>
                      <td className="py-3 px-6 text-right">
                        {formatCurrency(Number(item.pricePerUnit))}
                      </td>
                      <td className="py-3 px-6 text-right font-black text-slate-900">
                        {formatCurrency(Number(item.totalAmount))}
                      </td>
                      <td className="py-3 px-6 text-right font-bold text-slate-500">
                        {formatCurrency(Number(item.balanceAfter))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ─── Modal Beli / Jual Aset Simulasi ───────────────────── */}
      <Modal
        isOpen={isTradeOpen}
        onClose={() => setIsTradeOpen(false)}
        title={
          tradeMode === "BUY"
            ? `Simulasi Beli: ${selectedAsset?.name}`
            : `Simulasi Jual: ${selectedAsset?.name}`
        }
        description="Transaksi menggunakan saldo virtual simulasi dan memberimu +30 XP!"
      >
        {tradeError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            {tradeError}
          </div>
        )}

        <form onSubmit={handleExecuteTrade} className="space-y-4">
          {/* Info Ringkasan Aset & Saldo */}
          <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span>Harga per Unit:</span>
              <span className="font-bold text-slate-900">
                {formatCurrency(priceNum)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Saldo Kas Tersedia:</span>
              <span className="font-bold text-slate-900">
                {formatCurrency(virtualBalanceNum)}
              </span>
            </div>
            {tradeMode === "SELL" && (
              <div className="flex justify-between text-blue-600 font-semibold pt-1 border-t border-slate-200">
                <span>Unit yang Anda miliki:</span>
                <span>{ownedUnitsNum} Unit</span>
              </div>
            )}
          </div>

          <Input
            label="Jumlah Unit"
            type="number"
            step="0.0001"
            min="0.0001"
            value={tradeUnits}
            onChange={(e) => setTradeUnits(e.target.value)}
            required
            helperText="Mendukung pecahan hingga 4 angka di belakang koma."
          />

          {/* Kalkulasi Total */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-blue-900 uppercase">
                {tradeMode === "BUY" ? "Total Biaya Pembelian" : "Total Penerimaan Penjualan"}
              </span>
              <span className="text-xl font-black text-blue-700">
                {formatCurrency(totalAmountEstimated)}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-blue-600">
              <span>Estimasi Sisa Saldo Kas:</span>
              <span>
                {formatCurrency(
                  tradeMode === "BUY"
                    ? virtualBalanceNum - totalAmountEstimated
                    : virtualBalanceNum + totalAmountEstimated
                )}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTradeOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant={tradeMode === "BUY" ? "primary" : "danger"}
              isLoading={isSubmitting}
            >
              {tradeMode === "BUY" ? "Konfirmasi Pembelian" : "Konfirmasi Penjualan"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
