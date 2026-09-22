// Vocabulary, grammar, fill-in-the-blank and exam builders. All items share one shape:
//   { id, q, options:[...], answer:index, subject, explain? }         multiple choice
//   { id, q, accept:[...], subject, explain? }                         typed answer
import { makeRng, buildOptions, uniq, cap, normText, pad } from '../lib/rng.js';
import { gradeIdx, STORIES_PER_GRADE } from '../data/grades.js';
import { vocabFor } from '../data/vocab.js';
import { G3_QUIZ, G3_NOUNS, G3_PLURALS, G3_DAILY, G3_PDF_WORD_ROWS } from '../data/g3ela.js';
import { generateStory } from './stories.js';
import { generateMath, mathNo } from './math.js';

const mc = (r, id, q, a, wrong, subject, explain, n = 4) => {
  const w = uniq(wrong.filter((x) => x != null && String(x).toLowerCase() !== String(a).toLowerCase()));
  if (w.length < 2) return null;
  const { options, answer } = buildOptions(r, a, w, Math.min(n, w.length + 1));
  return { id, q, options, answer, subject, explain: explain || '' };
};

// ---------------------------------------------------------------- VOCABULARY
export function vocabQuiz(grade, count = 20, seed = 'v', extraWords = []) {
  const words = [...vocabFor(grade), ...extraWords];
  const r = makeRng(`${grade}|vocab|${seed}`);
  const n4 = grade === 'KG' || grade === 'G1' ? 3 : 4;
  // Kindergarten and Grade 1 are not old enough for the words "synonym", "antonym" or "part of
  // speech" — they only get the two simplest question types. Grade 2 gets the same idea, worded
  // in plain English. The technical terms start at Grade 3, where the curriculum teaches them.
  const kinds = gradeIdx(grade) <= 1 ? ['def', 'word'] : gradeIdx(grade) === 2 ? ['def', 'word', 'sameAs', 'oppositeOf', 'fill'] : ['def', 'word', 'syn', 'ant', 'fill', 'pos'];
  const out = [];
  const order = r.shuffle(words);
  let i = 0;
  while (out.length < count && i < count * 6) {
    const w = order[i % order.length];
    const kind = kinds[(i + Math.floor(i / order.length)) % kinds.length];
    const others = words.filter((x) => x.w !== w.w);
    let item = null;
    const id = `${grade}-V${pad(i)}`;
    if (kind === 'def') item = mc(r, id, `What does "${w.w}" mean?`, cap(w.def), others.map((x) => cap(x.def)), 'vocab', `${w.w}: ${w.def}`, n4);
    else if (kind === 'word') item = mc(r, id, `Which word means "${w.def}"?`, w.w, others.map((x) => x.w), 'vocab', `${w.w}: ${w.def}`, n4);
    else if (kind === 'sameAs' && w.syn.length) item = mc(r, id, `Which word means about the same as "${w.w}"?`, w.syn[0], [...others.flatMap((x) => x.ant), ...others.map((x) => x.w)].filter((x) => !w.syn.includes(x) && !w.ant.includes(x)), 'vocab', `${w.syn[0]} means about the same as ${w.w}.`, n4);
    else if (kind === 'oppositeOf' && w.ant.length) item = mc(r, id, `Which word means the opposite of "${w.w}"?`, w.ant[0], [...others.flatMap((x) => x.syn), ...others.map((x) => x.w)].filter((x) => !w.syn.includes(x) && !w.ant.includes(x)), 'vocab', `${w.ant[0]} is the opposite of ${w.w}.`, n4);
    else if (kind === 'syn' && w.syn.length) item = mc(r, id, `Which word is a synonym of "${w.w}"?`, w.syn[0], [...others.flatMap((x) => x.ant), ...others.map((x) => x.w)].filter((x) => !w.syn.includes(x) && !w.ant.includes(x)), 'vocab', `Synonyms of ${w.w}: ${w.syn.join(', ')}`, n4);
    else if (kind === 'ant' && w.ant.length) item = mc(r, id, `Which word is an antonym of "${w.w}"?`, w.ant[0], [...others.flatMap((x) => x.syn), ...others.map((x) => x.w)].filter((x) => !w.syn.includes(x) && !w.ant.includes(x)), 'vocab', `Antonyms of ${w.w}: ${w.ant.join(', ')}`, n4);
    else if (kind === 'fill' && w.ex && new RegExp(`\\b${w.w}\\b`, 'i').test(w.ex)) item = mc(r, id, w.ex.replace(new RegExp(`\\b${w.w}\\b`, 'i'), '_____'), w.w, others.filter((x) => x.pos === w.pos).map((x) => x.w).concat(others.map((x) => x.w)), 'vocab', w.ex, n4);
    else if (kind === 'pos' && gradeIdx(grade) >= 2) item = mc(r, id, `What part of speech is "${w.w}"?`, w.pos, ['noun', 'verb', 'adjective', 'adverb'], 'vocab', `${w.w} is a ${w.pos}.`, 4);
    if (item && !out.some((o) => o.q === item.q)) out.push(item);
    i++;
  }
  return out;
}

