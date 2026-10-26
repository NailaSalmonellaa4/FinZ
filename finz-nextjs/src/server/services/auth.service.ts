// src/server/services/auth.service.ts — Logika Bisnis Autentikasi Pengguna
// Referensi: PRD.md Section 5.1 & AGENTS.md Section 3.2

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { ConflictError, NotFoundError, UnauthorizedError } from "@/server/utils/api-response";
import type { RegisterInput, LoginInput } from "@/server/validators/auth.schema";
import type { UserProfile } from "@/types";

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
const INITIAL_VIRTUAL_BALANCE = BigInt(10000000); // Rp 10.000.000 saldo awal simulasi

/**
 * Sanitasi data user agar tidak pernah membocorkan passwordHash.
 */
function sanitizeUser(user: {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  virtualBalance: bigint;
  createdAt: Date;
}): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    level: user.level,
    xp: user.xp,
    virtualBalance: user.virtualBalance.toString(),
    createdAt: user.createdAt.toISOString(),
  };
}

export class AuthService {
  /**
   * Mendaftarkan pengguna baru dengan inisialisasi Level 1, XP 0, dan Saldo Virtual Rp 10.000.000.
   */
  async register(input: RegisterInput): Promise<{ user: UserProfile; token: string }> {
    // 1. Cek duplikasi email
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictError("Email ini sudah terdaftar. Silakan gunakan email lain atau login.");
    }

    // 2. Hash password menggunakan bcrypt
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

    // 3. Simpan pengguna baru ke database
    const newUser = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        level: 1,
        xp: 0,
        virtualBalance: INITIAL_VIRTUAL_BALANCE,
      },
    });

    // 4. Buat JWT Token
    const token = await signToken({
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
      level: newUser.level,
    });

    return {
      user: sanitizeUser(newUser),
      token,
    };
  }

  /**
   * Memvalidasi kredensial pengguna dan mengembalikan JWT token.
   */
  async login(input: LoginInput): Promise<{ user: UserProfile; token: string }> {
    // 1. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedError("Email atau password yang Anda masukkan salah.");
    }

    // 2. Bandingkan password
    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Email atau password yang Anda masukkan salah.");
    }

    // 3. Buat JWT Token
    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      level: user.level,
    });

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  /**
   * Mengambil profil pengguna yang sedang login berdasarkan userId sesi JWT.
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("Data pengguna tidak ditemukan.");
    }

    return sanitizeUser(user);
  }
}

export const authService = new AuthService();
