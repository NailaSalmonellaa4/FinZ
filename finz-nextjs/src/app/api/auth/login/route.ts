// src/app/api/auth/login/route.ts — POST /api/auth/login
// Memvalidasi email & password, mengembalikan token JWT dan profil pengguna

import { type NextRequest } from "next/server";
import { loginSchema } from "@/server/validators/auth.schema";
import { authService } from "@/server/services/auth.service";
import { apiResponse, handleApiError } from "@/server/utils/api-response";
import { AUTH_COOKIE_NAME } from "@/server/utils/auth-session";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const validatedData = loginSchema.parse(json);

    const { user, token } = await authService.login(validatedData);

    const response = apiResponse(
      { user, token },
      "Login berhasil. Selamat datang kembali!"
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
