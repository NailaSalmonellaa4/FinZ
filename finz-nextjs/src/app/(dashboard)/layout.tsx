// src/app/(dashboard)/layout.tsx — Layout Utama Dashboard FinZ Quest RPG
import React from "react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/server/utils/auth-session";
import prisma from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";

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
    <div className="min-h-screen bg-[#F4F7FC]">
      {/* Sidebar Navigasi RPG Kiri */}
      <Sidebar
        user={{
          name: user.name,
          level: user.level,
          xp: user.xp,
          virtualBalance: user.virtualBalance.toString(),
        }}
      />

      {/* Main Content Area teroffset 280px di desktop */}
      <div className="pl-0 lg:pl-[280px] min-h-screen flex flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
