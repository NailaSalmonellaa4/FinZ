const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb, saveDb, getLevelInfo } = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

const XP_CREATE_TARGET = 80;
const XP_DEPOSIT = 30;

// GET /api/savings
router.get('/', (req, res) => {
  const db = getDb();
  const targets = db.savingTargets.filter(s => s.userId === req.userId);

  const enriched = targets.map(target => {
    const deposits = db.savingDeposits.filter(d => d.targetId === target.id);
    const percentDone = target.targetAmount > 0
      ? Math.min(100, Math.round((target.currentAmount / target.targetAmount) * 100))
      : 0;
    const remaining = Math.max(0, target.targetAmount - target.currentAmount);
    const isCompleted = target.currentAmount >= target.targetAmount;

    // Days remaining
    let daysLeft = null;
    if (target.deadline) {
      const diff = new Date(target.deadline) - new Date();
      daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    return { ...target, deposits, percentDone, remaining, isCompleted, daysLeft };
  });

  // Sort: active first, then completed
  enriched.sort((a, b) => (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0));

  res.json({ savingTargets: enriched });
});

// POST /api/savings — Create new saving target
router.post('/', (req, res) => {
  const db = getDb();
  const { name, targetAmount, deadline } = req.body;

  if (!name || !name.trim())
    return res.status(400).json({ error: 'Nama target tabungan harus diisi.' });
  const numTarget = Number(targetAmount);
  if (!numTarget || numTarget <= 0)
    return res.status(400).json({ error: 'Jumlah target harus berupa angka positif.' });
  if (deadline && new Date(deadline) < new Date())
    return res.status(400).json({ error: 'Tanggal target tidak boleh di masa lalu.' });

  const target = {
    id: uuidv4(),
    userId: req.userId,
    name: name.trim(),
    targetAmount: numTarget,
    currentAmount: 0,
    deadline: deadline || null,
    createdAt: new Date().toISOString()
  };
  db.savingTargets.push(target);

  // Award XP
  const user = db.users.find(u => u.id === req.userId);
  user.xp += XP_CREATE_TARGET;
  const levelInfo = getLevelInfo(user.xp);
  user.level = levelInfo.level;

  // Update quest q-weekly-1
  const uq = db.userQuests.find(q => q.userId === req.userId && q.questId === 'q-weekly-1' && !q.completed);
  if (uq) { uq.progress += 1; if (uq.progress >= 1) uq.completed = true; }

  saveDb(db);
  res.status(201).json({
    success: true,
    target,
    xpEarned: XP_CREATE_TARGET,
    levelInfo,
    message: `Target tabungan "${name}" berhasil dibuat! +${XP_CREATE_TARGET} XP 🎯`
  });
});

// POST /api/savings/:id/deposit — Add deposit to target
router.post('/:id/deposit', (req, res) => {
  const db = getDb();
  const target = db.savingTargets.find(s => s.id === req.params.id && s.userId === req.userId);
  if (!target) return res.status(404).json({ error: 'Target tabungan tidak ditemukan atau bukan milikmu.' });

  const numAmount = Number(req.body.amount);
  if (!numAmount || numAmount <= 0)
    return res.status(400).json({ error: 'Jumlah tabungan harus berupa angka positif.' });

  const deposit = {
    id: uuidv4(),
    userId: req.userId,
    targetId: target.id,
    amount: numAmount,
    note: (req.body.note || '').trim(),
    date: new Date().toISOString()
  };

  target.currentAmount += numAmount;
  db.savingDeposits.push(deposit);

  // XP
  const user = db.users.find(u => u.id === req.userId);
  user.xp += XP_DEPOSIT;
  const levelInfo = getLevelInfo(user.xp);
  user.level = levelInfo.level;

  // Check badge: Penabung Pemula (target completed)
  const isNowCompleted = target.currentAmount >= target.targetAmount;
  let badgeUnlocked = null;
  if (isNowCompleted) {
    const badge = db.badges.find(b => b.id === 'b-3');
    const already = db.userBadges.find(ub => ub.userId === req.userId && ub.badgeId === 'b-3');
    if (badge && !already) {
      db.userBadges.push({ userId: req.userId, badgeId: 'b-3', unlockedAt: new Date().toISOString() });
      badgeUnlocked = badge;
    }
  }

  saveDb(db);
  const percentDone = Math.min(100, Math.round((target.currentAmount / target.targetAmount) * 100));

  res.json({
    success: true,
    deposit,
    currentAmount: target.currentAmount,
    percentDone,
    isCompleted: isNowCompleted,
    xpEarned: XP_DEPOSIT,
    levelInfo,
    badgeUnlocked,
    message: isNowCompleted
      ? `🎉 Selamat! Target tabungan "${target.name}" TERCAPAI! +${XP_DEPOSIT} XP`
      : `Berhasil menabung Rp ${numAmount.toLocaleString('id-ID')}! Progress: ${percentDone}% (+${XP_DEPOSIT} XP)`
  });
});

// DELETE /api/savings/:id
router.delete('/:id', (req, res) => {
  const db = getDb();
  const idx = db.savingTargets.findIndex(s => s.id === req.params.id && s.userId === req.userId);
  if (idx === -1) return res.status(404).json({ error: 'Target tabungan tidak ditemukan atau bukan milikmu.' });

  const targetId = db.savingTargets[idx].id;
  db.savingTargets.splice(idx, 1);
  // Remove related deposits
  db.savingDeposits = db.savingDeposits.filter(d => d.targetId !== targetId);
  saveDb(db);
  res.json({ success: true, message: 'Target tabungan berhasil dihapus.' });
});

module.exports = router;
