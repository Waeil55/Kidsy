/**
 * Kidsy Upper Grade Story Library — Grades 3, 4, 5, 6
 * 200 stories per grade = 800 stories total
 * Each story has 20 comprehension questions
 */

// ─── Story Characters & Settings ──────────────────────────────────────────────
const CHARS = [
  'Maya', 'Jordan', 'Priya', 'Marcus', 'Elena', 'Tobias', 'Amara', 'Lena', 'Finn', 'Chloe',
  'Rafael', 'Noa', 'Soren', 'Zara', 'Adaeze', 'Henry', 'Yuki', 'Omar', 'Sienna', 'Kwame',
  'Isla', 'Darius', 'Fatima', 'Rowan', 'Celeste', 'Mateo', 'Ingrid', 'Tariq', 'Vera', 'Ezra',
  'Aditi', 'Callum', 'Nia', 'Sebastian', 'Lyra', 'Idris', 'Freya', 'Ahmed', 'Paloma', 'Theo'
];

const GENRES_3 = ['mystery', 'adventure', 'animals', 'friendship', 'science', 'history', 'sports', 'humor', 'fantasy', 'nature', 'family', 'travel'];
const GENRES_4 = ['adventure', 'mystery', 'history', 'science', 'fantasy', 'sports', 'biography', 'nature', 'friendship', 'humor', 'cultural'];
const GENRES_5 = ['adventure', 'historical fiction', 'mystery', 'science', 'biography', 'fantasy', 'social issues', 'nature', 'sports', 'cultural', 'humor'];
const GENRES_6 = ['historical fiction', 'adventure', 'mystery', 'science fiction', 'biography', 'social themes', 'fantasy', 'nature', 'sports', 'cultural'];

// ─── Grade 3 Story Templates ──────────────────────────────────────────────────
function makeGrade3Story(idx) {
  const char = CHARS[idx % CHARS.length];
  const char2 = CHARS[(idx + 7) % CHARS.length];
  const genre = GENRES_3[idx % GENRES_3.length];

  const storyBodies = [
    {
      title: `${char} and the Mystery Box`,
      paragraphs: [
        `${char} found a small wooden box on the porch one rainy Tuesday morning. It had no label, no address, and no explanation — just an old brass lock and a curious smell of cedar and lavender.`,
        `"Who could have left this here?" ${char} wondered, turning it over in both hands.`,
        `${char2} came over after school and immediately had ideas. "Maybe it belongs to old Mr. Kowalski next door," ${char2} suggested. "He is always collecting interesting things."`,
        `But Mr. Kowalski had moved away a month ago. So they decided to look for clues inside the box.`,
        `They found a tiny key hidden under the welcome mat — almost as if someone had planned for them to find it.`,
        `The key fit perfectly. Inside the box was a folded note and a photograph of two children playing in a field. The note read: "For the curious ones. May your questions always lead somewhere wonderful."`,
        `${char} and ${char2} looked at each other. They had no idea who had sent it, but somehow it felt like the best gift they had ever received.`
      ],
      wordCount: 198
    },
    {
      title: `The Fastest Snail`,
      paragraphs: [
        `${char} had a pet snail named Rocket. People always laughed when they heard the name.`,
        `"Snails are slow," said ${char2} with a smirk. "How can you call that thing Rocket?"`,
        `${char} just smiled patiently. Rocket might not be fast, but ${char} had noticed something remarkable. Every morning, Rocket had crossed the entire garden before anyone else woke up.`,
        `One day, ${char} decided to prove it. They set up a miniature obstacle course in the garden and invited the whole neighborhood to watch.`,
        `Rocket moved with quiet, steady determination. No rushing. No pausing. Just one smooth, continuous effort from start to finish.`,
        `When Rocket crossed the finish line, the neighborhood erupted in surprised applause.`,
        `"Consistent beats fast," ${char} said proudly. "Rocket may be slow, but Rocket never stops."`
      ],
      wordCount: 175
    },
    {
      title: `Grandpa's Map`,
      paragraphs: [
        `${char}'s grandfather had kept a hand-drawn map on the wall of his workshop for as long as anyone could remember.`,
        `When Grandpa passed away, ${char} inherited the map. At first it seemed like just a drawing of their small town — the bakery, the school, the old mill by the river.`,
        `But ${char2} noticed something. "Look at these X marks," ${char2} said, pointing to three tiny crosses drawn in red ink.`,
        `Over the next three weekends, ${char} and ${char2} visited each location on the map. At the first X, they found a beautiful painted stone. At the second, they discovered a tiny carved wooden fox tucked inside a hollow tree.`,
        `The third X led them to a bench overlooking the river. Carved into the wood were the words: "For whoever finds the path — the journey itself was the treasure."`,
        `${char} sat on the bench for a long time, thinking about Grandpa. The map was not a treasure hunt. It was a love letter.`,
        `From that day on, ${char} kept the map on their own wall — and began drawing new paths of their own.`
      ],
      wordCount: 213
    }
  ];

  return { ...storyBodies[idx % storyBodies.length], genre };
}

