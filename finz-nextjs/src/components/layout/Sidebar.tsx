// src/components/layout/Sidebar.tsx — Sidebar Navigasi FinZ (Collapsible & Clean Professional Labels)
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Target,
  BookOpen,
  Wallet,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  ShieldAlert,
  Globe,
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

  const userStatusTitle =
    level >= 10
      ? "Pengelola Mahir"
      : level >= 5
      ? "Investor Pemula"
      : level >= 3
      ? "Perencana Anggaran"
      : "Pemula Finansial";

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Gagal logout:", err);
      setIsLoggingOut(false);
    }
  }

  // Label navigasi profesional, bersih, dan tanpa istilah game
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
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
      badge: "50/30/20",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      name: "Investasi",
      href: "/investments",
      icon: TrendingUp,
      badge: "Simulasi",
      badgeColor: "bg-purple-100 text-purple-700",
    },
    {
      name: "Tabungan",
      href: "/savings",
      icon: Target,
      badge: "Target",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      name: "Edukasi & Panduan",
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
            title="FinZ Platform"
          >
            <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-tr from-emerald-600 via-primary to-emerald-400 flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/20">
              <Zap className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="font-headline text-[17px] font-extrabold text-[#0F172A] tracking-tight block leading-none">
                  Fin<span className="text-emerald-600">Z</span>
                </span>
                <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">
                  Edukasi Finansial
                </span>
              </div>
            )}
          </Link>

          {/* Minimize / Expand Toggle Button */}
          <div className="flex items-center gap-1">
            {!isCollapsed && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold border border-emerald-200">
                Edukasi
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

        {/* User Profile Card in Sidebar */}
        {!isCollapsed ? (
          <div className="mx-3 mb-4 p-3 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 border border-slate-200/90 shadow-sm relative overflow-hidden">
            {/* User Avatar & Info */}
            <div className="flex items-center gap-2.5 mb-2 relative z-10">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-sm flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center border-2 border-white uppercase">
                    {userName.substring(0, 2)}
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-emerald-700 text-white font-extrabold text-[8px] rounded-full ring-2 ring-white shadow">
                  Lv. {level}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-headline text-xs font-bold text-[#0F172A] truncate flex items-center gap-1">
                  {userName}
                  <span className="h-3 w-3 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[8px] font-bold shrink-0">
                    ✓
                  </span>
                </div>
                <div className="text-[10px] text-text-secondary truncate font-medium">
                  <span className="text-emerald-700 font-bold">{userStatusTitle}</span>
                </div>
              </div>
            </div>

            {/* Poin Edukasi Bar */}
            <div className="space-y-1 mb-2.5 bg-white p-2 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Award className="h-2.5 w-2.5 text-amber-500" /> {xpInLevel} / 100 Poin
                </span>
                <span className="font-extrabold text-emerald-700 text-[10px]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] text-slate-500">
                <span>Level {level}</span>
                <span className="text-emerald-700 font-bold">+{100 - xpInLevel} Poin ke Lv.{level + 1}</span>
              </div>
            </div>

            {/* Currencies & Stats Widget */}
            <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-100 text-center">
              <div className="p-1 rounded-lg bg-emerald-50/70 border border-emerald-100 flex flex-col items-center">
                <span className="text-[9px] text-emerald-800 font-bold flex items-center gap-0.5">
                  <Wallet className="h-2.5 w-2.5 text-emerald-600" /> Saldo
                </span>
                <span
                  className="font-mono-currency text-[10px] font-extrabold text-emerald-950 block truncate mt-0.5"
                  title={formatCurrency(virtualBalanceNum)}
                >
                  {virtualBalanceNum >= 1000000
                    ? `${(virtualBalanceNum / 1000).toLocaleString("id-ID")}k`
                    : formatCurrency(virtualBalanceNum)}
                </span>
              </div>
              <div className="p-1 rounded-lg bg-amber-50/70 border border-amber-100 flex flex-col items-center">
                <span className="text-[9px] text-amber-800 font-bold flex items-center gap-0.5">
                  <Award className="h-2.5 w-2.5 text-amber-600" /> Poin
                </span>
                <span className="font-mono-currency text-[10px] font-extrabold text-amber-950 block mt-0.5">
                  {xp} XP
                </span>
              </div>
              <div className="p-1 rounded-lg bg-blue-50/70 border border-blue-100 flex flex-col items-center">
                <span className="text-[9px] text-blue-800 font-bold flex items-center gap-0.5">
                  <Clock className="h-2.5 w-2.5 text-blue-600" /> Aktif
                </span>
                <span className="font-mono-currency text-[10px] font-extrabold text-blue-950 block mt-0.5">
                  5 Hari
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Minimized Character View — hanya avatar profil, 3 icon dihilangkan saat minimize */
          <div className="flex flex-col items-center my-3">
            <div
              className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-md cursor-pointer"
              title={`${userName} (Lv. ${level}) - ${xpInLevel}/100 Poin`}
            >
              <div className="w-full h-full rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center uppercase">
                {userName.substring(0, 2)}
              </div>
              <span className="absolute -bottom-1 -right-1 px-1 bg-emerald-700 text-white font-extrabold text-[8px] rounded-full">
                {level}
              </span>
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
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px]">
              <div className="flex items-center gap-1.5 mb-0.5 text-emerald-800 font-bold text-xs">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span>Simulasi Edukatif</span>
              </div>
              <p className="text-text-secondary text-[10px] leading-relaxed">
                Seluruh saldo dan transaksi adalah simulasi pembelajaran tanpa risiko uang riil.
              </p>
            </div>

            <div className="flex items-center justify-between px-1 text-xs text-text-secondary pt-0.5">
              <Link
                href="/missions#faq"
                className="flex items-center gap-1 hover:text-slate-900 transition-colors font-medium text-[11px]"
                title="Pusat Bantuan & Panduan Finansial"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Pusat Bantuan
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1 hover:text-rose-600 transition-colors font-medium text-slate-500 text-[11px] disabled:opacity-50"
                title="Keluar dari akun dan kembali ke Halaman Depan"
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
              href="/"
              className="p-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="Kunjungi Halaman Depan FinZ"
            >
              <Globe className="h-4 w-4" />
            </Link>
            <Link
              href="/missions#faq"
              className="p-2 rounded-lg text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
              title="Pusat Bantuan & Panduan"
            >
              <HelpCircle className="h-4 w-4" />
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
              title="Keluar dari akun dan kembali ke Halaman Depan"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
