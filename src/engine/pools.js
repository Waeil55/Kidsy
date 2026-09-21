// Slot pools for the story engine. Tier 0 = KG/G1, tier 1 = G2/G3, tier 2 = G4-G6.
// Each grade only draws from its own tier, so vocabulary never gets harder/easier than the grade.

export const NAMES = {
  0: {
    f: ['Meg', 'Pam', 'Kim', 'Liz', 'Zoe', 'Ann', 'Amy', 'Eva', 'Ivy', 'Jen', 'Bea', 'Fay', 'Gia', 'Val', 'Rae', 'Tess', 'Lia', 'Mia', 'Ava', 'Kay', 'Dot', 'Deb', 'Jill', 'Nan'],
    m: ['Sam', 'Ben', 'Tom', 'Dan', 'Tim', 'Max', 'Ted', 'Jack', 'Ian', 'Kit', 'Rob', 'Jim', 'Ned', 'Sid', 'Bob', 'Hal', 'Ron', 'Cam', 'Zac', 'Lee', 'Gus', 'Pat', 'Rex', 'Van'],
  },
  1: {
    f: ['Mia', 'Ava', 'Nora', 'Ruby', 'Chloe', 'Layla', 'Zara', 'Hana', 'Priya', 'Amira', 'Sofia', 'Lina', 'Maya', 'Elena', 'Nadia', 'Yuki', 'Fatima', 'Anaya', 'Leila', 'Mina', 'Ella', 'Iris', 'Tessa', 'Clara'],
    m: ['Leo', 'Noah', 'Omar', 'Yusuf', 'Owen', 'Felix', 'Theo', 'Ravi', 'Mateo', 'Kenji', 'Diego', 'Jamal', 'Idris', 'Karim', 'Tariq', 'Aiden', 'Chen', 'Luca', 'Ethan', 'Amir', 'Miles', 'Hugo', 'Isaac', 'Dev'],
  },
  2: {
    f: ['Amara', 'Beatriz', 'Camila', 'Delphine', 'Esme', 'Farah', 'Greta', 'Harper', 'Imani', 'Juniper', 'Keiko', 'Lucia', 'Marisol', 'Naomi', 'Odette', 'Penelope', 'Rosalind', 'Saanvi', 'Talia', 'Willa', 'Yara', 'Zainab', 'Marguerite', 'Ingrid'],
    m: ['Andre', 'Bastian', 'Caleb', 'Dmitri', 'Elias', 'Finn', 'Gabriel', 'Hassan', 'Ignacio', 'Jonah', 'Kwame', 'Lorenzo', 'Malik', 'Nikolai', 'Oliver', 'Pablo', 'Rafael', 'Silas', 'Tobias', 'Ulysses', 'Vikram', 'Wesley', 'Xavier', 'Zane'],
  },
};

// adj is the describing word; e is an emoji for the story banner
export const ITEMS = {
  0: [
    { n: 'hat', adj: 'red', e: '🧢' }, { n: 'ball', adj: 'big', e: '⚽' }, { n: 'bag', adj: 'blue', e: '🎒' },
    { n: 'kite', adj: 'red', e: '🪁' }, { n: 'bear', adj: 'soft', e: '🧸' }, { n: 'drum', adj: 'tan', e: '🥁' },
    { n: 'book', adj: 'red', e: '📕' }, { n: 'cup', adj: 'pink', e: '🥤' }, { n: 'sock', adj: 'green', e: '🧦' },
    { n: 'pen', adj: 'black', e: '🖊️' }, { n: 'bell', adj: 'gold', e: '🔔' }, { n: 'box', adj: 'tan', e: '📦' },
    { n: 'cap', adj: 'blue', e: '🧢' }, { n: 'top', adj: 'red', e: '🪀' }, { n: 'mug', adj: 'big', e: '☕' },
  ],
  1: [
    { n: 'kite', adj: 'blue', e: '🪁' }, { n: 'soccer ball', adj: 'black and white', e: '⚽' }, { n: 'backpack', adj: 'green', e: '🎒' },
    { n: 'teddy bear', adj: 'fuzzy', e: '🧸' }, { n: 'lunch box', adj: 'yellow', e: '🍱' }, { n: 'library book', adj: 'thick', e: '📚' },
    { n: 'jacket', adj: 'warm', e: '🧥' }, { n: 'water bottle', adj: 'silver', e: '🍶' }, { n: 'flute', adj: 'shiny', e: '🎶' },
    { n: 'baseball glove', adj: 'brown', e: '🧤' }, { n: 'sketchbook', adj: 'purple', e: '📓' }, { n: 'scarf', adj: 'striped', e: '🧣' },
    { n: 'umbrella', adj: 'polka-dot', e: '☂️' }, { n: 'toy robot', adj: 'silver', e: '🤖' }, { n: 'toy boat', adj: 'wooden', e: '⛵' },
    { n: 'sunhat', adj: 'yellow', e: '👒' },
  ],
  2: [
    { n: 'brass compass', adj: 'old', e: '🧭' }, { n: 'leather journal', adj: 'worn', e: '📔' }, { n: 'telescope', adj: 'battered', e: '🔭' },
    { n: 'pocket watch', adj: 'antique', e: '⌚' }, { n: 'camera', adj: 'vintage', e: '📷' }, { n: 'violin bow', adj: 'polished', e: '🎻' },
    { n: 'science notebook', adj: 'well-thumbed', e: '📒' }, { n: 'wooden flute', adj: 'hand-carved', e: '🪈' }, { n: 'silver locket', adj: 'tarnished', e: '📿' },
    { n: 'paint set', adj: 'treasured', e: '🎨' }, { n: 'chess piece', adj: 'carved', e: '♟️' }, { n: 'harmonica', adj: 'dented', e: '🎵' },
    { n: 'map case', adj: 'faded', e: '🗺️' }, { n: 'lantern', adj: 'rusty', e: '🏮' }, { n: 'microscope slide box', adj: 'labeled', e: '🔬' },
    { n: 'family photograph', adj: 'creased', e: '🖼️' },
  ],
};

