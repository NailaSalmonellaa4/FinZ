// src/app/(dashboard)/transactions/page.tsx — Halaman Riwayat & Pencatatan Transaksi
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  PlusCircle,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Sparkles,
  Filter,
  Loader2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateShort } from "@/lib/formatters";
import { TRANSACTION_CATEGORIES, type TransactionItem } from "@/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [summary, setSummary] = useState({
    totalIncome: "0",
    totalExpense: "0",
    netCashflow: "0",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [formType, setFormType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [formCategory, setFormCategory] = useState<string>(TRANSACTION_CATEGORIES[0]);
  const [formAmount, setFormAmount] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formDate, setFormDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [formError, setFormError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedType) params.append("type", selectedType);
      if (selectedCategory) params.append("category", selectedCategory);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();

      if (data.success && data.data) {
        setTransactions(data.data.items || []);
        if (data.data.summary) {
          setSummary(data.data.summary);
        }
      }
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedType, selectedCategory]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  async function handleCreateTransaction(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const amountNum = Number(formAmount);
    if (!amountNum || amountNum <= 0) {
      setFormError("Nominal transaksi harus lebih besar dari 0");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formType,
          category: formCategory,
          amount: amountNum,
          description: formDescription,
          transactionDate: new Date(formDate).toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal mencatat transaksi.");
      }

      // Tampilkan toast XP jika pengguna mendapatkan poin
      if (data.meta?.xpGained) {
        setToastMessage(`🎉 Transaksi dicatat! Kamu meraih +${data.meta.xpGained} XP!`);
        setTimeout(() => setToastMessage(null), 5000);
      }

      // Reset form dan tutup modal
      setFormAmount("");
      setFormDescription("");
      setIsModalOpen(false);
      fetchTransactions();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus catatan transaksi ini?")) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchTransactions();
      }
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  }

  function handleExportCSV() {
    if (transactions.length === 0) {
      alert("Tidak ada transaksi untuk diekspor.");
      return;
    }

    const headers = ["Tanggal", "Tipe", "Kategori", "Deskripsi", "Nominal (IDR)"];
    const rows = transactions.map((t) => [
      formatDateShort(t.transactionDate),
      t.type === "INCOME" ? "Pemasukan" : "Pengeluaran",
      t.category,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `finz-transaksi-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage("📥 Berhasil mengekspor riwayat transaksi ke format CSV!");
    setTimeout(() => setToastMessage(null), 4000);
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

      {/* Header Halaman & Tombol Aksi */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Pencatatan Transaksi
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Dokumentasikan arus kas pemasukan dan pengeluaran harianmu
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            leftIcon={<Download className="h-4 w-4 text-slate-600" />}
          >
            Ekspor CSV
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Catat Transaksi
          </Button>
        </div>
      </div>

      {/* Ringkasan Arus Kas Filter Aktif */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">
            Total Pemasukan
          </div>
          <div className="mt-1 text-2xl font-extrabold text-emerald-600">
            {formatCurrency(Number(summary.totalIncome))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">
            Total Pengeluaran
          </div>
          <div className="mt-1 text-2xl font-extrabold text-rose-600">
            {formatCurrency(Number(summary.totalExpense))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase text-slate-500">
            Sisa Arus Kas
          </div>
          <div
            className={`mt-1 text-2xl font-extrabold ${
              Number(summary.netCashflow) >= 0 ? "text-slate-900" : "text-rose-600"
            }`}
          >
            {formatCurrency(Number(summary.netCashflow))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <Filter className="h-4 w-4" />
          <span>Filter:</span>
        </div>

        {/* Filter Tipe */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Tipe</option>
          <option value="INCOME">Pemasukan</option>
          <option value="EXPENSE">Pengeluaran</option>
        </select>

        {/* Filter Kategori */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Kategori</option>
          {TRANSACTION_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {(selectedType || selectedCategory) && (
          <button
            onClick={() => {
              setSelectedType("");
              setSelectedCategory("");
            }}
            className="text-xs font-semibold text-blue-600 hover:underline ml-auto"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Tabel Riwayat Transaksi */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm font-semibold">Memuat transaksi...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-slate-800">
              Belum Ada Transaksi
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Catat transaksi keuangan pertamamu untuk memantau arus kas dan dapatkan
              +10 XP!
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="mt-4"
              size="sm"
              leftIcon={<PlusCircle className="h-4 w-4" />}
            >
              Catat Sekarang
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-6">Tanggal</th>
                  <th className="py-3.5 px-6">Tipe & Kategori</th>
                  <th className="py-3.5 px-6">Deskripsi</th>
                  <th className="py-3.5 px-6 text-right">Nominal</th>
                  <th className="py-3.5 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {transactions.map((trx) => (
                  <tr key={trx.id} className="transition hover:bg-slate-50/80">
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                      {formatDateShort(trx.transactionDate)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={trx.type === "INCOME" ? "safe" : "danger"}
                          size="sm"
                        >
                          {trx.type === "INCOME" ? "Masuk" : "Keluar"}
                        </Badge>
                        <span className="font-semibold text-slate-900">
                          {trx.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-900 font-semibold">
                      {trx.description}
                    </td>
                    <td
                      className={`py-4 px-6 text-right font-black text-sm whitespace-nowrap ${
                        trx.type === "INCOME"
                          ? "text-emerald-600"
                          : "text-slate-900"
                      }`}
                    >
                      {trx.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(Number(trx.amount))}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDelete(trx.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Hapus transaksi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah Transaksi */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Transaksi Baru"
        description="Pemasukan atau pengeluaran akan otomatis tercatat dan memberimu +10 XP!"
      >
        {formError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreateTransaction} className="space-y-4">
          {/* Toggle Type */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Tipe Transaksi
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormType("EXPENSE")}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition ${
                  formType === "EXPENSE"
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ArrowDownRight className="h-4 w-4 text-rose-500" />
                Pengeluaran
              </button>

              <button
                type="button"
                onClick={() => setFormType("INCOME")}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition ${
                  formType === "INCOME"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                Pemasukan
              </button>
            </div>
          </div>

          {/* Kategori Dropdown */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Kategori
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

          {/* Nominal */}
          <Input
            label="Nominal (Rp)"
            type="number"
            placeholder="Contoh: 25000"
            value={formAmount}
            onChange={(e) => setFormAmount(e.target.value)}
            required
            min="1"
          />

          {/* Deskripsi */}
          <Input
            label="Deskripsi Transaksi"
            placeholder="Contoh: Beli makan siang nasi padang"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            required
          />

          {/* Tanggal */}
          <Input
            label="Tanggal Transaksi"
            type="date"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
            required
          />

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Simpan Transaksi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
