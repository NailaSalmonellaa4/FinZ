import React, { useState } from 'react';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function TransactionsTab({ data, onAdd, onDelete }) {
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'expense', category: 'Makanan & Minuman', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const txs = (data?.transactions || []).filter(t => filter === 'all' || t.type === filter);
  const cats = data?.categories || {};
  const monthly = data?.monthlySummary || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.description.trim()) return setError('Keterangan transaksi harus diisi.');
    if (!form.amount || Number(form.amount) <= 0) return setError('Jumlah uang harus lebih dari 0.');
    setLoading(true);
    try {
      await onAdd({ ...form, amount: Number(form.amount) });
      setForm({ type: 'expense', category: 'Makanan & Minuman', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">Pencatatan Pemasukan & Pengeluaran</h2>
          <p className="text-xs text-slate-400">Catat setiap transaksi agar kamu tahu ke mana uangmu pergi</p>
        </div>
        <button
          onClick={() => { sounds.playClick(); setShowForm(v => !v); setError(''); }}
          className="self-start flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-bold text-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Tambah Transaksi
        </button>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border-emerald-500/20 text-center">
          <div className="text-xs font-semibold text-slate-400 mb-1">Uang Masuk Bulan Ini</div>
          <div className="text-lg font-black text-emerald-400 font-['Space_Grotesk']">Rp {(monthly.income || 0).toLocaleString('id-ID')}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border-rose-500/20 text-center">
          <div className="text-xs font-semibold text-slate-400 mb-1">Uang Keluar Bulan Ini</div>
          <div className="text-lg font-black text-rose-400 font-['Space_Grotesk']">Rp {(monthly.expense || 0).toLocaleString('id-ID')}</div>
        </div>
        <div className={`glass-panel p-4 rounded-2xl text-center ${(monthly.balance || 0) >= 0 ? 'border-lime-500/20' : 'border-rose-500/20'}`}>
          <div className="text-xs font-semibold text-slate-400 mb-1">Selisih (Masuk–Keluar)</div>
          <div className={`text-lg font-black font-['Space_Grotesk'] ${(monthly.balance || 0) >= 0 ? 'text-lime-400' : 'text-rose-400'}`}>
            Rp {(monthly.balance || 0).toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Inline Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel p-5 rounded-3xl border-lime-400/20 space-y-4">
          <h3 className="font-bold text-white text-sm">Form Tambah Transaksi</h3>

          {/* Type selector */}
          <div className="flex gap-2">
            {['income', 'expense'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setForm(f => ({ ...f, type: t, category: t === 'income' ? 'Gaji / Uang Saku' : 'Makanan & Minuman' }))}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                  form.type === t
                    ? t === 'income' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-rose-500 text-white border-rose-500'
                    : 'bg-slate-900 text-slate-400 border-white/5 hover:bg-slate-800'
                }`}
              >
                {t === 'income' ? '➕ Uang Masuk (Pemasukan)' : '➖ Uang Keluar (Pengeluaran)'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Kategori *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400"
              >
                {(cats[form.type] || []).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Tanggal *</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Keterangan *</label>
              <input
                type="text"
                placeholder="Contoh: Makan siang di kantin"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Jumlah (Rp) *</label>
              <input
                type="number"
                min="100"
                placeholder="Contoh: 15000"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400 font-bold"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-400 px-1">{error}</p>}

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">Batal</button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-lime-400 text-black font-bold text-xs disabled:opacity-50 cursor-pointer">
              {loading ? 'Menyimpan...' : 'Simpan Transaksi +30 XP'}
            </button>
          </div>
        </form>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2">
        {[['all', 'Semua'], ['income', 'Pemasukan'], ['expense', 'Pengeluaran']].map(([v, l]) => (
          <button
            key={v}
            onClick={() => { sounds.playClick(); setFilter(v); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === v ? 'bg-lime-400 text-black' : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {l}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-2">{txs.length} transaksi</span>
      </div>

      {/* Transaction List */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        {txs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            Belum ada transaksi. Klik "Tambah Transaksi" untuk mencatat pertama kalimu!
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {txs.map(tx => (
              <div key={tx.id} className="flex items-center justify-between gap-3 p-4 hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{tx.description}</div>
                    <div className="text-[11px] text-slate-400">
                      {tx.category} · {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold font-['Space_Grotesk'] ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                  </span>
                  <button
                    onClick={() => { sounds.playClick(); onDelete(tx.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-all"
                    title="Hapus transaksi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
