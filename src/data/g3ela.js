// Grade 3 ELA Comprehensive Master Study Guide & Workbook — content transcribed EXACTLY from
// grade3_ela_all_in_one_master.pdf (Week 5 & Week 6 Spiral Curriculum). Do not "fix" wording here.

export const G3_PDF_META = {
  id: 'pack-g3-ela-master',
  title: 'Grade 3 ELA Comprehensive Master Study Guide & Workbook',
  subtitle: 'Integrated Vocabulary Catalog • Master Study Word Banks • Daily Review • Grammar Rules • Solutions',
  subject: '3rd Grade English Language Arts',
  units: 'Week 5 & Week 6 Spiral Curriculum',
  format: 'All-in-One Educational PDF',
  source: 'grade3_ela_all_in_one_master.pdf',
};

// [word, part of speech, definition, synonyms, antonyms, example]  (Section 1-A)
export const G3_PDF_WORD_ROWS = [
  ['oppose', 'verb', 'To be against something', 'disagree, fight', 'agree, consent', "Dad doesn't like sand, so he will oppose mom's idea to go to the beach."],
  ['snide', 'adjective', 'To do something in a mean or nasty way', 'nasty, mean', 'kind, nice', 'Her snide look made it clear that she did not trip me on accident.'],
  ['heap', 'noun', 'A large collection of things thrown into a pile', 'pile, stack', 'one, little', 'The laundry lay in a heap on the floor.'],
  ['diverse', 'adjective', 'Different from one another', 'different, unlike', 'same, alike', 'The restaurant has a very diverse menu with many kinds of food.'],
  ['origin', 'noun', 'The start or beginning of something', 'beginning, start', 'finish, end', 'The origin of the river was a spring high in the mountains.'],
  ['assemble', 'verb', 'To put together', 'build, construct', 'dismantle, break', 'Can you assemble the puzzle pieces on the rug?'],
  ['grumble', 'verb', 'To complain about something in a quiet voice', 'mutter, whine', 'praise, cheer', 'He will grumble when asked to clean his bedroom.'],
  ['calculate', 'verb', 'To determine the answer', 'compute, figure out', 'guess, estimate', 'We must calculate the total cost before buying tickets.'],
  ['elegant', 'adjective', 'Something that is high quality and fancy', 'graceful, stylish', 'plain, crude', 'The dining room had an elegant chandelier.'],
  ['privilege', 'noun', 'A special benefit enjoyed under certain conditions', 'advantage, honor', 'penalty, restriction', 'Staying up late on Friday is a privilege.'],
  ['fragile', 'adjective', 'Easily broken or damaged', 'delicate, breakable', 'sturdy, strong', 'Glass cups are fragile and must be handled gently.'],
  ['research', 'verb', 'To study a specific subject', 'investigate, examine', 'ignore, neglect', 'We went to the library to research sea turtles.'],
  ['defend', 'verb', 'To prove by giving evidence', 'justify, protect', 'oppose, surrender', 'Use quotes from the book to defend your answer.'],
  ['specific', 'adjective', 'To be particular or precise', 'exact, definite', 'vague, general', 'Give a specific time when the bus arrives.'],
  ['pledge', 'noun', 'A promise or agreement to do or not do something', 'vow, promise', 'break, violate', 'We made a pledge to keep our playground clean.'],
  // Week Six Teacher Guide
  ['redundant', 'adjective', 'More than what is needed', 'repetitive, wordy', 'limited, incomplete', 'Her speech was redundant since she kept repeating herself.'],
  ['gesture', 'noun', 'A movement of the body that shows an idea or feeling', 'movement, sign', 'motionless, stationary', 'The common gesture for "hello" is a wave of the hand.'],
  ['acknowledge', 'verb', 'To recognize', 'recognize, respond', 'ignore, overlook', 'The teacher will acknowledge you when you raise your hand.'],
  ['clutch', 'verb', 'To tightly hold something', 'hold, grasp', 'drop, throw', 'The woman had a firm clutch on her purse.'],
  ['persevere', 'verb', 'To keep working on something even though it is difficult', 'persist, endure', 'quit, stop', 'The math homework is difficult, but I will persevere and finish the assignment.'],
];

