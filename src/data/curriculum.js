import { DEFAULT_CURRICULUM } from './curriculumData.js';

export const grades = ['K', '1', '2', '3', '4', '5', '6'];

export const subjects = [
  { id: 'week5', name: '⭐ Week 5 Focus', icon: '⭐', description: 'Teacher Guide: Oppose, Snide, Heap, Diverse, Origin.', gradient: 'gold' },
  { id: 'reading', name: 'Reading & English', icon: '📚', description: 'Vocabulary, phonics, context clues, and comprehension.', gradient: 'sky' },
  { id: 'math', name: 'Math', icon: '🔢', description: 'Multiplication, division, fractions, geometry & facts.', gradient: 'sun' },
  { id: 'science', name: 'Science', icon: '🔬', description: 'Solar system, matter, ecosystems, photosynthesis & forces.', gradient: 'mint' },
  { id: 'social', name: 'Social Studies', icon: '🌎', description: 'Continents, equator, map skills, and good citizenship.', gradient: 'violet' },
  { id: 'arts', name: 'Arts & Creativity', icon: '🎨', description: 'Create, perform, design, and express ideas.', gradient: 'rose' },
  { id: 'life', name: 'Life Skills', icon: '🌟', description: 'Healthy habits, routines, safety and independence.', gradient: 'green' }
];

// Helper to shuffle choices
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Convert user's Grade 3 Week 5 words into rich interactive Lessons
const week5Lessons = (DEFAULT_CURRICULUM.week5 || []).map((item, idx) => {
  const questions = [];

  // Question 1: Definition
  const otherDefs = (DEFAULT_CURRICULUM.week5 || [])
    .filter(o => o.word !== item.word)
    .map(o => o.definition);
  const defChoices = [item.definition, ...otherDefs.slice(0, 3)];
  const correctDef = item.definition;
  // deterministically sort or keep choice
  const sortedDefChoices = [item.definition, otherDefs[0] || 'To run quickly', otherDefs[1] || 'A quiet place', otherDefs[2] || 'A new invention'];
  // Keep item.definition at index 0 or randomize with trackable index
  questions.push({
    prompt: `What is the definition of "${item.word}" (${item.partOfSpeech})?`,
    choices: sortedDefChoices,
    answer: 0,
    explanation: `"${item.word}" (${item.partOfSpeech}) means: ${item.definition}`
  });

  // Question 2: Fill in the blank sentence
  if (item.sentences && item.sentences.length > 0) {
    const sentence = item.sentences[0];
    const sentenceChoices = item.contextOptions || item.quizOptions || [item.word, 'jump', 'bright', 'friend'];
    const ansIdx = Math.max(0, sentenceChoices.indexOf(item.word));
    questions.push({
      prompt: `Complete the sentence:\n"${sentence}"`,
      choices: sentenceChoices,
      answer: ansIdx,
      explanation: item.teacherSentence || `The correct word is "${item.word}".`
    });
  }

  // Question 3: Synonyms & Antonyms
  if (item.synonyms && item.synonyms.length > 0) {
    const correctSyn = item.synonyms[0];
    const choices = [correctSyn, ...(item.antonyms || ['wrong', 'far', 'low']).slice(0, 2), 'fast'];
    questions.push({
      prompt: `Which word is a SYNONYM (same meaning) for "${item.word}"?`,
      choices: choices,
      answer: 0,
      explanation: `Synonyms for "${item.word}" include: ${item.synonyms.join(', ')}.`
    });
  }

  if (item.antonyms && item.antonyms.length > 0) {
    const correctAnt = item.antonyms[0];
    const choices = [correctAnt, ...(item.synonyms || ['near', 'high', 'blue']).slice(0, 2), 'slow'];
    questions.push({
      prompt: `Which word is an ANTONYM (opposite meaning) for "${item.word}"?`,
      choices: choices,
      answer: 0,
      explanation: `Antonyms for "${item.word}" include: ${item.antonyms.join(', ')}.`
    });
  }

  return {
    id: `3-week5-${idx}`,
    grade: '3',
    subject: 'week5',
    title: `${item.displayTitle || item.word} (${item.partOfSpeech})`,
    word: item.word,
    description: item.definition,
    duration: 8,
    xp: 35,
    difficulty: 'Teacher Guide',
    emoji: item.image || '⭐',
    imageUrl: item.imageUrl,
    partOfSpeech: item.partOfSpeech,
    synonyms: item.synonyms,
    antonyms: item.antonyms,
    sentences: item.sentences,
    funFact: item.funFact,
    questions
  };
});

