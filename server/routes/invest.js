const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb, saveDb, getLevelInfo } = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

const XP_BUY = 60;
const XP_SELL = 40;

// GET /api/invest — Assets list + user portfolio
router.get('/', (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.userId);

  const userPortfolio = db.investPortfolios.filter(p => p.userId === req.userId);

  const assetsWithHolding = db.investAssets.map(asset => {
    const holding = userPortfolio.find(p => p.assetId === asset.id);
    const units = holding ? holding.units : 0;
    const avgBuyPrice = holding ? holding.avgBuyPrice : 0;
    const totalInvested = holding ? holding.totalInvested : 0;
    const currentValue = units * asset.pricePerUnit;
    const gainLoss = currentValue - totalInvested;
    const gainLossPercent = totalInvested > 0 ? parseFloat(((gainLoss / totalInvested) * 100).toFixed(2)) : 0;

    return {
      ...asset,
      holding: { units, avgBuyPrice, totalInvested, currentValue, gainLoss, gainLossPercent }
    };
  });

  // Portfolio summary
  const totalPortfolioValue = assetsWithHolding.reduce((s, a) => s + a.holding.currentValue, 0);
  const totalInvested = assetsWithHolding.reduce((s, a) => s + a.holding.totalInvested, 0);
  const totalGainLoss = totalPortfolioValue - totalInvested;

  res.json({
    virtualBalance: user.virtualBalance,
    assets: assetsWithHolding,
    summary: {
      totalPortfolioValue,
      totalInvested,
      totalGainLoss,
      totalGainPercent: totalInvested > 0 ? parseFloat(((totalGainLoss / totalInvested) * 100).toFixed(2)) : 0
    },
    disclaimer: '⚠️ PENTING: Ini adalah simulasi investasi edukasi menggunakan saldo virtual. Harga aset adalah data contoh untuk pembelajaran. Bukan transaksi investasi nyata.'
  });
});

// POST /api/invest/buy
router.post('/buy', (req, res) => {
  const db = getDb();
  const { assetId, amount } = req.body; // amount in IDR virtual
  const idrAmount = Number(amount);

  if (!idrAmount || idrAmount < 1000)
    return res.status(400).json({ error: 'Minimal pembelian simulasi adalah Rp 1.000 saldo virtual.' });

  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Akun tidak ditemukan.' });

  if (user.virtualBalance < idrAmount)
    return res.status(400).json({ error: `Saldo virtual tidak cukup. Saldo kamu: Rp ${user.virtualBalance.toLocaleString('id-ID')}` });

  const asset = db.investAssets.find(a => a.id === assetId);
  if (!asset) return res.status(404).json({ error: 'Aset simulasi tidak ditemukan.' });

  const unitsBought = parseFloat((idrAmount / asset.pricePerUnit).toFixed(6));
  const balanceBefore = user.virtualBalance;
  user.virtualBalance -= idrAmount;

  // Update or create portfolio holding
  let holding = db.investPortfolios.find(p => p.userId === req.userId && p.assetId === assetId);
  if (!holding) {
    holding = { id: uuidv4(), userId: req.userId, assetId, units: 0, avgBuyPrice: 0, totalInvested: 0 };
    db.investPortfolios.push(holding);
  }
  const prevTotal = holding.units * holding.avgBuyPrice;
  holding.units = parseFloat((holding.units + unitsBought).toFixed(6));
  holding.totalInvested += idrAmount;
  holding.avgBuyPrice = holding.units > 0 ? parseFloat((holding.totalInvested / holding.units).toFixed(2)) : 0;

  // Record history
  db.investHistory.push({
    id: uuidv4(),
    userId: req.userId,
    assetId,
    assetName: asset.name,
    type: 'buy',
    units: unitsBought,
    pricePerUnit: asset.pricePerUnit,
    totalAmount: idrAmount,
    virtualBalanceBefore: balanceBefore,
    virtualBalanceAfter: user.virtualBalance,
    date: new Date().toISOString()
  });

  // XP
  user.xp += XP_BUY;
  const levelInfo = getLevelInfo(user.xp);
  user.level = levelInfo.level;

  // Quest q-weekly-2
  const uq = db.userQuests.find(q => q.userId === req.userId && q.questId === 'q-weekly-2' && !q.completed);
  if (uq) { uq.progress += 1; if (uq.progress >= 1) uq.completed = true; }

  // Badge: Investor Virtual (5 transaksi)
  const investTxCount = db.investHistory.filter(h => h.userId === req.userId).length;
  if (investTxCount >= 5) {
    const already = db.userBadges.find(ub => ub.userId === req.userId && ub.badgeId === 'b-4');
    if (!already) {
      db.userBadges.push({ userId: req.userId, badgeId: 'b-4', unlockedAt: new Date().toISOString() });
    }
  }

  saveDb(db);

  res.json({
    success: true,
    message: `[SIMULASI] Berhasil membeli ${unitsBought} unit "${asset.name}" dengan Rp ${idrAmount.toLocaleString('id-ID')} saldo virtual! +${XP_BUY} XP`,
    unitsBought,
    newVirtualBalance: user.virtualBalance,
    xpEarned: XP_BUY,
    levelInfo,
    disclaimer: 'Ini adalah transaksi simulasi edukasi. Bukan investasi uang sungguhan.'
  });
});

