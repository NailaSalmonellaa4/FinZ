import React, { useState } from 'react';
import { X, ShieldAlert, Clock, Coffee, TrendingUp, AlertTriangle, Sparkles, Gamepad2 } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function FomoCalculatorModal({ isOpen, onClose, onCheckFomo }) {
  if (!isOpen) return null;

  const [itemName, setItemName] = useState('Sepatu Sneakers Viral');
  const [price, setPrice] = useState('1250000');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    { name: 'Gantungan Boneka Labubu 🧸', price: 650000 },
    { name: 'Tiket Konser K-Pop / Niki 🎤', price: 1850000 },
    { name: 'Headphone Wireless ANC 🎧', price: 2400000 },
    { name: 'Skin Valorant / Top-up Game 🎮', price: 350000 }
  ];

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    if (!price || Number(price) <= 0) return;

    setLoading(true);
    sounds.playClick();
    const data = await onCheckFomo({
      itemName,
      price: Number(price),
      hourlyWage: 28000
    });
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border-rose-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Anti-Impulsive Buying & Reality Check
          </span>
        </div>

        <h3 className="text-xl font-black text-white font-['Space_Grotesk'] mb-1">
          FOMO Shield (Rem Belanja Impulsif)
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Sebelum checkout barang viral, lihat dulu setara berapa jam kerja, berapa gelas kopi, dan berapa Robux/Diamond game!
        </p>

        {/* Quick Presets */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Godaan Belanja Populer:</label>
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setItemName(p.name);
                  setPrice(p.price.toString());
                }}
                className={`p-2 rounded-xl text-left text-xs border transition-all ${
                  itemName === p.name 
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold' 
                    : 'bg-slate-900 border-white/5 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="truncate">{p.name}</div>
                <div className="text-[10px] text-slate-400">Rp {p.price.toLocaleString('id-ID')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <form onSubmit={handleCalculate} className="space-y-4 mb-5">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Nama Barang yang Bikin Kamu Tergoda</label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Harga Barang (IDR)</label>
            <input
              type="number"
              min="10000"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-400 font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Menghitung Konversi...' : 'Uji Nyali Finansial (Hitung Sekarang)'}
          </button>
        </form>

        {/* Reality Check Results */}
        {result && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              
              <div className="p-2.5 rounded-xl bg-white/5">
                <Clock className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span className="text-[10px] text-slate-400 uppercase block">Jam Kerja</span>
                <span className="text-xs sm:text-sm font-black text-amber-400">{result.hoursNeeded} Jam</span>
                <span className="text-[9px] text-slate-500 block">({result.workDaysNeeded} Hari)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5">
                <Coffee className="w-4 h-4 mx-auto mb-1 text-pink-400" />
                <span className="text-[10px] text-slate-400 uppercase block">Setara Kopi</span>
                <span className="text-xs sm:text-sm font-black text-pink-400">{result.coffeeCupsEquivalent} Gelas</span>
                <span className="text-[9px] text-slate-500 block">Iced Latte</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5">
                <Gamepad2 className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                <span className="text-[10px] text-slate-400 uppercase block">Setara Game</span>
                <span className="text-xs sm:text-sm font-black text-purple-400">
                  {result.robuxEquivalent ? `${result.robuxEquivalent.toLocaleString('id-ID')} R$` : `${result.mlbbDiamonds} Dia`}
                </span>
                <span className="text-[9px] text-slate-500 block">Robux / Diamond</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5">
                <TrendingUp className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                <span className="text-[10px] text-slate-400 uppercase block">Nilai 5 Tahun</span>
                <span className="text-xs sm:text-sm font-black text-emerald-400">
                  Rp {(result.compoundFutureValue / 1000).toFixed(0)}k
                </span>
                <span className="text-[9px] text-emerald-400/80 block">+76% Bola Salju</span>
              </div>

            </div>

            {/* Verdict Box */}
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs leading-relaxed">
              <span className="font-bold text-rose-300 block mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Vonis Anti-FOMO FinZ:
              </span>
              <p className="text-slate-300">{result.roastVerdict}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
