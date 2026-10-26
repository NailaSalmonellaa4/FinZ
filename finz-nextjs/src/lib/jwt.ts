// src/lib/jwt.ts — Fungsi Sign & Verify JWT Berbasis Jose (Edge Runtime Compatible)
// Referensi: AGENTS.md Section 2.5 & ARCHITECTURE.md Section 1

import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export interface AuthTokenPayload {
  sub: string; // User ID (UUID)
  email: string;
  name: string;
  level?: number;
}

const DEFAULT_SECRET = "finz-super-secret-jwt-key-min-32-characters-secure!";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Mendapatkan Secret Key yang di-encode ke Uint8Array untuk kompatibilitas Jose.
 */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  return new TextEncoder().encode(secret);
}

/**
 * Membuat dan menandatangani JSON Web Token (JWT) baru.
 */
export async function signToken(
  payload: AuthTokenPayload,
  expiresIn: string = JWT_EXPIRES_IN
): Promise<string> {
  const secret = getJwtSecret();

  const token = await new SignJWT({
    email: payload.email,
    name: payload.name,
    level: payload.level,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);

  return token;
}

/**
 * Memverifikasi integritas dan masa berlaku JWT token.
 * Mengembalikan payload token jika valid, atau null jika tidak valid / kadaluarsa.
 */
export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (!payload.sub || typeof payload.email !== "string" || typeof payload.name !== "string") {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      level: typeof payload.level === "number" ? payload.level : undefined,
    };
  } catch {
    // Token kedaluwarsa atau signature tidak valid
    return null;
  }
}
