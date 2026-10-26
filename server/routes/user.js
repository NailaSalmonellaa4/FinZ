const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');

// Helper to calculate level from XP
function calculateLevel(xp) {
  // Level threshold: 500 XP per level + exponential factor
  // Lv 1: 0, Lv 2: 500, Lv 3: 1200, Lv 4: 2000, Lv 5: 3000, Lv 6: 4200, ...
  const levels = [
    { level: 1, minXp: 0, maxXp: 500, title: "🌱 Dompet Tipis Rookie" },
    { level: 2, minXp: 500, maxXp: 1200, title: "🪙 Receh Collector" },
    { level: 3, minXp: 1200, maxXp: 2000, title: "🛡️ Anti-FOMO Guardian" },
    { level: 4, minXp: 2000, maxXp: 3000, title: "⚡ Hype Micro-Investor" },
    { level: 5, minXp: 3000, maxXp: 4500, title: "🚀 Portfolio Alchemist" },
    { level: 6, minXp: 4500, maxXp: 6500, title: "👑 Gen Z Sultan Melek Finansial" }
  ];

  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].minXp && (xp < levels[i].maxXp || i === levels.length - 1)) {
      return {
        level: levels[i].level,
        title: levels[i].title,
        minXp: levels[i].minXp,
        maxXp: levels[i].maxXp,
        xpToNext: levels[i].maxXp - xp
      };
    }
  }
  return { level: 6, title: "👑 Gen Z Sultan Melek Finansial", minXp: 4500, maxXp: 10000, xpToNext: 0 };
}

// GET /api/user
router.get('/', (req, res) => {
  const db = getDb();
  const user = db.user;
  
  // Calculate total portfolio value from holdings
  let investedTotal = 0;
  let totalCost = 0;

  db.userHoldings.forEach(holding => {
    const asset = db.assets.find(a => a.id === holding.assetId);
    if (asset) {
      const currentVal = holding.units * asset.unitPrice;
      investedTotal += currentVal;
      totalCost += (holding.units * holding.avgBuyPrice);
    }
  });

  const netWorth = user.cashBalance + investedTotal + user.roundUpSettings.accumulatedRoundUp;
  const totalReturn = investedTotal - totalCost;
  const totalReturnPercent = totalCost > 0 ? ((totalReturn / totalCost) * 100).toFixed(2) : 0;
  const levelInfo = calculateLevel(user.xp);

  res.json({
    ...user,
    levelInfo,
    netWorth,
    investedBalance: investedTotal,
    totalEarnings: totalReturn,
    totalEarningsPercent: parseFloat(totalReturnPercent)
  });
});

// PUT /api/user/roundup-settings
router.put('/roundup-settings', (req, res) => {
  const db = getDb();
  const { enabled, multiplier, targetAssetId, autoInvestThreshold } = req.body;

  if (enabled !== undefined) db.user.roundUpSettings.enabled = Boolean(enabled);
  if (multiplier !== undefined) db.user.roundUpSettings.multiplier = Number(multiplier);
  if (targetAssetId !== undefined) db.user.roundUpSettings.targetAssetId = targetAssetId;
  if (autoInvestThreshold !== undefined) db.user.roundUpSettings.autoInvestThreshold = Number(autoInvestThreshold);

  saveDb(db);
  res.json({ success: true, roundUpSettings: db.user.roundUpSettings });
});

// POST /api/user/add-xp
router.post('/add-xp', (req, res) => {
  const db = getDb();
  const { xp, reason } = req.body;
  const amount = Number(xp) || 0;

  const oldLevel = calculateLevel(db.user.xp).level;
  db.user.xp += amount;
  const newLevelInfo = calculateLevel(db.user.xp);

  const leveledUp = newLevelInfo.level > oldLevel;
  if (leveledUp) {
    db.user.level = newLevelInfo.level;
  }

  saveDb(db);
  res.json({
    success: true,
    addedXp: amount,
    newXp: db.user.xp,
    level: newLevelInfo.level,
    title: newLevelInfo.title,
    leveledUp,
    reason: reason || "Aksi Finansial Keren"
  });
});

// POST /api/user/checkin (Daily streak)
router.post('/checkin', (req, res) => {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];
  const lastActive = db.user.streakLastActive;

  let streakIncremented = false;
  if (lastActive !== today) {
    db.user.streak += 1;
    db.user.streakLastActive = today;
    db.user.xp += 75; // Streak check-in bonus XP
    streakIncremented = true;

    // Check streak quests
    const streakQuest = db.quests.find(q => q.id === 'q-4');
    if (streakQuest) {
      streakQuest.progress = Math.min(streakQuest.target, db.user.streak);
      if (streakQuest.progress >= streakQuest.target) streakQuest.completed = true;
    }

    // Check streak badge
    if (db.user.streak >= 7) {
      const badge = db.badges.find(b => b.id === 'b-1');
      if (badge && !badge.unlocked) {
        badge.unlocked = true;
        badge.unlockedAt = today;
      }
    }

    saveDb(db);
  }

  res.json({
    success: true,
    streak: db.user.streak,
    streakIncremented,
    message: streakIncremented ? `🔥 Streak bertambah jadi ${db.user.streak} hari! Bonus +75 XP!` : "Kamu sudah check-in hari ini! Pertahankan terus besok ya!"
  });
});

// POST /api/user/toggle-sound
router.post('/toggle-sound', (req, res) => {
  const db = getDb();
  db.user.soundEnabled = !db.user.soundEnabled;
  saveDb(db);
  res.json({ success: true, soundEnabled: db.user.soundEnabled });
});

module.exports = router;
