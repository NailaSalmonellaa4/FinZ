import React from 'react';
import { 
  Wallet, 
  Coins, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  PlusCircle, 
  Zap,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../utils/sound';

export default function HeaderStats({ 
  user, 
  portfolio, 
  onOpenAddTx, 
  onOpenSweepModal, 
  onOpenRoundUpSettings,
  onOpenJargonBuster 
}) {
  const netWorth = user?.netWorth || 0;
  const cashBalance = user?.cashBalance || 0;
  const accumulatedRoundUp = user?.roundUpSettings?.accumulatedRoundUp || 0;
  const investedBalance = user?.investedBalance || 0;
  const totalEarningsPercent = user?.totalEarningsPercent || 0;

  const xpCurrent = user?.xp || 0;
  const levelInfo = user?.levelInfo || { level: 4, title: "⚡ Hype Micro-Investor", minXp: 2000, maxXp: 3000 };
  const xpInCurrentLevel = Math.max(0, xpCurrent - (levelInfo.minXp || 0));
  const xpNeededInCurrentLevel = Math.max(1, (levelInfo.maxXp || 3000) - (levelInfo.minXp || 0));
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededInCurrentLevel) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Total Net Worth */}
      <div className="glass-panel p-5 rounded-3xl relative overflow-hidden group border-lime-400/20 hover:border-lime-400/40 transition-all">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-lime-500/10 rounded-full blur-2xl group-hover:bg-lime-500/20 transition-all" />
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" /> Total Uang & Aset
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <ArrowUpRight className="w-3 h-3" /> +{totalEarningsPercent}% Cuan
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk'] tracking-tight">
          Rp {netWorth.toLocaleString('id-ID')}
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
          <span>Aset Aktif:</span>
          <span className="font-semibold text-lime-400">Rp {investedBalance.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* 2. Cash Balance (Uang di Dompet) */}
      <div className="glass-panel p-5 rounded-3xl relative overflow-hidden group hover:border-blue-400/30 transition-all">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-blue-400" /> Uang Siap Pakai
          </span>
          <button 
            onClick={() => { sounds.playClick(); onOpenAddTx(); }}
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 transition-colors flex items-center gap-1"
          >
            <PlusCircle className="w-3 h-3" /> + Catat
          </button>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk'] tracking-tight">
          Rp {cashBalance.toLocaleString('id-ID')}
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
          <span>Bebas buat kebutuhan</span>
          <span className="text-emerald-400 font-medium">Aman</span>
        </div>
      </div>

      {/* 3. Celengan Receh Jajan (Round-Up Stash) */}
      <div className="glass-panel p-5 rounded-3xl relative overflow-hidden group border-amber-400/20 hover:border-amber-400/40 transition-all">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" /> Celengan Receh Jajan
          </span>
          <button 
            onClick={() => { sounds.playClick(); onOpenRoundUpSettings(); }}
            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20"
          >
            {user?.roundUpSettings?.multiplier || 1}x Boost
          </button>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-amber-300 font-['Space_Grotesk'] tracking-tight">
          Rp {accumulatedRoundUp.toLocaleString('id-ID')}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">Dari sisa pembulatan</span>
          <button
            onClick={() => {
              if (accumulatedRoundUp >= 5000) {
                sounds.playCoin();
                onOpenSweepModal();
              }
            }}
            disabled={accumulatedRoundUp < 5000}
            className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
              accumulatedRoundUp >= 5000
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:opacity-90 shadow-sm shadow-amber-500/30 cursor-pointer'
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
            }`}
          >
            🚀 Investasikan
          </button>
        </div>
      </div>

      {/* 4. Level & Gamification Status */}
      <div className="glass-panel p-5 rounded-3xl relative overflow-hidden group border-purple-400/20 hover:border-purple-400/40 transition-all">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-purple-400" /> Level Melek Finansial
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
            Lv.{user?.level || 1}
          </span>
        </div>
        <div className="text-base font-black text-white truncate font-['Space_Grotesk']">
          {levelInfo.title}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span>Menuju Level Berikutnya</span>
            <span className="text-purple-300">{xpCurrent} / {levelInfo.maxXp} XP</span>
          </div>
          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div 
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-lime-400 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