// prepositional phrases ("Where did she look?")
export const PLACES = {
  0: ['on the bed', 'in the box', 'under the rug', 'in the bag', 'on the mat', 'in the yard', 'by the door', 'in the barn', 'on the step', 'under the bed', 'in the van', 'on the shelf'],
  1: ['under the bed', 'behind the couch', 'in the kitchen', 'on the porch', 'in the garden', 'in the classroom', 'in the gym', 'on the school bus', 'in the library', 'by the front door', 'in the backyard', 'under the porch', 'in the closet', 'on the swing set'],
  2: ['in the library', 'beside the old oak tree', 'on the ferry', 'under the workbench', 'in the attic', 'along the shoreline', 'in the orchard', 'near the market', 'behind the bookshelf', 'at the train station', 'in the science lab', 'inside the tool shed', 'in the auditorium', 'beneath the bleachers'],
};

// helpers / adults / animals that can appear
export const HELPERS = {
  0: ['Mom', 'Dad', 'Gran', 'Pop', 'Miss Bell', 'Mr. Fox'],
  1: ['Mom', 'Dad', 'Grandma', 'Grandpa', 'Ms. Lopez', 'Mr. Chen', 'Coach Ray', 'Aunt Rosa'],
  2: ['Mrs. Alvarez', 'Mr. Okafor', 'Coach Patel', 'Grandmother', 'Uncle Idris', 'Ms. Nakamura', 'Dr. Rivera', 'Captain Hale'],
};

// Emotions by language level. [word, kid-friendly meaning] — meanings feed vocabulary questions.
export const EMO_POS = {
  0: [['glad', 'happy'], ['happy', 'feeling good']],
  1: [['happy', 'feeling good'], ['proud', 'glad about something you did'], ['glad', 'happy']],
  2: [['relieved', 'feeling better because a worry is gone'], ['delighted', 'very happy'], ['proud', 'feeling happy about something you did']],
  3: [['relieved', 'feeling calm because a worry is gone'], ['thrilled', 'extremely happy and excited'], ['grateful', 'thankful for something']],
  4: [['elated', 'extremely happy and proud'], ['relieved', 'freed from worry or stress'], ['grateful', 'deeply thankful']],
};
export const EMO_NEG = {
  0: [['sad', 'not happy'], ['mad', 'upset and angry']],
  1: [['sad', 'not happy'], ['scared', 'afraid']],
  2: [['worried', 'afraid that something bad may happen'], ['nervous', 'a little afraid or worried']],
  3: [['anxious', 'worried and uneasy'], ['uneasy', 'worried; not comfortable']],
  4: [['apprehensive', 'worried that something bad may happen'], ['distraught', 'extremely upset']],
};

export const TRAITS = {
  2: [['careful', 'takes great care'], ['kind', 'caring about others'], ['brave', 'ready to face danger or fear'], ['curious', 'eager to learn or know'], ['honest', 'tells the truth'], ['patient', 'able to wait calmly']],
  3: [['determined', 'does not give up'], ['thoughtful', 'thinks about how others feel'], ['courageous', 'faces fear'], ['curious', 'wants to find out'], ['responsible', 'does what should be done'], ['generous', 'happy to share']],
  4: [['resourceful', 'good at finding ways to solve problems'], ['persistent', 'keeps trying in spite of difficulty'], ['compassionate', 'shows sympathy for others'], ['inquisitive', 'always asking questions'], ['principled', 'guided by strong beliefs about right and wrong'], ['diligent', 'careful and hard-working']],
};

// moral / theme statements (used as correct answers or distractors)
export const THEMES = {
  0: ['It is good to share.', 'Ask for help when you need it.', 'Be kind to a friend.', 'Do not give up.', 'Tell the truth.', 'Take turns.', 'Look with care.'],
  1: ['Sharing makes everyone happy.', 'It is okay to ask for help.', 'Kind words help friends feel good.', 'If you keep trying, you can do it.', 'Telling the truth is always best.', 'Taking turns is fair.', 'Being brave means trying even when you feel scared.'],
  2: ['Practice helps you get better at things.', 'Being kind can change someone’s day.', 'Honesty is the best choice, even when it is hard.', 'Working together makes hard jobs easier.', 'Staying calm helps you solve problems.', 'A new friend can be found in an unexpected place.', 'Fear often shrinks when you look at it closely.'],
  3: ['Perseverance turns failure into success.', 'Compassion means noticing when others need help.', 'Owning up to a mistake earns trust.', 'Teamwork can accomplish what one person cannot.', 'Curiosity can turn a scary mystery into a discovery.', 'Understanding differences makes a community stronger.', 'A change of plans can lead to something better.'],
};

export const KINDS_INFO = ['mammal', 'bird', 'reptile', 'fish', 'insect', 'amphibian'];