// ---------------------------------------------------------------- GRAMMAR
const PL = {
  s: ['cat', 'dog', 'book', 'hat', 'pen', 'cup', 'tree', 'frog', 'bird', 'star', 'desk', 'kite'],
  es: ['box', 'bus', 'dish', 'brush', 'church', 'watch', 'fox', 'dress', 'class', 'glass', 'wish', 'lunch', 'inch', 'ax'],
  ies: ['baby', 'lady', 'puppy', 'city', 'story', 'party', 'fly', 'berry', 'pony'],
  ves: ['leaf', 'wolf', 'shelf', 'knife', 'loaf', 'calf'],
  irr: [['child', 'children'], ['mouse', 'mice'], ['foot', 'feet'], ['tooth', 'teeth'], ['man', 'men'], ['woman', 'women'], ['goose', 'geese'], ['sheep', 'sheep']],
};
const plural = (w) => (PL.ies.includes(w) ? w.slice(0, -1) + 'ies' : PL.ves.includes(w) ? (w === 'knife' ? 'knives' : w === 'loaf' ? 'loaves' : w.replace(/f$/, 'ves')) : /(s|x|z|ch|sh)$/.test(w) ? w + 'es' : w + 's');
const PAST = {
  reg: ['walk', 'jump', 'play', 'help', 'look', 'kick', 'open', 'clean', 'paint', 'call', 'want', 'talk'],
  irr: [['run', 'ran'], ['go', 'went'], ['eat', 'ate'], ['see', 'saw'], ['sit', 'sat'], ['come', 'came'], ['give', 'gave'], ['make', 'made'], ['take', 'took'], ['write', 'wrote'], ['swim', 'swam'], ['fly', 'flew'], ['draw', 'drew'], ['grow', 'grew'], ['sing', 'sang']],
};
const SUBJ = ['The dog', 'My friend', 'Ava', 'The teacher', 'Our cat', 'Leo', 'The girl', 'A bird'];
const NOUNS = { 0: ['cat', 'dog', 'hat', 'ball', 'tree', 'book', 'fish', 'boy'], 1: ['teacher', 'school', 'garden', 'window', 'pencil', 'river', 'friend', 'kitchen'], 2: ['justice', 'harbor', 'discovery', 'courage', 'lantern', 'library', 'journey', 'evidence'] };
const VERBS = { 0: ['run', 'jump', 'sit', 'hop', 'eat', 'play', 'clap', 'sing'], 1: ['whisper', 'gather', 'climb', 'build', 'notice', 'giggle', 'wander', 'carry'], 2: ['examine', 'persuade', 'navigate', 'determine', 'conclude', 'investigate', 'explain', 'analyze'] };
const ADJS = { 0: ['big', 'red', 'small', 'happy', 'soft', 'tall', 'fast', 'wet'], 1: ['brave', 'gentle', 'colorful', 'enormous', 'curious', 'quiet', 'shiny', 'cheerful'], 2: ['reluctant', 'remarkable', 'fragile', 'vivid', 'ancient', 'meticulous', 'sincere', 'ambitious'] };
const ADVS = ['quickly', 'slowly', 'carefully', 'loudly', 'quietly', 'gently', 'happily', 'bravely'];
const PREPS = ['on', 'under', 'behind', 'beside', 'between', 'across', 'through', 'inside'];
const HOMO = [
  ['I put my coat over ____.', 'there', ['their', "they're"]], ['The kids left ____ bags at home.', 'their', ['there', "they're"]], ["____ going to the park later.", "They're", ['Their', 'There']],
  ['I want to go ____.', 'too', ['to', 'two']], ['I have ____ new pencils.', 'two', ['to', 'too']], ['Please give the book ____ her.', 'to', ['too', 'two']],
  ['Is this ____ jacket?', 'your', ["you're"]], ["____ my best friend.", "You're", ['Your']], ['The dog wagged ____ tail.', 'its', ["it's"]], ["____ a sunny day.", "It's", ['Its']],
  ['We swam in the ____.', 'sea', ['see']], ['I can ____ the bird.', 'see', ['sea']], ['Please ____ your name here.', 'write', ['right']], ['Turn ____ at the corner.', 'right', ['write']],
  ['Come ____ and sit down.', 'here', ['hear']], ['I can ____ the music.', 'hear', ['here']], ['I ____ the answer.', 'know', ['no']], ['She said ____ to the cake.', 'no', ['know']],
  ['We eat ____ for dinner.', 'meat', ['meet']], ['Nice to ____ you.', 'meet', ['meat']], ['The wind ____ my hat off.', 'blew', ['blue']], ['The sky is ____.', 'blue', ['blew']],
  ['I ate the ____ pizza.', 'whole', ['hole']], ['The mole dug a ____.', 'hole', ['whole']], ['We ____ for the bus.', 'wait', ['weight']], ['We found ____ at last.', 'peace', ['piece']], ['I ate one ____ of pie.', 'piece', ['peace']],
];
const CONTR = [['do not', "don't"], ['can not', "can't"], ['is not', "isn't"], ['I am', "I'm"], ['she is', "she's"], ['we are', "we're"], ['they are', "they're"], ['will not', "won't"], ['did not', "didn't"], ['it is', "it's"], ['you have', "you've"], ['I will', "I'll"], ['would not', "wouldn't"], ['should have', "should've"]];
const CONJ = [
  ['I was tired, ____ I went to bed early.', 'so', ['but', 'or', 'because']], ['I wanted to play, ____ it was raining.', 'but', ['so', 'and', 'because']],
  ['We can walk ____ we can ride the bus.', 'or', ['so', 'but', 'because']], ['She smiled ____ she won the prize.', 'because', ['but', 'or', 'so']],
  ['Ben likes apples ____ pears.', 'and', ['but', 'because', 'or']], ['I will stay inside ____ the rain stops.', 'until', ['and', 'but', 'so']],
  ['The soup was hot, ____ I waited before eating it.', 'so', ['but', 'or', 'unless']], ['You may go to the park ____ you finish your homework first.', 'if', ['but', 'or', 'because']],
  ['____ it was cold, we went for a walk.', 'Although', ['Because', 'So', 'Or']], ['Neither the coach ____ the players saw it.', 'nor', ['or', 'and', 'but']],
];
const FRAG = [
  ['The big dog barked loudly.', ['Barked loudly at the mailman.', 'The big brown.', 'Running down the street fast.']],
  ['My sister reads every night.', ['Every night before bed.', 'Reads a big book.', 'And then went upstairs.']],
  ['The class visited the museum.', ['Visited the museum on Friday.', 'Because it was raining.', 'The old building on the hill.']],
  ['We finished our project early.', ['Finished early.', 'Our project about frogs.', 'When the bell rang.']],
  ['After lunch, the kids played outside.', ['After lunch.', 'Played outside in the sun.', 'The kids at the park.']],
];
const RUNON = [
  ['I like pizza, and my brother likes pasta.', 'I like pizza my brother likes pasta.'], ['It was late, so we went home.', 'It was late we went home.'],
  ['She studied hard, and she passed the test.', 'She studied hard she passed the test.'], ['The storm ended, and the sun came out.', 'The storm ended the sun came out.'],
];
const FIG = [
  ['The wind whispered through the trees.', 'personification', ['simile', 'metaphor', 'idiom']], ['She was as quiet as a mouse.', 'simile', ['metaphor', 'personification', 'idiom']],
  ['The classroom was a zoo.', 'metaphor', ['simile', 'idiom', 'personification']], ['It is raining cats and dogs.', 'idiom', ['simile', 'metaphor', 'personification']],
  ['His smile was as bright as the sun.', 'simile', ['metaphor', 'idiom', 'personification']], ['Time is a thief.', 'metaphor', ['simile', 'idiom', 'personification']],
  ['The old car coughed and groaned up the hill.', 'personification', ['simile', 'idiom', 'metaphor']], ['Break a leg at the show tonight!', 'idiom', ['simile', 'metaphor', 'personification']],
];
const PERF = [['She has ____ her homework.', 'finished', ['finish', 'finishing', 'finishes']], ['They have ____ the tickets already.', 'bought', ['buy', 'buyed', 'buying']], ['He had ____ before we arrived.', 'left', ['leave', 'leaved', 'leaving']], ['We have ____ this song many times.', 'sung', ['sang', 'sing', 'singed']], ['I have ____ that movie twice.', 'seen', ['saw', 'see', 'seed']], ['The bird has ____ away.', 'flown', ['flew', 'fly', 'flied']]];
const PRON = [
  ['Mia and ____ went to the park.', 'I', ['me', 'myself']], ['Dad drove Ben and ____ to school.', 'me', ['I', 'myself']], ['____ and Leo made a fort.', 'She', ['Her', 'Hers']], ['The teacher gave the prize to Ava and ____.', 'him', ['he', 'his']],
  ['The book is ____.', 'mine', ['me', 'my']], ['Sam hurt ____ while climbing.', 'himself', ['hisself', 'him']], ['Give the notes to Zoe and ____.', 'her', ['she', 'hers']], ['____ are going to the fair.', 'They', ['Them', 'Their']],
];
const POSS = [['the bone that belongs to the dog', "the dog's bone", ['the dogs bone', 'the dog bone’s']], ['the toys that belong to two kids', "the kids' toys", ["the kid's toys", 'the kids toys’']], ['the hat that belongs to Mia', "Mia's hat", ['Mias hat', "Mias' hat"]], ['the wings of the birds', "the birds' wings", ["the bird's wings", 'the birds wings']]];
const PUNCT = [
  ['Where is my hat', '?', ['.', '!']], ['I love this song', '!', ['.', '?']], ['We went to the zoo', '.', ['?', '!']], ['What time is it', '?', ['.', '!']], ['Watch out', '!', ['.', '?']], ['The bus is late', '.', ['?', '!']],
];
const CAPS = [
  ['my friend lives in ohio.', 'My friend lives in Ohio.', ['my friend lives in Ohio.', 'My Friend lives in ohio.']], ['on monday we visit grandma.', 'On Monday we visit Grandma.', ['On monday we visit grandma.', 'on Monday we visit Grandma.']],
  ['we read the book charlotte’s web.', 'We read the book Charlotte’s Web.', ['we read the book charlotte’s web.', 'We read the Book charlotte’s web.']], ['mrs. lee lives on oak street.', 'Mrs. Lee lives on Oak Street.', ['mrs. lee lives on oak street.', 'Mrs. lee lives on Oak street.']],
];
const COMMA = [['We bought apples bananas and grapes.', 'We bought apples, bananas, and grapes.', ['We bought, apples bananas and grapes.', 'We bought apples bananas, and, grapes.']], ['After lunch we played outside.', 'After lunch, we played outside.', ['After, lunch we played outside.', 'After lunch we, played outside.']], ['However the game was not over.', 'However, the game was not over.', ['However the, game was not over.', 'However the game, was not over.']], ['My friend Sam who lives next door is nice.', 'My friend Sam, who lives next door, is nice.', ['My friend Sam who, lives next door is nice.', 'My friend, Sam who lives next door is nice.']]];
const SVA = [['The dogs ____ in the yard.', 'play', ['plays', 'playing']], ['My brother ____ soccer.', 'plays', ['play', 'playing']], ['The birds ____ every morning.', 'sing', ['sings', 'singing']], ['She ____ to school each day.', 'walks', ['walk', 'walking']], ['The books on the shelf ____ old.', 'are', ['is', 'be']], ['Each of the students ____ a pencil.', 'has', ['have', 'having']], ['Neither of the boys ____ ready.', 'was', ['were', 'are']], ['The team ____ practicing today.', 'is', ['are', 'be']]];
const AFFIX = [['unhappy', 'not happy', ['very happy', 'happy again']], ['redo', 'do again', ['do not', 'do first']], ['careful', 'full of care', ['without care', 'care again']], ['hopeless', 'without hope', ['full of hope', 'hope again']], ['unlock', 'to open', ['to lock again', 'to lock']], ['preview', 'see before', ['see again', 'see after']], ['helpful', 'full of help', ['without help', 'help again']], ['disagree', 'not agree', ['agree again', 'agree very much']]];
const COMP = [['tall', 'taller', 'tallest'], ['fast', 'faster', 'fastest'], ['big', 'bigger', 'biggest'], ['small', 'smaller', 'smallest'], ['happy', 'happier', 'happiest'], ['long', 'longer', 'longest'], ['hot', 'hotter', 'hottest'], ['kind', 'kinder', 'kindest']];
const PREPQ = [['The cat sat on the mat.', 'on'], ['She walked across the bridge.', 'across'], ['He hid behind the door.', 'behind'], ['We waited beside the gate.', 'beside'], ['The bird flew over the house.', 'over'], ['They ran through the park.', 'through']];

