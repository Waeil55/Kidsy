// ============================================================================
// LEVEL PROGRESSION ENGINE - 100 PROGRESSIVE LEVELS PER GRADE (K TO 6)
// Total: 700 Levels with Progressive Difficulty
//
// Stage 1 (Levels 1-25):   Foundation (Easy, Visual, Letter/Sound & Concept intro)
// Stage 2 (Levels 26-50):  Developing (Medium-Easy, Fill-in, Sentences, Basic Math)
// Stage 3 (Levels 51-75):  Proficient (Challenging, Context Clues, Multi-Step)
// Stage 4 (Levels 76-100): Mastery (Marathon, Speed Challenges, Graduation Quizzes)
//
// CRITICAL INVARIANT:
// Grade 3 vocabulary is STRICTLY EXCLUSIVE to Week 5 words:
// ['oppose', 'snide', 'heap', 'diverse', 'origin']
// ============================================================================

const STAGES = [
  { id: 'foundation', name: 'Foundation', range: [1, 25], icon: '🌱', difficulty: 'Easy' },
  { id: 'developing', name: 'Developing', range: [26, 50], icon: '🌿', difficulty: 'Medium' },
  { id: 'proficient', name: 'Proficient', range: [51, 75], icon: '🌳', difficulty: 'Challenging' },
  { id: 'mastery',    name: 'Mastery',    range: [76, 100], icon: '👑', difficulty: 'Expert' }
];

export function getStageForLevel(level) {
  if (level <= 25) return STAGES[0];
  if (level <= 50) return STAGES[1];
  if (level <= 75) return STAGES[2];
  return STAGES[3];
}

