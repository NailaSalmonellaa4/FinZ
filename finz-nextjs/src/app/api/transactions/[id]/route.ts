// src/app/api/transactions/[id]/route.ts — DELETE /api/transactions/[id]
// Menghapus data transaksi dengan verifikasi ketat kepemilikan data (anti-IDOR)

import { type NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-session";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { transactionService } from "@/server/services/transaction.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const authUser = await requireAuth(request);
    const { id } = await context.params;

    const result = await transactionService.deleteTransaction(authUser.sub, id);
    return apiResponse(null, result.message);
  } catch (error) {
    return handleApiError(error);
  }
}
