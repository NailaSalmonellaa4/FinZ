// src/components/gamification/LevelUpModal.tsx — Modal Animasi Perayaan Kenaikan Level
"use client";

import React from "react";
import { Award, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
}

export function LevelUpModal({ isOpen, onClose, newLevel }: LevelUpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Celebration Content */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-amber-300 bg-gradient-to-b from-amber-50 via-white to-white p-8 text-center shadow-2xl shadow-amber-500/30 animate-in zoom-in-90 duration-300">
        {/* Glow circle */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-44 w-44 rounded-full bg-amber-400/25 blur-3xl pointer-events-none" />

        {/* Animated Trophy Icon */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-400 text-amber-950 shadow-xl shadow-amber-400/50">
          <Trophy className="h-10 w-10 animate-bounce" />
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-amber-300 animate-spin" />
        </div>

        <div className="mt-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            PENCAPAIAN BARU!
          </div>

          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            Selamat, Kamu Mencapai
          </h3>

          <div className="mt-2 text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
            Level {newLevel}
          </div>

          <p className="mt-3 text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
            Konsistensi pencatatan dan kedisiplinan keuanganmu terbukti nyata. Terus
            kembangkan kebiasaan finansial cerdasmu!
          </p>
        </div>

        <div className="mt-6">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-500/25"
            leftIcon={<Award className="h-4 w-4" />}
          >
            Lanjutkan Pengelolaan Keuangan
          </Button>
        </div>
      </div>
    </div>
  );
}
