// src/app/api/gamification/mission/route.ts — Klaim Hadiah Misi Harian ke Database
import { getAuthUser } from "@/server/utils/auth-session";
import { gamificationService } from "@/server/services/gamification.service";
import { apiResponse, apiError } from "@/server/utils/api-response";

export async function POST() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return apiError("Sesi autentikasi tidak valid atau telah berakhir", 401);
    }

    // Berikan +10 XP ke database MySQL secara persisten
    const result = await gamificationService.awardXp(authUser.sub, 10);

    return apiResponse(
      {
        xpGained: result.xpGained,
        currentXp: result.currentXp,
        currentLevel: result.currentLevel,
        leveledUp: result.leveledUp,
      },
      "Hadiah misi harian berhasil diklaim!",
      {
        xpGained: result.xpGained,
        leveledUp: result.leveledUp,
        currentLevel: result.currentLevel,
      }
    );
  } catch (error) {
    console.error("Gagal klaim misi harian:", error);
    return apiError("Gagal memproses klaim misi ke database", 500);
  }
}
