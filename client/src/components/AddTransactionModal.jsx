import React, { useState } from 'react';
import { X } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function AddTransactionModal({ isOpen, onClose, onAddTx, categories }) {
  if (!isOpen) return null;

  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Makanan & Minuman');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableCategories = (categories && categories[type]) || (
    type === 'income' 
      ? ['Gaji / Uang Saku', 'Freelance / Side Hustle', 'Hadiah', 'Lainnya']
      : ['Makanan & Minuman', 'Transportasi', 'Hiburan & Hobi', 'Belanja & Fashion', 'Belajar & Pendidikan', 'Tagihan & Utilitas', 'Lainnya']
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!description.trim()) return setError('Keterangan transaksi harus diisi.');
    if (!amount || Number(amount) <= 0) return setError('Jumlah uang harus lebih dari 0.');

    setLoading(true);
    sounds.playCoin();
    try {
      await onAddTx({
        type,
        category,
        description: description.trim(),
        amount: Number(amount),
        date
      });
      setDescription('');
      setAmount('');
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
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

        <h3 className="text-xl font-black text-white font-['Space_Grotesk'] mb-1">
          Catat Transaksi Keuangan
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Catat uang masuk atau keluar dan dapatkan +30 XP!
        </p>

        {/* Type Switcher */}
        <div className="flex p-1 bg-slate-900 rounded-2xl border border-white/5 mb-4">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory('Makanan & Minuman');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400'
            }`}
          >
            ➖ Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('Gaji / Uang Saku');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'income' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400'
            }`}
          >
            ➕ Pemasukan
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Keterangan Transaksi *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Makan siang, Uang saku minggu ini"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Jumlah (Rp) *</label>
              <input
                type="number"
                required
                min="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400 font-bold"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Kategori *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400"
              >
                {availableCategories.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Tanggal *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-lime-400/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Transaksi (+30 XP)'}
          </button>
        </form>
      </div>
    </div>
  );
}
