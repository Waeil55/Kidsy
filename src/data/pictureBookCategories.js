// ============================================================================
// MEROLA APP - PICTURE BOOK & VISUAL FLASHCARD CATALOG
// High-Resolution Educational Photos, Phonetics, Audio Text & Mini Quizzes
// Inspiring early learners across foundational categories (Animals, Food, Colors, etc.)
// ============================================================================

export const PICTURE_CATEGORIES = [
  { id: 'all', name: 'All Topics', icon: '🌟' },
  { id: 'animals', name: 'Animals', icon: '🐶' },
  { id: 'food', name: 'Food', icon: '🍳' },
  { id: 'colours', name: 'Colours', icon: '🎨' },
  { id: 'vehicle', name: 'Vehicles', icon: '🚜' },
  { id: 'space', name: 'Planet & Space', icon: '🚀' },
  { id: 'school', name: 'School Items', icon: '🎒' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'sight', name: 'Sight Words', icon: '📖' }
];

export const PICTURE_CARDS = [
  // --------------------------------------------------------------------------
  // 1. ANIMALS
  // --------------------------------------------------------------------------
  {
    id: 'pic-puppy',
    category: 'animals',
    categoryName: 'Animals',
    word: 'Puppy',
    emoji: '🐶',
    phonetic: '/ˈpʌp.i/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A playful and cuddly baby dog.',
    funFact: 'Puppies love to take naps and can sleep up to 18 to 20 hours a day to grow big and strong!',
    teacherSentence: 'The energetic puppy wagged its tail when we brought a squeaky ball.',
    audioText: 'Puppy. A playful and cuddly baby dog. Woof woof!',
    quiz: {
      prompt: 'What is a baby dog called?',
      choices: ['A puppy', 'A kitten', 'A calf', 'A duckling'],
      answer: 0,
      explanation: 'A baby dog is called a puppy!'
    }
  },
  {
    id: 'pic-kitten',
    category: 'animals',
    categoryName: 'Animals',
    word: 'Kitten',
    emoji: '🐱',
    phonetic: '/ˈkɪt.ən/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A soft, curious baby cat with tiny paws.',
    funFact: 'Kittens are born with blue eyes, and their true eye color develops around 7 weeks old!',
    teacherSentence: 'The fluffy kitten chased a feather across the living room rug.',
    audioText: 'Kitten. A baby cat. Meow meow!',
    quiz: {
      prompt: 'What sound does a happy kitten make?',
      choices: ['Purr and Meow', 'Bark and Howl', 'Ribbit', 'Oink'],
      answer: 0,
      explanation: 'Kittens purr when they are happy and cozy.'
    }
  },
  {
    id: 'pic-lion',
    category: 'animals',
    categoryName: 'Animals',
    word: 'Lion',
    emoji: '🦁',
    phonetic: '/ˈlaɪ.ən/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A majestic big cat known as the king of the jungle.',
    funFact: 'A male lion’s roar can be heard from 5 miles (8 kilometers) away!',
    teacherSentence: 'The proud lion rested under the shade of an acacia tree on the savanna.',
    audioText: 'Lion. The king of the jungle. Roar!',
    quiz: {
      prompt: 'Where do wild lions live in large family groups called prides?',
      choices: ['The African savanna', 'The Arctic ice', 'Under the ocean', 'In treehouses'],
      answer: 0,
      explanation: 'Lions live in prides across grasslands and savannas.'
    }
  },
  {
    id: 'pic-elephant',
    category: 'animals',
    categoryName: 'Animals',
    word: 'Elephant',
    emoji: '🐘',
    phonetic: '/ˈel.ə.fənt/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'The largest land animal with a long trunk and big ears.',
    funFact: 'Elephants use their trunk like a hand to pick berries, drink water, and even give hugs!',
    teacherSentence: 'The gentle elephant sprayed cool water over its back on a hot afternoon.',
    audioText: 'Elephant. The world largest land animal with a long trunk.',
    quiz: {
      prompt: 'What is an elephant’s long nose called?',
      choices: ['A trunk', 'A horn', 'A snout', 'A beak'],
      answer: 0,
      explanation: 'An elephant’s nose is called a trunk.'
    }
  },
  {
    id: 'pic-dolphin',
    category: 'animals',
    categoryName: 'Animals',
    word: 'Dolphin',
    emoji: '🐬',
    phonetic: '/ˈdɒl.fɪn/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A playful and smart sea mammal that leaps out of waves.',
    funFact: 'Dolphins have special whistle names for each other so they can call their friends!',
    teacherSentence: 'Two friendly dolphins leaped gracefully alongside our boat.',
    audioText: 'Dolphin. A playful and intelligent ocean animal.',
    quiz: {
      prompt: 'Are dolphins fish or mammals?',
      choices: ['Mammals (they breathe air)', 'Fish (they have gills)', 'Reptiles', 'Birds'],
      answer: 0,
      explanation: 'Dolphins are marine mammals that breathe air through a blowhole!'
    }
  },
  {
    id: 'pic-panda',
    category: 'animals',
    categoryName: 'Animals',
    word: 'Giant Panda',
    emoji: '🐼',
    phonetic: '/ˈpæn.də/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1527118732049-c88155f2107c?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A cute black-and-white bear that loves eating green bamboo.',
    funFact: 'Pandas can spend up to 12 hours every day munching on fresh bamboo stalks!',
    teacherSentence: 'The panda cub tumbled playfully down the grassy bamboo hill.',
    audioText: 'Panda. A peaceful bear with black and white fur.',
    quiz: {
      prompt: 'What is a panda’s favorite food to eat?',
      choices: ['Green bamboo', 'Pizza and pasta', 'Fish and seaweed', 'Ice cream'],
      answer: 0,
      explanation: 'Pandas eat almost exclusively bamboo!'
    }
  },

  // --------------------------------------------------------------------------
  // 2. FOOD
  // --------------------------------------------------------------------------
  {
    id: 'pic-eggs',
    category: 'food',
    categoryName: 'Food',
    word: 'Eggs',
    emoji: '🍳',
    phonetic: '/eɡz/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'Healthy food laid by birds with a golden yolk in the middle.',
    funFact: 'Eggs are packed with protein that helps your muscles grow strong and healthy!',
    teacherSentence: 'Mom made sunny-side up eggs with whole wheat toast for breakfast.',
    audioText: 'Eggs. A delicious protein breakfast food.',
    quiz: {
      prompt: 'What is the yellow center of an egg called?',
      choices: ['The yolk', 'The shell', 'The crust', 'The seed'],
      answer: 0,
      explanation: 'The yellow circle in the middle of an egg is called the yolk.'
    }
  },
  {
    id: 'pic-apple',
    category: 'food',
    categoryName: 'Food',
    word: 'Apple',
    emoji: '🍎',
    phonetic: '/ˈæp.əl/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A crisp, sweet, round fruit that grows on orchard trees.',
    funFact: 'Apples float in water because 25% of their volume is made up of air!',
    teacherSentence: 'I took a crunchy bite of a juicy red apple after soccer practice.',
    audioText: 'Apple. A crunchy red or green fruit that grows on trees.',
    quiz: {
      prompt: 'Where do apples grow?',
      choices: ['On trees in orchards', 'Underground in soil', 'At the bottom of the sea', 'Inside clouds'],
      answer: 0,
      explanation: 'Apples grow on branches of apple trees in orchards.'
    }
  },
  {
    id: 'pic-bread',
    category: 'food',
    categoryName: 'Food',
    word: 'Bread',
    emoji: '🍞',
    phonetic: '/bred/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'Warm baked food made from flour, water, and yeast.',
    funFact: 'Bread is one of the oldest prepared foods in the world, enjoyed for thousands of years!',
    teacherSentence: 'The bakery smelled wonderful as fresh loaves of crusty bread came out of the oven.',
    audioText: 'Bread. Warm, oven-baked food made from wheat flour.',
    quiz: {
      prompt: 'What ingredient makes bread dough rise and become fluffy?',
      choices: ['Yeast', 'Pepper', 'Ice cubes', 'Paint'],
      answer: 0,
      explanation: 'Yeast creates tiny bubbles that make the dough puff up into soft bread.'
    }
  },
  {
    id: 'pic-pancake',
    category: 'food',
    categoryName: 'Food',
    word: 'Pancakes',
    emoji: '🥞',
    phonetic: '/ˈpæn.keɪks/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'Fluffy round flat cakes cooked on a griddle and topped with maple syrup.',
    funFact: 'The world’s largest pancake ever made was 49 feet wide and weighed 6,600 pounds!',
    teacherSentence: 'On Saturday morning, we stacked three golden pancakes and drizzled sweet syrup.',
    audioText: 'Pancakes. Fluffy breakfast cakes drizzled with sweet syrup.',
    quiz: {
      prompt: 'What sweet golden topping is famously poured over pancakes?',
      choices: ['Maple syrup', 'Hot mustard', 'Vinegar', 'Salad dressing'],
      answer: 0,
      explanation: 'Maple syrup from sugar maple trees is the classic sweet pancake topping.'
    }
  },

  // --------------------------------------------------------------------------
  // 3. COLOURS
  // --------------------------------------------------------------------------
  {
    id: 'pic-colours-palette',
    category: 'colours',
    categoryName: 'Colours',
    word: 'Paint Palette',
    emoji: '🎨',
    phonetic: '/ˈpæl.ɪt/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A wooden board holding beautiful rainbow paints for an artist.',
    funFact: 'Mixing blue and yellow paint on your palette creates emerald green!',
    teacherSentence: 'The artist squeezed red, blue, and yellow oils onto the wooden palette.',
    audioText: 'Paint Palette. A board where artists mix vibrant colors to create paintings.',
    quiz: {
      prompt: 'What color do you get when you mix Red and Yellow paint?',
      choices: ['Orange', 'Green', 'Purple', 'Black'],
      answer: 0,
      explanation: 'Mixing red and yellow creates vibrant orange!'
    }
  },
  {
    id: 'pic-colour-blue',
    category: 'colours',
    categoryName: 'Colours',
    word: 'Ocean Blue',
    emoji: '🔵',
    phonetic: '/bluː/',
    partOfSpeech: 'adjective',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'The calm, deep color of the clear open sky and tropical ocean.',
    funFact: 'Blue is considered one of the rarest colors in living animals and plants!',
    teacherSentence: 'The tropical ocean shimmered with shades of crystal blue and turquoise.',
    audioText: 'Ocean Blue. The beautiful color of water and clear skies.',
    quiz: {
      prompt: 'Which of these is naturally blue?',
      choices: ['The daytime sky', 'A ripe banana', 'A strawberry', 'A chocolate bar'],
      answer: 0,
      explanation: 'On a sunny day, the sky shines bright blue!'
    }
  },
  {
    id: 'pic-colour-green',
    category: 'colours',
    categoryName: 'Colours',
    word: 'Forest Green',
    emoji: '🟢',
    phonetic: '/ɡriːn/',
    partOfSpeech: 'adjective',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'The fresh, leafy color of spring grass, moss, and pine needles.',
    funFact: 'Plants are green because of a special superpower molecule called chlorophyll that catches sunlight!',
    teacherSentence: 'The mossy forest was filled with deep emerald green leaves.',
    audioText: 'Forest Green. The color of healthy plants, clover, and tall trees.',
    quiz: {
      prompt: 'What gives plant leaves their vibrant green color?',
      choices: ['Chlorophyll', 'Lemon juice', 'Blue paint', 'Sand'],
      answer: 0,
      explanation: 'Chlorophyll catches sunlight and makes leaves green!'
    }
  },

  // --------------------------------------------------------------------------
  // 4. VEHICLES
  // --------------------------------------------------------------------------
  {
    id: 'pic-tractor',
    category: 'vehicle',
    categoryName: 'Vehicles',
    word: 'Farm Tractor',
    emoji: '🚜',
    phonetic: '/ˈtræk.tər/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A powerful machine with giant rear wheels that helps farmers work fields.',
    funFact: 'Tractors have huge tires with deep treads so they don’t get stuck in deep muddy soil!',
    teacherSentence: 'The green tractor rolled across the field plowing straight rows for planting seeds.',
    audioText: 'Farm Tractor. A strong vehicle that plows fields and helps grow our food. Chug chug!',
    quiz: {
      prompt: 'Where is a tractor most commonly used to pull heavy equipment?',
      choices: ['On a farm', 'At an ice skating rink', 'Inside a submarine', 'In an elevator'],
      answer: 0,
      explanation: 'Tractors do essential heavy work on agricultural farms.'
    }
  },
  {
    id: 'pic-airplane',
    category: 'vehicle',
    categoryName: 'Vehicles',
    word: 'Jet Airplane',
    emoji: '✈️',
    phonetic: '/ˈeə.pleɪn/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A winged flying vehicle that soars high above the clouds.',
    funFact: 'Airplanes stay in the air thanks to the curved shape of their wings, which creates "lift"!',
    teacherSentence: 'The white airplane took off smoothly, climbing high above the fluffy white clouds.',
    audioText: 'Jet Airplane. A fast vehicle that flies through the sky.',
    quiz: {
      prompt: 'Who steers and flies an airplane safely?',
      choices: ['A pilot', 'A conductor', 'A scuba diver', 'A gardener'],
      answer: 0,
      explanation: 'Pilots are trained experts who navigate airplanes through the skies.'
    }
  },
  {
    id: 'pic-train',
    category: 'vehicle',
    categoryName: 'Vehicles',
    word: 'Steam Train',
    emoji: '🚂',
    phonetic: '/treɪn/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A series of connected railway cars pulled along steel tracks by an engine.',
    funFact: 'The fastest bullet trains in Japan can travel over 200 miles per hour using magnetic levitation!',
    teacherSentence: 'The whistle blew "Choo-choo!" as the train rolled out of the station.',
    audioText: 'Train. Steel wheels riding along railway tracks. Choo choo!',
    quiz: {
      prompt: 'What special pathway does a train travel on?',
      choices: ['Railroad tracks', 'Dirt trails only', 'Open ocean water', 'Cable wires in the air'],
      answer: 0,
      explanation: 'Trains travel on steel tracks called railroads.'
    }
  },

  // --------------------------------------------------------------------------
  // 5. PLANET & SPACE
  // --------------------------------------------------------------------------
  {
    id: 'pic-earth',
    category: 'space',
    categoryName: 'Planet & Space',
    word: 'Planet Earth',
    emoji: '🌍',
    phonetic: '/ɜːrθ/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'Our beautiful blue home planet, the only known place in space with life!',
    funFact: 'Over 70% of Earth’s surface is covered by sparkling ocean water, which is why it looks blue from space!',
    teacherSentence: 'From the space station, planet Earth looks like a glowing blue marble swirling with clouds.',
    audioText: 'Planet Earth. Our wonderful home planet covered with oceans and continents.',
    quiz: {
      prompt: 'Why is Earth often nicknamed the "Blue Planet"?',
      choices: ['Because it is covered mostly by oceans', 'Because the trees are blue', 'Because space is blue', 'Because it is made of blue ice cubes'],
      answer: 0,
      explanation: '70% of Earth is ocean water, giving it a brilliant blue glow from orbit.'
    }
  },
  {
    id: 'pic-rocket',
    category: 'space',
    categoryName: 'Planet & Space',
    word: 'Rocket Ship',
    emoji: '🚀',
    phonetic: '/ˈrɒk.ɪt/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1517976487502-d1e03388031d?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A powerful spacecraft with roaring engines that blasts through the atmosphere.',
    funFact: 'Rockets need to travel at 17,500 miles per hour to break free into orbit around Earth!',
    teacherSentence: 'With a roaring trail of orange flame, the rocket lifted off from the launchpad.',
    audioText: 'Rocket Ship. Blasting off into the starry cosmos. 3, 2, 1, Liftoff!',
    quiz: {
      prompt: 'What counts down before a rocket blasts off?',
      choices: ['3, 2, 1... Liftoff!', 'ABCDEFG', 'Sunday, Monday, Tuesday', 'Red, Yellow, Green'],
      answer: 0,
      explanation: 'Space launches always finish with an exciting countdown to liftoff!'
    }
  },

  // --------------------------------------------------------------------------
  // 6. SCHOOL ITEMS
  // --------------------------------------------------------------------------
  {
    id: 'pic-backpack',
    category: 'school',
    categoryName: 'School Items',
    word: 'Backpack',
    emoji: '🎒',
    phonetic: '/ˈbæk.pæk/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A sturdy bag worn on your shoulders to carry books, pencils, and healthy snacks.',
    funFact: 'Wearing both shoulder straps distributes weight evenly and protects your back from getting tired!',
    teacherSentence: 'Lucas zipped up his backpack after packing his math folder and library book.',
    audioText: 'Backpack. A handy school bag with shoulder straps for books and folders.',
    quiz: {
      prompt: 'What is the best way to wear a backpack comfortably?',
      choices: ['With both padded shoulder straps on', 'Carrying it on your head', 'Dragging it behind you in mud', 'Tied to one shoe'],
      answer: 0,
      explanation: 'Wearing both shoulder straps balances weight and keeps your spine healthy.'
    }
  },
  {
    id: 'pic-pencil',
    category: 'school',
    categoryName: 'School Items',
    word: 'Pencil',
    emoji: '✏️',
    phonetic: '/ˈpen.səl/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A wooden writing tool with a graphite core and an eraser on top.',
    funFact: 'One single pencil can draw a continuous line 35 miles long or write around 45,000 words!',
    teacherSentence: 'She sharpened her yellow pencil until the point was crisp and ready for spelling.',
    audioText: 'Pencil. A trusty writing tool for drawing pictures and writing stories.',
    quiz: {
      prompt: 'What is the core of a pencil made from?',
      choices: ['Graphite and clay', 'Pure melted gold', 'Bubblegum', 'Solid chocolate'],
      answer: 0,
      explanation: 'Pencil cores are made of harmless graphite and clay.'
    }
  },

  // --------------------------------------------------------------------------
  // 7. SPORTS & ACTIVITY
  // --------------------------------------------------------------------------
  {
    id: 'pic-soccer',
    category: 'sports',
    categoryName: 'Sports',
    word: 'Soccer Ball',
    emoji: '⚽',
    phonetic: '/ˈsɒk.ər/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A round leather ball kicked into a net during the world’s most popular team game.',
    funFact: 'Over 250 million kids and adults play soccer in over 200 countries around the globe!',
    teacherSentence: 'Carlos kicked the black-and-white soccer ball right into the top corner of the net for a goal.',
    audioText: 'Soccer ball. The world favorite team sport played with teamwork and fun kicks. Goal!',
    quiz: {
      prompt: 'Except for the goalkeeper, which part of the body cannot be used to touch the ball in soccer?',
      choices: ['Hands and arms', 'Feet', 'Head', 'Chest'],
      answer: 0,
      explanation: 'Field players cannot use their hands or arms during a soccer match.'
    }
  },

  // --------------------------------------------------------------------------
  // 8. SIGHT WORDS (MATCHING REFERENCE SCREENSHOT 4)
  // --------------------------------------------------------------------------
  {
    id: 'pic-sight-list',
    category: 'sight',
    categoryName: 'Sight Words',
    word: 'List',
    emoji: '📝',
    phonetic: '/lɪst/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A series of names, words, or items written down in order.',
    funFact: 'Making a to-do list helps your brain organize tasks so you can accomplish great things step by step!',
    teacherSentence: 'We wrote a grocery list with apples, milk, and eggs before going to the market.',
    audioText: 'List. L-I-S-T. A series of written words or items.',
    quiz: {
      prompt: 'What is a "list" useful for?',
      choices: ['Remembering things you need to do or buy', 'Erasing chalkboard marks', 'Sleeping peacefully', 'Drinking cold water'],
      answer: 0,
      explanation: 'A list helps you remember and organize important items.'
    }
  },
  {
    id: 'pic-sight-next',
    category: 'sight',
    categoryName: 'Sight Words',
    word: 'Next',
    emoji: '⏭️',
    phonetic: '/nekst/',
    partOfSpeech: 'adjective',
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'Coming immediately after this one in time, order, or space.',
    funFact: '"Next" comes from Old English "niehst", which originally meant "nearest in place or time"!',
    teacherSentence: 'When you finish reading this page, turn to the next chapter in your book.',
    audioText: 'Next. N-E-X-T. Coming right after.',
    quiz: {
      prompt: 'Which day comes "next" after Tuesday?',
      choices: ['Wednesday', 'Monday', 'Friday', 'Saturday'],
      answer: 0,
      explanation: 'Wednesday comes next right after Tuesday.'
    }
  },
  {
    id: 'pic-sight-almost',
    category: 'sight',
    categoryName: 'Sight Words',
    word: 'Almost',
    emoji: '⏳',
    phonetic: '/ˈɔːl.moʊst/',
    partOfSpeech: 'adverb',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'Very nearly, but not quite 100% finished yet.',
    funFact: 'When you say you are "almost there", you are just a few steps away from your destination!',
    teacherSentence: 'Emma had 68 questions solved and was almost ready to unbox her prize at 70!',
    audioText: 'Almost. A-L-M-O-S-T. Very close to the finish line.',
    quiz: {
      prompt: 'If you have finished 69 out of 70 questions, what are you?',
      choices: ['Almost done!', 'Just starting', 'Far away', 'Completely asleep'],
      answer: 0,
      explanation: 'Having 69 out of 70 solved means you are almost finished!'
    }
  },
  {
    id: 'pic-sight-both',
    category: 'sight',
    categoryName: 'Sight Words',
    word: 'Both',
    emoji: '🤝',
    phonetic: '/boʊθ/',
    partOfSpeech: 'pronoun',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'The two together; one as well as the other.',
    funFact: '"Both" is used when talking about exactly two people, animals, or objects at once!',
    teacherSentence: 'Both Mia and Noah agreed that sharing the Lego blocks was twice as fun.',
    audioText: 'Both. B-O-T-H. The two together.',
    quiz: {
      prompt: 'How many items or people does the word "both" refer to?',
      choices: ['Exactly two', 'One hundred', 'Zero', 'Ten'],
      answer: 0,
      explanation: '"Both" refers specifically to the two together.'
    }
  }
];

export function getCardsByCategory(catId) {
  if (!catId || catId === 'all') return PICTURE_CARDS;
  return PICTURE_CARDS.filter((c) => c.category === catId);
}

export function searchPictureCards(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return PICTURE_CARDS;
  return PICTURE_CARDS.filter((c) => {
    const haystack = `${c.word} ${c.categoryName} ${c.kidDefinition} ${c.funFact}`.toLowerCase();
    return haystack.includes(q);
  });
}