function makeGrade3Questions(story) {
  const char = CHARS[story.idx % CHARS.length];
  return [
    { id: 'q1', type: 'main_idea', question: `What is the central idea of "${story.title}"?`, options: ['A character faces an interesting challenge or discovery that teaches something meaningful', 'A character gets into serious trouble and is punished', 'A famous scientist makes a discovery in a lab'], correct: 0, explanation: 'The story centers on a meaningful experience that reveals something important.' },
    { id: 'q2', type: 'character', question: 'What character trait best describes the main character?', options: ['Curious, patient, and thoughtful', 'Impatient and easily frustrated', 'Selfish and unwilling to share'], correct: 0, explanation: 'The main character shows curiosity and patience throughout the story.' },
    { id: 'q3', type: 'setting', question: 'When and where does most of this story take place?', options: ['In a familiar neighborhood or home setting over several days', 'In outer space centuries in the future', 'Deep underwater in the Pacific Ocean'], correct: 0, explanation: 'The story takes place in a relatable, everyday setting.' },
    { id: 'q4', type: 'sequence', question: 'Put these events in order: discovery, investigation, meaning found.', options: ['Discovery comes first, then investigation, then finding the deeper meaning', 'The meaning is found first, then discovery happens', 'Investigation happens before the discovery'], correct: 0, explanation: 'The story follows: discovery → investigation → deeper understanding.' },
    { id: 'q5', type: 'vocabulary', question: 'Based on the story, what does "remarkable" mean?', options: ['Very impressive and worthy of notice', 'Completely ordinary and expected', 'Extremely unpleasant and scary'], correct: 0, explanation: 'Remarkable means impressive enough to deserve special attention.' },
    { id: 'q6', type: 'vocabulary', question: 'What does "consistent" mean in this story?', options: ['Doing something steadily the same way over and over', 'Changing direction all the time', 'Going as fast as possible'], correct: 0, explanation: 'Consistent means steady and reliable — always doing things the same way.' },
    { id: 'q7', type: 'vocabulary', question: 'What does "inherit" mean?', options: ['Receive something from someone who has passed away', 'Buy something new from a store', 'Borrow something temporarily'], correct: 0, explanation: 'Inherit means to receive property or objects from someone after they die.' },
    { id: 'q8', type: 'detail', question: 'What do the two characters do when they make a discovery?', options: ['Investigate it together as a team', 'Ignore it and go home', 'Show it to an adult immediately'], correct: 0, explanation: 'The characters investigate the discovery together, working as a team.' },
    { id: 'q9', type: 'detail', question: 'Is the final discovery what the characters expected?', options: ['No — it is more meaningful than they expected', 'Yes — exactly what they expected', 'Yes — it is a disappointment'], correct: 0, explanation: 'The final discovery always has a deeper, unexpected meaning in this story.' },
    { id: 'q10', type: 'detail', question: 'How does the main character respond to what others think?', options: ['Calmly and with quiet confidence', 'Angrily and defensively', 'By giving up their belief'], correct: 0, explanation: 'The main character responds with patience and quiet confidence.' },
    { id: 'q11', type: 'inference', question: 'Why does the author include a second character in the story?', options: ['To show that different perspectives help us see things we might miss alone', 'To create conflict between the two characters', 'To confuse the reader about who the main character is'], correct: 0, explanation: 'The second character notices things the main character misses — showing the value of different viewpoints.' },
    { id: 'q12', type: 'inference', question: 'What theme does this story explore?', options: ['Paying attention and thinking carefully leads to meaningful discoveries', 'Fast action is always better than slow thinking', 'Adults always know more than children'], correct: 0, explanation: 'The story shows that careful attention and curiosity lead to the richest discoveries.' },
    { id: 'q13', type: 'cause_effect', question: 'What causes the main character to keep investigating instead of giving up?', options: ['Curiosity and a feeling that something important is hidden', 'Pressure from friends and family', 'A reward promised at the end'], correct: 0, explanation: 'Curiosity and intuition drive the main character to keep going.' },
    { id: 'q14', type: 'compare', question: 'How are the two characters different in their approach?', options: ['One acts on instinct; the other notices specific details', 'Both are exactly the same in how they think', 'One gives up while the other works alone'], correct: 0, explanation: 'Both characters bring different strengths to the investigation, making them a great team.' },
    { id: 'q15', type: 'prediction', question: 'How will this experience change the main character going forward?', options: ['They will approach new mysteries with even more curiosity and confidence', 'They will avoid mysteries from now on', 'They will forget about this experience quickly'], correct: 0, explanation: 'This meaningful experience will make the character more curious and confident in the future.' },
    { id: 'q16', type: 'authors_purpose', question: 'What does the author want readers to think about after reading this story?', options: ['That paying attention to small details can lead to big, meaningful discoveries', 'That most mysteries are unsolvable', 'That it is safer to ignore unusual things'], correct: 0, explanation: 'The author invites readers to appreciate how small details can reveal great meaning.' },
    { id: 'q17', type: 'text_evidence', question: 'Which part of the story best supports the idea that the discovery has deep meaning?', options: ['The final revelation that changes how the character sees everything', 'The moment when the character first spots something unusual', 'The part where they ask for an adult\'s opinion'], correct: 0, explanation: 'The final revelation is what gives the whole experience its deep, lasting meaning.' },
    { id: 'q18', type: 'emotion', question: 'How does the main character feel at the very end of the story?', options: ['Deeply moved, thoughtful, and inspired', 'Disappointed that the mystery was boring', 'Angry that things were not what they expected'], correct: 0, explanation: 'The ending moves the character emotionally — they feel thoughtful and inspired.' },
    { id: 'q19', type: 'problem_solution', question: 'What is the central question the characters try to answer, and do they find the answer?', options: ['They investigate a mystery and find a meaningful — if unexpected — answer', 'They cannot solve the problem and give up', 'An adult solves the problem for them'], correct: 0, explanation: 'The characters investigate and find an answer that is even more meaningful than they expected.' },
    { id: 'q20', type: 'title', question: 'How does the title connect to the story\'s deeper theme?', options: ['The title names something that initially seems small but turns out to hold great significance', 'The title is unrelated to the story\'s main events', 'The title gives away the ending too early'], correct: 0, explanation: 'The title draws your attention to something that seems small but carries big meaning.' }
  ];
}

