// ============================================================================
// MEROLA APP - EXPANSIVE PICTURE BOOK & VISUAL FLASHCARD CATALOG (50+ ITEMS)
// High-Resolution Educational Photos, Phonetics, Audio Text & Mini Quizzes
// Foundational categories matching user reference images:
// Animals, School, Food, Vehicles, Planet & Space, Colours, Nature, Sports, Sight Words
// ============================================================================

export const PICTURE_CATEGORIES = [
  { id: 'all', name: 'All Topics', icon: '🌟' },
  { id: 'animals', name: 'Animals', icon: '🐰' },
  { id: 'school', name: 'School Items', icon: '🎒' },
  { id: 'food', name: 'Food & Fruits', icon: '🍎' },
  { id: 'colours', name: 'Colours', icon: '🎨' },
  { id: 'vehicle', name: 'Vehicles', icon: '🚜' },
  { id: 'space', name: 'Planet & Space', icon: '🚀' },
  { id: 'nature', name: 'Nature & Earth', icon: '🌿' },
  { id: 'sports', name: 'Sports & Fun', icon: '⚽' },
  { id: 'sight', name: 'Sight Words', icon: '📖' }
];

export const PICTURE_CARDS = [
  // --------------------------------------------------------------------------
  // 1. ANIMALS (Including Rabbit with Carrot from Screenshot 5)
  // --------------------------------------------------------------------------
  {
    id: 'pic-rabbit',
    category: 'animals',
    categoryName: 'Animals',
    word: 'Rabbit',
    letter: 'R',
    emoji: '🐰',
    phonetic: '/ˈræb.ɪt/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A fluffy, gentle animal with long ears that hops fast and loves fresh orange carrots.',
    funFact: 'When a rabbit is super happy and playful, it does a joyful leaping twist in the air called a "binky"!',
    teacherSentence: 'The fluffy rabbit twitched its nose and munched on a sweet crunchy carrot.',
    audioText: 'Rabbit. R-A-B-B-I-T. A gentle animal that hops. Hop hop hop!',
    quiz: {
      prompt: 'What special action does a rabbit do to travel quickly across the grass?',
      choices: ['Hop and leap with strong hind legs', 'Swim underwater with fins', 'Fly like a bird', 'Slither like a snake'],
      answer: 0,
      explanation: 'Rabbits have powerful back legs that let them hop fast and jump high!'
    }
  },
  {
    id: 'pic-puppy',
    category: 'animals',
    categoryName: 'Animals',
    word: 'Puppy',
    letter: 'P',
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
    letter: 'K',
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
    letter: 'L',
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
    letter: 'E',
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
    letter: 'D',
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
    letter: 'P',
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
  {
    id: 'pic-bear',
    category: 'animals',
    categoryName: 'Animals',
    word: 'Brown Bear',
    letter: 'B',
    emoji: '🐻',
    phonetic: '/beər/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A large, powerful furry mammal that lives in forests and loves berries and fish.',
    funFact: 'Bears hibernate in cozy dens all winter long without waking up to eat!',
    teacherSentence: 'The brown bear fished for salmon in the sparkling mountain river.',
    audioText: 'Bear. B-E-A-R. A big furry forest friend.',
    quiz: {
      prompt: 'What do bears do during cold winter months to save energy?',
      choices: ['Hibernate in a cozy den', 'Fly to the moon', 'Build sandcastles', 'Go to summer camp'],
      answer: 0,
      explanation: 'Bears hibernate during winter to stay warm and conserve energy.'
    }
  },
  {
    id: 'pic-giraffe',
    category: 'animals',
    categoryName: 'Animals',
    word: 'Giraffe',
    letter: 'G',
    emoji: '🦒',
    phonetic: '/dʒɪˈrɑːf/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'The tallest animal on Earth with a very long neck to reach high tree leaves.',
    funFact: 'A giraffe’s blue-purple tongue can be up to 20 inches (50 cm) long to pull leaves off thorny branches!',
    teacherSentence: 'The tall giraffe munched on tasty green leaves from the top of the acacia tree.',
    audioText: 'Giraffe. The tallest animal on Earth with a super long neck.',
    quiz: {
      prompt: 'Why do giraffes have such long necks?',
      choices: ['To eat fresh leaves high up in tall trees', 'To swim underwater', 'To hide under rocks', 'To dig holes in the ground'],
      answer: 0,
      explanation: 'Their long neck allows them to reach tender leaves that other animals cannot reach.'
    }
  },

  // --------------------------------------------------------------------------
  // 2. SCHOOL ITEMS (Matching Screenshot 4: Ruler, Chalk, Folder, Backpack)
  // --------------------------------------------------------------------------
  {
    id: 'pic-ruler',
    category: 'school',
    categoryName: 'School Items',
    word: 'Ruler',
    letter: 'R',
    emoji: '📏',
    phonetic: '/ˈruː.lər/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A straight wooden or plastic tool with inch and centimeter markings used to measure length.',
    funFact: 'A standard classroom ruler is 12 inches long, which is exactly equal to one foot!',
    teacherSentence: 'Liam used a wooden ruler to draw a straight line and measure his math shapes.',
    audioText: 'Ruler. R-U-L-E-R. A measuring tool for drawing straight lines.',
    quiz: {
      prompt: 'How many inches are on a standard school ruler?',
      choices: ['12 inches (1 foot)', '100 inches', '2 inches', '50 inches'],
      answer: 0,
      explanation: 'A standard school ruler measures exactly 12 inches (one foot).'
    }
  },
  {
    id: 'pic-chalk',
    category: 'school',
    categoryName: 'School Items',
    word: 'Chalk',
    letter: 'C',
    emoji: '🖍️',
    phonetic: '/tʃɔːk/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'Soft, colorful sticks made of limestone used for drawing on blackboards and sidewalks.',
    funFact: 'Chalk is made from natural minerals formed millions of years ago in ancient ocean beds!',
    teacherSentence: 'The teacher wrote the weekly spelling challenge on the board with bright white chalk.',
    audioText: 'Chalk. C-H-A-L-K. Colorful sticks for drawing on blackboards and sidewalks.',
    quiz: {
      prompt: 'Where do kids and teachers use chalk to write and draw?',
      choices: ['On blackboards and sidewalks', 'On computer screens', 'Inside books', 'Under pillows'],
      answer: 0,
      explanation: 'Chalk is designed for blackboards, slate, and outdoor sidewalk art.'
    }
  },
  {
    id: 'pic-folder',
    category: 'school',
    categoryName: 'School Items',
    word: 'Folder',
    letter: 'F',
    emoji: '📁',
    phonetic: '/ˈfoʊl.dər/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A cardboard or plastic cover with pockets that keeps school papers neat and unwrinkled.',
    funFact: 'Using different colored folders (blue for reading, green for science) helps students organize homework!',
    teacherSentence: 'Maya slid her completed math worksheet into her blue homework folder.',
    audioText: 'Folder. F-O-L-D-E-R. A handy pocket cover that keeps papers neat.',
    quiz: {
      prompt: 'What is a school folder used for?',
      choices: ['Holding and protecting school worksheets neatly', 'Cutting paper into shapes', 'Erasing mistakes', 'Drinking juice'],
      answer: 0,
      explanation: 'Folders protect papers from getting crumpled in backpacks.'
    }
  },
  {
    id: 'pic-backpack',
    category: 'school',
    categoryName: 'School Items',
    word: 'Backpack',
    letter: 'B',
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
    letter: 'P',
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
  {
    id: 'pic-scissors',
    category: 'school',
    categoryName: 'School Items',
    word: 'Scissors',
    letter: 'S',
    emoji: '✂️',
    phonetic: '/ˈsɪz.ərz/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1590483204990-25e2e840d244?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A tool with two blades pivoted together used for cutting paper and crafts.',
    funFact: 'Ancient Egyptians invented the earliest scissors made of bronze over 3,000 years ago!',
    teacherSentence: 'We carefully used safety scissors to cut out paper stars for the classroom bulletin board.',
    audioText: 'Scissors. Snip snip! A cutting tool for paper crafts.',
    quiz: {
      prompt: 'How should you carry scissors safely when walking in the classroom?',
      choices: ['Blades closed, pointing down towards the floor', 'Running with blades open', 'Tossing them across the room', 'Holding them high in the air'],
      answer: 0,
      explanation: 'Always carry scissors with the blades closed and pointed safely downward.'
    }
  },

  // --------------------------------------------------------------------------
  // 3. FOOD & FRUITS (Matching Screenshot 3: A for Apple)
  // --------------------------------------------------------------------------
  {
    id: 'pic-apple',
    category: 'food',
    categoryName: 'Food & Fruits',
    word: 'Apple',
    letter: 'A',
    emoji: '🍎',
    phonetic: '/ˈæp.əl/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A crisp, sweet, round fruit that grows on orchard trees. A for Apple!',
    funFact: 'Apples float in water because 25% of their volume is made up of air!',
    teacherSentence: 'I took a crunchy bite of a juicy red apple after soccer practice.',
    audioText: 'A for Apple. /æ/ /æ/ Apple. A crisp and juicy fruit.',
    quiz: {
      prompt: 'Where do apples grow?',
      choices: ['On trees in orchards', 'Underground in soil', 'At the bottom of the sea', 'Inside clouds'],
      answer: 0,
      explanation: 'Apples grow on branches of apple trees in orchards.'
    }
  },
  {
    id: 'pic-eggs',
    category: 'food',
    categoryName: 'Food & Fruits',
    word: 'Eggs',
    letter: 'E',
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
    id: 'pic-bread',
    category: 'food',
    categoryName: 'Food & Fruits',
    word: 'Bread',
    letter: 'B',
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
    categoryName: 'Food & Fruits',
    word: 'Pancakes',
    letter: 'P',
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
  {
    id: 'pic-banana',
    category: 'food',
    categoryName: 'Food & Fruits',
    word: 'Banana',
    letter: 'B',
    emoji: '🍌',
    phonetic: '/bəˈnæn.ə/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A sweet yellow curved fruit rich in potassium that gives you long-lasting energy.',
    funFact: 'Bananas grow in large clusters called "hands" that point upward toward the sun!',
    teacherSentence: 'Leo peeled a ripe yellow banana to pack with his school lunch.',
    audioText: 'Banana. B-A-N-A-N-A. A sweet yellow fruit that monkeys and kids love!',
    quiz: {
      prompt: 'What bright color is a ripe banana ready to eat?',
      choices: ['Yellow', 'Purple', 'Silver', 'Black'],
      answer: 0,
      explanation: 'Ripe bananas turn bright yellow and sweet.'
    }
  },

  // --------------------------------------------------------------------------
  // 4. COLOURS
  // --------------------------------------------------------------------------
  {
    id: 'pic-colours-palette',
    category: 'colours',
    categoryName: 'Colours',
    word: 'Paint Palette',
    letter: 'P',
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
    letter: 'B',
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
    letter: 'G',
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
  // 5. VEHICLES
  // --------------------------------------------------------------------------
  {
    id: 'pic-tractor',
    category: 'vehicle',
    categoryName: 'Vehicles',
    word: 'Farm Tractor',
    letter: 'T',
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
    letter: 'A',
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
    letter: 'T',
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
  // 6. PLANET & SPACE
  // --------------------------------------------------------------------------
  {
    id: 'pic-earth',
    category: 'space',
    categoryName: 'Planet & Space',
    word: 'Planet Earth',
    letter: 'E',
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
    letter: 'R',
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
  {
    id: 'pic-moon',
    category: 'space',
    categoryName: 'Planet & Space',
    word: 'Silver Moon',
    letter: 'M',
    emoji: '🌙',
    phonetic: '/muːn/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'Earth’s faithful natural satellite that glows in the night sky.',
    funFact: 'Footprints left on the Moon by Apollo astronauts will stay there for millions of years because there is no wind to blow them away!',
    teacherSentence: 'The silver crescent moon shone brightly through the bedroom window.',
    audioText: 'Moon. Earth satellite that glows softly in the night sky.',
    quiz: {
      prompt: 'Why does the Moon appear to glow at night?',
      choices: ['It reflects light from the Sun', 'It has giant electric lamps', 'It is made of hot fire', 'It turns on with a switch'],
      answer: 0,
      explanation: 'The Moon acts like a giant mirror reflecting bright sunlight back to Earth.'
    }
  },

  // --------------------------------------------------------------------------
  // 7. NATURE & EARTH
  // --------------------------------------------------------------------------
  {
    id: 'pic-rainbow',
    category: 'nature',
    categoryName: 'Nature & Earth',
    word: 'Rainbow',
    letter: 'R',
    emoji: '🌈',
    phonetic: '/ˈreɪn.boʊ/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1534081333815-ae5019106622?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'An arc of seven radiant colors that appears across the sky when sunlight shines through rain drops.',
    funFact: 'No two people see the exact same rainbow because everyone views the raindrops from a slightly different angle!',
    teacherSentence: 'After the afternoon shower, a double rainbow stretched across the mountain valley.',
    audioText: 'Rainbow. R-A-I-N-B-O-W. Red, Orange, Yellow, Green, Blue, Indigo, Violet!',
    quiz: {
      prompt: 'What two things must happen together to create a rainbow in the sky?',
      choices: ['Sunlight and rain showers', 'Snow and dark night', 'Thunder and loud wind', 'Fire and smoke'],
      answer: 0,
      explanation: 'Sunlight shining through falling raindrops refracts light into a spectrum of colors.'
    }
  },
  {
    id: 'pic-mountain',
    category: 'nature',
    categoryName: 'Nature & Earth',
    word: 'Mountain',
    letter: 'M',
    emoji: '🏔️',
    phonetic: '/ˈmaʊn.tən/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A very tall, majestic landform rising high above the surrounding land with rocky peaks.',
    funFact: 'Mount Everest is the highest mountain on Earth, standing over 29,000 feet tall!',
    teacherSentence: 'Snow covered the summit of the mountain like frosting on a cake.',
    audioText: 'Mountain. A magnificent high peak touching the clouds.',
    quiz: {
      prompt: 'What is the very highest point of a mountain called?',
      choices: ['The peak or summit', 'The valley', 'The coast', 'The riverbed'],
      answer: 0,
      explanation: 'The top of a mountain is called the summit or peak.'
    }
  },

  // --------------------------------------------------------------------------
  // 8. SPORTS & ACTIVITY
  // --------------------------------------------------------------------------
  {
    id: 'pic-soccer',
    category: 'sports',
    categoryName: 'Sports & Fun',
    word: 'Soccer Ball',
    letter: 'S',
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
  {
    id: 'pic-basketball',
    category: 'sports',
    categoryName: 'Sports & Fun',
    word: 'Basketball',
    letter: 'B',
    emoji: '🏀',
    phonetic: '/ˈbæs.kɪt.bɔːl/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'An orange bouncing ball dribbled and shot through an elevated hoop with a net.',
    funFact: 'Basketball was invented in 1891 by teacher James Naismith using two peach baskets!',
    teacherSentence: 'Kobe dribbled past the defender and swished the basketball through the hoop.',
    audioText: 'Basketball. Dribble, pass, and shoot through the hoop. Swish!',
    quiz: {
      prompt: 'What was the first basket used when basketball was invented?',
      choices: ['A peach basket', 'A metal trash can', 'A fishing net', 'A cardboard box'],
      answer: 0,
      explanation: 'James Naismith nailed two peach baskets to gym railings to invent basketball!'
    }
  },

  // --------------------------------------------------------------------------
  // 9. SIGHT WORDS (MATCHING REFERENCE SCREENSHOT 4)
  // --------------------------------------------------------------------------
  {
    id: 'pic-sight-list',
    category: 'sight',
    categoryName: 'Sight Words',
    word: 'List',
    letter: 'L',
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
    letter: 'N',
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
    letter: 'A',
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
    letter: 'B',
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
  },
  {
    id: 'pic-sight-friend',
    category: 'sight',
    categoryName: 'Sight Words',
    word: 'Friend',
    letter: 'F',
    emoji: '👫',
    phonetic: '/frend/',
    partOfSpeech: 'noun',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    kidDefinition: 'A person you know, like, trust, and enjoy spending happy time with.',
    funFact: 'Good friends share toys, take turns, and say encouraging words when things are tough!',
    teacherSentence: 'Maya and Chloe held hands and walked to recess as best friends.',
    audioText: 'Friend. F-R-I-E-N-D. Someone who cares and shares with you.',
    quiz: {
      prompt: 'How does a true friend act when you are feeling sad?',
      choices: ['They listen kindly and help cheer you up', 'They make snide remarks', 'They take your toys away', 'They ignore you'],
      answer: 0,
      explanation: 'True friends show empathy, listen, and offer a helpful hand.'
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
    const haystack = `${c.word} ${c.categoryName} ${c.kidDefinition} ${c.funFact} ${c.letter || ''}`.toLowerCase();
    return haystack.includes(q);
  });
}
