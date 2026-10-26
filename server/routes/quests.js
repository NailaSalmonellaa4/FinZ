const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');

// GET /api/quests
router.get('/', (req, res) => {
  const db = getDb();
  res.json({
    quests: db.quests,
    badges: db.badges,
    userLevel: db.user.level,
    userXp: db.user.xp,
    streak: db.user.streak
  });
});

// POST /api/quests/claim/:id
router.post('/claim/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const quest = db.quests.find(q => q.id === id);

  if (!quest) {
    return res.status(404).json({ error: "Misi quest tidak ditemukan!" });
  }

  if (!quest.completed) {
    return res.status(400).json({ error: "Misi ini belum selesai!" });
  }

  if (quest.claimed) {
    return res.status(400).json({ error: "Reward misi ini sudah pernah diklaim!" });
  }

  quest.claimed = true;
  db.user.xp += quest.rewardXp;

  // Check if this XP leads to level up
  const levelMilestone = Math.floor(db.user.xp / 1000) + 1;
  let leveledUp = false;
  if (levelMilestone > db.user.level) {
    db.user.level = levelMilestone;
    leveledUp = true;
  }

  saveDb(db);

  res.json({
    success: true,
    message: `Klaim reward quest berhasil! +${quest.rewardXp} XP telah ditambahkan!`,
    claimedXp: quest.rewardXp,
    totalXp: db.user.xp,
    currentLevel: db.user.level,
    leveledUp
  });
});

// GET /api/quests/quiz
router.get('/quiz', (req, res) => {
  const db = getDb();
  // Return quiz without exposing answers directly or with questions
  const sanitizedQuiz = db.quizQuestions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    xpReward: q.xpReward
  }));
  res.json({ questions: sanitizedQuiz });
});

// POST /api/quests/quiz/submit
router.post('/quiz/submit', (req, res) => {
  const db = getDb();
  const { questionId, selectedAnswer } = req.body;

  const question = db.quizQuestions.find(q => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: "Soal kuis tidak ditemukan!" });
  }

  const isCorrect = Number(selectedAnswer) === question.correctAnswer;
  let xpAwarded = 0;

  if (isCorrect) {
    xpAwarded = question.xpReward || 50;
    db.user.xp += xpAwarded;

    // Update quest 5
    const q5 = db.quests.find(q => q.id === 'q-5');
    if (q5 && !q5.completed) {
      q5.progress = 1;
      q5.completed = true;
    }

    saveDb(db);
  }

  res.json({
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    xpAwarded,
    newTotalXp: db.user.xp,
    message: isCorrect 
      ? `🎉 Keren banget! Jawaban kamu benar! (+${xpAwarded} XP)` 
      : `Yah kurang tepat! Tapi tenang, belajar literasi finansial itu proses! Simak penjelasannya ya.`
  });
});

module.exports = router;