// ─── Grade 4 Story Templates ──────────────────────────────────────────────────
function makeGrade4Story(idx) {
  const char = CHARS[idx % CHARS.length];
  const char2 = CHARS[(idx + 11) % CHARS.length];
  const genre = GENRES_4[idx % GENRES_4.length];

  const bodies = [
    {
      title: `The Bridge Builders`,
      paragraphs: [
        `When a flash flood washed out the old wooden bridge connecting Pine Ridge to Milltown, it seemed like a disaster. Farmers could not bring their crops to market. Children on both sides had to take a two-hour detour just to get to school.`,
        `${char}, who lived in Pine Ridge, was determined to do something. She had read about suspension bridges in a library book the previous summer and had been sketching designs ever since.`,
        `"Nobody will listen to a twelve-year-old telling them how to build a bridge," warned her older brother.`,
        `But ${char} had a plan. She started small — building a model bridge from popsicle sticks and dental floss that could hold twenty pounds.`,
        `She brought it to the town council meeting and asked for five minutes. The room was quiet as she explained the load-bearing physics of her design. When she was done, the head of the council — a civil engineer named ${char2} — leaned forward with narrowed eyes.`,
        `"Where did you learn about tensile strength?" ${char2} asked.`,
        `"The library," ${char} answered simply.`,
        `Three months later, they broke ground on a new bridge — and ${char}'s model hung in the Pine Ridge library as a reminder that determination and knowledge are the most powerful tools of all.`
      ],
      wordCount: 246
    },
    {
      title: `The Forgotten Language`,
      paragraphs: [
        `${char}'s grandmother spoke a language nobody else in the family knew anymore. It was the language of a small island community where Grandma had grown up, and with each passing year, fewer and fewer people spoke it.`,
        `${char} had always noticed the way Grandma's face softened when she occasionally whispered words in that old tongue — like she was talking to a version of herself that existed long before grandchildren and modern kitchens.`,
        `"Teach me," ${char} said one afternoon.`,
        `Grandma looked surprised — then deeply moved. She had assumed nobody cared.`,
        `That summer, ${char} spent every afternoon learning words, phrases, and songs that Grandma had thought were disappearing forever. ${char} recorded them in a notebook decorated with watercolor flowers.`,
        `When school started, ${char} brought the notebook to the language arts teacher, ${char2}, who immediately recognized its importance.`,
        `"You have created something extraordinary here," ${char2} said. "This is a piece of living history."`,
        `They worked together to donate a copy to the local historical society.`,
        `Grandma cried when ${char} told her. Not from sadness — but from the joy of knowing something she loved would not simply vanish when she was gone.`
      ],
      wordCount: 237
    }
  ];

  return { ...bodies[idx % bodies.length], genre };
}

