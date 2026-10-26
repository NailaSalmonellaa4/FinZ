import React, { useState } from 'react';
import { 
  TrendingUp, 
  Coins, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart as PieIcon,
  HelpCircle,
  Plus
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { sounds } from '../utils/sound';

export default function MicroInvestTab({ 
  portfolio, 
  user, 
  onOpenBuyModal, 
  onOpenSellModal, 
  onSweepRoundUp, 
  onUpdateRoundUpSettings 
}) {
  const [selectedMultiplier, setSelectedMultiplier] = useState(user?.roundUpSettings?.multiplier || 1);
  const [selectedTarget, setSelectedTarget] = useState(user?.roundUpSettings?.targetAssetId || 'green-future');
  const [isUpdating, setIsUpdating] = useState(false);

  const accumulatedRoundUp = user?.roundUpSettings?.accumulatedRoundUp || 0;
  const assets = portfolio?.assets || [];

  const handleSaveSettings = async (multiplier, targetId) => {
    setIsUpdating(true);
    sounds.playClick();
    await onUpdateRoundUpSettings({
      multiplier: Number(multiplier),
      targetAssetId: targetId
    });
    setIsUpdating(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Round-Up Automation Center */}
      <div className="glass-panel p-6 rounded-3xl border-amber-400/20 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold mb-2">
              <Coins className="w-3.5 h-3.5" />
              <span>Celengan Otomatis (Sisa Kembalian Jajan)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">
              Ubah Sisa Receh Jadi Bibit Emas & Saham
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Tiap jajan es kopi atau delivery, FinZ bulatkan harganya. Sisa recehnya otomatis diselamatkan ke celengan ini biar ga lenyap sia-sia!
            </p>
          </div>

          <div className="bg-slate-900/90 border border-amber-400/30 p-4 rounded-2xl flex items-center gap-4">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Receh Terkumpul</span>
              <div className="text-2xl font-black text-amber-300 font-['Space_Grotesk']">
                Rp {accumulatedRoundUp.toLocaleString('id-ID')}
              </div>
            </div>
            <button
              onClick={() => {
                if (accumulatedRoundUp >= 5000) {
                  sounds.playCoin();
                  onSweepRoundUp();
                }
              }}
              disabled={accumulatedRoundUp < 5000}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                accumulatedRoundUp >= 5000
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:opacity-90 shadow-lg shadow-amber-500/30 cursor-pointer'
                  : 'bg-white/5 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Beli Aset Sekarang</span>
            </button>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">
              Pengganda Tabungan (Mau Seberapa Cepat Nabung?):
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 5, 10].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMultiplier(m);
                    handleSaveSettings(m, selectedTarget);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedMultiplier === m
                      ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-400/20'
                      : 'bg-slate-900/60 text-slate-400 border-white/5 hover:bg-slate-800'
                  }`}
                >
                  {m}x {m === 1 ? '(Normal)' : `(+${m}x)`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">
              Aset yang Dibeli Otomatis dari Receh:
            </label>
            <select
              value={selectedTarget}
              onChange={(e) => {
                setSelectedTarget(e.target.value);
                handleSaveSettings(selectedMultiplier, e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — Untung Rata-rata: +{a.return1Y}%/thn
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Portofolio Aktif Pengguna (Holdings Table) */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-lime-400" />
              Aset yang Kamu Miliki
            </h3>
            <p className="text-xs text-slate-400">Pecahan bibit investasi yang sudah kamu beli</p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400">Total Nilai Aset:</span>
            <div className="text-lg font-black text-lime-400 font-['Space_Grotesk']">
              Rp {(portfolio?.summary?.totalPortfolioValue || 0).toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Nama Paket Aset</th>
                <th className="pb-3 font-semibold">Jumlah Pecahan</th>
                <th className="pb-3 font-semibold">Harga Saat Ini</th>
                <th className="pb-3 font-semibold">Total Nilai</th>
                <th className="pb-3 font-semibold">Cuan / Rugi</th>
                <th className="pb-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assets.filter(a => a.userHolding && a.userHolding.units > 0).map((asset) => {
                const holding = asset.userHolding;
                const isProfit = holding.gainLoss >= 0;
                return (
                  <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pr-2">
                      <div className="font-bold text-white text-sm">{asset.name}</div>
                      <div className="text-[11px] text-slate-400">{asset.category}</div>
                    </td>
                    <td className="py-3.5 font-semibold text-slate-300">
                      {holding.units} Unit
                    </td>
                    <td className="py-3.5 text-slate-300">
                      Rp {asset.unitPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 font-bold text-white font-['Space_Grotesk']">
                      Rp {holding.currentValue.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5">
                      <div className={`font-bold flex items-center gap-1 ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>Rp {Math.abs(holding.gainLoss).toLocaleString('id-ID')}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5">
                          ({isProfit ? '+' : ''}{holding.gainLossPercent}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => { sounds.playClick(); onOpenBuyModal(asset); }}
                        className="px-2.5 py-1 rounded-lg bg-lime-400/15 text-lime-400 hover:bg-lime-400 hover:text-black font-bold text-xs transition-colors"
                      >
                        Beli Lagi
                      </button>
                      <button
                        onClick={() => { sounds.playClick(); onOpenSellModal(asset); }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium text-xs transition-colors"
                      >
                        Tarik Duit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paket Investasi Favorit */}
      <div>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-lime-400" />
            Paket Investasi Favorit Gen Z & Alpha
          </h3>
          <p className="text-xs text-slate-400">Pilih tema yang kamu suka: dari teknologi masa depan sampai brand mie & kopi kesayangan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assets.map((asset) => (
            <div 
              key={asset.id}
              className="glass-panel p-5 rounded-3xl flex flex-col justify-between border-white/5 hover:border-lime-400/30 transition-all group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-bold text-base text-white group-hover:text-lime-400 transition-colors">
                      {asset.name}
                    </h4>
                    <span className="text-xs text-slate-400">{asset.category}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${asset.riskColor}`}>
                    Risiko {asset.risk}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {asset.description}
                </p>

                {/* Mini sparkline chart */}
                <div className="h-16 w-full mb-3 bg-slate-900/40 rounded-xl p-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={asset.chartData || []}>
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#a3e635" 
                        strokeWidth={2} 
                        fillOpacity={0.2} 
                        fill="#a3e635" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Holdings Pills */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Isi Perusahaan di Paket Ini:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(asset.topHoldings || []).map((h, idx) => (
                      <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                        {h.name} ({h.share}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action & Price Bottom */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Harga 1 Pecahan</span>
                  <div className="text-sm font-black text-white font-['Space_Grotesk']">
                    Rp {asset.unitPrice.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-400">
                    +{asset.return1Y}% (Rata-rata 1 Thn)
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenBuyModal(asset);
                  }}
                  className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs transition-all shadow-md shadow-lime-400/20"
                >
                  Beli Mulai Rp 5.000
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