// Section 1-B
export const G3_NOUNS = {
  concrete: ['book', 'cousin', 'friend', 'kitten', 'money', 'playground', 'puppy', 'teacher'],
  abstract: ['childhood', 'friendship', 'hope', 'joy', 'kindness', 'love', 'peace', 'truth'],
};

// Section 1-C
export const G3_PLURALS = [
  { sg: 'ax', rule: 'Ends in -x (add -es)', pl: 'axes' },
  { sg: 'brush', rule: 'Ends in -sh (add -es)', pl: 'brushes' },
  { sg: 'church', rule: 'Ends in -ch (add -es)', pl: 'churches' },
  { sg: 'class', rule: 'Ends in -ss (add -es)', pl: 'classes' },
  { sg: 'dish', rule: 'Ends in -sh (add -es)', pl: 'dishes' },
  { sg: 'dress', rule: 'Ends in -ss (add -es)', pl: 'dresses' },
  { sg: 'fox', rule: 'Ends in -x (add -es)', pl: 'foxes' },
  { sg: 'inch', rule: 'Ends in -ch (add -es)', pl: 'inches' },
  { sg: 'lady', rule: 'Consonant + y (→ -ies)', pl: 'ladies' },
];

// Section 2 — Grammar & Language Mechanics Rulebook
export const G3_RULES = [
  {
    id: 'nouns', title: "Teacher's Rule: Abstract vs. Concrete Nouns",
    bullets: [
      'Concrete Nouns = VISIBLE / SENSORY: Objects, people, and things you can see, hear, smell, taste, or touch with your physical body (e.g., money, friend, book, puppy, playground, teacher, kitten).',
      'Abstract Nouns = INVISIBLE / EMOTIONS & IDEAS: Concepts, qualities, or feelings you can feel in your heart/mind but cannot physically touch (e.g., hope, peace, friendship, love, joy, truth, childhood, kindness).',
    ],
  },
  {
    id: 'pronouns', title: 'Pronoun Antecedents (Who/What does it refer to?)',
    intro: 'Pronouns replace nouns to avoid repetition. Always track the subject:',
    bullets: [
      'Oliver worked... He was tired. → He = Oliver',
      'Isabella visited... She liked the exhibit. → She = Isabella',
      'Dad mopped the floor... spilled milk on it. → it = floor',
      'Carter and Jayce are singers... They performed. → They = Carter and Jayce',
    ],
  },
  {
    id: 'plurals', title: 'Plural Spelling Rules ("More Than One")',
    bullets: [
      'Add -es to nouns ending in ch, sh, s, ss, x, z: church → churches | inch → inches | dish → dishes | brush → brushes | dress → dresses | class → classes | fox → foxes | ax → axes',
      'Consonant + y: drop the y and add -ies: lady → ladies (Never write ladys or lady\'s for plural!)',
    ],
  },
  {
    id: 'conventions', title: 'Conventions & Capitalization Rules',
    bullets: [
      'Polite Subject Pronouns: Always name the other person first and use I (not me) when you are the subject: "Chloe and I like...", "Dad and I went...", "Zoe and I watched...".',
      'Book / Movie Titles: Capitalize the first word and all key nouns/adjectives/verbs: Mummies in the Morning, Diary of a Wimpy Kid: Hard Luck, The Lego Ideas Book.',
    ],
  },
];

