// src/app/api/investments/sell/route.ts — POST /api/investments/sell
// Eksekusi simulasi penjualan unit aset dari portofolio

import { type NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-session";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { investmentService } from "@/server/services/investment.service";
import { tradeAssetSchema } from "@/server/validators/investment.schema";

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);

    const json = await request.json();
    const validatedData = tradeAssetSchema.parse(json);

    const { trade, meta } = await investmentService.sellAsset(
      authUser.sub,
      validatedData
    );

    return apiResponse(trade, "Penjualan unit aset simulasi berhasil dieksekusi", meta);
  } catch (error) {
    return handleApiError(error);
  }
}
