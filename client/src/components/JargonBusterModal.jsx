import React, { useState } from 'react';
import { X, BookOpen, Search, Sparkles, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function JargonBusterModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState('');

  const terms = [
    {
      term: "Saham (Stocks)",
      tag: "Investasi",
      emoji: "📈",
      meaning: "Bukti kamu ikutan patungan jadi pemilik bisnis orang lain. Kalau perusahaannya makin laris (misal Alfamart/Nvidia), nilai bagianmu ikut naik!"
    },
    {
      term: "Dividen (Dividend)",
      tag: "Cuan Pasif",
      emoji: "💸",
      meaning: "Bagi hasil keuntungan bisnis yang dikirim langsung ke rekening kamu cuma karena kamu punya saham mereka. Mirip uang jajan pasif!"
    },
    {
      term: "Micro-Investing (Investasi Mikro)",
      tag: "Fitur FinZ",
      emoji: "🪙",
      meaning: "Nabung dan investasi dengan nominal sangat kecil (mulai Rp 5.000). Ga perlu nunggu kaya buat mulai beli aset berharga!"
    },
    {
      term: "Round-Up (Pundi Receh)",
      tag: "Fitur FinZ",
      emoji: "☕",
      meaning: "Fitur membulatkan harga jajan. Misal kopi Rp 22.400 dibulatkan jadi Rp 25.000, sisa receh Rp 2.600 otomatis diselamatkan jadi tabungan investasi."
    },
    {
      term: "Bunga Majemuk (Compound Interest)",
      tag: "Superpower",
      emoji: "❄️",
      meaning: "Efek 'bola salju' finansial: Duit kamu beranak, dan anak duit itu beranak lagi. Dalam 5-10 tahun, pertumbuhannya bisa eksponensial!"
    },
    {
      term: "FOMO (Fear of Missing Out)",
      tag: "Jebakan",
      emoji: "😱",
      meaning: "Rasa panik ketinggalan tren yang bikin kamu checkout barang viral (Labubu, tiket konser, outfit) padahal dompet lagi sekarat."
    },
    {
      term: "DCA (Dollar-Cost Averaging)",
      tag: "Strategi",
      emoji: "🎯",
      meaning: "Strategi 'nabung rutin santai' tanpa pusing mikirin harga naik-turun. Kamu beli rutin tiap minggu/bulan sedikit demi sedikit."
    },
    {
      term: "Diversifikasi",
      tag: "Aturan Emas",
      emoji: "🧺",
      meaning: "Prinsip: 'Jangan taro semua telur di satu keranjang'. Sebar uangmu di Emas, AI Tech, dan Energi Hijau biar kalau ada yang turun, yang lain tetap aman."
    },
    {
      term: "SLIK OJK (BI Checking)",
      tag: "Catatan Rapor",
      emoji: "📑",
      meaning: "Rapor kelakuan utangmu seumur hidup. Kalau kamu nunggak Paylater atau Pinjol, namamu masuk blacklist dan bakal susah sewa/beli rumah masa depan!"
    },
    {
      term: "Dana Darurat (Emergency Fund)",
      tag: "Pondasi",
      emoji: "🛡️",
      meaning: "Uang dingin cadangan yang cuma boleh disentuh kalau HP rusak, sakit, atau ada musibah mendadak. Bikin hidup tenang tanpa perlu ngutang."
    }
  ];

  const filtered = terms.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 border-lime-400/30 shadow-2xl relative max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-lime-400/20 text-lime-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-['Space_Grotesk']">
                Kamus Gaul Finansial (Gen Z & Alpha)
              </h3>
              <p className="text-xs text-slate-400">Istilah duit yang ribet dijelasin santai tanpa bikin pusing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="py-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari istilah: Dividen, Saham, FOMO, SLIK OJK..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400"
            />
          </div>
        </div>

        {/* Term List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Istilah tidak ditemukan. Coba ketik kata lain!
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 hover:border-lime-400/30 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm font-bold text-white font-['Space_Grotesk']">{item.term}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/20">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-7">
                  {item.meaning}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/5 text-center text-[11px] text-slate-400">
          💡 Paham istilah dasar bikin kamu kebal dari tipuan pinjol & investasi bodong!
        </div>

      </div>
    </div>
  );
}