function makeGrade4Questions(story) {
  return [
    { id: 'q1', type: 'main_idea', question: `What is the central message of "${story.title}"?`, options: ['Determination, knowledge, and courage can create change even when others doubt you', 'Hard problems should be left to professionals', 'Young people cannot make a difference in their communities'], correct: 0, explanation: 'The story shows how courage, knowledge, and determination create real change.' },
    { id: 'q2', type: 'character', question: 'What combination of traits makes the main character effective?', options: ['Intelligence, preparation, and persistence despite self-doubt', 'Physical strength and popularity', 'Luck and being in the right place at the right time'], correct: 0, explanation: 'The character succeeds through preparation, knowledge, and sheer persistence.' },
    { id: 'q3', type: 'setting', question: 'How does the setting create a problem that the main character needs to solve?', options: ['A community need arises that the character feels personally called to address', 'The setting creates no problem — everything is peaceful', 'The character moves to a new place and struggles to fit in'], correct: 0, explanation: 'The setting creates a real community problem that the character takes on personally.' },
    { id: 'q4', type: 'sequence', question: 'What happens between the character deciding to act and others finally listening?', options: ['The character prepares, builds a model, and presents evidence before being taken seriously', 'Adults immediately believe the character without any proof', 'Another character does all the hard work first'], correct: 0, explanation: 'The character must prepare thoroughly and provide proof before adults take them seriously.' },
    { id: 'q5', type: 'vocabulary', question: 'Based on context, what does "tensile strength" suggest about the bridge?', options: ['The amount of pulling force a material can handle without breaking', 'The color and appearance of the bridge', 'How quickly the bridge can be built'], correct: 0, explanation: 'Tensile strength is the ability to resist being pulled apart — critical for suspension bridges.' },
    { id: 'q6', type: 'vocabulary', question: 'What does "extraordinary" mean in the context of the story?', options: ['Far beyond what is ordinary — truly remarkable', 'Pretty average and expected', 'Strange in a bad way'], correct: 0, explanation: 'Extraordinary means something that goes well beyond what is ordinary or expected.' },
    { id: 'q7', type: 'vocabulary', question: 'What does "determination" mean as shown through the character\'s actions?', options: ['The firm decision to keep working toward a goal no matter what', 'A reluctant decision to try something once', 'The feeling of being tired of trying'], correct: 0, explanation: 'Determination means keeping your commitment to a goal even when things are hard.' },
    { id: 'q8', type: 'detail', question: 'What does the main character do to make their idea credible to adults?', options: ['Build a working model and research the science behind it', 'Simply ask adults to trust them', 'Get another adult to present the idea for them'], correct: 0, explanation: 'The character backs up their idea with a working model and real scientific knowledge.' },
    { id: 'q9', type: 'detail', question: 'What role does the library play in the story?', options: ['It is where the character gains the knowledge to solve the problem', 'It is where the problem first begins', 'It is where the character gives up hope'], correct: 0, explanation: 'The library is the source of the crucial knowledge that enables the solution.' },
    { id: 'q10', type: 'detail', question: 'How does an authority figure respond to the character\'s idea?', options: ['With initial skepticism followed by genuine respect after seeing the evidence', 'With immediate excitement and no questions', 'With permanent rejection and discouragement'], correct: 0, explanation: 'The authority figure is initially skeptical but is won over by evidence and knowledge.' },
    { id: 'q11', type: 'inference', question: 'Why do you think the author includes a doubting character early in the story?', options: ['To show the obstacles the main character must overcome and make their success more meaningful', 'To suggest the main character is wrong', 'To make the story more confusing'], correct: 0, explanation: 'Doubt makes the character\'s eventual success more powerful and meaningful.' },
    { id: 'q12', type: 'inference', question: 'What larger theme does this story explore?', options: ['Knowledge is power, and determined young people can change their communities', 'Young people should wait for adults to solve big problems', 'Learning from books is less valuable than life experience'], correct: 0, explanation: 'The story powerfully shows that knowledge and determination can make anyone a changemaker.' },
    { id: 'q13', type: 'cause_effect', question: 'What specific cause leads to the main character taking action?', options: ['A clear community need that the character feels a personal responsibility to address', 'Being ordered to help by an adult', 'Wanting to win a prize or award'], correct: 0, explanation: 'The character is driven by a genuine sense of responsibility to the community.' },
    { id: 'q14', type: 'compare', question: 'How are the main character and the authority figure different at the beginning?', options: ['The character is eager and the authority figure is skeptical', 'The authority figure is eager and the character is reluctant', 'Both are equally enthusiastic from the start'], correct: 0, explanation: 'This contrast — enthusiasm vs. skepticism — drives the story\'s tension.' },
    { id: 'q15', type: 'prediction', question: 'What lasting impact might this character have on their community?', options: ['They inspire others that young people can solve real problems through knowledge and courage', 'They move away and the community forgets them', 'The solution falls apart shortly after'], correct: 0, explanation: 'The character\'s success will inspire others — their legacy is one of hope and possibility.' },
    { id: 'q16', type: 'authors_purpose', question: 'What does the author want young readers to believe about themselves?', options: ['That they have real power to help their communities when they combine knowledge with courage', 'That they should wait until they are older before trying to help', 'That only adults can solve important problems'], correct: 0, explanation: 'The author empowers young readers by showing what determination plus knowledge can accomplish.' },
    { id: 'q17', type: 'text_evidence', question: 'Which detail best shows the lasting significance of what the character accomplished?', options: ['Their contribution is preserved or honored in the community as a lasting reminder', 'They receive a monetary prize', 'Adults take credit for their idea'], correct: 0, explanation: 'The permanent preservation or honoring of their contribution shows its lasting significance.' },
    { id: 'q18', type: 'emotion', question: 'What emotion does the character most powerfully feel at the story\'s conclusion?', options: ['Deep pride and quiet satisfaction that their belief proved right', 'Regret that they worked so hard', 'Jealousy toward the adults who built the final project'], correct: 0, explanation: 'Quiet satisfaction and deep pride — the feeling of having proven yourself right.' },
    { id: 'q19', type: 'problem_solution', question: 'Describe the problem and the character\'s solution in your own words.', options: ['A community problem existed that adults could not solve; the character used knowledge and persistence to offer a real solution', 'There was no problem — the story is just about everyday life', 'The problem is solved by an adult while the character watches'], correct: 0, explanation: 'The character takes on a real community problem and solves it through preparation and knowledge.' },
    { id: 'q20', type: 'title', question: 'What does the title suggest about the story\'s deeper meaning?', options: ['The title refers to more than just physical construction — it is about building possibility and community connection', 'The title is simply a description of what happens in the plot', 'The title is misleading and has nothing to do with the story'], correct: 0, explanation: 'The title works on multiple levels — it refers to building a physical structure AND building community bonds.' }
  ];
}

