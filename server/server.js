const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const savingRoutes = require('./routes/savings');
const investRoutes = require('./routes/invest');
const gamificationRoutes = require('./routes/gamification');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/savings', savingRoutes);
app.use('/api/invest', investRoutes);
app.use('/api/gamification', gamificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'FinZ - Platform Edukasi Keuangan',
    version: '2.0',
    note: 'Simulasi investasi menggunakan saldo virtual untuk tujuan edukasi.'
  });
});

// Serve static frontend
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  }
  next();
});

app.listen(PORT, () => {
  console.log(`\n🚀 FinZ v2.0 Server aktif di http://localhost:${PORT}`);
  console.log(`📖 Platform Edukasi Keuangan — Simulasi Virtual Only\n`);
});
