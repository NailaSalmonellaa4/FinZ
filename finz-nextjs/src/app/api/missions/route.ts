// src/app/api/missions/route.ts — GET /api/missions
// Mengambil daftar misi edukasi & pencatatan beserta progres penyelesaian pengguna

import { type NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-session";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { gamificationService } from "@/server/services/gamification.service";

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const missions = await gamificationService.getUserMissions(authUser.sub);

    return apiResponse(missions, "Daftar misi berhasil dimuat");
  } catch (error) {
    return handleApiError(error);
  }
}
