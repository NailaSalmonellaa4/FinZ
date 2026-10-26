// prisma/seed.ts — Script Seeding Katalog Aset Contoh & Daftar Misi Awal
// Referensi: TASK-03, ARCHITECTURE.md Section 3
// Jalankan: npm run db:seed

import { PrismaClient, MissionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeding database FinZ...\n");

  // ─── Seed 4 Aset Investasi Simulasi Contoh ────────────────
  console.log("📊 Membuat katalog aset investasi simulasi...");

  const assets = [
    {
      code: "RDPU-EDU",
      name: "Reksa Dana Pasar Uang Edukasi",
      category: "Reksa Dana",
      riskProfile: "Rendah",
      currentPrice: BigInt(1250000), // Rp 1.250.000 per unit
      description:
        "Instrumen simulasi reksa dana pasar uang dengan risiko rendah. " +
        "Cocok untuk belajar konsep investasi konservatif dan likuiditas tinggi. " +
        "Harga contoh ini tidak mencerminkan produk investasi nyata.",
    },
    {
      code: "RDPT-EDU",
      name: "Reksa Dana Pendapatan Tetap Edukasi",
      category: "Reksa Dana",
      riskProfile: "Sedang",
      currentPrice: BigInt(2500000), // Rp 2.500.000 per unit
      description:
        "Instrumen simulasi reksa dana pendapatan tetap (obligasi) dengan risiko sedang. " +
        "Membantu memahami konsep kupon, jatuh tempo, dan volatilitas moderat. " +
        "Harga contoh ini tidak mencerminkan produk investasi nyata.",
    },
    {
      code: "SAHAM-EDU",
      name: "Saham Bluechip Edukasi",
      category: "Saham Edukasi",
      riskProfile: "Tinggi",
      currentPrice: BigInt(8750000), // Rp 8.750.000 per unit (lot)
      description:
        "Instrumen simulasi saham perusahaan besar (bluechip) dengan risiko tinggi. " +
        "Ideal untuk belajar konsep capital gain, dividen, dan fluktuasi harga pasar. " +
        "Harga contoh ini tidak mencerminkan saham perusahaan nyata di bursa efek.",
    },
    {
      code: "EMAS-EDU",
      name: "Emas Digital Edukasi",
      category: "Emas Virtual",
      riskProfile: "Sedang",
      currentPrice: BigInt(1050000), // Rp 1.050.000 per gram
      description:
        "Instrumen simulasi investasi emas digital dengan risiko sedang. " +
        "Membantu memahami konsep safe haven asset dan lindung nilai (hedging) terhadap inflasi. " +
        "Harga contoh ini tidak mencerminkan harga emas dunia aktual.",
    },
  ];

  for (const asset of assets) {
    const upserted = await prisma.virtualAsset.upsert({
      where: { code: asset.code },
      update: {
        name: asset.name,
        category: asset.category,
        riskProfile: asset.riskProfile,
        currentPrice: asset.currentPrice,
        description: asset.description,
      },
      create: asset,
    });
    console.log(`  ✅ ${upserted.code} — ${upserted.name}`);
  }

  // ─── Seed 5 Misi Pemula ───────────────────────────────────
  console.log("\n🎯 Membuat daftar misi pemula...");

  const missions = [
    {
      title: "Pencatat Pemula",
      description:
        "Catat 5 transaksi keuangan pertamamu (pemasukan atau pengeluaran) " +
        "untuk mulai membangun kebiasaan pencatatan yang konsisten.",
      missionType: MissionType.RECORD_TRANSACTION,
      targetCount: 5,
      xpReward: 50,
    },
    {
      title: "Pencatat Rajin",
      description:
        "Catat 20 transaksi keuangan untuk membuktikan konsistensimu " +
        "dalam memantau arus kas harian.",
      missionType: MissionType.RECORD_TRANSACTION,
      targetCount: 20,
      xpReward: 100,
    },
    {
      title: "Perencana Anggaran",
      description:
        "Buat 3 kategori anggaran bulanan pertamamu. " +
        "Mulai dari kategori Makanan, Transportasi, dan Hiburan untuk mengontrol pengeluaran.",
      missionType: MissionType.CREATE_BUDGET,
      targetCount: 3,
      xpReward: 75,
    },
    {
      title: "Penabung Cerdas",
      description:
        "Buat 2 target tabungan dan mulai alokasikan dana secara bertahap. " +
        "Tabungan membantu mewujudkan tujuan keuanganmu!",
      missionType: MissionType.CREATE_SAVINGS,
      targetCount: 2,
      xpReward: 75,
    },
    {
      title: "Investor Pemula",
      description:
        "Lakukan 3 transaksi simulasi investasi (beli atau jual aset virtual) " +
        "untuk memahami mekanisme dasar perdagangan aset tanpa risiko.",
      missionType: MissionType.SIMULATE_INVESTMENT,
      targetCount: 3,
      xpReward: 100,
    },
  ];

  for (const mission of missions) {
    // Gunakan combinasi title + missionType sebagai identifier unik (tidak ada @unique di schema)
    const existing = await prisma.mission.findFirst({
      where: {
        title: mission.title,
        missionType: mission.missionType,
      },
    });

    if (existing) {
      await prisma.mission.update({
        where: { id: existing.id },
        data: {
          description: mission.description,
          targetCount: mission.targetCount,
          xpReward: mission.xpReward,
        },
      });
      console.log(`  🔄 ${mission.title} (diperbarui)`);
    } else {
      await prisma.mission.create({ data: mission });
      console.log(`  ✅ ${mission.title}`);
    }
  }

  console.log("\n🎉 Seeding selesai! Database FinZ siap digunakan.");
  console.log(`   📊 ${assets.length} aset investasi simulasi`);
  console.log(`   🎯 ${missions.length} misi pemula`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
