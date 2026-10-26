// src/app/api/budgets/route.ts — GET & POST /api/budgets
// Pengaturan batas anggaran per kategori dan pemantauan pengeluaran aktual

import { type NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-session";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { budgetService } from "@/server/services/budget.service";
import { upsertBudgetSchema, queryBudgetSchema } from "@/server/validators/finance.schema";

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const query = queryBudgetSchema.parse({
      month: searchParams.get("month") || undefined,
      year: searchParams.get("year") || undefined,
    });

    const result = await budgetService.getBudgets(authUser.sub, query);
    return apiResponse(result, "Data anggaran bulanan berhasil dimuat");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);

    const json = await request.json();
    const validatedData = upsertBudgetSchema.parse(json);

    const { budget, meta } = await budgetService.upsertBudget(
      authUser.sub,
      validatedData
    );

    return apiResponse(budget, "Batas anggaran berhasil diperbarui", meta);
  } catch (error) {
    return handleApiError(error);
  }
}
