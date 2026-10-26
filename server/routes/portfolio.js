const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');
const { v4: uuidv4 } = require('uuid');

// GET /api/portfolio
router.get('/', (req, res) => {
  const db = getDb();
  
  // Enhance assets with user holding details
  const enhancedAssets = db.assets.map(asset => {
    const holding = db.userHoldings.find(h => h.assetId === asset.id);
    const units = holding ? holding.units : 0;
    const avgBuyPrice = holding ? holding.avgBuyPrice : 0;
    const currentValue = units * asset.unitPrice;
    const totalInvested = units * avgBuyPrice;
    const gainLoss = currentValue - totalInvested;
    const gainLossPercent = totalInvested > 0 ? ((gainLoss / totalInvested) * 100).toFixed(2) : 0;

    return {
      ...asset,
      userHolding: {
        units,
        avgBuyPrice,
        totalInvested,
        currentValue,
        gainLoss,
        gainLossPercent: parseFloat(gainLossPercent)
      }
    };
  });

  // Calculate portfolio totals
  let totalPortfolioValue = 0;
  let totalCost = 0;
  enhancedAssets.forEach(a => {
    totalPortfolioValue += a.userHolding.currentValue;
    totalCost += a.userHolding.totalInvested;
  });

  const totalGainLoss = totalPortfolioValue - totalCost;
  const totalGainPercent = totalCost > 0 ? ((totalGainLoss / totalCost) * 100).toFixed(2) : 0;

  // Aggregate historical chart points (synthetic composite index)
  const compositeChart = [
    { name: "Sen", value: Math.round(totalPortfolioValue * 0.94) },
    { name: "Sel", value: Math.round(totalPortfolioValue * 0.96) },
    { name: "Rab", value: Math.round(totalPortfolioValue * 0.97) },
    { name: "Kam", value: Math.round(totalPortfolioValue * 0.985) },
    { name: "Jum", value: Math.round(totalPortfolioValue * 0.99) },
    { name: "Sab", value: Math.round(totalPortfolioValue * 0.995) },
    { name: "Hari Ini", value: totalPortfolioValue }
  ];

  res.json({
    assets: enhancedAssets,
    summary: {
      totalPortfolioValue,
      totalCost,
      totalGainLoss,
      totalGainPercent: parseFloat(totalGainPercent),
      accumulatedRoundUp: db.user.roundUpSettings.accumulatedRoundUp,
      targetAssetId: db.user.roundUpSettings.targetAssetId
    },
    compositeChart
  });
});

// POST /api/portfolio/buy (Micro fractional buy)
router.post('/buy', (req, res) => {
  const db = getDb();
  const { assetId, amount } = req.body; // amount in IDR
  const idrAmount = Number(amount);

  if (!idrAmount || idrAmount < 5000) {
    return res.status(400).json({ error: "Minimal investasi mikro adalah Rp 5.000!" });
  }

  if (db.user.cashBalance < idrAmount) {
    return res.status(400).json({ error: "Saldo tunai tidak mencukupi untuk investasi ini!" });
  }

  const asset = db.assets.find(a => a.id === assetId);
  if (!asset) {
    return res.status(404).json({ error: "Aset portofolio tidak ditemukan!" });
  }

  // Deduct cash
  db.user.cashBalance -= idrAmount;

  // Calculate fractional units bought
  const unitsPurchased = parseFloat((idrAmount / asset.unitPrice).toFixed(4));

  // Find or create holding
  let holding = db.userHoldings.find(h => h.assetId === assetId);
  if (!holding) {
    holding = {
      assetId,
      units: unitsPurchased,
      avgBuyPrice: asset.unitPrice,
      totalInvested: idrAmount,
      currentValue: idrAmount,
      gainLoss: 0,
      gainLossPercent: 0
    };
    db.userHoldings.push(holding);
  } else {
    const prevTotal = holding.units * holding.avgBuyPrice;
    const newTotal = prevTotal + idrAmount;
    holding.units = parseFloat((holding.units + unitsPurchased).toFixed(4));
    holding.avgBuyPrice = Math.round(newTotal / holding.units);
    holding.totalInvested = newTotal;
    holding.currentValue = holding.units * asset.unitPrice;
    holding.gainLoss = holding.currentValue - holding.totalInvested;
    holding.gainLossPercent = parseFloat(((holding.gainLoss / holding.totalInvested) * 100).toFixed(2));
  }

  // Record investment transaction
  const tx = {
    id: `tx-${Date.now()}`,
    title: `Beli Mikro: ${asset.name}`,
    category: "Investasi Mikro",
    type: "invest",
    amount: idrAmount,
    roundUpAmount: 0,
    roundedTotal: idrAmount,
    date: new Date().toISOString(),
    icon: "TrendingUp",
    isRoundUpEligible: false,
    investedTo: assetId,
    note: `Beli ${unitsPurchased} unit ${asset.name}`
  };
  db.transactions.unshift(tx);

  // Gamification: Give XP for investing
  const xpReward = Math.min(250, Math.max(50, Math.floor(idrAmount / 1000)));
  db.user.xp += xpReward;

  // Update Quest q-3 if active
  const quest3 = db.quests.find(q => q.id === 'q-3');
  if (quest3 && !quest3.completed) {
    quest3.progress = 1;
    quest3.completed = true;
  }

  saveDb(db);

  res.json({
    success: true,
    message: `Berhasil investasi Rp ${idrAmount.toLocaleString('id-ID')} ke ${asset.name}!`,
    unitsPurchased,
    xpReward,
    cashBalance: db.user.cashBalance
  });
});

