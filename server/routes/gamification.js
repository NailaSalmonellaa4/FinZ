const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb, saveDb, getLevelInfo } = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/gamification — All quests, badges, level info, coins, pet outfit
router.get('/', (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Akun tidak ditemukan.' });

  const userQuestList = db.userQuests.filter(uq => uq.userId === req.userId);
  const enrichedQuests = userQuestList.map(uq => {
    const quest = db.quests.find(q => q.id === uq.questId);
    return {
      ...uq,
      title: quest?.title || '',
      desc: quest?.desc || '',
      xpReward: quest?.xpReward || 0,
      coinsReward: quest?.coinsReward || 30,
      type: quest?.type || 'daily',
      targetCount: quest?.targetCount || 1
    };
  });

  const userBadgeIds = db.userBadges.filter(ub => ub.userId === req.userId).map(ub => ub.badgeId);
  const enrichedBadges = db.badges.map(b => ({
    ...b,
    unlocked: userBadgeIds.includes(b.id),
    unlockedAt: db.userBadges.find(ub => ub.userId === req.userId && ub.badgeId === b.id)?.unlockedAt || null
  }));

  const levelInfo = getLevelInfo(user.xp);

  res.json({
    level: user.level,
    xp: user.xp,
    coins: user.coins !== undefined ? user.coins : 150,
    streak: user.streak,
    inventory: user.inventory || ['clothes-hoodie'],
    equippedOutfit: user.equippedOutfit || { hat: null, clothes: 'clothes-hoodie', accessory: null },
    mascot: user.mascot || 'cat',
    levelInfo,
    quests: enrichedQuests,
    badges: enrichedBadges
  });
});

// POST /api/gamification/claim/:questInstanceId
router.post('/claim/:id', (req, res) => {
  const db = getDb();
  const uq = db.userQuests.find(q => q.id === req.params.id && q.userId === req.userId);
  if (!uq) return res.status(404).json({ error: 'Misi tidak ditemukan.' });
  if (!uq.completed) return res.status(400).json({ error: 'Misi belum selesai!' });
  if (uq.claimed) return res.status(400).json({ error: 'Reward misi ini sudah diklaim sebelumnya.' });

  const quest = db.quests.find(q => q.id === uq.questId);
  const xpReward = quest?.xpReward || 0;
  const coinsReward = quest?.coinsReward || 30;

  uq.claimed = true;

  const user = db.users.find(u => u.id === req.userId);
  user.xp += xpReward;
  user.coins = (user.coins !== undefined ? user.coins : 150) + coinsReward;

  const levelInfo = getLevelInfo(user.xp);
  const oldLevel = user.level;
  user.level = levelInfo.level;
  const leveledUp = user.level > oldLevel;

  // Check badge: Master Keuangan (level 5)
  if (user.level >= 5) {
    const already = db.userBadges.find(ub => ub.userId === req.userId && ub.badgeId === 'b-5');
    if (!already) {
      db.userBadges.push({ userId: req.userId, badgeId: 'b-5', unlockedAt: new Date().toISOString() });
    }
  }

  saveDb(db);

  res.json({
    success: true,
    message: `Reward misi berhasil diklaim! +${xpReward} XP & +${coinsReward} FinZ Coins 🪙`,
    xpEarned: xpReward,
    coinsEarned: coinsReward,
    newXp: user.xp,
    newCoins: user.coins,
    levelInfo,
    leveledUp
  });
});

