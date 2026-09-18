// ============================================================================
// MEROLA APP - COMPREHENSIVE CURRICULUM FOR GRADES K, 1, 2, 4, 5, 6
// Note: Grade 3 is strictly defined in curriculumData.js / curriculum.js
// Every lesson includes high-resolution educational photography, authentic
// multi-choice questions with child-friendly explanations, XP, and duration.
// ============================================================================

export const OTHER_GRADES_LESSONS = [
  // ==========================================================================
  // KINDERGARTEN (GRADE K)
  // ==========================================================================
  {
    id: 'k-reading-0',
    grade: 'K',
    subject: 'reading',
    title: 'Letter Sounds: A to Z',
    word: 'Alphabet',
    description: 'Listen and identify beginning sounds of everyday words like Apple, Bear, and Cat.',
    duration: 6,
    xp: 25,
    difficulty: 'Foundational Phonics',
    emoji: '🔤',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'Which letter makes the /æ/ sound at the beginning of "Apple"?',
        choices: ['Letter A', 'Letter B', 'Letter M', 'Letter Z'],
        answer: 0,
        explanation: 'A is for Apple! /æ/ /æ/ Apple.'
      },
      {
        prompt: 'Which animal starts with the /b/ sound?',
        choices: ['Bear', 'Cat', 'Dolphin', 'Elephant'],
        answer: 0,
        explanation: 'Bear starts with the letter B: /b/ /b/ Bear.'
      }
    ]
  },
  {
    id: 'k-reading-1',
    grade: 'K',
    subject: 'reading',
    title: 'Rhyme Time Fun',
    word: 'Rhyme',
    description: 'Discover words that share the same ending sound like Cat, Hat, and Mat.',
    duration: 6,
    xp: 25,
    difficulty: 'Phonemic Awareness',
    emoji: '📖',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'Which word rhymes with "Sun"?',
        choices: ['Run', 'Dog', 'Tree', 'Book'],
        answer: 0,
        explanation: '"Sun" and "Run" both end with the -un sound! They rhyme!'
      },
      {
        prompt: 'Which word rhymes with "Cat"?',
        choices: ['Hat', 'Cup', 'Frog', 'Fish'],
        answer: 0,
        explanation: '"Cat" and "Hat" both end with the -at sound.'
      }
    ]
  },
  {
    id: 'k-math-0',
    grade: 'K',
    subject: 'math',
    title: 'Counting 1 to 10',
    word: 'Counting',
    description: 'Count colorful stars, blocks, and yummy apples from 1 to 10.',
    duration: 6,
    xp: 25,
    difficulty: 'Number Sense',
    emoji: '🔢',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'If you see 🍎 🍎 🍎 on the table, how many apples are there?',
        choices: ['3 apples', '5 apples', '1 apple', '10 apples'],
        answer: 0,
        explanation: 'Let\'s count together: 1, 2, 3! There are 3 apples.'
      },
      {
        prompt: 'What number comes immediately after 4 when counting?',
        choices: ['5', '2', '8', '3'],
        answer: 0,
        explanation: 'Counting in order: 1, 2, 3, 4, 5! 5 comes after 4.'
      }
    ]
  },
  {
    id: 'k-math-1',
    grade: 'K',
    subject: 'math',
    title: 'Shapes Around Us',
    word: 'Shapes',
    description: 'Spot circles, squares, and triangles in everyday objects.',
    duration: 6,
    xp: 25,
    difficulty: 'Geometry',
    emoji: '🔺',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'Which shape is perfectly round like a coin or the sun with no straight sides?',
        choices: ['Circle', 'Square', 'Triangle', 'Rectangle'],
        answer: 0,
        explanation: 'A circle is smooth and round with zero corners.'
      },
      {
        prompt: 'How many sides does a triangle have?',
        choices: ['3 sides', '4 sides', '1 side', '8 sides'],
        answer: 0,
        explanation: 'A triangle always has 3 straight sides and 3 points.'
      }
    ]
  },
  {
    id: 'k-science-0',
    grade: 'K',
    subject: 'science',
    title: 'Living Things & Animals',
    word: 'Living Things',
    description: 'Learn what puppies, trees, and kids need to grow and thrive.',
    duration: 6,
    xp: 25,
    difficulty: 'Life Science',
    emoji: '🌱',
    imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'What do living plants and animals need to stay healthy and grow?',
        choices: ['Water and food', 'Plastic toys', 'Coins and money', 'Cell phones'],
        answer: 0,
        explanation: 'All living things need water, nourishment, and clean air to grow.'
      },
      {
        prompt: 'Which of these is a LIVING thing?',
        choices: ['A playful puppy', 'A toy plastic truck', 'A rock on the sidewalk', 'A wooden spoon'],
        answer: 0,
        explanation: 'A puppy breathes, eats, and grows—it is alive!'
      }
    ]
  },
  {
    id: 'k-social-0',
    grade: 'K',
    subject: 'social',
    title: 'Community Helpers',
    word: 'Helpers',
    description: 'Meet firefighters, doctors, teachers, and mail carriers who help our town.',
    duration: 6,
    xp: 25,
    difficulty: 'Civics',
    emoji: '🏘️',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'Who drives a big red truck with sirens to put out fires and keep us safe?',
        choices: ['Firefighters', 'Bakers', 'Painters', 'Gardeners'],
        answer: 0,
        explanation: 'Firefighters courageously put out fires and help people in emergencies.'
      }
    ]
  },

  // ==========================================================================
  // GRADE 1
  // ==========================================================================
  {
    id: '1-reading-0',
    grade: '1',
    subject: 'reading',
    title: 'Sight Words: Level 1',
    word: 'Sight Words',
    description: 'Recognize high-frequency words instantly: about, could, every, found, right.',
    duration: 8,
    xp: 30,
    difficulty: 'Sight Words',
    emoji: '📚',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'Complete the sentence: "We _________ a shiny sea shell on the beach."',
        choices: ['found', 'could', 'every', 'right'],
        answer: 0,
        explanation: '"We found a shiny sea shell on the beach."'
      },
      {
        prompt: 'Which word means that something is correct and accurate?',
        choices: ['right', 'about', 'every', 'could'],
        answer: 0,
        explanation: '"Right" means correct and true.'
      }
    ]
  },
  {
    id: '1-reading-1',
    grade: '1',
    subject: 'reading',
    title: 'Phonics Blends: Sh, Ch, Th',
    word: 'Blends',
    description: 'Blend two consonants together to make smooth single sounds.',
    duration: 8,
    xp: 30,
    difficulty: 'Phonics',
    emoji: '🔤',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'Which letters make the beginning sound in "Ship" and "Shark"?',
        choices: ['Sh', 'Ch', 'Th', 'Wh'],
        answer: 0,
        explanation: '"Sh" makes the /ʃ/ quiet hush sound: Ship, Shark, Shine.'
      },
      {
        prompt: 'Which word starts with the "Ch" sound?',
        choices: ['Chair', 'Thumb', 'Shoe', 'Whale'],
        answer: 0,
        explanation: '"Chair" starts with the "Ch" blend.'
      }
    ]
  },
  {
    id: '1-math-0',
    grade: '1',
    subject: 'math',
    title: 'Addition Within 20',
    word: 'Addition',
    description: 'Use number lines, ten-frames, and count-on strategies to add numbers.',
    duration: 8,
    xp: 30,
    difficulty: 'Operations',
    emoji: '➕',
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'What is 8 + 6?',
        choices: ['14', '12', '15', '13'],
        answer: 0,
        explanation: '8 + 6 = 14. You can make a ten: 8 + 2 = 10, then add 4 more = 14!'
      },
      {
        prompt: 'Mia had 9 stickers. Her friend gave her 4 more. How many stickers does Mia have now?',
        choices: ['13 stickers', '11 stickers', '15 stickers', '12 stickers'],
        answer: 0,
        explanation: '9 + 4 = 13 stickers.'
      }
    ]
  },
  {
    id: '1-math-1',
    grade: '1',
    subject: 'math',
    title: 'Tens and Ones Place Value',
    word: 'Place Value',
    description: 'Understand that two-digit numbers represent amounts of tens and ones.',
    duration: 8,
    xp: 30,
    difficulty: 'Place Value',
    emoji: '🔢',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'In the number 35, how many TENS are there?',
        choices: ['3 tens (30)', '5 tens (50)', '8 tens (80)', '0 tens'],
        answer: 0,
        explanation: 'In 35, the digit 3 is in the tens place, representing 3 tens (30).'
      }
    ]
  },
  {
    id: '1-science-0',
    grade: '1',
    subject: 'science',
    title: 'What Plants Need to Grow',
    word: 'Plants',
    description: 'Explore seeds, roots, stems, leaves, and how sunshine feeds the green garden.',
    duration: 8,
    xp: 30,
    difficulty: 'Botany',
    emoji: '🌻',
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'What four things do plants need to sprout and grow strong?',
        choices: ['Sunlight, water, soil, and air', 'Candy, milk, darkness, and ice', 'Juice, blankets, music, and glass', 'Only darkness and rocks'],
        answer: 0,
        explanation: 'Plants need sunlight, water, healthy soil, and fresh air to grow.'
      }
    ]
  },

  // ==========================================================================
  // GRADE 2
  // ==========================================================================
  {
    id: '2-reading-0',
    grade: '2',
    subject: 'reading',
    title: 'Vocabulary: Curious & Brave',
    word: 'Curious',
    description: 'Master Grade 2 words that describe character traits and adventures.',
    duration: 10,
    xp: 30,
    difficulty: 'Vocabulary',
    emoji: '🧭',
    imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'What does it mean if an explorer is "curious"?',
        choices: ['Eager to learn and find out new things', 'Feeling very sleepy and lazy', 'Afraid of trying anything', 'Angry with teammates'],
        answer: 0,
        explanation: '"Curious" means having a strong desire to learn, explore, and ask questions.'
      },
      {
        prompt: 'Which word is a SYNONYM (same meaning) for "brave"?',
        choices: ['Courageous', 'Scared', 'Timid', 'Quiet'],
        answer: 0,
        explanation: '"Courageous" means brave and willing to face challenges.'
      }
    ]
  },
  {
    id: '2-math-0',
    grade: '2',
    subject: 'math',
    title: '2-Digit Addition with Regrouping',
    word: 'Regrouping',
    description: 'Add numbers up to 100 by carrying the extra ten to the tens column.',
    duration: 10,
    xp: 30,
    difficulty: 'Addition',
    emoji: '➕',
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'What is 38 + 27?',
        choices: ['65', '55', '61', '75'],
        answer: 0,
        explanation: 'Add ones: 8 + 7 = 15 (keep 5, carry 1 ten). Add tens: 1 + 3 + 2 = 6. Answer is 65!'
      }
    ]
  },
  {
    id: '2-math-1',
    grade: '2',
    subject: 'math',
    title: 'Money & Coin Values',
    word: 'Coins',
    description: 'Identify pennies, nickels, dimes, and quarters and calculate total cents.',
    duration: 9,
    xp: 30,
    difficulty: 'Financial Math',
    emoji: '🪙',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'How many cents is one quarter worth?',
        choices: ['25 cents', '10 cents', '5 cents', '1 cent'],
        answer: 0,
        explanation: 'A quarter is worth 25 cents. Four quarters equal one dollar ($1.00)!'
      },
      {
        prompt: 'If you have 2 dimes and 1 nickel, how many cents do you have in total?',
        choices: ['25 cents', '20 cents', '15 cents', '30 cents'],
        answer: 0,
        explanation: '10¢ + 10¢ = 20¢, plus 5¢ = 25¢ total!'
      }
    ]
  },
  {
    id: '2-science-0',
    grade: '2',
    subject: 'science',
    title: 'States of Matter: Solid, Liquid, Gas',
    word: 'Matter',
    description: 'Discover how ice (solid) melts into water (liquid) and boils into steam (gas).',
    duration: 10,
    xp: 30,
    difficulty: 'Physical Science',
    emoji: '🧊',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'What state of matter is an ice cube before it melts?',
        choices: ['Solid', 'Liquid', 'Gas', 'Plasma'],
        answer: 0,
        explanation: 'An ice cube has a fixed shape and volume—it is a solid!'
      },
      {
        prompt: 'When boiling water bubbles and turns into invisible vapor in the air, what state is it?',
        choices: ['Gas (steam)', 'Solid', 'Clay', 'Ice'],
        answer: 0,
        explanation: 'Water vapor rising into the air is in the gas state.'
      }
    ]
  },

  // ==========================================================================
  // GRADE 4
  // ==========================================================================
  {
    id: '4-reading-0',
    grade: '4',
    subject: 'reading',
    title: 'Academic Words: Analyze & Conclude',
    word: 'Analyze',
    description: 'Break down complex texts, examine clues, and draw justified conclusions.',
    duration: 10,
    xp: 35,
    difficulty: 'Critical Reading',
    emoji: '📰',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'What does it mean to "analyze" a science experiment or story?',
        choices: [
          'To examine all parts carefully to understand how they work together',
          'To guess randomly without looking at the evidence',
          'To erase the whole paper and start over',
          'To read only the first word and close the book'
        ],
        answer: 0,
        explanation: 'Analyzing means looking closely at evidence and details to understand the whole.'
      },
      {
        prompt: 'Which word is a SYNONYM for "conclude"?',
        choices: ['Determine / Finish', 'Start', 'Ignore', 'Forget'],
        answer: 0,
        explanation: 'To conclude means to reach a decision or bring to an end based on evidence.'
      }
    ]
  },
  {
    id: '4-math-0',
    grade: '4',
    subject: 'math',
    title: 'Multi-Digit Multiplication & Area Models',
    word: 'Multiplication',
    description: 'Multiply 2-digit by 2-digit numbers using area models and standard algorithms.',
    duration: 10,
    xp: 35,
    difficulty: 'Advanced Arithmetic',
    emoji: '✖️',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'What is 25 × 12?',
        choices: ['300', '250', '280', '325'],
        answer: 0,
        explanation: '25 × 10 = 250, and 25 × 2 = 50. 250 + 50 = 300!'
      },
      {
        prompt: 'A rectangular garden is 8 meters long and 6 meters wide. What is its AREA?',
        choices: ['48 square meters', '28 meters', '14 square meters', '54 square meters'],
        answer: 0,
        explanation: 'Area = Length × Width = 8 × 6 = 48 square meters.'
      }
    ]
  },
  {
    id: '4-math-1',
    grade: '4',
    subject: 'math',
    title: 'Equivalent Fractions',
    word: 'Fractions',
    description: 'Compare and generate equivalent fractions like 1/2 = 2/4 = 4/8.',
    duration: 10,
    xp: 35,
    difficulty: 'Fractions',
    emoji: '🍕',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'Which fraction is equivalent to 1/2?',
        choices: ['4/8', '2/5', '3/7', '1/4'],
        answer: 0,
        explanation: 'Multiply numerator and denominator by 4: (1×4)/(2×4) = 4/8.'
      }
    ]
  },
  {
    id: '4-science-0',
    grade: '4',
    subject: 'science',
    title: 'Forms of Energy: Kinetic & Potential',
    word: 'Energy',
    description: 'Investigate sound, light, heat, electrical energy, and energy in motion.',
    duration: 10,
    xp: 35,
    difficulty: 'Physical Science',
    emoji: '⚡',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'When a roller coaster cart sits at the very top of a steep hill, what type of stored energy does it have?',
        choices: ['Potential energy', 'Sound energy', 'Kinetic energy', 'Thermal energy'],
        answer: 0,
        explanation: 'Potential energy is stored energy ready to be released as motion.'
      }
    ]
  },

  // ==========================================================================
  // GRADE 5
  // ==========================================================================
  {
    id: '5-reading-0',
    grade: '5',
    subject: 'reading',
    title: 'Core Vocabulary: Evaluate & Hypothesis',
    word: 'Hypothesis',
    description: 'Formulate hypotheses and evaluate scientific arguments using evidence.',
    duration: 12,
    xp: 40,
    difficulty: 'Academic Reasoning',
    emoji: '⚖️',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'What is a "hypothesis" in scientific inquiry?',
        choices: [
          'A testable explanation or educated prediction based on observations',
          'A guaranteed mathematical fact that never changes',
          'A random joke told by a scientist',
          'A concluded final result published after years'
        ],
        answer: 0,
        explanation: 'A hypothesis is an educated, testable prediction that can be verified through experiments.'
      },
      {
        prompt: 'To "evaluate" evidence means to:',
        choices: ['Judge its quality, truth, and importance', 'Ignore all details', 'Copy it word for word', 'Throw it away'],
        answer: 0,
        explanation: 'Evaluating means judging the strength and credibility of information.'
      }
    ]
  },
  {
    id: '5-math-0',
    grade: '5',
    subject: 'math',
    title: 'Fractions Operations & Decimals',
    word: 'Decimals',
    description: 'Add, subtract, and multiply fractions with unlike denominators and decimal places.',
    duration: 12,
    xp: 40,
    difficulty: 'Advanced Fractions',
    emoji: '🍰',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'What is 1/2 + 1/4?',
        choices: ['3/4', '2/6', '1/6', '2/4'],
        answer: 0,
        explanation: 'Convert 1/2 to equivalent fraction 2/4. 2/4 + 1/4 = 3/4!'
      },
      {
        prompt: 'What is 0.5 × 0.4?',
        choices: ['0.20 (or 0.2)', '2.0', '0.02', '0.9'],
        answer: 0,
        explanation: '5 × 4 = 20. With two decimal places total, the product is 0.20.'
      }
    ]
  },
  {
    id: '5-science-0',
    grade: '5',
    subject: 'science',
    title: 'The Solar System & Planetary Orbits',
    word: 'Solar System',
    description: 'Study our central Sun, rocky terrestrial planets, gas giants, and gravitational orbits.',
    duration: 12,
    xp: 40,
    difficulty: 'Earth & Space',
    emoji: '🪐',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'What force keeps the planets orbiting around the Sun in our Solar System?',
        choices: ['Gravity', 'Magnetic poles', 'Ocean waves', 'Wind gusts'],
        answer: 0,
        explanation: 'The Sun\'s enormous gravitational pull keeps all planets in orbital motion.'
      }
    ]
  },

  // ==========================================================================
  // GRADE 6
  // ==========================================================================
  {
    id: '6-reading-0',
    grade: '6',
    subject: 'reading',
    title: 'Advanced Vocabulary: Formulate & Sustainable',
    word: 'Formulate',
    description: 'Formulate persuasive arguments and explore sustainable solutions for communities.',
    duration: 12,
    xp: 40,
    difficulty: 'Advanced Rhetoric',
    emoji: '🔎',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'What does it mean to "formulate" a plan or equation?',
        choices: [
          'To create, develop, or express systematically through careful thought',
          'To copy someone else\'s homework without reading',
          'To cancel an event at the last second',
          'To paint a wall yellow'
        ],
        answer: 0,
        explanation: 'Formulate means to develop or create a clear, organized strategy or solution.'
      },
      {
        prompt: 'A practice that is "sustainable" is one that:',
        choices: [
          'Can be maintained over long periods without depleting natural resources',
          'Uses up all resources within one week',
          'Is extremely expensive and wasteful',
          'Only operates during stormy weather'
        ],
        answer: 0,
        explanation: 'Sustainability means meeting current needs without damaging future resources.'
      }
    ]
  },
  {
    id: '6-math-0',
    grade: '6',
    subject: 'math',
    title: 'Ratios, Rates & Unit Pricing',
    word: 'Ratios',
    description: 'Use ratio reasoning and unit rate calculations to solve real-world problems.',
    duration: 12,
    xp: 40,
    difficulty: 'Algebraic Ratios',
    emoji: '📊',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'If 4 notebooks cost $8.00, what is the UNIT RATE cost per notebook?',
        choices: ['$2.00 each', '$4.00 each', '$1.50 each', '$3.00 each'],
        answer: 0,
        explanation: '$8.00 ÷ 4 notebooks = $2.00 per notebook.'
      },
      {
        prompt: 'In a class there are 12 boys and 16 girls. What is the simplified ratio of boys to girls?',
        choices: ['3 : 4', '2 : 3', '4 : 5', '1 : 2'],
        answer: 0,
        explanation: 'Divide both 12 and 16 by 4: 12/4 = 3, 16/4 = 4. The ratio is 3:4.'
      }
    ]
  },
  {
    id: '6-science-0',
    grade: '6',
    subject: 'science',
    title: 'Cell Structures & Organelles',
    word: 'Cells',
    description: 'Explore the building blocks of life: nucleus, cell membrane, cytoplasm, and mitochondria.',
    duration: 12,
    xp: 40,
    difficulty: 'Cell Biology',
    emoji: '🧬',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'Which organelle is often referred to as the "powerhouse of the cell" for producing ATP energy?',
        choices: ['Mitochondria', 'Cell wall', 'Chloroplast', 'Vacuole'],
        answer: 0,
        explanation: 'Mitochondria convert nutrients into usable chemical energy (ATP) for the cell.'
      },
      {
        prompt: 'Which organelle houses the cell\'s genetic DNA instructions?',
        choices: ['Nucleus', 'Cytoplasm', 'Ribosome', 'Lipid membrane'],
        answer: 0,
        explanation: 'The nucleus contains the organism\'s DNA code.'
      }
    ]
  },
  {
    id: '6-social-0',
    grade: '6',
    subject: 'social',
    title: 'Ancient Civilizations & Mesopotamia',
    word: 'Civilization',
    description: 'Examine early human river valley civilizations, cuneiform writing, and Hammurabi’s code.',
    duration: 12,
    xp: 40,
    difficulty: 'World History',
    emoji: '🏺',
    imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
    questions: [
      {
        prompt: 'Why were the fertile river valleys of the Tigris and Euphrates rivers essential for early Mesopotamia?',
        choices: [
          'They provided fresh water and rich silt soil for agriculture and farming',
          'They kept the weather cold all year round',
          'They made it easy to buy computer parts',
          'They prevented anyone from building houses'
        ],
        answer: 0,
        explanation: 'Reliable water and annual silt deposition made permanent farming and city development possible.'
      }
    ]
  }
];
