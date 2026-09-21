const lessonData = [
    // ==========================================
    // ANTONYMS (Opposites)
    // ==========================================
    {
        title: "Opposites: Set 1",
        instr: "Pick the word that means the OPPOSITE.",
        qs: [
            { q: "The tea is <u>hot</u>.", opts: ["warm", "cold", "red", "wet"], c: 1 },
            { q: "The box is <u>open</u>.", opts: ["closed", "big", "empty", "fun"], c: 0 },
            { q: "Run <u>fast</u>.", opts: ["quick", "slow", "jump", "walk"], c: 1 },
            { q: "I am <u>happy</u>.", opts: ["glad", "smile", "sad", "play"], c: 2 },
            { q: "Go <u>up</u> the hill.", opts: ["top", "down", "climb", "side"], c: 1 },
            { q: "My shirt is <u>wet</u>.", opts: ["soaked", "blue", "dry", "clean"], c: 2 },
            { q: "The room is <u>dark</u>.", opts: ["night", "black", "light", "scary"], c: 2 },
            { q: "That is <u>good</u>.", opts: ["bad", "nice", "fun", "cool"], c: 0 }
        ]
    },
    {
        title: "Opposites: Set 2",
        instr: "Pick the word that means the OPPOSITE.",
        qs: [
            { q: "It is very <u>quiet</u>.", opts: ["loud", "soft", "sleep", "shhh"], c: 0 },
            { q: "The rock is <u>hard</u>.", opts: ["stone", "soft", "gray", "big"], c: 1 },
            { q: "Come <u>in</u>.", opts: ["inside", "door", "out", "home"], c: 2 },
            { q: "Turn <u>left</u>.", opts: ["west", "map", "right", "car"], c: 2 },
            { q: "She is <u>awake</u>.", opts: ["up", "asleep", "tired", "bed"], c: 1 },
            { q: "The bag is <u>heavy</u>.", opts: ["big", "light", "full", "carry"], c: 1 },
            { q: "The glass is <u>full</u>.", opts: ["water", "drink", "empty", "cup"], c: 2 },
            { q: "Please <u>stop</u>.", opts: ["go", "wait", "halt", "red"], c: 0 }
        ]
    },
    {
        title: "Opposites: Set 3",
        instr: "Pick the word that means the OPPOSITE.",
        qs: [
            { q: "My shoes are <u>new</u>.", opts: ["shiny", "old", "blue", "cool"], c: 1 },
            { q: "It is <u>day</u> time.", opts: ["sun", "light", "morning", "night"], c: 3 },
            { q: "Don't <u>push</u>.", opts: ["shove", "pull", "move", "stand"], c: 1 },
            { q: "He is <u>tall</u>.", opts: ["big", "high", "short", "long"], c: 2 },
            { q: "I did <u>win</u>!", opts: ["lose", "play", "game", "first"], c: 0 },
            { q: "My hands are <u>clean</u>.", opts: ["soap", "wash", "dirty", "dry"], c: 2 },
            { q: "Start at the <u>front</u>.", opts: ["face", "back", "side", "head"], c: 1 },
            { q: "The answer is <u>wrong</u>.", opts: ["bad", "right", "no", "false"], c: 1 }
        ]
    },

    // ==========================================
    // SYNONYMS (Same Meaning)
    // ==========================================
    {
        title: "Synonyms: Set 1",
        instr: "Pick the word that means the SAME.",
        qs: [
            { q: "A <u>gift</u> for you.", opts: ["box", "present", "toy", "card"], c: 1 },
            { q: "Please <u>shut</u> the door.", opts: ["open", "close", "lock", "knock"], c: 1 },
            { q: "The bunny is <u>small</u>.", opts: ["big", "little", "soft", "pet"], c: 1 },
            { q: "I am <u>glad</u>.", opts: ["mad", "sad", "happy", "crying"], c: 2 },
            { q: "Don't <u>yell</u>.", opts: ["whisper", "shout", "talk", "sing"], c: 1 },
            { q: "Look at the <u>road</u>.", opts: ["street", "car", "grass", "walk"], c: 0 },
            { q: "Throw the <u>stone</u>.", opts: ["ball", "rock", "stick", "sand"], c: 1 },
            { q: "Keep it <u>tidy</u>.", opts: ["messy", "clean", "dirty", "dusty"], c: 1 }
        ]
    },
    {
        title: "Synonyms: Set 2",
        instr: "Pick the word that means the SAME.",
        qs: [
            { q: "Start the <u>car</u>.", opts: ["bike", "auto", "bus", "plane"], c: 1 },
            { q: "It is <u>chilly</u> outside.", opts: ["hot", "warm", "sunny", "cold"], c: 3 },
            { q: "She is <u>smart</u>.", opts: ["silly", "clever", "funny", "tall"], c: 1 },
            { q: "I <u>enjoy</u> reading.", opts: ["like", "hate", "stop", "cook"], c: 0 },
            { q: "He ran <u>quick</u>.", opts: ["slow", "fast", "walk", "jump"], c: 1 },
            { q: "The test was <u>simple</u>.", opts: ["hard", "easy", "long", "bad"], c: 1 },
            { q: "I made a <u>mistake</u>.", opts: ["error", "cake", "fix", "good"], c: 0 },
            { q: "He is my <u>pal</u>.", opts: ["enemy", "pet", "friend", "dad"], c: 2 }
        ]
    },
    {
        title: "Synonyms: Set 3",
        instr: "Pick the word that means the SAME.",
        qs: [
            { q: "Put it in the <u>sack</u>.", opts: ["bag", "box", "cup", "floor"], c: 0 },
            { q: "I want to <u>nap</u>.", opts: ["run", "sleep", "eat", "play"], c: 1 },
            { q: "The story is <u>true</u>.", opts: ["real", "fake", "long", "book"], c: 0 },
            { q: "Can you <u>help</u> me?", opts: ["stop", "assist", "look", "go"], c: 1 },
            { q: "The rug is <u>large</u>.", opts: ["small", "tiny", "big", "soft"], c: 2 },
            { q: "Don't <u>drop</u> it.", opts: ["fall", "hold", "keep", "catch"], c: 0 },
            { q: "I feel <u>sick</u>.", opts: ["good", "ill", "happy", "fine"], c: 1 },
            { q: "Take a <u>seat</u>.", opts: ["stand", "chair", "table", "floor"], c: 1 }
        ]
    },

    // ==========================================
    // CONTEXT CLUES
    // ==========================================
    {
        title: "Context Clues: Animals",
        instr: "Which word fits the sentence?",
        qs: [
            { q: "The ___ barks loudly.", opts: ["cat", "dog", "cow", "fish"], c: 1 },
            { q: "A ___ swims in the ocean.", opts: ["bird", "rabbit", "shark", "lion"], c: 2 },
            { q: "The ___ lays eggs.", opts: ["hen", "pig", "dog", "bear"], c: 0 },
            { q: "A ___ has a long trunk.", opts: ["mouse", "elephant", "snake", "ant"], c: 1 },
            { q: "The ___ flies in the sky.", opts: ["bird", "dog", "fish", "worm"], c: 0 },
            { q: "A ___ says 'Moo'.", opts: ["sheep", "cow", "duck", "cat"], c: 1 },
            { q: "The ___ climbs trees.", opts: ["monkey", "horse", "pig", "whale"], c: 0 },
            { q: "A ___ moves very slow.", opts: ["turtle", "rabbit", "bird", "deer"], c: 0 }
        ]
    },
    {
        title: "Context Clues: School",
        instr: "Which word fits the sentence?",
        qs: [
            { q: "I write with a ___.", opts: ["pencil", "spoon", "shoe", "leaf"], c: 0 },
            { q: "We read a ___.", opts: ["chair", "book", "desk", "apple"], c: 1 },
            { q: "I sit at my ___.", opts: ["wall", "desk", "window", "door"], c: 1 },
            { q: "The ___ teaches the class.", opts: ["student", "teacher", "driver", "cook"], c: 1 },
            { q: "I use ___ to cut paper.", opts: ["glue", "scissors", "tape", "pen"], c: 1 },
            { q: "We eat lunch in the ___.", opts: ["gym", "cafeteria", "library", "bus"], c: 1 },
            { q: "I carry books in my ___.", opts: ["backpack", "pocket", "hat", "shoe"], c: 0 },
            { q: "We play at ___.", opts: ["math", "reading", "recess", "nap"], c: 2 }
        ]
    },
    {
        title: "Context Clues: Body",
        instr: "Which word fits the sentence?",
        qs: [
            { q: "I see with my ___.", opts: ["ears", "eyes", "nose", "hands"], c: 1 },
            { q: "I hear with my ___.", opts: ["eyes", "ears", "mouth", "feet"], c: 1 },
            { q: "I smell with my ___.", opts: ["nose", "toes", "eyes", "knees"], c: 0 },
            { q: "I walk on my ___.", opts: ["hands", "feet", "ears", "hair"], c: 1 },
            { q: "I clap my ___.", opts: ["feet", "hands", "eyes", "legs"], c: 1 },
            { q: "I chew with my ___.", opts: ["teeth", "nose", "ears", "toes"], c: 0 },
            { q: "I wave with my ___.", opts: ["foot", "arm", "nose", "back"], c: 1 },
            { q: "My ___ helps me think.", opts: ["brain", "elbow", "knee", "hair"], c: 0 }
        ]
    },
    {
        title: "Context Clues: Weather",
        instr: "Which word fits the sentence?",
        qs: [
            { q: "The ___ shines in the day.", opts: ["moon", "sun", "star", "lamp"], c: 1 },
            { q: "Use an umbrella for ___.", opts: ["sun", "rain", "wind", "fog"], c: 1 },
            { q: "Snow is ___.", opts: ["hot", "cold", "green", "dry"], c: 1 },
            { q: "The wind ___ the leaves.", opts: ["blows", "eats", "draws", "sings"], c: 0 },
            { q: "We build a snowman in ___.", opts: ["summer", "winter", "spring", "night"], c: 1 },
            { q: "Clouds are in the ___.", opts: ["ground", "sky", "grass", "water"], c: 1 },
            { q: "I wear a coat when it is ___.", opts: ["hot", "warm", "cold", "sunny"], c: 2 }
        ]
    },
    {
        title: "Context Clues: Food",
        instr: "Which word fits the sentence?",
        qs: [
            { q: "I eat cereal in a ___.", opts: ["plate", "bowl", "fork", "napkin"], c: 1 },
            { q: "Apples are a ___.", opts: ["meat", "fruit", "candy", "drink"], c: 1 },
            { q: "Ice cream is ___.", opts: ["hot", "spicy", "cold", "salty"], c: 2 },
            { q: "I drink ___ with cookies.", opts: ["milk", "soup", "oil", "jam"], c: 0 },
            { q: "Pizza is my favorite ___.", opts: ["toy", "food", "color", "pet"], c: 1 },
            { q: "I put butter on my ___.", opts: ["water", "toast", "juice", "salad"], c: 1 },
            { q: "Carrots are ___.", opts: ["blue", "orange", "purple", "black"], c: 1 }
        ]
    },
    {
        title: "Context Clues: Home",
        instr: "Which word fits the sentence?",
        qs: [
            { q: "I sleep in my ___.", opts: ["tub", "sink", "bed", "chair"], c: 2 },
            { q: "I wash my hands with ___.", opts: ["soap", "dirt", "paper", "crayon"], c: 0 },
            { q: "We cook dinner in the ___.", opts: ["bedroom", "kitchen", "garage", "hall"], c: 1 },
            { q: "I watch TV in the ___.", opts: ["closet", "living room", "bathroom", "attic"], c: 1 },
            { q: "I wipe my feet on the ___.", opts: ["table", "mat", "wall", "window"], c: 1 },
            { q: "The ___ keeps food cold.", opts: ["oven", "fridge", "sink", "toaster"], c: 1 }
        ]
    }
];

export { lessonData };


