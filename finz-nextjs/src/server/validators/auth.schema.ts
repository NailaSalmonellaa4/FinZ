// src/server/validators/auth.schema.ts — Skema Validasi Zod Autentikasi Pengguna
// Referensi: PRD.md Section 5.1 & AGENTS.md Section 3.3

import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Nama wajib diisi" })
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string({ required_error: "Email wajib diisi" })
    .trim()
    .toLowerCase()
    .email("Format email tidak valid"),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(8, "Password minimal 8 karakter")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      "Password wajib mengandung kombinasi minimal satu huruf dan satu angka"
    ),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .trim()
    .toLowerCase()
    .email("Format email tidak valid"),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(1, "Password tidak boleh kosong"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