// Convert user's English power words into Lessons
const englishLessons = (DEFAULT_CURRICULUM.english || []).map((item, idx) => {
  const questions = [
    {
      prompt: `What is the meaning of "${item.word}"?`,
      choices: [
        item.definition,
        'To walk backwards slowly',
        'Something that makes a loud ringing sound',
        'To forget where you put your pencil'
      ],
      answer: 0,
      explanation: `"${item.word}" means: ${item.definition}`
    }
  ];

  if (item.sentences && item.sentences.length > 0) {
    const choices = item.quizOptions || [item.word, 'gentle', 'cloud', 'silent'];
    const ansIdx = Math.max(0, choices.indexOf(item.word));
    questions.push({
      prompt: `Fill in the missing word:\n"${item.sentences[0]}"`,
      choices: choices,
      answer: ansIdx,
      explanation: `Correct word: "${item.word}". ${item.sentences[0].replace('_________', item.word)}`
    });
  }

  if (item.funFact) {
    questions.push({
      prompt: `Fun Fact: ${item.funFact}\n\nIs this fact true?`,
      choices: ['Yes, absolutely!', 'No, it is made up', 'Not sure', 'Only on weekends'],
      answer: 0,
      explanation: `It is true! ${item.funFact}`
    });
  }

  return {
    id: `3-reading-${idx}`,
    grade: '3',
    subject: 'reading',
    title: item.displayTitle || item.word,
    word: item.word,
    description: item.definition,
    duration: 10,
    xp: 30,
    difficulty: item.category || 'Core',
    emoji: item.image || '📚',
    imageUrl: item.imageUrl,
    partOfSpeech: item.partOfSpeech || 'word',
    synonyms: item.synonyms || [],
    antonyms: item.antonyms || [],
    sentences: item.sentences || [],
    funFact: item.funFact,
    questions
  };
});

// Convert user's Math items into Lessons
const mathLessons = (DEFAULT_CURRICULUM.math || []).map((item, idx) => {
  const questions = [
    {
      prompt: `${item.displayTitle}\n${item.sentences ? item.sentences[0] : item.definition}`,
      choices: item.quizOptions || [item.word, '12', '15', '30'],
      answer: Math.max(0, (item.quizOptions || []).indexOf(item.word)),
      explanation: `${item.definition} ${item.hint ? `Tip: ${item.hint}` : ''}`
    }
  ];

  if (item.sentences && item.sentences.length > 1) {
    questions.push({
      prompt: item.sentences[1],
      choices: item.contextOptions || item.quizOptions || [item.word, '10', '25', '40'],
      answer: Math.max(0, (item.contextOptions || item.quizOptions || []).indexOf(item.word)),
      explanation: `${item.definition}`
    });
  }

  return {
    id: `3-math-${idx}`,
    grade: '3',
    subject: 'math',
    title: item.displayTitle,
    word: item.word,
    description: item.definition,
    duration: 10,
    xp: 30,
    difficulty: item.category || 'Core',
    emoji: item.image || '🔢',
    imageUrl: item.imageUrl,
    questions
  };
});

// Convert user's Science items into Lessons
const scienceLessons = (DEFAULT_CURRICULUM.science || []).map((item, idx) => {
  const questions = [
    {
      prompt: `Science Quest: ${item.displayTitle}\n\n${item.sentences ? item.sentences[0] : item.definition}`,
      choices: item.quizOptions || [item.word, 'star', 'fossil', 'energy'],
      answer: Math.max(0, (item.quizOptions || []).indexOf(item.word)),
      explanation: `${item.definition} ${item.funFact ? `Did you know? ${item.funFact}` : ''}`
    }
  ];

  if (item.sentences && item.sentences.length > 1) {
    questions.push({
      prompt: `Complete the fact:\n"${item.sentences[1]}"`,
      choices: item.contextOptions || item.quizOptions || [item.word, 'element', 'temperature', 'mineral'],
      answer: Math.max(0, (item.contextOptions || item.quizOptions || []).indexOf(item.word)),
      explanation: item.definition
    });
  }

  return {
    id: `3-science-${idx}`,
    grade: '3',
    subject: 'science',
    title: item.displayTitle,
    word: item.word,
    description: item.definition,
    duration: 10,
    xp: 30,
    difficulty: item.category || 'Explore',
    emoji: item.image || '🔬',
    imageUrl: item.imageUrl,
    questions
  };
});

