// src/app/api/investments/assets/route.ts — GET /api/investments/assets
// Mengambil katalog aset investasi edukasi simulasi

import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { investmentService } from "@/server/services/investment.service";

export async function GET() {
  try {
    const assets = await investmentService.getAssets();
    return apiResponse(assets, "Katalog aset investasi berhasil dimuat");
  } catch (error) {
    return handleApiError(error);
  }
}