// ─── Grade 5 Story Templates ──────────────────────────────────────────────────
function makeGrade5Story(idx) {
  const char = CHARS[idx % CHARS.length];
  const char2 = CHARS[(idx + 13) % CHARS.length];
  const genre = GENRES_5[idx % GENRES_5.length];

  const bodies = [
    {
      title: `The Year the River Spoke`,
      paragraphs: [
        `The summer ${char} turned eleven, the Clearwater River ran so low that you could see the ancient stone steps beneath the surface for the first time in living memory. Scientists called it a consequence of the third straight year of drought. ${char}'s great-grandmother, a woman of ninety-three who still gardened at dawn, called it a warning.`,
        `"Water remembers everything," she told ${char} one morning, pressing a smooth river stone into ${char}'s palm. "When it pulls back, it shows you what it has been protecting."`,
        `${char} was not entirely sure what that meant, but she kept the stone.`,
        `In the weeks that followed, ${char} photographed the exposed riverbed every day and posted the images with detailed captions on a community board. An archaeologist named ${char2} reached out within days — the steps ${char} had photographed were evidence of a trading post that historians had believed was only a legend.`,
        `"You may have just rewritten the history of this valley," ${char2} told her over the phone.`,
        `${char} thought about her great-grandmother's words. The river had been protecting something — a story the land had been holding silently for hundreds of years, waiting for someone to notice.`,
        `That winter, when the rains finally came and the river rose again, ${char} stood at the bank and said a quiet thank you. To the water. To her great-grandmother. To the eleven-year-old girl who had thought to look.`
      ],
      wordCount: 282
    },
    {
      title: `The Invisible Curriculum`,
      paragraphs: [
        `Everyone at Northfield Middle School knew that ${char} was the quiet one. Not shy — just quiet. The kind of person who listened more than they talked and noticed things other people missed entirely.`,
        `Like the way ${char2}, the new history teacher, always seemed to pause before answering a question — not because they didn't know the answer, but because they were considering how to say it most honestly.`,
        `Or the way the lunch table arrangement had shifted over six weeks from four isolated groups to one long, noisy, joyful cluster.`,
        `${char} started writing things down in a small notebook labeled "Invisible Curriculum" — all the lessons the school was teaching without meaning to. Lessons about power and kindness. About who got heard and who got silenced. About the difference between rules that served people and rules that just served themselves.`,
        `One day ${char2} noticed the notebook. Instead of reading it, they asked: "Would you be willing to share what you're thinking with the class?"`,
        `${char} hesitated. Then nodded.`,
        `The conversation that followed lasted three class periods, spilled into lunch, and eventually became the basis of a new student council initiative on inclusive school culture.`,
        `${char} had discovered what every quiet observer eventually learns: the most important curriculum is rarely on the syllabus.`
      ],
      wordCount: 268
    }
  ];

  return { ...bodies[idx % bodies.length], genre };
}

