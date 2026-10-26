import React, { useState } from 'react';
import { 
  Award, 
  Flame, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Zap, 
  ChevronRight,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';

export default function QuestsTab({ 
  gamificationData, 
  quizQuestions, 
  onClaimQuest, 
  onAnswerQuiz, 
  onRefresh 
}) {
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const levelInfo = gamificationData?.levelInfo || {};
  const quests = gamificationData?.quests || [];
  const badges = gamificationData?.badges || [];
  const currentQuestion = quizQuestions?.[activeQuizIndex];

  const handleClaim = async (questInstanceId) => {
    sounds.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    await onClaimQuest(questInstanceId);
    onRefresh();
  };

  const handleQuizAnswer = async () => {
    if (selectedOption === null || !currentQuestion) return;
    setIsSubmittingQuiz(true);

    try {
      const res = await onAnswerQuiz({
        questionId: currentQuestion.id,
        selectedIndex: selectedOption
      });
      setQuizResult(res);

      if (res?.isCorrect) {
        sounds.playSuccess();
        confetti({ particleCount: 50, spread: 60 });
      } else {
        sounds.playClick();
      }
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleNextQuestion = () => {
    setQuizResult(null);
    setSelectedOption(null);
    if (quizQuestions.length > 0) {
      setActiveQuizIndex((prev) => (prev + 1) % quizQuestions.length);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Level & Streak Status */}
      <div className="glass-panel p-6 rounded-3xl border-purple-500/20 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Sistem Gamifikasi & Edukasi Finansial FinZ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">
              Misi, Lencana & Kuis Literasi Keuangan
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Setiap kebiasaan keuangan baik yang kamu catat menghasilkan XP untuk menaikkan levelmu!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 p-3.5 rounded-2xl border border-white/5">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Streak Aktif</span>
              <div className="text-xl font-black text-orange-400 font-['Space_Grotesk'] flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-400" />
                {gamificationData?.streak || 0} Hari
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Level Saat Ini</span>
              <div className="text-xl font-black text-purple-400 font-['Space_Grotesk'] flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 fill-purple-400" />
                Lv.{gamificationData?.level || 1}
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Total XP</span>
              <div className="text-xl font-black text-lime-400 font-['Space_Grotesk']">
                {gamificationData?.xp || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Quests List & Quiz Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Quests List */}
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Misi Harian & Mingguan
            </h3>
            <span className="text-xs text-slate-400">Bangun kebiasaan finansial bertahap</span>
          </div>

          <div className="space-y-3.5">
            {quests.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-6">Misi belum tersedia.</p>
            ) : (
              quests.map((q) => {
                const isDone = q.completed;
                const isClaimed = q.claimed;

                return (
                  <div 
                    key={q.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isClaimed
                        ? 'bg-slate-900/40 border-white/5 opacity-70'
                        : isDone
                        ? 'bg-purple-950/20 border-purple-500/40 shadow-sm shadow-purple-500/10'
                        : 'bg-slate-900/70 border-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white block">{q.title}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 uppercase font-semibold">
                            {q.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{q.desc}</p>
                      </div>
                      <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/20 whitespace-nowrap">
                        +{q.xpReward} XP
                      </span>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-lime-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (q.progress / q.targetCount) * 100)}%` }}
                        />
                      </div>
                      
                      <div>
                        {isDone && !isClaimed ? (
                          <button
                            onClick={() => handleClaim(q.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-extrabold text-xs shadow-md shadow-lime-400/20 hover:opacity-95 transition-all cursor-pointer"
                          >
                            Klaim XP!
                          </button>
                        ) : isClaimed ? (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Diklaim
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-medium">
                            {q.progress} / {q.targetCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Kuis Cerdas Melek Finansial */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between border-lime-400/20">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                    Kuis Literasi Keuangan
                  </h3>
                  <p className="text-xs text-slate-400">
                    Soal {activeQuizIndex + 1} dari {quizQuestions.length || 0}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-lime-400 px-2.5 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/20">
                +{currentQuestion?.xpReward || 50} XP
              </span>
            </div>

            {currentQuestion ? (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-white leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                  {currentQuestion.question}
                </p>

                <div className="space-y-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const showCorrect = quizResult && quizResult.correctIndex === idx;
                    const showWrong = quizResult && !quizResult.isCorrect && isSelected;

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={quizResult !== null}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedOption(idx);
                        }}
                        className={`w-full p-3.5 rounded-xl text-left text-xs font-medium transition-all border ${
                          showCorrect
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                            : showWrong
                            ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                            : isSelected
                            ? 'bg-lime-400/15 border-lime-400 text-lime-300 font-bold'
                            : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center text-[10px] font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Banner */}
                {quizResult && (
                  <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                    quizResult.isCorrect 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {quizResult.isCorrect ? '🎉 Jawaban Tepat!' : '⚠️ Kurang Tepat!'}
                    </div>
                    <p className="text-slate-300">{quizResult.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-xs text-slate-500 py-8">Sedang memuat soal kuis...</p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
            {quizResult ? (
              <button
                onClick={handleNextQuestion}
                className="w-full py-2.5 rounded-xl bg-lime-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-lime-300 transition-all cursor-pointer"
              >
                <span>Soal Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled={selectedOption === null || isSubmittingQuiz}
                onClick={handleQuizAnswer}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-40 cursor-pointer"
              >
                <span>{isSubmittingQuiz ? 'Memeriksa...' : 'Kirim Jawaban & Dapatkan XP'}</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Badges Vault */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Brankas Lencana & Penghargaan
          </h3>
          <p className="text-xs text-slate-400">Pencapaian yang terbuka seiring konsistensi pengelolaan keuanganmu</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`p-4 rounded-2xl border text-center flex flex-col justify-between transition-all ${
                badge.unlocked
                  ? 'bg-slate-900/80 border-purple-500/40 shadow-lg shadow-purple-500/10'
                  : 'bg-slate-950/40 border-white/5 opacity-50'
              }`}
            >
              <div>
                <div className={`w-14 h-14 mx-auto rounded-2xl mb-3 flex items-center justify-center text-2xl bg-gradient-to-tr ${badge.color} shadow-md text-white`}>
                  {badge.unlocked ? (
                    <span>{badge.name.split(' ')[0]}</span>
                  ) : (
                    <Lock className="w-6 h-6 text-slate-300" />
                  )}
                </div>

                <div className="font-bold text-sm text-white mb-1">
                  {badge.name}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                  {badge.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  badge.unlocked ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  {badge.unlocked ? `Terbuka (${badge.rarity})` : `Terkunci (${badge.rarity})`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
