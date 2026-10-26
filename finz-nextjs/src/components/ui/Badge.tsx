// src/components/ui/Badge.tsx — Reusable Badge Indicator

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "safe" | "warning" | "danger" | "xp" | "level" | "info" | "default";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: BadgeProps) {
  const base = "inline-flex items-center font-semibold rounded-full";

  const variants = {
    safe: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    danger: "bg-rose-100 text-rose-800 border border-rose-200",
    xp: "bg-amber-100 text-amber-900 border border-amber-300",
    level: "bg-blue-100 text-blue-900 border border-blue-200",
    info: "bg-indigo-100 text-indigo-900 border border-indigo-200",
    default: "bg-slate-100 text-slate-800 border border-slate-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  return (
    <span
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