// ----------------------------------------------------------------------------
// GRADE 3 LEVEL BLUEPRINTS (Centered on the 5 Week 5 Words & Grade 3 STEM)
// ----------------------------------------------------------------------------
function generateGrade3Levels() {
  const levels = [];
  const words = [
    {
      word: 'oppose',
      title: 'Oppose',
      meaning: 'To be against something',
      opposite: 'agree, consent',
      synonym: 'disagree, fight',
      sentence: "Dad doesn't like sand, so he will oppose mom's idea to go to the beach.",
      image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&auto=format&fit=crop&q=80',
      emoji: '🛑'
    },
    {
      word: 'snide',
      title: 'Snide',
      meaning: 'To do something in a way that is mean or nasty',
      opposite: 'kind, polite',
      synonym: 'nasty, mocking',
      sentence: 'Her snide look made it clear that she did not trip me on accident.',
      image: 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=600&auto=format&fit=crop&q=80',
      emoji: '😏'
    },
    {
      word: 'heap',
      title: 'Heap',
      meaning: 'A large collection of things thrown into a pile',
      opposite: 'neat, single item',
      synonym: 'pile, mound',
      sentence: 'The laundry lay in a heap on the floor.',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80',
      emoji: '🧺'
    },
    {
      word: 'diverse',
      title: 'Diverse',
      meaning: 'Different from one another',
      opposite: 'same, identical',
      synonym: 'varied, different',
      sentence: 'The restaurant has a very diverse menu with many kinds of food.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      emoji: '🌍'
    },
    {
      word: 'origin',
      title: 'Origin',
      meaning: 'The start of something',
      opposite: 'end, finish',
      synonym: 'beginning, source',
      sentence: 'The origin of the river was a spring high in the mountains.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
      emoji: '🏔️'
    }
  ];

  for (let i = 1; i <= 100; i++) {
    const stage = getStageForLevel(i);
    const wordIdx = (i - 1) % 5;
    const targetWord = words[wordIdx];

    let title = '';
    let description = '';
    let questions = [];

    if (i <= 25) {
      // Stage 1: Foundation (Easy, direct recognition)
      if (i <= 5) {
        title = `Level ${i}: Discover "${targetWord.title}"`;
        description = `Learn the meaning and sound of "${targetWord.word}".`;
        questions = [
          {
            prompt: `What is the kid-friendly meaning of "${targetWord.word}"?`,
            choices: [targetWord.meaning, 'To run very quickly', 'A small green insect', 'To paint a picture'],
            answer: 0,
            explanation: `Great job! "${targetWord.word}" means ${targetWord.meaning}.`
          },
          {
            prompt: `Look at the sentence: "${targetWord.sentence}"\nWhat is the target word here?`,
            choices: [targetWord.word, 'happy', 'pencil', 'school'],
            answer: 0,
            explanation: `Spot on! The sentence uses "${targetWord.word}".`
          }
        ];
      } else if (i <= 10) {
        title = `Level ${i}: Synonyms for "${targetWord.title}"`;
        description = `Find words that mean the same as "${targetWord.word}".`;
        questions = [
          {
            prompt: `Which word is a synonym (means the same) as "${targetWord.word}"?`,
            choices: [targetWord.synonym.split(',')[0].trim(), 'delicious', 'asleep', 'shiny'],
            answer: 0,
            explanation: `Awesome! "${targetWord.synonym.split(',')[0].trim()}" is a synonym for "${targetWord.word}".`
          },
          {
            prompt: `True or False: "${targetWord.word}" means "${targetWord.meaning}".`,
            choices: ['True', 'False'],
            answer: 0,
            explanation: `Correct! It is True.`
          }
        ];
      } else if (i <= 15) {
        title = `Level ${i}: Antonyms for "${targetWord.title}"`;
        description = `Discover opposite words for "${targetWord.word}".`;
        questions = [
          {
            prompt: `What is the opposite (antonym) of "${targetWord.word}"?`,
            choices: [targetWord.opposite.split(',')[0].trim(), 'loud', 'purple', 'cold'],
            answer: 0,
            explanation: `Spot on! The opposite of "${targetWord.word}" is "${targetWord.opposite.split(',')[0].trim()}".`
          },
          {
            prompt: `If you do NOT ${targetWord.word}, you probably ${targetWord.opposite.split(',')[0].trim()}.`,
            choices: [targetWord.opposite.split(',')[0].trim(), 'fly', 'swim', 'freeze'],
            answer: 0,
            explanation: `Exactly right!`
          }
        ];
      } else if (i <= 20) {
        title = `Level ${i}: Grade 3 Math & Multiplication`;
        const numA = 2 + (i % 4);
        const numB = 3 + (i % 5);
        const prod = numA * numB;
        description = `Practice multiplication array facts for Grade 3.`;
        questions = [
          {
            prompt: `Grade 3 Math: What is ${numA} × ${numB}?`,
            choices: [`${prod}`, `${prod + 2}`, `${prod - 2}`, `${prod + 5}`],
            answer: 0,
            explanation: `${numA} groups of ${numB} equals ${prod}!`
          },
          {
            prompt: `Which word describes a large messy pile of laundry?`,
            choices: ['heap', 'origin', 'oppose', 'snide'],
            answer: 0,
            explanation: `A "heap" is a pile of things thrown together!`
          }
        ];
      } else {
        title = `Level ${i}: Stage 1 Checkpoint`;
        description = `Mastery check for Week 5 vocabulary words.`;
        questions = [
          {
            prompt: `Dad doesn't like sand, so he will ________ mom's idea to go to the beach.`,
            choices: ['oppose', 'agree', 'snide', 'origin'],
            answer: 0,
            explanation: `Dad will "oppose" the beach trip because he dislikes sand.`
          },
          {
            prompt: `The ________ of the river was a spring high up in the mountains.`,
            choices: ['origin', 'heap', 'diverse', 'snide'],
            answer: 0,
            explanation: `The start of a river is called its origin.`
          }
        ];
      }
    } else if (i <= 50) {
      // Stage 2: Developing (Medium, sentence fill-ins and 3-digit operations)
      title = `Level ${i}: Context Challenge - ${targetWord.title}`;
      description = `Fill in blanks and solve Grade 3 problems.`;
      const valA = 120 + i * 5;
      const valB = 40 + i * 2;
      const sum = valA + valB;
      questions = [
        {
          prompt: `Complete the sentence:\n"${targetWord.sentence.replace(new RegExp(targetWord.word, 'gi'), '_________')}"`,
          choices: [targetWord.word, 'tree', 'airplane', 'music'],
          answer: 0,
          explanation: `The sentence uses "${targetWord.word}"!`
        },
        {
          prompt: `Grade 3 Addition: What is ${valA} + ${valB}?`,
          choices: [`${sum}`, `${sum + 10}`, `${sum - 10}`, `${sum + 20}`],
          answer: 0,
          explanation: `${valA} + ${valB} = ${sum}.`
        }
      ];
    } else if (i <= 75) {
      // Stage 3: Proficient (Challenging, synonyms/antonyms in complex contexts)
      title = `Level ${i}: Proficient Reading & Science - ${targetWord.title}`;
      description = `Critical thinking and multi-step reasoning.`;
      questions = [
        {
          prompt: `Which situation best shows someone being "snide"?`,
          choices: [
            'Making a mean, sarcastic comment when a classmate drops their pencil',
            'Cheering loudly when their friend scores a soccer goal',
            'Helping clean up paint brushes after art class',
            'Reading quietly in the library corner'
          ],
          answer: 0,
          explanation: `Making mocking, mean remarks is snide behavior!`
        },
        {
          prompt: `Why is a diverse ecosystem healthier for wildlife?`,
          choices: [
            'It has many different plants and animals supporting each other',
            'It only has one single type of tree',
            'There is no water or sunlight',
            'All the animals look identical'
          ],
          answer: 0,
          explanation: `"Diverse" means varied and different, which creates a healthy food web!`
        }
      ];
    } else {
      // Stage 4: Mastery (Expert, speed challenges & marathon graduation)
      title = `Level ${i}: Week 5 Championship Marathon #${i - 75}`;
      description = `Grand Master Grade 3 graduation review.`;
      questions = [
        {
          prompt: `Match all 5 words: Which one means "the start of something"?`,
          choices: ['origin', 'oppose', 'snide', 'heap'],
          answer: 0,
          explanation: `Origin = the start or source of something!`
        },
        {
          prompt: `Complete: Her ________ remark proved she was not being sincere or friendly.`,
          choices: ['snide', 'heap', 'diverse', 'origin'],
          answer: 0,
          explanation: `A snide remark is mean and mocking.`
        },
        {
          prompt: `Solve: 8 × 7 = ?`,
          choices: ['56', '54', '62', '48'],
          answer: 0,
          explanation: `8 × 7 = 56!`
        }
      ];
    }

    levels.push({
      level: i,
      grade: '3',
      stage: stage.name,
      stageId: stage.id,
      stageIcon: stage.icon,
      difficulty: stage.difficulty,
      title,
      description,
      targetWord: targetWord.word,
      emoji: targetWord.emoji,
      imageUrl: targetWord.image,
      xp: stage.id === 'foundation' ? 15 : stage.id === 'developing' ? 25 : stage.id === 'proficient' ? 35 : 50,
      questions
    });
  }

  return levels;
}

