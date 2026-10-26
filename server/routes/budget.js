const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');
const { v4: uuidv4 } = require('uuid');

// Calculate round-up amount to nearest 5.000
function calculateRoundUp(amount, multiplier = 1) {
  if (amount <= 0) return 0;
  const remainder = amount % 5000;
  let baseRoundUp = remainder === 0 ? 5000 : (5000 - remainder);
  return baseRoundUp * multiplier;
}

// Initial Wishlist Pots if not present
function ensureWishlists(db) {
  if (!db.wishlists) {
    db.wishlists = [
      {
        id: "w-1",
        title: "🎧 Headphone Wireless Nugas",
        targetAmount: 850000,
        currentAmount: 520000,
        icon: "Headphones",
        category: "Gadget",
        createdAt: new Date().toISOString()
      },
      {
        id: "w-2",
        title: "🎟️ Tiket Konser Oasis / Festival Musik",
        targetAmount: 1400000,
        currentAmount: 890000,
        icon: "Ticket",
        category: "Lifestyle",
        createdAt: new Date().toISOString()
      },
      {
        id: "w-3",
        title: "🎮 Battle Pass Game & Skin Idaman",
        targetAmount: 350000,
        currentAmount: 350000,
        icon: "Gamepad2",
        category: "Gaming",
        createdAt: new Date().toISOString()
      }
    ];
    saveDb(db);
  }
  return db.wishlists;
}

// GET /api/budget
router.get('/', (req, res) => {
  const db = getDb();
  ensureWishlists(db);
  
  // Calculate category totals from transactions for current month
  const categoryTotals = {
    needs: 0,
    wants: 0,
    investments: 0
  };

  db.transactions.forEach(t => {
    if (t.type === 'expense') {
      if (['Kebutuhan Pokok', 'Transportasi & Ojol', 'Tagihan & Listrik', 'Pendidikan & Buku'].includes(t.category)) {
        categoryTotals.needs += t.amount;
      } else if (['Coffee & Nongkrong', 'Makanan & Delivery', 'Fashion & Wishlist', 'Langganan Digital', 'Hiburan & Game'].includes(t.category)) {
        categoryTotals.wants += t.amount;
      } else {
        categoryTotals.wants += t.amount;
      }
    } else if (t.type === 'invest') {
      categoryTotals.investments += t.amount;
    }
  });

  // Combine with budget targets
  const budgetCategories = db.monthlyBudget.categories.map(cat => {
    const currentSpent = categoryTotals[cat.id] || cat.spent;
    const percentUsed = Math.min(100, Math.round((currentSpent / cat.allocated) * 100));
    return {
      ...cat,
      spent: currentSpent,
      remaining: Math.max(0, cat.allocated - currentSpent),
      percentUsed
    };
  });

  // Calculate overall financial health score (0 - 100)
  let healthScore = 85;
  if (categoryTotals.wants > 1350000) healthScore -= 15;
  if (categoryTotals.investments > 500000) healthScore += 10;
  healthScore = Math.min(99, Math.max(30, healthScore));

  res.json({
    month: db.monthlyBudget.month,
    totalIncome: db.monthlyBudget.totalIncome,
    categories: budgetCategories,
    healthScore,
    transactions: db.transactions,
    wishlists: db.wishlists,
    accumulatedRoundUp: db.user.roundUpSettings.accumulatedRoundUp,
    roundUpEnabled: db.user.roundUpSettings.enabled,
    multiplier: db.user.roundUpSettings.multiplier
  });
});

