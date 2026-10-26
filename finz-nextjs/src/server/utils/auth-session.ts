// src/server/utils/auth-session.ts — Helper Ekstraksi & Verifikasi Sesi JWT di Server / Route Handlers
// Referensi: AGENTS.md Section 4 Rule 3 (Never trust userId from body/query)

import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { verifyToken, type AuthTokenPayload } from "@/lib/jwt";
import { UnauthorizedError } from "./api-response";

export const AUTH_COOKIE_NAME = "finz_token";

/**
 * Mengekstrak token mentah dari request:
 * 1. Header `Authorization: Bearer <token>`
 * 2. Cookie `finz_token` dari request cookies
 * 3. Cookie `finz_token` dari next/headers cookies()
 */
export async function extractToken(req?: Request | NextRequest): Promise<string | null> {
  // 1. Cek dari Header Authorization
  if (req) {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      if (token) return token;
    }

    // 2. Cek dari cookie request jika berupa NextRequest
    if ("cookies" in req && typeof req.cookies?.get === "function") {
      const cookie = req.cookies.get(AUTH_COOKIE_NAME);
      if (cookie?.value) return cookie.value;
    }
  }

  // 3. Fallback: Cek dari Next.js 15 async cookies()
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(AUTH_COOKIE_NAME);
    if (cookie?.value) return cookie.value;
  } catch {
    // Dipanggil di luar konteks request Next.js yang memiliki cookies
  }

  return null;
}

/**
 * Mendapatkan data pengguna yang sedang login dari token JWT yang terverifikasi.
 * Mengembalikan null jika sesi tidak valid atau belum login.
 */
export async function getAuthUser(req?: Request | NextRequest): Promise<AuthTokenPayload | null> {
  // Jika middleware telah memvalidasi dan menyisipkan header internal
  if (req) {
    const headerUserId = req.headers.get("x-user-id");
    const headerUserEmail = req.headers.get("x-user-email");
    const headerUserName = req.headers.get("x-user-name");

    if (headerUserId && headerUserEmail && headerUserName) {
      return {
        sub: headerUserId,
        email: headerUserEmail,
        name: headerUserName,
      };
    }
  }

  const token = await extractToken(req);
  if (!token) return null;

  return await verifyToken(token);
}

/**
 * Memastikan bahwa request memiliki sesi pengguna yang valid.
 * Melempar UnauthorizedError (HTTP 401) jika sesi tidak ditemukan.
 */
export async function requireAuth(req?: Request | NextRequest): Promise<AuthTokenPayload> {
  const user = await getAuthUser(req);
  if (!user) {
    throw new UnauthorizedError("Sesi Anda tidak valid atau telah berakhir. Silakan login kembali.");
  }
  return user;
}
