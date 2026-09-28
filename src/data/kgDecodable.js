// 50 Kindergarten Decodable Phonics Readers & Word Lists
// Structured progressive phonics: Short vowels (a, e, i, o, u), blends, digraphs (sh, ch, th, ng, ck), diphthongs, and magic-e.

export const KG_DECODABLE_BOOKS = [
  {
    id: 1,
    book_code: "Book 1 - a",
    title: "A Cat and a Mat",
    theme: "cat",
    emoji: "🐱",
    accent_color: "#FF6B6B",
    target_sounds: ["short-a"],
    cvc_words: ["cat", "sat", "mat", "rat", "ran"],
    sight_words: ["the", "on", "a", "saw", "fast", "and"],
    sentences: [
      "The cat sat.",
      "The cat sat on a mat.",
      "A rat sat on the cat.",
      "The cat saw the rat.",
      "The rat ran.",
      "The cat ran fast.",
      "The cat and rat sat on the mat."
    ],
    graphic: {
      shape_type: "rectangle",
      icon_name: "cat",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='5' y='5' width='90' height='90' rx='18' fill='#FFE3E3'/><path d='M28 38 L38 52 L18 52 Z' fill='#FF6B6B'/><path d='M72 38 L82 52 L62 52 Z' fill='#FF6B6B'/><circle cx='50' cy='62' r='24' fill='#FF8787'/><circle cx='42' cy='58' r='3.5' fill='#2B2D42'/><circle cx='58' cy='58' r='3.5' fill='#2B2D42'/><polygon points='50,65 46,69 54,69' fill='#E03131'/><rect x='20' y='88' width='60' height='6' rx='3' fill='#FA5252'/></svg>"
    }
  },
  {
    id: 2,
    book_code: "Book 1 - b",
    title: "Sam Has a Hat",
    theme: "hat",
    emoji: "👒",
    accent_color: "#FFA94D",
    target_sounds: ["short-a"],
    cvc_words: ["Sam", "has", "hat", "tan", "pan", "ran", "bat", "sat", "had", "sad", "cat"],
    sight_words: ["a", "the", "is", "fell", "in", "to", "get"],
    sentences: [
      "Sam has a hat.",
      "The hat is tan.",
      "The tan hat fell in a pan.",
      "Sam ran to get the hat.",
      "A bat sat on the hat!",
      "Sam had a sad cat."
    ],
    graphic: {
      shape_type: "circle",
      icon_name: "hat",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#FFF3BF'/><ellipse cx='50' cy='68' rx='34' ry='8' fill='#E67700'/><path d='M30 66 L34 32 C34 26 66 26 66 32 L70 66 Z' fill='#F76707'/><rect x='32' y='58' width='36' height='5' fill='#FFD43B'/></svg>"
    }
  },
  {
    id: 3,
    book_code: "Book 2 - a",
    title: "The Big Red Hen",
    theme: "hen",
    emoji: "🐔",
    accent_color: "#E03131",
    target_sounds: ["short-e"],
    cvc_words: ["Jen", "red", "hen", "pen", "Ben", "fed", "ten", "men", "got", "wet", "set", "bed"],
    sight_words: ["has", "a", "the", "is", "in", "seeds", "saw", "now", "not"],
    sentences: [
      "Jen has a red hen.",
      "The red hen is in a pen.",
      "Ben fed the hen ten seeds.",
      "Ten men saw the red hen.",
      "The hen got wet in the pen.",
      "Jen set the hen in a bed.",
      "The hen is not wet now."
    ],
    graphic: {
      "shape_type": "rounded-box",
      "icon_name": "hen",
      "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='22' fill='#FFE3E3'/><path d='M44 24 C44 20 54 20 54 24 C58 20 66 22 64 28 Z' fill='#C92A2A'/><ellipse cx='50' cy='55' rx='24' ry='20' fill='#FA5252'/><polygon points='68,52 80,56 68,60' fill='#FD7E14'/><circle cx='60' cy='46' r='3' fill='#2B2D42'/><path d='M36 55 Q20 52 26 40 Q38 46 42 52 Z' fill='#E03131'/></svg>"
    }
  },
  {
    id: 4,
    book_code: "Book 2 - b",
    title: "Ted and His Net",
    theme: "net",
    emoji: "🕸️",
    accent_color: "#4DABF7",
    target_sounds: ["short-e", "short-i"],
    cvc_words: ["Ted", "big", "net", "met", "Meg", "jet", "let", "get", "pet", "fell", "wet", "got", "set", "peg"],
    sight_words: ["has", "a", "his", "at", "the", "in", "Is", "Yes", "on"],
    sentences: [
      "Ted has a big net.",
      "Ted met Meg at the jet.",
      "Meg let Ted get the pet.",
      "The pet fell in the net.",
      "Is the pet wet?",
      "Yes, the pet got wet.",
      "Ted set the pet on a peg."
    ],
    graphic: {
      shape_type: "hexagon",
      icon_name: "net",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><polygon points='50,6 88,28 88,72 50,94 12,72 12,28' fill='#E7F5FF'/><line x1='34' y1='25' x2='78' y2='80' stroke='#1971C2' stroke-width='4' stroke-linecap='round'/><ellipse cx='34' cy='32' rx='16' ry='12' fill='none' stroke='#228BE6' stroke-width='3'/><path d='M22 36 Q34 68 46 36' fill='none' stroke='#339AF0' stroke-width='2' stroke-dasharray='3,3'/></svg>"
    }
  },
  {
    id: 5,
    book_code: "Book 3 - a",
    title: "Tim and His Pin",
    theme: "pin",
    emoji: "📍",
    accent_color: "#FAB005",
    target_sounds: ["short-i"],
    cvc_words: ["Tim", "tin", "pin", "big", "bin", "can", "dig", "get", "did", "win", "sat", "rim", "sip", "cup"],
    sight_words: ["has", "a", "The", "fell", "in", "the", "took", "from"],
    sentences: [
      "Tim has a tin pin.",
      "The pin fell in a big bin.",
      "Tim can dig in the bin.",
      "Can Tim get the pin?",
      "Tim did win the pin!",
      "Tim sat on the rim.",
      "Tim took a sip from a tin cup."
    ],
    graphic: {
      shape_type: "badge",
      icon_name: "pin",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='44' fill='#FFF9DB'/><circle cx='50' cy='32' r='14' fill='#F59F00'/><polygon points='46,44 54,44 50,78' fill='#CED4DA'/><polygon points='48,78 52,78 50,84' fill='#495057'/></svg>"
    }
  },
  {
    id: 6,
    book_code: "Book 3 - b",
    title: "The Pig Did Zip",
    theme: "pig",
    emoji: "🐷",
    accent_color: "#F783AC",
    target_sounds: ["short-i", "short-a"],
    cvc_words: ["Pip", "big", "pig", "did", "sit", "pit", "had", "bib", "kid", "hid", "zip", "tip", "rip", "bit", "fig"],
    sight_words: ["is", "a", "in", "on", "the", "and", "glad", "full"],
    sentences: [
      "Pip is a big pig.",
      "Pip did sit in a pit.",
      "Pip had a bib on.",
      "A kid hid the bib.",
      "Pip did zip and tip a rip.",
      "Pip bit a big fig.",
      "The pig is full and glad."
    ],
    graphic: {
      shape_type: "circle",
      icon_name: "pig",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#FFF0F6'/><circle cx='50' cy='52' r='28' fill='#F783AC'/><polygon points='26,28 38,40 24,44' fill='#E64980'/><polygon points='74,28 62,40 76,44' fill='#E64980'/><ellipse cx='50' cy='58' rx='11' ry='8' fill='#FFDEEB'/><circle cx='46' cy='58' r='2' fill='#D6336C'/><circle cx='54' cy='58' r='2' fill='#D6336C'/><circle cx='40' cy='46' r='3' fill='#2B2D42'/><circle cx='60' cy='46' r='3' fill='#2B2D42'/></svg>"
    }
  },
  {
    id: 7,
    book_code: "Book 4 - a",
    title: "The Hot Pot",
    theme: "pot",
    emoji: "🍲",
    accent_color: "#FF922B",
    target_sounds: ["short-o"],
    cvc_words: ["Mom", "hot", "pot", "top", "log", "Dot", "got", "mop", "drop", "pop", "jog", "shop", "Bob", "sat"],
    sight_words: ["has", "a", "the", "is", "on", "of", "for", "Can", "and", "to", "by"],
    sentences: [
      "Mom has a hot pot.",
      "The pot is on top of the log.",
      "Dot got a mop for the pot.",
      "A drop got on the mop.",
      "Can Dot pop the hot top?",
      "Dot and Mom jog to the shop.",
      "Bob sat on a log by the pot."
    ],
    graphic: {
      shape_type: "square",
      icon_name: "pot",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='6' y='6' width='88' height='88' rx='16' fill='#FFF4E6'/><path d='M24 46 L76 46 L70 78 C70 82 30 82 30 78 Z' fill='#E8590C'/><rect x='20' y='40' width='60' height='6' rx='3' fill='#D9480F'/><circle cx='50' cy='34' r='4' fill='#868E96'/><path d='M42 28 Q40 20 46 14 M54 28 Q52 20 58 14' stroke='#FD7E14' stroke-width='2.5' fill='none' stroke-linecap='round'/></svg>"
    }
  },
  {
    id: 8,
    book_code: "Book 4 - b",
    title: "Fox on a Box",
    theme: "fox",
    emoji: "🦊",
    accent_color: "#FD7E14",
    target_sounds: ["short-o", "short-u"],
    cvc_words: ["fox", "sat", "box", "dog", "jog", "hop", "ran", "big", "log", "not", "nap", "sun"],
    sight_words: ["a", "on", "the", "saw", "did", "to", "off", "is", "and", "in"],
    sentences: [
      "A fox sat on a box.",
      "The dog saw the fox.",
      "The dog did jog to the box.",
      "The fox did hop off the box.",
      "The fox ran to a big log.",
      "The dog is not on the log.",
      "The fox and dog nap in the sun."
    ],
    graphic: {
      shape_type: "diamond",
      icon_name: "fox",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#FFE8CC'/><polygon points='26,26 40,46 22,50' fill='#D9480F'/><polygon points='74,26 60,46 78,50' fill='#D9480F'/><polygon points='24,46 76,46 50,82' fill='#F76707'/><polygon points='38,62 62,62 50,82' fill='#FFFFFF'/><circle cx='40' cy='52' r='3.5' fill='#212529'/><circle cx='60' cy='52' r='3.5' fill='#212529'/><circle cx='50' cy='72' r='3' fill='#212529'/></svg>"
    }
  },
  {
    id: 9,
    book_code: "Book 5 - a",
    title: "Gus in the Mud",
    theme: "pup",
    emoji: "🐶",
    accent_color: "#A61E4D",
    target_sounds: ["short-u"],
    cvc_words: ["Gus", "pup", "can", "run", "mud", "dug", "big", "rut", "bug", "sat", "red", "tub", "rub", "not"],
    sight_words: ["is", "a", "in", "the", "on", "to", "Rub", "Now"],
    sentences: [
      "Gus is a pup.",
      "Gus can run in the mud.",
      "The pup dug a big rut.",
      "A bug sat on the pup.",
      "Gus ran to a red tub.",
      "Rub the pup in the tub!",
      "Now Gus is not in the mud."
    ],
    graphic: {
      shape_type: "circle",
      icon_name: "pup",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#F8F0FC'/><circle cx='50' cy='52' r='26' fill='#D0BFFF'/><ellipse cx='28' cy='46' rx='7' ry='16' fill='#845EF7'/><ellipse cx='72' cy='46' rx='7' ry='16' fill='#845EF7'/><circle cx='42' cy='48' r='3.5' fill='#1E1E24'/><circle cx='58' cy='48' r='3.5' fill='#1E1E24'/><ellipse cx='50' cy='59' rx='6' ry='4' fill='#5F3DC4'/><path d='M40 76 Q50 84 60 76' fill='#7950F2'/></svg>"
    }
  },
  {
    id: 10,
    book_code: "Book 5 - b",
    title: "The Bug and the Nut",
    theme: "bug",
    emoji: "🐞",
    accent_color: "#2B8A3E",
    target_sounds: ["short-u"],
    cvc_words: ["bug", "got", "nut", "did", "cut", "hut", "ran", "red", "cup", "fit", "hid", "pup"],
    sight_words: ["A", "on", "a", "the", "bird", "saw", "to", "Can", "in", "Yes", "and", "bumped"],
    sentences: [
      "A bug got on a nut.",
      "The bug did cut the nut.",
      "A bird saw the bug on the hut.",
      "The bug ran to a red cup.",
      "Can the bug fit in the cup?",
      "Yes, the bug hid in the cup.",
      "The pup ran and bumped the cup."
    ],
    graphic: {
      shape_type: "pill",
      icon_name: "bug",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='24' fill='#EBFBEE'/><circle cx='50' cy='32' r='10' fill='#2B8A3E'/><ellipse cx='50' cy='58' rx='20' ry='22' fill='#51CF66'/><line x1='50' y1='36' x2='50' y2='80' stroke='#237032' stroke-width='2.5'/><circle cx='40' cy='54' r='3' fill='#237032'/><circle cx='60' cy='54' r='3' fill='#237032'/><path d='M44 26 L36 16 M56 26 L64 16' stroke='#2B8A3E' stroke-width='2.5' stroke-linecap='round'/></svg>"
    }
  },
  {
    id: 11,
    book_code: "Book 6 - a",
    title: "The Bad Lad and His Bag",
    theme: "bag",
    emoji: "🎒",
    accent_color: "#20C997",
    target_sounds: ["short-a", "initial-blends"],
    cvc_words: ["lad", "had", "rag", "bag", "big", "tag", "crab", "tap", "snap", "zag", "sat", "mat", "ran", "cab"],
    sight_words: ["A", "a", "The", "on", "did", "and", "into", "flat"],
    sentences: [
      "A lad had a rag bag.",
      "The bag had a big tag.",
      "A crab got on the bag.",
      "The lad did tap the crab.",
      "The crab did snap and zag.",
      "The lad sat on a flat mat.",
      "The crab ran into the cab."
    ],
    graphic: {
      shape_type: "squircle",
      icon_name: "tote-bag",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#E6FCF5'/><path d='M38 42 V30 C38 22 62 22 62 30 V42' fill='none' stroke='#0CA678' stroke-width='4' stroke-linecap='round'/><path d='M26 42 L32 82 H68 L74 42 Z' fill='#20C997'/><circle cx='62' cy='54' r='5' fill='#FFD43B'/></svg>"
    }
  },
  {
    id: 12,
    book_code: "Book 6 - b",
    title: "Ned and the Bell",
    theme: "bell",
    emoji: "🔔",
    accent_color: "#FCC419",
    target_sounds: ["short-e", "double-consonants"],
    cvc_words: ["Ned", "well", "rang", "red", "bell", "fell", "wall", "hen", "pen", "sat", "bed", "got", "bun"],
    sight_words: ["went", "down", "to", "the", "a", "off", "pecked", "at", "led", "in", "soft"],
    sentences: [
      "Ned went down to the well.",
      "Ned rang a red bell.",
      "The bell fell off the wall.",
      "A hen pecked at the bell.",
      "Ned led the hen to a pen.",
      "The hen sat in a soft bed.",
      "Ned got a ten-cent bun."
    ],
    graphic: {
      shape_type: "star-polygon",
      icon_name: "bell",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='44' fill='#FFF9DB'/><path d='M50 20 C40 20 34 36 32 58 L24 68 H76 L68 58 C66 36 60 20 50 20 Z' fill='#FAB005'/><ellipse cx='50' cy='68' rx='26' ry='5' fill='#F59F00'/><circle cx='50' cy='76' r='6' fill='#E67700'/><circle cx='50' cy='16' r='3.5' fill='#F59F00'/></svg>"
    }
  },
  {
    id: 13,
    book_code: "Book 7 - a",
    title: "Six Pigs Dig",
    theme: "shovel-dig",
    emoji: "⛏️",
    accent_color: "#845EF7",
    target_sounds: ["short-i", "blends"],
    cvc_words: ["six", "pigs", "dig", "pit", "big", "pig", "did", "flip", "hit", "mud", "Tim", "pen", "lick", "drip", "will", "sit", "sip", "milk", "nap"],
    sight_words: ["in", "the", "A", "a", "stick", "fixed", "cold", "and"],
    sentences: [
      "Six pigs dig in the pit.",
      "A big pig did a flip.",
      "The pig hit a stick in the mud.",
      "Tim fixed the big pig pen.",
      "The pigs lick a cold drip.",
      "Tim will sit and sip milk.",
      "Six pigs nap in the pen."
    ],
    graphic: {
      shape_type: "rounded-box",
      icon_name: "shovel",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#F3F0FF'/><rect x='46' y='18' width='8' height='40' rx='4' fill='#CED4DA'/><path d='M34 56 C34 56 32 82 50 84 C68 82 66 56 66 56 Z' fill='#7950F2'/><rect x='42' y='14' width='16' height='8' rx='3' fill='#5F3DC4'/></svg>"
    }
  },
  {
    id: 14,
    book_code: "Book 7 - b",
    title: "The Frog on the Log",
    theme: "frog",
    emoji: "🐸",
    accent_color: "#40C057",
    target_sounds: ["short-o", "blends"],
    cvc_words: ["frog", "sat", "log", "fog", "dog", "hop", "rock", "jog", "bog", "spot", "hid", "wet"],
    sight_words: ["A", "on", "a", "The", "is", "in", "mossy", "thick", "saw", "green", "did", "to", "Can", "from"],
    sentences: [
      "A frog sat on a mossy log.",
      "The log is in the thick fog.",
      "A dog saw the green frog.",
      "The frog did hop to a rock.",
      "The dog did jog to the bog.",
      "Can the dog spot the frog?",
      "The frog hid from the wet dog."
    ],
    graphic: {
      shape_type: "leaf",
      icon_name: "frog",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#EBFBEE'/><ellipse cx='50' cy='58' rx='26' ry='20' fill='#51CF66'/><circle cx='34' cy='36' r='10' fill='#40C057'/><circle cx='66' cy='36' r='10' fill='#40C057'/><circle cx='34' cy='36' r='4' fill='#2B2D42'/><circle cx='66' cy='36' r='4' fill='#2B2D42'/><path d='M36 60 Q50 72 64 60' stroke='#2F9E44' stroke-width='3' fill='none' stroke-linecap='round'/><ellipse cx='50' cy='62' rx='14' ry='8' fill='#B2F2BB'/></svg>"
    }
  },
  {
    id: 15,
    book_code: "Book 8 - a",
    title: "The Duck in the Truck",
    theme: "truck",
    emoji: "🚚",
    accent_color: "#15AABF",
    target_sounds: ["short-u", "digraph-ck"],
    cvc_words: ["duck", "got", "mud", "truck", "stuck", "muck", "Gus", "can", "red", "rut", "ran", "luck"],
    sight_words: ["A", "in", "a", "The", "is", "pull", "did", "quack", "flutter", "out", "of", "to", "the", "blue", "pond"],
    sentences: [
      "A duck got in a mud truck.",
      "The truck is stuck in the muck.",
      "Gus can pull the red truck.",
      "The duck did quack and flutter.",
      "Gus got the truck out of the rut.",
      "The duck ran to the blue pond.",
      "What luck for the little duck!"
    ],
    graphic: {
      shape_type: "truck-badge",
      icon_name: "truck",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#E3FAFC'/><rect x='16' y='42' width='38' height='26' fill='#22B8CF'/><path d='M54 48 L68 48 L76 58 L76 68 L54 68 Z' fill='#15AABF'/><circle cx='30' cy='72' r='8' fill='#343A40'/><circle cx='30' cy='72' r='3' fill='#F8F9FA'/><circle cx='64' cy='72' r='8' fill='#343A40'/><circle cx='64' cy='72' r='3' fill='#F8F9FA'/></svg>"
    }
  },
  {
    id: 16,
    book_code: "Book 8 - b",
    title: "Max and His Wax Box",
    theme: "box",
    emoji: "📦",
    accent_color: "#E64980",
    target_sounds: ["short-a", "letter-x"],
    cvc_words: ["Max", "has", "box", "wax", "got", "hot", "sun", "can", "fix", "Rex", "dog", "ran", "wet", "off", "fox"],
    sight_words: ["a", "of", "The", "in", "the", "soft", "to", "on", "his", "paws", "wiped", "past"],
    sentences: [
      "Max has a box of wax.",
      "The wax got hot in the sun.",
      "Max can fix the soft wax.",
      "Rex the dog ran to the box.",
      "Rex got wax on his wet paws.",
      "Max wiped the wax off Rex.",
      "The fox ran past the box."
    ],
    graphic: {
      shape_type: "cube",
      icon_name: "open-box",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#FFF0F6'/><polygon points='50,18 78,32 50,46 22,32' fill='#F783AC'/><polygon points='22,32 50,46 50,78 22,64' fill='#E64980'/><polygon points='50,46 78,32 78,64 50,78' fill='#D6336C'/></svg>"
    }
  },
  {
    id: 17,
    book_code: "Book 9 - a",
    title: "The Ship at the Shop",
    theme: "ship",
    emoji: "⛵",
    accent_color: "#1864AB",
    target_sounds: ["digraph-sh"],
    cvc_words: ["ship", "shop", "Josh", "shut", "put", "sack", "fish", "dock", "big", "set"],
    sight_words: ["She", "has", "a", "toy", "The", "is", "at", "door", "in", "swam", "past", "window", "rushed", "down", "to", "sail", "fast"],
    sentences: [
      "She has a toy ship.",
      "The ship is at the toy shop.",
      "Josh shut the shop door.",
      "Josh put the ship in a sack.",
      "A fish swam past the shop window.",
      "Josh rushed down to the dock.",
      "The big ship set sail fast."
    ],
    graphic: {
      shape_type: "circle",
      icon_name: "sailboat",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#E7F5FF'/><path d='M20 66 L80 66 L72 80 L28 80 Z' fill='#1971C2'/><line x1='48' y1='22' x2='48' y2='66' stroke='#343A40' stroke-width='3'/><polygon points='52,24 52,60 76,60' fill='#4DABF7'/><polygon points='44,30 44,60 26,60' fill='#74C0FC'/></svg>"
    }
  },
  {
    id: 18,
    book_code: "Book 9 - b",
    title: "Chad and the Chick",
    theme: "chick",
    emoji: "🐥",
    accent_color: "#F59F00",
    target_sounds: ["digraph-ch"],
    cvc_words: ["Chad", "chip", "chop", "chick", "ran", "get", "saw", "shed", "chin"],
    sight_words: ["has", "a", "and", "The", "to", "grain", "did", "chirp", "by", "patted", "on", "the", "pecked", "lunch", "bunch", "cheered", "for", "fast"],
    sentences: [
      "Chad has a chip and a chop.",
      "A chick ran to get the chip.",
      "Chad saw the chick chop a grain.",
      "The chick did chirp by the shed.",
      "Chad patted the chick on the chin.",
      "The chick pecked a lunch bunch.",
      "Chad cheered for the fast chick."
    ],
    graphic: {
      shape_type: "egg",
      icon_name: "chick",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='22' fill='#FFF9DB'/><ellipse cx='50' cy='56' rx='22' ry='20' fill='#FCC419'/><circle cx='50' cy='36' r='14' fill='#FFD43B'/><polygon points='46,38 36,42 46,46' fill='#F76707'/><circle cx='54' cy='34' r='2.5' fill='#212529'/><path d='M58 56 Q74 54 68 66 Z' fill='#FAB005'/></svg>"
    }
  },
  {
    id: 19,
    book_code: "Book 10 - a",
    title: "Thad and the Moth",
    theme: "moth",
    emoji: "🦋",
    accent_color: "#868E96",
    target_sounds: ["digraph-th"],
    cvc_words: ["Thad", "moth", "thick", "path", "cloth", "with", "thin", "bush"],
    sight_words: ["saw", "a", "The", "was", "on", "threw", "soft", "flew", "wind", "Can", "catch", "the", "sat", "thorny", "let", "rest"],
    sentences: [
      "Thad saw a thick moth.",
      "The moth was on the path.",
      "Thad threw a soft cloth.",
      "The moth flew with the wind.",
      "Can Thad catch the thin moth?",
      "The moth sat on a thorny bush.",
      "Thad let the moth rest."
    ],
    graphic: {
      shape_type: "circle",
      icon_name: "moth",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#F1F3F5'/><ellipse cx='50' cy='52' rx='6' ry='22' fill='#495057'/><path d='M46 44 C20 28 16 66 44 60 Z' fill='#ADB5BD'/><path d='M54 44 C80 28 84 66 56 60 Z' fill='#ADB5BD'/><line x1='48' y1='32' x2='40' y2='20' stroke='#343A40' stroke-width='2'/><line x1='52' y1='32' x2='60' y2='20' stroke='#343A40' stroke-width='2'/></svg>"
    }
  },
  {
    id: 20,
    book_code: "Book 10 - b",
    title: "The Ring for the King",
    theme: "crown-ring",
    emoji: "👑",
    accent_color: "#F08C00",
    target_sounds: ["ending-ng"],
    cvc_words: ["King", "sang", "long", "song", "ring", "wing", "hung"],
    sight_words: ["The", "a", "lost", "gold", "bird", "with", "strong", "flew", "saw", "shining", "Bring", "to", "the", "on", "string", "All", "town"],
    sentences: [
      "The King sang a long song.",
      "The King lost a gold ring.",
      "A bird with a strong wing flew.",
      "The bird saw the shining ring.",
      "Bring the ring to the King!",
      "The King hung the ring on a string.",
      "All the town people sang."
    ],
    graphic: {
      shape_type: "shield",
      icon_name: "crown",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#FFF3BF'/><polygon points='22,66 78,66 82,34 64,48 50,28 36,48 18,34' fill='#FFD43B'/><circle cx='50' cy='28' r='3.5' fill='#E03131'/><circle cx='18' cy='34' r='3.5' fill='#1971C2'/><circle cx='82' cy='34' r='3.5' fill='#1971C2'/><rect x='22' y='66' width='56' height='8' fill='#F59F00'/></svg>"
    }
  },
  {
    id: 21,
    book_code: "Book 11 - a",
    title: "A Crab on the Sand",
    theme: "crab",
    emoji: "🦀",
    accent_color: "#E03131",
    target_sounds: ["initial-blends-cr-cl-fr-gr"],
    cvc_words: ["crab", "sand", "clamp", "snap", "clam", "trap", "Fran", "red", "cap", "ran", "grab", "damp", "sank"],
    sight_words: ["The", "crawled", "on", "wet", "can", "and", "A", "slid", "into", "rock", "dropped", "her", "swim", "gripped", "edge", "under"],
    sentences: [
      "The crab crawled on wet sand.",
      "The crab can clamp and snap.",
      "A clam slid into a rock trap.",
      "Fran dropped her red swim cap.",
      "The crab gripped the cap edge.",
      "Fran ran to grab her damp cap.",
      "The crab sank under the foam."
    ],
    graphic: {
      shape_type: "pill",
      icon_name: "crab",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='22' fill='#FFE3E3'/><ellipse cx='50' cy='56' rx='24' ry='16' fill='#FA5252'/><circle cx='40' cy='42' r='4' fill='#FFFFFF'/><circle cx='40' cy='42' r='2' fill='#212529'/><circle cx='60' cy='42' r='4' fill='#FFFFFF'/><circle cx='60' cy='42' r='2' fill='#212529'/><path d='M28 50 Q16 42 18 30 C28 32 30 42 30 42' fill='#E03131'/><path d='M72 50 Q84 42 82 30 C72 32 70 42 70 42' fill='#E03131'/></svg>"
    }
  },
  {
    id: 22,
    book_code: "Book 11 - b",
    title: "The Frog on the Plum Tree",
    theme: "plum-tree",
    emoji: "🌳",
    accent_color: "#9C36B5",
    target_sounds: ["initial-blends-fr-pr-tr-gr"],
    cvc_words: ["frog", "hid", "trap", "Fred", "mud", "plum", "drop", "mist", "hit", "swim", "crept", "tall", "grass", "twig"],
    sight_words: ["A", "green", "in", "a", "freed", "the", "from", "The", "sprang", "up", "to", "of", "did", "across", "creek", "past", "proud"],
    sentences: [
      "A green frog hid in a trap.",
      "Fred freed the frog from the mud.",
      "The frog sprang up to a plum.",
      "A drop of mist hit Fred.",
      "The frog did swim across the creek.",
      "Fred crept past the tall grass.",
      "The proud frog rested on a twig."
    ],
    graphic: {
      shape_type: "circle",
      icon_name: "plum",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#F3F0FF'/><circle cx='50' cy='56' r='24' fill='#AE3EC9'/><path d='M50 34 Q54 20 64 16' stroke='#5C940D' stroke-width='3' fill='none' stroke-linecap='round'/><ellipse cx='60' cy='22' rx='6' ry='3' fill='#74B816' transform='rotate(-20 60 22)'/></svg>"
    }
  },
  {
    id: 23,
    book_code: "Book 12 - a",
    title: "The Fast Black Bug",
    theme: "beetle",
    emoji: "🪲",
    accent_color: "#212529",
    target_sounds: ["s-blends"],
    cvc_words: ["black", "bug", "ran", "fast", "past", "rock", "slab", "Stan", "snap", "hand", "stick", "crack", "swift", "grass"],
    sight_words: ["A", "the", "crept", "under", "a", "flat", "Can", "slipped", "his", "stepped", "on", "with", "hid", "in"],
    sentences: [
      "A black bug ran fast past the rock.",
      "The bug crept under a flat slab.",
      "Can Stan snap the fast bug?",
      "The bug slipped past his hand.",
      "Stan stepped on a stick.",
      "The stick snapped with a crack.",
      "The swift bug hid in the grass."
    ],
    graphic: {
      shape_type: "square",
      icon_name: "beetle",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#E9ECEF'/><ellipse cx='50' cy='54' rx='20' ry='24' fill='#212529'/><circle cx='50' cy='28' r='10' fill='#343A40'/><line x1='50' y1='34' x2='50' y2='78' stroke='#CED4DA' stroke-width='2'/><circle cx='46' cy='26' r='2' fill='#FFFFFF'/><circle cx='54' cy='26' r='2' fill='#FFFFFF'/></svg>"
    }
  },
  {
    id: 24,
    book_code: "Book 12 - b",
    title: "The Sled on the Hill",
    theme: "sled",
    emoji: "🛷",
    accent_color: "#339AF0",
    target_sounds: ["l-blends-s-blends"],
    cvc_words: ["Brad", "slick", "red", "sled", "hill", "fast", "sped", "big", "cliff", "blast", "wind", "cap", "tree"],
    sight_words: ["has", "a", "The", "can", "slide", "down", "jumped", "onto", "past", "of", "blew", "his", "wool", "stopped", "near", "grinned"],
    sentences: [
      "Brad has a slick red sled.",
      "The sled can slide down the hill.",
      "Brad jumped onto the fast sled.",
      "The sled sped past a big cliff.",
      "A blast of wind blew his wool cap.",
      "The sled stopped near a plum tree.",
      "Brad grinned and climbed the hill."
    ],
    graphic: {
      shape_type: "rounded-box",
      icon_name: "sled",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#E7F5FF'/><path d='M20 68 H74 Q84 68 86 56' fill='none' stroke='#1971C2' stroke-width='4' stroke-linecap='round'/><line x1='28' y1='56' x2='76' y2='56' stroke='#E03131' stroke-width='6' stroke-linecap='round'/><line x1='36' y1='56' x2='36' y2='68' stroke='#495057' stroke-width='3'/><line x1='66' y1='56' x2='66' y2='68' stroke='#495057' stroke-width='3'/></svg>"
    }
  },
  {
    id: 25,
    book_code: "Book 13 - a",
    title: "The Duck and the Muck",
    theme: "duck",
    emoji: "🦆",
    accent_color: "#FFD43B",
    target_sounds: ["ending-ck"],
    cvc_words: ["black", "duck", "rock", "pluck", "twig", "got", "stuck", "thick", "muck", "pack", "pups", "ran", "track", "Gus", "had", "luck", "mud"],
    sight_words: ["A", "was", "on", "a", "The", "took", "at", "in", "of", "down", "the", "and", "long", "He", "pulled", "out", "shook", "off"],
    sentences: [
      "A black duck was on a rock.",
      "The duck took a pluck at a twig.",
      "The duck got stuck in thick muck.",
      "A pack of pups ran down the track.",
      "Gus had luck and got a long stick.",
      "He pulled the duck out of the muck.",
      "The duck shook off the black mud."
    ],
    graphic: {
      shape_type: "circle",
      icon_name: "duck",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#FFF9DB'/><ellipse cx='54' cy='60' rx='22' ry='16' fill='#FCC419'/><circle cx='40' cy='42' r='12' fill='#FFD43B'/><polygon points='34,42 20,46 34,50' fill='#F76707'/><circle cx='42' cy='40' r='2' fill='#212529'/></svg>"
    }
  },
  {
    id: 26,
    book_code: "Book 13 - b",
    title: "A Big Bag of Gum",
    theme: "bubblegum",
    emoji: "🍬",
    accent_color: "#E64980",
    target_sounds: ["short-u", "short-i", "short-o", "short-a"],
    cvc_words: ["bus", "fun", "gum", "tub", "Pim", "big", "Tom", "got", "bag", "Pat"],
    sight_words: ["is", "on", "the", "It", "and", "a", "of", "in"],
    sentences: [
      "Pim is on the bus.",
      "Tom got on the bus.",
      "The bus is fun! It is fun on the bus.",
      "Pim and Tom got a big bag of gum.",
      "Pat got in the bag! Pat!",
      "Pat got in the big tub."
    ],
    graphic: {
      shape_type: "rectangle",
      icon_name: "bag-of-gum",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#FFF0F6'/><rect x='28' y='36' width='44' height='50' rx='10' fill='#F783AC'/><path d='M38 36 V26 C38 20 62 20 62 26 V36' fill='none' stroke='#D6336C' stroke-width='4'/><circle cx='50' cy='54' r='8' fill='#FF8787'/><circle cx='42' cy='68' r='6' fill='#4DABF7'/><circle cx='58' cy='68' r='6' fill='#69DB7C'/></svg>"
    }
  },
  {
    id: 27,
    book_code: "Book 13 - c",
    title: "The Red Fox Run",
    theme: "running-fox",
    emoji: "🦊",
    accent_color: "#F76707",
    target_sounds: ["short-o", "short-u", "short-e", "short-a", "short-i"],
    cvc_words: ["fox", "log", "bug", "hop", "run", "dog", "red", "mud", "sat", "big"],
    sight_words: ["the", "is", "on", "a", "got", "did", "and", "saw", "Can", "to", "not", "in"],
    sentences: [
      "The fox is on the log.",
      "A bug got on the fox.",
      "The fox did hop and run.",
      "The dog saw the red fox.",
      "Can the fox run to the mud?",
      "The dog is not in the mud.",
      "The fox sat on a big log."
    ],
    graphic: {
      shape_type: "circle",
      icon_name: "fox-head",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#FFF4E6'/><polygon points='24,28 38,48 20,52' fill='#D9480F'/><polygon points='76,28 62,48 80,52' fill='#D9480F'/><polygon points='24,48 76,48 50,80' fill='#F76707'/><polygon points='36,60 64,60 50,80' fill='#FFFFFF'/><circle cx='50' cy='74' r='3' fill='#212529'/></svg>"
    }
  },
  {
    id: 28,
    book_code: "Book 14 - a",
    title: "A Fat Cat on a Mat",
    theme: "fat-cat",
    emoji: "🐱",
    accent_color: "#FA5252",
    target_sounds: ["short-a", "short-i"],
    cvc_words: ["Sam", "fat", "cat", "sat", "mat", "rat", "ran", "can", "tin"],
    sight_words: ["has", "a", "The", "on", "to", "see", "the", "in", "got", "is", "back"],
    sentences: [
      "Sam has a fat cat.",
      "The cat sat on a mat.",
      "A rat ran to the cat.",
      "The fat cat can see the rat.",
      "The rat ran in a tin can.",
      "Sam got the fat cat.",
      "The cat is back on the mat."
    ],
    graphic: {
      shape_type: "rounded-box",
      icon_name: "cat-face",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#FFE3E3'/><circle cx='50' cy='55' r='28' fill='#FF8787'/><polygon points='26,34 38,44 26,48' fill='#FA5252'/><polygon points='74,34 62,44 74,48' fill='#FA5252'/><circle cx='42' cy='52' r='3' fill='#212529'/><circle cx='58' cy='52' r='3' fill='#212529'/><ellipse cx='50' cy='62' rx='4' ry='3' fill='#C92A2A'/><rect x='16' y='84' width='68' height='6' rx='3' fill='#E03131'/></svg>"
    }
  },
  {
    id: 29,
    book_code: "Book 14 - b",
    title: "The Hot Pot",
    theme: "hot-pot",
    emoji: "🍲",
    accent_color: "#FD7E14",
    target_sounds: ["short-o", "short-a", "short-u"],
    cvc_words: ["Mom", "pot", "top", "hot", "Bob", "tap", "pan", "mop", "rug", "sit"],
    sight_words: ["got", "a", "big", "The", "is", "on", "the", "has", "cannot", "Pop", "it", "in", "put", "wet", "and", "by"],
    sentences: [
      "Mom got a big pot.",
      "The pot is on the top.",
      "The hot pot has a top.",
      "Bob cannot tap the hot pot.",
      "Pop it in the pan, Mom.",
      "Mom put a mop on the wet rug.",
      "Bob and Mom sit by the pot."
    ],
    graphic: {
      shape_type: "diamond",
      icon_name: "cooking-pot",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#FFF4E6'/><path d='M26 44 H74 L68 76 C68 80 32 80 32 76 Z' fill='#F76707'/><rect x='22' y='38' width='56' height='6' rx='3' fill='#D9480F'/><circle cx='50' cy='32' r='4' fill='#495057'/><path d='M44 26 Q40 16 46 10' stroke='#FA5252' stroke-width='2' fill='none'/><path d='M56 26 Q52 16 58 10' stroke='#FA5252' stroke-width='2' fill='none'/></svg>"
    }
  },
  {
    id: 30,
    book_code: "Book 15 - a",
    title: "The Wet Pet",
    theme: "pet-tub",
    emoji: "🛁",
    accent_color: "#20C997",
    target_sounds: ["short-e", "short-u"],
    cvc_words: ["Ben", "wet", "pet", "red", "hen", "tub", "Ned", "met", "fed", "bed"],
    sight_words: ["has", "a", "The", "is", "got", "in", "the", "and", "ran", "to", "warm", "Now", "not"],
    sentences: [
      "Ben has a wet pet.",
      "The pet is a red hen.",
      "The hen got wet in the tub.",
      "Ned met Ben and the hen.",
      "Ben fed the wet hen.",
      "The hen ran to a warm bed.",
      "Now the pet is not wet."
    ],
    graphic: {
      shape_type: "oval",
      icon_name: "bathtub",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#E6FCF5'/><path d='M18 52 H82 V64 C82 76 18 76 18 64 Z' fill='#38D9A9'/><circle cx='50' cy='42' r='10' fill='#FF6B6B'/><line x1='24' y1='76' x2='20' y2='84' stroke='#0CA678' stroke-width='3'/><line x1='76' y1='76' x2='80' y2='84' stroke='#0CA678' stroke-width='3'/></svg>"
    }
  },
  {
    id: 31,
    book_code: "Book 15 - b",
    title: "Pup in the Mud",
    theme: "muddy-paw",
    emoji: "🐾",
    accent_color: "#D9480F",
    target_sounds: ["short-u", "short-a", "short-i"],
    cvc_words: ["Gus", "pup", "dug", "pit", "mud", "hug", "Pam", "cup", "tub"],
    sight_words: ["the", "a", "got", "in", "Look", "at", "ran", "to", "has", "for", "Put", "is", "clean"],
    sentences: [
      "Gus the pup dug a pit.",
      "The pup got in the mud.",
      "Look at the pup in the mud!",
      "Gus ran to hug Pam.",
      "Pam has a cup for the pup.",
      "Put the mud pup in the tub.",
      "The pup is clean in the tub."
    ],
    graphic: {
      shape_type: "shield",
      icon_name: "paw",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#FFF4E6'/><ellipse cx='50' cy='62' rx='16' ry='12' fill='#A61E4D'/><circle cx='32' cy='46' r='6' fill='#A61E4D'/><circle cx='44' cy='38' r='6' fill='#A61E4D'/><circle cx='56' cy='38' r='6' fill='#A61E4D'/><circle cx='68' cy='46' r='6' fill='#A61E4D'/></svg>"
    }
  },
  {
    id: 32,
    book_code: "Book 16 - a",
    title: "A Pin in the Bin",
    theme: "bin",
    emoji: "🗑️",
    accent_color: "#4C6EF5",
    target_sounds: ["short-i", "short-e", "short-u"],
    cvc_words: ["Tim", "big", "tin", "bin", "pin", "win", "get", "did", "dig", "tip", "sit", "sip", "cup"],
    sight_words: ["has", "a", "fell", "in", "the", "Can", "and", "The", "is", "at", "got", "out", "his"],
    sentences: [
      "Tim has a big tin bin.",
      "A pin fell in the bin.",
      "Can Tim win and get the pin?",
      "Tim did dig in the bin.",
      "The pin is at the tip.",
      "Tim got the big pin out.",
      "Tim did sit and sip his cup."
    ],
    graphic: {
      shape_type: "cylinder",
      icon_name: "metal-bin",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#EDF2FF'/><path d='M30 40 L34 80 H66 L70 40 Z' fill='#748FFC'/><ellipse cx='50' cy='40' rx='20' ry='6' fill='#4C6EF5'/><line x1='50' y1='48' x2='50' y2='74' stroke='#364FC7' stroke-width='2'/></svg>"
    }
  },
  {
    id: 33,
    book_code: "Book 16 - b",
    title: "The Big Red Jet",
    theme: "airplane",
    emoji: "✈️",
    accent_color: "#E03131",
    target_sounds: ["short-e", "short-a", "short-o", "short-u"],
    cvc_words: ["Dan", "can", "red", "jet", "big", "fog", "man", "sat", "zip", "ran", "pad", "sun", "net"],
    sight_words: ["see", "a", "The", "is", "in", "the", "A", "and", "fly", "high", "to", "up", "on", "did", "land"],
    sentences: [
      "Dan can see a red jet.",
      "The big jet is in the fog.",
      "A man sat in the big jet.",
      "The jet can zip and fly high.",
      "Dan ran to the jet pad.",
      "The sun is up on the jet.",
      "The jet did land on the net."
    ],
    graphic: {
      shape_type: "triangle-badge",
      icon_name: "jet",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#FFE3E3'/><path d='M50 16 L58 48 L84 62 L58 64 L56 80 L44 80 L42 64 L16 62 L42 48 Z' fill='#E03131'/><circle cx='50' cy='36' r='3' fill='#FFFFFF'/></svg>"
    }
  },
  {
    id: 34,
    book_code: "Book 17 - a",
    title: "The Pig in the Pit",
    theme: "pit-pig",
    emoji: "🐷",
    accent_color: "#E64980",
    target_sounds: ["short-i", "short-a", "short-u"],
    cvc_words: ["Pip", "pig", "fat", "ran", "big", "pit", "hop", "sat", "mud", "Jim", "rip", "cap", "tug", "sad"],
    sight_words: ["the", "is", "into", "a", "Can", "out", "of", "No", "in", "got", "his", "did", "up", "and", "are", "not"],
    sentences: [
      "Pip the pig is fat.",
      "Pip ran into a big pit.",
      "Can Pip hop out of the pit?",
      "No, Pip sat in the pit mud.",
      "Jim got a big rip in his cap.",
      "Jim did tug Pip up.",
      "Pip and Jim are not sad."
    ],
    graphic: {
      shape_type: "rounded-box",
      icon_name: "pig-in-hole",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#FFF0F6'/><ellipse cx='50' cy='74' rx='34' ry='12' fill='#862E9C'/><circle cx='50' cy='50' r='20' fill='#F783AC'/><ellipse cx='50' cy='54' rx='7' ry='5' fill='#FFDEEB'/><circle cx='44' cy='46' r='2' fill='#212529'/><circle cx='56' cy='46' r='2' fill='#212529'/></svg>"
    }
  },
  {
    id: 35,
    book_code: "Book 17 - b",
    title: "A Bug on a Rug",
    theme: "carpet-rug",
    emoji: "🪲",
    accent_color: "#12B886",
    target_sounds: ["short-u", "short-a", "short-e", "short-o"],
    cvc_words: ["fat", "bug", "rug", "cat", "run", "hid", "cup", "tug", "drop", "hop", "bed", "hen", "mud"],
    sight_words: ["A", "is", "on", "the", "saw", "under", "a", "Tug", "do", "not", "it", "did", "pecked", "at", "ran", "into"],
    sentences: [
      "A fat bug is on the rug.",
      "The cat saw the bug run.",
      "The bug hid under a cup.",
      "Tug the cup, do not drop it.",
      "The bug did hop on the bed.",
      "A hen pecked at the bug.",
      "The bug ran into the mud."
    ],
    graphic: {
      shape_type: "rectangle",
      icon_name: "rug",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#E6FCF5'/><rect x='18' y='32' width='64' height='36' rx='4' fill='#20C997'/><rect x='24' y='38' width='52' height='24' fill='#63E6BE'/><circle cx='50' cy='50' r='6' fill='#099268'/></svg>"
    }
  },
  {
    id: 36,
    book_code: "Book 18 - a",
    title: "The Brave Brave Knight",
    theme: "shield-knight",
    emoji: "🛡️",
    accent_color: "#495057",
    target_sounds: ["long-i-igh"],
    cvc_words: ["held", "dark", "lit", "path"],
    sight_words: ["The", "knight", "saw", "a", "bright", "light", "his", "shield", "tight", "He", "walked", "into", "the", "night", "high", "might"],
    sentences: [
      "The knight saw a bright light.",
      "The knight held his shield tight.",
      "He walked into the dark night.",
      "A high fire lit up the path.",
      "The knight showed his great might.",
      "He saw a deer take swift flight.",
      "The dark night was calm and right."
    ],
    graphic: {
      shape_type: "shield",
      icon_name: "knight-shield",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#F1F3F5'/><path d='M26 24 H74 V54 C74 72 50 82 50 82 C50 82 26 72 26 54 Z' fill='#868E96'/><path d='M50 24 V82 M26 48 H74' stroke='#F8F9FA' stroke-width='4'/></svg>"
    }
  },
  {
    id: 37,
    book_code: "Book 18 - b",
    title: "The Train in the Rain",
    theme: "train",
    emoji: "🚂",
    accent_color: "#1C7ED6",
    target_sounds: ["long-a-ai"],
    cvc_words: ["long", "went", "held", "flat", "sun", "off"],
    sight_words: ["A", "train", "drove", "in", "the", "rain", "The", "down", "main", "rail", "tapped", "on", "conductor", "waited", "chain"],
    sentences: [
      "A long train drove in the rain.",
      "The train went down the main rail.",
      "The rain tapped on the train.",
      "The conductor waited with pain.",
      "He held onto the metal chain.",
      "The train reached the flat plain.",
      "The bright sun drove off the rain."
    ],
    graphic: {
      shape_type: "capsule",
      icon_name: "train-engine",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#E7F5FF'/><rect x='20' y='46' width='44' height='24' fill='#1971C2'/><path d='M64 36 H78 V70 H64 Z' fill='#1864AB'/><rect x='28' y='34' width='8' height='12' fill='#495057'/><circle cx='32' cy='74' r='6' fill='#343A40'/><circle cx='52' cy='74' r='6' fill='#343A40'/><circle cx='72' cy='74' r='6' fill='#343A40'/></svg>"
    }
  },
  {
    id: 38,
    book_code: "Book 19 - a",
    title: "The Boat on the Coast",
    theme: "boat",
    emoji: "⛵",
    accent_color: "#228BE6",
    target_sounds: ["long-o-oa"],
    cvc_words: ["small", "left", "Tom", "post", "past", "rock", "gull", "sat"],
    sight_words: ["The", "boat", "coast", "ate", "a", "warm", "slice", "of", "toast", "made", "cheerful", "boast", "sign", "was", "most"],
    sentences: [
      "The small boat left the coast.",
      "Tom ate a warm slice of toast.",
      "Tom made a cheerful boat boast.",
      "A tall wooden sign was a post.",
      "The boat floated past the rock coast.",
      "Tom saw what he liked the most.",
      "A white gull sat on the post."
    ],
    graphic: {
      shape_type: "water-drop",
      icon_name: "boat",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#E7F5FF'/><path d='M22 62 H78 L70 76 H30 Z' fill='#FD7E14'/><polygon points='48,22 48,56 72,56' fill='#4DABF7'/><line x1='48' y1='20' x2='48' y2='58' stroke='#212529' stroke-width='2'/></svg>"
    }
  },
  {
    id: 39,
    book_code: "Book 19 - b",
    title: "The Sweet Green Tree",
    theme: "tree",
    emoji: "🌳",
    accent_color: "#2B8A3E",
    target_sounds: ["long-e-ee"],
    cvc_words: ["Lee", "fell", "deep"],
    sight_words: ["planted", "a", "green", "seed", "The", "grew", "into", "tree", "buzzing", "bee", "flew", "to", "the", "sheep", "sweet"],
    sentences: [
      "Lee planted a green seed.",
      "The seed grew into a green tree.",
      "A buzzing bee flew to the tree.",
      "Lee knelt down on both knees.",
      "He saw three sheep under the tree.",
      "The sheep were sweet and meek.",
      "Lee fell into a deep sleep."
    ],
    graphic: {
      shape_type: "circle",
      icon_name: "tree",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#EBFBEE'/><rect x='44' y='56' width='12' height='26' fill='#862E9C'/><circle cx='50' cy='42' r='24' fill='#40C057'/><circle cx='38' cy='46' r='14' fill='#2F9E44'/><circle cx='62' cy='46' r='14' fill='#2F9E44'/></svg>"
    }
  },
  {
    id: 40,
    book_code: "Book 20 - a",
    title: "The Blue Moon Night",
    theme: "moon",
    emoji: "🌙",
    accent_color: "#364FC7",
    target_sounds: ["vowel-digraph-oo"],
    cvc_words: ["felt", "Tim", "noon", "room"],
    sight_words: ["A", "full", "moon", "shone", "in", "the", "pool", "The", "night", "air", "very", "cool", "spoon", "baboon", "broom", "soon"],
    sentences: [
      "A full moon shone in the pool.",
      "The night air felt very cool.",
      "Tim took his wooden spoon.",
      "He ate dinner at noon.",
      "A silly baboon hopped in a room.",
      "The broom swept up the dust soon.",
      "They sang a happy tune to the moon."
    ],
    graphic: {
      shape_type: "circle",
      icon_name: "crescent-moon",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#EDF2FF'/><path d='M62 22 C40 22 26 40 26 60 C26 74 34 84 46 88 C34 82 32 60 44 44 C52 32 64 28 68 28 Z' fill='#FAB005'/><polygon points='72,28 74,32 78,32 75,34 76,38 72,35 68,38 70,34 66,32 70,32' fill='#FFD43B'/></svg>"
    }
  },
  {
    id: 41,
    book_code: "Book 20 - b",
    title: "A Clue for the Glue",
    theme: "glue-bottle",
    emoji: "🧴",
    accent_color: "#1098AD",
    target_sounds: ["vowel-teams-ue-ew"],
    cvc_words: ["had", "jar", "too", "new"],
    sight_words: ["Sue", "a", "of", "blue", "glue", "She", "lost", "her", "clue", "notebook", "shoe", "breeze", "blew", "crew", "drew"],
    sentences: [
      "Sue had a jar of blue glue.",
      "She lost her clue notebook too.",
      "The glue dripped on her blue shoe.",
      "A gentle breeze softly blew.",
      "Sue found a clue in the crew.",
      "She drew a bright picture too.",
      "The blue glue dried brand new."
    ],
    graphic: {
      shape_type: "squircle",
      icon_name: "glue",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#E3FAFC'/><polygon points='45,16 55,16 58,32 42,32' fill='#FA5252'/><rect x='32' y='32' width='36' height='50' rx='6' fill='#15AABF'/><rect x='38' y='46' width='24' height='22' rx='2' fill='#FFFFFF'/></svg>"
    }
  },
  {
    id: 42,
    book_code: "Book 21 - a",
    title: "The Brown Cow in Town",
    theme: "cow",
    emoji: "🐮",
    accent_color: "#7950F2",
    target_sounds: ["diphthong-ow-ou"],
    cvc_words: ["sad", "had", "his"],
    sight_words: ["A", "brown", "cow", "walked", "into", "town", "The", "silly", "wore", "a", "gold", "crown", "around", "down", "clown", "frown"],
    sentences: [
      "A brown cow walked into town.",
      "The silly cow wore a gold crown.",
      "She looked all around the town.",
      "The cow walked up and down.",
      "A sad clown had a deep frown.",
      "The clown saw the cow fall down.",
      "The clown cheered and lost his frown."
    ],
    graphic: {
      shape_type: "rounded-box",
      icon_name: "cow-face",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#F3F0FF'/><circle cx='50' cy='50' r='24' fill='#CED4DA'/><ellipse cx='26' cy='38' rx='8' ry='4' fill='#868E96'/><ellipse cx='74' cy='38' rx='8' ry='4' fill='#868E96'/><ellipse cx='50' cy='58' rx='14' ry='10' fill='#FCC2D7'/><circle cx='44' cy='58' r='2' fill='#495057'/><circle cx='56' cy='58' r='2' fill='#495057'/><polygon points='40,24 50,18 60,24' fill='#FAB005'/></svg>"
    }
  },
  {
    id: 43,
    book_code: "Book 21 - b",
    title: "Roy and His Joyful Toy",
    theme: "toy",
    emoji: "🧸",
    accent_color: "#FF922B",
    target_sounds: ["diphthong-oi-oy"],
    cvc_words: ["Roy", "boy", "got", "toy", "him", "joy", "soil"],
    sight_words: ["was", "a", "young", "cheerful", "bright", "shiny", "The", "jumping", "brought", "showed", "destroy", "dropped", "foil"],
    sentences: [
      "Roy was a young cheerful boy.",
      "Roy got a bright shiny toy.",
      "The jumping toy brought him joy.",
      "Roy showed the toy to Troy.",
      "Troy did not want to destroy the toy.",
      "They dropped the toy in moist soil.",
      "Roy wiped off the dirt and foil."
    ],
    graphic: {
      shape_type: "star",
      icon_name: "spinning-top",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#FFF4E6'/><polygon points='50,22 78,50 50,78 22,50' fill='#FF922B'/><line x1='50' y1='14' x2='50' y2='86' stroke='#E8590C' stroke-width='4' stroke-linecap='round'/><circle cx='50' cy='50' r='8' fill='#FFD43B'/></svg>"
    }
  },
  {
    id: 44,
    book_code: "Book 22 - a",
    title: "The Hawk on the Lawn",
    theme: "hawk",
    emoji: "🦅",
    accent_color: "#E8590C",
    target_sounds: ["vowel-teams-au-aw"],
    cvc_words: ["hawk", "claw", "fawn"],
    sight_words: ["Paul", "woke", "up", "early", "at", "dawn", "He", "saw", "a", "brown", "lawn", "sharp", "awe", "straw", "flew"],
    sentences: [
      "Paul woke up early at dawn.",
      "He saw a brown hawk on the lawn.",
      "The hawk had a sharp claw.",
      "Paul drew the hawk with awe.",
      "The hawk pecked at a piece of straw.",
      "A small fawn ran on the lawn.",
      "The hawk flew up into the dawn."
    ],
    graphic: {
      shape_type: "badge",
      icon_name: "hawk-head",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#FFF4E6'/><circle cx='46' cy='46' r='20' fill='#D9480F'/><path d='M58 42 Q78 44 68 56 Z' fill='#FAB005'/><circle cx='48' cy='40' r='3' fill='#FFFFFF'/><circle cx='48' cy='40' r='1.5' fill='#212529'/></svg>"
    }
  },
  {
    id: 45,
    book_code: "Book 22 - b",
    title: "The Girl with the Pearl",
    theme: "pearl-shell",
    emoji: "🦪",
    accent_color: "#CC5DE8",
    target_sounds: ["r-controlled-ir-er-ur"],
    cvc_words: ["girl", "dirt", "bird", "fern", "turn"],
    sight_words: ["A", "wore", "a", "shiny", "skirt", "She", "want", "sit", "chirped", "pecked", "held", "white", "pearl", "sang"],
    sentences: [
      "A girl wore a shiny skirt.",
      "She did not want to sit in dirt.",
      "A brown bird chirped a chirp.",
      "The bird pecked near a green fern.",
      "The girl saw the little bird turn.",
      "She held a shiny white pearl.",
      "The bird sang to the nice girl."
    ],
    graphic: {
      shape_type: "shell",
      icon_name: "pearl",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#F8F0FC'/><path d='M20 62 C20 38 40 26 50 26 C60 26 80 38 80 62 C80 76 60 76 50 76 C40 76 20 76 20 62 Z' fill='#E599F7'/><circle cx='50' cy='58' r='10' fill='#FFFFFF' stroke='#CED4DA' stroke-width='1.5'/></svg>"
    }
  },
  {
    id: 46,
    book_code: "Book 23 - a",
    title: "Mark in the Park",
    theme: "park-tree",
    emoji: "🏞️",
    accent_color: "#20C997",
    target_sounds: ["r-controlled-ar"],
    cvc_words: ["Mark", "car", "far", "park", "bark", "dark", "lark", "yard", "art", "star"],
    sight_words: ["drove", "his", "red", "He", "parked", "the", "at", "saw", "a", "dog", "chart", "card", "walked", "star"],
    sentences: [
      "Mark drove his red car far.",
      "He parked the car at the park.",
      "Mark saw a dog bark in the dark.",
      "A bird flew high like a lark.",
      "Mark drew a chart on a card.",
      "He walked past a yard with art.",
      "A shining star lit up the park."
    ],
    graphic: {
      shape_type: "rounded-box",
      icon_name: "bench-park",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#E6FCF5'/><rect x='24' y='52' width='52' height='8' rx='2' fill='#099268'/><line x1='30' y1='60' x2='30' y2='74' stroke='#087F5B' stroke-width='4'/><line x1='70' y1='60' x2='70' y2='74' stroke='#087F5B' stroke-width='4'/><path d='M26 40 H74' stroke='#099268' stroke-width='4' stroke-linecap='round'/></svg>"
    }
  },
  {
    id: 47,
    book_code: "Book 23 - b",
    title: "The Storm at the Fort",
    theme: "storm-lightning",
    emoji: "⚡",
    accent_color: "#5C7CFA",
    target_sounds: ["r-controlled-or"],
    cvc_words: ["big", "fort", "port", "morn"],
    sight_words: ["A", "dark", "storm", "was", "born", "The", "wind", "blew", "corn", "soldier", "brass", "horn", "inside", "safety"],
    sentences: [
      "A big dark storm was born.",
      "The wind blew through tall corn.",
      "A soldier blew a brass horn.",
      "He ran inside the safety of the fort.",
      "The wild wind tore his coat short.",
      "He looked out at the ocean port.",
      "By early morn, the storm was gone."
    ],
    graphic: {
      shape_type: "hexagon",
      icon_name: "lightning-cloud",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><polygon points='50,6 88,28 88,72 50,94 12,72 12,28' fill='#EDF2FF'/><path d='M32 46 A10 10 0 0 1 50 36 A14 14 0 0 1 72 44 A10 10 0 0 1 68 58 H32 A8 8 0 0 1 32 46 Z' fill='#4C6EF5'/><polygon points='48,58 40,68 48,68 44,78 58,64 50,64' fill='#FFD43B'/></svg>"
    }
  },
  {
    id: 48,
    book_code: "Book 24 - a",
    title: "The Wise Old Mole",
    theme: "mole",
    emoji: "🦔",
    accent_color: "#868E96",
    target_sounds: ["magic-e-o_e"],
    cvc_words: ["knot", "ate"],
    sight_words: ["A", "wise", "mole", "lived", "in", "a", "hole", "He", "wore", "long", "warm", "robe", "steep", "slope", "globe", "note"],
    sentences: [
      "A wise mole lived in a hole.",
      "He wore a long warm robe.",
      "The mole walked up a steep slope.",
      "He tied a knot in a thick rope.",
      "The mole looked at the globe.",
      "He wrote a sweet cheerful note.",
      "He ate breakfast on the slope."
    ],
    graphic: {
      shape_type: "circle",
      icon_name: "mole",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><circle cx='50' cy='50' r='45' fill='#F1F3F5'/><ellipse cx='50' cy='56' rx='22' ry='20' fill='#495057'/><ellipse cx='50' cy='52' rx='6' ry='4' fill='#FFA8A8'/><circle cx='40' cy='44' r='2' fill='#212529'/><circle cx='60' cy='44' r='2' fill='#212529'/><path d='M30 68 Q50 80 70 68' fill='#868E96'/></svg>"
    }
  },
  {
    id: 49,
    book_code: "Book 24 - b",
    title: "A Fine Bike Ride",
    theme: "bicycle",
    emoji: "🚲",
    accent_color: "#0CA678",
    target_sounds: ["magic-e-i_e"],
    cvc_words: ["hit", "day"],
    sight_words: ["Mike", "has", "a", "fine", "shiny", "bike", "went", "on", "hike", "He", "rode", "smile", "rested", "sunny"],
    sentences: [
      "Mike has a fine shiny bike.",
      "Mike went on a five-mile hike.",
      "He rode his bike past a pike.",
      "A gentle wave hit the dike.",
      "Mike gave a warm smile.",
      "He rested by the road for a while.",
      "It was a fine sunny day for Mike."
    ],
    graphic: {
      shape_type: "diamond",
      icon_name: "bike",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#E6FCF5'/><circle cx='32' cy='62' r='12' fill='none' stroke='#099268' stroke-width='4'/><circle cx='68' cy='62' r='12' fill='none' stroke='#099268' stroke-width='4'/><polygon points='32,62 46,62 58,46 44,46' fill='none' stroke='#20C997' stroke-width='3'/><path d='M58 46 L68 62' stroke='#20C997' stroke-width='3'/></svg>"
    }
  },
  {
    id: 50,
    book_code: "Book 25 - a",
    title: "Bake a Cake for Kate",
    theme: "birthday-cake",
    emoji: "🎂",
    accent_color: "#F06595",
    target_sounds: ["magic-e-a_e"],
    cvc_words: ["not", "duck", "swim", "sat"],
    sight_words: ["Kate", "stood", "by", "the", "gate", "She", "wanted", "bake", "sweet", "cake", "lake", "Dave", "rake", "taste"],
    sentences: [
      "Kate stood by the garden gate.",
      "She wanted to bake a sweet cake.",
      "Kate put the cake by the lake.",
      "She made sure it was not late.",
      "Dave brought Kate a garden rake.",
      "They saw a duck swim in the lake.",
      "They sat down to taste the cake."
    ],
    graphic: {
      shape_type: "square",
      icon_name: "cake",
      svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect x='8' y='8' width='84' height='84' rx='20' fill='#FFF0F6'/><rect x='24' y='52' width='52' height='24' rx='4' fill='#FCC2D7'/><rect x='30' y='38' width='40' height='14' rx='3' fill='#F783AC'/><line x1='50' y1='38' x2='50' y2='26' stroke='#FAB005' stroke-width='3'/><circle cx='50' cy='22' r='3' fill='#FF922B'/></svg>"
    }
  }
];

export const getKgBook = (idOrN) => {
  const idx = ((idOrN - 1) % KG_DECODABLE_BOOKS.length + KG_DECODABLE_BOOKS.length) % KG_DECODABLE_BOOKS.length;
  return KG_DECODABLE_BOOKS[idx];
};