function gen(r, kind, tier, id) {
  const sub = 'grammar';
  switch (kind) {
    case 'aAn': { const w = r.pick(['apple', 'egg', 'ball', 'owl', 'cat', 'ice cream', 'orange', 'dog', 'umbrella', 'hat', 'elephant', 'bus', 'igloo', 'pen', 'ant', 'kite']); const a = /^[aeiou]/.test(w) ? 'an' : 'a'; return mc(r, id, `Which word goes in the blank? ____ ${w}`, a, ['a', 'an', 'the'], sub, `Use "an" before a vowel sound.`, 3); }
    case 'plS': { const w = r.pick(PL.s); return mc(r, id, `One ${w}, two ____.`, w + 's', [w, w + 'es', w + "'s"], sub, `Add -s: ${w}s.`); }
    case 'plEs': { const w = r.pick(PL.es); return mc(r, id, `One ${w}, two ____.`, w + 'es', [w + 's', w, w + "'s"], sub, `Words ending in ch, sh, s, x, z add -es: ${w}es.`); }
    case 'plIes': { const w = r.pick(PL.ies); const p = plural(w); return mc(r, id, `One ${w}, two ____.`, p, [w + 's', w + "'s", w.slice(0, -1) + 'es'], sub, `Change y to i and add -es: ${p}.`); }
    case 'plVes': { const w = r.pick(PL.ves); const p = plural(w); return mc(r, id, `One ${w}, two ____.`, p, [w + 's', w + 'es', w + "'s"], sub, `Change f to v and add -es: ${p}.`); }
    case 'plIrr': { const [s, p] = r.pick(PL.irr); return mc(r, id, `One ${s}, two ____.`, p, [s + 's', s + 'es', s.slice(0, -1) + 'ies'], sub, `${s} is an irregular plural: ${p}.`); }
    case 'pastReg': { const w = r.pick(PAST.reg); const p = w.endsWith('e') ? w + 'd' : w + 'ed'; return mc(r, id, `Yesterday, I ____ (${w}).`, p, [w, w + 'ing', w + 's'], sub, `Add -ed: ${p}.`); }
    case 'pastIrr': { const [b, p] = r.pick(PAST.irr); return mc(r, id, `Yesterday, we ____ (${b}).`, p, [b + 'ed', b, b + 'ing'], sub, `${b} → ${p} is an irregular past tense.`); }
    case 'isAre': { const s = r.pick([['The dog', 'is'], ['The dogs', 'are'], ['My friends', 'are'], ['My friend', 'is'], ['The birds', 'are'], ['The bird', 'is']]); return mc(r, id, `${s[0]} ____ big.`, s[1], ['is', 'are', 'am'].filter((x) => x !== s[1]).concat(['be']), sub, `Use "${s[1]}" with ${s[0].toLowerCase()}.`, 3); }
    case 'capital': { const [w, ok, bad] = r.pick(CAPS); return mc(r, id, 'Which sentence is written correctly?', ok, bad, sub, ok); }
    case 'punct': { const [s, ok, bad] = r.pick(PUNCT); return mc(r, id, `Which mark goes at the end? "${s}____"`, ok, bad, sub, `"${s}${ok}"`, 3); }
    case 'noun': { const t = Math.min(tier, 2); const w = r.pick(NOUNS[t]); return mc(r, id, 'Which word is a noun (a person, place, or thing)?', w, [r.pick(VERBS[t]), r.pick(ADJS[t]), r.pick(ADVS)], sub, `${w} names a person, place, or thing.`); }
    case 'verb': { const t = Math.min(tier, 2); const w = r.pick(VERBS[t]); return mc(r, id, 'Which word is a verb (an action word)?', w, [r.pick(NOUNS[t]), r.pick(ADJS[t]), r.pick(ADVS)], sub, `${w} is an action.`); }
    case 'adj': { const t = Math.min(tier, 2); const w = r.pick(ADJS[t]); return mc(r, id, 'Which word is an adjective (a describing word)?', w, [r.pick(NOUNS[t]), r.pick(VERBS[t]), r.pick(ADVS)], sub, `${w} describes a noun.`); }
    case 'adv': { const w = r.pick(ADVS); return mc(r, id, 'Which word is an adverb (tells how)?', w, [r.pick(NOUNS[1]), r.pick(VERBS[1]), r.pick(ADJS[1])], sub, `${w} tells how something is done.`); }
    case 'homo': { const [s, a, w] = r.pick(HOMO); return mc(r, id, `Choose the right word: ${s}`, a, w, sub, s.replace('____', a), 3 + (w.length > 2 ? 1 : 0)); }
    case 'contr': { const [a, b] = r.pick(CONTR); return mc(r, id, `What is the contraction for "${a}"?`, b, CONTR.map((x) => x[1]), sub, `${a} → ${b}`); }
    case 'conj': { const [s, a, w] = r.pick(CONJ); return mc(r, id, `Choose the best word: ${s}`, a, w, sub, s.replace('____', a)); }
    case 'frag': { const [ok, bad] = r.pick(FRAG); return mc(r, id, 'Which one is a complete sentence?', ok, bad, sub, 'A complete sentence has a subject and a verb and tells a whole idea.'); }
    case 'runon': { const [ok, bad] = r.pick(RUNON); return mc(r, id, 'Which sentence is correct (not a run-on)?', ok, [bad, bad.replace(/ /, ' and ')], sub, 'Join two sentences with a comma and a joining word.', 3); }
    case 'fig': { const [s, a, w] = r.pick(FIG); return mc(r, id, `What kind of language is this? "${s}"`, a, w, sub, `${cap(a)}: ${s}`); }
    case 'perf': { const [s, a, w] = r.pick(PERF); return mc(r, id, `Choose the right verb: ${s}`, a, w, sub, s.replace('____', a)); }
    case 'pron': { const [s, a, w] = r.pick(PRON); return mc(r, id, `Choose the right word: ${s}`, a, w, sub, s.replace('____', a), 3 + (w.length > 2 ? 1 : 0)); }
    case 'poss': { const [s, ok, bad] = r.pick(POSS); return mc(r, id, `Which shows ownership? ${s}`, ok, bad, sub, ok); }
    case 'comma': { const [s, ok, bad] = r.pick(COMMA); return mc(r, id, 'Which sentence uses commas correctly?', ok, bad, sub, ok); }
    case 'sva': { const [s, a, w] = r.pick(SVA); return mc(r, id, `Choose the right verb: ${s}`, a, w, sub, s.replace('____', a), 3 + (w.length > 2 ? 1 : 0)); }
    case 'affix': { const [w, a, wr] = r.pick(AFFIX); return mc(r, id, `What does "${w}" mean?`, a, wr, sub, `${w} = ${a}`, 4); }
    case 'comp': { const [b, c, s] = r.pick(COMP); const t = r.chance(0.5); return mc(r, id, t ? `Ava is ____ than Ben. (${b})` : `Of all three, Ava is the ____. (${b})`, t ? c : s, [t ? s : c, b, b + 'ly'], sub, t ? `${b} → ${c} compares two.` : `${b} → ${s} compares three or more.`, 4); }
    case 'prep': { const [s, a] = r.pick(PREPQ); return mc(r, id, `Which word is a preposition? "${s}"`, a, s.replace(/[.]/g, '').split(' ').filter((x) => x.toLowerCase() !== a && x.length > 2 && !/^(the|and)$/i.test(x)), sub, `${a} shows where or when.`, 4); }
    case 'g3-abs': { const abs = r.chance(0.5); const list = abs ? G3_NOUNS.abstract : G3_NOUNS.concrete; const opp = abs ? G3_NOUNS.concrete : G3_NOUNS.abstract; const w = r.pick(list); return mc(r, id, `Is "${w}" a concrete noun or an abstract noun?`, abs ? 'Abstract noun' : 'Concrete noun', ['Abstract noun', 'Concrete noun', 'Verb', 'Adjective'].filter((x) => x !== (abs ? 'Abstract noun' : 'Concrete noun')), sub, abs ? `${w} is an idea or feeling you cannot touch.` : `${w} is something you can see or touch.`, 3); }
    case 'g3-pl': { const p = r.pick(G3_PLURALS); return mc(r, id, `What is the plural of "${p.sg}"?`, p.pl, [p.sg + 's', p.sg + "'s", p.sg + 'ies'], sub, `${p.rule}: ${p.pl}`); }
    case 'g3-title': { const d = r.pick(G3_DAILY); const t = d.title.answers[0]; return mc(r, id, `Which is the correct book title?`, t, [t.toLowerCase(), t.replace(/\b(\w)/g, (m) => m.toLowerCase()).replace(/^\w/, (m) => m.toUpperCase()), t.toUpperCase()].filter((x) => x !== t), sub, `Capitalize the first word and all important words: ${t}`, 3); }
    case 'g3-pron-ant': { const d = r.pick(G3_DAILY); const p = d.pronoun; const pool = G3_DAILY.map((x) => x.pronoun.answer); return mc(r, id, `${p.text}\nWho or what does "${p.underlined}" mean?`, p.answer, pool, sub, `${p.underlined} = ${p.answer}`); }
    default: return null;
  }
}

