const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// Helper to generate dynamic Gen-Z FinZ advice / roast based on real DB status
function generateCopilotResponse(userMessage, mode, db) {
  const user = db.user;
  const holdings = db.userHoldings;
  const txs = db.transactions;
  const roundUp = user.roundUpSettings.accumulatedRoundUp;

  // Compute stats
  let totalInvested = 0;
  holdings.forEach(h => {
    const a = db.assets.find(item => item.id === h.assetId);
    if (a) totalInvested += (h.units * a.unitPrice);
  });

  const netWorth = user.cashBalance + totalInvested + roundUp;
  const lowerMsg = (userMessage || '').toLowerCase();

  // Savage Roaster Mode
  if (mode === 'savage') {
    if (lowerMsg.includes('roast') || lowerMsg.includes('pengeluaran') || lowerMsg.includes('boros') || lowerMsg.includes('jajan')) {
      return `🔥🔥 ROAST ALERT:
Halo ${user.name}, gue cek mutasi lu barusan. Lu ngeluh dompet seret tapi jajan Kopi Kenangan Rp 42.300 pas sore-sore ga mikir dua kali ya?! 
Saldo tunai lu tinggal Rp ${user.cashBalance.toLocaleString('id-ID')}, untung lu nyalain fitur Round-Up FinZ jadi sisa Rp ${roundUp.toLocaleString('id-ID')} terselamatkan otomatis!
Coba kurangi nongkrong FOMO di Senopati atau PIK, mending recehan lu dilempar ke AI Titans atau Micro-Emas biar pas tua lu ga cuma flexing story 'aesthetic' doang tapi portofolio beneran cuan! ☕💀`;
    }

    if (lowerMsg.includes('beli') || lowerMsg.includes('iphone') || lowerMsg.includes('gadget') || lowerMsg.includes('sepatu') || lowerMsg.includes('tiket')) {
      return `💀 REALITY SLAP:
Tahan jempol lu di tombol checkout! Net worth lu sekarang Rp ${netWorth.toLocaleString('id-ID')}. Kalau lu paksain beli pake Paylater cuma demi validasi netizen, bunga 3% per bulan bakalan bikin lu makan mie instan akhir bulan. Terapkan 'Aturan 72 Jam' di menu Budgeting FinZ dulu, kalau 3 hari lagi lu masih mikirin itu barang, baru kita hitung ulang!`;
    }

    if (lowerMsg.includes('invest') || lowerMsg.includes('mulai') || lowerMsg.includes('receh')) {
      return `⚡ GASKEUN:
Ngapain nunggu punya 100 juta baru mau investasi? Keburu inflasi makan uang lu! Di FinZ modal Rp 5.000 dari kembalian boba aja udah dapet pecahan ESG EcoWarrior atau Emas. Langsung klik tab Micro-Investing sekarang, ga pake alesan besok-besok!`;
    }

    // Default savage response
    return `Woy bestie, gue AI FinZ yang jujur tanpa filter: Saldo tunai lu Rp ${user.cashBalance.toLocaleString('id-ID')} dan pundi receh Rp ${roundUp.toLocaleString('id-ID')}. Hidup cuma sekali (YOLO) bukan berarti dompet lu harus sekarat tiap tanggal 20. Kelola cashflow lu, jangan sampai kalah sama gengsi!`;
  }

  // Bestie / Smart Mentor Mode (Default)
  if (lowerMsg.includes('roast') || lowerMsg.includes('boros') || lowerMsg.includes('evaluasi')) {
    return `Hai ${user.name}! 💡 Mari kita evaluasi keuanganmu secara objektif:
Saat ini total Net Worth kamu berada di Rp ${netWorth.toLocaleString('id-ID')} dengan portofolio investasi aktif sebesar Rp ${totalInvested.toLocaleString('id-ID')}.
Kamu sudah mengumpulkan Rp ${roundUp.toLocaleString('id-ID')} di pundi receh otomatis!
Saran FinZ: Alokasi jajan kopi dan nongkrong bulan ini sudah menyentuh 72% dari batas 'Wants'. Coba manfaatkan fitur Auto-Sweep receh ke aset berisiko rendah seperti Micro-Emas untuk memperkuat dana daruratmu! 🌟`;
  }

  if (lowerMsg.includes('beli') || lowerMsg.includes('gadget') || lowerMsg.includes('wishlist') || lowerMsg.includes('mampu')) {
    return `Pertimbangan bijak sebelum membeli:
1. Pastikan dana daruratmu tidak terganggu (idealnya 3x pengeluaran bulanan).
2. Gunakan kalkulator 'FOMO Shield' di tab Budgeting untuk menghitung berapa jam kerja yang dibutuhkan untuk menebus barang tersebut.
3. Jika barang tersebut merupakan aset produktif (misal laptop penunjang freelance gig), itu investasi bagus! Tapi jika sekadar lifestyle, tunda 72 jam terlebih dahulu. ✨`;
  }

  if (lowerMsg.includes('invest') || lowerMsg.includes('rekomendasi') || lowerMsg.includes('portofolio')) {
    return `Rekomendasi Portofolio FinZ untuk profil kamu (Level ${user.level}):
🌿 **ESG EcoWarrior** cocok untuk kestabilan jangka menengah (+18.4% 1Y).
⚡ **Gen Z AI Titans** untuk pertumbuhan agresif jangka panjang (+34.2% 1Y).
🪙 **Micro-Emas 24K** sebagai pelindung inflasi yang likuid.
Gunakan strategi Dollar-Cost Averaging (DCA) dengan memanfaatkan Round-Up otomatis tiap kali bertransaksi!`;
  }

  // Default mentor response
  return `Halo ${user.name}! 🚀 Aku FinZ AI Mentor siap membantumu mencapai kebebasan finansial.
Statusmu saat ini:
- Level: Lv ${user.level} (${user.xp} XP)
- Streak Nabung: 🔥 ${user.streak} Hari Beruntun
- Pundi Receh Terkumpul: Rp ${roundUp.toLocaleString('id-ID')}
Ada yang ingin kamu diskusikan seputar budgeting, micro-investing, atau analisis pengeluaranmu?`;
}

// POST /api/copilot/chat
router.post('/chat', (req, res) => {
  const db = getDb();
  const { message, mode } = req.body; // mode: 'mentor' | 'savage'

  const activeMode = mode === 'savage' ? 'savage' : 'mentor';
  const reply = generateCopilotResponse(message, activeMode, db);

  res.json({
    reply,
    mode: activeMode,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
