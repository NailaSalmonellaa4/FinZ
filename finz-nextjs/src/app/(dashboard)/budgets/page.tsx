// src/app/(dashboard)/budgets/page.tsx — Halaman Pengaturan & Pemantauan Anggaran Bulanan
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/formatters";
import { TRANSACTION_CATEGORIES, type BudgetItem } from "@/types";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [summary, setSummary] = useState({
    totalLimit: "0",
    totalSpent: "0",
    totalRemaining: "0",
    totalUsagePercentage: 0,
    status: "SAFE" as "SAFE" | "WARNING" | "OVERBUDGET",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filter Month / Year
  const [currentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear] = useState<number>(new Date().getFullYear());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [formCategory, setFormCategory] = useState<string>(TRANSACTION_CATEGORIES[0]);
  const [formLimitAmount, setFormLimitAmount] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/budgets?month=${currentMonth}&year=${currentYear}`);
      const data = await res.json();

      if (data.success && data.data) {
        setBudgets(data.data.items || []);
        if (data.data.summary) {
          setSummary(data.data.summary);
        }
      }
    } catch (err) {
      console.error("Gagal memuat anggaran:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, currentYear]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  async function handleUpsertBudget(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const limitNum = Number(formLimitAmount);
    if (!limitNum || limitNum <= 0) {
      setFormError("Batas anggaran harus lebih besar dari 0");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formCategory,
          limitAmount: limitNum,
          month: currentMonth,
          year: currentYear,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal menyimpan batas anggaran.");
      }

      if (data.meta?.xpGained) {
        setToastMessage(`Anggaran dibuat! Kamu meraih +${data.meta.xpGained} XP!`);
        setTimeout(() => setToastMessage(null), 5000);
      }

      setFormLimitAmount("");
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function getMonthName(month: number) {
    return new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
      new Date(2026, month - 1, 1)
    );
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

      {/* Header Halaman */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Anggaran Bulanan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tetapkan batas pengeluaran kategori untuk periode{" "}
            <strong>
              {getMonthName(currentMonth)} {currentYear}
            </strong>
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          leftIcon={<PlusCircle className="h-4 w-4" />}
        >
          Atur Anggaran Kategori
        </Button>
      </div>

      {/* Ringkasan Keseluruhan Anggaran */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card>
          <div className="text-xs font-semibold uppercase text-slate-500">
            Total Batas Anggaran
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {formatCurrency(Number(summary.totalLimit))}
          </div>
          <p className="mt-1 text-xs text-slate-400">Plafon anggaran bulan ini</p>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase text-slate-500">
            Total Pengeluaran Aktual
          </div>
          <div className="mt-1 text-2xl font-black text-rose-600">
            {formatCurrency(Number(summary.totalSpent))}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Terpakai {summary.totalUsagePercentage.toFixed(1)}%
          </p>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase text-slate-500">
            Sisa Anggaran Tersedia
          </div>
          <div
            className={`mt-1 text-2xl font-black ${
              Number(summary.totalRemaining) > 0 ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {formatCurrency(Number(summary.totalRemaining))}
          </div>
          <div className="mt-2">
            <Badge
              variant={
                summary.status === "SAFE"
                  ? "safe"
                  : summary.status === "WARNING"
                  ? "warning"
                  : "danger"
              }
              size="sm"
            >
              Status:{" "}
              {summary.status === "SAFE"
                ? "Aman (<80%)"
                : summary.status === "WARNING"
                ? "Waspada (80-99%)"
                : "Overbudget (≥100%)"}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Kartu Daftar Anggaran per Kategori */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-sm font-semibold">Memuat anggaran...</span>
        </div>
      ) : budgets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <PieChart className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-800">
            Belum Ada Anggaran yang Ditetapkan
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Pasang limit pengeluaran per kategori untuk mencegah boncos dan dapatkan
            +20 XP pertama kali!
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="mt-4"
            size="sm"
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Atur Anggaran Sekarang
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b) => (
            <Card key={b.id} className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle className="text-base">{b.category}</CardTitle>
                  <Badge
                    variant={
                      b.status === "SAFE"
                        ? "safe"
                        : b.status === "WARNING"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {b.status === "SAFE" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    ) : b.status === "WARNING" ? (
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <AlertOctagon className="h-3.5 w-3.5 mr-1" />
                    )}
                    {b.status === "SAFE"
                      ? "Aman"
                      : b.status === "WARNING"
                      ? "Waspada"
                      : "Overbudget"}
                  </Badge>
                </CardHeader>

                <div className="mt-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-black text-slate-900">
                      {formatCurrency(Number(b.spentAmount))}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      dari {formatCurrency(Number(b.limitAmount))}
                    </span>
                  </div>

                  <div className="mt-3">
                    <ProgressBar
                      percentage={b.usagePercentage}
                      variant={
                        b.status === "SAFE"
                          ? "emerald"
                          : b.status === "WARNING"
                          ? "amber"
                          : "rose"
                      }
                      size="md"
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
                    <span>Terpakai {b.usagePercentage.toFixed(1)}%</span>
                    <span>Sisa {formatCurrency(Number(b.remainingAmount))}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3 text-right">
                <button
                  onClick={() => {
                    setFormCategory(b.category);
                    setFormLimitAmount(b.limitAmount);
                    setIsModalOpen(true);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Edit Limit
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Atur Anggaran */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Atur Batas Anggaran Kategori"
        description="Menetapkan target limit membantumu disiplin dan memberikanmu +20 XP!"
      >
        {formError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            {formError}
          </div>
        )}

        <form onSubmit={handleUpsertBudget} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Pilih Kategori
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TRANSACTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Batas Maksimal Anggaran (Rp)"
            type="number"
            placeholder="Contoh: 500000"
            value={formLimitAmount}
            onChange={(e) => setFormLimitAmount(e.target.value)}
            required
            min="1000"
          />

          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
            Anggaran berlaku untuk periode{" "}
            <strong>
              {getMonthName(currentMonth)} {currentYear}
            </strong>
            . Pengeluaran dengan kategori yang sama akan otomatis terakumulasi.
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Simpan Anggaran
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
