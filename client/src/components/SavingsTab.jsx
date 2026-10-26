import React, { useState } from 'react';
import { Plus, Trash2, Target, CheckCircle, Coins, Calendar } from 'lucide-react';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

export default function SavingsTab({ data, onAdd, onDeposit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [depositState, setDepositState] = useState({}); // { [id]: amount }
  const [form, setForm] = useState({ name: '', targetAmount: '', deadline: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const targets = data?.savingTargets || [];

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Nama target tabungan harus diisi.');
    if (!form.targetAmount || Number(form.targetAmount) <= 0) return setError('Jumlah target harus lebih dari 0.');
    setLoading(true);
    try {
      await onAdd({ name: form.name, targetAmount: Number(form.targetAmount), deadline: form.deadline || null });
      setForm({ name: '', targetAmount: '', deadline: '' });
      setShowForm(false);
      sounds.playSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (id) => {
    const amount = Number(depositState[id]);
    if (!amount || amount <= 0) return;
    try {
      const res = await onDeposit(id, { amount, note: 'Nabung manual' });
      if (res?.isCompleted) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        setSuccessMsg(res.message);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        sounds.playCoin();
      }
      setDepositState(s => ({ ...s, [id]: '' }));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">Target Tabungan</h2>
          <p className="text-xs text-slate-400">Buat tujuan menabung yang jelas agar lebih termotivasi untuk mencapainya</p>
        </div>
        <button
          onClick={() => { sounds.playClick(); setShowForm(v => !v); setError(''); }}
          className="self-start flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-bold text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Buat Target Tabungan
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> {successMsg}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="glass-panel p-5 rounded-3xl border-lime-400/20 space-y-4">
          <h3 className="font-bold text-white text-sm">Buat Target Tabungan Baru</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="text-xs text-slate-400 block mb-1">Nama / Tujuan Tabungan *</label>
              <input
                type="text"
                placeholder="Contoh: Beli Headphone, Liburan, Laptop Baru"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Jumlah Target (Rp) *</label>
              <input
                type="number"
                min="1000"
                placeholder="Contoh: 850000"
                value={form.targetAmount}
                onChange={e => setForm(f => ({ ...f, targetAmount: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400 font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Tanggal (Opsional)</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">Batal</button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-lime-400 text-black font-bold text-xs disabled:opacity-50 cursor-pointer">
              {loading ? 'Menyimpan...' : 'Simpan Target +80 XP'}
            </button>
          </div>
        </form>
      )}

      {/* Targets Grid */}
      {targets.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="font-bold text-white mb-1">Belum ada target tabungan</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Membuat target tabungan yang jelas membuatmu lebih termotivasi. Coba buat satu sekarang!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {targets.map(s => (
            <div
              key={s.id}
              className={`glass-panel p-5 rounded-3xl flex flex-col justify-between border ${
                s.isCompleted ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-white/5'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${s.isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-lime-400/10 text-lime-400'}`}>
                      {s.isCompleted ? <CheckCircle className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{s.name}</h4>
                      {s.deadline && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(s.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          {s.daysLeft !== null && s.daysLeft >= 0 && !s.isCompleted && (
                            <span className={`ml-1 font-bold ${s.daysLeft < 7 ? 'text-rose-400' : 'text-amber-400'}`}>
                              ({s.daysLeft} hari lagi)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {s.isCompleted && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      TERCAPAI! 🎉
                    </span>
                  )}
                </div>

                {/* Amount & Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-black text-lg text-white font-['Space_Grotesk']">
                      Rp {s.currentAmount.toLocaleString('id-ID')}
                    </span>
                    <span className={`font-bold ${s.isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {s.percentDone}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-2">
                    dari Rp {s.targetAmount.toLocaleString('id-ID')}
                    {!s.isCompleted && ` · Kurang Rp ${s.remaining.toLocaleString('id-ID')}`}
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${s.isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-lime-400 to-emerald-400'}`}
                      style={{ width: `${s.percentDone}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Deposit & Delete */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                {!s.isCompleted && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="100"
                      placeholder="Tambah tabungan (Rp)"
                      value={depositState[s.id] || ''}
                      onChange={e => setDepositState(prev => ({ ...prev, [s.id]: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400"
                    />
                    <button
                      onClick={() => handleDeposit(s.id)}
                      className="px-3 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs transition-all cursor-pointer"
                    >
                      <Coins className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => { sounds.playClick(); onDelete(s.id); }}
                  className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus Target
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
