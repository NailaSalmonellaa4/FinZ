import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import DashboardTab from './components/DashboardTab';
import TransactionsTab from './components/TransactionsTab';
import BudgetTab from './components/BudgetTab';
import SavingsTab from './components/SavingsTab';
import InvestTab from './components/InvestTab';
import QuestsTab from './components/QuestsTab';
import AddTransactionModal from './components/AddTransactionModal';

import { api, getToken, removeToken } from './utils/api';
import { sounds } from './utils/sound';

export default function App() {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Dark & Light Mode Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finz_theme') || 'dark';
  });

  // Apply Theme to <html> element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('finz_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      showToast(next === 'light' ? 'Mode Terang Diaktifkan ☀️' : 'Mode Gelap Diaktifkan 🌙');
      return next;
    });
  };

  // Core Data States
  const [transactionsData, setTransactionsData] = useState(null);
  const [budgetsData, setBudgetsData] = useState(null);
  const [savingsData, setSavingsData] = useState(null);
  const [investData, setInvestData] = useState(null);
  const [investHistory, setInvestHistory] = useState([]);
  const [gamificationData, setGamificationData] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);

  // Modal & Toast
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch all user data
  const loadUserData = useCallback(async () => {
    try {
      const [me, txs, bgs, svs, inv, invH, gam, qz] = await Promise.all([
        api.getMe(),
        api.getTransactions(),
        api.getBudgets(),
        api.getSavings(),
        api.getInvest(),
        api.getInvestHistory(),
        api.getGamification(),
        api.getQuiz()
      ]);

      setUser(me);
      setTransactionsData(txs);
      setBudgetsData(bgs);
      setSavingsData(svs);
      setInvestData(inv);
      setInvestHistory(invH?.history || []);
      setGamificationData(gam);
      setQuizQuestions(qz?.questions || []);
      setSoundEnabled(me.soundEnabled !== false);
      sounds.toggle(me.soundEnabled !== false);
    } catch (err) {
      console.error('Error fetching FinZ data:', err);
      if (err.message && (err.message.includes('Token') || err.message.includes('Akses ditolak') || err.message.includes('kadaluarsa'))) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [token, loadUserData]);

  const handleAuthSuccess = (authUser, welcomeMessage) => {
    setTokenState(getToken());
    setUser(authUser);
    showToast(welcomeMessage || 'Login berhasil!');
    loadUserData();
  };

  const handleLogout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
    setActiveTab('dashboard');
    showToast('Kamu telah keluar dari akun.');
  };

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.toggle(newState);
    if (newState) sounds.playCoin();
    showToast(newState ? 'Suara SFX Diaktifkan 🔊' : 'Suara SFX Dimatikan 🔇');
  };

  // Transaction Handlers
  const handleAddTransaction = async (formData) => {
    const res = await api.addTransaction(formData);
    showToast(res.message);
    loadUserData();
    return res;
  };

  const handleDeleteTransaction = async (id) => {
    const res = await api.deleteTransaction(id);
    showToast(res.message);
    loadUserData();
  };

  // Budget Handlers
  const handleAddBudget = async (formData) => {
    const res = await api.addBudget(formData);
    showToast(res.message);
    loadUserData();
    return res;
  };

  const handleDeleteBudget = async (id) => {
    const res = await api.deleteBudget(id);
    showToast(res.message);
    loadUserData();
  };

  // Savings Handlers
  const handleAddSaving = async (formData) => {
    const res = await api.addSavingTarget(formData);
    showToast(res.message);
    loadUserData();
    return res;
  };

  const handleDepositSaving = async (id, formData) => {
    const res = await api.depositSaving(id, formData);
    showToast(res.message);
    loadUserData();
    return res;
  };

  const handleDeleteSaving = async (id) => {
    const res = await api.deleteSaving(id);
    showToast(res.message);
    loadUserData();
  };

  // Invest Handlers
  const handleBuyAsset = async (formData) => {
    const res = await api.buyAsset(formData);
    showToast(res.message);
    loadUserData();
    return res;
  };

  const handleSellAsset = async (formData) => {
    const res = await api.sellAsset(formData);
    showToast(res.message);
    loadUserData();
    return res;
  };

  // Gamification Handlers
  const handleClaimQuest = async (id) => {
    const res = await api.claimQuest(id);
    showToast(res.message);
    loadUserData();
    return res;
  };

  const handleAnswerQuiz = async (formData) => {
    const res = await api.answerQuiz(formData);
    showToast(res.message);
    loadUserData();
    return res;
  };

  // If not logged in, render AuthPage
  if (!token) {
    return (
      <div className="min-h-screen font-['Plus_Jakarta_Sans',sans-serif]">
        <AuthPage 
          onAuthSuccess={handleAuthSuccess}
          theme={theme}
          toggleTheme={handleToggleTheme}
        />
      </div>
    );
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Memuat FinZ Platform Edukasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-lime-400 selection:text-black transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        soundEnabled={soundEnabled}
        toggleSound={handleToggleSound}
        theme={theme}
        toggleTheme={handleToggleTheme}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab Router */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            user={user}
            transactions={transactionsData}
            budgets={budgetsData}
            savings={savingsData}
            investData={investData}
            gamification={gamificationData}
            setActiveTab={setActiveTab}
            onOpenAddTx={() => setIsAddTxOpen(true)}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsTab
            data={transactionsData}
            onAdd={handleAddTransaction}
            onDelete={handleDeleteTransaction}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetTab
            data={budgetsData}
            onAdd={handleAddBudget}
            onDelete={handleDeleteBudget}
          />
        )}

        {activeTab === 'savings' && (
          <SavingsTab
            data={savingsData}
            onAdd={handleAddSaving}
            onDeposit={handleDepositSaving}
            onDelete={handleDeleteSaving}
          />
        )}

        {activeTab === 'invest' && (
          <InvestTab
            data={investData}
            history={investHistory}
            onBuy={handleBuyAsset}
            onSell={handleSellAsset}
            onRefresh={loadUserData}
          />
        )}

        {activeTab === 'quests' && (
          <QuestsTab
            gamificationData={gamificationData}
            quizQuestions={quizQuestions}
            onClaimQuest={handleClaimQuest}
            onAnswerQuiz={handleAnswerQuiz}
            onRefresh={loadUserData}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500 bg-[#070a10] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-['Space_Grotesk']">Fin<span className="text-lime-400">Z</span></span>
            <span>— Platform Edukasi Keuangan & Simulasi Investasi</span>
          </div>
          <div className="text-[11px] text-slate-500">
            ⚠️ Simulasi edukasi menggunakan saldo virtual. Bukan transaksi atau rekomendasi keuangan riil.
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs sm:text-sm font-bold ${
            toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/50'
              : 'bg-slate-900/95 text-white border-lime-400/40 shadow-lime-400/10'
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Global Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        onAddTx={handleAddTransaction}
        categories={transactionsData?.categories}
      />

    </div>
  );
}