const GRAMMAR_KINDS = {
  KG: ['aAn', 'plS', 'isAre', 'capital', 'punct', 'noun', 'verb', 'aAn', 'plS', 'punct'],
  G1: ['aAn', 'plS', 'plEs', 'isAre', 'capital', 'punct', 'noun', 'verb', 'adj', 'pastReg', 'contr', 'homo'],
  G2: ['plEs', 'plIes', 'plIrr', 'pastReg', 'pastIrr', 'contr', 'homo', 'noun', 'verb', 'adj', 'capital', 'comma', 'comp', 'affix', 'conj'],
  G3: ['g3-pl', 'g3-abs', 'g3-title', 'g3-pron-ant', 'plEs', 'plIes', 'pron', 'sva', 'homo', 'comp', 'affix', 'conj', 'adv', 'capital', 'plIrr'],
  G4: ['prep', 'adv', 'poss', 'homo', 'comma', 'frag', 'runon', 'sva', 'conj', 'fig', 'plVes', 'pastIrr', 'pron'],
  G5: ['perf', 'conj', 'comma', 'prep', 'fig', 'sva', 'runon', 'frag', 'homo', 'poss', 'pron', 'adv'],
  G6: ['pron', 'fig', 'comma', 'sva', 'perf', 'runon', 'conj', 'frag', 'poss', 'homo', 'prep', 'affix'],
};

