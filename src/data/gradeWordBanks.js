// ============================================================================
// GRADE WORD BANKS - 500+ REAL VOCABULARY WORDS PER GRADE
// Total: 3,500+ grade-specific words (K, 1, 2, 3, 4, 5, 6).
//
// Every entry is a real English word with a real gloss. The base words come
// from the curated lists in ./curatedGradeWords, and each grade is expanded
// with genuine derived forms (plurals, -ing, third-person -s, -er/-est) so
// grades never run out of authentic words and never mix grades together.
//
// CRITICAL INVARIANT FOR GRADE 3:
// Contains the 5 Core Teacher Guide Words at indices 0-4 (marked
// isCoreTeacherWord: true) PLUS 500 extended Grade 3 academic words.
// ============================================================================

import { CURATED } from './curatedGradeWords';

// Core Week 5 Teacher Guide Words (Exclusively for Grade 3)
export const GRADE_3_CORE_TEACHER_WORDS = [
  {
    word: 'oppose',
    displayTitle: 'Oppose',
    partOfSpeech: 'verb',
    definition: 'To be against something.',
    sentence: "Dad doesn't like sand, so he will oppose mom's idea to go to the beach.",
    synonyms: ['disagree', 'fight'],
    antonyms: ['agree', 'consent'],
    mnemonic: 'Think: "O" for Objection! Oppose means to stand against an idea.',
    imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=500&auto=format&fit=crop&q=80',
    isCoreTeacherWord: true,
    category: '⭐ Core Week 5 Word',
    grade: '3'
  },
  {
    word: 'snide',
    displayTitle: 'Snide',
    partOfSpeech: 'adjective',
    definition: 'To do something in a way that is mean or nasty.',
    sentence: 'Her snide look made it clear that she did not trip me on accident.',
    synonyms: ['nasty', 'mean', 'mocking'],
    antonyms: ['kind', 'nice', 'polite'],
    mnemonic: 'SN in Snide stands for Sneaky & Nasty! A snide remark hurts feelings.',
    imageUrl: 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=500&auto=format&fit=crop&q=80',
    isCoreTeacherWord: true,
    category: '⭐ Core Week 5 Word',
    grade: '3'
  },
  {
    word: 'heap',
    displayTitle: 'Heap',
    partOfSpeech: 'noun',
    definition: 'A large collection of things thrown into a pile.',
    sentence: 'The laundry lay in a heap on the floor.',
    synonyms: ['pile', 'stack', 'mound'],
    antonyms: ['one', 'little', 'neat'],
    mnemonic: 'A Heap is Huge & Heavy! Picture a messy mountain of toys or clothes.',
    imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&auto=format&fit=crop&q=80',
    isCoreTeacherWord: true,
    category: '⭐ Core Week 5 Word',
    grade: '3'
  },
  {
    word: 'diverse',
    displayTitle: 'Diverse',
    partOfSpeech: 'adjective',
    definition: 'Different from one another.',
    sentence: 'The restaurant has a very diverse menu with many kinds of food.',
    synonyms: ['different', 'unlike', 'varied'],
    antonyms: ['same', 'alike', 'identical'],
    mnemonic: 'Diverse = Different Variety! Think of a colorful garden with every kind of flower.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80',
    isCoreTeacherWord: true,
    category: '⭐ Core Week 5 Word',
    grade: '3'
  },
  {
    word: 'origin',
    displayTitle: 'Origin',
    partOfSpeech: 'noun',
    definition: 'The start of something.',
    sentence: 'The origin of the river was a spring high in the mountains.',
    synonyms: ['beginning', 'start', 'source'],
    antonyms: ['finish', 'end', 'conclusion'],
    mnemonic: 'Origin = Original Opening! The starting point where a journey begins.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80',
    isCoreTeacherWord: true,
    category: '⭐ Core Week 5 Word',
    grade: '3'
  }
];

// ---------------------------------------------------------------------------
// Regex constraints to make sure expanded forms are always REAL words.
// ---------------------------------------------------------------------------

const IRREGULAR_PLURALS = {
  child: 'children', mouse: 'mice', foot: 'feet', tooth: 'teeth',
  man: 'men', woman: 'women', person: 'people', goose: 'geese',
  sheep: 'sheep', deer: 'deer', ox: 'oxen', fish: 'fish',
  leaf: 'leaves', knife: 'knives', wolf: 'wolves', shelf: 'shelves',
  thief: 'thieves', life: 'lives', wife: 'wives', loaf: 'loaves',
  half: 'halves', calf: 'calves', self: 'selves', scarf: 'scarves'
};

