import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, History, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

export default function InvestTab({ data, history, onBuy, onSell, onRefresh }) {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [tradeMode, setTradeMode] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradingUnits, setTradingUnits] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('market'); // 'market' | 'history'

  const assets = data?.assets || [];
  const virtualBalance = data?.virtualBalance || 0;
  const summary = data?.summary || {};

  const handleTrade = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tradeMode === 'buy') {
        const amount = Number(tradeAmount);
        if (!amount || amount < 1000) throw new Error('Minimal pembelian simulasi Rp 1.000');
        await onBuy({ assetId: selectedAsset.id, amount });
        confetti({ particleCount: 40, spread: 50 });
        sounds.playSuccess();
      } else {
        const units = Number(tradingUnits);
        if (!units || units <= 0) throw new Error('Jumlah unit harus lebih dari 0.');
        await onSell({ assetId: selectedAsset.id, units });
        sounds.playCoin();
      }
      setTradeAmount('');
      setTradingUnits('');
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner — WAJIB tampil jelas */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-bold text-amber-300 mb-1">⚠️ Ini adalah Fitur Simulasi Edukasi — Bukan Investasi Nyata!</div>
          <div className="text-xs text-slate-300 leading-relaxed">
            Saldo yang digunakan adalah <strong className="text-amber-300">saldo virtual</strong> senilai Rp {virtualBalance.toLocaleString('id-ID')} yang diberikan gratis untuk latihan.
            Harga aset di bawah adalah <strong className="text-amber-300">data contoh untuk pembelajaran</strong>, bukan harga pasar saham sungguhan.
            FinZ adalah platform edukasi, bukan layanan investasi.
          </div>
        </div>
      </div>

      {/* Virtual Balance + Portfolio Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border-purple-500/20 col-span-2 lg:col-span-1">
          <div className="text-xs font-semibold text-slate-400 mb-1">Saldo Virtual Tersisa</div>
          <div className="text-xl font-black text-purple-300 font-['Space_Grotesk']">Rp {virtualBalance.toLocaleString('id-ID')}</div>
          <div className="text-[10px] text-slate-500 mt-1">Untuk simulasi — bukan uang asli</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 mb-1">Nilai Aset Virtual</div>
          <div className="text-xl font-black text-white font-['Space_Grotesk']">Rp {(summary.totalPortfolioValue || 0).toLocaleString('id-ID')}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 mb-1">Total Diinvestasikan</div>
          <div className="text-xl font-black text-white font-['Space_Grotesk']">Rp {(summary.totalInvested || 0).toLocaleString('id-ID')}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 mb-1">Untung / Rugi Simulasi</div>
          <div className={`text-xl font-black font-['Space_Grotesk'] ${(summary.totalGainLoss || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {(summary.totalGainLoss || 0) >= 0 ? '+' : ''}Rp {(summary.totalGainLoss || 0).toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Section Toggle */}
      <div className="flex gap-2">
        {[['market', '📊 Katalog Aset Simulasi'], ['history', '📋 Riwayat Transaksi Simulasi']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => { sounds.playClick(); setActiveSection(id); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSection === id ? 'bg-lime-400 text-black' : 'glass-panel text-slate-400 hover:text-white border border-white/5'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeSection === 'market' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset Cards */}
          <div className="lg:col-span-2 space-y-4">
            {assets.map(asset => {
              const holding = asset.holding || {};
              const hasHolding = holding.units > 0;
              const isSelected = selectedAsset?.id === asset.id;

              return (
                <div
                  key={asset.id}
                  onClick={() => { sounds.playClick(); setSelectedAsset(asset); setTradeMode('buy'); setError(''); }}
                  className={`glass-panel p-5 rounded-3xl cursor-pointer transition-all ${isSelected ? 'border-lime-400/50 shadow-lg shadow-lime-400/10' : 'border-white/5 hover:border-lime-400/20'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-white">{asset.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${asset.riskColor}`}>
                          Risiko {asset.risk}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{asset.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-white font-['Space_Grotesk']">Rp {asset.pricePerUnit.toLocaleString('id-ID')}</div>
                      <div className="text-[11px] font-bold text-emerald-400">+{asset.return1Y}% data contoh/thn</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">{asset.description}</p>

                  {/* Sparkline */}
                  <div className="h-12 w-full mb-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={asset.chartData}>
                        <Area type="monotone" dataKey="price" stroke="#a3e635" strokeWidth={2} fillOpacity={0.1} fill="#a3e635" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Holdings if any */}
                  {hasHolding && (
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Kamu punya: <strong className="text-white">{holding.units} unit virtual</strong></span>
                      <span className={holding.gainLoss >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {holding.gainLoss >= 0 ? '+' : ''}Rp {holding.gainLoss.toLocaleString('id-ID')} (simulasi)
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedAsset(asset); setTradeMode('buy'); setError(''); }}
                      className="flex-1 py-2 rounded-xl bg-lime-400/15 text-lime-400 hover:bg-lime-400 hover:text-black font-bold text-xs border border-lime-400/30 transition-all"
                    >
                      Beli Simulasi
                    </button>
                    {hasHolding && (
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedAsset(asset); setTradeMode('sell'); setError(''); }}
                        className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium text-xs transition-all"
                      >
                        Jual Simulasi
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trade Panel */}
          <div className="lg:col-span-1">
            {selectedAsset ? (
              <div className="glass-panel p-5 rounded-3xl border-purple-500/20 sticky top-24">
                <h3 className="font-bold text-white font-['Space_Grotesk'] mb-1">Panel Simulasi Transaksi</h3>
                <p className="text-xs text-slate-400 mb-4">Semua transaksi menggunakan saldo virtual</p>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 mb-4">
                  <div className="font-bold text-sm text-white">{selectedAsset.name}</div>
                  <div className="text-xs text-slate-400">Harga/Unit: Rp {selectedAsset.pricePerUnit.toLocaleString('id-ID')}</div>
                </div>

                {/* Buy/Sell mode */}
                <div className="flex gap-2 mb-4">
                  <button onClick={() => setTradeMode('buy')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tradeMode === 'buy' ? 'bg-lime-400 text-black' : 'bg-slate-900 text-slate-400 border border-white/5'}`}>
                    Beli
                  </button>
                  <button onClick={() => setTradeMode('sell')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tradeMode === 'sell' ? 'bg-rose-500 text-white' : 'bg-slate-900 text-slate-400 border border-white/5'}`}>
                    Jual
                  </button>
                </div>

                <form onSubmit={handleTrade} className="space-y-3">
                  {tradeMode === 'buy' ? (
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Jumlah Saldo Virtual (Rp)</label>
                      <input
                        type="number"
                        min="1000"
                        placeholder="Min. Rp 1.000"
                        value={tradeAmount}
                        onChange={e => setTradeAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400 font-bold"
                      />
                      {tradeAmount && Number(tradeAmount) > 0 && (
                        <div className="text-[11px] text-slate-400 mt-1">
                          ≈ {(Number(tradeAmount) / selectedAsset.pricePerUnit).toFixed(4)} unit virtual
                        </div>
                      )}
                      <div className="flex gap-1.5 mt-2">
                        {[10000, 50000, 100000].map(p => (
                          <button key={p} type="button" onClick={() => setTradeAmount(p.toString())} className="flex-1 py-1 rounded-lg bg-slate-900 border border-white/5 text-[10px] text-slate-400 hover:border-lime-400/30">
                            Rp {(p/1000)}k
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        Jumlah Unit Dijual (Maks: {(selectedAsset.holding?.units || 0)} unit)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        min="0.0001"
                        max={selectedAsset.holding?.units || 0}
                        placeholder="Contoh: 2.5"
                        value={tradingUnits}
                        onChange={e => setTradingUnits(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-400 font-bold"
                      />
                      {tradingUnits && Number(tradingUnits) > 0 && (
                        <div className="text-[11px] text-slate-400 mt-1">
                          ≈ Rp {(Number(tradingUnits) * selectedAsset.pricePerUnit).toLocaleString('id-ID')} saldo virtual
                        </div>
                      )}
                    </div>
                  )}

                  {error && <p className="text-xs text-rose-400 px-1">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer disabled:opacity-50 transition-all ${
                      tradeMode === 'buy' ? 'bg-lime-400 text-black hover:bg-lime-300' : 'bg-rose-500 text-white hover:bg-rose-600'
                    }`}
                  >
                    {loading ? 'Memproses...' : (tradeMode === 'buy' ? `Beli Simulasi +${60} XP` : `Jual Simulasi +${40} XP`)}
                  </button>
                </form>

                <p className="text-[10px] text-slate-500 text-center mt-3 leading-relaxed">
                  Ini adalah simulasi edukasi. Tidak ada uang sungguhan yang ditransaksikan.
                </p>
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-3xl text-center border-white/5">
                <div className="text-3xl mb-2">👆</div>
                <p className="text-xs text-slate-400">Klik salah satu aset simulasi di sebelah kiri untuk memulai transaksi virtual</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'history' && (
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h3 className="font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" /> Riwayat Transaksi Simulasi Investasi
            </h3>
            <p className="text-xs text-slate-400 mt-1">Semua transaksi di bawah menggunakan saldo virtual untuk edukasi</p>
          </div>

          {(history || []).length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Belum ada riwayat simulasi. Coba beli aset simulasi pertamamu!
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {(history || []).map(h => (
                <div key={h.id} className="flex items-center justify-between gap-3 p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${h.type === 'buy' ? 'bg-lime-400/10 text-lime-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {h.type === 'buy' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {h.type === 'buy' ? 'Beli' : 'Jual'} · {h.assetName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {h.units} unit @ Rp {h.pricePerUnit.toLocaleString('id-ID')} · {new Date(h.date).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold font-['Space_Grotesk'] ${h.type === 'buy' ? 'text-rose-400' : 'text-lime-400'}`}>
                      {h.type === 'buy' ? '-' : '+'}Rp {h.totalAmount.toLocaleString('id-ID')}
                    </div>
                    <div className="text-[10px] text-slate-500">Saldo virtual sesudah: Rp {h.virtualBalanceAfter.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
