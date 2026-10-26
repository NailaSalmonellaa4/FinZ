// src/components/ui/ProgressBar.tsx — Animated Financial Progress Bar

import React from "react";

export interface ProgressBarProps {
  percentage: number;
  variant?: "blue" | "emerald" | "amber" | "rose" | "xp";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  percentage,
  variant = "blue",
  size = "md",
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  const variants = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    xp: "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 shadow-sm shadow-amber-500/30",
  };

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs font-semibold text-slate-600">
          <span>Progres</span>
          <span>{clamped.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-slate-100 ${sizes[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${variants[variant]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