// Section 3 — Daily Spiral Review Worksheets (Week 6)
export const G3_DAILY = [
  {
    day: 'Monday',
    pronoun: { text: 'Oliver worked all day in his garden. He was too tired to take out the trash.', underlined: 'He', answer: 'Oliver' },
    edit: { text: 'tomorow, mom fix lunch for the ladys in her book club.', answers: ['Tomorrow, Mom will fix lunch for the ladies in her book club.'] },
    plurals: [{ sg: 'church', pl: 'churches' }, { sg: 'inch', pl: 'inches' }],
    title: { text: 'mummies in the morning', answers: ['Mummies in the Morning'] },
    sort: { words: ['friendship', 'book', 'love', 'puppy'], abstract: ['friendship', 'love'], concrete: ['book', 'puppy'] },
    challenge: 'Choose one box above. On the back of the sheet, write your own 5-Minute Warm-Up questions similar to the questions in the box.',
  },
  {
    day: 'Tuesday',
    pronoun: { text: 'Isabella visited the museum last week. She liked the Native American exhibit best.', underlined: 'She', answer: 'Isabella' },
    edit: { text: 'me and chloe likes to try on dress\'s at wal-mart.', answers: ['Chloe and I like to try on dresses at Walmart.', 'Chloe and I like to try on dresses at Wal-Mart.'] },
    plurals: [{ sg: 'dish', pl: 'dishes' }, { sg: 'brush', pl: 'brushes' }],
    title: { text: 'dinosaurs at dark.', answers: ['Dinosaurs at Dark', 'Dinosaurs Before Dark'] },
    sort: { words: ['money', 'hope', 'peace', 'cousin'], abstract: ['hope', 'peace'], concrete: ['money', 'cousin'] },
    challenge: 'Choose one box above. Write a custom warm-up problem testing the same skill.',
  },
  {
    day: 'Wednesday',
    pronoun: { text: 'Dad needed to mop the floor. He accidentally spilled milk on it.', underlined: 'it', answer: 'the floor' },
    edit: { text: 'me and dad goes fishing last week end.', answers: ['Dad and I went fishing last weekend.'] },
    plurals: [{ sg: 'dress', pl: 'dresses' }, { sg: 'class', pl: 'classes' }],
    title: { text: 'the lego ideas book', answers: ['The Lego Ideas Book', 'The LEGO Ideas Book'] },
    sort: { words: ['playground', 'joy', 'truth', 'friend'], abstract: ['joy', 'truth'], concrete: ['playground', 'friend'] },
    challenge: 'Choose one box above. Write your own challenge questions on the back.',
  },
  {
    day: 'Thursday',
    pronoun: { text: 'Carter and Jayce are both great singers. They performed in the school talent show.', underlined: 'They', answer: 'Carter and Jayce' },
    edit: { text: 'me and zoe watched the movie, samantha: an american girl holiday.', answers: ['Zoe and I watched the movie, Samantha: An American Girl Holiday.'] },
    plurals: [{ sg: 'fox', pl: 'foxes' }, { sg: 'ax', pl: 'axes' }],
    title: { text: 'diary of a wimpy kid hard luck', answers: ['Diary of a Wimpy Kid: Hard Luck'] },
    sort: { words: ['teacher', 'kindness', 'kitten', 'childhood'], abstract: ['kindness', 'childhood'], concrete: ['teacher', 'kitten'] },
    challenge: 'Choose one box above. Write your own questions in your notebook.',
  },
];

// Section 4 — Interactive Practice & Vocabulary Quiz
export const G3_QUIZ = {
  A: {
    title: 'Vocabulary Definition Matching',
    instruction: 'Write the matching letter in the blank:',
    options: [['A', 'origin'], ['B', 'grumble'], ['C', 'oppose'], ['D', 'fragile'], ['E', 'heap'], ['F', 'calculate'], ['G', 'diverse'], ['H', 'privilege']],
    items: [
      { q: 'To complain about something in a quiet voice.', a: 'B' },
      { q: 'To be against something.', a: 'C' },
      { q: 'Easily broken or damaged.', a: 'D' },
      { q: 'A large collection of things thrown into a pile.', a: 'E' },
      { q: 'To determine the answer.', a: 'F' },
      { q: 'Different from one another.', a: 'G' },
      { q: 'A special benefit enjoyed only under certain conditions.', a: 'H' },
      { q: 'The start of something.', a: 'A' },
    ],
  },
  B: {
    title: 'Antonyms & Synonyms Check',
    items: [
      { q: 'Which word is an antonym of oppose?', o: ['fight', 'agree', 'resist'], a: 1 },
      { q: 'Which word is a synonym of snide?', o: ['polite', 'nasty', 'gentle'], a: 1 },
      { q: 'Which word is an antonym of diverse?', o: ['alike', 'mixed', 'unlike'], a: 0 },
    ],
  },
  C: {
    title: 'Fill in the Blank',
    wordBox: ['assemble', 'defend', 'elegant', 'research', 'specific', 'pledge'],
    items: [
      { q: 'We must ____ sea turtle habits for our report.', a: 'research' },
      { q: 'She wore an ____ dress to the wedding.', a: 'elegant' },
      { q: 'Be sure to ____ your ideas using facts.', a: 'defend' },
      { q: 'It took my uncle an hour to ____ the bicycle.', a: 'assemble' },
      { q: 'Name a ____ date for the school play.', a: 'specific' },
      { q: 'Each scout made a ____ to protect wildlife.', a: 'pledge' },
    ],
  },
  D: {
    title: 'Multiple-Choice Mechanics Test',
    items: [
      { q: 'Which sentence is grammatically correct?', o: ['Me and Dad went fishing yesterday.', 'Dad and I went fishing yesterday.', 'Dad and me goes fishing yesterday.'], a: 1 },
      { q: 'Which group contains ONLY abstract nouns?', o: ['money, puppy, playground', 'truth, joy, peace', 'book, kindness, friend'], a: 1 },
      { q: 'What is the correct plural of lady?', o: ['ladys', "lady's", 'ladies'], a: 2 },
    ],
  },
};