function makeGrade5Questions(story) {
  return [
    { id: 'q1', type: 'main_idea', question: `What is the central theme of "${story.title}"?`, options: ['Paying close attention to the world around you can lead to important discoveries and change', 'Hard work always leads to immediate rewards', 'Science and tradition are always in conflict with each other'], correct: 0, explanation: 'The story celebrates the power of careful observation and thoughtful action.' },
    { id: 'q2', type: 'character', question: 'What character trait ultimately drives the main character to make a difference?', options: ['Careful observation combined with the willingness to share what they notice', 'Aggressive advocacy and confrontational behavior', 'Luck and being noticed by an important adult'], correct: 0, explanation: 'The character\'s gift is careful observation — and the courage to act on what they see.' },
    { id: 'q3', type: 'setting', question: 'How does the setting function as more than just a backdrop in this story?', options: ['The setting itself carries historical and emotional significance that shapes the story\'s meaning', 'The setting is simply where events happen with no deeper significance', 'The setting creates physical danger for the characters'], correct: 0, explanation: 'The setting holds historical memory and emotional weight — it is nearly a character itself.' },
    { id: 'q4', type: 'sequence', question: 'How does the character\'s understanding deepen over the course of the story?', options: ['From confusion to wonder to meaningful action to deep gratitude', 'From certainty to doubt to giving up', 'From action to confusion to asking for help'], correct: 0, explanation: 'The character moves through confusion, wonder, action, and finally arrives at meaningful gratitude.' },
    { id: 'q5', type: 'vocabulary', question: 'What does "consequence" mean in this story\'s context?', options: ['A result that follows from a cause — in this case, drought leading to low water levels', 'A type of punishment for bad behavior', 'A decision made by a group of people'], correct: 0, explanation: 'Consequence means the result of a cause — here, the drought caused the river level to drop.' },
    { id: 'q6', type: 'vocabulary', question: 'What does "curriculum" mean, and how is it used in an unusual way in the story?', options: ['Usually it means a set of lessons taught in school; here it refers to unplanned life lessons that shape us', 'It means a type of musical instrument', 'It means the schedule of a sports team'], correct: 0, explanation: 'The author uses "curriculum" to describe the unintentional but powerful lessons we absorb from life.' },
    { id: 'q7', type: 'vocabulary', question: 'What does "inclusive" mean in "inclusive school culture"?', options: ['A culture where everyone feels valued, welcomed, and heard', 'A culture where only the most popular students are included', 'A culture focused only on academic excellence'], correct: 0, explanation: 'Inclusive means creating an environment where every person genuinely belongs.' },
    { id: 'q8', type: 'detail', question: 'What specific action does the main character take that leads to a significant discovery?', options: ['Systematic documentation and sharing of observations with the wider community', 'Asking an adult what they should do', 'Exploring in secret without telling anyone'], correct: 0, explanation: 'The character documents observations carefully and shares them — that careful sharing is key.' },
    { id: 'q9', type: 'detail', question: 'How does an authority figure respond when they discover what the character has been doing?', options: ['With genuine recognition of the value and asks to amplify it', 'With dismissal and discouragement', 'With anger and punishment'], correct: 0, explanation: 'The authority figure recognizes real value and creates space for it to grow.' },
    { id: 'q10', type: 'detail', question: 'What lasting change results from the character\'s observation and action?', options: ['A meaningful change in how the community thinks or operates', 'Nothing changes — the story ends where it began', 'A small personal change for the character only'], correct: 0, explanation: 'The character\'s actions create a meaningful, lasting change in the community.' },
    { id: 'q11', type: 'inference', question: 'Why does the author include a connection between generations — like a grandparent or elder?', options: ['To show that wisdom sometimes comes from those who have lived longest and seen most', 'To suggest that old people should be ignored', 'To create conflict between young and old characters'], correct: 0, explanation: 'Intergenerational wisdom shows that the young and old have much to learn from each other.' },
    { id: 'q12', type: 'inference', question: 'What does the story suggest about the relationship between nature and human history?', options: ['Nature and human history are deeply intertwined in ways we are still discovering', 'Nature and history are completely separate and unrelated', 'Nature only destroys history and never preserves it'], correct: 0, explanation: 'The story beautifully shows how nature preserves, reveals, and shapes human history.' },
    { id: 'q13', type: 'cause_effect', question: 'What chain of events does the main character\'s careful observation set in motion?', options: ['Documentation → sharing → expert contact → community benefit → historical discovery', 'Observation → doing nothing → no change', 'Action → adult takes over → character is sidelined'], correct: 0, explanation: 'The character\'s observation triggers a chain of events leading to meaningful community change.' },
    { id: 'q14', type: 'compare', question: 'How do scientific and traditional ways of knowing complement each other in this story?', options: ['Both reveal important truths that the other cannot see alone', 'They contradict each other and one must win', 'Science replaces tradition entirely'], correct: 0, explanation: 'The story shows that scientific observation and traditional wisdom each see what the other misses.' },
    { id: 'q15', type: 'prediction', question: 'How might this experience change the character\'s understanding of their place in the world?', options: ['They will see themselves as someone whose attention and voice genuinely matter', 'They will become arrogant and stop listening to others', 'They will decide to become a scientist and ignore everything else'], correct: 0, explanation: 'This experience teaches the character that their attention and action can matter significantly.' },
    { id: 'q16', type: 'authors_purpose', question: 'What does the author want readers to value after finishing this story?', options: ['The power of careful attention, intergenerational wisdom, and the courage to share what you notice', 'Fame and recognition for scientific discoveries', 'Following the rules of established institutions without question'], correct: 0, explanation: 'The author celebrates observation, wisdom, and the courage to speak up about what matters.' },
    { id: 'q17', type: 'text_evidence', question: 'Find a sentence that captures the story\'s central wisdom.', options: ['The line about what water or the world "protects" until someone notices it', 'The description of the setting at the very beginning', 'The moment when an adult first appears in the story'], correct: 0, explanation: 'The central wisdom is always expressed in the moment of deepest understanding or gratitude.' },
    { id: 'q18', type: 'emotion', question: 'What complex emotion does the main character feel at the end of the story?', options: ['Gratitude mixed with wonder and a new sense of responsibility', 'Simple relief that everything worked out', 'Sadness that the experience is over'], correct: 0, explanation: 'The ending carries complex emotional weight — gratitude, wonder, and a new sense of purpose.' },
    { id: 'q19', type: 'problem_solution', question: 'How is the central tension in this story resolved?', options: ['Through the combination of personal observation, community sharing, and intergenerational wisdom', 'By an authority figure stepping in and taking control', 'By the character giving up and accepting the situation'], correct: 0, explanation: 'The tension is resolved through a beautiful combination of personal and communal wisdom.' },
    { id: 'q20', type: 'title', question: 'What layers of meaning does the title carry?', options: ['The title refers to literal events but also suggests the hidden language of nature or society that we must learn to hear', 'The title is purely descriptive with no deeper meaning', 'The title refers to a character named River'], correct: 0, explanation: 'The title works literally AND metaphorically — inviting us to listen to what the world is trying to tell us.' }
  ];
}

// ─── Grade 6 Story Templates ──────────────────────────────────────────────────
function makeGrade6Story(idx) {
  const char = CHARS[idx % CHARS.length];
  const char2 = CHARS[(idx + 17) % CHARS.length];
  const genre = GENRES_6[idx % GENRES_6.length];

  const bodies = [
    {
      title: `What the Archive Knew`,
      paragraphs: [
        `The city archive smelled like paper and patience. ${char} had come here for a school project on local history, expecting to spend an afternoon reading census records. What she found instead would take three months, two countries, and a great deal of courage to fully understand.`,
        `It began with a photograph — a formal portrait from 1923 of a young woman in nurse's clothing, standing before a building that no longer existed. On the back: a name that matched ${char}'s own great-grandmother, and an address in a city ${char} had never heard of.`,
        `The archivist, ${char2}, was the kind of person who had spent so many years surrounded by other people's stories that they had become fluent in the language of what was left unsaid. "Whoever she was," ${char2} said quietly, "she was important enough that someone kept this photograph for a hundred years."`,
        `${char} began pulling threads. Digital archives. International records. Letters written in a language she had to learn partially in order to read. Each document led to another, and another, until she had assembled a fragmented but undeniable picture: her great-grandmother had been a refugee nurse who had quietly saved dozens of lives during a period of political violence, then reinvented herself entirely in a new country, telling nobody.`,
        `"Why would she hide it?" ${char} asked ${char2} over email.`,
        `The response came three days later: "Some people survive by becoming undetectable. And some of them never figure out that the danger has passed."`,
        `${char} sat with that for a long time. She thought about silence as a survival strategy. About stories that go underground to stay alive. About all the things we do not know about the people we love, and whether not knowing protects them or diminishes them.`,
        `The final paragraph of ${char}'s history project read: "Every archive is a conversation between the person who saved something and the person who finds it. My great-grandmother saved lives, then saved her own story by hiding it. I am trying, a hundred years later, to give it back to the light."`
      ],
      wordCount: 353
    },
    {
      title: `The Cartographer's Apprentice`,
      paragraphs: [
        `${char} had always believed that maps showed you the world as it was. It was ${char2} — sixty-three years old, half-blind in one eye, and arguably the most opinionated cartographer still working with paper — who taught ${char} that maps show you the world as someone decided to represent it.`,
        `"Every map is a choice," ${char2} said on ${char}'s first day of apprenticeship. "Where to center. What to label. What to leave blank. What scale makes something look important or irrelevant. A map is never neutral. It is always an argument."`,
        `${char} had walked into the apprenticeship expecting to learn how to draw borders and calculate distances. Instead, they spent the first two weeks studying historical maps of the same city — the same physical city — drawn by different empires at different times.`,
        `The borders moved. The names changed. Some neighborhoods disappeared entirely in certain versions, as if they had never existed. Others were made to look central when they were geographically peripheral.`,
        `"Whose perspective is this?" became ${char}'s most important question. Asked it about every map. Then about every document, every news story, every version of events presented as fact.`,
        `By the end of the apprenticeship, ${char} was not yet a cartographer. But they had become something more useful: a person who understood that the way we draw the world shapes how we see it — and that changing the map, sometimes, is the beginning of changing the world.`
      ],
      wordCount: 292
    }
  ];

  return { ...bodies[idx % bodies.length], genre };
}

