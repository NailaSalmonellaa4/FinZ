// src/app/(dashboard)/missions/page.tsx — Halaman Misi Gamifikasi & Panduan Literasi Keuangan
"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { MissionItem } from "@/types";

const FAQ_ITEMS = [
  {
    q: "Bagaimana cara kerja kenaikan Level dan XP di FinZ?",
    a: "Setiap aksi positif mengelola keuangan memberimu XP: mencatat transaksi (+10 XP), membuat anggaran (+20 XP), membuat/menambah tabungan (+10 s/d +25 XP), dan simulasi trading (+30 XP). Setiap kelipatan 100 XP, level akunmu akan naik 1 tingkat!",
  },
  {
    q: "Apakah saldo dan keuntungan investasi di FinZ adalah uang sungguhan?",
    a: "Tidak. Seluruh saldo awal Rp 10.000.000, transaksi beli/jual, harga per unit, dan keuntungan/kerugian (P/L) murni berupa simulasi edukasi. FinZ dirancang agar pelajar dapat belajar mekanisme portofolio tanpa risiko kehilangan uang asli.",
  },
  {
    q: "Apa aturan 50/30/20 dalam membuat anggaran bulanan?",
    a: "Metode 50/30/20 membagi pemasukanmu menjadi tiga pos: 50% untuk Kebutuhan Pokok (makanan, transportasi sekolah), 30% untuk Keinginan (hiburan, hobi), dan 20% untuk Tabungan/Investasi masa depan.",
  },
  {
    q: "Kapan status target tabungan berubah menjadi COMPLETED?",
    a: "Ketika akumulasi nominal yang kamu kontribusikan telah mencapai atau melebihi target yang ditetapkan (progres 100%), status otomatis berubah menjadi selesai dan memberimu bonus selebrasi +50 XP!",
  },
];

export default function MissionsPage() {
  const [missions, setMissions] = useState<MissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    async function loadMissions() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/missions");
        const data = await res.json();
        if (data.success) {
          setMissions(data.data || []);
        }
      } catch (err) {
        console.error("Gagal memuat misi:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMissions();
  }, []);

  const completedCount = missions.filter((m) => m.isCompleted).length;

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Edukasi &amp; Panduan Finansial
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Selesaikan target pencatatan finansial dan pelajari panduan dasar manajemen keuangan
        </p>
      </div>

      {/* Ringkasan Progres Target */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card>
          <div className="text-xs font-semibold uppercase text-slate-500">
            Total Target Selesai
          </div>
          <div className="mt-1 text-2xl font-black text-emerald-600">
            {completedCount}{" "}
            <span className="text-sm font-normal text-slate-400">
              / {missions.length} Target
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Selesaikan seluruh target untuk pemahaman finansial optimal
          </p>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase text-slate-500">
            Poin Edukasi Tersedia
          </div>
          <div className="mt-1 text-2xl font-black text-amber-500">
            {missions
              .filter((m) => !m.isCompleted)
              .reduce((acc, m) => acc + m.xpReward, 0)}{" "}
            Poin
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Dapat diperoleh dari target yang belum selesai
          </p>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase text-slate-500">
            Tingkat Penyelesaian
          </div>
          <div className="mt-1 text-2xl font-black text-blue-600">
            {missions.length > 0
              ? Math.round((completedCount / missions.length) * 100)
              : 0}
            %
          </div>
          <div className="mt-2">
            <ProgressBar
              percentage={
                missions.length > 0
                  ? (completedCount / missions.length) * 100
                  : 0
              }
              variant="blue"
              size="sm"
            />
          </div>
        </Card>
      </div>

      {/* ─── Daftar Target Pembelajaran ────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Daftar Target Pembelajaran Finansial
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm font-semibold">Memuat daftar misi...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {missions.map((mission) => {
              const progressPercentage = Math.min(
                100,
                Math.round((mission.currentCount / mission.targetCount) * 100)
              );

              return (
                <Card
                  key={mission.id}
                  className={`flex flex-col justify-between ${
                    mission.isCompleted ? "border-emerald-200 bg-emerald-50/20" : ""
                  }`}
                >
                  <div>
                    <CardHeader>
                      <CardTitle className="text-base">{mission.title}</CardTitle>
                      <Badge variant="xp">+{mission.xpReward} XP</Badge>
                    </CardHeader>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {mission.description}
                    </p>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                        <span>Progres Target</span>
                        <span>
                          {mission.currentCount} / {mission.targetCount}
                        </span>
                      </div>
                      <ProgressBar
                        percentage={progressPercentage}
                        variant={mission.isCompleted ? "emerald" : "xp"}
                        size="md"
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {mission.isCompleted ? (
                      <span className="flex items-center gap-1 font-bold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Misi Selesai
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">
                        Sedang Berjalan
                      </span>
                    )}
                    <span className="text-slate-400 text-[11px]">
                      {progressPercentage}% tercapai
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Panduan & FAQ Literasi Keuangan ───────────────────── */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Panduan & FAQ Literasi Finansial
          </h2>
        </div>

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div key={idx} className="transition">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-2">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
