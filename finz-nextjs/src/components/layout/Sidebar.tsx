// src/components/layout/Sidebar.tsx — Sidebar Navigasi RPG FinZ Quest (Collapsible & Compact Labels)
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Zap,
  Swords,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Target,
  BookOpen,
  Coins,
  Gem,
  Flame,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  ShieldAlert,
  Award,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

export interface SidebarProps {
  user?: {
    name: string;
    level: number;
    xp: number;
    virtualBalance: string;
  };
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ user, isCollapsed = false, onToggle }: SidebarProps) {
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

  const characterTitle =
    level >= 10
      ? "Grand Master Finansial"
      : level >= 5
      ? "Senior Capital Knight"
      : level >= 3
      ? "Novice Budgeteer"
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

  // Label navigasi ringkas, jelas, dan tidak terpotong (ellipsis)
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Swords,
      badge: null,
      isDashboard: true,
    },
    {
      name: "Transaksi",
      href: "/transactions",
      icon: Receipt,
      badge: null,
    },
    {
      name: "Anggaran",
      href: "/budgets",
      icon: ShieldCheck,
      badge: "Shield",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      name: "Investasi",
      href: "/investments",
      icon: TrendingUp,
      badge: "+XP",
      badgeColor: "bg-purple-100 text-purple-700",
    },
    {
      name: "Tabungan",
      href: "/savings",
      icon: Target,
      badge: "Boss",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      name: "Misi & Edukasi",
      href: "/missions",
      icon: BookOpen,
      badge: null,
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-border-subtle z-50 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 ${
        isCollapsed ? "w-[76px]" : "w-[260px]"
      } overflow-y-auto overflow-x-hidden`}
    >
      <div className="flex flex-col pt-4">
        {/* Header with FinZ Logo & Toggle Button */}
        <div
          className={`mb-4 flex items-center ${
            isCollapsed ? "flex-col justify-center gap-2 px-2" : "justify-between px-4"
          }`}
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            title="FinZ Quest RPG Edition"
          >
            <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-tr from-emerald-600 via-primary to-emerald-400 flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/20">
              <Zap className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="font-headline text-[17px] font-extrabold text-[#0F172A] tracking-tight block leading-none">
                  FinZ Quest
                </span>
                <span className="text-[9px] font-bold text-gamify-xp tracking-wider uppercase">
                  RPG Edition
                </span>
              </div>
            )}
          </Link>

          {/* Minimize / Expand Toggle Button */}
          <div className="flex items-center gap-1">
            {!isCollapsed && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[9px] font-extrabold shadow-sm flex items-center gap-0.5">
                <Award className="h-3 w-3" /> S1
              </span>
            )}
            {onToggle && (
              <button
                onClick={onToggle}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title={isCollapsed ? "Perluas Sidebar" : "Minimize Sidebar"}
                type="button"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* RPG Character Profile Card in Sidebar */}
        {!isCollapsed ? (
          <div className="mx-3 mb-4 p-3 rounded-2xl bg-gradient-to-br from-surface-container-low via-surface-card to-gamify-xp-bg border-2 border-amber-300/70 shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-16 h-16 bg-amber-200/40 rounded-full blur-lg pointer-events-none" />

            {/* Character Avatar & Info */}
            <div className="flex items-center gap-2.5 mb-2 relative z-10">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center border-2 border-white uppercase">
                    {userName.substring(0, 2)}
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold text-[8px] rounded-full ring-2 ring-white shadow">
                  Lv. {level}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-headline text-xs font-bold text-[#0F172A] truncate flex items-center gap-1">
                  {userName}
                  <span className="h-3 w-3 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[8px] font-bold shrink-0">
                    ✓
                  </span>
                </div>
                <div className="text-[10px] text-text-secondary truncate font-medium">
                  <span className="text-gamify-xp font-bold">{characterTitle}</span>
                </div>
              </div>
            </div>

            {/* EXP Bar */}
            <div className="space-y-1 mb-2.5 bg-white/80 p-2 rounded-xl border border-border-subtle/80">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-gamify-xp flex items-center gap-1">
                  <Zap className="h-2.5 w-2.5 text-gamify-xp" /> {xpInLevel} / 100 EXP
                </span>
                <span className="font-extrabold text-secondary text-[10px]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden shadow-inner border border-slate-200">
                <div
                  className="bg-gradient-to-r from-secondary via-gamify-xp to-primary-container h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] text-text-muted">
                <span>Tier Explorer {level}</span>
                <span className="text-primary font-bold">+{100 - xpInLevel} EXP</span>
              </div>
            </div>

            {/* Currencies RPG Widget */}
            <div className="grid grid-cols-3 gap-1 pt-1 border-t border-border-subtle/60 text-center">
              <div className="p-1 rounded-lg bg-amber-50 border border-amber-200/60 flex flex-col items-center">
                <span className="text-[9px] text-amber-800 font-bold flex items-center gap-0.5">
                  <Coins className="h-2.5 w-2.5 text-amber-600" /> Gold
                </span>
                <span
                  className="font-mono-currency text-[10px] font-extrabold text-amber-900 block truncate mt-0.5"
                  title={formatCurrency(virtualBalanceNum)}
                >
                  {virtualBalanceNum >= 1000000
                    ? `${(virtualBalanceNum / 1000).toLocaleString("id-ID")}k`
                    : formatCurrency(virtualBalanceNum)}
                </span>
              </div>
              <div className="p-1 rounded-lg bg-purple-50 border border-purple-200/60 flex flex-col items-center">
                <span className="text-[9px] text-purple-800 font-bold flex items-center gap-0.5">
                  <Gem className="h-2.5 w-2.5 text-purple-600" /> Gems
                </span>
                <span className="font-mono-currency text-[10px] font-extrabold text-purple-900 block mt-0.5">
                  {gemsCount}
                </span>
              </div>
              <div className="p-1 rounded-lg bg-rose-50 border border-rose-200/60 flex flex-col items-center">
                <span className="text-[9px] text-rose-800 font-bold flex items-center gap-0.5">
                  <Flame className="h-2.5 w-2.5 text-rose-600" /> Streak
                </span>
                <span className="font-mono-currency text-[10px] font-extrabold text-rose-900 block mt-0.5">
                  5 Hari
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Minimized Character View */
          <div className="flex flex-col items-center my-3 space-y-2">
            <div
              className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-md cursor-pointer"
              title={`${userName} (Lv. ${level}) - ${xpInLevel}/100 EXP`}
            >
              <div className="w-full h-full rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center uppercase">
                {userName.substring(0, 2)}
              </div>
              <span className="absolute -bottom-1 -right-1 px-1 bg-amber-500 text-white font-extrabold text-[8px] rounded-full">
                {level}
              </span>
            </div>

            {/* Mini Currency Icons Stack */}
            <div className="flex flex-col items-center gap-1 pt-1">
              <div
                className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700"
                title={`Gold: ${formatCurrency(virtualBalanceNum)}`}
              >
                <Coins className="h-3.5 w-3.5" />
              </div>
              <div
                className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700"
                title={`Gems: ${gemsCount}`}
              >
                <Gem className="h-3.5 w-3.5" />
              </div>
              <div
                className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700"
                title="Streak: 5 Hari"
              >
                <Flame className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        )}

        {/* Gamified Navigation Items */}
        <nav className="space-y-1 px-2.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const IconComponent = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-2.5 rounded-xl transition-all font-body text-xs font-semibold ${
                  isCollapsed
                    ? "justify-center p-2.5"
                    : "px-3 py-2"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-status-safe-bg to-emerald-50 text-primary border border-primary/20 shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <IconComponent
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-primary" : "text-slate-400"
                  }`}
                />
                {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}
                {!isCollapsed && isActive && item.isDashboard && (
                  <span className="w-1.5 h-1.5 rounded-full bg-status-safe animate-pulse shrink-0" />
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md font-extrabold text-[9px] shrink-0 ${
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
      <div className="p-3 space-y-2 border-t border-border-subtle/50 mt-auto pb-4">
        {!isCollapsed ? (
          <>
            <div className="bg-gradient-to-r from-surface-container-low to-purple-50/50 p-2.5 rounded-xl border border-purple-200/50 text-[11px]">
              <div className="flex items-center gap-1.5 mb-0.5 text-secondary font-bold text-xs">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                <span>Simulasi Aman</span>
              </div>
              <p className="text-text-secondary text-[10px] leading-relaxed">
                Saldo & token 100% virtual untuk sarana latihan tanpa risiko uang riil.
              </p>
            </div>

            <div className="flex items-center justify-between px-1 text-xs text-text-secondary pt-0.5">
              <Link
                href="/missions#faq"
                className="flex items-center gap-1 hover:text-[#0F172A] transition-colors font-medium text-[11px]"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Bantuan Guild
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1 hover:text-rose-600 transition-colors font-medium text-slate-500 text-[11px] disabled:opacity-50"
                title="Keluar dari akun"
              >
                <LogOut className="h-3.5 w-3.5" />
                {isLoggingOut ? "..." : "Keluar"}
              </button>
            </div>
          </>
        ) : (
          /* Minimized Footer */
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/missions#faq"
              className="p-2 rounded-lg text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
              title="Bantuan Guild & FAQ"
            >
              <HelpCircle className="h-4 w-4" />
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
              title="Keluar dari akun"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
