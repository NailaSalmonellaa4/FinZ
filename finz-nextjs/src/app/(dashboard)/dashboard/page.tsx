// src/app/(dashboard)/dashboard/page.tsx — Halaman Dashboard RPG FinZ Quest
import React from "react";
import { getAuthUser } from "@/server/utils/auth-session";
import { dashboardService } from "@/server/services/dashboard.service";
import { QuestDashboardView } from "@/components/dashboard/QuestDashboardView";

export default async function DashboardPage() {
  const authUser = await getAuthUser();
  if (!authUser) return null;

  const data = await dashboardService.getDashboardData(authUser.sub);

  return <QuestDashboardView data={data} />;
}
