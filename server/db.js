const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

const defaultWardrobeItems = [
  // Topi & Aksesoris Kepala
  { id: "hat-grad", name: "Topi Sarjana Finansial", type: "hat", price: 100, icon: "🎓", description: "Tanda kamu rajin belajar literasi keuangan!" },
  { id: "hat-crown", name: "Mahkota Sultan Cuan", type: "hat", price: 250, icon: "👑", description: "Mahkota berkilau untuk penabung disiplin." },
  { id: "hat-headset", name: "Cyber Headphone RGB", type: "hat", price: 150, icon: "🎧", description: "Headset futuristik sambil memantau aset." },
  { id: "hat-flower", name: "Bunga Sakura Kawaii", type: "hat", price: 80, icon: "🌸", description: "Hiasan bunga manis bikin karakter makin gemas." },

  // Baju / Outfit
  { id: "clothes-hoodie", name: "Cyber Hoodie Neon", type: "clothes", price: 120, icon: "🦺", description: "Hoodie warna lime favorit Gen Z.", color: "#84cc16" },
  { id: "clothes-suit", name: "Jas CEO Muda", type: "clothes", price: 220, icon: "👔", description: "Jas rapi ala pengusaha muda sukses.", color: "#3b82f6" },
  { id: "clothes-cape", name: "Jubah Pahlawan Emas", type: "clothes", price: 300, icon: "🥋", description: "Jubah berkibar tanda pembasmi boncos.", color: "#f59e0b" },
  { id: "clothes-tee", name: "Kaos Santai Anti-FOMO", type: "clothes", price: 60, icon: "👕", description: "Kaos santai buat nongkrong hemat.", color: "#ec4899" },

  // Aksesoris Tambahan
  { id: "acc-coin", name: "Koin Emas Melayang", type: "accessory", price: 120, icon: "🪙", description: "Koin emas keberuntungan melayang di sampingmu." },
  { id: "acc-shield", name: "Perisai Anti-Pinjol", type: "accessory", price: 180, icon: "🛡️", description: "Perisai pelindung dari godaan utang konsumtif." },
  { id: "acc-coffee", name: "Iced Matcha Latte", type: "accessory", price: 90, icon: "🍵", description: "Minuman favorit pelepas dahaga saat belajar." }
];

