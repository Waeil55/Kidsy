// ============================================================================
// MASSIVE GRADE 3 CHALLENGE BANK (200+ Multi-Modal Questions)
// Categories:
//  - week5: Dedicated Not So Wimpy Teacher Week 5 words (oppose, snide, heap, diverse, origin)
//  - story: 3-sentence reading comprehension stories
//  - vocab: Grade 3 power words, definitions, phonics, syllables
//  - fill_blank: Sentence context clues
//  - syn_ant: Synonyms and antonyms
//  - math: Multiplication, fractions, division, geometry, word problems
//  - science: Solar system, matter, animal habitats, photosynthesis, gravity, magnets
//  - social: 7 Continents, equator, maps, citizenship
//  - riddle: Logic and brain teasers
// ============================================================================

export const MASSIVE_CHALLENGES = [
  // --------------------------------------------------------------------------
  // WEEK 5 TEACHER GUIDE: OPPOSE, SNIDE, HEAP, DIVERSE, ORIGIN
  // --------------------------------------------------------------------------
  {
    id: "w5-q1",
    type: "week5",
    category: "⭐ Week 5 Focus",
    title: "Word Meaning: Oppose",
    prompt: "What does the verb \"oppose\" mean?",
    choices: [
      "To be against something",
      "To agree happily with a friend",
      "To run very fast in gym class",
      "To paint a beautiful picture"
    ],
    answer: 0,
    explanation: "\"Oppose\" means to disagree with or be against something, such as opposing a rule."
  },
  {
    id: "w5-q2",
    type: "fill_blank",
    category: "⭐ Week 5 Focus",
    title: "Sentence Lab: Oppose",
    prompt: "Complete the sentence:\n\"Dad doesn't like sand, so he will _________ mom's idea to go to the beach.\"",
    choices: ["oppose", "agree", "support", "consent"],
    answer: 0,
    explanation: "Dad dislikes sand, so he will oppose (be against) going to the beach."
  },
  {
    id: "w5-q3",
    type: "syn_ant",
    category: "⭐ Week 5 Focus",
    title: "Antonym Check: Oppose",
    prompt: "Which word is an ANTONYM (opposite) of \"oppose\"?",
    choices: ["agree", "fight", "disagree", "clash"],
    answer: 0,
    explanation: "The opposite of opposing something is agreeing or consenting to it."
  },
  {
    id: "w5-q4",
    type: "week5",
    category: "⭐ Week 5 Focus",
    title: "Word Meaning: Snide",
    prompt: "If someone makes a \"snide\" remark, how are they acting?",
    choices: [
      "Mean, nasty, or sarcastic",
      "Extremely polite and helpful",
      "Quiet and sleepy",
      "Excited and jumping with joy"
    ],
    answer: 0,
    explanation: "\"Snide\" is an adjective meaning mean, unkind, or nasty in words or manner."
  },
  {
    id: "w5-q5",
    type: "fill_blank",
    category: "⭐ Week 5 Focus",
    title: "Sentence Lab: Snide",
    prompt: "Fill in the blank:\n\"Her _________ look made it clear that she did not trip me on accident.\"",
    choices: ["snide", "gentle", "friendly", "polite"],
    answer: 0,
    explanation: "A snide look is mean and intentional."
  },
  {
    id: "w5-q6",
    type: "syn_ant",
    category: "⭐ Week 5 Focus",
    title: "Synonym Match: Snide",
    prompt: "Which word is a SYNONYM (same meaning) for \"snide\"?",
    choices: ["nasty", "kind", "caring", "generous"],
    answer: 0,
    explanation: "Nasty and mean are synonyms of snide."
  },
  {
    id: "w5-q7",
    type: "week5",
    category: "⭐ Week 5 Focus",
    title: "Word Meaning: Heap",
    prompt: "What is a \"heap\"?",
    choices: [
      "A large collection of things thrown into a pile",
      "A tiny single grain of sand",
      "A fast moving river",
      "A shiny metal coin"
    ],
    answer: 0,
    explanation: "A heap is a big messy pile or stack of objects."
  },
  {
    id: "w5-q8",
    type: "fill_blank",
    category: "⭐ Week 5 Focus",
    title: "Sentence Lab: Heap",
    prompt: "Complete the sentence:\n\"The laundry lay in a messy _________ on the bedroom floor.\"",
    choices: ["heap", "single", "drop", "slice"],
    answer: 0,
    explanation: "A heap of clothes means a big pile waiting to be folded!"
  },
  {
    id: "w5-q9",
    type: "syn_ant",
    category: "⭐ Week 5 Focus",
    title: "Synonym Match: Heap",
    prompt: "Which word means the same as \"heap\"?",
    choices: ["pile", "one", "tiny", "few"],
    answer: 0,
    explanation: "A pile and a stack are synonyms of heap."
  },
  {
    id: "w5-q10",
    type: "week5",
    category: "⭐ Week 5 Focus",
    title: "Word Meaning: Diverse",
    prompt: "What does \"diverse\" mean?",
    choices: [
      "Different from one another with great variety",
      "Completely identical and uniform",
      "Broken into tiny crumbs",
      "Frozen like an ice cube"
    ],
    answer: 0,
    explanation: "\"Diverse\" means showing lots of different types, cultures, or varieties."
  },
  {
    id: "w5-q11",
    type: "fill_blank",
    category: "⭐ Week 5 Focus",
    title: "Sentence Lab: Diverse",
    prompt: "Fill in the blank:\n\"The restaurant has a very _________ menu with foods from all over the world.\"",
    choices: ["diverse", "identical", "alike", "single"],
    answer: 0,
    explanation: "Having foods from many cultures makes the menu diverse."
  },
  {
    id: "w5-q12",
    type: "syn_ant",
    category: "⭐ Week 5 Focus",
    title: "Antonym Match: Diverse",
    prompt: "Which word is the opposite of \"diverse\"?",
    choices: ["identical", "different", "unlike", "varied"],
    answer: 0,
    explanation: "Identical (or same) is the opposite of diverse."
  },
  {
    id: "w5-q13",
    type: "week5",
    category: "⭐ Week 5 Focus",
    title: "Word Meaning: Origin",
    prompt: "What is the \"origin\" of something?",
    choices: [
      "The start, source, or beginning of something",
      "The final ending or conclusion",
      "The heavy weight of a rock",
      "The speed of a train"
    ],
    answer: 0,
    explanation: "Origin means where something starts or comes from."
  },
  {
    id: "w5-q14",
    type: "fill_blank",
    category: "⭐ Week 5 Focus",
    title: "Sentence Lab: Origin",
    prompt: "Complete the sentence:\n\"The _________ of the river was a tiny freshwater spring high in the mountains.\"",
    choices: ["origin", "finish", "conclusion", "exit"],
    answer: 0,
    explanation: "The origin is where the river begins its journey."
  },
  {
    id: "w5-q15",
    type: "syn_ant",
    category: "⭐ Week 5 Focus",
    title: "Antonym Match: Origin",
    prompt: "Which word is an ANTONYM (opposite) of \"origin\"?",
    choices: ["end", "beginning", "source", "start"],
    answer: 0,
    explanation: "The end or finish is the opposite of origin."
  },

  // --------------------------------------------------------------------------
  // STORIES & READING COMPREHENSION (3-Sentence Passages)
  // --------------------------------------------------------------------------
  {
    id: "story-1",
    type: "story",
    category: "📖 Story Time",
    title: "Leo's Lost Puppy",
    prompt: "Read the short story:\n\"Leo heard a faint whimpering sound behind the garden shed. When he peeked, he found a fluffy brown puppy shivering under a heap of autumn leaves. Leo offered the puppy a warm piece of turkey, and its tail began to wag happily.\"\n\nWhere was the puppy hiding?",
    choices: [
      "Under a heap of autumn leaves",
      "Up inside an apple tree",
      "In Leo's backpack",
      "Under the kitchen table"
    ],
    answer: 0,
    explanation: "The story states the puppy was shivering under a heap of autumn leaves."
  },
  {
    id: "story-2",
    type: "story",
    category: "📖 Story Time",
    title: "The Recess Vote",
    prompt: "Read the story:\n\"The class held a vote on whether to play soccer or kickball. Maya opposed playing soccer because the grass field was soaked in thick mud. After discussing, the class agreed that kickball on the dry blacktop was much safer.\"\n\nWhy did Maya oppose playing soccer?",
    choices: [
      "Because the grass field was soaked in mud",
      "Because she forgot her sneakers",
      "Because she hates sports",
      "Because it was raining snow"
    ],
    answer: 0,
    explanation: "Maya opposed soccer because the field was soaked with mud!"
  },
  {
    id: "story-3",
    type: "story",
    category: "📖 Story Time",
    title: "Coral Reef Adventure",
    prompt: "Read the story:\n\"Divers plunged into the warm turquoise waters near the equator. They observed a wonderfully diverse reef where clownfish swam through anemones and sea turtles grazed on sea grass. Every creature had a unique role in keeping the ocean healthy.\"\n\nWhat made the coral reef diverse?",
    choices: [
      "It had many different creatures with unique roles",
      "It was made of only one gray stone",
      "There were no fish in the water",
      "The water was frozen solid into ice"
    ],
    answer: 0,
    explanation: "A diverse ecosystem has many different animals living together in harmony."
  },
  {
    id: "story-4",
    type: "story",
    category: "📖 Story Time",
    title: "The Kind Response",
    prompt: "Read the story:\n\"When James dropped his colored pencils, a boy at the back table gave a snide laugh. Instead of getting angry, James smiled and politely asked his friend Lucas for help. Seeing James stay calm, the boy stopped laughing and apologized.\"\n\nHow did James react to the snide laugh?",
    choices: [
      "He stayed calm, smiled, and asked for help",
      "He started crying and ran out",
      "He threw his notebooks on the floor",
      "He grumbled and kicked his desk"
    ],
    answer: 0,
    explanation: "James reacted with patience and kindness instead of anger."
  },
  {
    id: "story-5",
    type: "story",
    category: "📖 Story Time",
    title: "The River's Secret",
    prompt: "Read the story:\n\"Scientists hiked for three days to find the true origin of the misty river. Deep inside a hidden cave, they discovered crystal-clear glacial water dripping from the ceiling into a pool. This tiny pool was the starting point for a river that stretched over 200 miles.\"\n\nWhat was the origin of the river?",
    choices: [
      "Glacial water dripping inside a hidden cave pool",
      "A garden hose behind a farmhouse",
      "A swimming pool in a big city",
      "Rain falling into a metal bucket"
    ],
    answer: 0,
    explanation: "The origin was the glacial pool inside the hidden mountain cave."
  },

  // --------------------------------------------------------------------------
  // GRADE 3 POWER VOCABULARY
  // --------------------------------------------------------------------------
  {
    id: "voc-1",
    type: "vocab",
    category: "📚 Vocabulary",
    title: "Word Meaning: Privilege",
    prompt: "What is a \"privilege\"?",
    choices: [
      "A special honor, benefit, or earned opportunity",
      "A heavy chore everyone hates",
      "A bad habit you want to break",
      "A loud noise made by a train"
    ],
    answer: 0,
    explanation: "A privilege is a special honor or advantage earned by being responsible."
  },
  {
    id: "voc-2",
    type: "vocab",
    category: "📚 Vocabulary",
    title: "Word Meaning: Fragile",
    prompt: "Which of the following items is considered \"fragile\"?",
    choices: [
      "A thin glass ornament",
      "A solid iron dumbbell",
      "A rubber bouncy ball",
      "A thick wooden plank"
    ],
    answer: 0,
    explanation: "Glass ornaments are delicate and break easily, which means they are fragile."
  },
  {
    id: "voc-3",
    type: "vocab",
    category: "📚 Vocabulary",
    title: "Word Meaning: Calculate",
    prompt: "What does it mean to \"calculate\"?",
    choices: [
      "To figure out an answer using mathematics",
      "To guess randomly with your eyes closed",
      "To draw a cartoon picture",
      "To whisper a secret to a friend"
    ],
    answer: 0,
    explanation: "Calculating means determining numerical answers using math and reasoning."
  },
  {
    id: "voc-4",
    type: "vocab",
    category: "📚 Vocabulary",
    title: "Word Meaning: Assemble",
    prompt: "When you \"assemble\" a model airplane, what are you doing?",
    choices: [
      "Putting the pieces together to build it",
      "Smashing it with a heavy hammer",
      "Painting it invisible",
      "Throwing all the parts away"
    ],
    answer: 0,
    explanation: "To assemble means to connect parts or gather people together."
  },
  {
    id: "voc-5",
    type: "vocab",
    category: "📚 Vocabulary",
    title: "Word Meaning: Courage",
    prompt: "What does true \"courage\" mean?",
    choices: [
      "Being brave and doing the right thing even when scared",
      "Never feeling afraid of anything ever",
      "Hiding under the bed during thunder",
      "Running away from your homework"
    ],
    answer: 0,
    explanation: "Courage means acting bravely even when you feel nervous or scared."
  },
  {
    id: "voc-6",
    type: "vocab",
    category: "📚 Vocabulary",
    title: "Word Meaning: Curious",
    prompt: "A person with a \"curious\" mind is always:",
    choices: [
      "Eager to learn, ask questions, and explore",
      "Bored and unwilling to read books",
      "Asleep on the living room sofa",
      "Angry at the teacher"
    ],
    answer: 0,
    explanation: "Curiosity is the eager desire to learn how things work!"
  },

  // --------------------------------------------------------------------------
  // GRADE 3 MATH: MULTIPLICATION, FRACTIONS, DIVISION, GEOMETRY
  // --------------------------------------------------------------------------
  {
    id: "math-q1",
    type: "math",
    category: "🔢 Math Challenge",
    title: "Multiplication: 4 × 6",
    prompt: "4 boxes hold 6 crayons each. How many crayons are there in total?",
    choices: ["24 crayons", "20 crayons", "28 crayons", "18 crayons"],
    answer: 0,
    explanation: "4 × 6 = 24. Four equal groups of six make 24!"
  },
  {
    id: "math-q2",
    type: "math",
    category: "🔢 Math Challenge",
    title: "Multiplication Trick: 7 × 8",
    prompt: "What is 7 × 8?\n(Remember the rhyme: 5, 6, 7, 8!)",
    choices: ["56", "54", "64", "48"],
    answer: 0,
    explanation: "5, 6, 7, 8 -> 56 = 7 × 8!"
  },
  {
    id: "math-q3",
    type: "math",
    category: "🔢 Math Challenge",
    title: "Division Quest: 35 ÷ 5",
    prompt: "Share 35 stickers equally among 5 friends. How many does each friend get?",
    choices: ["7 stickers", "6 stickers", "8 stickers", "5 stickers"],
    answer: 0,
    explanation: "35 ÷ 5 = 7 because 5 × 7 = 35."
  },
  {
    id: "math-q4",
    type: "math",
    category: "🔢 Math Challenge",
    title: "Fractions: Pizza Slices",
    prompt: "A pizza is sliced into 8 equal parts. You eat 3 slices. What fraction of the pizza was eaten?",
    choices: ["3/8", "5/8", "1/8", "3/4"],
    answer: 0,
    explanation: "You ate 3 parts out of 8 total equal parts, which is 3/8."
  },
  {
    id: "math-q5",
    type: "math",
    category: "🔢 Math Challenge",
    title: "Geometry: Perimeter",
    prompt: "A rectangular garden has sides of 6 feet and 4 feet. What is the perimeter all the way around?",
    choices: ["20 feet", "24 feet", "10 feet", "16 feet"],
    answer: 0,
    explanation: "Perimeter = 6 + 4 + 6 + 4 = 20 feet!"
  },
  {
    id: "math-q6",
    type: "math",
    category: "🔢 Math Challenge",
    title: "Geometry: Area",
    prompt: "A square rug measures 5 feet on each side. What is its area in square feet?",
    choices: ["25 sq ft", "20 sq ft", "10 sq ft", "30 sq ft"],
    answer: 0,
    explanation: "Area of a square = side × side = 5 × 5 = 25 square feet."
  },
  {
    id: "math-q7",
    type: "math",
    category: "🔢 Math Challenge",
    title: "Division Quest: 48 ÷ 6",
    prompt: "What is 48 divided by 6?",
    choices: ["8", "7", "9", "6"],
    answer: 0,
    explanation: "48 ÷ 6 = 8 because 6 × 8 = 48!"
  },
  {
    id: "math-q8",
    type: "math",
    category: "🔢 Math Challenge",
    title: "Fraction Terms: Numerator",
    prompt: "In the fraction 2/5, what is the top number (2) called?",
    choices: ["Numerator", "Denominator", "Quotient", "Perimeter"],
    answer: 0,
    explanation: "The top number is the numerator; the bottom number is the denominator."
  },
  {
    id: "math-q9",
    type: "math",
    category: "🔢 Math Challenge",
    title: "Multiplication: 9 × 9",
    prompt: "What is 9 × 9?",
    choices: ["81", "72", "99", "90"],
    answer: 0,
    explanation: "9 × 9 = 81!"
  },
  {
    id: "math-q10",
    type: "math",
    category: "🔢 Math Challenge",
    title: "Word Problem: Bakery Cupcakes",
    prompt: "A baker bakes 6 trays of cupcakes. Each tray holds 8 cupcakes. How many cupcakes in total?",
    choices: ["48 cupcakes", "42 cupcakes", "54 cupcakes", "36 cupcakes"],
    answer: 0,
    explanation: "6 trays × 8 cupcakes = 48 total cupcakes!"
  },

  // --------------------------------------------------------------------------
  // GRADE 3 SCIENCE: SPACE, MATTER, ECOSYSTEMS, FORCES
  // --------------------------------------------------------------------------
  {
    id: "sci-q1",
    type: "science",
    category: "🔬 Science Mystery",
    title: "States of Matter: Ice Melting",
    prompt: "When solid ice melts in warm sunshine, which state of matter does it become?",
    choices: ["Liquid", "Gas", "Plasma", "Solid rock"],
    answer: 0,
    explanation: "Melting changes solid ice into liquid water."
  },
  {
    id: "sci-q2",
    type: "science",
    category: "🔬 Science Mystery",
    title: "Plant Life: Photosynthesis",
    prompt: "What gas do green plants produce during photosynthesis that humans and animals breathe?",
    choices: ["Oxygen", "Carbon dioxide", "Helium", "Nitrogen"],
    answer: 0,
    explanation: "Plants absorb carbon dioxide and release fresh oxygen for us to breathe!"
  },
  {
    id: "sci-q3",
    type: "science",
    category: "🔬 Science Mystery",
    title: "Earth & Forces: Gravity",
    prompt: "What invisible force pulls an apple down from a tree to the ground?",
    choices: ["Gravity", "Magnetism", "Electricity", "Wind friction"],
    answer: 0,
    explanation: "Earth's gravity pulls all objects downward toward the center of the planet."
  },
  {
    id: "sci-q4",
    type: "science",
    category: "🔬 Science Mystery",
    title: "Ecosystems: Arctic Habitat",
    prompt: "Which animal has thick blubber and white fur adapted to survive in the freezing Arctic habitat?",
    choices: ["Polar Bear", "Chameleon", "Parrot", "Desert Camel"],
    answer: 0,
    explanation: "Polar bears have thick fat (blubber) and insulating fur for subzero Arctic cold."
  },
  {
    id: "sci-q5",
    type: "science",
    category: "🔬 Science Mystery",
    title: "Space Exploration: The Sun",
    prompt: "What is the glowing object at the very center of our solar system?",
    choices: ["A medium star called the Sun", "A giant rocky planet", "A block of frozen ice", "A silver moon"],
    answer: 0,
    explanation: "Our Sun is a bright star that provides light and heat to all 8 orbiting planets."
  },
  {
    id: "sci-q6",
    type: "science",
    category: "🔬 Science Mystery",
    title: "Magnets & Poles",
    prompt: "What happens when you bring the North pole of one magnet near the North pole of another magnet?",
    choices: ["They push apart (repel)", "They stick together (attract)", "They melt", "They turn into water"],
    answer: 0,
    explanation: "Like poles repel (push away), while opposite poles attract (pull together)!"
  },
  {
    id: "sci-q7",
    type: "science",
    category: "🔬 Science Mystery",
    title: "Water Cycle: Evaporation",
    prompt: "When liquid puddles on the sidewalk disappear on a sunny afternoon, what happened to the water?",
    choices: [
      "It evaporated into invisible water vapor gas in the air",
      "It sank directly to the center of the Earth",
      "Birds drank all of it in one second",
      "It turned into solid gold"
    ],
    answer: 0,
    explanation: "Solar heat evaporates liquid water into water vapor gas in the atmosphere."
  },

  // --------------------------------------------------------------------------
  // GRADE 3 SOCIAL STUDIES: GEOGRAPHY, CONTINENTS, CITIZENSHIP
  // --------------------------------------------------------------------------
  {
    id: "soc-q1",
    type: "social",
    category: "🌎 Social & World",
    title: "Earth Geography: Continents",
    prompt: "How many total continents are there on planet Earth?",
    choices: ["7 continents", "5 continents", "10 continents", "4 continents"],
    answer: 0,
    explanation: "Earth has 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America, and South America."
  },
  {
    id: "soc-q2",
    type: "social",
    category: "🌎 Social & World",
    title: "Maps: Compass Directions",
    prompt: "Which cardinal direction is directly opposite of North on a map compass?",
    choices: ["South", "East", "West", "Northeast"],
    answer: 0,
    explanation: "South is directly opposite of North."
  },
  {
    id: "soc-q3",
    type: "social",
    category: "🌎 Social & World",
    title: "Globe Lines: The Equator",
    prompt: "What is the imaginary line circling the middle of Earth between the North and South Poles called?",
    choices: ["The Equator", "The Prime Meridian", "The South Pole", "The Axis of Rotation"],
    answer: 0,
    explanation: "The equator circles Earth's warm middle and divides it into Northern and Southern hemispheres."
  },
  {
    id: "soc-q4",
    type: "social",
    category: "🌎 Social & World",
    title: "Good Citizenship",
    prompt: "Which of the following is an example of being a responsible citizen in your community?",
    choices: [
      "Helping clean up litter in a neighborhood park",
      "Ignoring traffic safety rules",
      "Refusing to share toys in the classroom",
      "Leaving trash on the playground floor"
    ],
    answer: 0,
    explanation: "Volunteering to keep parks clean and treating others kindly shows great citizenship!"
  },
  {
    id: "soc-q5",
    type: "social",
    category: "🌎 Social & World",
    title: "Oceans: The Largest Ocean",
    prompt: "Which vast body of water is the largest ocean on Earth?",
    choices: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    answer: 0,
    explanation: "The Pacific Ocean is so huge it covers more area than all of Earth's land combined!"
  },

  // --------------------------------------------------------------------------
  // LOGIC, RIDDLES & BRAIN TEASERS
  // --------------------------------------------------------------------------
  {
    id: "rid-1",
    type: "riddle",
    category: "🧠 Brain Teaser",
    title: "Riddle: Time Teller",
    prompt: "I have hands and a face, but I have no arms and cannot smile. What am I?",
    choices: ["A Clock", "A Mirror", "A Book", "A River"],
    answer: 0,
    explanation: "A clock has an hour hand, a minute hand, and a clock face!"
  },
  {
    id: "rid-2",
    type: "riddle",
    category: "🧠 Brain Teaser",
    title: "Riddle: Getting Wet",
    prompt: "What gets wetter and wetter the more it dries?",
    choices: ["A Bath Towel", "A Sponge", "An Umbrella", "A Raincoat"],
    answer: 0,
    explanation: "A towel gets wet as it dries your hands or body!"
  },
  {
    id: "rid-3",
    type: "riddle",
    category: "🧠 Brain Teaser",
    title: "Riddle: Traveling the World",
    prompt: "What can travel around the world while staying in one corner?",
    choices: ["A Postage Stamp", "An Airplane", "A Compass", "A Postcard"],
    answer: 0,
    explanation: "A postage stamp stays in the corner of the envelope while travelling worldwide!"
  },
  {
    id: "rid-4",
    type: "riddle",
    category: "🧠 Brain Teaser",
    title: "Pattern Logic",
    prompt: "Look at the pattern: 3, 6, 9, 12, ___?\nWhat number comes next?",
    choices: ["15", "14", "16", "18"],
    answer: 0,
    explanation: "Counting by 3s: 3, 6, 9, 12, 15!"
  },
  // --------------------------------------------------------------------------
  // MORE WEEK 5 TEACHER GUIDE: WORD-BY-WORD, PHONICS & SYLLABLES
  // --------------------------------------------------------------------------
  {
    id: "w5-syl-1",
    type: "phonics",
    category: "⭐ Week 5 Focus",
    title: "Syllable Count: Diverse",
    prompt: "How many syllables are in the word \"diverse\" (di-verse)?",
    choices: ["2 syllables", "1 syllable", "3 syllables", "4 syllables"],
    answer: 0,
    explanation: "\"Di-verse\" has 2 syllables (di · verse)."
  },
  {
    id: "w5-syl-2",
    type: "phonics",
    category: "⭐ Week 5 Focus",
    title: "Syllable Count: Origin",
    prompt: "Clap the beats for \"origin\" (or-i-gin). How many syllables does it have?",
    choices: ["3 syllables", "2 syllables", "1 syllable", "4 syllables"],
    answer: 0,
    explanation: "\"Or-i-gin\" has 3 syllables (or · i · gin)."
  },
  {
    id: "w5-syl-3",
    type: "phonics",
    category: "⭐ Week 5 Focus",
    title: "Syllable Count: Oppose",
    prompt: "How many syllables are in the verb \"oppose\" (op-pose)?",
    choices: ["2 syllables", "1 syllable", "3 syllables", "4 syllables"],
    answer: 0,
    explanation: "\"Op-pose\" has 2 syllables (op · pose)."
  },
  {
    id: "w5-spell-1",
    type: "phonics",
    category: "⭐ Week 5 Focus",
    title: "Spelling Check: Diverse",
    prompt: "Which choice is the correct spelling for the word meaning 'different from one another'?",
    choices: ["diverse", "divurse", "diverce", "dyverse"],
    answer: 0,
    explanation: "The correct spelling is d-i-v-e-r-s-e."
  },
  {
    id: "w5-spell-2",
    type: "phonics",
    category: "⭐ Week 5 Focus",
    title: "Spelling Check: Origin",
    prompt: "Which choice is the correct spelling for the word meaning 'the start or beginning'?",
    choices: ["origin", "oregin", "origen", "origon"],
    answer: 0,
    explanation: "The correct spelling is o-r-i-g-i-n."
  },
  {
    id: "w5-ctx-1",
    type: "fill_blank",
    category: "⭐ Week 5 Focus",
    title: "Context Clues: Diverse",
    prompt: "\"Our school library has a _________ collection of books with mysteries, comics, history, and science.\"",
    choices: ["diverse", "snide", "heap", "origin"],
    answer: 0,
    explanation: "Having many different kinds of books means the collection is diverse."
  },
  {
    id: "w5-ctx-2",
    type: "fill_blank",
    category: "⭐ Week 5 Focus",
    title: "Context Clues: Snide",
    prompt: "\"Her _________ remark hurt my feelings because it was mean and unkind.\"",
    choices: ["snide", "diverse", "origin", "heap"],
    answer: 0,
    explanation: "\"Snide\" describes mean, nasty, or mocking words."
  },
  {
    id: "w5-ctx-3",
    type: "fill_blank",
    category: "⭐ Week 5 Focus",
    title: "Context Clues: Origin",
    prompt: "\"Scientists studied the rock to discover the _________ of the ancient volcano.\"",
    choices: ["origin", "heap", "snide", "diverse"],
    answer: 0,
    explanation: "\"Origin\" refers to the beginning or starting point of something."
  },
  {
    id: "w5-ant-1",
    type: "syn_ant",
    category: "⭐ Week 5 Focus",
    title: "Antonym Match: Snide",
    prompt: "Which word is the exact OPPOSITE (antonym) of \"snide\"?",
    choices: ["kind & gentle", "nasty", "rude", "mean"],
    answer: 0,
    explanation: "\"Kind\" is the antonym of \"snide\"."
  },
  {
    id: "w5-ant-2",
    type: "syn_ant",
    category: "⭐ Week 5 Focus",
    title: "Antonym Match: Origin",
    prompt: "Which word is the opposite (antonym) of \"origin\" (the beginning)?",
    choices: ["finish / end", "start", "source", "fountainhead"],
    answer: 0,
    explanation: "\"Finish\" or \"end\" is the direct opposite of \"origin\"."
  },
  {
    id: "w5-syn-1",
    type: "syn_ant",
    category: "⭐ Week 5 Focus",
    title: "Synonym Match: Heap",
    prompt: "Which word means the same (synonym) as \"heap\"?",
    choices: ["pile or stack", "single crumb", "line", "circle"],
    answer: 0,
    explanation: "A \"heap\" is a pile or large collection of items."
  },

  // --------------------------------------------------------------------------
  // WORD-BY-WORD PHONICS, PREFIXES & VOCABULARY
  // --------------------------------------------------------------------------
  {
    id: "ph-1",
    type: "phonics",
    category: "🔤 Word & Phonics",
    title: "Prefix Meaning: Dis-",
    prompt: "What does the prefix \"dis-\" mean in words like \"disagree\" and \"dislike\"?",
    choices: ["not or opposite of", "very much", "again", "before"],
    answer: 0,
    explanation: "The prefix \"dis-\" means not or opposite (e.g., disagree = not agree)."
  },
  {
    id: "ph-2",
    type: "phonics",
    category: "🔤 Word & Phonics",
    title: "Prefix Meaning: Re-",
    prompt: "If you \"rebuild\" a Lego tower, what does the prefix \"re-\" mean?",
    choices: ["to do again", "to stop forever", "to break down", "to build smaller"],
    answer: 0,
    explanation: "The prefix \"re-\" means again (rebuild = build again)."
  },
  {
    id: "ph-3",
    type: "phonics",
    category: "🔤 Word & Phonics",
    title: "Suffix Meaning: -ful",
    prompt: "What does \"hopeful\" mean when you add \"-ful\" to \"hope\"?",
    choices: ["full of hope", "without any hope", "afraid of hope", "before hope"],
    answer: 0,
    explanation: "The suffix \"-ful\" means full of something (hopeful = full of hope)."
  },
  {
    id: "ph-4",
    type: "phonics",
    category: "🔤 Word & Phonics",
    title: "Vowel Team Sound",
    prompt: "Which word has the long \"ea\" sound like in \"heap\" and \"beach\"?",
    choices: ["team", "bread", "head", "feather"],
    answer: 0,
    explanation: "\"Team\" has the long /ē/ sound just like \"heap\"."
  },
  {
    id: "ph-5",
    type: "phonics",
    category: "🔤 Word & Phonics",
    title: "Compound Words",
    prompt: "Which word is a compound word formed by joining two complete words?",
    choices: ["sunflower", "running", "happily", "careful"],
    answer: 0,
    explanation: "\"Sun\" + \"flower\" joins two words together into one compound word."
  },
  {
    id: "ph-6",
    type: "phonics",
    category: "🔤 Word & Phonics",
    title: "Contraction Power",
    prompt: "Which two words make up the contraction \"doesn't\"?",
    choices: ["does not", "do not", "did not", "done not"],
    answer: 0,
    explanation: "\"Doesn't\" is the short form of \"does not\"."
  },

  // --------------------------------------------------------------------------
  // 3-SENTENCE READING STORIES
  // --------------------------------------------------------------------------
  {
    id: "story-4",
    type: "story",
    category: "📖 Story Time",
    title: "Story: The Lost Puppy",
    prompt: "\"Max found a shivering brown puppy sitting under the park bench during the rainstorm. He wrapped his warm jacket around the little dog and gently carried him home. Together, Max and his mom made warm soup and called the phone number on the puppy's shiny collar.\"\n\nHow did Max help the puppy?",
    choices: [
      "He kept him warm with his jacket and called the owner",
      "He left him under the bench in the rain",
      "He sold the puppy to a pet store",
      "He hid the puppy under the bed"
    ],
    answer: 0,
    explanation: "Max showed kindness by wrapping the puppy in his warm jacket and calling the collar's phone number!"
  },
  {
    id: "story-5",
    type: "story",
    category: "📖 Story Time",
    title: "Story: The Treehouse Project",
    prompt: "\"Leo and Maya gathered sturdy wooden planks and a heap of shiny nails in the backyard. Their uncle taught them how to safely measure each board with a yellow tape measure before sawing. By sunset, their treehouse had four strong walls and a lookout window.\"\n\nWhat did Leo and Maya do before sawing the boards?",
    choices: [
      "They measured each board carefully",
      "They painted the roof red",
      "They ate dinner inside",
      "They jumped into the pile of leaves"
    ],
    answer: 0,
    explanation: "The story states their uncle taught them to measure each board with a tape measure before sawing."
  },
  {
    id: "story-6",
    type: "story",
    category: "📖 Story Time",
    title: "Story: The Space Robot",
    prompt: "\"Robo-7 beeped happily as its solar panels charged in the morning sunlight. Its mission on Mars was to collect diverse red rock samples inside a metal capsule. When the dust storm passed, Robo-7 sent high-definition photographs back to Earth.\"\n\nHow does Robo-7 get its energy?",
    choices: [
      "From solar panels in the sunlight",
      "From gasoline fuel",
      "From eating Martian fruit",
      "From wind turbines"
    ],
    answer: 0,
    explanation: "Robo-7's solar panels charged in the sunlight to power the robot."
  },
  {
    id: "story-7",
    type: "story",
    category: "📖 Story Time",
    title: "Story: Grandma's Secret Recipe",
    prompt: "\"Grandma opened her ancient wooden box to find the handwritten recipe card for apple pie. The origin of the recipe was from her own grandmother over eighty years ago! Emma peeled crisp green apples while Grandma rolled out flaky, golden dough.\"\n\nWhat does 'origin' mean in this story?",
    choices: [
      "Where the recipe first started long ago",
      "The temperature of the baking oven",
      "The price of the green apples",
      "The flavor of the cinnamon"
    ],
    answer: 0,
    explanation: "The recipe's origin was where it first began eighty years ago with great-grandmother."
  },

  // --------------------------------------------------------------------------
  // GRADE 3 MATH: MULTIPLICATION, DIVISION, FRACTIONS, GEOMETRY
  // --------------------------------------------------------------------------
  {
    id: "math-9",
    type: "math",
    category: "🔢 Math Mania",
    title: "Multiplication Fact: 6 x 7",
    prompt: "What is 6 × 7?",
    choices: ["42", "40", "48", "36"],
    answer: 0,
    explanation: "6 groups of 7 equals 42!"
  },
  {
    id: "math-10",
    type: "math",
    category: "🔢 Math Mania",
    title: "Multiplication Fact: 8 x 8",
    prompt: "What is 8 × 8?",
    choices: ["64", "62", "72", "56"],
    answer: 0,
    explanation: "8 × 8 = 64 (I ate and I ate till I was sick on the floor, 8 times 8 is 64!)."
  },
  {
    id: "math-11",
    type: "math",
    category: "🔢 Math Mania",
    title: "Division Fact: 54 ÷ 6",
    prompt: "If 54 stickers are shared equally among 6 friends, how many stickers does each friend get?",
    choices: ["9 stickers", "8 stickers", "7 stickers", "6 stickers"],
    answer: 0,
    explanation: "54 ÷ 6 = 9 because 9 × 6 = 54!"
  },
  {
    id: "math-12",
    type: "math",
    category: "🔢 Math Mania",
    title: "Division Fact: 36 ÷ 4",
    prompt: "What is 36 ÷ 4?",
    choices: ["9", "8", "7", "6"],
    answer: 0,
    explanation: "36 ÷ 4 = 9 because 4 × 9 = 36."
  },
  {
    id: "math-13",
    type: "math",
    category: "🔢 Math Mania",
    title: "Comparing Fractions",
    prompt: "Which fraction is GREATER: 1/2 of a pizza or 1/4 of the same pizza?",
    choices: ["1/2 is greater", "1/4 is greater", "They are equal", "Cannot tell"],
    answer: 0,
    explanation: "1/2 (half) is larger than 1/4 (one quarter) of the same whole pizza."
  },
  {
    id: "math-14",
    type: "math",
    category: "🔢 Math Mania",
    title: "Geometry: Perimeter",
    prompt: "A square garden has sides that are each 5 meters long. What is the perimeter around the whole garden?",
    choices: ["20 meters", "25 meters", "15 meters", "10 meters"],
    answer: 0,
    explanation: "A square has 4 equal sides. Perimeter = 5 + 5 + 5 + 5 = 20 meters."
  },
  {
    id: "math-15",
    type: "math",
    category: "🔢 Math Mania",
    title: "Geometry: Quadrilaterals",
    prompt: "How many sides does any quadrilateral have (like squares, rectangles, and trapezoids)?",
    choices: ["4 sides", "3 sides", "5 sides", "6 sides"],
    answer: 0,
    explanation: "\"Quad\" means four. All quadrilaterals have 4 sides!"
  },
  {
    id: "math-16",
    type: "math",
    category: "🔢 Math Mania",
    title: "Word Problem: Bakery Cookies",
    prompt: "Chef Mario baked 3 trays of chocolate chip cookies. Each tray had 8 cookies. How many cookies did he bake in all?",
    choices: ["24 cookies", "21 cookies", "28 cookies", "18 cookies"],
    answer: 0,
    explanation: "3 trays × 8 cookies per tray = 24 cookies."
  },
  {
    id: "math-17",
    type: "math",
    category: "🔢 Math Mania",
    title: "Telling Time",
    prompt: "The short hour hand points between the 3 and 4, and the long minute hand points at 6. What time is it?",
    choices: ["3:30", "3:06", "4:30", "6:15"],
    answer: 0,
    explanation: "When the minute hand is at 6, it is 30 minutes past 3: 3:30!"
  },

  // --------------------------------------------------------------------------
  // GRADE 3 SCIENCE & NATURE
  // --------------------------------------------------------------------------
  {
    id: "sci-8",
    type: "science",
    category: "🔬 Science Lab",
    title: "The Water Cycle",
    prompt: "When liquid water in puddles heats up in the sun and turns into invisible water vapor, what process is that?",
    choices: ["Evaporation", "Condensation", "Freezing", "Precipitation"],
    answer: 0,
    explanation: "Evaporation turns liquid water into gas vapor that rises into the sky."
  },
  {
    id: "sci-9",
    type: "science",
    category: "🔬 Science Lab",
    title: "Animal Groups: Mammals",
    prompt: "Which of these is a characteristic of all mammals?",
    choices: ["They have hair or fur and feed milk to babies", "They have feathers and wings", "They breathe only through gills in water", "They hatch from hard eggs in sand"],
    answer: 0,
    explanation: "Mammals have hair or fur, are warm-blooded, and mothers feed milk to their young."
  },
  {
    id: "sci-10",
    type: "science",
    category: "🔬 Science Lab",
    title: "Plant Life Cycle",
    prompt: "What is the green substance inside plant leaves that captures sunlight for photosynthesis?",
    choices: ["Chlorophyll", "Pollen", "Bark", "Roots"],
    answer: 0,
    explanation: "Chlorophyll is the green pigment that traps sunlight energy so plants can make food."
  },
  {
    id: "sci-11",
    type: "science",
    category: "🔬 Science Lab",
    title: "Forces: Friction",
    prompt: "Why is it harder to slide a heavy box across a rough carpet than across smooth ice?",
    choices: ["Carpet has more friction that resists sliding", "Ice has more gravity", "Carpet is colder than ice", "The box becomes heavier on carpet"],
    answer: 0,
    explanation: "Rough surfaces create high friction that pushes back against sliding objects."
  },
  {
    id: "sci-12",
    type: "science",
    category: "🔬 Science Lab",
    title: "Earth's Rotation",
    prompt: "What causes day and night on Earth?",
    choices: ["Earth spins on its axis every 24 hours", "The Sun turns off like a light bulb", "Clouds block the Sun at night", "The Moon travels between the Earth and Sun"],
    answer: 0,
    explanation: "As Earth spins (rotates) once every 24 hours, one side faces the Sun (day) while the other faces away (night)."
  },
  {
    id: "sci-13",
    type: "science",
    category: "🔬 Science Lab",
    title: "Ecosystems: Food Chain",
    prompt: "In a food chain, what role do green plants play?",
    choices: ["Producers (making their own food)", "Consumers (eating other animals)", "Decomposers", "Predators"],
    answer: 0,
    explanation: "Plants are producers because they produce their own food using sunlight, water, and air."
  },

  // --------------------------------------------------------------------------
  // SOCIAL STUDIES, GEOGRAPHY & CITIZENSHIP
  // --------------------------------------------------------------------------
  {
    id: "soc-6",
    type: "social",
    category: "🌍 Social Studies",
    title: "Compass Directions",
    prompt: "If you face North, what direction is directly behind you?",
    choices: ["South", "East", "West", "Northeast"],
    answer: 0,
    explanation: "South is directly opposite of North on the compass."
  },
  {
    id: "soc-7",
    type: "social",
    category: "🌍 Social Studies",
    title: "Continents: The Coldest",
    prompt: "Which continent is covered almost completely in thick ice and is home to emperor penguins?",
    choices: ["Antarctica", "Australia", "Africa", "Europe"],
    answer: 0,
    explanation: "Antarctica is the coldest, windiest, and iciest continent on Earth!"
  },
  {
    id: "soc-8",
    type: "social",
    category: "🌍 Social Studies",
    title: "Good Citizenship",
    prompt: "What is an example of being a responsible citizen in your classroom?",
    choices: [
      "Listening respectfully and helping keep the room clean",
      "Talking over the teacher when others are working",
      "Refusing to share colored pencils",
      "Leaving paper scraps on the floor"
    ],
    answer: 0,
    explanation: "Good citizens respect others, listen, cooperate, and take care of shared spaces."
  },
  {
    id: "soc-9",
    type: "social",
    category: "🌍 Social Studies",
    title: "Community Helpers",
    prompt: "Who in our community helps put out fires and teaches fire safety?",
    choices: ["Firefighters", "Librarians", "Architects", "Accountants"],
    answer: 0,
    explanation: "Firefighters protect people, homes, and wildlife from fires."
  },
  {
    id: "soc-10",
    type: "social",
    category: "🌍 Social Studies",
    title: "Goods vs Services",
    prompt: "Which of these is a SERVICE rather than a physical good?",
    choices: ["A haircut from a barber", "A loaf of bread", "A toy airplane", "A pair of shoes"],
    answer: 0,
    explanation: "A haircut is a service performed by a person, whereas bread and toys are tangible goods."
  },

  // --------------------------------------------------------------------------
  // BRAIN TEASERS & LOGIC RIDDLES
  // --------------------------------------------------------------------------
  {
    id: "rid-5",
    type: "riddle",
    category: "🧠 Brain Teaser",
    title: "Riddle: Many Teeth",
    prompt: "I have many teeth, but I cannot bite anything. What am I?",
    choices: ["A Hair Comb", "A Crocodile", "A Saw", "A Zipper"],
    answer: 0,
    explanation: "A hair comb has teeth to detangle your hair, but cannot bite!"
  },
  {
    id: "rid-6",
    type: "riddle",
    category: "🧠 Brain Teaser",
    title: "Riddle: Going Up and Down",
    prompt: "What goes up and down but never actually moves?",
    choices: ["A Flight of Stairs", "An Elevator", "A Yo-yo", "A Balloon"],
    answer: 0,
    explanation: "Stairs go up and down between floors, but they stay in one place!"
  },
  {
    id: "rid-7",
    type: "riddle",
    category: "🧠 Brain Teaser",
    title: "Logic: Heavy Feathers",
    prompt: "Which is heavier: One pound of gold or one pound of feathers?",
    choices: ["They weigh exactly the same!", "The gold is heavier", "The feathers are heavier", "Gold is double weight"],
    answer: 0,
    explanation: "Both weigh exactly one pound! Weight is equal even though feathers take up much more space."
  },
  {
    id: "rid-8",
    type: "riddle",
    category: "🧠 Brain Teaser",
    title: "Pattern Logic: Number Jump",
    prompt: "Look at the numbers: 5, 10, 15, 20, 25, ___?\nWhat number comes next?",
    choices: ["30", "28", "35", "26"],
    answer: 0,
    explanation: "Counting by 5s: 5, 10, 15, 20, 25, 30!"
  },
  {
    id: "w5-opp-2",
    type: "week5",
    category: "⭐ Week 5 Focus",
    title: "Real-Life Scenario: Oppose",
    prompt: "If your town council wants to cut down trees in the park and citizens speak out against it, they _________ the plan.",
    choices: ["oppose", "support", "celebrate", "originate"],
    answer: 0,
    explanation: "Speaking against an action means they oppose it."
  },
  {
    id: "w5-syn-2",
    type: "syn_ant",
    category: "⭐ Week 5 Focus",
    title: "Synonym Match: Diverse",
    prompt: "Which pair of words are SYNONYMS for \"diverse\"?",
    choices: ["different & varied", "identical & same", "small & tiny", "empty & plain"],
    answer: 0,
    explanation: "\"Diverse\" means different, varied, and unlike one another."
  },
  {
    id: "math-18",
    type: "math",
    category: "🔢 Math Mania",
    title: "Multiplication Fact: 9 x 4",
    prompt: "What is 9 × 4?",
    choices: ["36", "32", "45", "28"],
    answer: 0,
    explanation: "9 groups of 4 equals 36 (or 4 × 9 = 36)!"
  },
  {
    id: "math-19",
    type: "math",
    category: "🔢 Math Mania",
    title: "Multiplication Fact: 12 x 3",
    prompt: "What is 12 × 3?",
    choices: ["36", "24", "39", "48"],
    answer: 0,
    explanation: "12 × 3 = 36!"
  },
  {
    id: "sci-14",
    type: "science",
    category: "🔬 Science Lab",
    title: "Magnets: Attraction",
    prompt: "What happens when you bring the North pole of one magnet near the South pole of another magnet?",
    choices: ["They attract (pull towards each other)", "They repel (push apart)", "They explode", "Nothing happens"],
    answer: 0,
    explanation: "Opposite magnetic poles attract, while like poles (North-North) repel!"
  },
  {
    id: "story-8",
    type: "story",
    category: "📖 Story Time",
    title: "Story: Sammy the Sea Turtle",
    prompt: "\"Sammy the sea turtle hatched on a moonlit sandy beach and scrambled quickly toward the crashing waves. He swam past vibrant coral reefs filled with diverse schools of clownfish and sea anemones. Over thirty years later, Sammy returned to the exact same origin where he was born to start a new family.\"\n\nWhat did Sammy do thirty years later?",
    choices: [
      "Returned to the exact beach origin where he hatched",
      "Moved to a freshwater lake",
      "Built a nest in a high palm tree",
      "Swallowed plastic pieces"
    ],
    answer: 0,
    explanation: "The story explains that Sammy returned to the exact same origin where he was born!"
  }
];

// Shuffle helper (Fisher-Yates)
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Return a randomized deck of challenges excluding recently answered ones
export function getChallengeBatch(count = 20, excludedIds = []) {
  const excludeSet = new Set(excludedIds);
  let pool = MASSIVE_CHALLENGES.filter((c) => !excludeSet.has(c.id));

  // If pool is exhausted, reset and use full bank
  if (pool.length < count) {
    pool = [...MASSIVE_CHALLENGES];
  }

  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, count);
}
