import React from 'react';
import { 
  Zap, 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  TrendingUp, 
  Award, 
  Volume2, 
  VolumeX, 
  Flame,
  LogOut,
  User,
  Sun,
  Moon
} from 'lucide-react';
import { sounds } from '../utils/sound';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  soundEnabled, 
  toggleSound,
  theme = 'dark',
  toggleTheme,
  onLogout 
}) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transaksi', icon: Receipt },
    { id: 'budgets', label: 'Anggaran', icon: PieChart },
    { id: 'savings', label: 'Target Tabungan', icon: Target },
    { id: 'invest', label: 'Simulasi Investasi', icon: TrendingUp, badge: 'Virtual' },
    { id: 'quests', label: 'Misi & Kuis', icon: Award }
  ];

  const isLight = theme === 'light';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f17]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => { sounds.playCoin(); setActiveTab('dashboard'); }}
              className="cursor-pointer flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-lime-400 via-emerald-400 to-teal-500 text-black font-black text-2xl shadow-[0_0_20px_rgba(163,230,53,0.35)] transform hover:scale-105 transition-all"
            >
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-black stroke-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Space_Grotesk']">
                  Fin<span className="text-lime-400">Z</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/20">
                  EDUKASI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Gamified Budgeting & Micro-Investing</p>
            </div>
          </div>

          {/* Navigation Pills (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/80 border border-white/5 rounded-2xl shadow-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-bold shadow-md shadow-lime-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-black text-lime-300' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Streak Counter */}
            <div
              title={`Streak aktif: ${user?.streak || 0} hari`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold font-['Space_Grotesk']"
            >
              <Flame className="w-4 h-4 fill-orange-400" />
              <span>{user?.streak || 0}d</span>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => {
                sounds.playClick();
                toggleTheme();
              }}
              title={isLight ? 'Ubah ke Mode Gelap (Dark Mode)' : 'Ubah ke Mode Terang (Light Mode)'}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isLight 
                  ? 'bg-amber-100/80 text-amber-600 border-amber-300 hover:bg-amber-200/80 shadow-sm'
                  : 'bg-slate-800/60 text-slate-300 border-white/5 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {isLight ? (
                <Sun className="w-4 h-4 fill-amber-500 text-amber-500 animate-in spin-in-180 duration-200" />
              ) : (
                <Moon className="w-4 h-4 fill-indigo-400/40 text-indigo-300 animate-in spin-in-180 duration-200" />
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Matikan Suara SFX' : 'Aktifkan Suara SFX'}
              className="p-2 rounded-xl bg-slate-800/60 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-lime-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* User Level Badge */}
            <div 
              onClick={() => { sounds.playClick(); setActiveTab('quests'); }}
              className="cursor-pointer flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-lime-400/40 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  Lv.{user?.level || 1}
                  <span className="text-[10px] text-slate-400 font-normal truncate max-w-[80px]">
                    {user?.name?.split(' ')[0]}
                  </span>
                </div>
                <div className="text-[10px] text-lime-400 font-semibold">
                  {user?.xp || 0} XP
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                sounds.playClick();
                if (window.confirm('Yakin ingin keluar dari akun FinZ?')) {
                  onLogout();
                }
              }}
              title="Keluar dari akun"
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-white/5 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(tab.id);
                }}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  isActive ? 'text-lime-400' : 'text-slate-400'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
