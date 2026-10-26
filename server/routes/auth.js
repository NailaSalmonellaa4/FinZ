const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDb, saveDb, getLevelInfo } = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

const INITIAL_VIRTUAL_BALANCE = 5000000; // Rp 5.000.000 virtual money for simulation
const INITIAL_XP = 0;
const INITIAL_COINS = 150; // Starter coins for wardrobe/accessories
const SALT_ROUNDS = 10;

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !name.trim()) return res.status(400).json({ error: 'Nama lengkap harus diisi.' });
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Format email tidak valid.' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password minimal 6 karakter.' });

    const db = getDb();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return res.status(409).json({ error: 'Email ini sudah terdaftar. Silakan gunakan email lain atau langsung login.' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = uuidv4();
    const now = new Date().toISOString();

    const newUser = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      virtualBalance: INITIAL_VIRTUAL_BALANCE,
      xp: INITIAL_XP,
      coins: INITIAL_COINS,
      inventory: ['clothes-hoodie'],
      equippedOutfit: { hat: null, clothes: 'clothes-hoodie', accessory: null },
      mascot: 'cat',
      bio: 'Belajar mengelola uang sejak dini 🚀',
      level: 1,
      streak: 0,
      lastActiveDate: null,
      soundEnabled: true,
      createdAt: now
    };

    db.users.push(newUser);

    // Auto-initialize quests for new user
    (db.quests || []).forEach(q => {
      db.userQuests.push({
        id: uuidv4(),
        userId,
        questId: q.id,
        progress: 0,
        completed: false,
        claimed: false,
        resetDate: new Date().toISOString().split('T')[0]
      });
    });

    saveDb(db);

    const token = jwt.sign({ userId, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: `Selamat datang di FinZ, ${newUser.name}! Akun berhasil dibuat. Kamu mendapat Rp ${INITIAL_VIRTUAL_BALANCE.toLocaleString('id-ID')} saldo virtual dan ${INITIAL_COINS} Koin FinZ untuk mendandani karakter 3D-mu!`,
      token,
      user: {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        level: 1,
        xp: 0,
        coins: INITIAL_COINS,
        equippedOutfit: newUser.equippedOutfit,
        mascot: newUser.mascot,
        virtualBalance: INITIAL_VIRTUAL_BALANCE
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server. Coba lagi.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email dan password harus diisi.' });

    const db = getDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) return res.status(401).json({ error: 'Email atau password salah.' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Email atau password salah.' });

    // Ensure defaults
    if (user.coins === undefined) user.coins = 150;
    if (!user.inventory) user.inventory = ['clothes-hoodie'];
    if (!user.equippedOutfit) user.equippedOutfit = { hat: null, clothes: 'clothes-hoodie', accessory: null };
    if (!user.mascot) user.mascot = 'cat';
    if (!user.bio) user.bio = 'Belajar mengelola uang sejak dini 🚀';

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    let streakBonusXp = 0;
    if (user.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (user.lastActiveDate === yesterday) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }
      user.lastActiveDate = today;
      user.xp += 25; // Daily login bonus
      streakBonusXp = 25;

      // Update level from XP
      const levelInfo = getLevelInfo(user.xp);
      user.level = levelInfo.level;

      // Reset daily quests
      db.userQuests.forEach(uq => {
        if (uq.userId === user.id) {
          const questTemplate = db.quests.find(q => q.id === uq.questId);
          if (questTemplate && questTemplate.type === 'daily' && uq.resetDate !== today) {
            uq.progress = 0;
            uq.completed = false;
            uq.claimed = false;
            uq.resetDate = today;
          }
        }
      });

      saveDb(db);
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const levelInfo = getLevelInfo(user.xp);

    return res.json({
      success: true,
      message: `Halo kembali, ${user.name}! Streak ${user.streak} hari! ${streakBonusXp > 0 ? `+${streakBonusXp} XP bonus login harian.` : ''}`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
        equippedOutfit: user.equippedOutfit,
        mascot: user.mascot,
        bio: user.bio,
        streak: user.streak,
        virtualBalance: user.virtualBalance,
        levelInfo
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

// GET /api/auth/me  (token protected - returns full profile)
router.get('/me', require('../middleware/auth').authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Akun tidak ditemukan.' });

  // Ensure defaults
  if (user.coins === undefined) user.coins = 150;
  if (!user.inventory) user.inventory = ['clothes-hoodie'];
  if (!user.equippedOutfit) user.equippedOutfit = { hat: null, clothes: 'clothes-hoodie', accessory: null };
  if (!user.mascot) user.mascot = 'cat';
  if (!user.bio) user.bio = 'Belajar mengelola uang sejak dini 🚀';

  // Calculate monthly summary
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const userTxs = db.transactions.filter(t => t.userId === user.id);
  const monthlyTx = userTxs.filter(t => t.date >= monthStart);
  const monthlyIncome = monthlyTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = monthlyTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  // Portfolio value
  const portfolio = db.investPortfolios.filter(p => p.userId === user.id);
  let portfolioValue = 0;
  portfolio.forEach(p => {
    const asset = db.investAssets.find(a => a.id === p.assetId);
    if (asset) portfolioValue += p.units * asset.pricePerUnit;
  });

  // Saving targets summary
  const savingTargets = db.savingTargets.filter(s => s.userId === user.id);
  const totalSaved = savingTargets.reduce((sum, s) => sum + s.currentAmount, 0);
  const completedTargetsCount = savingTargets.filter(s => s.currentAmount >= s.targetAmount).length;

  // Badges unlocked count
  const unlockedBadgesCount = db.userBadges.filter(ub => ub.userId === user.id).length;

  const levelInfo = getLevelInfo(user.xp);

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    level: user.level,
    xp: user.xp,
    coins: user.coins,
    inventory: user.inventory,
    equippedOutfit: user.equippedOutfit,
    mascot: user.mascot,
    bio: user.bio,
    streak: user.streak,
    virtualBalance: user.virtualBalance,
    soundEnabled: user.soundEnabled,
    createdAt: user.createdAt,
    levelInfo,
    stats: {
      totalTransactions: userTxs.length,
      totalSaved,
      savingTargetsCount: savingTargets.length,
      completedTargetsCount,
      unlockedBadgesCount,
      portfolioValue
    },
    monthlySummary: {
      month: now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      income: monthlyIncome,
      expense: monthlyExpense,
      balance: monthlyIncome - monthlyExpense
    },
    portfolioValue,
    totalSaved
  });
});

// PUT /api/auth/profile — Update user profile (name, bio, mascot, soundEnabled)
router.put('/profile', require('../middleware/auth').authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Akun tidak ditemukan.' });

  const { name, bio, mascot, soundEnabled } = req.body;
  if (name && name.trim()) user.name = name.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (mascot && ['cat', 'panda', 'shiba'].includes(mascot)) user.mascot = mascot;
  if (soundEnabled !== undefined) user.soundEnabled = Boolean(soundEnabled);

  saveDb(db);

  res.json({
    success: true,
    message: 'Profil berhasil diperbarui! ✨',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      mascot: user.mascot,
      soundEnabled: user.soundEnabled
    }
  });
});

module.exports = router;
