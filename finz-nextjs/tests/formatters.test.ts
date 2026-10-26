// tests/formatters.test.ts — Pengujian Unit Helper Serialisasi BigInt & Formatter Finansial
import test from "node:test";
import assert from "node:assert/strict";
import {
  bigIntToNumber,
  serializeBigInt,
  calculatePercentage,
  formatCurrency,
} from "../src/lib/formatters";

test("Formatters: Serialisasi BigInt & Format Finansial", async (t) => {
  await t.test("bigIntToNumber mengonversi BigInt ke Number dengan aman", () => {
    assert.strictEqual(bigIntToNumber(BigInt(10000000)), 10000000);
  });

  await t.test("bigIntToNumber melempar error jika nilai di luar MAX_SAFE_INTEGER", () => {
    const huge = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(100);
    assert.throws(() => bigIntToNumber(huge));
  });

  await t.test("serializeBigInt mengonversi BigInt dalam objek menjadi string JSON-safe", () => {
    const input = {
      id: "abc",
      amount: BigInt(500000),
      nested: {
        balance: BigInt(10000000),
        items: [BigInt(100), BigInt(200)],
      },
    };

    const output = serializeBigInt(input);

    assert.strictEqual(typeof output.amount, "string");
    assert.strictEqual(output.amount, "500000");
    assert.strictEqual(typeof output.nested.balance, "string");
    assert.strictEqual(output.nested.balance, "10000000");
    assert.deepStrictEqual(output.nested.items, ["100", "200"]);
  });

  await t.test("formatCurrency menghasilkan format Rupiah dengan benar", () => {
    const formatted = formatCurrency(10000000);
    assert.match(formatted, /10\.000\.000/);
  });

  await t.test("calculatePercentage menghitung persentase dengan aman dan membatasi 100%", () => {
    assert.strictEqual(calculatePercentage(50, 100), 50);
    assert.strictEqual(calculatePercentage(150, 100), 100); // capped at 100%
    assert.strictEqual(calculatePercentage(0, 100), 0);
    assert.strictEqual(calculatePercentage(50, 0), 0); // division by zero handled
  });
});