export function grammarQuiz(grade, count = 20, seed = 'g') {
  const g = gradeIdx(grade);
  const kinds = GRAMMAR_KINDS[grade] || GRAMMAR_KINDS.G3;
  const r = makeRng(`${grade}|grammar|${seed}`);
  const out = [];
  let i = 0;
  while (out.length < count && i < count * 8) {
    const kind = kinds[i % kinds.length];
    const item = gen(r, kind, g <= 1 ? 0 : g <= 3 ? 1 : 2, `${grade}-G${pad(i)}`);
    if (item && !out.some((o) => o.q === item.q)) out.push(item);
    i++;
  }
  return out;
}
// A fixed bank of 50 per grade (used by the index / study screens)
export const grammarBank = (grade) => grammarQuiz(grade, 50, 'bank');

// ---------------------------------------------------------------- FILL IN THE BLANK
const cloze = (grade, n) => {
  const s = generateStory(grade, n);
  const r = makeRng(`${grade}|fill|${n}`);
  const minLen = grade === 'KG' ? 3 : 4;
  const sents = s.paragraphs.join(' ').split(/(?<=[.!?])\s+/).filter((x) => x.split(' ').length >= 5);
  if (!sents.length) return null;
  const sent = sents[(n * 3) % sents.length];
  const toks = sent.split(' ');
  const cand = toks.map((w, i) => ({ w: w.replace(/[^A-Za-z-]/g, ''), i })).filter((o) => o.w.length >= minLen && o.w === o.w.toLowerCase() && !/^(said|that|then|with|there|they|this|from|were|have|when|what|were)$/.test(o.w));
  if (!cand.length) return null;
  const pick = cand[Math.abs(hash(sent)) % cand.length];
  const pool = uniq(s.text.split(/\s+/).map((w) => w.replace(/[^A-Za-z-]/g, '')).filter((w) => w.length >= minLen && w === w.toLowerCase() && w !== pick.w));
  const q = toks.map((w, i) => (i === pick.i ? w.replace(pick.w, '_____') : w)).join(' ');
  return mc(r, `${grade}-F${pad(n)}`, q, pick.w, pool, 'fill', sent, grade === 'KG' || grade === 'G1' ? 3 : 4);
};
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; };

