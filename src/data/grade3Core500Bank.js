// ============================================================================
// GRADE 3 CORE 500 PRACTICE BANK
// 500 Varied Practice Questions Exclusively Focused on the 5 Week 5 Words:
// 1. oppose (verb) - to be against something
// 2. snide (adjective) - mean or nasty
// 3. heap (noun) - a large collection of things thrown into a pile
// 4. diverse (adjective) - different from one another
// 5. origin (noun) - the start of something
// ============================================================================

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const CORE_WORDS_META = [
  {
    word: 'oppose',
    pos: 'verb',
    meaning: 'To be against something',
    synonyms: ['disagree', 'fight', 'resist', 'object'],
    antonyms: ['agree', 'consent', 'support', 'approve'],
    contexts: [
      "Dad doesn't like sand, so he will ________ mom's idea to go to the beach.",
      "The students will ________ cancelling recess when it is sunny outside.",
      "Many neighbors gathered to ________ building a noisy highway through the park.",
      "I agree with the science plan, but I ________ working without safety goggles.",
      "The mayor will ________ any laws that harm clean water in our town."
    ],
    hint: 'Oppose is a verb that means to stand or vote against an idea.'
  },
  {
    word: 'snide',
    pos: 'adjective',
    meaning: 'To do something in a way that is mean or nasty',
    synonyms: ['mean', 'nasty', 'mocking', 'sarcastic'],
    antonyms: ['kind', 'polite', 'gentle', 'respectful'],
    contexts: [
      "Her ________ look made it clear that she did not trip me on accident.",
      "The bully whispered a ________ comment when Leo dropped his colored pencils.",
      "Our teacher reminded us that making ________ jokes hurts other people's feelings.",
      "Instead of giving helpful feedback, he muttered a ________ laugh under his breath.",
      "Mia apologized for her ________ remark and promised to speak kindly next time."
    ],
    hint: 'Snide describes a nasty, mocking, or unkind tone or facial expression.'
  },
  {
    word: 'heap',
    pos: 'noun',
    meaning: 'A large collection of things thrown into a pile',
    synonyms: ['pile', 'stack', 'mound', 'bunch'],
    antonyms: ['single item', 'tidy row', 'organized list'],
    contexts: [
      "The laundry lay in a ________ on the bedroom floor waiting to be folded.",
      "After raking the autumn leaves, the children jumped right into the giant ________.",
      "A messy ________ of books and comics covered the wooden desk.",
      "The construction workers scooped up a huge ________ of gravel and sand.",
      "She threw her winter jacket and boots into an untidy ________ by the door."
    ],
    hint: 'A heap is a collection of items dumped or piled together.'
  },
  {
    word: 'diverse',
    pos: 'adjective',
    meaning: 'Different from one another',
    synonyms: ['different', 'unlike', 'varied', 'distinct'],
    antonyms: ['same', 'alike', 'identical', 'uniform'],
    contexts: [
      "The restaurant has a very ________ menu with many kinds of food from around the world.",
      "Our classroom is a ________ community with students from many different backgrounds.",
      "The coral reef is home to a ________ group of colorful sea creatures and plants.",
      "A healthy forest needs a ________ mix of tall trees, bushes, ferns, and mushrooms.",
      "The library book club read a ________ selection of mysteries, adventures, and poetry."
    ],
    hint: 'Diverse describes variety and having lots of different kinds.'
  },
  {
    word: 'origin',
    pos: 'noun',
    meaning: 'The start or beginning of something',
    synonyms: ['beginning', 'start', 'source', 'root'],
    antonyms: ['finish', 'end', 'conclusion', 'outcome'],
    contexts: [
      "The ________ of the river was a spring high in the snowy mountains.",
      "Historians love to study the ________ of ancient civilizations and how they began.",
      "The detective searched carefully to discover the ________ of the mysterious sound.",
      "The word 'bicycle' has its ________ in Greek and Latin words for two wheels.",
      "Every oak tree has its humble ________ inside a tiny little acorn."
    ],
    hint: 'Origin is the starting point, source, or birthplace of something.'
  }
];