const emptyDb = {
  users: [],          // [{ id, name, email, passwordHash, createdAt, virtualBalance, xp, level, streak, lastActiveDate, soundEnabled, coins, inventory, equippedOutfit, mascot, bio }]
  transactions: [],   // [{ id, userId, type, category, description, amount, date, createdAt }]
  budgets: [],        // [{ id, userId, month, category, limitAmount, createdAt }]
  savingTargets: [],  // [{ id, userId, name, targetAmount, currentAmount, deadline, createdAt }]
  savingDeposits: [], // [{ id, userId, targetId, amount, note, date }]
  wardrobeItems: defaultWardrobeItems,
  investAssets: [     // global asset list (educational/virtual prices)
    {
      id: "asset-green",
      name: "🌿 EcoWarrior Fund",
      category: "Energi Hijau & Terbarukan",
      risk: "Sedang",
      riskColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      pricePerUnit: 15400,
      priceChange24h: 2.45,
      return1Y: 18.4,
      description: "Simulasi aset berisi perusahaan energi terbarukan. Harga adalah data contoh untuk pembelajaran.",
      holdings: [
        { symbol: "PGEO", name: "Geothermal Tbk", share: 40 },
        { symbol: "BREN", name: "Renewables Corp", share: 35 },
        { symbol: "ARKO", name: "Hydro Power", share: 25 }
      ],
      chartData: [
        { day: "Sen", price: 14800 }, { day: "Sel", price: 14950 }, { day: "Rab", price: 15100 },
        { day: "Kam", price: 15020 }, { day: "Jum", price: 15250 }, { day: "Sab", price: 15320 },
        { day: "Min", price: 15400 }
      ]
    },
    {
      id: "asset-tech",
      name: "⚡ Tech & AI Growth",
      category: "Teknologi & Kecerdasan Buatan",
      risk: "Tinggi",
      riskColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      pricePerUnit: 28500,
      priceChange24h: 4.12,
      return1Y: 34.2,
      description: "Simulasi aset teknologi global. Harga adalah data contoh untuk pembelajaran, bukan harga pasar nyata.",
      holdings: [
        { symbol: "NVDA-V", name: "Chip Tech (Virtual)", share: 45 },
        { symbol: "MSFT-V", name: "Cloud Giant (Virtual)", share: 30 },
        { symbol: "GOOGL-V", name: "AI Search (Virtual)", share: 25 }
      ],
      chartData: [
        { day: "Sen", price: 26200 }, { day: "Sel", price: 26800 }, { day: "Rab", price: 27150 },
        { day: "Kam", price: 27600 }, { day: "Jum", price: 27900 }, { day: "Sab", price: 28100 },
        { day: "Min", price: 28500 }
      ]
    },
    {
      id: "asset-consumer",
      name: "☕ Konsumsi & Ritel",
      category: "Kebutuhan Sehari-hari & Ritel",
      risk: "Rendah",
      riskColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      pricePerUnit: 11200,
      priceChange24h: 0.65,
      return1Y: 9.8,
      description: "Simulasi aset perusahaan F&B dan ritel. Harga contoh untuk pembelajaran konsep investasi.",
      holdings: [
        { symbol: "FOOD-V", name: "Mie & Snack Corp (Virtual)", share: 45 },
        { symbol: "MART-V", name: "Minimarket Tbk (Virtual)", share: 35 },
        { symbol: "BISK-V", name: "Biskuit & Wafer (Virtual)", share: 20 }
      ],
      chartData: [
        { day: "Sen", price: 11050 }, { day: "Sel", price: 11100 }, { day: "Rab", price: 11120 },
        { day: "Kam", price: 11180 }, { day: "Jum", price: 11150 }, { day: "Sab", price: 11190 },
        { day: "Min", price: 11200 }
      ]
    },
    {
      id: "asset-gold",
      name: "🪙 Emas Virtual 24K",
      category: "Logam Mulia (Simulasi)",
      risk: "Konservatif",
      riskColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      pricePerUnit: 138000,
      priceChange24h: 0.85,
      return1Y: 14.6,
      description: "Simulasi investasi emas. Bukan emas fisik sungguhan. Harga adalah data contoh untuk tujuan edukasi.",
      holdings: [
        { symbol: "GOLD-V", name: "Emas Virtual Terverifikasi", share: 100 }
      ],
      chartData: [
        { day: "Sen", price: 135000 }, { day: "Sel", price: 135800 }, { day: "Rab", price: 136200 },
        { day: "Kam", price: 136900 }, { day: "Jum", price: 137400 }, { day: "Sab", price: 137800 },
        { day: "Min", price: 138000 }
      ]
    }
  ],
  investPortfolios: [], // [{ id, userId, assetId, units, avgBuyPrice, totalInvested }]
  investHistory: [],    // [{ id, userId, assetId, assetName, type:'buy'|'sell', units, pricePerUnit, totalAmount, virtualBalanceBefore, virtualBalanceAfter, date }]
  quests: [             // template quests
    { id: "q-daily-1", title: "Catat 1 Transaksi Hari Ini", desc: "Latih kebiasaan mencatat uang masuk atau keluar setiap hari.", xpReward: 50, coinsReward: 30, type: "daily", targetCount: 1 },
    { id: "q-daily-2", title: "Cek Dashboard Keuangan", desc: "Buka dashboard dan periksa ringkasan keuangan bulanmu.", xpReward: 30, coinsReward: 20, type: "daily", targetCount: 1 },
    { id: "q-weekly-1", title: "Buat 1 Target Tabungan", desc: "Tentukan satu tujuan keuangan yang ingin kamu capai.", xpReward: 150, coinsReward: 80, type: "weekly", targetCount: 1 },
    { id: "q-weekly-2", title: "Coba Simulasi Investasi Virtual", desc: "Beli minimal 1 unit aset simulasi untuk belajar konsep investasi.", xpReward: 200, coinsReward: 100, type: "weekly", targetCount: 1 },
    { id: "q-weekly-3", title: "Atur Anggaran Bulanan", desc: "Buat minimal 1 batas anggaran untuk kategori pengeluaranmu.", xpReward: 120, coinsReward: 60, type: "weekly", targetCount: 1 }
  ],
  userQuests: [],       // [{ id, userId, questId, progress, completed, claimed, resetDate }]
  badges: [             // global badge definitions
    { id: "b-1", name: "🔥 Konsisten 7 Hari", desc: "Login aktif 7 hari berturut-turut.", requiredStreak: 7, rarity: "Rare", color: "from-amber-500 to-orange-600" },
    { id: "b-2", name: "📊 Budgeter Handal", desc: "Buat 3 anggaran bulanan berbeda.", rarity: "Common", color: "from-blue-500 to-cyan-600" },
    { id: "b-3", name: "🎯 Penabung Pemula", desc: "Selesaikan 1 target tabungan.", rarity: "Epic", color: "from-emerald-500 to-teal-600" },
    { id: "b-4", name: "📈 Investor Virtual", desc: "Lakukan 5 transaksi simulasi investasi.", rarity: "Rare", color: "from-purple-500 to-indigo-600" },
    { id: "b-5", name: "💎 Master Keuangan", desc: "Capai Level 5.", rarity: "Legendary", color: "from-pink-500 to-rose-600" }
  ],
  userBadges: []        // [{ userId, badgeId, unlockedAt }]
};

