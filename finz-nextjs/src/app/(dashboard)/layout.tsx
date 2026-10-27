// src/app/(dashboard)/layout.tsx — Layout Utama Dashboard FinZ Quest RPG
import React from "react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/server/utils/auth-session";
import prisma from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";

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

  // 2. Ambil data profil & gamifikasi terkini dari database MySQL
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
    <DashboardShell
      user={{
        name: user.name,
        level: user.level,
        xp: user.xp,
        virtualBalance: user.virtualBalance.toString(),
      }}
    >
      {children}
    </DashboardShell>
  );
}
