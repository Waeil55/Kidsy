// ============================================================================
// GRADE PRACTICE BANK - 500 graded practice questions per grade (K-6).
// Questions are generated strictly from the grade's OWN word cards, so grades
// are never mixed. Three rotating question types keep every question fresh.
// ============================================================================

import { getWordsForGrade } from './gradeWordBanks';

const CACHED = {};

function sentenceWithBlank(sentence, word) {
  if (!sentence) return null;
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escaped, 'i');
  const blanked = sentence.replace(re, '_____');
  if (blanked === sentence) return null;
  return blanked;
}

function pickDistractors(cards, i, excludePos) {
  const n = cards.length;
  const out = [];
  const used = new Set([i]);
  let step = 1;
  while (out.length < 3 && step < n) {
    const j = (i + step) % n;
    if (!used.has(j) && cards[j].partOfSpeech !== excludePos) {
      out.push(j);
      used.add(j);
    }
    step++;
  }
  let step2 = 1;
  while (out.length < 3 && step2 < n) {
    const j = (i + step2) % n;
    if (!used.has(j)) {
      out.push(j);
      used.add(j);
    }
    step2++;
  }
  return out;
}

export function buildGradePracticeQuestions(grade, count = 500) {
  const g = String(grade).toUpperCase();
  if (CACHED[g]) return CACHED[g];

  const cards = getWordsForGrade(g);
  const n = cards.length;
  const questions = [];

  for (let i = 0; i < n; i++) {
    const card = cards[i];
    const distractorIdx = pickDistractors(cards, i, card.partOfSpeech);
    const distractors = distractorIdx.map(j => cards[j]);

    const label = card.displayTitle || card.word;
    const def = card.definition;
    const dDefs = distractors.map(c => c.definition).filter(d => d !== def).slice(0, 3);
    const dLabels = distractors.map(c => c.displayTitle || c.word).filter(x => x !== label).slice(0, 3);

    const type = i % 3;
    let question;

    if (type === 0) {
      // Definition: what does the word mean?
      while (dDefs.length < 3) dDefs.push(`A different Grade ${g} word.`);
      const choices = shuffle([def, ...dDefs]);
      question = {
        id: `prac-${g}-${i}-def`,
        type: 'definition',
        category: `Grade ${g} Practice`,
        title: `Meaning #${i + 1}`,
        prompt: `What does the word "${card.word}" mean?`,
        choices,
        answer: choices.indexOf(def),
        explanation: `${label}: ${def}`
      };
    } else if (type === 1) {
      // Word from definition
      while (dLabels.length < 3) dLabels.push(`Word ${dLabels.length + 1}`);
      const choices = shuffle([label, ...dLabels]);
      question = {
        id: `prac-${g}-${i}-rev`,
        type: 'reverse',
        category: `Grade ${g} Practice`,
        title: `Word Match #${i + 1}`,
        prompt: `Which word means: "${def}"?`,
        choices,
        answer: choices.indexOf(label),
        explanation: `${label}: ${def}`
      };
    } else {
      // Sentence blank
      const blanked = sentenceWithBlank(card.sentence, card.word);
      const fallback = blanked || `Complete the sentence with the best word.`;
      while (dLabels.length < 3) dLabels.push(`Word ${dLabels.length + 1}`);
      const choices = shuffle([label, ...dLabels]);
      question = {
        id: `prac-${g}-${i}-sen`,
        type: 'sentence',
        category: `Grade ${g} Practice`,
        title: `In Context #${i + 1}`,
        prompt: fallback,
        choices,
        answer: choices.indexOf(label),
        explanation: `${label}: ${def}`
      };
    }

    questions.push(question);
    if (questions.length >= count) break;
  }

  // Grade 3 gains extra margin; others guaranteed 500 by their 500-word list.
  CACHED[g] = questions;
  return questions;
}

export function getGradePracticeQuestions(grade) {
  return buildGradePracticeQuestions(String(grade).toUpperCase());
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[j], a[i]] = [a[i], a[j]];
  }
  return a;
}