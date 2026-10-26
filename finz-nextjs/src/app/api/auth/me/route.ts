// src/app/api/auth/me/route.ts — GET /api/auth/me
// Mengambil profil pengguna yang terautentikasi (IDOR-safe berbasis sesi JWT)

import { type NextRequest } from "next/server";
import { authService } from "@/server/services/auth.service";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { requireAuth } from "@/server/utils/auth-session";

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const profile = await authService.getProfile(authUser.sub);

    return apiResponse(profile, "Profil pengguna berhasil dimuat");
  } catch (error) {
    return handleApiError(error);
  }
}
