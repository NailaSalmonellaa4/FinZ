// src/components/layout/DashboardShell.tsx — Shell Interaktif Dashboard dengan Sidebar Collapsible
"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export interface DashboardShellProps {
  user: {
    name: string;
    level: number;
    xp: number;
    virtualBalance: string;
  };
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ambil preferensi minimize dari localStorage
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("finz_sidebar_collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  function handleToggleCollapse() {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("finz_sidebar_collapsed", String(next));
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#F4F7FC]">
      {/* Sidebar Navigasi Kiri (Mendukung Expand / Minimize) */}
      <Sidebar
        user={user}
        isCollapsed={isMounted ? isCollapsed : false}
        onToggle={handleToggleCollapse}
      />

      {/* Main Content Area dengan margin transisi halus */}
      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          isMounted && isCollapsed
            ? "pl-0 lg:pl-[76px]"
            : "pl-0 lg:pl-[260px]"
        }`}
      >
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