// ----------------------------------------------------------------------------
// GRADE K LEVEL BLUEPRINTS (Kindergarten: Alphabet, Counting 1-10, Shapes)
// ----------------------------------------------------------------------------
function generateGradeKLevels() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const levels = [];

  for (let i = 1; i <= 100; i++) {
    const stage = getStageForLevel(i);
    const letter = letters[(i - 1) % letters.length];
    const countNum = (i % 10) + 1;

    let title = '';
    let description = '';
    let questions = [];

    if (i <= 25) {
      title = `Level ${i}: Letter Sound /${letter.toLowerCase()}/`;
      description = `Identify the letter ${letter} and its sound.`;
      questions = [
        {
          prompt: `Which letter is this? Listen, then pick it.`,
          choices: [`Letter ${letter}`, `Letter ${(i % 2 === 0 ? 'X' : 'O')}`, `Letter ${(i % 2 === 0 ? 'M' : 'Z')}`, `Letter B`],
          answer: 0,
          explanation: `Superstar! This is the letter ${letter}!`
        },
        {
          prompt: `Count the stars: ⭐ ⭐ ⭐. How many are there?`,
          choices: ['3', '2', '5', '1'],
          answer: 0,
          explanation: `1, 2, 3 stars! Great counting!`
        }
      ];
    } else if (i <= 50) {
      title = `Level ${i}: Rhyme & Number Friends`;
      description = `Match rhyming sounds and count up to 10.`;
      questions = [
        {
          prompt: `Which word rhymes with "Cat"?`,
          choices: ['Hat', 'Dog', 'Car', 'Sun'],
          answer: 0,
          explanation: `Cat and Hat both end in -at!`
        },
        {
          prompt: `What comes right after the number ${countNum}?`,
          choices: [`${countNum + 1}`, `${countNum + 3}`, `${countNum - 1}`, `${countNum + 5}`],
          answer: 0,
          explanation: `${countNum + 1} comes right after ${countNum}!`
        }
      ];
    } else if (i <= 75) {
      title = `Level ${i}: Shapes & Animal Friends`;
      description = `Identify 2D shapes and animal sounds.`;
      questions = [
        {
          prompt: `Which shape is round with NO straight sides?`,
          choices: ['Circle ⭕', 'Square ⬛', 'Triangle 🔺', 'Rectangle 📄'],
          answer: 0,
          explanation: `A circle is completely round with no corners!`
        },
        {
          prompt: `Which animal says "Woof woof"?`,
          choices: ['Puppy 🐶', 'Kitten 🐱', 'Cow 🐮', 'Duck 🦆'],
          answer: 0,
          explanation: `A friendly puppy barks "Woof woof"!`
        }
      ];
    } else {
      title = `Level ${i}: Kindergarten Champion Quest #${i - 75}`;
      description = `Blending 3-letter CVC words and patterns.`;
      questions = [
        {
          prompt: `Blend the sounds: /c/ /a/ /t/. What word does it make?`,
          choices: ['CAT', 'BAT', 'CUP', 'CAR'],
          answer: 0,
          explanation: `/c/ + /a/ + /t/ = CAT! Fantastic reading!`
        },
        {
          prompt: `What color is the bright sun?`,
          choices: ['Yellow ☀️', 'Blue 💧', 'Purple 🍇', 'Black ⬛'],
          answer: 0,
          explanation: `The sun is bright yellow!`
        }
      ];
    }

    levels.push({
      level: i,
      grade: 'K',
      stage: stage.name,
      stageId: stage.id,
      stageIcon: stage.icon,
      difficulty: stage.difficulty,
      title,
      description,
      emoji: '🎈',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      xp: stage.id === 'foundation' ? 15 : stage.id === 'developing' ? 25 : stage.id === 'proficient' ? 35 : 50,
      questions
    });
  }

  return levels;
}

