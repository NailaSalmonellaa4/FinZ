// src/app/(dashboard)/layout.tsx — Layout Utama Dashboard dengan Gamifikasi Header & Sidebar

import React from "react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/server/utils/auth-session";
import prisma from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { XpHeaderBar } from "@/components/layout/XpHeaderBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Ambil sesi autentikasi pengguna
  const authUser = await getAuthUser();
  if (!authUser) {
    redirect("/login");
  }

  // 2. Ambil data profil & gamifikasi terkini dari database
  const user = await prisma.user.findUnique({
    where: { id: authUser.sub },
    select: {
      name: true,
      level: true,
      xp: true,
      virtualBalance: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigasi Desktop */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Bar Gamifikasi (Level, XP, Saldo Virtual, Logout) */}
        <XpHeaderBar
          user={{
            name: user.name,
            level: user.level,
            xp: user.xp,
            virtualBalance: user.virtualBalance.toString(),
          }}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