// POST /api/budget/transaction (Add expense or income with round-up)
router.post('/transaction', (req, res) => {
  const db = getDb();
  ensureWishlists(db);
  const { title, category, type, amount, note, icon, applyRoundUp } = req.body;
  const numAmount = Number(amount);

  if (!title || !numAmount || numAmount <= 0) {
    return res.status(400).json({ error: "Judul dan nominal harus diisi dengan benar!" });
  }

  const isExpense = type === 'expense';
  let roundUp = 0;
  let roundedTotal = numAmount;

  if (isExpense && (applyRoundUp || db.user.roundUpSettings.enabled)) {
    const multiplier = db.user.roundUpSettings.multiplier || 1;
    roundUp = calculateRoundUp(numAmount, multiplier);
    roundedTotal = numAmount + roundUp;
  }

  // Check balance if expense
  if (isExpense && db.user.cashBalance < roundedTotal) {
    return res.status(400).json({ error: "Saldo dompet kamu kurang buat belanja ini!" });
  }

  // Update cash balance
  if (isExpense) {
    db.user.cashBalance -= roundedTotal;
    if (roundUp > 0) {
      db.user.roundUpSettings.accumulatedRoundUp += roundUp;
    }
  } else if (type === 'income') {
    db.user.cashBalance += numAmount;
  }

  const newTx = {
    id: `tx-${Date.now()}`,
    title,
    category: category || (isExpense ? "Jajan / Pengeluaran" : "Uang Masuk"),
    type: type || "expense",
    amount: numAmount,
    roundUpAmount: roundUp,
    roundedTotal,
    date: new Date().toISOString(),
    icon: icon || (isExpense ? "Receipt" : "ArrowDownLeft"),
    isRoundUpEligible: isExpense && roundUp > 0,
    investedTo: db.user.roundUpSettings.targetAssetId || "green-future",
    note: note || ""
  };

  db.transactions.unshift(newTx);

  // Quest checking
  const q1 = db.quests.find(q => q.id === 'q-1');
  if (q1 && !q1.completed) {
    q1.progress = 1;
    q1.completed = true;
  }

  const q2 = db.quests.find(q => q.id === 'q-2');
  if (q2) {
    q2.progress = db.user.roundUpSettings.accumulatedRoundUp;
    if (q2.progress >= q2.target) q2.completed = true;
  }

  // Award XP
  const xpEarned = isExpense ? 30 : 50;
  db.user.xp += xpEarned;

  saveDb(db);

  res.json({
    success: true,
    transaction: newTx,
    roundUpAmount: roundUp,
    accumulatedRoundUp: db.user.roundUpSettings.accumulatedRoundUp,
    cashBalance: db.user.cashBalance,
    xpEarned,
    message: isExpense 
      ? (roundUp > 0 ? `Tercatat! +Rp ${roundUp.toLocaleString('id-ID')} masuk celengan receh & kamu dapat +${xpEarned} XP! 🔥` : `Transaksi dicatat! Kamu dapat +${xpEarned} XP!`)
      : `Uang masuk berhasil ditambahkan! Saldo dompet bertambah.`
  });
});

// DELETE /api/budget/transaction/:id
router.delete('/transaction/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const index = db.transactions.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Transaksi tidak ditemukan!" });
  }

  const tx = db.transactions[index];
  if (tx.type === 'expense') {
    db.user.cashBalance += tx.roundedTotal;
    if (tx.roundUpAmount > 0) {
      db.user.roundUpSettings.accumulatedRoundUp = Math.max(0, db.user.roundUpSettings.accumulatedRoundUp - tx.roundUpAmount);
    }
  } else if (tx.type === 'income') {
    db.user.cashBalance = Math.max(0, db.user.cashBalance - tx.amount);
  }

  db.transactions.splice(index, 1);
  saveDb(db);

  res.json({ success: true, message: "Transaksi berhasil dihapus & saldo disesuaikan." });
});

// POST /api/budget/wishlist (Create Celengan Impian)
router.post('/wishlist', (req, res) => {
  const db = getDb();
  ensureWishlists(db);
  const { title, targetAmount, category, icon } = req.body;
  const numTarget = Number(targetAmount);

  if (!title || !numTarget || numTarget <= 0) {
    return res.status(400).json({ error: "Nama impian dan target uang harus diisi!" });
  }

  const newWish = {
    id: `w-${Date.now()}`,
    title,
    targetAmount: numTarget,
    currentAmount: 0,
    icon: icon || "Sparkles",
    category: category || "Wishlist",
    createdAt: new Date().toISOString()
  };

  db.wishlists.push(newWish);
  saveDb(db);

  res.json({ success: true, message: `Celengan impian "${title}" berhasil dibuat! 🎯`, wishlist: newWish });
});