// ----------------------------------------------------------------------------
// GENERAL GRADE LEVEL GENERATOR FOR GRADES 1, 2, 4, 5, 6
// ----------------------------------------------------------------------------
function generateGradeLevels(grade) {
  const gradeSpecs = {
    '1': {
      theme: 'Phonics, Sight Words & Math to 20',
      sampleVocab: ['could', 'every', 'round', 'walk', 'again', 'after', 'think'],
      mathOp: (lvl) => {
        const a = (lvl % 10) + 1;
        const b = (lvl % 8) + 2;
        return { prompt: `What is ${a} + ${b}?`, ans: `${a + b}`, wrongs: [`${a + b + 2}`, `${a + b - 1}`, `${a + b + 4}`] };
      }
    },
    '2': {
      theme: '2-Digit Math, Money & Matter',
      sampleVocab: ['curious', 'brave', 'proud', 'scramble', 'solid', 'liquid', 'gas'],
      mathOp: (lvl) => {
        const a = 20 + (lvl % 30);
        const b = 15 + (lvl % 20);
        return { prompt: `What is ${a} + ${b}?`, ans: `${a + b}`, wrongs: [`${a + b + 10}`, `${a + b - 10}`, `${a + b + 2}`] };
      }
    },
    '4': {
      theme: 'Fractions, Multi-Digit Math & Energy',
      sampleVocab: ['analyze', 'conclude', 'contrast', 'kinetic', 'potential', 'erosion'],
      mathOp: (lvl) => {
        const a = 12 + (lvl % 15);
        const b = 4 + (lvl % 6);
        return { prompt: `What is ${a} × ${b}?`, ans: `${a * b}`, wrongs: [`${a * b + 8}`, `${a * b - 6}`, `${a * b + 12}`] };
      }
    },
    '5': {
      theme: 'Decimals, Unlike Fractions & Space',
      sampleVocab: ['hypothesis', 'evaluate', 'variable', 'ecosystem', 'orbit', 'gravity'],
      mathOp: (lvl) => {
        const a = (lvl % 5) + 1;
        return { prompt: `Simplify the fraction: ${a * 2}/${a * 4}`, ans: '1/2', wrongs: ['2/3', '3/4', '1/4'] };
      }
    },
    '6': {
      theme: 'Ratios, Algebra & World Civilizations',
      sampleVocab: ['formulate', 'sustainable', 'perspective', 'mitochondria', 'proportion'],
      mathOp: (lvl) => {
        const x = (lvl % 9) + 2;
        const add = (lvl % 7) + 3;
        return { prompt: `Solve for x: x + ${add} = ${x + add}`, ans: `${x}`, wrongs: [`${x + 2}`, `${x - 1}`, `${x + 5}`] };
      }
    }
  };

  const spec = gradeSpecs[grade] || gradeSpecs['1'];
  const levels = [];

  for (let i = 1; i <= 100; i++) {
    const stage = getStageForLevel(i);
    const vocabWord = spec.sampleVocab[(i - 1) % spec.sampleVocab.length];
    const math = spec.mathOp(i);

    let title = `Level ${i}: Grade ${grade} Challenge`;
    let description = `${stage.name} practice in ${spec.theme}.`;
    let questions = [
      {
        prompt: `Vocabulary Practice: Listen, then pick the word you heard.`,
        choices: [vocabWord, 'pencil', 'chair', 'house'],
        answer: 0,
        explanation: `Great job! "${vocabWord}" is the special word for this level.`
      },
      {
        prompt: math.prompt,
        choices: [math.ans, ...math.wrongs],
        answer: 0,
        explanation: `Correct! ${math.prompt} = ${math.ans}.`
      }
    ];

    levels.push({
      level: i,
      grade: String(grade),
      stage: stage.name,
      stageId: stage.id,
      stageIcon: stage.icon,
      difficulty: stage.difficulty,
      title,
      description,
      emoji: stage.icon,
      imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
      xp: stage.id === 'foundation' ? 15 : stage.id === 'developing' ? 25 : stage.id === 'proficient' ? 35 : 50,
      questions
    });
  }

  return levels;
}