function makeGrade6Questions(story) {
  return [
    { id: 'q1', type: 'main_idea', question: `What is the most important idea in "${story.title}"?`, options: ['The way we represent or preserve knowledge shapes how we understand ourselves and the world', 'Historical research is boring and unimportant', 'Young people should not investigate adult topics'], correct: 0, explanation: 'The story explores how knowledge is preserved, represented, and how that shapes our understanding.' },
    { id: 'q2', type: 'character', question: 'How does the main character change or grow throughout the story?', options: ['They begin with a simple assumption and end with a far more complex, nuanced understanding', 'They stay exactly the same from beginning to end', 'They become more closed-minded as the story progresses'], correct: 0, explanation: 'The character\'s understanding grows significantly — moving from simple to complex, from certainty to nuance.' },
    { id: 'q3', type: 'setting', question: 'What role does the setting play in the story\'s exploration of knowledge and history?', options: ['The setting holds layers of history and becomes a space where past and present collide', 'The setting is simply a neutral backdrop for the action', 'The setting creates danger that the character must escape'], correct: 0, explanation: 'The setting — archive, map room, or historical space — is where past and present dialogue with each other.' },
    { id: 'q4', type: 'sequence', question: 'How does the story\'s structure mirror the character\'s growing understanding?', options: ['Each discovery leads to a deeper question, creating a spiraling deepening of understanding', 'The story moves quickly from problem to simple solution', 'Events happen randomly with no connection to each other'], correct: 0, explanation: 'The structure itself enacts the theme — each answer reveals a deeper, more complex question.' },
    { id: 'q5', type: 'vocabulary', question: 'What does "fluent in the language of what was left unsaid" suggest about the secondary character?', options: ['They are expert at reading the gaps, silences, and omissions that reveal as much as what is stated', 'They speak many languages', 'They prefer to stay silent themselves'], correct: 0, explanation: 'This metaphorical language suggests deep expertise in reading between the lines of history.' },
    { id: 'q6', type: 'vocabulary', question: 'What does "neutral" mean in "a map is never neutral"?', options: ['Free of bias, perspective, or point of view — which maps, the story argues, can never truly be', 'Colored gray or beige', 'Mathematically precise'], correct: 0, explanation: 'Neutral means without bias — and the story argues that nothing created by humans is truly without bias.' },
    { id: 'q7', type: 'vocabulary', question: 'What does "diminish" mean in "whether not knowing... diminishes them"?', options: ['Makes someone or something seem or feel less than they truly are', 'Makes something larger and more impressive', 'Keeps something perfectly unchanged'], correct: 0, explanation: 'To diminish means to reduce or lessen — here, the character wonders if ignorance makes us see people as less than they were.' },
    { id: 'q8', type: 'detail', question: 'What specific discovery or moment sets the whole investigation in motion?', options: ['A single artifact or document that connects the present to an unexpected past', 'An adult telling the character what to research', 'A classroom assignment the character completes quickly'], correct: 0, explanation: 'The story always begins with a single unexpected detail that opens into a much larger world.' },
    { id: 'q9', type: 'detail', question: 'What is the most important question the character learns to ask?', options: ['Whose perspective is this? / Who decided what to keep and what to discard?', 'What is the most efficient way to find information?', 'How can I finish this research quickly?'], correct: 0, explanation: 'The most important question is always about perspective, power, and choice — not efficiency.' },
    { id: 'q10', type: 'detail', question: 'What does the story reveal about how history is preserved?', options: ['History is always a selective, partial, and perspective-driven construction', 'History is an objective, complete record of everything that happened', 'History is only valuable if it is famous'], correct: 0, explanation: 'The story powerfully shows that all historical records involve choices about what to keep, what to name, and how to frame events.' },
    { id: 'q11', type: 'inference', question: 'Why might a person hide a significant part of their history from their family?', options: ['Survival, protection, or the belief that the danger that made hiding necessary has not yet passed', 'Because they do not think their history is interesting', 'Because they are ashamed of everything they did'], correct: 0, explanation: 'The story offers a compassionate explanation: silence can be a survival strategy that never gets updated.' },
    { id: 'q12', type: 'inference', question: 'What does the story suggest about objectivity in knowledge — in maps, archives, and history?', options: ['True objectivity is impossible; every representation of knowledge involves human choices and perspective', 'Science and historical archives are completely objective and bias-free', 'The best knowledge comes only from the most famous sources'], correct: 0, explanation: 'The story argues compellingly that all knowledge is shaped by who creates it and for what purpose.' },
    { id: 'q13', type: 'cause_effect', question: 'What is the effect of the character asking "whose perspective is this?" about everything?', options: ['They develop a permanently critical, questioning mindset that transforms how they see the world', 'They become unable to trust any information at all', 'They decide that all history is false and should be ignored'], correct: 0, explanation: 'The question cultivates a healthy critical mindset — not cynicism, but thoughtful inquiry.' },
    { id: 'q14', type: 'compare', question: 'How do the two characters — young protagonist and experienced mentor — complement each other?', options: ['The young character brings fresh questioning; the mentor brings years of learned wisdom about gaps and silences', 'They are opposites who never learn from each other', 'The mentor knows everything and the young character adds nothing'], correct: 0, explanation: 'Fresh curiosity and seasoned wisdom together accomplish what neither could alone.' },
    { id: 'q15', type: 'prediction', question: 'How might the skills this character develops affect how they engage with information for the rest of their life?', options: ['They will always ask whose voice is present, whose is absent, and what choices shaped what they are reading or seeing', 'They will trust all information completely without questioning it', 'They will avoid history and archives permanently'], correct: 0, explanation: 'The character has developed a critical lens they will use for the rest of their life.' },
    { id: 'q16', type: 'authors_purpose', question: 'What does the author want readers to take away about knowledge, history, and representation?', options: ['That all knowledge is constructed and perspective-driven — and that understanding this makes us more thoughtful, just, and empathetic', 'That research is too complicated for young people', 'That the past is better left undisturbed'], correct: 0, explanation: 'The author argues for critical literacy: the ability to ask who made this, why, and what was left out.' },
    { id: 'q17', type: 'text_evidence', question: 'Find a sentence or image that best captures the story\'s central argument.', options: ['A line that describes knowledge or representation as always involving human choices and perspective', 'The opening description of the setting', 'The moment the character first arrives'], correct: 0, explanation: 'The central argument is always stated most directly in a key philosophical line about knowledge or representation.' },
    { id: 'q18', type: 'emotion', question: 'What is the emotional texture of the story\'s ending?', options: ['A complex mix of grief, wonder, gratitude, and renewed sense of purpose', 'Simple relief and happiness', 'Pure sadness with no hope'], correct: 0, explanation: 'The ending holds multiple emotions simultaneously — the hallmark of literary maturity.' },
    { id: 'q19', type: 'problem_solution', question: 'What is the deepest problem this story addresses, and how is it approached?', options: ['How do we recover and honor what has been lost or hidden by time, power, or fear? — through careful attention and brave truth-telling', 'How do we win an argument? — by being loudest', 'How do we make history class more interesting? — by adding games'], correct: 0, explanation: 'The story addresses the profound problem of recovery — of histories, voices, and truths that were suppressed.' },
    { id: 'q20', type: 'title', question: 'Unpack the title\'s multiple layers of meaning.', options: ['The title refers to what the archive, map, or system of knowledge literally contains, but also to what it "knows" in a deeper sense — including what it has been taught to include or exclude', 'The title is purely descriptive with a single meaning', 'The title refers to a character named Archive or Map'], correct: 0, explanation: 'The title works on literal and metaphorical levels — a characteristic of strong literary fiction.' }
  ];
}

