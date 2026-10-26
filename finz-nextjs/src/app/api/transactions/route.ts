// src/app/api/transactions/route.ts — GET & POST /api/transactions
// Pencatatan dan pengambilan riwayat pemasukan/pengeluaran

import { type NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-session";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { transactionService } from "@/server/services/transaction.service";
import {
  createTransactionSchema,
  queryTransactionSchema,
} from "@/server/validators/finance.schema";

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const query = queryTransactionSchema.parse({
      month: searchParams.get("month") || undefined,
      year: searchParams.get("year") || undefined,
      category: searchParams.get("category") || undefined,
      type: searchParams.get("type") || undefined,
      limit: searchParams.get("limit") || undefined,
      page: searchParams.get("page") || undefined,
    });

    const result = await transactionService.getTransactions(authUser.sub, query);
    return apiResponse(result, "Riwayat transaksi berhasil dimuat");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);

    const json = await request.json();
    const validatedData = createTransactionSchema.parse(json);

    const { transaction, meta } = await transactionService.createTransaction(
      authUser.sub,
      validatedData
    );

    return apiResponse(
      transaction,
      "Transaksi berhasil dicatat",
      meta,
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
