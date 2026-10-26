// src/app/api/savings/route.ts — GET & POST /api/savings
// Pembuatan target tabungan baru dan pemantauan daftar tabungan aktif

import { type NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-session";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { savingsService } from "@/server/services/savings.service";
import { createSavingsGoalSchema } from "@/server/validators/finance.schema";

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const result = await savingsService.getSavingsGoals(authUser.sub);

    return apiResponse(result, "Daftar target tabungan berhasil dimuat");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);

    const json = await request.json();
    const validatedData = createSavingsGoalSchema.parse(json);

    const { goal, meta } = await savingsService.createSavingsGoal(
      authUser.sub,
      validatedData
    );

    return apiResponse(goal, "Target tabungan berhasil dibuat", meta, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