export const fillItem = (grade, n) => cloze(grade, n) || cloze(grade, ((n + 1) % STORIES_PER_GRADE) + 1);
export const fillLevel = (grade, level) => Array.from({ length: 10 }, (_, i) => fillItem(grade, (level - 1) * 10 + i + 1)).filter(Boolean);
export function vocabFill(grade, count = 10, seed = 'vf') {
  return vocabQuiz(grade, count * 3, seed).filter((x) => x.q.includes('_____')).slice(0, count).map((x) => ({ ...x, subject: 'fill' }));
}

// ---------------------------------------------------------------- GRADE 3 PDF PRACTICE (exact sections A-D)
export function g3PdfQuiz(section) {
  const S = G3_QUIZ[section];
  const id = (i) => `G3-PDF-${section}${i + 1}`;
  if (section === 'A') return S.items.map((it, i) => { const opt = S.options.map((o) => `${o[0]}. ${o[1]}`); const idx = S.options.findIndex((o) => o[0] === it.a); return { id: id(i), q: it.q, options: opt, answer: idx, subject: 'vocab', explain: `${S.options[idx][1]}: ${it.q}` }; });
  if (section === 'B' || section === 'D') return S.items.map((it, i) => ({ id: id(i), q: it.q, options: it.o, answer: it.a, subject: section === 'B' ? 'vocab' : 'grammar', explain: it.o[it.a] }));
  if (section === 'C') return S.items.map((it, i) => ({ id: id(i), q: it.q.replace('____', '_____'), options: S.wordBox.slice(), answer: S.wordBox.indexOf(it.a), subject: 'fill', explain: it.q.replace('____', it.a) }));
  return [];
}
export const g3PdfAll = () => ['A', 'B', 'C', 'D'].flatMap(g3PdfQuiz);

