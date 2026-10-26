// src/app/api/dashboard/route.ts — GET /api/dashboard
// Agregasi seluruh indikator finansial dan gamifikasi untuk tampilan dashboard

import { type NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-session";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { dashboardService } from "@/server/services/dashboard.service";

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const data = await dashboardService.getDashboardData(authUser.sub);

    return apiResponse(data, "Data dashboard berhasil dimuat");
  } catch (error) {
    return handleApiError(error);
  }
}
