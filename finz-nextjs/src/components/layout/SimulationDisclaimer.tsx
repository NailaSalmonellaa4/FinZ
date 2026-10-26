// src/components/layout/SimulationDisclaimer.tsx — Banner Disclaimer Edukasi & Simulasi
// Wajib ditampilkan di setiap halaman investasi (AGENTS.md Section 1)

import React from "react";
import { ShieldAlert } from "lucide-react";

export function SimulationDisclaimer({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-amber-900 shadow-sm ${className}`}
      role="alert"
    >
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-200/80 text-amber-800">
        <ShieldAlert className="h-4 w-4" />
      </div>
      <div className="text-xs sm:text-sm">
        <h4 className="font-bold tracking-tight text-amber-950">
          Mode Simulasi Edukasi Literasi Keuangan
        </h4>
        <p className="mt-0.5 text-amber-800/95 leading-relaxed">
          FinZ adalah sarana edukasi dan bukan platform investasi nyata. Seluruh
          saldo, instrumen aset, dan harga per unit yang tertera murni bersifat
          virtual untuk tujuan pembelajaran mekanisme portofolio. Tidak ada uang
          sungguhan yang didepositkan atau ditarik.
        </p>
      </div>
    </div>
  );
}