// GET /api/gamification/quiz
router.get('/quiz', (req, res) => {
  const questions = [
    {
      id: "qz-1",
      question: "Apa yang dimaksud dengan anggaran bulanan dalam pengelolaan keuangan?",
      options: [
        "Uang yang dipinjam dari bank setiap bulan.",
        "Batas rencana pengeluaran yang ditetapkan untuk setiap kategori agar tidak boros.",
        "Jumlah total utang yang harus dibayar setiap bulan.",
        "Saldo rekening bank yang selalu bertambah setiap bulan."
      ],
      correctIndex: 1,
      explanation: "Anggaran bulanan adalah rencana pengeluaran yang kamu tetapkan sendiri. Tujuannya agar kamu tahu berapa maksimal uang yang boleh dikeluarkan di setiap kategori seperti makanan, transportasi, atau hiburan.",
      xpReward: 50,
      coinsReward: 50
    },
    {
      id: "qz-2",
      question: "Apa manfaat utama mencatat setiap transaksi keuangan secara rutin?",
      options: [
        "Supaya bisa meminjam uang lebih banyak dari teman.",
        "Agar tahu ke mana uang pergi dan bisa mengontrol pengeluaran dengan lebih baik.",
        "Untuk terlihat lebih keren di hadapan orang lain.",
        "Tidak ada manfaatnya, karena uang akan habis juga."
      ],
      correctIndex: 1,
      explanation: "Mencatat transaksi membantu kamu menyadari pola pengeluaran. Dengan mengetahui ke mana uang pergi, kamu bisa membuat keputusan yang lebih cerdas dan mengurangi pengeluaran yang tidak perlu.",
      xpReward: 50,
      coinsReward: 50
    },
    {
      id: "qz-3",
      question: "Apa perbedaan utama antara 'kebutuhan' dan 'keinginan' dalam pengelolaan keuangan?",
      options: [
        "Keduanya sama saja, karena semua hal terasa penting.",
        "Kebutuhan adalah hal yang harus dipenuhi untuk hidup (makan, tempat tinggal), keinginan adalah hal yang ingin dimiliki tapi tidak wajib.",
        "Keinginan lebih penting dari kebutuhan karena membuat kita bahagia.",
        "Kebutuhan adalah barang mahal, keinginan adalah barang murah."
      ],
      correctIndex: 1,
      explanation: "Membedakan kebutuhan dan keinginan adalah kunci pengelolaan keuangan yang baik. Kebutuhan seperti makan dan transportasi harus diprioritaskan, sementara keinginan seperti gadget baru bisa ditunda jika anggaran terbatas.",
      xpReward: 50,
      coinsReward: 50
    },
    {
      id: "qz-4",
      question: "Dalam simulasi investasi FinZ, apa yang dimaksud dengan 'unit aset'?",
      options: [
        "Jumlah uang sungguhan yang kamu investasikan.",
        "Satuan kepemilikan dari sebuah aset simulasi yang kamu beli dengan saldo virtual.",
        "Nama bank tempat kamu menyimpan uang.",
        "Jumlah keuntungan yang sudah kamu dapatkan."
      ],
      correctIndex: 1,
      explanation: "Unit aset adalah satuan yang menunjukkan berapa banyak bagian aset simulasi yang kamu miliki. Contoh: kamu beli 2 unit aset dengan harga Rp 15.000/unit, maka total Rp 30.000 saldo virtual digunakan. Ini adalah konsep dasar investasi untuk pembelajaran.",
      xpReward: 50,
      coinsReward: 50
    },
    {
      id: "qz-5",
      question: "Mengapa membuat target tabungan dengan nominal dan deadline yang jelas lebih efektif?",
      options: [
        "Karena target yang jelas membuat kita stres dan termotivasi sekaligus.",
        "Karena dengan tujuan konkret, kita bisa menghitung berapa yang harus ditabung per bulan dan lebih termotivasi untuk mencapainya.",
        "Tidak perlu target, menabung sesuka hati sudah cukup.",
        "Karena bank meminta data target tabungan setiap bulan."
      ],
      correctIndex: 1,
      explanation: "Target tabungan yang spesifik (misal: 'Rp 1.000.000 untuk beli headphone dalam 3 bulan') membantumu menghitung Rp 333.000/bulan yang perlu disisihkan. Ini jauh lebih efektif daripada hanya berkata 'ingin menabung lebih banyak'.",
      xpReward: 50,
      coinsReward: 50
    }
  ];

  res.json({
    questions: questions.map(({ correctIndex, ...rest }) => rest),
    totalQuestions: questions.length
  });
});

// POST /api/gamification/quiz/answer
router.post('/quiz/answer', (req, res) => {
  const { questionId, selectedIndex } = req.body;
  const questions = [
    { id: "qz-1", correctIndex: 1, explanation: "Anggaran bulanan adalah rencana pengeluaran yang kamu tetapkan sendiri agar tidak boros.", xpReward: 50, coinsReward: 50 },
    { id: "qz-2", correctIndex: 1, explanation: "Mencatat transaksi membantu kamu menyadari ke mana uang pergi dan mengontrol pengeluaran.", xpReward: 50, coinsReward: 50 },
    { id: "qz-3", correctIndex: 1, explanation: "Kebutuhan wajib dipenuhi untuk hidup, sedangkan keinginan bisa ditunda jika anggaran terbatas.", xpReward: 50, coinsReward: 50 },
    { id: "qz-4", correctIndex: 1, explanation: "Unit aset adalah satuan kepemilikan aset simulasi yang dibeli dengan saldo virtual untuk pembelajaran.", xpReward: 50, coinsReward: 50 },
    { id: "qz-5", correctIndex: 1, explanation: "Target tabungan konkret membantumu menghitung jumlah setoran rutin bulanan dan lebih termotivasi.", xpReward: 50, coinsReward: 50 }
  ];

  const q = questions.find(q => q.id === questionId);
  if (!q) return res.status(404).json({ error: 'Soal tidak ditemukan.' });

  const isCorrect = Number(selectedIndex) === q.correctIndex;

  if (isCorrect) {
    const db = getDb();
    const user = db.users.find(u => u.id === req.userId);
    user.xp += q.xpReward;
    user.coins = (user.coins !== undefined ? user.coins : 150) + q.coinsReward;

    const levelInfo = getLevelInfo(user.xp);
    user.level = levelInfo.level;
    saveDb(db);

    return res.json({
      isCorrect: true,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      xpEarned: q.xpReward,
      coinsEarned: q.coinsReward,
      newCoins: user.coins,
      newXp: user.xp,
      message: `Jawaban benar! +${q.xpReward} XP & +${q.coinsReward} Koin FinZ 🪙🎉`
    });
  }

  res.json({
    isCorrect: false,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    xpEarned: 0,
    coinsEarned: 0,
    message: 'Kurang tepat. Pelajari penjelasannya agar lebih paham ya!'
  });
});