// Convert user's Social Studies items into Lessons
const socialLessons = (DEFAULT_CURRICULUM.social || []).map((item, idx) => {
  const questions = [
    {
      prompt: `Social Studies Challenge: ${item.displayTitle}\n\n${item.sentences ? item.sentences[0] : item.definition}`,
      choices: item.quizOptions || [item.word, 'city', 'ocean', 'border'],
      answer: Math.max(0, (item.quizOptions || []).indexOf(item.word)),
      explanation: `${item.definition} ${item.funFact || ''}`
    }
  ];

  if (item.sentences && item.sentences.length > 1) {
    questions.push({
      prompt: `Fill in the blank:\n"${item.sentences[1]}"`,
      choices: item.contextOptions || item.quizOptions || [item.word, 'valley', 'mountain', 'state'],
      answer: Math.max(0, (item.contextOptions || item.quizOptions || []).indexOf(item.word)),
      explanation: item.definition
    });
  }

  return {
    id: `3-social-${idx}`,
    grade: '3',
    subject: 'social',
    title: item.displayTitle,
    word: item.word,
    description: item.definition,
    duration: 9,
    xp: 30,
    difficulty: item.category || 'Civics & World',
    emoji: item.image || '🌎',
    imageUrl: item.imageUrl,
    questions
  };
});

// Other Grade topics from newDesign for full K-6 compatibility
const fallbackTopics = {
  K: {
    math: [['Counting to 20', 'Count objects and recognize numerals.', '🔢'], ['Shapes Around Us', 'Find circles, squares and triangles.', '🔺']],
    reading: [['Letter Sounds', 'Match letters to their beginning sounds.', '🔤'], ['Story Time', 'Listen for characters, setting and events.', '📖']],
    science: [['Living Things', 'Sort things that are alive and not alive.', '🌱'], ['Weather Watch', 'Observe sun, clouds, rain and wind.', '☀️']],
    social: [['My Community', 'Learn about helpers and places nearby.', '🏘️'], ['Maps & Places', 'Use simple maps and location words.', '🗺️']],
    arts: [['Colors', 'Mix and identify basic colors.', '🖌️']],
    life: [['Brush Your Teeth', 'Build a morning and bedtime routine.', '🪥']]
  },
  1: {
    math: [['Place Value', 'Understand tens and ones.', '🔢'], ['Add & Subtract', 'Solve within 20 using strategies.', '➕']],
    reading: [['Phonics Builders', 'Blend sounds to read new words.', '🔤'], ['Sentence Lab', 'Build complete sentences with punctuation.', '✍️']],
    science: [['Plants', 'Identify what plants need to grow.', '🌻'], ['Matter', 'Explore solids, liquids and gases.', '🧊']],
    social: [['Families & Communities', 'Describe how people help one another.', '👨‍👩‍👧']],
    arts: [['Shape Art', 'Build pictures from shapes.', '🎨']],
    life: [['Daily Routine', 'Plan a morning and evening routine.', '⏰']]
  },
  2: {
    math: [['Two-Digit Addition', 'Add with regrouping and models.', '➕'], ['Multiplication Ideas', 'Use equal groups to understand multiplication.', '✖️']],
    reading: [['Vocabulary Quest', 'Use context clues to learn word meaning.', '🧭'], ['Writing Workshop', 'Write a focused paragraph.', '✍️']],
    science: [['Ecosystems', 'Explore how plants and animals interact.', '🦋']],
    social: [['Geography', 'Use maps, landforms and regions.', '🌎']],
    arts: [['Pattern & Design', 'Create visual patterns and symmetry.', '🧩']],
    life: [['Money Basics', 'Identify coins and make simple totals.', '🪙']]
  },
  4: {
    math: [['Multi-Digit Multiplication', 'Multiply whole numbers efficiently.', '✖️'], ['Fractions', 'Compare, add and subtract fractions.', '🍕']],
    reading: [['Informational Text', 'Analyze structure, facts and evidence.', '📰']],
    science: [['Energy', 'Explore transfer and forms of energy.', '⚡']],
    social: [['Regions of the U.S.', 'Compare geography, resources and culture.', '🇺🇸']],
    arts: [['Art History', 'Explore styles, artists and visual choices.', '🖼️']],
    life: [['Time Management', 'Plan schoolwork and responsibilities.', '🗓️']]
  },
  5: {
    math: [['Decimals', 'Add, subtract and multiply decimals.', '🔢'], ['Fractions', 'Multiply and divide fractions.', '🍰']],
    reading: [['Argument & Evidence', 'Evaluate claims and supporting evidence.', '⚖️']],
    science: [['Matter & Reactions', 'Model matter and chemical changes.', '🧪']],
    social: [['Early U.S. History', 'Study major people, places and events.', '📜']],
    arts: [['Visual Storytelling', 'Use composition to guide attention.', '🎨']],
    life: [['Study Systems', 'Build a sustainable study workflow.', '📒']]
  },
  6: {
    math: [['Ratios & Rates', 'Compare quantities and solve rate problems.', '📊'], ['Expressions & Equations', 'Use variables to model problems.', '🧮']],
    reading: [['Text Analysis', 'Analyze theme, structure and perspective.', '🔎']],
    science: [['Cells', 'Explore cell structures and functions.', '🧬']],
    social: [['Ancient Civilizations', 'Compare societies through evidence.', '🏺']],
    arts: [['Design Thinking', 'Iterate from idea to prototype.', '💡']],
    life: [['Organization', 'Manage projects, deadlines and materials.', '🗂️']]
  }
};