// ----------------------------------------------------------------------------
// CACHED MASTER LEVEL REPOSITORY (700 Levels Total)
// ----------------------------------------------------------------------------
const CACHED_LEVELS = {};

export function getGradeLevels(grade) {
  const g = String(grade || '3').toUpperCase();
  if (!CACHED_LEVELS[g]) {
    if (g === '3') {
      CACHED_LEVELS[g] = generateGrade3Levels();
    } else if (g === 'K') {
      CACHED_LEVELS[g] = generateGradeKLevels();
    } else {
      CACHED_LEVELS[g] = generateGradeLevels(g);
    }
  }
  return CACHED_LEVELS[g];
}

export function getLevelData(grade, levelNum) {
  const allLevels = getGradeLevels(grade);
  const num = Math.max(1, Math.min(100, parseInt(levelNum, 10) || 1));
  return allLevels[num - 1] || allLevels[0];
}

export function getGradeProgressStats(grade, completedMap = {}) {
  const levels = getGradeLevels(grade);
  let completedCount = 0;
  let totalStars = 0;

  levels.forEach(lvl => {
    const stars = completedMap[lvl.level] || 0;
    if (stars > 0) {
      completedCount++;
      totalStars += stars;
    }
  });

  const percent = Math.round((completedCount / 100) * 100);
  return {
    totalLevels: 100,
    completedCount,
    totalStars,
    maxStars: 300,
    percent
  };
}