export function generateGrade3Core500Questions() {
  const questions = [];

  for (let i = 1; i <= 500; i++) {
    const wordObj = CORE_WORDS_META[(i - 1) % 5];
    const categoryType = i % 8;

    let category = '';
    let prompt = '';
    let correct = '';
    let wrongs = [];
    let explanation = '';

    if (categoryType === 0) {
      // 1. Definition Challenge
      category = 'Word Definitions';
      prompt = `What does the Grade 3 core word "${wordObj.word}" mean?`;
      correct = wordObj.meaning;
      wrongs = [
        `To bake a delicious sweet dessert`,
        `To run very quickly in a circle`,
        `A small round pebble found in a creek`
      ];
      explanation = `"${wordObj.word}" means: ${wordObj.meaning}.`;
    } else if (categoryType === 1) {
      // 2. Sentence Context Fill-in
      category = 'Sentence Context';
      const ctx = wordObj.contexts[(i + Math.floor(i / 5)) % wordObj.contexts.length];
      prompt = `Fill in the blank with the correct core word:\n"${ctx}"`;
      correct = wordObj.word;
      const otherWords = CORE_WORDS_META.filter(w => w.word !== wordObj.word).map(w => w.word);
      wrongs = otherWords.slice(0, 3);
      explanation = `The context calls for "${wordObj.word}".`;
    } else if (categoryType === 2) {
      // 3. Synonym Mastery
      category = 'Synonym Mastery';
      const syn = wordObj.synonyms[(i % wordObj.synonyms.length)];
      prompt = `Which word is a SYNONYM (means the same) as "${wordObj.word}"?`;
      correct = syn;
      wrongs = ['delicious', 'silent', 'purple'];
      explanation = `"${syn}" is a synonym for "${wordObj.word}".`;
    } else if (categoryType === 3) {
      // 4. Antonym Mastery
      category = 'Antonym Mastery';
      const ant = wordObj.antonyms[(i % wordObj.antonyms.length)];
      prompt = `Which word is an ANTONYM (opposite) of "${wordObj.word}"?`;
      correct = ant;
      wrongs = ['noisy', 'yellow', 'cloudy'];
      explanation = `"${ant}" is the opposite of "${wordObj.word}".`;
    } else if (categoryType === 4) {
      // 5. Part of Speech
      category = 'Grammar & Part of Speech';
      prompt = `What part of speech is the word "${wordObj.word}"?`;
      correct = wordObj.pos.toUpperCase();
      wrongs = ['NOUN', 'VERB', 'ADJECTIVE', 'ADVERB'].filter(p => p !== wordObj.pos.toUpperCase()).slice(0, 3);
      explanation = `In Grade 3 grammar, "${wordObj.word}" functions as a ${wordObj.pos}.`;
    } else if (categoryType === 5) {
      // 6. Mini-Story Reading Comprehension
      category = 'Story Comprehension';
      prompt = `Reading Passage #${Math.floor(i / 8) + 1}:\n"Farmer Brown inspected his orchard. He saw a diverse group of fruit trees. Next to the barn, old hay lay in a tall heap. His daughter wanted to oppose selling the farmland because her family had lived there since the town's origin."\n\nQuestion: Which word in the story describes having different varieties of fruit trees?`;
      correct = 'diverse';
      wrongs = ['heap', 'oppose', 'origin'];
      explanation = `"Diverse" means having different varieties or kinds!`;
    } else if (categoryType === 6) {
      // 7. Dialogue & Social Scenarios
      category = 'Real-Life Dialogue';
      if (wordObj.word === 'oppose') {
        prompt = `Scenario: The student council suggests cutting art class time in half. You strongly disagree with this plan. What action are you taking?`;
        correct = `You oppose the plan`;
        wrongs = [`You create a heap`, `You show the origin`, `You act snide`];
        explanation = `Standing or voting against a decision means you oppose it.`;
      } else if (wordObj.word === 'snide') {
        prompt = `Scenario: A student smiles meanly and says: "Nice drawing, did a baby do it?" What kind of comment did they make?`;
        correct = `A snide comment`;
        wrongs = [`A diverse comment`, `An origin comment`, `An opposing compliment`];
        explanation = `Making an unkind, mocking remark is snide.`;
      } else if (wordObj.word === 'heap') {
        prompt = `Scenario: You clean your toy room and toss 30 action figures into one big mountain in the middle of the carpet. What have you made?`;
        correct = `A heap of toys`;
        wrongs = [`A diverse idea`, `An origin of games`, `An opposition`];
        explanation = `A big collection thrown into a pile is a heap.`;
      } else if (wordObj.word === 'diverse') {
        prompt = `Scenario: A cafeteria serves tacos, sushi, pasta, samosas, and falafel. How can we describe their lunch choices?`;
        correct = `A diverse menu`;
        wrongs = [`A snide menu`, `A heap menu`, `An opposed menu`];
        explanation = `Having many different foods from various cultures is diverse.`;
      } else {
        prompt = `Scenario: A park ranger points to a mountain spring where the giant waterfall starts. What is that spring called?`;
        correct = `The origin of the water`;
        wrongs = [`The diverse water`, `The snide water`, `The heap of rivers`];
        explanation = `The starting point of a body of water is its origin.`;
      }
    } else {
      // 8. True/False and Critical Thinking
      category = 'Critical Thinking';
      prompt = `True or False: If you "consent" to go to the movies with friends, you are OPPOSING the plan.`;
      correct = `False (Consent means agree; Oppose means disagree)`;
      wrongs = [
        `True (Consent and Oppose are exact synonyms)`,
        `Neither true nor false`,
        `It depends on which movie you watch`
      ];
      explanation = `False! Oppose means disagree, which is the exact opposite of consent (agree).`;
    }

    const choices = shuffleArray([correct, ...wrongs]);
    questions.push({
      id: `g3-core-practice-${i}`,
      targetWord: wordObj.word,
      category,
      prompt,
      choices,
      answer: choices.indexOf(correct),
      explanation,
      hint: wordObj.hint
    });
  }

  return questions;
}

let CACHED_G3_PRACTICE = null;

export function getGrade3Core500Questions(category = 'all', limit = 500) {
  if (!CACHED_G3_PRACTICE) {
    CACHED_G3_PRACTICE = generateGrade3Core500Questions();
  }
  let res = CACHED_G3_PRACTICE;
  if (category && category !== 'all') {
    res = res.filter(q => q.category.toLowerCase().includes(category.toLowerCase()));
  }
  return res.slice(0, limit);
}
