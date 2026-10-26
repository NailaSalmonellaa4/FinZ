// src/components/layout/XpHeaderBar.tsx — Header Status Gamifikasi & Saldo Virtual
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Wallet, LogOut, Loader2, Sparkles } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/formatters";

export interface XpHeaderBarProps {
  user: {
    name: string;
    level: number;
    xp: number;
    virtualBalance: string;
  };
}

export function XpHeaderBar({ user }: XpHeaderBarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const currentLevelXp = user.xp % 100;
  const virtualBalanceNum = Number(user.virtualBalance);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Gagal logout:", error);
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Saldo Virtual Investasi */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Saldo Virtual
            </div>
            <div className="text-sm font-extrabold text-slate-900 sm:text-base">
              {formatCurrency(virtualBalanceNum)}
            </div>
          </div>
        </div>

        {/* Center / Right: Level & XP Bar + Profil */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* XP & Level Widget */}
          <div className="hidden items-center gap-3 sm:flex">
            {/* Level Badge */}
            <div className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 shadow-sm">
              <Award className="h-4 w-4 text-amber-600" />
              <span>Lv. {user.level}</span>
            </div>

            {/* XP Bar */}
            <div className="w-32 lg:w-44">
              <div className="mb-0.5 flex justify-between text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  XP
                </span>
                <span>{currentLevelXp}/100</span>
              </div>
              <ProgressBar percentage={currentLevelXp} variant="xp" size="sm" />
            </div>
          </div>

          {/* User Name & Logout */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="hidden text-right md:block">
              <div className="text-xs font-bold text-slate-900">{user.name}</div>
              <div className="text-[10px] text-slate-400">Total {user.xp} XP</div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 disabled:opacity-50"
              title="Keluar dari akun"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
