// src/components/dashboard/CashflowChart.tsx — Grafik Visualisasi Keuangan Menggunakan Recharts
"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";

export interface CashflowChartProps {
  totalIncome: number;
  totalExpense: number;
  categoryExpenses: {
    category: string;
    amount: number;
  }[];
}

const CATEGORY_COLORS = [
  "#3b82f6", // Blue (Makanan)
  "#f59e0b", // Amber (Transportasi)
  "#ec4899", // Pink (Hiburan)
  "#8b5cf6", // Purple (Belajar)
  "#10b981", // Emerald (Uang Saku)
  "#64748b", // Slate (Lainnya)
];

export function CashflowChart({
  totalIncome,
  totalExpense,
  categoryExpenses,
}: CashflowChartProps) {
  const barData = [
    {
      name: "Pemasukan",
      nominal: totalIncome,
      color: "#10b981",
    },
    {
      name: "Pengeluaran",
      nominal: totalExpense,
      color: "#f43f5e",
    },
  ];

  const pieData = categoryExpenses
    .filter((item) => item.amount > 0)
    .map((item, index) => ({
      name: item.category,
      value: item.amount,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));

  const hasData = totalIncome > 0 || totalExpense > 0;

  if (!hasData) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-600">Grafik Belum Tersedia</p>
        <p className="mt-1">
          Catat pemasukan atau pengeluaran pertamamu untuk melihat grafik perbandingan arus kas!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* ─── Bar Chart: Pemasukan vs Pengeluaran ──────────────── */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
        <div>
          <h4 className="text-sm font-bold text-slate-800">
            Perbandingan Arus Kas Bulan Berjalan
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Pemasukan (hijau) vs Pengeluaran (merah)
          </p>
        </div>

        <div className="mt-4 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
              />
              <YAxis
                hide
              />
              <Tooltip
                formatter={(value) => [
                  formatCurrency(Number(value) || 0),
                  "Nominal",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  borderColor: "#e2e8f0",
                  fontSize: "12px",
                  fontWeight: 600,
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="nominal" radius={[10, 10, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex justify-around text-xs font-bold text-slate-700">
          <span className="text-emerald-600">
            Masuk: {formatCurrency(totalIncome)}
          </span>
          <span className="text-rose-600">
            Keluar: {formatCurrency(totalExpense)}
          </span>
        </div>
      </div>

      {/* ─── Pie Chart: Pengeluaran per Kategori ─────────────── */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
        <div>
          <h4 className="text-sm font-bold text-slate-800">
            Alokasi Pengeluaran per Kategori
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Sebaran pos belanja bulan ini
          </p>
        </div>

        {pieData.length === 0 ? (
          <div className="flex h-56 items-center justify-center text-xs text-slate-400">
            Belum ada pos pengeluaran yang dicatat bulan ini.
          </div>
        ) : (
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    formatCurrency(Number(value) || 0),
                    "Pengeluaran",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    borderColor: "#e2e8f0",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
