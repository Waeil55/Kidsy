/* KidLingo scores — persisted, NEVER auto-reset.
   Only a deliberate double-confirmed manual reset clears them. */

const KEY = 'kidlingo-scores-v1';

function blankGrade() {
  return { xp: 0, storiesRead: [], mathDone: 0, mathCorrect: 0, quizN: 0, quizCorrect: 0, levelsDone: [] };
}

function blank() {
  return {
    xp: 0,
    stars: 0,
    streak: { count: 0, lastDay: null },
    grades: {},
    vocabLearned: 0,
  };
}

export function loadScores() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const s = { ...blank(), ...JSON.parse(raw) };
    s.streak = s.streak || { count: 0, lastDay: null };
    s.grades = s.grades || {};
    return s;
  } catch (e) {
    return blank();
  }
}

export function saveScores(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch (e) { /* ignore */ }
}

export function gradeScores(s, gradeKey) {
  if (!s.grades[gradeKey]) s.grades[gradeKey] = blankGrade();
  return s.grades[gradeKey];
}

export function touchStreak(s) {
  const today = new Date().toISOString().slice(0, 10);
  if (s.streak.lastDay === today) return s;
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  s.streak.count = s.streak.lastDay === y ? s.streak.count + 1 : 1;
  s.streak.lastDay = today;
  return s;
}

export function accuracy(g) {
  const n = g.quizN + g.mathDone;
  const c = g.quizCorrect + g.mathCorrect;
  return n === 0 ? null : Math.round((c / n) * 100);
}

export function overallAccuracy(s) {
  let n = 0;
  let c = 0;
  Object.values(s.grades).forEach((g) => {
    n += g.quizN + g.mathDone;
    c += g.quizCorrect + g.mathCorrect;
  });
  return n === 0 ? null : Math.round((c / n) * 100);
}

/* Manual reset ONLY — UI must double-confirm before calling this. */
export function resetAllScores() {
  const s = blank();
  saveScores(s);
  return s;
}

export function levelUnlocked(s, gradeKey, n) {
  if (n === 1) return true;
  const g = gradeScores(s, gradeKey);
  return g.levelsDone.includes(n - 1);
}
