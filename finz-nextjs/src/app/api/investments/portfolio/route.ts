// src/app/api/investments/portfolio/route.ts — GET /api/investments/portfolio
// Mengambil ringkasan kepemilikan aset simulasi, nilai pasar, dan profit/loss

import { type NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-session";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { investmentService } from "@/server/services/investment.service";

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const portfolio = await investmentService.getPortfolio(authUser.sub);

    return apiResponse(portfolio, "Portofolio investasi berhasil dimuat");
  } catch (error) {
    return handleApiError(error);
  }
}