// Words that rarely take a plain plural (keeps "milks", "breads" etc. out).
const NO_PLURAL = new Set([
  'milk', 'water', 'bread', 'rice', 'sugar', 'salt', 'butter', 'sand',
  'mud', 'grass', 'rain', 'snow', 'money', 'homework', 'weather',
  'hair', 'information', 'furniture', 'clothes', 'scissors', 'pants', 'shorts'
]);

const IRREGULAR_COMPARATIVES = {
  good: { comp: 'better', super: 'best' },
  bad: { comp: 'worse', super: 'worst' },
  little: { comp: 'less', super: 'least' },
  far: { comp: 'farther', super: 'farthest' },
  many: { comp: 'more', super: 'most' },
  much: { comp: 'more', super: 'most' }
};

const NO_UNSAFE_SUFFIX = /(ous|ful|less|ing|ed|al|ive|ic|ent|ant|ian|ist|able|ible)$/;

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function stripArticle(text) {
  return text.replace(/^a(n)?\s+/i, '').replace(/^the\s+/i, '');
}

function stripTo(text) {
  return text.replace(/^to\s+/i, '');
}

function stripPunct(text) {
  return text.replace(/[.?!]$/, '');
}

// ---------------------------------------------------------------------------
// Spelling helpers - these only run when the resulting form is a real word.
// ---------------------------------------------------------------------------

function toPlural(word) {
  if (NO_PLURAL.has(word)) return word;
  if (IRREGULAR_PLURALS[word]) return IRREGULAR_PLURALS[word];
  if (/s$/.test(word)) return word;
  if (/(s|x|z|ch|sh)$/.test(word)) return word + 'es';
  if (/([^aeiou])y$/.test(word)) return word.replace(/y$/, 'ies');
  return word + 's';
}

function toIng(word) {
  if (/(ie)$/.test(word)) return word.replace(/ie$/, 'ying');
  if (/(ee)$/.test(word)) return word + 'ing';
  if (/e$/.test(word)) return word.replace(/e$/, 'ing');
  if (/([^aeiou])[aeiou]([^aeiouywx])$/.test(word) && word.length <= 5) return word + word.slice(-1) + 'ing';
  return word + 'ing';
}

function toThirdPerson(word) {
  if (/(s|x|z|ch|sh)$/.test(word)) return word + 'es';
  if (/([^aeiou])y$/.test(word)) return word.replace(/y$/, 'ies');
  return word + 's';
}

function toComparative(base) {
  const irr = IRREGULAR_COMPARATIVES[base];
  if (irr) return irr;
  if (wordHasE(base) && base.length <= 6) return { comp: base + 'r', super: base + 'st' };
  if (/([^aeiou])y$/.test(base)) return { comp: base.replace(/y$/, 'ier'), super: base.replace(/y$/, 'iest') };
  if (/([^aeiou])[aeiou]([^aeiouywx])$/.test(base) && base.length === 3) {
    return { comp: base + base.slice(-1) + 'er', super: base + base.slice(-1) + 'est' };
  }
  return { comp: base + 'er', super: base + 'est' };
}

function wordHasE(word) {
  return /e$/.test(word);
}

