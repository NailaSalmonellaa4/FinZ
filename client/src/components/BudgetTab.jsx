import React, { useState } from 'react';
import { Plus, Trash2, Edit3, AlertTriangle, CheckCircle } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function BudgetTab({ data, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'Makanan & Minuman', limitAmount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const budgets = data?.budgets || [];
  const categories = data?.categories || [];
  const usedCategories = budgets.map(b => b.category);
  const availableCategories = categories.filter(c => !usedCategories.includes(c));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.limitAmount || Number(form.limitAmount) <= 0) return setError('Batas anggaran harus diisi dengan angka positif.');
    setLoading(true);
    try {
      await onAdd({ category: form.category, limitAmount: Number(form.limitAmount) });
      setForm({ category: availableCategories[0] || 'Lainnya', limitAmount: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">Anggaran Bulanan</h2>
          <p className="text-xs text-slate-400">Tentukan batas pengeluaran per kategori agar tidak melebihi batas</p>
        </div>
        {availableCategories.length > 0 && (
          <button
            onClick={() => { sounds.playClick(); setShowForm(v => !v); setError(''); setForm(f => ({ ...f, category: availableCategories[0] })); }}
            className="self-start flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-bold text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Tambah Anggaran Kategori
          </button>
        )}
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel p-5 rounded-3xl border-lime-400/20 space-y-4">
          <h3 className="font-bold text-white text-sm">Buat Batas Anggaran Baru</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Kategori Pengeluaran *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400"
              >
                {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Batas Anggaran (Rp) *</label>
              <input
                type="number"
                min="1000"
                placeholder="Contoh: 300000"
                value={form.limitAmount}
                onChange={e => setForm(f => ({ ...f, limitAmount: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400 font-bold"
              />
            </div>
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">Batal</button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-lime-400 text-black font-bold text-xs disabled:opacity-50 cursor-pointer">
              {loading ? 'Menyimpan...' : 'Simpan Anggaran +40 XP'}
            </button>
          </div>
        </form>
      )}

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="font-bold text-white mb-1">Belum ada anggaran</h3>
          <p className="text-xs text-slate-400">Klik "Tambah Anggaran Kategori" untuk mulai mengatur batas pengeluaranmu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(b => (
            <div
              key={b.id}
              className={`glass-panel p-5 rounded-3xl border relative ${b.isOver ? 'border-rose-500/40 bg-rose-950/10' : 'border-white/5'}`}
            >
              {b.isOver && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  <AlertTriangle className="w-3 h-3" /> Melebihi Batas!
                </div>
              )}
              {!b.isOver && b.percentUsed === 0 && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" /> Aman
                </div>
              )}

              <div className="mb-3">
                <h4 className="font-bold text-white text-sm">{b.category}</h4>
                <p className="text-[11px] text-slate-400">Batas: Rp {b.limitAmount.toLocaleString('id-ID')}</p>
              </div>

              <div className="text-2xl font-black font-['Space_Grotesk'] text-white mb-1">
                Rp {b.spent.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-400 mb-3">terpakai dari Rp {b.limitAmount.toLocaleString('id-ID')}</div>

              {/* Progress Bar */}
              <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5 mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${b.isOver ? 'bg-rose-500' : b.percentUsed > 75 ? 'bg-amber-400' : 'bg-lime-400'}`}
                  style={{ width: `${Math.min(100, b.percentUsed)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className={b.isOver ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                  {b.percentUsed}% terpakai
                </span>
                <span className="text-slate-400">Sisa: Rp {b.remaining.toLocaleString('id-ID')}</span>
              </div>

              <button
                onClick={() => { sounds.playClick(); onDelete(b.id); }}
                className="mt-3 w-full py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus Anggaran Ini
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {budgets.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl border border-white/5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-slate-400 text-xs mb-1">Total Dianggarkan</div>
              <div className="font-bold text-white font-['Space_Grotesk']">Rp {(data?.totalBudgeted || 0).toLocaleString('id-ID')}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Total Pengeluaran</div>
              <div className="font-bold text-rose-400 font-['Space_Grotesk']">Rp {(data?.totalSpent || 0).toLocaleString('id-ID')}</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-slate-400 text-xs mb-1">Sisa Anggaran</div>
              <div className={`font-bold font-['Space_Grotesk'] ${(data?.totalBudgeted - data?.totalSpent) >= 0 ? 'text-lime-400' : 'text-rose-400'}`}>
                Rp {((data?.totalBudgeted || 0) - (data?.totalSpent || 0)).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
