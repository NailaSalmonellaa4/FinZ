// src/server/utils/api-response.ts — Standarisasi Respons JSON & Penanganan Error API
// Referensi: AGENTS.md Section 3.2 & ARCHITECTURE.md Section 2

import { NextResponse } from "next/server";
import { serializeBigInt } from "@/lib/formatters";
import type { ApiResponse, ApiResponseMeta } from "@/types";

/**
 * Mengembalikan respons JSON standar untuk status sukses (2xx).
 * Secara otomatis melakukan serialisasi rekursif terhadap BigInt agar aman di-encode JSON.
 */
export function apiResponse<T>(
  data: T,
  message = "Sukses",
  meta?: ApiResponseMeta,
  status = 200
): NextResponse<ApiResponse<T>> {
  const serializedData = serializeBigInt(data);

  const body: ApiResponse<T> = {
    success: true,
    message,
    data: serializedData,
    ...(meta && { meta }),
  };

  return NextResponse.json(body, { status });
}

/**
 * Mengembalikan respons JSON standar untuk status error (4xx / 5xx).
 */
export function apiError(
  message = "Terjadi kesalahan pada server",
  status = 500,
  errors?: unknown
): NextResponse<ApiResponse<null>> {
  const body: ApiResponse<null> & { errors?: unknown } = {
    success: false,
    message,
    data: null,
    ...(errors !== undefined && { errors }),
  };

  return NextResponse.json(body, { status });
}

/**
 * Custom error class untuk kesalahan validasi input (400 Bad Request)
 */
export class ValidationError extends Error {
  public status = 400;
  public details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

/**
 * Custom error class untuk kesalahan autentikasi (401 Unauthorized)
 */
export class UnauthorizedError extends Error {
  public status = 401;

  constructor(message = "Autentikasi gagal atau sesi telah berakhir") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Custom error class untuk penolakan akses (403 Forbidden)
 */
export class ForbiddenError extends Error {
  public status = 403;

  constructor(message = "Anda tidak memiliki izin untuk mengakses sumber daya ini") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Custom error class untuk data tidak ditemukan (404 Not Found)
 */
export class NotFoundError extends Error {
  public status = 404;

  constructor(message = "Data tidak ditemukan") {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Custom error class untuk konflik data seperti email duplikat (409 Conflict)
 */
export class ConflictError extends Error {
  public status = 409;

  constructor(message = "Data yang diajukan sudah ada") {
    super(message);
    this.name = "ConflictError";
  }
}

/**
 * Helper terpusat untuk menangani error dalam try-catch di Route Handlers.
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse<null>> {
  console.error("[API Error Handler]:", error);

  if (
    error instanceof ValidationError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    error instanceof NotFoundError ||
    error instanceof ConflictError
  ) {
    return apiError(
      error.message,
      error.status,
      "details" in error ? (error as ValidationError).details : undefined
    );
  }

  // Tangani Zod error jika tertangkap langsung
  if (error && typeof error === "object" && "issues" in error) {
    return apiError("Validasi input gagal", 400, (error as { issues: unknown }).issues);
  }

  const message =
    error instanceof Error ? error.message : "Terjadi kesalahan internal pada server";

  return apiError(message, 500);
}
