// tests/auth-security.test.ts — Pengujian Unit Keamanan Autentikasi & Validasi Input Zod
import test from "node:test";
import assert from "node:assert/strict";
import { signToken, verifyToken } from "../src/lib/jwt";
import { registerSchema } from "../src/server/validators/auth.schema";
import { createTransactionSchema } from "../src/server/validators/finance.schema";

test("Security & Zod Validation: Autentikasi dan Integritas Input", async (t) => {
  await t.test("JWT: signToken dan verifyToken bekerja dengan benar", async () => {
    const payload = {
      sub: "user-123",
      email: "test@finz.id",
      name: "User Penguji",
      level: 2,
    };

    const token = await signToken(payload, "1h");
    assert.strictEqual(typeof token, "string");
    assert.ok(token.length > 20);

    const decoded = await verifyToken(token);
    assert.ok(decoded !== null);
    assert.strictEqual(decoded.sub, "user-123");
    assert.strictEqual(decoded.email, "test@finz.id");
    assert.strictEqual(decoded.name, "User Penguji");
    assert.strictEqual(decoded.level, 2);
  });

  await t.test("JWT: verifyToken mengembalikan null untuk token palsu / rusak", async () => {
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.payload";
    const decoded = await verifyToken(fakeToken);
    assert.strictEqual(decoded, null);
  });

  await t.test("Zod Auth: Password wajib minimal 8 karakter dan kombinasi huruf & angka", () => {
    // Password hanya huruf (gagal)
    const resultNoNumber = registerSchema.safeParse({
      name: "Budi",
      email: "budi@email.com",
      password: "passwordtanpaangka",
    });
    assert.strictEqual(resultNoNumber.success, false);

    // Password hanya angka (gagal)
    const resultNoLetter = registerSchema.safeParse({
      name: "Budi",
      email: "budi@email.com",
      password: "12345678",
    });
    assert.strictEqual(resultNoLetter.success, false);

    // Password kurang dari 8 karakter (gagal)
    const resultTooShort = registerSchema.safeParse({
      name: "Budi",
      email: "budi@email.com",
      password: "abc1",
    });
    assert.strictEqual(resultTooShort.success, false);

    // Password valid (sukses)
    const resultValid = registerSchema.safeParse({
      name: "Budi",
      email: "budi@email.com",
      password: "password123",
    });
    assert.strictEqual(resultValid.success, true);
  });

  await t.test("Zod Finance: Nominal transaksi bernilai 0 atau negatif ditolak", () => {
    const resultZero = createTransactionSchema.safeParse({
      type: "EXPENSE",
      category: "Makanan",
      amount: 0,
      description: "Makan siang",
      transactionDate: new Date().toISOString(),
    });
    assert.strictEqual(resultZero.success, false);

    const resultNegative = createTransactionSchema.safeParse({
      type: "EXPENSE",
      category: "Makanan",
      amount: -50000,
      description: "Makan siang",
      transactionDate: new Date().toISOString(),
    });
    assert.strictEqual(resultNegative.success, false);

    const resultValid = createTransactionSchema.safeParse({
      type: "EXPENSE",
      category: "Makanan",
      amount: 25000,
      description: "Makan siang",
      transactionDate: new Date().toISOString(),
    });
    assert.strictEqual(resultValid.success, true);
  });
});
