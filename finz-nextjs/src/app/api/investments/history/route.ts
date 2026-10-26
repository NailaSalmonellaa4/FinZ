// src/app/api/investments/history/route.ts — GET /api/investments/history
// Mengambil daftar riwayat seluruh transaksi simulasi investasi

import { type NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-session";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { investmentService } from "@/server/services/investment.service";
import { queryHistorySchema } from "@/server/validators/investment.schema";

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const query = queryHistorySchema.parse({
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    const result = await investmentService.getHistory(authUser.sub, query);
    return apiResponse(result, "Riwayat transaksi investasi berhasil dimuat");
  } catch (error) {
    return handleApiError(error);
  }
}
