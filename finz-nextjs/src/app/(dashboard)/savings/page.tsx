// src/app/(dashboard)/savings/page.tsx — Halaman Target Tabungan (Savings Goals)
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Target,
  PlusCircle,
  Coins,
  CheckCircle2,
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { SavingsGoalItem } from "@/types";

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoalItem[]>([]);
  const [summary, setSummary] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    totalSaved: "0",
    totalTarget: "0",
    overallProgress: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Modal Create Goal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createTargetAmount, setCreateTargetAmount] = useState("");
  const [createTargetDate, setCreateTargetDate] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  // Modal Contribute
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoalItem | null>(null);
  const [contributeAmount, setContributeAmount] = useState("");
  const [contributeError, setContributeError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/savings");
      const data = await res.json();

      if (data.success && data.data) {
        setGoals(data.data.items || []);
        if (data.data.summary) {
          setSummary(data.data.summary);
        }
      }
    } catch (err) {
      console.error("Gagal memuat target tabungan:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  async function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);

    const targetNum = Number(createTargetAmount);
    if (!targetNum || targetNum <= 0) {
      setCreateError("Nominal target tabungan harus lebih besar dari 0");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: createTitle,
          targetAmount: targetNum,
          targetDate: createTargetDate || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal membuat target tabungan.");
      }

      if (data.meta?.xpGained) {
        setToastMessage(`🎉 Target dibuat! Kamu meraih +${data.meta.xpGained} XP!`);
        setTimeout(() => setToastMessage(null), 5000);
      }

      setCreateTitle("");
      setCreateTargetAmount("");
      setCreateTargetDate("");
      setIsCreateOpen(false);
      fetchGoals();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleContribute(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedGoal) return;
    setContributeError(null);

    const amountNum = Number(contributeAmount);
    if (!amountNum || amountNum <= 0) {
      setContributeError("Nominal kontribusi harus lebih besar dari 0");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/savings/${selectedGoal.id}/contribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountNum }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal menambahkan tabungan.");
      }

      if (data.meta?.xpGained) {
        setToastMessage(
          data.meta.goalCompleted
            ? `🏆 Luar Biasa! Target tercapai 100%! Kamu meraih BONUS +${data.meta.xpGained} XP!`
            : `💰 Tabungan bertambah! Kamu meraih +${data.meta.xpGained} XP!`
        );
        setTimeout(() => setToastMessage(null), 6000);
      }

      setContributeAmount("");
      setSelectedGoal(null);
      fetchGoals();
    } catch (err) {
      setContributeError(err instanceof Error ? err.message : "Terjadi kesalahan.");
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

      {/* Header Halaman */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Target Tabungan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Wujudkan tujuan finansialmu dan peroleh bonus XP di setiap pencapaian
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<PlusCircle className="h-4 w-4" />}
        >
          Buat Target Tabungan
        </Button>
      </div>

      {/* Ringkasan Keseluruhan Tabungan */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card>
          <div className="text-xs font-semibold uppercase text-slate-500">
            Total Dana Terkumpul
          </div>
          <div className="mt-1 text-2xl font-black text-emerald-600">
            {formatCurrency(Number(summary.totalSaved))}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            dari target {formatCurrency(Number(summary.totalTarget))}
          </p>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase text-slate-500">
            Progres Rata-rata
          </div>
          <div className="mt-1 text-2xl font-black text-blue-600">
            {summary.overallProgress.toFixed(1)}%
          </div>
          <div className="mt-2">
            <ProgressBar
              percentage={summary.overallProgress}
              variant="blue"
              size="sm"
            />
          </div>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase text-slate-500">
            Target Selesai
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {summary.completedGoals}{" "}
            <span className="text-sm font-normal text-slate-400">
              / {summary.totalGoals} Target
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {summary.activeGoals} target tabungan sedang aktif berjalan
          </p>
        </Card>
      </div>

      {/* Daftar Target Tabungan */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-sm font-semibold">Memuat target tabungan...</span>
        </div>
      ) : goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <Target className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-800">
            Belum Ada Target Tabungan
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Mulai rencanakan tabungan impianmu dan dapatkan +25 XP secara langsung!
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4"
            size="sm"
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Buat Target Sekarang
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => {
            const isCompleted = g.status === "COMPLETED";

            return (
              <Card
                key={g.id}
                className={`flex flex-col justify-between ${
                  isCompleted ? "border-emerald-200 bg-emerald-50/20" : ""
                }`}
              >
                <div>
                  <CardHeader>
                    <CardTitle className="text-base">{g.title}</CardTitle>
                    <Badge variant={isCompleted ? "safe" : "default"}>
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Tercapai 100%
                        </>
                      ) : (
                        "Berjalan"
                      )}
                    </Badge>
                  </CardHeader>

                  <div className="mt-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-black text-slate-900">
                        {formatCurrency(Number(g.currentAmount))}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        dari {formatCurrency(Number(g.targetAmount))}
                      </span>
                    </div>

                    <div className="mt-3">
                      <ProgressBar
                        percentage={g.progressPercentage}
                        variant={isCompleted ? "emerald" : "blue"}
                        size="md"
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
                      <span>Progres {g.progressPercentage.toFixed(1)}%</span>
                      {g.targetDate ? (
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="h-3 w-3" />
                          {formatDate(g.targetDate)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Tanpa batas waktu
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  {isCompleted ? (
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 py-2 rounded-xl">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      Target Berhasil Dicapai!
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setSelectedGoal(g);
                        setContributeAmount("");
                        setContributeError(null);
                      }}
                      className="w-full"
                      size="sm"
                      variant="outline"
                      leftIcon={<Coins className="h-4 w-4" />}
                    >
                      Tambah Tabungan (+10 XP)
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Buat Target Tabungan */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Buat Target Tabungan Baru"
        description="Tetapkan target tabunganmu dan raih +25 XP pertama kali!"
      >
        {createError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            {createError}
          </div>
        )}

        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Nama Target Tabungan"
            placeholder="Contoh: Beli Laptop Baru / Dana Darurat"
            value={createTitle}
            onChange={(e) => setCreateTitle(e.target.value)}
            required
          />

          <Input
            label="Nominal Target (Rp)"
            type="number"
            placeholder="Contoh: 5000000"
            value={createTargetAmount}
            onChange={(e) => setCreateTargetAmount(e.target.value)}
            required
            min="1000"
          />

          <Input
            label="Target Tanggal Tercapai (Opsional)"
            type="date"
            value={createTargetDate}
            onChange={(e) => setCreateTargetDate(e.target.value)}
          />

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Simpan Target
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Kontribusi Tabungan */}
      <Modal
        isOpen={selectedGoal !== null}
        onClose={() => setSelectedGoal(null)}
        title={`Tambah Dana ke "${selectedGoal?.title}"`}
        description="Setiap kontribusi tabungan memberimu +10 XP, dan bonus +50 XP jika target tercapai!"
      >
        {contributeError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            {contributeError}
          </div>
        )}

        <form onSubmit={handleContribute} className="space-y-4">
          {selectedGoal && (
            <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Saat ini terkumpul:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(Number(selectedGoal.currentAmount))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Target akhir:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(Number(selectedGoal.targetAmount))}
                </span>
              </div>
              <div className="flex justify-between text-blue-600 font-semibold pt-1 border-t border-slate-200">
                <span>Sisa kekurangan:</span>
                <span>
                  {formatCurrency(
                    Number(selectedGoal.targetAmount) -
                      Number(selectedGoal.currentAmount)
                  )}
                </span>
              </div>
            </div>
          )}

          <Input
            label="Nominal Tambahan (Rp)"
            type="number"
            placeholder="Contoh: 100000"
            value={contributeAmount}
            onChange={(e) => setContributeAmount(e.target.value)}
            required
            min="1000"
          />

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedGoal(null)}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Konfirmasi Tabungan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
