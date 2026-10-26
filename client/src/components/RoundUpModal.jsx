import React, { useState } from 'react';
import { X, Coins, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function RoundUpModal({ isOpen, onClose, user, portfolio, onConfirmSweep }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const roundUpAmount = user?.roundUpSettings?.accumulatedRoundUp || 0;
  const targetId = user?.roundUpSettings?.targetAssetId || 'green-future';
  const targetAsset = portfolio?.assets?.find(a => a.id === targetId) || portfolio?.assets?.[0];

  const handleSweep = async () => {
    setLoading(true);
    sounds.playCoin();
    await onConfirmSweep();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border-amber-400/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 mx-auto flex items-center justify-center text-black mb-3 shadow-lg shadow-amber-400/30">
          <Coins className="w-7 h-7 fill-black" />
        </div>

        <h3 className="text-xl font-black text-white font-['Space_Grotesk'] text-center mb-1">
          Investasikan Pundi Receh
        </h3>
        <p className="text-xs text-slate-400 text-center mb-5">
          Sisa pembulatan transaksimu siap disulap menjadi bibit investasi masa depan!
        </p>

        <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-3 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Pundi Terkumpul:</span>
            <span className="text-lg font-black text-amber-300 font-['Space_Grotesk']">
              Rp {roundUpAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Target Portofolio:</span>
            <span className="font-bold text-white flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-lime-400" />
              {targetAsset?.name || 'ESG EcoWarrior'}
            </span>
          </div>

          <div className="pt-2 border-t border-white/5 flex justify-between text-xs text-slate-400">
            <span>Estimasi Unit Didapat:</span>
            <span className="font-bold text-lime-400">
              {targetAsset ? (roundUpAmount / targetAsset.unitPrice).toFixed(4) : 0} Unit
            </span>
          </div>

          <div className="text-[11px] text-amber-400/90 italic text-center pt-1">
            ✨ Bonus +150 XP gamifikasi untuk setiap auto-sweep!
          </div>
        </div>

        <button
          onClick={handleSweep}
          disabled={loading || roundUpAmount < 5000}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Mengalihkan Receh...' : 'Sulap Receh Jadi Investasi Sekarang'}
        </button>
      </div>
    </div>
  );
}