// Section 5 — Teacher Guide, Full Answer Key & Error Diagnosis
export const G3_KEY = [
  {
    day: 'Monday',
    lines: [
      'Pronoun: "He" = Oliver',
      'Edited Sentence: "Tomorrow, Mom will fix lunch for the ladies in her book club."',
      'Plurals: churches, inches',
      'Book Title: Mummies in the Morning',
      'Noun Sort: Abstract = friendship, love | Concrete = book, puppy',
    ],
    analysis: 'On the original paper, the student omitted the verb "fix" ("Mom will lunch") and misspelled "ladies" as "ladys". Remind students: (1) Sentences must have an action verb; (2) Change y to ies for plurals; never use apostrophes for simple plurals.',
  },
  {
    day: 'Tuesday',
    lines: [
      'Pronoun: "She" = Isabella',
      'Edited Sentence: "Chloe and I like to try on dresses at Walmart."',
      'Plurals: dishes, brushes',
      'Book Title: Dinosaurs at Dark (or Dinosaurs Before Dark)',
      'Noun Sort: Abstract = hope, peace | Concrete = money, cousin',
    ],
    analysis: '"dress\'s" was incorrectly written with an apostrophe. Apostrophes show possession (ownership), whereas "-es" makes a word plural. "Me and chloe likes" must become "Chloe and I like".',
    note: '*Note: The student reversed money and hope on the worksheet. Money can be touched/held (concrete); hope cannot (abstract).',
  },
  {
    day: 'Wednesday',
    lines: [
      'Pronoun: "it" = the floor',
      'Edited Sentence: "Dad and I went fishing last weekend."',
      'Plurals: dresses, classes',
      'Book Title: The Lego Ideas Book (or The LEGO Ideas Book)',
      'Noun Sort: Abstract = joy, truth | Concrete = playground, friend',
    ],
    analysis: '"week end" is a compound word ("weekend"). "goes" must change to the past tense verb "went" because the action occurred "last weekend". "me and dad" becomes "Dad and I".',
  },
  {
    day: 'Thursday',
    lines: [
      'Pronoun: "They" = Carter and Jayce',
      'Edited Sentence: "Zoe and I watched the movie, Samantha: An American Girl Holiday."',
      'Plurals: foxes, axes',
      'Book Title: Diary of a Wimpy Kid: Hard Luck',
      'Noun Sort: Abstract = kindness, childhood | Concrete = teacher, kitten',
    ],
    analysis: 'The student put "kitten" under abstract and "kindness" under concrete. Remember: a kitten is a furry animal you can physically touch (concrete); kindness is a quality/feeling (abstract).',
  },
];

export const G3_QUIZ_KEY = {
  A: '1. B (grumble) | 2. C (oppose) | 3. D (fragile) | 4. E (heap) | 5. F (calculate) | 6. G (diverse) | 7. H (privilege) | 8. A (origin)',
  B: '1. B (agree is antonym of oppose) | 2. B (nasty is synonym of snide) | 3. A (alike is antonym of diverse)',
  C: '1. research | 2. elegant | 3. defend | 4. assemble | 5. specific | 6. pledge',
  D: '1. B (Dad and I went fishing yesterday) | 2. B (truth, joy, peace - all abstract) | 3. C (ladies)',
};

