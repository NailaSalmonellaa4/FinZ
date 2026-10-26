// tests/gamification.test.ts — Pengujian Unit Kalkulasi Gamifikasi (Level, XP, Spam Limit)
import test from "node:test";
import assert from "node:assert/strict";
import { GamificationService } from "../src/server/services/gamification.service";

test("GamificationService: Formula Kenaikan Level (XP / 100 + 1)", async (t) => {
  const service = new GamificationService();

  await t.test("Akun baru dengan 0 XP harus berada di Level 1", () => {
    assert.strictEqual(service.calculateLevel(0), 1);
  });

  await t.test("50 XP masih berada di Level 1", () => {
    assert.strictEqual(service.calculateLevel(50), 1);
  });

  await t.test("99 XP masih berada di Level 1 (ambang batas bawah)", () => {
    assert.strictEqual(service.calculateLevel(99), 1);
  });

  await t.test("100 XP harus naik ke Level 2", () => {
    assert.strictEqual(service.calculateLevel(100), 2);
  });

  await t.test("150 XP masih berada di Level 2", () => {
    assert.strictEqual(service.calculateLevel(150), 2);
  });

  await t.test("299 XP masih berada di Level 3", () => {
    assert.strictEqual(service.calculateLevel(299), 3);
  });

  await t.test("300 XP harus naik ke Level 4", () => {
    assert.strictEqual(service.calculateLevel(300), 4);
  });

  await t.test("1000 XP harus berada di Level 11", () => {
    assert.strictEqual(service.calculateLevel(1000), 11);
  });

  await t.test("XP bernilai negatif harus tetap menghasilkan minimal Level 1", () => {
    assert.strictEqual(service.calculateLevel(-50), 1);
  });
});
