// src/server/validators/finance.schema.ts — Skema Validasi Zod untuk Transaksi, Anggaran, dan Tabungan
// Referensi: PRD.md Section 5.1 & AGENTS.md Section 3.3

import { z } from "zod";
import { TRANSACTION_CATEGORIES } from "@/types";

// ─── Skema Transaksi ──────────────────────────────────────

export const transactionTypeEnum = z.enum(["INCOME", "EXPENSE"], {
  required_error: "Tipe transaksi wajib diisi (INCOME atau EXPENSE)",
});

export const createTransactionSchema = z.object({
  type: transactionTypeEnum,
  category: z
    .string({ required_error: "Kategori wajib diisi" })
    .trim()
    .min(1, "Kategori tidak boleh kosong")
    .refine(
      (val) => (TRANSACTION_CATEGORIES as readonly string[]).includes(val),
      {
        message: `Kategori harus salah satu dari: ${TRANSACTION_CATEGORIES.join(", ")}`,
      }
    ),
  amount: z
    .union([z.number(), z.string()])
    .refine((val) => {
      const num = typeof val === "string" ? Number(val) : val;
      return !isNaN(num) && num > 0 && Number.isInteger(num);
    }, "Nominal transaksi harus berupa bilangan bulat positif lebih besar dari 0")
    .transform((val) => BigInt(typeof val === "string" ? val : Math.floor(val))),
  description: z
    .string({ required_error: "Deskripsi wajib diisi" })
    .trim()
    .min(1, "Deskripsi tidak boleh kosong")
    .max(255, "Deskripsi maksimal 255 karakter"),
  transactionDate: z
    .string({ required_error: "Tanggal transaksi wajib diisi" })
    .refine((val) => !isNaN(Date.parse(val)), "Format tanggal transaksi tidak valid")
    .transform((val) => new Date(val)),
});

export const queryTransactionSchema = z.object({
  month: z
    .string()
    .optional()
    .refine((val) => !val || (Number(val) >= 1 && Number(val) <= 12), "Bulan harus antara 1-12")
    .transform((val) => (val ? Number(val) : undefined)),
  year: z
    .string()
    .optional()
    .refine((val) => !val || Number(val) >= 2000, "Tahun tidak valid")
    .transform((val) => (val ? Number(val) : undefined)),
  category: z.string().optional(),
  type: transactionTypeEnum.optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, Number(val))) : 50)),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, Number(val)) : 1)),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type QueryTransactionInput = z.infer<typeof queryTransactionSchema>;

// ─── Skema Anggaran (Budgeting) ───────────────────────────

export const upsertBudgetSchema = z.object({
  category: z
    .string({ required_error: "Kategori anggaran wajib diisi" })
    .trim()
    .min(1, "Kategori tidak boleh kosong")
    .refine(
      (val) => (TRANSACTION_CATEGORIES as readonly string[]).includes(val),
      {
        message: `Kategori harus salah satu dari: ${TRANSACTION_CATEGORIES.join(", ")}`,
      }
    ),
  limitAmount: z
    .union([z.number(), z.string()])
    .refine((val) => {
      const num = typeof val === "string" ? Number(val) : val;
      return !isNaN(num) && num > 0 && Number.isInteger(num);
    }, "Batas anggaran harus berupa bilangan bulat positif lebih besar dari 0")
    .transform((val) => BigInt(typeof val === "string" ? val : Math.floor(val))),
  month: z
    .number({ required_error: "Bulan wajib diisi (1-12)" })
    .int()
    .min(1, "Bulan minimal 1")
    .max(12, "Bulan maksimal 12"),
  year: z
    .number({ required_error: "Tahun wajib diisi" })
    .int()
    .min(2020, "Tahun minimal 2020"),
});

export const queryBudgetSchema = z.object({
  month: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : new Date().getMonth() + 1)),
  year: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : new Date().getFullYear())),
});

export type UpsertBudgetInput = z.infer<typeof upsertBudgetSchema>;
export type QueryBudgetInput = z.infer<typeof queryBudgetSchema>;

// ─── Skema Target Tabungan (Savings Goals) ────────────────

export const createSavingsGoalSchema = z.object({
  title: z
    .string({ required_error: "Judul target tabungan wajib diisi" })
    .trim()
    .min(2, "Judul minimal 2 karakter")
    .max(100, "Judul maksimal 100 karakter"),
  targetAmount: z
    .union([z.number(), z.string()])
    .refine((val) => {
      const num = typeof val === "string" ? Number(val) : val;
      return !isNaN(num) && num > 0 && Number.isInteger(num);
    }, "Nominal target tabungan harus berupa bilangan bulat positif lebih besar dari 0")
    .transform((val) => BigInt(typeof val === "string" ? val : Math.floor(val))),
  targetDate: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Format tanggal target tidak valid")
    .transform((val) => (val ? new Date(val) : null)),
});

export const contributeSavingsSchema = z.object({
  amount: z
    .union([z.number(), z.string()])
    .refine((val) => {
      const num = typeof val === "string" ? Number(val) : val;
      return !isNaN(num) && num > 0 && Number.isInteger(num);
    }, "Nominal kontribusi harus berupa bilangan bulat positif lebih besar dari 0")
    .transform((val) => BigInt(typeof val === "string" ? val : Math.floor(val))),
});

export type CreateSavingsGoalInput = z.infer<typeof createSavingsGoalSchema>;
export type ContributeSavingsInput = z.infer<typeof contributeSavingsSchema>;
