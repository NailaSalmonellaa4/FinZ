import React, { useState } from 'react';
import { X, Sliders, Coins, Sparkles, Check } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function RoundUpSettingsModal({ 
  isOpen, 
  onClose, 
  user, 
  portfolio, 
  onSaveSettings 
}) {
  if (!isOpen) return null;

  const currentSettings = user?.roundUpSettings || {
    enabled: true,
    multiplier: 1,
    targetAssetId: 'green-future',
    autoInvestThreshold: 50000
  };

  const [enabled, setEnabled] = useState(currentSettings.enabled);
  const [multiplier, setMultiplier] = useState(currentSettings.multiplier || 1);
  const [targetAssetId, setTargetAssetId] = useState(currentSettings.targetAssetId || 'green-future');
  const [threshold, setThreshold] = useState(currentSettings.autoInvestThreshold || 50000);
  const [loading, setLoading] = useState(false);

  const assets = portfolio?.assets || [];

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    sounds.playSuccess();
    await onSaveSettings({
      enabled,
      multiplier: Number(multiplier),
      targetAssetId,
      autoInvestThreshold: Number(threshold)
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border-white/10 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Konfigurasi FinZ Round-Up
          </span>
        </div>

        <h3 className="text-xl font-black text-white font-['Space_Grotesk'] mb-4">
          Pengaturan Pundi Receh
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-white/5">
            <div>
              <span className="text-xs font-bold text-white block">Status Round-Up Otomatis</span>
              <span className="text-[11px] text-slate-400">Bulatkan setiap pengeluaran ke Rp 5.000 terdekat</span>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
            />
          </div>

          {/* Multiplier Boost */}
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">
              Pengali Pembulatan (Multiplier Boost)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 5, 10].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMultiplier(m)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    multiplier === m
                      ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-400/20'
                      : 'bg-slate-900 text-slate-400 border-white/5 hover:bg-slate-800'
                  }`}
                >
                  {m}x
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Contoh 2x: Sisa Rp 2.500 jadi Rp 5.000 yang dialihkan ke tabungan investasi.
            </p>
          </div>

          {/* Target Asset */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Portofolio Tujuan Alokasi Receh
            </label>
            <select
              value={targetAssetId}
              onChange={(e) => setTargetAssetId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — ({a.risk})
                </option>
              ))}
            </select>
          </div>

          {/* Auto Invest Threshold */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Ambang Auto-Sweep (IDR)
            </label>
            <select
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
            >
              <option value={20000}>Rp 20.000</option>
              <option value={50000}>Rp 50.000 (Direkomendasikan)</option>
              <option value={100000}>Rp 100.000</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </form>
      </div>
    </div>
  );
}
