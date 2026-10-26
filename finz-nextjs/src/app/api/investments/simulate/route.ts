// src/app/api/investments/simulate/route.ts — POST /api/investments/simulate
// Simulasi fluktuasi acak harga aset contoh (±1% s/d ±5%) untuk tujuan edukasi

import { type NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-session";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { investmentService } from "@/server/services/investment.service";

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const updates = await investmentService.simulatePriceFluctuation();

    return apiResponse(
      updates,
      "Fluktuasi harga pasar contoh berhasil disimulasikan (±1% s/d ±5%)"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
