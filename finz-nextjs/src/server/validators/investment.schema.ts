// src/server/validators/investment.schema.ts — Skema Validasi Zod Simulasi Investasi Virtual
// Referensi: PRD.md Section 5.1 G & ARCHITECTURE.md Section 4

import { z } from "zod";

export const tradeAssetSchema = z.object({
  assetId: z
    .string({ required_error: "ID aset investasi wajib diisi" })
    .uuid("Format ID aset tidak valid"),
  units: z
    .union([z.number(), z.string()])
    .refine((val) => {
      const num = typeof val === "string" ? Number(val) : val;
      return !isNaN(num) && num > 0;
    }, "Jumlah unit harus lebih besar dari 0")
    .transform((val) => {
      const num = typeof val === "string" ? Number(val) : val;
      // Bulatkan maksimal 4 angka di belakang koma untuk presisi unit
      return Math.round(num * 10000) / 10000;
    }),
});

export const queryHistorySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, Number(val)) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, Number(val))) : 20)),
});

export type TradeAssetInput = z.infer<typeof tradeAssetSchema>;
export type QueryHistoryInput = z.infer<typeof queryHistorySchema>;
