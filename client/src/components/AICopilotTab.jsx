import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Flame, 
  Sparkles, 
  Lightbulb, 
  ShieldAlert, 
  Zap, 
  User, 
  CheckCircle, 
  Coffee 
} from 'lucide-react';
import { sounds } from '../utils/sound';

export default function AICopilotTab({ user, onChatCopilot }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Yo ${user?.name?.split(' ')[0] || 'Bestie'}! ⚡ Gue FinZ AI Copilot. 
Gue bisa jadi **Smart Mentor** yang bijak buat bantuin lu susun strategi keuangan, atau jadi **Savage Roaster** yang ceplas-ceplos buat nyadarin lu kalau suka belanja impulsif!
Pilih mode di atas atau langsung lempar pertanyaan ke gue!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState('mentor'); // 'mentor' | 'savage'
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    { label: "🔥 Roast pengeluaran gue minggu ini!", mode: "savage" },
    { label: "📱 Pengen beli gadget baru 5 juta, mampu ga?", mode: "mentor" },
    { label: "☕ Strategi nabung receh biar kekumpul sejuta", mode: "mentor" },
    { label: "⚡ Portofolio terbaik buat Gen Z modal 10 ribu?", mode: "mentor" }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customText, forcedMode) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || loading) return;

    const currentMode = forcedMode || mode;
    sounds.playClick();

    const userMsg = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setLoading(true);

    try {
      const res = await onChatCopilot(textToSend, currentMode);
      sounds.playSuccess();
      const botMsg = {
        sender: 'bot',
        text: res.reply,
        mode: res.mode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "Waduh, koneksi FinZ Copilot lagi ngadat bentar. Coba kirim lagi ya!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Copilot Header & Mode Switcher */}
      <div className="glass-panel p-6 rounded-3xl border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-slate-900 to-indigo-950/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
              <Bot className="w-3.5 h-3.5" />
              <span>FinZ Dual-Mode AI Financial Copilot</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">
              Asisten & Roaster Finansial Pribadi
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Didukung data riil saldo, mutasi, dan pundi investasimu
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-white/10">
            <button
              onClick={() => { sounds.playClick(); setMode('mentor'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'mentor'
                  ? 'bg-gradient-to-r from-lime-400 to-emerald-400 text-black shadow-md shadow-lime-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Smart Mentor</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setMode('savage'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'savage'
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Savage Roaster 🔥</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 flex flex-col h-[520px]">
        
        {/* Messages Scroll View */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => {
            const isBot = m.sender === 'bot';
            const isSavage = m.mode === 'savage';

            return (
              <div 
                key={idx}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-end flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isBot 
                    ? (isSavage ? 'bg-gradient-to-tr from-rose-500 to-orange-500 text-white shadow-rose-500/30' : 'bg-gradient-to-tr from-lime-400 to-emerald-500 text-black shadow-lime-400/30')
                    : 'bg-purple-600 text-white'
                }`}>
                  {isBot ? (isSavage ? <Flame className="w-5 h-5 fill-white" /> : <Bot className="w-5 h-5 stroke-[2.5]" />) : <User className="w-5 h-5" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isBot
                    ? (isSavage 
                        ? 'bg-rose-950/20 border border-rose-500/30 text-rose-100'
                        : 'bg-slate-900/90 border border-white/10 text-slate-200')
                    : 'bg-lime-400 text-black font-semibold shadow-md shadow-lime-400/10'
                }`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <div className={`text-[10px] mt-1.5 ${isBot ? 'text-slate-400' : 'text-black/60'} text-right`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs italic">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center animate-spin">
                <Sparkles className="w-4 h-4 text-lime-400" />
              </div>
              <span>FinZ sedang meracik jawaban berdasar saldo riilmu...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="pt-3 pb-2 flex flex-wrap gap-2 border-t border-white/5">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (q.mode) setMode(q.mode);
                handleSend(q.label, q.mode);
              }}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-lime-400/40 hover:bg-slate-800 transition-all cursor-pointer"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="pt-2">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-slate-900/90 border border-white/10 rounded-2xl p-2 focus-within:border-lime-400 transition-all"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={mode === 'savage' ? "Tanya apa aja, siap-siap kena roast..." : "Tanya seputar investasi mikro, alokasi budgeting, dll..."}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                mode === 'savage'
                  ? 'bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-30'
                  : 'bg-lime-400 hover:bg-lime-300 text-black disabled:opacity-30'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