const otherGradeLessons = Object.entries(fallbackTopics).flatMap(([g, subObj]) =>
  Object.entries(subObj).flatMap(([subject, items]) =>
    items.map(([title, description, emoji], i) => ({
      id: `${g}-${subject}-${i}`,
      grade: g,
      subject,
      title,
      description,
      duration: 10,
      xp: 25,
      difficulty: 'Core',
      emoji,
      questions: [
        {
          prompt: `What is the focus of "${title}"?`,
          choices: [description, 'Skip the activity', 'Only write the date', 'Nothing at all'],
          answer: 0,
          explanation: `In this lesson, you explore: ${description}`
        },
        {
          prompt: `How do you make the most progress in learning "${title}"?`,
          choices: ['Practice actively and explain your reasoning', 'Guess randomly', 'Close the app immediately', 'Ignore instructions'],
          answer: 0,
          explanation: `Practicing actively helps your brain remember concepts longer.`
        }
      ]
    }))
  )
);

// Combine Grade 3 rich user lessons + K-6 topics
export const staticLessons = [
  ...week5Lessons,
  ...englishLessons,
  ...mathLessons,
  ...scienceLessons,
  ...socialLessons,
  ...otherGradeLessons
];

// Helper to get custom parent cards from localStorage
export function getCustomParentLessons() {
  try {
    const raw = localStorage.getItem('merola_parent_cards');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((c, i) => ({
      id: `custom-${c.id || i}`,
      grade: '3',
      subject: c.subject || 'reading',
      title: c.word ? `${c.word.toUpperCase()}` : (c.title || 'Custom Card'),
      word: c.word || c.title,
      description: c.definition || c.sentence || 'Custom family learning card',
      duration: 5,
      xp: 25,
      difficulty: 'Custom',
      emoji: c.image || '✏️',
      imageUrl: c.imageUrl,
      partOfSpeech: c.partOfSpeech || 'word',
      synonyms: c.synonyms || [],
      antonyms: c.antonyms || [],
      questions: [
        {
          prompt: `What is the meaning of "${c.word || c.title}"?`,
          choices: [c.definition || 'Custom card term', 'To run fast', 'A small stone', 'A blue bird'],
          answer: 0,
          explanation: c.definition || 'Great job practicing your custom family card!'
        },
        ...(c.sentence ? [{
          prompt: `Sentence: "${c.sentence}"\nWhich word belongs here?`,
          choices: [c.word || 'Term', 'Tree', 'Boat', 'Friend'],
          answer: 0,
          explanation: c.sentence
        }] : [])
      ]
    }));
  } catch (e) {
    console.warn('Error reading parent cards:', e);
    return [];
  }
}

export function getLessons(grade, subject) {
  const custom = grade === '3' ? getCustomParentLessons() : [];
  const all = [...custom, ...staticLessons];
  return all.filter(l => l.grade === grade && (!subject || l.subject === subject));
}