// ---------------------------------------------------------------- EXAM
export const EXAM_SUBJECTS = [
  { key: 'reading', label: 'Reading' }, { key: 'math', label: 'Math' }, { key: 'vocab', label: 'Vocabulary' }, { key: 'grammar', label: 'Grammar' }, { key: 'fill', label: 'Fill in the blank' }, { key: 'custom', label: 'My own questions' },
];

export function buildExam({ grade, size = 20, subjects = ['reading', 'math', 'vocab', 'grammar', 'fill'], maxLevel = 50, minLevel = 1, custom = [], extraWords = [], seed }) {
  const r = makeRng(`${grade}|exam|${seed ?? Date.now()}`);
  const subs = subjects.filter((s) => s !== 'custom' || custom.length);
  const per = Math.max(1, Math.floor(size / subs.length));
  const items = [];
  for (const sub of subs) {
    let list = [];
    if (sub === 'reading') {
      const ns = r.sample(Array.from({ length: (maxLevel - minLevel + 1) * 10 }, (_, i) => (minLevel - 1) * 10 + i + 1), 6);
      list = ns.flatMap((n) => generateStory(grade, n).questions.filter((q) => q.set === 1 || r.chance(0.6)).map((q) => ({ id: `${grade}-S${n}-${q.id}`, q: q.q, options: q.options, answer: q.answer, subject: 'reading', source: generateStory(grade, n).title })));
    } else if (sub === 'math') {
      list = r.sample(Array.from({ length: (maxLevel - minLevel + 1) * 10 }, (_, i) => (minLevel - 1) * 10 + i + 1), per + 2).map((n) => generateMath(grade, n)).filter(Boolean).map((m) => ({ id: m.id, q: m.q, options: m.options, answer: m.answer, subject: 'math', explain: m.explain }));
    } else if (sub === 'vocab') list = vocabQuiz(grade, per + 4, `exam${seed ?? Date.now()}`, extraWords);
    else if (sub === 'grammar') list = grammarQuiz(grade, per + 4, `exam${seed ?? Date.now()}`);
    else if (sub === 'fill') list = r.sample(Array.from({ length: (maxLevel - minLevel + 1) * 10 }, (_, i) => (minLevel - 1) * 10 + i + 1), per + 4).map((n) => fillItem(grade, n)).filter(Boolean);
    else if (sub === 'custom') list = r.shuffle(custom);
    items.push(...r.shuffle(list).slice(0, per));
  }
  // top up to requested size
  const pool = r.shuffle(vocabQuiz(grade, 20, 'top').concat(grammarQuiz(grade, 20, 'top')));
  for (const p of pool) if (items.length < size && !items.some((x) => x.q === p.q)) items.push(p);
  return r.shuffle(items).slice(0, size).map((x, i) => ({ ...x, id: `${x.id}#${i}` }));
}

// Convert custom (Studio / Extractor) items into runner items.
// Text answers with a choice list are shuffled (deterministically) so the answer is not always first.
export function customToItems(list) {
  return list.map((c) => {
    const base = { id: c.id, q: c.q || c.sentence, subject: c.subject || 'custom', explain: c.explain || '', custom: true };
    if (c.options && c.options.length >= 2) {
      if (typeof c.answer === 'number') return { ...base, options: c.options, answer: c.answer };
      const ans = String(c.answer || '');
      const opts = uniq([ans, ...c.options].filter(Boolean));
      const r = makeRng('c|' + c.id);
      const sh = r.shuffle(opts);
      return { ...base, options: sh, answer: Math.max(0, sh.findIndex((o) => normText(o) === normText(ans))) };
    }
    return { ...base, accept: [].concat(c.answer, c.accept || []).filter((x) => x !== undefined && x !== '').map(String) };
  });
}
