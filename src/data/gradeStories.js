/* KidLingo featured story per grade (KG–G6) — from the approved design. */

export const GRADE_STORIES = [
  {
    gradeKey: 'KG',
    title: 'Sam The Cat',
    subtitle: 'CVC Phonics & Sounds',
    level: 'Level KG · Early Phonics',
    paragraphs: [
      "Sam is a cat. Sam sat on a mat.",
      "A fat rat ran to Sam. The cat saw the rat.",
      "Sam can hop. The rat can run. Hop, Sam, hop!"
    ],
    sentenceExplains: [
      "Introduces Sam the cute cat sitting comfortably on his mat.",
      "A playful rat runs right past the cat!",
      "Sam hops with joy as the friendly rat runs."
    ],
    sentenceQuestions: [
      { q: "Who is Sam?", options: ["A cat", "A dog", "A bird"], correct: 0 },
      { q: "Where did Sam sit?", options: ["On a mat", "In a tree", "On a car"], correct: 0 },
      { q: "What can Sam do?", options: ["Hop", "Fly", "Swim"], correct: 0 }
    ],
    illustration: `<svg viewBox="0 0 320 160" class="w-full h-full"><rect width="320" height="160" fill="#fef08a" rx="16" opacity="0.3"/><ellipse cx="160" cy="130" rx="80" ry="20" fill="#f43f5e" opacity="0.8"/><ellipse cx="160" cy="130" rx="65" ry="14" fill="#fb7185"/><ellipse cx="160" cy="95" rx="26" ry="24" fill="#fb923c"/><circle cx="160" cy="65" r="18" fill="#fb923c"/><polygon points="148,55 152,42 160,54" fill="#ea580c"/><polygon points="162,54 168,42 172,55" fill="#ea580c"/><circle cx="154" cy="64" r="2.5" fill="#431407"/><circle cx="166" cy="64" r="2.5" fill="#431407"/><path d="M157 70 Q160 74 163 70" stroke="#431407" stroke-width="2" fill="none"/><ellipse cx="260" cy="125" rx="14" ry="9" fill="#94a3b8"/><circle cx="272" cy="120" r="7" fill="#94a3b8"/><circle cx="274" cy="118" r="1.5" fill="#0f172a"/></svg>`
  },
  {
    gradeKey: 'G1',
    title: 'Run, Play, Read!',
    subtitle: 'Dolch Sight Words',
    level: 'Grade 1 · Short Sight Words',
    paragraphs: [
      "I see a cat. The cat can run. Run, cat, run!",
      "She can jump and she can play. He has a dog. I love my dog.",
      "He will go and get the red ball. We run and play in the sun.",
      "The dog will sit, get the ball, and go back to me.",
      "I love to read my big book with my mom. We read, go, and play all day!"
    ],
    sentenceExplains: [
      "Points out a fast cat that loves running across the soft green grass.",
      "Shows how the girl jumps and plays with a beloved puppy companion.",
      "The boy chases a bouncy red ball in the warm afternoon sunshine.",
      "The smart puppy fetches the ball and brings it back happily.",
      "Reading big exciting books together with mom makes every day joyful."
    ],
    sentenceQuestions: [
      { q: "What can the cat do?", options: ["Run fast", "Fly high", "Swim deeply"], correct: 0 },
      { q: "What color is the toy ball?", options: ["Red", "Purple", "Green"], correct: 0 },
      { q: "Who does the child love to read with?", options: ["Mom", "A robot", "A snowman"], correct: 0 }
    ],
    illustration: `<svg viewBox="0 0 320 160" class="w-full h-full"><rect width="320" height="160" fill="#e0f2fe" rx="16" opacity="0.4"/><path d="M0,120 Q80,100 160,110 T320,105 L320,160 L0,160 Z" fill="#86efac"/><circle cx="50" cy="40" r="22" fill="#fde047"/><ellipse cx="140" cy="110" rx="20" ry="14" fill="#d97706"/><circle cx="158" cy="98" r="11" fill="#d97706"/><ellipse cx="153" cy="98" rx="3" ry="8" fill="#92400e"/><circle cx="210" cy="115" r="10" fill="#ef4444"/><path d="M204 112 Q210 106 216 112" stroke="#fca5a5" stroke-width="2" fill="none"/></svg>`
  },
  {
    gradeKey: 'G2',
    title: 'The Brave Little Fox',
    subtitle: 'Adventures & Kindness',
    level: 'Grade 2 · Early Chapter',
    paragraphs: [
      "Rusty was a small red fox with bright golden eyes. He lived in the Whispering Woods.",
      "One sunny morning, Rusty heard a soft cry near the riverbank. A tiny bluebird was caught in a prickly bush.",
      "'Do not fear,' whispered Rusty gently. Using his soft paws, he parted the branches until the bird fluttered free into the sky.",
      "From that day on, the birds sang joyful songs to guide Rusty on all his woodland journeys."
    ],
    sentenceExplains: [
      "Introduces Rusty, a kind fox living peacefully in an enchanted forest.",
      "Rusty hears a cry for help from a trapped little bird.",
      "Shows courage and gentle teamwork as Rusty saves the bird.",
      "A lesson in friendship and kindness returning blessings."
    ],
    sentenceQuestions: [
      { q: "What kind of animal was Rusty?", options: ["A fox", "A bear", "A rabbit"], correct: 0 },
      { q: "Where was the bluebird caught?", options: ["In a prickly bush", "In a cave", "In a shoe"], correct: 0 },
      { q: "How did the birds thank Rusty?", options: ["Sang joyful songs", "Gave him nuts", "Ran away"], correct: 0 }
    ],
    illustration: `<svg viewBox="0 0 320 160" class="w-full h-full"><rect width="320" height="160" fill="#fef3c7" rx="16" opacity="0.3"/><circle cx="260" cy="50" r="18" fill="#fde047"/><path d="M40 140 L70 70 L100 140 Z" fill="#15803d"/><path d="M80 140 L105 80 L130 140 Z" fill="#16a34a"/><ellipse cx="180" cy="118" rx="20" ry="16" fill="#ea580c"/><polygon points="175,95 190,95 182,75" fill="#ea580c"/><path d="M195 118 Q215 110 215 95" stroke="#ea580c" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="215" cy="95" r="4" fill="#ffffff"/><ellipse cx="230" cy="65" rx="8" ry="6" fill="#38bdf8"/><polygon points="224,63 218,55 228,63" fill="#0284c7"/></svg>`
  },
  {
    gradeKey: 'G3',
    title: 'The Treehouse Mystery',
    subtitle: 'Curious Clues & Friends',
    level: 'Grade 3 · Mystery Story',
    paragraphs: [
      "Leo and Maya climbed up the wooden ladder into their secret treetop observatory.",
      "On the rustic cedar table rested an old brass key tied to a weathered treasure map.",
      "'Look at these riddles,' Maya exclaimed, tracing the faded ink paths with her finger.",
      "The map pointed towards the ancient hollow oak tree at the edge of Meadowbrook Park."
    ],
    sentenceExplains: [
      "Two enthusiastic friends visit their secret treehouse hideout.",
      "They discover an intriguing mysterious key and antique map.",
      "They examine the clever riddles guiding to hidden wonders.",
      "Their adventure begins with an ancient landmark in the park."
    ],
    sentenceQuestions: [
      { q: "Where did Leo and Maya climb?", options: ["Into a treehouse", "Down a basement", "On a roof"], correct: 0 },
      { q: "What was tied to the treasure map?", options: ["A brass key", "A chocolate coin", "A whistle"], correct: 0 },
      { q: "Where did the map point?", options: ["The hollow oak tree", "The grocery store", "The library"], correct: 0 }
    ],
    illustration: `<svg viewBox="0 0 320 160" class="w-full h-full"><rect width="320" height="160" fill="#ecfdf5" rx="16"/><rect x="130" y="60" width="60" height="100" fill="#78350f"/><rect x="110" y="40" width="100" height="60" rx="8" fill="#b45309"/><polygon points="100,40 160,10 220,40" fill="#92400e"/><line x1="140" y1="100" x2="140" y2="155" stroke="#fed7aa" stroke-width="3"/><line x1="155" y1="100" x2="155" y2="155" stroke="#fed7aa" stroke-width="3"/><line x1="140" y1="115" x2="155" y2="115" stroke="#fed7aa" stroke-width="2.5"/><line x1="140" y1="130" x2="155" y2="130" stroke="#fed7aa" stroke-width="2.5"/><line x1="140" y1="145" x2="155" y2="145" stroke="#fed7aa" stroke-width="2.5"/></svg>`
  },
  {
    gradeKey: 'G4',
    title: 'The Deep Ocean Quest',
    subtitle: 'Science & Marine Wonder',
    level: 'Grade 4 · Non-Fiction Reader',
    paragraphs: [
      "Beneath the sunlit turquoise waves lies a realm of astonishing biodiversity known as the coral reef.",
      "Marine biologists navigate through vibrant underwater canyons to observe bio-luminescent creatures.",
      "Schools of clownfish find sanctuary among anemone tentacles, forming symbiotic bonds of mutual protection.",
      "Preserving these delicate aquatic ecosystems ensures future generations can cherish our magnificent oceans."
    ],
    sentenceExplains: [
      "Explores the vibrant life and beauty found in coral reef ecosystems.",
      "Describes how scientists study glowing deep-sea organisms.",
      "Highlights how marine animals cooperate and protect each other.",
      "Emphasizes the vital importance of ocean conservation."
    ],
    sentenceQuestions: [
      { q: "What realm lies beneath the waves?", options: ["The coral reef", "A sandy desert", "A frozen glacier"], correct: 0 },
      { q: "What bonds do clownfish and anemones form?", options: ["Symbiotic protection", "Hostile rivalry", "Silent distance"], correct: 0 }
    ],
    illustration: `<svg viewBox="0 0 320 160" class="w-full h-full"><rect width="320" height="160" fill="#0284c7" rx="16"/><path d="M10 160 Q30 110 50 160 Q70 95 90 160" fill="#f43f5e" opacity="0.8"/><path d="M220 160 Q240 105 260 160 Q280 90 310 160" fill="#fb923c" opacity="0.8"/><ellipse cx="160" cy="70" rx="18" ry="10" fill="#facc15"/><polygon points="142,70 132,60 132,80" fill="#facc15"/><circle cx="170" cy="68" r="2" fill="#0f172a"/></svg>`
  },
  {
    gradeKey: 'G5',
    title: 'The Clockwork Alchemist',
    subtitle: 'Inventors & Historical Fiction',
    level: 'Grade 5 · Historical Fiction',
    paragraphs: [
      "In a cobblestone workshop in Renaissance Prague, Master Gabriel assembled intricate astronomical gears.",
      "His grand clock did not merely chime the hours; it forecasted planetary orbits and celestial eclipses.",
      "His young apprentice, Klara, discovered that one polished brass cog held a hidden cipher etched upon its rim.",
      "Together they unlocked the chamber containing the inventor's secret blueprints for clean energy perpetual motion."
    ],
    sentenceExplains: [
      "Sets a historical atmosphere of craftsmanship and science in ancient Prague.",
      "Describes an extraordinary astronomical clock that maps the solar system.",
      "Klara's keen observation reveals a secret code hidden inside the clockwork.",
      "Rewards curious minds with futuristic historical inventions."
    ],
    sentenceQuestions: [
      { q: "Where was Master Gabriel's workshop?", options: ["In Prague", "In New York", "On Mars"], correct: 0 },
      { q: "What did the grand clock forecast?", options: ["Planetary orbits", "Train schedules", "Cake recipes"], correct: 0 }
    ],
    illustration: `<svg viewBox="0 0 320 160" class="w-full h-full"><rect width="320" height="160" fill="#312e81" rx="16"/><circle cx="160" cy="80" r="50" stroke="#f59e0b" stroke-width="4" fill="none"/><circle cx="160" cy="80" r="30" stroke="#fbbf24" stroke-width="2" fill="none"/><line x1="160" y1="30" x2="160" y2="130" stroke="#f59e0b" stroke-width="2"/><line x1="110" y1="80" x2="210" y2="80" stroke="#f59e0b" stroke-width="2"/><circle cx="160" cy="80" r="8" fill="#fde047"/></svg>`
  },
  {
    gradeKey: 'G6',
    title: 'De Tom Sawyer',
    subtitle: 'Las Aventuras · Mark Twain',
    level: 'Grade 6 · Classic Literature',
    paragraphs: [
      "Mr Sedley took his son aside after dinner, and gave him some advice.",
      "'I am determined to marry you,' he said. The young man replied, but he was very shy. He began to think about Becky more and more.",
      "He was convinced that he was in love with her. His behaviour towards her became stranger and stranger as he struggled against his shyness. Becky thought he was in love, and perhaps he might ask her to marry him.",
      "The future looked bright for her. There were two frequent visitors to the Sedley household during Miss Sharp's stay there. They were two adventurous friends of Tom Sawyer."
    ],
    sentenceExplains: [
      "A father shares heartfelt private counsel with his bashful son.",
      "The youth contemplates romance while struggling with shyness.",
      "Emotions build as awkward affection and courtship unfold.",
      "Introduces lively visitors and sets a spirited tone for classic adventures."
    ],
    sentenceQuestions: [
      { q: "What did Mr Sedley give his son?", options: ["Advice", "A boat", "A golden coin"], correct: 0 },
      { q: "How did the young man feel?", options: ["Very shy", "Angry", "Bored"], correct: 0 },
      { q: "Who were the frequent visitors friends of?", options: ["Tom Sawyer", "A pirate king", "A detective"], correct: 0 }
    ],
    illustration: `<svg viewBox="0 0 320 160" class="w-full h-full"><rect width="320" height="160" fill="#fef3c7" rx="16"/><line x1="40" y1="20" x2="40" y2="140" stroke="#92400e" stroke-width="4"/><line x1="80" y1="20" x2="80" y2="140" stroke="#92400e" stroke-width="4"/><line x1="120" y1="20" x2="120" y2="140" stroke="#92400e" stroke-width="4"/><line x1="20" y1="50" x2="140" y2="50" stroke="#92400e" stroke-width="3"/><line x1="20" y1="90" x2="140" y2="90" stroke="#92400e" stroke-width="3"/><g transform="translate(140, 20)"><ellipse cx="60" cy="50" rx="16" ry="18" fill="#fde68a"/><ellipse cx="60" cy="40" rx="26" ry="7" fill="#eab308"/><circle cx="85" cy="65" r="8" fill="#ef4444"/></g></svg>`
  }
];

export function featuredStory(gradeKey) {
  return GRADE_STORIES.find((s) => s.gradeKey === gradeKey) || GRADE_STORIES[1];
}
