// src/app/api/auth/logout/route.ts — POST /api/auth/logout
// Menghapus cookie finz_token dan mengakhiri sesi

import { apiResponse } from "@/server/utils/api-response";
import { AUTH_COOKIE_NAME } from "@/server/utils/auth-session";

export async function POST() {
  const response = apiResponse(null, "Anda telah berhasil keluar dari akun.");

  // Hapus cookie dengan mengatur maxAge = 0
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