const LEVEL_THRESHOLDS = [
  { level: 1, title: "🌱 Pemula", minXp: 0, maxXp: 300 },
  { level: 2, title: "📖 Pelajar Finansial", minXp: 300, maxXp: 800 },
  { level: 3, title: "💡 Pengelola Cerdas", minXp: 800, maxXp: 1500 },
  { level: 4, title: "🚀 Investor Muda", minXp: 1500, maxXp: 2500 },
  { level: 5, title: "👑 Master Keuangan", minXp: 2500, maxXp: 99999 }
];

function getLevelInfo(xp) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXp) {
      const lvl = LEVEL_THRESHOLDS[i];
      return {
        level: lvl.level,
        title: lvl.title,
        minXp: lvl.minXp,
        maxXp: lvl.maxXp,
        xpToNext: Math.max(0, lvl.maxXp - xp)
      };
    }
  }
  return LEVEL_THRESHOLDS[0];
}

function getDb() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(emptyDb, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(emptyDb));
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    
    // Ensure all collections exist
    for (const key of Object.keys(emptyDb)) {
      if (!(key in parsed)) parsed[key] = Array.isArray(emptyDb[key]) ? [] : emptyDb[key];
    }

    // Ensure templates are populated if empty
    if (!parsed.investAssets || parsed.investAssets.length === 0) {
      parsed.investAssets = emptyDb.investAssets;
    }
    if (!parsed.quests || parsed.quests.length === 0) {
      parsed.quests = emptyDb.quests;
    }
    if (!parsed.badges || parsed.badges.length === 0) {
      parsed.badges = emptyDb.badges;
    }
    if (!parsed.wardrobeItems || parsed.wardrobeItems.length === 0) {
      parsed.wardrobeItems = defaultWardrobeItems;
    }

    // Ensure every user has coin, inventory, and outfit properties
    if (parsed.users && parsed.users.length > 0) {
      parsed.users.forEach(u => {
        if (u.coins === undefined) u.coins = 150;
        if (!u.inventory) u.inventory = ['clothes-hoodie'];
        if (!u.equippedOutfit) u.equippedOutfit = { hat: null, clothes: 'clothes-hoodie', accessory: null };
        if (!u.mascot) u.mascot = 'cat';
        if (!u.bio) u.bio = 'Belajar mengelola uang sejak dini 🚀';
      });
    }

    saveDb(parsed);
    return parsed;
  } catch (err) {
    console.error('DB read error:', err.message);
    return JSON.parse(JSON.stringify(emptyDb));
  }
}

function saveDb(data) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('DB write error:', err.message);
    return false;
  }
}

module.exports = { getDb, saveDb, getLevelInfo, LEVEL_THRESHOLDS, emptyDb, defaultWardrobeItems };
