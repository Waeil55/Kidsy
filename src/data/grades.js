// Grade metadata. Each grade owns its own reading profile, math curriculum, vocabulary and levels.
export const GRADES = [
  { key: 'KG', idx: 0, label: 'Kindergarten', short: 'KG', age: '5–6', emoji: '🧸', lv: 0,
    reading: 'Very short sentences, sight words, picture clues',
    session: '5–8 min a sitting', numbers: 'Counting 0–10, shapes, more/less',
    chapters: ['Letter Cove', 'Counting Meadow', 'Shape Forest', 'Rainbow Bay', 'Star Castle'] },
  { key: 'G1', idx: 1, label: 'Grade 1', short: 'G1', age: '6–7', emoji: '🐣', lv: 1,
    reading: 'Simple sentences, first / next / last, feelings',
    session: '8–12 min a sitting', numbers: 'Addition & subtraction within 20',
    chapters: ['Sound Springs', 'Number Nest', 'Story Shore', 'Word Woods', 'Sunrise Summit'] },
  { key: 'G2', idx: 2, label: 'Grade 2', short: 'G2', age: '7–8', emoji: '🦊', lv: 2,
    reading: 'Short paragraphs, because / so, character feelings',
    session: '10–15 min a sitting', numbers: 'To 1,000 with regrouping, intro to ×',
    chapters: ['Fable Fields', 'Regroup Ridge', 'Phonics Falls', 'Wonder Wharf', 'Compass Castle'] },
  { key: 'G3', idx: 3, label: 'Grade 3', short: 'G3', age: '8–9', emoji: '🦉', lv: 2,
    reading: 'Multi-paragraph texts, cause & effect, vocabulary in context',
    session: '15–20 min a sitting', numbers: '×/÷ facts to 10×10, fractions, area',
    chapters: ['Letter Cove', 'Times-Table Trail', 'Fraction Falls', 'Grammar Grove', 'Star Whale Keep'] },
  { key: 'G4', idx: 4, label: 'Grade 4', short: 'G4', age: '9–10', emoji: '🦈', lv: 3,
    reading: 'Theme, point of view, figurative language, text structure',
    session: '20–25 min a sitting', numbers: 'Multi-digit ×, long ÷, decimals',
    chapters: ['Deep Ocean Quest', 'Factor Forest', 'Decimal Dunes', 'Theme Temple', 'Coral Citadel'] },
  { key: 'G5', idx: 5, label: 'Grade 5', short: 'G5', age: '10–11', emoji: '🚀', lv: 3,
    reading: 'Compare & contrast, inference, author’s purpose',
    session: '25–30 min a sitting', numbers: 'Fraction & decimal operations, volume',
    chapters: ['Clockwork City', 'Fraction Foundry', 'Volume Valley', 'Inference Isles', 'Nova Observatory'] },
  { key: 'G6', idx: 6, label: 'Grade 6', short: 'G6', age: '11–12', emoji: '🌍', lv: 4,
    reading: 'Central idea, claims & evidence, tone and word choice',
    session: '30–40 min a sitting', numbers: 'Ratios, percentages, negatives, algebra',
    chapters: ['Harbor at Dawn', 'Ratio Reef', 'Integer Islands', 'Evidence Estuary', 'Summit of Reason'] },
];

export const GRADE_BY_KEY = Object.fromEntries(GRADES.map((g) => [g.key, g]));
export const gradeIdx = (k) => (GRADE_BY_KEY[k] ? GRADE_BY_KEY[k].idx : 3);
export const LEVELS_PER_GRADE = 50;
export const STORIES_PER_GRADE = 500;
export const STORIES_PER_LEVEL = 10;
export const MATH_PER_LEVEL = 10;
export const Q_PER_STORY = 20;
export const Q_PER_SET = 10;

export const chapterOf = (grade, level) => {
  const g = GRADE_BY_KEY[grade] || GRADES[3];
  return g.chapters[Math.min(4, Math.floor((level - 1) / 10))];
};

export const SUBJECTS = [
  { key: 'reading', label: 'Reading', emoji: '📖' },
  { key: 'math', label: 'Math', emoji: '🔢' },
  { key: 'vocab', label: 'Vocabulary', emoji: '🔤' },
  { key: 'grammar', label: 'Grammar', emoji: '✏️' },
  { key: 'fill', label: 'Fill in the blank', emoji: '🧩' },
  { key: 'english', label: 'English', emoji: '📚' },
  { key: 'science', label: 'Science', emoji: '🔬' },
  { key: 'social', label: 'Social studies', emoji: '🌍' },
  { key: 'other', label: 'Other', emoji: '📚' },
];
export const SUBJECT_BY_KEY = Object.fromEntries(SUBJECTS.map((s) => [s.key, s]));