// POST /api/portfolio/sell
router.post('/sell', (req, res) => {
  const db = getDb();
  const { assetId, units } = req.body;
  const unitsToSell = parseFloat(units);

  const holding = db.userHoldings.find(h => h.assetId === assetId);
  const asset = db.assets.find(a => a.id === assetId);

  if (!holding || holding.units < unitsToSell || unitsToSell <= 0) {
    return res.status(400).json({ error: "Jumlah unit penjualan tidak valid atau saldo unit kurang!" });
  }

  const idrReceived = Math.round(unitsToSell * asset.unitPrice);
  holding.units = parseFloat((holding.units - unitsToSell).toFixed(4));
  holding.currentValue = holding.units * asset.unitPrice;
  holding.totalInvested = holding.units * holding.avgBuyPrice;

  // Add cash
  db.user.cashBalance += idrReceived;

  // Clean up if 0 units
  if (holding.units <= 0.0001) {
    db.userHoldings = db.userHoldings.filter(h => h.assetId !== assetId);
  }

  // Record transaction
  const tx = {
    id: `tx-${Date.now()}`,
    title: `Pencairan Mikro: ${asset.name}`,
    category: "Pencairan Aset",
    type: "income",
    amount: idrReceived,
    roundUpAmount: 0,
    roundedTotal: idrReceived,
    date: new Date().toISOString(),
    icon: "ArrowDownLeft",
    isRoundUpEligible: false,
    investedTo: assetId,
    note: `Jual ${unitsToSell} unit ${asset.name}`
  };
  db.transactions.unshift(tx);

  saveDb(db);

  res.json({
    success: true,
    message: `Berhasil mencairkan Rp ${idrReceived.toLocaleString('id-ID')} dari ${asset.name}!`,
    cashBalance: db.user.cashBalance,
    remainingUnits: holding ? holding.units : 0
  });
});

// POST /api/portfolio/sweep-roundup
router.post('/sweep-roundup', (req, res) => {
  const db = getDb();
  const roundUpAmount = db.user.roundUpSettings.accumulatedRoundUp;

  if (roundUpAmount < 5000) {
    return res.status(400).json({ error: "Minimal pundi receh terkumpul Rp 5.000 untuk di-investasikan!" });
  }

  const targetAssetId = db.user.roundUpSettings.targetAssetId || "green-future";
  const asset = db.assets.find(a => a.id === targetAssetId);

  if (!asset) {
    return res.status(404).json({ error: "Target aset portofolio tidak ditemukan!" });
  }

  // Sweep round-up to 0
  db.user.roundUpSettings.accumulatedRoundUp = 0;

  // Add holding
  const unitsPurchased = parseFloat((roundUpAmount / asset.unitPrice).toFixed(4));
  let holding = db.userHoldings.find(h => h.assetId === targetAssetId);

  if (!holding) {
    holding = {
      assetId: targetAssetId,
      units: unitsPurchased,
      avgBuyPrice: asset.unitPrice,
      totalInvested: roundUpAmount,
      currentValue: roundUpAmount,
      gainLoss: 0,
      gainLossPercent: 0
    };
    db.userHoldings.push(holding);
  } else {
    const prevTotal = holding.units * holding.avgBuyPrice;
    const newTotal = prevTotal + roundUpAmount;
    holding.units = parseFloat((holding.units + unitsPurchased).toFixed(4));
    holding.avgBuyPrice = Math.round(newTotal / holding.units);
    holding.totalInvested = newTotal;
    holding.currentValue = holding.units * asset.unitPrice;
    holding.gainLoss = holding.currentValue - holding.totalInvested;
    holding.gainLossPercent = parseFloat(((holding.gainLoss / holding.totalInvested) * 100).toFixed(2));
  }

  // Record transaction
  const tx = {
    id: `tx-${Date.now()}`,
    title: `Sweep Pundi Receh ke ${asset.name}`,
    category: "Investasi Mikro",
    type: "invest",
    amount: roundUpAmount,
    roundUpAmount: 0,
    roundedTotal: roundUpAmount,
    date: new Date().toISOString(),
    icon: "Sparkles",
    isRoundUpEligible: false,
    investedTo: targetAssetId,
    note: `Auto-invest sisa receh terkumpul`
  };
  db.transactions.unshift(tx);

  // Bonus XP
  const xpReward = 150;
  db.user.xp += xpReward;

  // Check spare change wizard badge
  const badge3 = db.badges.find(b => b.id === 'b-3');
  if (badge3 && !badge3.unlocked) {
    badge3.unlocked = true;
    badge3.unlockedAt = new Date().toISOString().split('T')[0];
  }

  saveDb(db);

  res.json({
    success: true,
    message: `Pundi receh Rp ${roundUpAmount.toLocaleString('id-ID')} berhasil disulap jadi bibit investasi ${asset.name}!`,
    investedAmount: roundUpAmount,
    unitsPurchased,
    xpReward
  });
});

module.exports = router;
