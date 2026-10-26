// src/app/api/auth/register/route.ts — POST /api/auth/register
// Mendaftarkan akun baru, menginisialisasi saldo virtual Rp 10.000.000, Level 1, XP 0

import { type NextRequest } from "next/server";
import { registerSchema } from "@/server/validators/auth.schema";
import { authService } from "@/server/services/auth.service";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { AUTH_COOKIE_NAME } from "@/server/utils/auth-session";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const validatedData = registerSchema.parse(json);

    const { user, token } = await authService.register(validatedData);

    const response = apiResponse(
      { user, token },
      "Registrasi akun FinZ berhasil. Selamat datang!",
      undefined,
      201
    );

    // Set cookie HttpOnly
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 jam
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
