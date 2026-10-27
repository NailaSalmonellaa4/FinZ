// src/components/ui/Select.tsx — Komponen Dropdown Kustom FinZ Quest
// Menghilangkan tampilan default browser dan menggunakan styling modern sesuai tema RPG

import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  sizeVariant?: "sm" | "md" | "lg";
  options?: SelectOption[];
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      sizeVariant = "md",
      options,
      children,
      className = "",
      containerClassName = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Ukuran varian
    const sizeClasses = {
      sm: "py-1.5 pl-3 pr-8 text-xs font-semibold",
      md: "py-2.5 pl-3.5 pr-10 text-sm font-medium",
      lg: "py-3 pl-4 pr-11 text-base font-medium",
    }[sizeVariant];

    const iconPaddingClass = icon
      ? {
          sm: "pl-8",
          md: "pl-9",
          lg: "pl-11",
        }[sizeVariant]
      : "";

    return (
      <div className={`relative flex flex-col ${containerClassName}`}>
        {label && (
          <label className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            {label}
          </label>
        )}

        <div className="relative group w-full">
          {/* Ikon Prefix opsional */}
          {icon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              {icon}
            </div>
          )}

          {/* Select Element dengan appearance-none */}
          <select
            ref={ref}
            disabled={disabled}
            className={`w-full appearance-none rounded-xl border bg-white shadow-xs transition-all duration-150 cursor-pointer ${sizeClasses} ${iconPaddingClass} ${
              error
                ? "border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                : "border-slate-200/90 text-slate-800 hover:border-slate-300 hover:bg-slate-50/50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
            } ${
              disabled
                ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-75"
                : ""
            } focus:outline-none ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="py-1.5 px-3 text-slate-800 bg-white"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {/* Custom Chevron Arrow (Menggantikan arrow bawaan OS) */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 group-focus-within:text-emerald-600 transition-colors">
            <ChevronDown
              className={sizeVariant === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}
            />
          </div>
        </div>

        {error && (
          <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