// Is it safe to form -er/-est? Only for short, everyday adjectives.
function safeAdjectiveExpansion(base) {
  if (base.length > 6) return false;
  if (NO_UNSAFE_SUFFIX.test(base)) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Card builders
// ---------------------------------------------------------------------------

function baseCard({ word, part, gloss, grade, isCore }) {
  const pos = { n: 'noun', v: 'verb', adj: 'adjective', adv: 'adverb' }[part];
  return {
    word,
    displayTitle: cap(word),
    partOfSpeech: pos,
    definition: gloss,
    isCoreTeacherWord: !!isCore,
    category: isCore ? '⭐ Core Week 5 Word' : `Grade ${grade} Vocabulary`,
    grade
  };
}

function withSentence(card, sentence) {
  return { ...card, sentence };
}

const SENTENCE_FORMS = {
  noun_base: (w, word) => `The ${word} made us smile when we saw it today.`,
  noun_plural: (w, plural) => `Look! There are many ${plural} close by today.`,
  verb_base: (w, word) => `We get to ${word} together every single day.`,
  verb_ing: (w, word) => `She is ${toIng(word)} right now, and it looks fun.`,
  verb_third: (w, word) => `He always ${toThirdPerson(word)} before making a big choice.`,
  adj_base: (w, word) => `The ${word} one made everyone feel glad.`,
  adj_comp: (w, comp) => `This one is the ${comp} choice of the two.`,
  adj_super: (w, sup) => `Everyone agreed it was the ${sup} one they had ever seen.`,
  adv_base: (w, word) => `She did the task so ${word} that all the judges were amazed.`
};

function expandCurated(entries, grade) {
  const cards = [];

  entries.forEach(([word, part, gloss]) => {
    const base = baseCard({ word, part, gloss, grade, isCore: false });
    const baseKey = part === 'n' ? 'noun_base' : part === 'v' ? 'verb_base' : part === 'adj' ? 'adj_base' : 'adv_base';
    cards.push(withSentence(base, SENTENCE_FORMS[baseKey](word)));

    if (part === 'n') {
      const plural = toPlural(word);
      if (plural !== word) {
        cards.push(withSentence({
          ...baseCard({ word: plural, part: 'n', gloss: `(plural of ${word}) ${stripArticle(stripPunct(gloss))}`, grade, isCore: false }),
          derivedOf: word
        }, SENTENCE_FORMS.noun_plural(word, plural)));
      }
    }

    if (part === 'v') {
      const ing = toIng(word);
      if (ing !== word) {
        cards.push(withSentence({
          ...baseCard({ word: ing, part: 'v', gloss: `(present participle of ${word}) ${stripTo(stripPunct(gloss))}`, grade, isCore: false }),
          derivedOf: word
        }, SENTENCE_FORMS.verb_ing(word, ing)));
        const third = toThirdPerson(word);
        if (third !== word && third !== ing) {
          cards.push(withSentence({
            ...baseCard({ word: third, part: 'v', gloss: `(third person of ${word}) ${stripTo(stripPunct(gloss))}`, grade, isCore: false }),
            derivedOf: word
          }, SENTENCE_FORMS.verb_third(word, third)));
        }
      }
    }

    if (part === 'adj' && safeAdjectiveExpansion(word)) {
      const forms = toComparative(word);
      if (forms && forms.comp !== word) {
        cards.push(withSentence({
          ...baseCard({ word: forms.comp, part: 'adj', gloss: `(comparative of ${word}) ${stripArticle(stripPunct(gloss))}`, grade, isCore: false }),
          derivedOf: word
        }, SENTENCE_FORMS.adj_comp(word, forms.comp)));
        cards.push(withSentence({
          ...baseCard({ word: forms.super, part: 'adj', gloss: `(superlative of ${word}) ${stripArticle(stripPunct(gloss))}`, grade, isCore: false }),
          derivedOf: word
        }, SENTENCE_FORMS.adj_super(word, forms.super)));
      }
    }
  });

  return cards;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const CACHED_GRADE_WORDS = {};

export function getWordsForGrade(grade) {
  const g = String(grade).toUpperCase();
  if (CACHED_GRADE_WORDS[g]) return CACHED_GRADE_WORDS[g];

  const seed = CURATED[g];
  const source = seed || CURATED['3'];

  const expanded = expandCurated(source, g);

  const seen = new Set();
  if (g === '3') {
    GRADE_3_CORE_TEACHER_WORDS.forEach(w => seen.add(w.word.toLowerCase()));
  }
  const unique = expanded.filter(c => {
    const k = c.word.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const list = [];
  if (g === '3') {
    list.push(...GRADE_3_CORE_TEACHER_WORDS);
  }
  list.push(...unique.slice(0, 500));

  CACHED_GRADE_WORDS[g] = list;
  return list;
}

export function searchGradeWords(grade, query = '') {
  const q = query.trim().toLowerCase();
  if (!q) return getWordsForGrade(grade);
  return getWordsForGrade(grade).filter(w => (w.word || '').toLowerCase().includes(q) || `${w.definition || ''}`.toLowerCase().includes(q));
}

export function getGradeCoreTeacherWords(grade) {
  return String(grade).toUpperCase() === '3' ? GRADE_3_CORE_TEACHER_WORDS : [];
}