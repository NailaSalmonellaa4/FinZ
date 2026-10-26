// src/components/layout/Sidebar.tsx — Sidebar Navigasi Utama Aplikasi
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  TrendingUp,
  Award,
} from "lucide-react";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transaksi",
    href: "/transactions",
    icon: Receipt,
  },
  {
    name: "Anggaran",
    href: "/budgets",
    icon: PieChart,
  },
  {
    name: "Target Tabungan",
    href: "/savings",
    icon: Target,
  },
  {
    name: "Simulasi Investasi",
    href: "/investments",
    icon: TrendingUp,
    badge: "Virtual",
  },
  {
    name: "Misi & Literasi",
    href: "/missions",
    icon: Award,
    badge: "XP",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 border-r border-slate-200 bg-white">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Fin<span className="text-blue-600">Z</span>
          </span>
          <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
            v2.0
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5 p-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    isActive
                      ? "bg-white/20 text-white"
                      : item.badge === "XP"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          <div className="font-semibold text-slate-700">Platform FinZ Edukasi</div>
          <p className="mt-0.5 text-[11px] leading-relaxed">
            Kelola uangmu secara cerdas, raih XP dan capai level maksimal!
          </p>
        </div>
      </div>
    </aside>
  );
}
