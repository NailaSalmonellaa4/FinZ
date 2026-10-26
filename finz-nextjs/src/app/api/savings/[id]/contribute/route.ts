// src/app/api/savings/[id]/contribute/route.ts — POST /api/savings/[id]/contribute
// Menambahkan nominal tabungan ke target tertentu

import { type NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-session";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { savingsService } from "@/server/services/savings.service";
import { contributeSavingsSchema } from "@/server/validators/finance.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const authUser = await requireAuth(request);
    const { id } = await context.params;

    const json = await request.json();
    const validatedData = contributeSavingsSchema.parse(json);

    const { goal, meta } = await savingsService.contributeToGoal(
      authUser.sub,
      id,
      validatedData
    );

    const message = meta.goalCompleted
      ? "Selamat! Target tabungan Anda telah tercapai 100%! Bonus XP diberikan."
      : "Kontribusi tabungan berhasil dicatat";

    return apiResponse(goal, message, meta);
  } catch (error) {
    return handleApiError(error);
  }
}
