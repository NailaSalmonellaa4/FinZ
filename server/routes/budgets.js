const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb, saveDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

const BUDGET_CATEGORIES = [
  'Makanan & Minuman', 'Transportasi', 'Hiburan & Hobi',
  'Belanja & Fashion', 'Belajar & Pendidikan', 'Tagihan & Utilitas',
  'Kesehatan', 'Sosial & Hadiah', 'Lainnya'
];

// GET /api/budgets?month=YYYY-MM
router.get('/', (req, res) => {
  const db = getDb();
  const now = new Date();
  const month = req.query.month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const budgets = db.budgets.filter(b => b.userId === req.userId && b.month === month);

  // Calculate actual spending per category from transactions
  const monthTxs = db.transactions.filter(
    t => t.userId === req.userId && t.type === 'expense' && t.date.startsWith(month)
  );

  const spendingByCategory = {};
  monthTxs.forEach(t => {
    spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + t.amount;
  });

  const enrichedBudgets = budgets.map(b => {
    const spent = spendingByCategory[b.category] || 0;
    const percentUsed = b.limitAmount > 0 ? Math.min(100, Math.round((spent / b.limitAmount) * 100)) : 0;
    return {
      ...b,
      spent,
      remaining: Math.max(0, b.limitAmount - spent),
      percentUsed,
      isOver: spent > b.limitAmount
    };
  });

  // Total spending this month across all categories
  const totalBudgeted = budgets.reduce((s, b) => s + b.limitAmount, 0);
  const totalSpent = Object.values(spendingByCategory).reduce((s, v) => s + v, 0);

  res.json({
    month,
    budgets: enrichedBudgets,
    categories: BUDGET_CATEGORIES,
    totalBudgeted,
    totalSpent,
    spendingByCategory
  });
});

// POST /api/budgets
router.post('/', (req, res) => {
  const db = getDb();
  const { category, limitAmount, month } = req.body;

  if (!category || !BUDGET_CATEGORIES.includes(category))
    return res.status(400).json({ error: 'Kategori anggaran tidak valid. Pilih dari daftar yang tersedia.' });

  const numLimit = Number(limitAmount);
  if (!numLimit || numLimit <= 0)
    return res.status(400).json({ error: 'Batas anggaran harus berupa angka positif.' });

  const now = new Date();
  const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Prevent duplicate budget for same category + month
  const existing = db.budgets.find(
    b => b.userId === req.userId && b.category === category && b.month === targetMonth
  );
  if (existing) return res.status(409).json({ error: `Anggaran untuk kategori "${category}" di bulan ini sudah ada. Hapus yang lama dulu atau gunakan endpoint PUT untuk mengubah.` });

  const budget = {
    id: uuidv4(),
    userId: req.userId,
    month: targetMonth,
    category,
    limitAmount: numLimit,
    createdAt: new Date().toISOString()
  };

  db.budgets.push(budget);

  // Award XP & update quest
  const user = db.users.find(u => u.id === req.userId);
  user.xp += 40;
  const { getLevelInfo } = require('../db');
  const levelInfo = getLevelInfo(user.xp);
  user.level = levelInfo.level;

  // Update weekly quest q-weekly-3
  const uq = db.userQuests.find(q => q.userId === req.userId && q.questId === 'q-weekly-3' && !q.completed);
  if (uq) { uq.progress += 1; if (uq.progress >= 1) uq.completed = true; }

  saveDb(db);
  res.status(201).json({
    success: true,
    budget,
    xpEarned: 40,
    message: `Anggaran kategori "${category}" berhasil dibuat! +40 XP 🎯`
  });
});

// PUT /api/budgets/:id
router.put('/:id', (req, res) => {
  const db = getDb();
  const budget = db.budgets.find(b => b.id === req.params.id && b.userId === req.userId);
  if (!budget) return res.status(404).json({ error: 'Anggaran tidak ditemukan atau bukan milikmu.' });

  const numLimit = Number(req.body.limitAmount);
  if (numLimit && numLimit > 0) budget.limitAmount = numLimit;

  saveDb(db);
  res.json({ success: true, budget, message: 'Batas anggaran berhasil diperbarui.' });
});

// DELETE /api/budgets/:id
router.delete('/:id', (req, res) => {
  const db = getDb();
  const idx = db.budgets.findIndex(b => b.id === req.params.id && b.userId === req.userId);
  if (idx === -1) return res.status(404).json({ error: 'Anggaran tidak ditemukan atau bukan milikmu.' });
  db.budgets.splice(idx, 1);
  saveDb(db);
  res.json({ success: true, message: 'Anggaran berhasil dihapus.' });
});

module.exports = router;
