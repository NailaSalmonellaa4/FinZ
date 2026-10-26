import React, { useState } from 'react';
import { X, TrendingUp, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function BuySellModal({ 
  isOpen, 
  onClose, 
  asset, 
  mode = 'buy', // 'buy' | 'sell'
  onConfirmBuy, 
  onConfirmSell, 
  user 
}) {
  if (!isOpen || !asset) return null;

  const isBuy = mode === 'buy';
  const [amount, setAmount] = useState(isBuy ? '10000' : '1');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const numValue = Number(amount) || 0;
  const unitPrice = asset.unitPrice;
  const holding = asset.userHolding || { units: 0, currentValue: 0 };

  // Calculate estimated units or proceeds
  const estimatedUnits = isBuy 
    ? (numValue > 0 ? (numValue / unitPrice).toFixed(4) : 0)
    : numValue;
  const estimatedProceeds = !isBuy 
    ? Math.round(numValue * unitPrice) 
    : numValue;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isBuy) {
      if (numValue < 5000) {
        setErrorMsg('Minimal pembelian mikro adalah Rp 5.000!');
        return;
      }
      if (numValue > user.cashBalance) {
        setErrorMsg('Saldo tunai tidak mencukupi untuk nominal ini!');
        return;
      }

      setLoading(true);
      sounds.playSuccess();
      try {
        await onConfirmBuy(asset.id, numValue);
        onClose();
      } catch (err) {
        setErrorMsg(err.message || 'Gagal melakukan pembelian');
      } finally {
        setLoading(false);
      }
    } else {
      // Sell
      if (numValue <= 0 || numValue > holding.units) {
        setErrorMsg(`Unit yang dijual maksimal ${holding.units} unit!`);
        return;
      }

      setLoading(true);
      sounds.playCoin();
      try {
        await onConfirmSell(asset.id, numValue);
        onClose();
      } catch (err) {
        setErrorMsg(err.message || 'Gagal melakukan pencairan');
      } finally {
        setLoading(false);
      }
    }
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
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${asset.riskColor}`}>
            {asset.risk}
          </span>
          <span className="text-xs text-slate-400">{asset.category}</span>
        </div>

        <h3 className="text-xl font-black text-white font-['Space_Grotesk'] mb-2">
          {isBuy ? 'Beli Pecahan Mikro' : 'Pencairan / Jual Unit'}
        </h3>
        <p className="text-sm font-semibold text-lime-400 mb-4">{asset.name}</p>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isBuy ? (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Nominal Beli (IDR) — Min. Rp 5.000</label>
              <input
                type="number"
                min="5000"
                step="1000"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400 font-bold"
              />
              <div className="flex gap-2 mt-2">
                {[10000, 25000, 50000, 100000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    className="flex-1 py-1 rounded-lg bg-slate-900 border border-white/5 text-[11px] text-slate-300 hover:border-lime-400/40"
                  >
                    Rp {(preset / 1000)}k
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Jumlah Unit Dijual (Maks: {holding.units} Unit)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={holding.units}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400 font-bold"
              />
              <button
                type="button"
                onClick={() => setAmount(holding.units.toString())}
                className="text-xs text-lime-400 font-semibold mt-1 hover:underline block"
              >
                Jual Semua ({holding.units} Unit)
              </button>
            </div>
          )}

          {/* Breakdown Preview Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Harga per Unit:</span>
              <span className="text-white font-semibold">Rp {unitPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isBuy ? 'Estimasi Unit Didapat:' : 'Estimasi Dana Diterima:'}</span>
              <span className="text-lime-400 font-bold font-['Space_Grotesk']">
                {isBuy ? `${estimatedUnits} Unit` : `Rp ${estimatedProceeds.toLocaleString('id-ID')}`}
              </span>
            </div>
            <div className="pt-2 border-t border-white/5 flex justify-between text-slate-400 text-[11px]">
              <span>Saldo Dompet Kamu:</span>
              <span className="text-white font-semibold">Rp {user.cashBalance.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer disabled:opacity-50 ${
              isBuy 
                ? 'bg-lime-400 hover:bg-lime-300 text-black shadow-lime-400/20' 
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
            }`}
          >
            {loading ? 'Memproses Transaksi...' : (isBuy ? 'Konfirmasi Beli Pecahan' : 'Konfirmasi Pencairan')}
          </button>
        </form>
      </div>
    </div>
  );
}
