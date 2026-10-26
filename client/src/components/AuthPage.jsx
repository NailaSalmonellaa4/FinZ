import React, { useState } from 'react';
import { Zap, Eye, EyeOff, Loader2, Sun, Moon } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function AuthPage({ onAuthSuccess, theme = 'dark', toggleTheme }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLight = theme === 'light';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    sounds.playClick();

    try {
      const { api, setToken } = await import('../utils/api');
      let res;
      if (mode === 'login') {
        res = await api.login({ email: form.email, password: form.password });
      } else {
        res = await api.register({ name: form.name, email: form.email, password: form.password });
      }
      setToken(res.token);
      sounds.playSuccess();
      onAuthSuccess(res.user, res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center px-4 py-12 relative transition-colors duration-200">
      
      {/* Theme Toggle Button (Top Right) */}
      {toggleTheme && (
        <button
          onClick={() => {
            sounds.playClick();
            toggleTheme();
          }}
          title={isLight ? 'Ubah ke Mode Gelap' : 'Ubah ke Mode Terang'}
          className={`absolute top-6 right-6 p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
            isLight
              ? 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200 shadow-sm'
              : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-850 hover:text-white'
          }`}
        >
          {isLight ? (
            <>
              <Sun className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Mode Terang</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 fill-indigo-400/30 text-indigo-300" />
              <span>Mode Gelap</span>
            </>
          )}
        </button>
      )}

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-lime-400 via-emerald-400 to-teal-500 text-black mb-4 shadow-[0_0_30px_rgba(163,230,53,0.4)]">
            <Zap className="w-8 h-8 fill-black stroke-black" />
          </div>
          <h1 className="text-4xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            Fin<span className="text-lime-400">Z</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Platform Edukasi Keuangan untuk Gen Z</p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Mode switcher */}
          <div className="flex p-1 bg-slate-900 rounded-2xl border border-white/5 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); sounds.playClick(); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === 'login' ? 'bg-lime-400 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); sounds.playClick(); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === 'register' ? 'bg-lime-400 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Nama Lengkap</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-lime-400 transition-colors placeholder-slate-600"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email</label>
              <input
                required
                type="email"
                placeholder="email@kamu.com"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-lime-400 transition-colors placeholder-slate-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Password {mode === 'register' && <span className="text-slate-500 font-normal">(minimal 6 karakter)</span>}
              </label>
              <div className="relative">
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-lime-400 transition-colors placeholder-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-sm transition-all shadow-lg shadow-lime-400/20 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Masuk ke FinZ' : 'Buat Akun & Mulai Belajar'}</span>
              )}
            </button>
          </form>

          {/* Disclaimer */}
          {mode === 'register' && (
            <p className="mt-4 text-center text-[11px] text-slate-500 leading-relaxed">
              Dengan mendaftar, kamu menerima bahwa <strong className="text-slate-400">FinZ adalah platform edukasi</strong>, bukan layanan keuangan atau rekomendasi investasi. Simulasi investasi menggunakan <strong className="text-slate-400">saldo virtual</strong>, bukan uang sungguhan.
            </p>
          )}
        </div>

        {/* Feature teaser */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '📊', label: 'Catat Keuangan' },
            { icon: '🎯', label: 'Target Tabungan' },
            { icon: '🎮', label: 'Simulasi Investasi' }
          ].map((f, i) => (
            <div key={i} className="py-3 px-2 rounded-2xl glass-card border border-white/5 text-xs text-slate-400">
              <div className="text-xl mb-1">{f.icon}</div>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