// Fill-in-the-blank question catalog strictly using all 20 master target words
export const G3_FILL_QUESTIONS = [
  { q: "Dad doesn't like sand, so he will _____ Mom's idea to go to the beach.", a: 'oppose', pos: 'verb' },
  { q: "Her _____ look made it clear that she did not trip me on accident.", a: 'snide', pos: 'adjective' },
  { q: "The laundry lay in a _____ on the floor.", a: 'heap', pos: 'noun' },
  { q: "The restaurant has a very _____ menu with many kinds of food.", a: 'diverse', pos: 'adjective' },
  { q: "The _____ of the river was a spring high in the mountains.", a: 'origin', pos: 'noun' },
  { q: "It took my uncle an hour to _____ the bicycle.", a: 'assemble', pos: 'verb' },
  { q: "He will _____ when asked to clean his bedroom.", a: 'grumble', pos: 'verb' },
  { q: "We must _____ the total cost before buying tickets.", a: 'calculate', pos: 'verb' },
  { q: "She wore an _____ dress to the wedding.", a: 'elegant', pos: 'adjective' },
  { q: "Staying up late on Friday is a _____.", a: 'privilege', pos: 'noun' },
  { q: "Glass cups are _____ and must be handled gently.", a: 'fragile', pos: 'adjective' },
  { q: "We must _____ sea turtle habits for our report.", a: 'research', pos: 'verb' },
  { q: "Be sure to _____ your ideas using facts.", a: 'defend', pos: 'verb' },
  { q: "Name a _____ date for the school play.", a: 'specific', pos: 'adjective' },
  { q: "Each scout made a _____ to protect wildlife.", a: 'pledge', pos: 'noun' },
  { q: "Her speech was _____ since she kept repeating herself.", a: 'redundant', pos: 'adjective' },
  { q: "The common _____ for 'hello' is a wave of the hand.", a: 'gesture', pos: 'noun' },
  { q: "The teacher will _____ you when you raise your hand.", a: 'acknowledge', pos: 'verb' },
  { q: "The woman had a firm _____ on her purse.", a: 'clutch', pos: 'verb' },
  { q: "The math homework is difficult, but I will _____ and finish the assignment.", a: 'persevere', pos: 'verb' },
  // Second sentence variations for richer practice
  { q: "Can you _____ the puzzle pieces on the rug?", a: 'assemble', pos: 'verb' },
  { q: "Use quotes from the book to _____ your answer.", a: 'defend', pos: 'verb' },
  { q: "The dining room had an _____ chandelier.", a: 'elegant', pos: 'adjective' },
  { q: "We went to the library to _____ sea turtles.", a: 'research', pos: 'verb' },
  { q: "Give a _____ time when the bus arrives.", a: 'specific', pos: 'adjective' },
  { q: "We made a _____ to keep our playground clean.", a: 'pledge', pos: 'noun' },
  { q: "They will _____ any plan that damages the neighborhood trees.", a: 'oppose', pos: 'verb' },
  { q: "Making a _____ comment can hurt someone's feelings.", a: 'snide', pos: 'adjective' },
  { q: "The raked leaves sat in a giant _____ in the yard.", a: 'heap', pos: 'noun' },
  { q: "Our classroom is filled with students from _____ backgrounds.", a: 'diverse', pos: 'adjective' },
  { q: "Scientists wanted to discover the true _____ of the strange signal.", a: 'origin', pos: 'noun' },
  { q: "Try to do chores with a smile instead of letting yourself _____.", a: 'grumble', pos: 'verb' },
  { q: "We can _____ the area by multiplying length times width.", a: 'calculate', pos: 'verb' },
  { q: "Being chosen as the team captain is a great _____.", a: 'privilege', pos: 'noun' },
  { q: "These ceramic bowls are very _____ and could break easily.", a: 'fragile', pos: 'adjective' },
  { q: "Saying 'true fact' is _____ because a fact is always true.", a: 'redundant', pos: 'adjective' },
  { q: "A nod of the head is a simple _____ meaning 'yes'.", a: 'gesture', pos: 'noun' },
  { q: "Always _____ the speaker by looking at them politely.", a: 'acknowledge', pos: 'verb' },
  { q: "The little monkey held a tight _____ to its mother's fur.", a: 'clutch', pos: 'verb' },
  { q: "Even when things get tough, winners _____ until they reach the end.", a: 'persevere', pos: 'verb' },
];

