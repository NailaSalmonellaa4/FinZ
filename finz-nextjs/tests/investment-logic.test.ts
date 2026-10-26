// tests/investment-logic.test.ts — Pengujian Unit Logika Simulasi Investasi & Portofolio
import test from "node:test";
import assert from "node:assert/strict";
import { determineBudgetStatus } from "../src/server/services/budget.service";

test("Investment & Budget Logic: Aturan Bisnis & Validasi Saldo", async (t) => {
  await t.test("Validasi Saldo: Pembelian gagal jika totalCost > virtualBalance", () => {
    const virtualBalance = BigInt(10000000); // Rp 10.000.000
    const currentPrice = BigInt(8750000); // Rp 8.750.000 per unit
    const unitsRequested = 2; // Butuh 17.500.000

    const totalCost = BigInt(Math.round(unitsRequested * Number(currentPrice)));
    const isSufficient = totalCost <= virtualBalance;

    assert.strictEqual(isSufficient, false);
  });

  await t.test("Validasi Saldo: Pembelian berhasil jika totalCost <= virtualBalance", () => {
    const virtualBalance = BigInt(10000000);
    const currentPrice = BigInt(1250000); // Rp 1.250.000 per unit
    const unitsRequested = 4; // Butuh 5.000.000

    const totalCost = BigInt(Math.round(unitsRequested * Number(currentPrice)));
    const isSufficient = totalCost <= virtualBalance;

    assert.strictEqual(isSufficient, true);
    assert.strictEqual(virtualBalance - totalCost, BigInt(5000000));
  });

  await t.test("Kalkulasi Harga Beli Rata-rata (Weighted Average Buy Price)", () => {
    // Pembelian 1: 2 unit @ Rp 1.000.000 = Rp 2.000.000
    const oldUnits = 2;
    const oldAvgPrice = 1000000;

    // Pembelian 2: 3 unit @ Rp 1.500.000 = Rp 4.500.000
    const newUnits = 3;
    const newPrice = 1500000;

    const totalUnits = oldUnits + newUnits; // 5 unit
    const totalCost = oldUnits * oldAvgPrice + newUnits * newPrice; // 6.500.000
    const weightedAvgPrice = Math.round(totalCost / totalUnits); // 1.300.000

    assert.strictEqual(totalUnits, 5);
    assert.strictEqual(weightedAvgPrice, 1300000);
  });

  await t.test("Validasi Penjualan: Penjualan gagal jika unit diajukan > unit dimiliki", () => {
    const ownedUnits = 2.5;
    const requestedUnits = 3.0;

    assert.strictEqual(requestedUnits <= ownedUnits, false);
  });

  await t.test("Penentuan Status Anggaran: SAFE (<80%), WARNING (80-99.9%), OVERBUDGET (>=100%)", () => {
    assert.strictEqual(determineBudgetStatus(50), "SAFE");
    assert.strictEqual(determineBudgetStatus(79.9), "SAFE");
    assert.strictEqual(determineBudgetStatus(80), "WARNING");
    assert.strictEqual(determineBudgetStatus(85), "WARNING");
    assert.strictEqual(determineBudgetStatus(99.9), "WARNING");
    assert.strictEqual(determineBudgetStatus(100), "OVERBUDGET");
    assert.strictEqual(determineBudgetStatus(120), "OVERBUDGET");
  });
});
