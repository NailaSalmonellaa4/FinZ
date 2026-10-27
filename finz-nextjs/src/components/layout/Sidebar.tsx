// src/components/layout/Sidebar.tsx — Sidebar Navigasi RPG FinZ Quest
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";

export interface SidebarProps {
  user?: {
    name: string;
    level: number;
    xp: number;
    virtualBalance: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const level = user?.level ?? 1;
  const xp = user?.xp ?? 0;
  const xpInLevel = xp % 100;
  const progressPercent = Math.min(100, Math.round((xpInLevel / 100) * 100));
  const virtualBalanceNum = user ? Number(user.virtualBalance) : 10000000;
  const userName = user?.name ?? "Andi Pratama";
  const gemsCount = Math.max(10, Math.floor(xp / 2) + 20);

  // Dynamic RPG title based on level
  const characterTitle =
    level >= 10
      ? "Grand Master Finansial"
      : level >= 5
      ? "Senior Capital Knight"
      : level >= 3
      ? "Novice Budgeteer • Explorer"
      : "Cadet Finansial";

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Gagal logout:", err);
      setIsLoggingOut(false);
    }
  }

  const navItems = [
    {
      name: "Quest Dashboard",
      href: "/dashboard",
      emoji: "⚔️",
      badge: null,
      isDashboard: true,
    },
    {
      name: "Buku Kas & Transaksi",
      href: "/transactions",
      emoji: "📜",
      badge: null,
    },
    {
      name: "Fortifikasi Anggaran",
      href: "/budgets",
      emoji: "🛡️",
      badge: "Shield",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      name: "Arena Investasi Virtual",
      href: "/investments",
      emoji: "📈",
      badge: "+XP",
      badgeColor: "bg-purple-100 text-purple-700",
    },
    {
      name: "Target Tabungan & Boss",
      href: "/savings",
      emoji: "🎯",
      badge: "Boss",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      name: "Kitab Misi & Literasi",
      href: "/missions",
      emoji: "📖",
      badge: null,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-white border-r border-border-subtle z-50 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-y-auto">
      <div className="flex flex-col pt-4">
        {/* Header with FinZ Logo */}
        <div className="px-5 mb-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-primary to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/20">
              ⚡
            </div>
            <div>
              <span className="font-headline text-[19px] font-extrabold text-[#0F172A] tracking-tight block leading-none">
                FinZ Quest
              </span>
              <span className="text-[10px] font-bold text-gamify-xp tracking-wider uppercase">
                RPG Edition
              </span>
            </div>
          </Link>
          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-label-sm text-[10px] font-extrabold shadow-sm flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">military_tech</span> S1
          </span>
        </div>

        {/* RPG Character Profile Card in Sidebar */}
        <div className="mx-3.5 mb-4 p-3.5 rounded-2xl bg-gradient-to-br from-surface-container-low via-surface-card to-gamify-xp-bg border-2 border-amber-300/70 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-16 h-16 bg-amber-200/40 rounded-full blur-lg pointer-events-none" />

          {/* Character Avatar & Info */}
          <div className="flex items-center gap-3 mb-2.5 relative z-10">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center border-2 border-white uppercase">
                  {userName.substring(0, 2)}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold text-[9px] rounded-full ring-2 ring-white shadow">
                Lv. {level}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-headline text-sm font-bold text-[#0F172A] truncate flex items-center gap-1">
                {userName}
                <span className="material-symbols-outlined text-amber-500 text-sm">verified</span>
              </div>
              <div className="text-[11px] text-text-secondary truncate font-medium flex items-center gap-1">
                <span className="text-gamify-xp font-bold">{characterTitle}</span>
              </div>
            </div>
          </div>

          {/* EXP Bar */}
          <div className="space-y-1 mb-3 bg-white/80 p-2 rounded-xl border border-border-subtle/80">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-gamify-xp flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">bolt</span> {xpInLevel} / 100 EXP
              </span>
              <span className="font-extrabold text-secondary text-[11px]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner border border-slate-200">
              <div
                className="bg-gradient-to-r from-secondary via-gamify-xp to-primary-container h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-text-muted">
              <span>Tier Explorer {level}</span>
              <span className="text-primary font-bold">+{100 - xpInLevel} EXP to Level Up</span>
            </div>
          </div>

          {/* Currencies RPG Widget */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-border-subtle/60 text-center">
            <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200/60">
              <span className="text-[10px] text-amber-800 font-bold block">🪙 Gold</span>
              <span className="font-mono-currency text-[11px] font-extrabold text-amber-900 block truncate" title={formatCurrency(virtualBalanceNum)}>
                {virtualBalanceNum >= 1000000
                  ? `${(virtualBalanceNum / 1000).toLocaleString("id-ID")}k`
                  : formatCurrency(virtualBalanceNum)}
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-purple-50 border border-purple-200/60">
              <span className="text-[10px] text-purple-800 font-bold block">💎 Gems</span>
              <span className="font-mono-currency text-[11px] font-extrabold text-purple-900 block">
                {gemsCount}
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200/60">
              <span className="text-[10px] text-rose-800 font-bold block">🔥 Streak</span>
              <span className="font-mono-currency text-[11px] font-extrabold text-rose-900 block">
                5 Hari
              </span>
            </div>
          </div>
        </div>

        {/* Gamified Navigation Items */}
        <nav className="space-y-1.5 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-body text-sm ${
                  isActive
                    ? "bg-gradient-to-r from-status-safe-bg to-emerald-50 text-primary border border-primary/20 font-bold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-[#0F172A] font-medium"
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span className="flex-1">{item.name}</span>
                {isActive && item.isDashboard && (
                  <span className="w-2 h-2 rounded-full bg-status-safe animate-pulse" />
                )}
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md font-extrabold text-[10px] ${
                      item.badgeColor || "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Note */}
      <div className="p-3.5 space-y-2.5 border-t border-border-subtle/50 mt-auto">
        <div className="bg-gradient-to-r from-surface-container-low to-purple-50/50 p-3 rounded-xl border border-purple-200/50 text-xs">
          <div className="flex items-center gap-1.5 mb-1 text-secondary font-bold">
            <span className="material-symbols-outlined text-sm">shield</span>
            <span>Simulasi Finansial Aman</span>
          </div>
          <p className="text-text-secondary text-[11px] leading-relaxed">
            Saldo & token 100% virtual untuk sarana belajar eksploratif tanpa takut risiko modal.
          </p>
        </div>

        <div className="flex items-center justify-between px-1 text-xs text-text-secondary">
          <Link
            href="/missions#faq"
            className="flex items-center gap-1 hover:text-[#0F172A] transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-base">help</span>
            Bantuan Guild
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1 hover:text-rose-600 transition-colors font-medium text-slate-500 disabled:opacity-50"
            title="Keluar dari akun"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            {isLoggingOut ? "Keluar..." : "Keluar"}
          </button>
        </div>
      </div>
    </aside>
  );
}