// POST /api/invest/sell
router.post('/sell', (req, res) => {
  const db = getDb();
  const { assetId, units } = req.body;
  const unitsToSell = parseFloat(units);

  if (!unitsToSell || unitsToSell <= 0)
    return res.status(400).json({ error: 'Jumlah unit yang dijual harus positif.' });

  const holding = db.investPortfolios.find(p => p.userId === req.userId && p.assetId === assetId);
  if (!holding || holding.units < unitsToSell)
    return res.status(400).json({ error: 'Unit tidak cukup untuk dijual.' });

  const asset = db.investAssets.find(a => a.id === assetId);
  if (!asset) return res.status(404).json({ error: 'Aset tidak ditemukan.' });

  const idrReceived = parseFloat((unitsToSell * asset.pricePerUnit).toFixed(2));
  const user = db.users.find(u => u.id === req.userId);
  const balanceBefore = user.virtualBalance;
  user.virtualBalance += idrReceived;

  // Update holding
  holding.units = parseFloat((holding.units - unitsToSell).toFixed(6));
  holding.totalInvested = holding.units * holding.avgBuyPrice;
  if (holding.units <= 0.000001) {
    db.investPortfolios = db.investPortfolios.filter(p => !(p.userId === req.userId && p.assetId === assetId));
  }

  // History
  db.investHistory.push({
    id: uuidv4(),
    userId: req.userId,
    assetId,
    assetName: asset.name,
    type: 'sell',
    units: unitsToSell,
    pricePerUnit: asset.pricePerUnit,
    totalAmount: idrReceived,
    virtualBalanceBefore: balanceBefore,
    virtualBalanceAfter: user.virtualBalance,
    date: new Date().toISOString()
  });

  // XP
  user.xp += XP_SELL;
  const levelInfo = getLevelInfo(user.xp);
  user.level = levelInfo.level;

  saveDb(db);

  res.json({
    success: true,
    message: `[SIMULASI] Berhasil menjual ${unitsToSell} unit "${asset.name}" dan menerima Rp ${idrReceived.toLocaleString('id-ID')} saldo virtual! +${XP_SELL} XP`,
    idrReceived,
    newVirtualBalance: user.virtualBalance,
    xpEarned: XP_SELL,
    levelInfo,
    disclaimer: 'Ini adalah transaksi simulasi edukasi. Bukan investasi uang sungguhan.'
  });
});

// GET /api/invest/history
router.get('/history', (req, res) => {
  const db = getDb();
  const history = db.investHistory
    .filter(h => h.userId === req.userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json({
    history,
    disclaimer: '⚠️ Semua transaksi di bawah ini adalah SIMULASI EDUKASI menggunakan saldo virtual. Bukan transaksi uang sungguhan.'
  });
});

module.exports = router;
