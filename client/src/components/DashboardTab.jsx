import React from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, Target, Zap, Flame,
  PlusCircle, ChevronRight, BookOpen, BarChart3, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { sounds } from '../utils/sound';

export default function DashboardTab({ user, transactions, budgets, savings, investData, gamification, setActiveTab, onOpenAddTx }) {
  const monthly = transactions?.monthlySummary || {};
  const recentTxs = (transactions?.transactions || []).slice(0, 5);
  const activeSavings = (savings?.savingTargets || []).filter(s => !s.isCompleted).slice(0, 3);
  const pendingQuests = (gamification?.quests || []).filter(q => !q.completed).slice(0, 3);

  const levelInfo = user?.levelInfo || {};
  const xpProgress = levelInfo.maxXp > levelInfo.minXp
    ? Math.min(100, Math.round(((user?.xp - levelInfo.minXp) / (levelInfo.maxXp - levelInfo.minXp)) * 100))
    : 100;

  // Build simple income/expense chart from recent transactions
  const chartData = (() => {
    const days = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('id-ID', { weekday: 'short' });
      days[key] = { name: key, income: 0, expense: 0 };
    }
    (transactions?.transactions || []).forEach(t => {
      const d = new Date(t.date);
      const key = d.toLocaleDateString('id-ID', { weekday: 'short' });
      if (days[key]) {
        if (t.type === 'income') days[key].income += t.amount;
        if (t.type === 'expense') days[key].expense += t.amount;
      }
    });
    return Object.values(days);
  })();

  const PIE_COLORS = ['#a3e635', '#f43f5e', '#8b5cf6', '#3b82f6'];
  const budgetPieData = (budgets?.budgets || []).map((b, i) => ({
    name: b.category,
    value: b.spent,
    color: PIE_COLORS[i % PIE_COLORS.length]
  })).filter(b => b.value > 0);

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-3xl border-lime-400/20 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <p className="text-slate-400 text-sm mb-1">Halo, {user?.name?.split(' ')[0]} 👋</p>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
              Dashboard Keuangan Bulan Ini
            </h1>
            <p className="text-xs text-slate-400 mt-1">{monthly.month}</p>
          </div>
          <button
            onClick={() => { sounds.playClick(); onOpenAddTx(); }}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-sm transition-all shadow-lg shadow-lime-400/20 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 stroke-[2.5]" />
            <span>Catat Transaksi Baru</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income */}
        <div className="glass-panel p-4 rounded-2xl border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Uang Masuk</span>
          </div>
          <div className="text-xl font-black text-white font-['Space_Grotesk']">
            Rp {(monthly.income || 0).toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Pemasukan bulan ini</div>
        </div>

        {/* Expense */}
        <div className="glass-panel p-4 rounded-2xl border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-400 mb-2">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Uang Keluar</span>
          </div>
          <div className="text-xl font-black text-white font-['Space_Grotesk']">
            Rp {(monthly.expense || 0).toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Pengeluaran bulan ini</div>
        </div>

        {/* Balance */}
        <div className="glass-panel p-4 rounded-2xl border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Selisih Saldo</span>
          </div>
          <div className={`text-xl font-black font-['Space_Grotesk'] ${(monthly.balance || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            Rp {(monthly.balance || 0).toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Pemasukan – Pengeluaran</div>
        </div>

        {/* Virtual Balance */}
        <div className="glass-panel p-4 rounded-2xl border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Saldo Simulasi</span>
          </div>
          <div className="text-xl font-black text-purple-300 font-['Space_Grotesk']">
            Rp {(user?.virtualBalance || 0).toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Virtual · Bukan uang asli</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart: Income vs Expense 7 Days */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl">
          <h3 className="font-bold text-white font-['Space_Grotesk'] mb-1">Grafik Pemasukan & Pengeluaran (7 Hari)</h3>
          <p className="text-xs text-slate-400 mb-4">Bandingkan uang masuk dan keluar harian</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a3e635" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => v > 0 ? `${(v/1000).toFixed(0)}k` : '0'} />
                <Tooltip
                  content={({ active, payload }) => active && payload?.length ? (
                    <div className="bg-slate-900 border border-white/10 p-3 rounded-xl text-xs shadow-xl">
                      <p className="text-emerald-400 font-bold">Masuk: Rp {(payload[0]?.value || 0).toLocaleString('id-ID')}</p>
                      <p className="text-rose-400 font-bold">Keluar: Rp {(payload[1]?.value || 0).toLocaleString('id-ID')}</p>
                    </div>
                  ) : null}
                />
                <Area type="monotone" dataKey="income" stroke="#a3e635" strokeWidth={2} fill="url(#incG)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2} fill="url(#expG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-lime-400 rounded-full inline-block" /> Pemasukan</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-rose-500 rounded-full inline-block" /> Pengeluaran</span>
          </div>
        </div>

        {/* Level & XP */}
        <div className="glass-panel p-6 rounded-3xl border-purple-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm font-['Space_Grotesk']">Level & XP</h3>
                <p className="text-xs text-slate-400">Progres gamifikasi kamu</p>
              </div>
            </div>

            <div className="text-center py-4">
              <div className="text-5xl font-black text-white font-['Space_Grotesk'] mb-1">{user?.level || 1}</div>
              <div className="text-sm font-bold text-purple-300">{levelInfo.title}</div>
              <div className="text-xs text-slate-400 mt-1">{user?.xp || 0} / {levelInfo.maxXp} XP</div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                <span>Progress ke Level {(user?.level || 1) + 1}</span>
                <span className="text-purple-300">{xpProgress}%</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-lime-400 transition-all duration-700"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
                <span className="text-xs font-bold text-white">Streak Aktif</span>
              </div>
              <span className="text-lg font-black text-orange-400 font-['Space_Grotesk']">{user?.streak || 0} Hari</span>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('quests'); }}
            className="mt-4 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1"
          >
            Lihat Misi & Lencana <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Recent Transactions */}
        <div className="glass-panel p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm font-['Space_Grotesk']">Transaksi Terbaru</h3>
            <button onClick={() => { sounds.playClick(); setActiveTab('transactions'); }} className="text-xs text-lime-400 font-bold flex items-center gap-1">
              Semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2.5">
            {recentTxs.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-6">Belum ada transaksi. Yuk catat yang pertama!</p>
            ) : recentTxs.map(tx => (
              <div key={tx.id} className="flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white truncate max-w-[120px]">{tx.description}</div>
                    <div className="text-[10px] text-slate-400">{tx.category}</div>
                  </div>
                </div>
                <span className={`text-xs font-bold font-['Space_Grotesk'] whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Saving Targets */}
        <div className="glass-panel p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm font-['Space_Grotesk']">Target Tabungan Aktif</h3>
            <button onClick={() => { sounds.playClick(); setActiveTab('savings'); }} className="text-xs text-lime-400 font-bold flex items-center gap-1">
              Semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3.5">
            {activeSavings.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-6">Belum ada target tabungan. Buat tujuan menabungmu!</p>
            ) : activeSavings.map(s => (
              <div key={s.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white truncate max-w-[140px]">{s.name}</span>
                  <span className="text-slate-400 font-bold">{s.percentDone}%</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-400 transition-all duration-500"
                    style={{ width: `${s.percentDone}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Rp {s.currentAmount.toLocaleString('id-ID')}</span>
                  <span>dari Rp {s.targetAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Quests */}
        <div className="glass-panel p-5 rounded-3xl border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm font-['Space_Grotesk']">Misi Aktif</h3>
            <button onClick={() => { sounds.playClick(); setActiveTab('quests'); }} className="text-xs text-lime-400 font-bold flex items-center gap-1">
              Semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {pendingQuests.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-6">Semua misi selesai! Cek misi baru besok 🎉</p>
            ) : pendingQuests.map(q => (
              <div key={q.id} className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <span className="text-xs font-bold text-white leading-tight">{q.title}</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-300 whitespace-nowrap">+{q.xpReward} XP</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{ width: `${Math.min(100, (q.progress / q.targetCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