// GET /api/gamification/shop — Catalog of wardrobe clothes, hats, and accessories
router.get('/shop', (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Akun tidak ditemukan.' });

  res.json({
    items: db.wardrobeItems || [],
    userCoins: user.coins !== undefined ? user.coins : 150,
    inventory: user.inventory || ['clothes-hoodie'],
    equippedOutfit: user.equippedOutfit || { hat: null, clothes: 'clothes-hoodie', accessory: null },
    mascot: user.mascot || 'cat'
  });
});

// POST /api/gamification/shop/buy — Buy item with coins
router.post('/shop/buy', (req, res) => {
  const db = getDb();
  const { itemId } = req.body;
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Akun tidak ditemukan.' });

  const item = (db.wardrobeItems || []).find(i => i.id === itemId);
  if (!item) return res.status(404).json({ error: 'Barang tidak ditemukan di toko.' });

  const inventory = user.inventory || [];
  if (inventory.includes(itemId)) {
    return res.status(400).json({ error: 'Kamu sudah memiliki barang ini di lemari!' });
  }

  const userCoins = user.coins !== undefined ? user.coins : 150;
  if (userCoins < item.price) {
    return res.status(400).json({
      error: `Koin FinZ tidak cukup! Butuh ${item.price} koin, kamu baru punya ${userCoins} koin. Selesaikan kuis dan misi untuk dapat koin lagi!`
    });
  }

  // Deduct coins & add to inventory
  user.coins = userCoins - item.price;
  user.inventory = [...inventory, itemId];

  // Auto-equip if slot is empty
  const equipped = user.equippedOutfit || { hat: null, clothes: null, accessory: null };
  if (!equipped[item.type]) {
    equipped[item.type] = itemId;
    user.equippedOutfit = equipped;
  }

  saveDb(db);

  res.json({
    success: true,
    message: `Berhasil membeli ${item.name}! Koin sisa: ${user.coins} 🪙`,
    newCoins: user.coins,
    inventory: user.inventory,
    equippedOutfit: user.equippedOutfit,
    item
  });
});

// POST /api/gamification/shop/equip — Equip or unequip item
router.post('/shop/equip', (req, res) => {
  const db = getDb();
  const { itemId, action } = req.body; // action: 'equip' | 'unequip'
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Akun tidak ditemukan.' });

  const inventory = user.inventory || [];
  const equipped = user.equippedOutfit || { hat: null, clothes: null, accessory: null };

  if (action === 'unequip') {
    const item = (db.wardrobeItems || []).find(i => i.id === itemId);
    if (item && equipped[item.type] === itemId) {
      equipped[item.type] = null;
    }
  } else {
    // Equip
    if (!inventory.includes(itemId)) {
      return res.status(400).json({ error: 'Kamu belum membeli barang ini!' });
    }
    const item = (db.wardrobeItems || []).find(i => i.id === itemId);
    if (!item) return res.status(404).json({ error: 'Item tidak ditemukan.' });

    equipped[item.type] = itemId;
  }

  user.equippedOutfit = equipped;
  saveDb(db);

  res.json({
    success: true,
    message: action === 'unequip' ? 'Barang berhasil dicopot.' : 'Karakter berhasil berganti gaya! ✨',
    equippedOutfit: user.equippedOutfit
  });
});

// POST /api/gamification/mascot — Change mascot pet
router.post('/mascot', (req, res) => {
  const db = getDb();
  const { mascot } = req.body; // 'cat' | 'panda' | 'shiba'
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Akun tidak ditemukan.' });

  if (!['cat', 'panda', 'shiba'].includes(mascot)) {
    return res.status(400).json({ error: 'Pilihan maskot tidak valid.' });
  }

  user.mascot = mascot;
  saveDb(db);

  res.json({
    success: true,
    message: `Maskot berhasil diubah menjadi ${mascot === 'cat' ? 'Finzy Kucing Rezeki' : mascot === 'panda' ? 'Bobi Panda Hemat' : 'Shiba Cuan'}! 🐾`,
    mascot: user.mascot
  });
});

module.exports = router;
