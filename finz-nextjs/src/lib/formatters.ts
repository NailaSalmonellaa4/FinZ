// src/lib/formatters.ts — Helper Format Mata Uang, Tanggal, dan Serialisasi BigInt
// Referensi: AGENTS.md Section 2.4 — Monetary Types harus di-serialize sebelum JSON response

/**
 * Mengonversi BigInt ke Number secara aman.
 * Melempar error jika nilai melebihi batas Number.MAX_SAFE_INTEGER.
 */
export function bigIntToNumber(value: bigint): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) {
    throw new Error(
      `BigInt value ${value.toString()} exceeds safe integer range for Number conversion`
    );
  }
  return Number(value);
}

/**
 * Mengonversi BigInt ke string terformat angka.
 */
export function bigIntToString(value: bigint): string {
  return value.toString();
}

/**
 * Memformat angka (Number atau BigInt) ke format mata uang Rupiah Indonesia.
 * Contoh: 10000000 → "Rp 10.000.000"
 */
export function formatCurrency(value: bigint | number): string {
  const numValue = typeof value === "bigint" ? bigIntToNumber(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}

/**
 * Memformat tanggal ke format Indonesia (dd MMMM yyyy).
 * Contoh: "26 Oktober 2026"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Memformat tanggal ke format singkat Indonesia (dd/MM/yyyy).
 * Contoh: "26/10/2026"
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/**
 * Serialisasi objek yang mengandung BigInt menjadi objek JSON-safe.
 * Mengonversi semua field BigInt menjadi string secara rekursif.
 */
export function serializeBigInt<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "bigint") {
    return obj.toString() as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => serializeBigInt(item)) as unknown as T;
  }

  if (typeof obj === "object" && obj instanceof Date) {
    return obj as T;
  }

  if (typeof obj === "object") {
    const serialized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      serialized[key] = serializeBigInt(value);
    }
    return serialized as T;
  }

  return obj;
}

/**
 * Memformat angka dalam format compact (contoh: 10M, 1.5JT).
 */
export function formatCompactNumber(value: bigint | number): string {
  const numValue = typeof value === "bigint" ? bigIntToNumber(value) : value;
  if (numValue >= 1_000_000_000) {
    return `${(numValue / 1_000_000_000).toFixed(1)}M`;
  }
  if (numValue >= 1_000_000) {
    return `${(numValue / 1_000_000).toFixed(1)}JT`;
  }
  if (numValue >= 1_000) {
    return `${(numValue / 1_000).toFixed(1)}RB`;
  }
  return numValue.toString();
}

/**
 * Menghitung persentase dengan presisi 2 desimal.
 */
export function calculatePercentage(current: bigint | number, target: bigint | number): number {
  const currentNum = typeof current === "bigint" ? bigIntToNumber(current) : current;
  const targetNum = typeof target === "bigint" ? bigIntToNumber(target) : target;

  if (targetNum === 0) return 0;

  return Math.min(100, Math.round((currentNum / targetNum) * 10000) / 100);
}
