// src/middleware.ts — Edge Runtime Middleware untuk Proteksi Rute & Verifikasi JWT
// Referensi: AGENTS.md Section 2.5 & PRD.md Section 5.1

import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/server/utils/auth-session";

// Prefix rute halaman yang wajib terautentikasi
const PROTECTED_PAGE_PREFIXES = [
  "/dashboard",
  "/transactions",
  "/budgets",
  "/savings",
  "/investments",
  "/missions",
];

// Endpoint API yang wajib terautentikasi
const PROTECTED_API_PREFIXES = [
  "/api/dashboard",
  "/api/transactions",
  "/api/budgets",
  "/api/savings",
  "/api/investments",
  "/api/missions",
  "/api/auth/me",
];

// Halaman autentikasi publik (jika sudah login, dialihkan ke /dashboard)
const AUTH_PAGES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ekstrak token dari Cookie HttpOnly atau Header Authorization
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7).trim()
      : null;

  const rawToken = cookieToken || bearerToken;

  // 2. Verifikasi token menggunakan Jose (Edge-compatible)
  const authPayload = rawToken ? await verifyToken(rawToken) : null;
  const isAuthenticated = authPayload !== null;

  // 3. Tangani Rute API Terproteksi
  const isProtectedApi = PROTECTED_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtectedApi) {
    if (!isAuthenticated) {
      return NextResponse.json(
        {
          success: false,
          message: "Autentikasi gagal: Sesi Anda tidak valid atau telah berakhir.",
          data: null,
        },
        { status: 401 }
      );
    }

    // Teruskan header identitas ke downstream Route Handler
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", authPayload.sub);
    requestHeaders.set("x-user-email", authPayload.email);
    requestHeaders.set("x-user-name", authPayload.name);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 4. Tangani Halaman UI Terproteksi
  const isProtectedPage = PROTECTED_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtectedPage) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Teruskan header identitas jika dibutuhkan di Server Components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", authPayload.sub);
    requestHeaders.set("x-user-email", authPayload.email);
    requestHeaders.set("x-user-name", authPayload.name);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 5. Tangani Halaman Login & Register (Jika sudah login, redirect ke /dashboard)
  const isAuthPage = AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );

  if (isAuthPage && isAuthenticated) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Konfigurasi Matcher: Jalankan middleware hanya pada rute yang relevan
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ or public static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