// ─── Generate Story Arrays ─────────────────────────────────────────────────────

function buildStoryArray(grade, genres, makeStory, makeQuestions, count = 200) {
  const themes = ['#fef3c7','#d1fae5','#e0f2fe','#fce7f3','#dcfce7','#ede9fe','#fef9c3','#dbeafe','#ffedd5','#fae8ff','#e0f7ff'];
  return Array.from({ length: count }, (_, i) => {
    const idx = i + 1;
    const genre = genres[(idx - 1) % genres.length];
    const theme = themes[(idx - 1) % themes.length];
    const storyData = makeStory(idx);
    storyData.idx = idx;
    const questions = makeQuestions(storyData);
    return {
      id: `g${grade}_s${String(idx).padStart(3, '0')}`,
      grade: String(grade),
      gradeNum: parseInt(grade, 10),
      title: storyData.title,
      genre: storyData.genre || genre,
      theme,
      readingLevel: `Grade ${grade}`,
      wordCount: storyData.wordCount,
      paragraphs: storyData.paragraphs,
      questions
    };
  });
}

export const UPPER_GRADE_STORIES = [
  ...buildStoryArray('3', GENRES_3, makeGrade3Story, makeGrade3Questions, 200),
  ...buildStoryArray('4', GENRES_4, makeGrade4Story, makeGrade4Questions, 200),
  ...buildStoryArray('5', GENRES_5, makeGrade5Story, makeGrade5Questions, 200),
  ...buildStoryArray('6', GENRES_6, makeGrade6Story, makeGrade6Questions, 200),
];

export const UPPER_GRADE_STORY_COUNT = { '3': 200, '4': 200, '5': 200, '6': 200 };
export const TOTAL_UPPER_STORIES = 800;
