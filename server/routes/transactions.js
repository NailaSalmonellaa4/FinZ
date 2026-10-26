const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb, saveDb, getLevelInfo } = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

const TRANSACTION_CATEGORIES = {
  income: ['Gaji / Uang Saku', 'Freelance / Side Hustle', 'Hadiah', 'Penjualan Barang', 'Transfer dari Orang Tua', 'Lainnya'],
  expense: ['Makanan & Minuman', 'Transportasi', 'Hiburan & Hobi', 'Belanja & Fashion', 'Belajar & Pendidikan', 'Tagihan & Utilitas', 'Kesehatan', 'Sosial & Hadiah', 'Lainnya']
};

const XP_RECORD_TRANSACTION = 30; // XP per transaction recorded

// GET /api/transactions — Get all user transactions (optionally filtered by month)
router.get('/', (req, res) => {
  const db = getDb();
  const { month, type, limit } = req.query; // month: YYYY-MM

  let txs = db.transactions.filter(t => t.userId === req.userId);

  if (month) {
    txs = txs.filter(t => t.date.startsWith(month));
  }
  if (type) {
    txs = txs.filter(t => t.type === type);
  }

  // Sort newest first
  txs.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (limit) txs = txs.slice(0, Number(limit));

  // Monthly summary for current month
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthTxs = db.transactions.filter(
    t => t.userId === req.userId && t.date.startsWith(currentMonth)
  );
  const monthlyIncome = currentMonthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const monthlyExpense = currentMonthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  res.json({
    transactions: txs,
    categories: TRANSACTION_CATEGORIES,
    monthlySummary: {
      month: now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      income: monthlyIncome,
      expense: monthlyExpense,
      balance: monthlyIncome - monthlyExpense
    }
  });
});

// POST /api/transactions — Add new transaction
router.post('/', (req, res) => {
  const db = getDb();
  const { type, category, description, amount, date } = req.body;

  // Validation
  if (!type || !['income', 'expense'].includes(type))
    return res.status(400).json({ error: 'Jenis transaksi harus "income" (uang masuk) atau "expense" (uang keluar).' });
  if (!category || !category.trim())
    return res.status(400).json({ error: 'Kategori harus dipilih.' });
  if (!description || !description.trim())
    return res.status(400).json({ error: 'Keterangan transaksi harus diisi.' });
  const numAmount = Number(amount);
  if (!numAmount || numAmount <= 0)
    return res.status(400).json({ error: 'Jumlah uang harus berupa angka positif.' });
  if (!date)
    return res.status(400).json({ error: 'Tanggal transaksi harus diisi.' });

  const tx = {
    id: uuidv4(),
    userId: req.userId,
    type,
    category: category.trim(),
    description: description.trim(),
    amount: numAmount,
    date: new Date(date).toISOString(),
    createdAt: new Date().toISOString()
  };

  db.transactions.push(tx);

  // Award XP
  const user = db.users.find(u => u.id === req.userId);
  user.xp += XP_RECORD_TRANSACTION;
  const levelInfo = getLevelInfo(user.xp);
  user.level = levelInfo.level;

  // Update daily quest: q-daily-1 (Catat 1 Transaksi)
  const today = new Date().toISOString().split('T')[0];
  const uq = db.userQuests.find(q => q.userId === req.userId && q.questId === 'q-daily-1' && !q.completed);
  if (uq) {
    uq.progress += 1;
    const questDef = db.quests.find(q => q.id === 'q-daily-1');
    if (uq.progress >= (questDef?.targetCount || 1)) uq.completed = true;
  }

  saveDb(db);

  res.status(201).json({
    success: true,
    transaction: tx,
    xpEarned: XP_RECORD_TRANSACTION,
    newXp: user.xp,
    levelInfo,
    message: `Transaksi berhasil dicatat! +${XP_RECORD_TRANSACTION} XP 🎉`
  });
});

// DELETE /api/transactions/:id
router.delete('/:id', (req, res) => {
  const db = getDb();
  const idx = db.transactions.findIndex(t => t.id === req.params.id && t.userId === req.userId);
  if (idx === -1) return res.status(404).json({ error: 'Transaksi tidak ditemukan atau bukan milikmu.' });

  db.transactions.splice(idx, 1);
  saveDb(db);
  res.json({ success: true, message: 'Transaksi berhasil dihapus.' });
});

module.exports = router;