// POST /api/budget/wishlist/:id/deposit (Deposit to Celengan Impian)
router.post('/wishlist/:id/deposit', (req, res) => {
  const db = getDb();
  ensureWishlists(db);
  const { id } = req.params;
  const { amount } = req.body;
  const numAmount = Number(amount);

  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ error: "Nominal isi celengan tidak valid!" });
  }

  if (db.user.cashBalance < numAmount) {
    return res.status(400).json({ error: "Saldo dompet tunai kamu tidak mencukupi!" });
  }

  const wish = db.wishlists.find(w => w.id === id);
  if (!wish) {
    return res.status(404).json({ error: "Celengan impian tidak ditemukan!" });
  }

  // Deduct cash, add to wish
  db.user.cashBalance -= numAmount;
  wish.currentAmount += numAmount;

  // Record tx
  const tx = {
    id: `tx-${Date.now()}`,
    title: `Isi Celengan: ${wish.title}`,
    category: "Celengan Impian",
    type: "invest",
    amount: numAmount,
    roundUpAmount: 0,
    roundedTotal: numAmount,
    date: new Date().toISOString(),
    icon: "Target",
    isRoundUpEligible: false,
    note: `Nabung buat ${wish.title}`
  };
  db.transactions.unshift(tx);

  // Bonus XP
  db.user.xp += 50;

  saveDb(db);

  res.json({
    success: true,
    message: `Mantap! Berhasil nabung Rp ${numAmount.toLocaleString('id-ID')} ke "${wish.title}"! (+50 XP) 🎉`,
    wishlist: wish,
    cashBalance: db.user.cashBalance
  });
});

// POST /api/budget/fomo-check (FOMO Barrier with Robux & Game Skin calculation)
router.post('/fomo-check', (req, res) => {
  const { itemName, price, hourlyWage } = req.body;
  const itemPrice = Number(price);
  const wagePerHour = Number(hourlyWage) || 28000;

  if (!itemPrice || itemPrice <= 0) {
    return res.status(400).json({ error: "Masukkan harga barang yang valid!" });
  }

  const hoursNeeded = parseFloat((itemPrice / wagePerHour).toFixed(1));
  const workDaysNeeded = parseFloat((hoursNeeded / 8).toFixed(1));
  const coffeeCupsEquivalent = Math.round(itemPrice / 25000);
  
  // Game equivalents for Gen Alpha / Gen Z
  const robuxEquivalent = Math.round(itemPrice / 200); // ~Rp 200 / Robux
  const mlbbDiamonds = Math.round(itemPrice / 290); // ~Rp 290 / Diamond

  // 5 Year Compound Investment Potential (at 12% CAGR)
  const compoundFutureValue = Math.round(itemPrice * 1.7623);
  const profitPotential = compoundFutureValue - itemPrice;

  // Chill & Fun Verdict
  let roastVerdict = "";
  let severity = "low";

  if (itemPrice > 1500000) {
    severity = "critical";
    roastVerdict = `Bro/Sis, beli ${itemName || 'barang ini'} (Rp ${itemPrice.toLocaleString('id-ID')}) sama aja kamu harus kerja lembur ${workDaysNeeded} hari penuh! Atau setara ${robuxEquivalent.toLocaleString('id-ID')} Robux! Kalau kamu investasikan, 5 tahun lagi bisa bertumbuh jadi Rp ${compoundFutureValue.toLocaleString('id-ID')}. Tahan jempol 72 jam dulu sebelum nyesel! 🛑`;
  } else if (itemPrice > 300000) {
    severity = "medium";
    roastVerdict = `Pikir 2x bestie! Uang Rp ${itemPrice.toLocaleString('id-ID')} ini setara ${coffeeCupsEquivalent} gelas iced latte atau ${mlbbDiamonds.toLocaleString('id-ID')} Diamond game. Apakah ini beneran butuh atau cuma laper mata karena lewat di FYP TikTok? ☕✨`;
  } else {
    severity = "low";
    roastVerdict = `Harganya masih terjangkau! Tapi ingat, receh kalau dikumpulin bisa beranak jadi Rp ${compoundFutureValue.toLocaleString('id-ID')}. Pastikan saldo kebutuhanmu ga keganggu ya!`;
  }

  res.json({
    itemName: itemName || "Barang Impulsif",
    itemPrice,
    hoursNeeded,
    workDaysNeeded,
    coffeeCupsEquivalent,
    robuxEquivalent,
    mlbbDiamonds,
    compoundFutureValue,
    profitPotential,
    roastVerdict,
    severity
  });
});

module.exports = router;
