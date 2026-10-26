// src/components/gamification/XpToast.tsx — Floating Animated XP Reward Toast
"use client";

import React, { useEffect } from "react";
import { Sparkles, Award } from "lucide-react";

export interface XpToastProps {
  xpGained: number;
  message?: string;
  isVisible: boolean;
  onClose: () => void;
}

export function XpToast({
  xpGained,
  message = "Aksi Finansial Berhasil!",
  isVisible,
  onClose,
}: XpToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || xpGained <= 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 p-4 text-slate-950 shadow-2xl shadow-amber-500/30 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-950 text-amber-300 font-black shadow-md">
        <Sparkles className="h-5 w-5 animate-pulse" />
      </div>

      <div>
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-950/80">
          {message}
        </div>
        <div className="flex items-center gap-1.5 text-base font-black text-slate-950">
          <span>+{xpGained} XP Diraih!</span>
          <Award className="h-4 w-4 text-amber-950" />
        </div>
      </div>
    </div>
  );
}
