// Math question generator. generateMath(grade, 1..500) is deterministic. Each level has 10 questions;
// numbers grow with the level inside the grade, and topics unlock with the level.
// Wrong choices are built from common mistakes (wrong operation, off by one, forgot to carry...).
import { makeRng, buildOptions, uniq, cap } from '../lib/rng.js';
import { gradeIdx, MATH_PER_LEVEL, STORIES_PER_GRADE } from '../data/grades.js';

const NAMES = ['Mia', 'Leo', 'Ava', 'Sam', 'Zoe', 'Ben', 'Nora', 'Omar', 'Ella', 'Theo', 'Ruby', 'Kai', 'Lina', 'Owen', 'Maya', 'Finn'];
const THINGS = ['apples', 'stickers', 'marbles', 'books', 'cards', 'cookies', 'shells', 'pencils', 'balloons', 'coins', 'stamps', 'crayons'];
const FRUITS = ['🍎', '🍌', '🍓', '🐟', '⭐', '🐞', '🌼', '🎈'];
const fmt = (n) => String(n);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a * b) / gcd(a, b);
const rg = (r, d, lo, easy, hard) => r.int(lo, Math.max(lo, Math.round(easy + (hard - easy) * d)));
const comma = (n) => n.toLocaleString('en-US');

// numeric choices: `extra` are mistake-based distractors, then nearby numbers
function num(r, a, extra = [], o = {}) {
  const f = o.fmt || fmt;
  const near = o.int === false ? [a + 0.1, a - 0.1, a * 10, a / 10, a + 1, a - 1] : a <= 20 ? [a + 1, a - 1, a + 2, a - 2, a + 3, a - 3] : [a + 1, a - 1, a + 2, a - 2, a + 10, a - 10, a * 2];
  const wrong = [...extra, ...near].filter((x) => Number.isFinite(x) && x !== a && (o.neg || x >= 0)).map((x) => f(o.int === false ? +x.toFixed(4) : x));
  return { a: f(a), wrong: uniq(wrong) };
}
const txt = (a, wrong) => ({ a, wrong });

// ---------------------------------------------------------------- KINDERGARTEN
const SHAPES = [['circle', 0, 'round'], ['triangle', 3, 'sides'], ['square', 4, 'equal sides'], ['rectangle', 4, 'sides'], ['hexagon', 6, 'sides']];
const NUMWORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const COLORS = [['red', '🔴'], ['orange', '🟠'], ['yellow', '🟡'], ['green', '🟢'], ['blue', '🔵'], ['purple', '🟣'], ['brown', '🟤'], ['black', '⚫'], ['white', '⚪']];
const SHAPE_PICS = [['circle', '⚪'], ['square', '⬜'], ['triangle', '🔺'], ['star', '⭐'], ['heart', '❤️'], ['diamond', '🔷']];
const COINS = [['penny', '1 cent'], ['nickel', '5 cents'], ['dime', '10 cents'], ['quarter', '25 cents']];
// Grade 1's highest-frequency sight words, each in a short original sentence a beginning
// reader can decode: the, and, is, you, said, like, see, we, go, my, a, to, was, are.
const SIGHT_SENT = [
  ['I ___ to the park.', 'go', ['see', 'is', 'the']],
  ['___ dog is big.', 'The', ['And', 'You', 'We']],
  ['I ___ a red ball.', 'see', ['go', 'is', 'my']],
  ['We ___ happy today.', 'are', ['go', 'see', 'my']],
  ['This is ___ cat.', 'my', ['the', 'and', 'you']],
  ['Sam ___ Ann can play.', 'and', ['is', 'my', 'go']],
  ['___ can run fast.', 'You', ['The', 'We', 'My']],
  ['It ___ a sunny day.', 'is', ['go', 'see', 'are']],
  ['I want ___ read my book.', 'to', ['is', 'my', 'the']],
  ['This ___ my dog.', 'is', ['are', 'to', 'the']],
  ['"I like it," she ___.', 'said', ['see', 'go', 'my']],
  ['We ___ playing in the sun.', 'like', ['said', 'go', 'the']],
];
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LETTER_WORDS = { A: 'apple', B: 'ball', C: 'cat', D: 'dog', E: 'egg', F: 'fish', G: 'goat', H: 'hat', I: 'ice', J: 'jam', K: 'kite', L: 'lion', M: 'moon', N: 'nest', O: 'owl', P: 'pig', Q: 'queen', R: 'rain', S: 'sun', T: 'top', U: 'up', V: 'van', W: 'web', X: 'x-ray', Y: 'yarn', Z: 'zoo' };
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const KG = [
  [1, (r, d) => { const n = rg(r, d, 1, 5, 12), e = r.pick(FRUITS); return { q: `How many? ${e.repeat(n)}`, ...num(r, n), ex: `Count each one: ${n}.` }; }],
  [1, (r, d) => { const a = rg(r, d, 1, 3, 6), b = rg(r, d, 1, 2, 4), e = r.pick(FRUITS); return { q: `${e.repeat(a)} + ${e.repeat(b)} = ?`, ...num(r, a + b, [Math.abs(a - b)]), ex: `${a} + ${b} = ${a + b}.` }; }],
  [1, (r, d) => { const a = rg(r, d, 2, 5, 10), b = r.int(1, a - 1); return { q: `${a} − ${b} = ?`, ...num(r, a - b, [a + b]), ex: `${a} take away ${b} leaves ${a - b}.` }; }],
  [1, (r, d) => { const a = rg(r, d, 1, 6, 15); let b = r.int(1, Math.max(a + 3, 5)); if (b === a) b++; return { q: `Which number is bigger? ${a} or ${b}`, ...num(r, Math.max(a, b), [Math.min(a, b)]), ex: `${Math.max(a, b)} is bigger.` }; }],
  [1, (r) => { const s = r.pick(SHAPES.slice(1)); return { q: `How many sides does a ${s[0]} have?`, ...num(r, s[1], [3, 4, 5, 2]), ex: `A ${s[0]} has ${s[1]} sides.` }; }],
  [2, (r, d) => { const n = rg(r, d, 1, 8, 18); return { q: `What number comes after ${n}?`, ...num(r, n + 1, [n - 1, n]), ex: `After ${n} comes ${n + 1}.` }; }],
  [2, (r, d) => { const n = rg(r, d, 2, 8, 19); return { q: `What number comes before ${n}?`, ...num(r, n - 1, [n + 1, n]), ex: `Before ${n} comes ${n - 1}.` }; }],
  [3, (r, d) => { const n = r.int(1, 10); return { q: `Which number is the word "${NUMWORDS[n]}"?`, ...num(r, n, [n + 1, n - 1, n + 10].filter((x) => x <= 20)), ex: `${NUMWORDS[n]} is ${n}.` }; }],
  [3, (r, d) => { const n = r.int(0, 10); return { q: `How do you write ${n} in words?`, ...txt(NUMWORDS[n], uniq([NUMWORDS[n + 1], NUMWORDS[Math.max(0, n - 1)], NUMWORDS[Math.min(10, n + 2)], NUMWORDS[Math.max(0, n - 2)]].filter(Boolean))), ex: `${n} is ${NUMWORDS[n]}.` }; }],
  [4, (r) => { const a = r.int(1, 9); return { q: `${a} + ? = 10`, ...num(r, 10 - a, [a, 10 - a + 1]), ex: `${a} and ${10 - a} make 10.` }; }],
  [5, (r) => { const s = r.pick([2, 5, 10]), st = r.int(1, 4), seq = [0, 1, 2, 3].map((i) => s * (st + i)); return { q: `Count by ${s}s: ${seq[0]}, ${seq[1]}, ${seq[2]}, ?`, ...num(r, seq[3], [seq[2] + 1, seq[2] + s + 1]), ex: `Add ${s} each time: ${seq[3]}.` }; }],
  [6, (r, d) => { const a = r.int(10, 19); return { q: `10 + ${a - 10} = ?`, ...num(r, a, [a - 1, a + 1, 10]), ex: `10 and ${a - 10} more is ${a}.` }; }],
  [7, (r) => { const a = r.int(2, 8), b = r.int(1, 5); return { q: `Which has MORE? ${r.pick(FRUITS).repeat(a)} or ${r.pick(FRUITS).repeat(b + (a === b ? 1 : 0))}`, ...txt(a > b + (a === b ? 1 : 0) ? 'The first group' : 'The second group', ['The first group', 'The second group', 'They are the same'].filter((x) => x !== (a > b + (a === b ? 1 : 0) ? 'The first group' : 'The second group'))), ex: 'Count both groups and compare.' }; }],
  [2, (r) => { const es = r.shuffle(FRUITS).slice(0, 4), k = r.int(1, 4), ord = ['1st', '2nd', '3rd', '4th'][k - 1]; return { q: `Look at the line: ${es.join(' ')}  Which one is ${ord}?`, ...txt(es[k - 1], es.filter((_, i) => i !== k - 1).concat(FRUITS.filter((x) => !es.includes(x)))), ex: `Count from the left: ${ord} is ${es[k - 1]}.` }; }],
  [2, (r) => { const n = r.int(1, 9), more = r.chance(0.5); return { q: `What is one ${more ? 'more' : 'less'} than ${n + (more ? 0 : 1)}?`, ...num(r, more ? n + 1 : n, [n + 2, n - 1, n + (more ? 0 : 2)]), ex: `${more ? 'One more' : 'One less'}.` }; }],
  [3, (r) => { const [a, b] = r.shuffle(FRUITS).slice(0, 2), rep = r.int(2, 3); const seq = Array.from({ length: rep * 2 }, (_, i) => (i % 2 ? b : a)).join(' '); return { q: `What comes next? ${seq} ?`, ...txt(a, [b, ...FRUITS.filter((x) => x !== a && x !== b)]), ex: `The pattern repeats ${a} ${b}.` }; }],
  [4, (r) => { const n = r.int(2, 9); return { q: `A ten frame has ${n} dots. How many empty spaces are left?`, ...num(r, 10 - n, [n, 10 - n + 1, 10]), ex: `10 − ${n} = ${10 - n}.` }; }],
  [4, (r) => { const a = r.int(3, 8), b = r.int(1, a - 1), e = r.pick(FRUITS); return { q: `${e.repeat(a)} and ${e.repeat(b)}. How many MORE are in the first group?`, ...num(r, a - b, [b, a, a + b]), ex: `${a} − ${b} = ${a - b}.` }; }],
  [5, (r) => { const a = r.int(2, 9), seq = [a, a + 1, a + 2]; return { q: `Count on: ${seq.join(', ')}, ?`, ...num(r, a + 3, [a + 4, a + 2, a]), ex: `${a + 3} comes next.` }; }],
  [5, (r) => { const a = r.int(1, 7); return { q: `What number is missing? ${a}, ?, ${a + 2}`, ...num(r, a + 1, [a, a + 2, a + 3]), ex: `${a + 1} goes in the middle.` }; }],
  [3, (r) => { const s = r.pick([['circle', 'round like a ball'], ['square', 'has 4 equal sides'], ['triangle', 'has 3 corners'], ['rectangle', 'has 2 long and 2 short sides']]); return { q: `Which shape ${s[1]}?`.replace('Which shape has', 'Which shape has').replace('Which shape round', 'Which shape is round'), ...txt(s[0], SHAPES.map((x) => x[0]).filter((x) => x !== s[0])), ex: `A ${s[0]} ${s[1]}.` }; }],
  [3, (r, d) => { const nm = r.pick(NAMES), e = r.pick(FRUITS), a = rg(r, d, 2, 5, 9), b = rg(r, d, 1, 3, 6); return { q: `${nm} has ${e.repeat(a)}. ${nm} gets ${b} more. How many now?`, ...num(r, a + b, [a, a - b > 0 ? a - b : a + b + 1, b]), ex: `${a} + ${b} = ${a + b}.` }; }],
  [4, (r, d) => { const nm = r.pick(NAMES), e = r.pick(FRUITS), a = rg(r, d, 4, 7, 12), b = r.int(1, a - 1); return { q: `${nm} has ${e.repeat(a)}. ${nm} gives away ${b}. How many are left?`, ...num(r, a - b, [a + b, a, b]), ex: `${a} − ${b} = ${a - b}.` }; }],
  [5, (r) => { const [e1, e2] = r.shuffle(FRUITS).slice(0, 2), a = r.int(1, 6), b = r.int(1, 6); return { q: `${e1.repeat(a)} and ${e2.repeat(b)}. How many in all?`, ...num(r, a + b, [Math.abs(a - b), a, b]), ex: `${a} + ${b} = ${a + b}.` }; }],
  // Kindergarten curriculum: the alphabet (letter names, upper/lowercase, letter sounds)
  [1, (r) => { const L = r.pick(ALPHA.split('')); return { q: `Which lowercase letter matches "${L}"?`, ...txt(L.toLowerCase(), r.shuffle(ALPHA.toLowerCase().split('').filter((x) => x !== L.toLowerCase())).slice(0, 3)), ex: `${L} matches ${L.toLowerCase()}.` }; }],
  [1, (r) => { const l = r.pick(ALPHA.toLowerCase().split('')); return { q: `Which UPPERCASE letter matches "${l}"?`, ...txt(l.toUpperCase(), r.shuffle(ALPHA.split('').filter((x) => x !== l.toUpperCase())).slice(0, 3)), ex: `${l} matches ${l.toUpperCase()}.` }; }],
  [1, (r) => { const L = r.pick(ALPHA.split('')), w = LETTER_WORDS[L]; const others = Object.entries(LETTER_WORDS).filter(([k]) => k !== L).map(([, v]) => v); return { q: `Which word starts with the letter ${L}?`, ...txt(w, r.shuffle(others).slice(0, 3)), ex: `${w} starts with ${L}.` }; }],
  [2, (r) => { const i = r.int(0, 24), L = ALPHA[i]; return { q: `What letter comes after ${L}?`, ...txt(ALPHA[i + 1], r.shuffle(ALPHA.split('').filter((x) => x !== ALPHA[i + 1])).slice(0, 3)), ex: `After ${L} comes ${ALPHA[i + 1]}.` }; }],
  [2, (r) => { const i = r.int(1, 25), L = ALPHA[i]; return { q: `What letter comes before ${L}?`, ...txt(ALPHA[i - 1], r.shuffle(ALPHA.split('').filter((x) => x !== ALPHA[i - 1])).slice(0, 3)), ex: `Before ${L} comes ${ALPHA[i - 1]}.` }; }],
  // Kindergarten curriculum: colors, more shapes, money, patterns, days & months
  [2, (r) => { const [name, pic] = r.pick(COLORS); return { q: `What color is this? ${pic}`, ...txt(cap(name), r.shuffle(COLORS.map((c) => c[0])).filter((c) => c !== name).map(cap)), ex: `${pic} is ${name}.` }; }],
  [2, (r) => { const [name, pic] = r.pick(SHAPE_PICS); return { q: `Which shape is this? ${pic}`, ...txt(cap(name), r.shuffle(SHAPE_PICS.map((s) => s[0])).filter((s) => s !== name)), ex: `${pic} is a ${name}.` }; }],
  [4, (r) => { const [name, val] = r.pick(COINS); return { q: `How much is a ${name} worth?`, ...txt(val, COINS.map((c) => c[1]).filter((v) => v !== val)), ex: `A ${name} is worth ${val}.` }; }],
  [3, (r) => { const i = r.int(0, 5); return { q: `What day comes after ${DAYS[i]}?`, ...txt(DAYS[(i + 1) % 7], r.shuffle(DAYS.filter((d) => d !== DAYS[(i + 1) % 7])).slice(0, 3)), ex: `After ${DAYS[i]} comes ${DAYS[(i + 1) % 7]}.` }; }],
  [4, (r) => { const i = r.int(0, 10); return { q: `What month comes after ${MONTHS[i]}?`, ...txt(MONTHS[(i + 1) % 12], r.shuffle(MONTHS.filter((m) => m !== MONTHS[(i + 1) % 12])).slice(0, 3)), ex: `After ${MONTHS[i]} comes ${MONTHS[(i + 1) % 12]}.` }; }],
  [3, (r) => { const [a, b] = r.shuffle(FRUITS).slice(0, 2), kind = r.pick(['ABB', 'AAB', 'ABC']); const c = kind === 'ABC' ? r.shuffle(FRUITS.filter((x) => x !== a && x !== b))[0] : null;
    const unit = kind === 'ABB' ? [a, b, b] : kind === 'AAB' ? [a, a, b] : [a, b, c];
    const seq = [...unit, ...unit, ...unit.slice(0, unit.length - 1)];
    return { q: `What comes next? ${seq.join(' ')} ?`, ...txt(unit[unit.length - 1], FRUITS.filter((x) => x !== unit[unit.length - 1]).slice(0, 3)), ex: `The pattern is ${unit.join(' ')}, repeating.` }; }],
];

// ---------------------------------------------------------------- GRADE 1
const G1 = [
  [1, (r, d) => { const a = rg(r, d, 2, 9, 12), b = rg(r, d, 1, 8, 10); return { q: `${a} + ${b} = ?`, ...num(r, a + b, [Math.abs(a - b)]), ex: `${a} + ${b} = ${a + b}.` }; }],
  [1, (r, d) => { const a = rg(r, d, 6, 12, 20), b = r.int(1, Math.min(9, a - 1)); return { q: `${a} − ${b} = ?`, ...num(r, a - b, [a + b]), ex: `${a} − ${b} = ${a - b}.` }; }],
  [2, (r) => { const s = r.int(8, 18), a = r.int(2, s - 2); return { q: `${a} + ? = ${s}`, ...num(r, s - a, [s + a, a]), ex: `${s} − ${a} = ${s - a}.` }; }],
  [2, (r) => { const a = r.int(3, 9); return { q: `${a} + ${a} = ?`, ...num(r, 2 * a, [a, 2 * a + 1, 2 * a - 1]), ex: `Doubles: ${a} + ${a} = ${2 * a}.` }; }],
  [1, (r, d) => { const a = rg(r, d, 5, 20, 60), b = rg(r, d, 5, 20, 60); const sg = a > b ? '>' : a < b ? '<' : '='; return { q: `Which sign goes in the box? ${a} ▢ ${b}`, ...txt(sg, ['<', '>', '='].filter((x) => x !== sg)), ex: `${a} is ${a > b ? 'greater than' : a < b ? 'less than' : 'equal to'} ${b}.` }; }],
  [3, (r) => { const t = r.int(1, 9), o = r.int(0, 9); return { q: `How many tens and ones are in ${t * 10 + o}?`, ...txt(`${t} tens ${o} ones`, [`${o} tens ${t} ones`, `${t + 1} tens ${o} ones`, `${t} tens ${o + 1} ones`, `${t} tens ${Math.max(0, o - 1)} ones`]), ex: `${t * 10 + o} = ${t} tens and ${o} ones.` }; }],
  [4, (r, d) => { const a = r.int(1, 6) * 10, b = r.int(1, 9 - a / 10 + 1) * 10; return { q: `${a} + ${b} = ?`, ...num(r, a + b, [a + b + 1, a + b - 10, a + b + 10, (a + b) / 10]), ex: `${a / 10} tens + ${b / 10} tens = ${(a + b) / 10} tens.` }; }],
  [3, (r) => { const nums = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).slice(0, 4); const even = nums.filter((x) => x % 2 === 0); if (even.length !== 1) { nums[0] = 4; nums[1] = 7; nums[2] = 9; nums[3] = 11; } const ev = nums.find((x) => x % 2 === 0); return { q: `Which number is even? ${nums.join(', ')}`, ...num(r, ev, nums.filter((x) => x !== ev)), ex: `${ev} can be shared equally into two groups.` }; }],
  [4, (r) => { const h = r.int(1, 12), half = r.chance(0.5); return { q: half ? `What time is half past ${h}?` : `What time is ${h} o'clock?`, ...txt(half ? `${h}:30` : `${h}:00`, [half ? `${h}:00` : `${h}:30`, `${(h % 12) + 1}:${half ? '30' : '00'}`, `${((h + 10) % 12) + 1}:${half ? '30' : '00'}`, `${(h % 12) + 1}:${half ? '00' : '30'}`]), ex: half ? `Half past ${h} is ${h}:30.` : `${h} o'clock is ${h}:00.` }; }],
  [5, (r) => { const c = r.pick([['dime', 10], ['nickel', 5], ['penny', 1]]), n = r.int(2, 6), plur = c[0] === 'penny' ? 'pennies' : c[0] + 's'; return { q: `How many cents are ${n} ${plur}?`, ...num(r, n * c[1], [n + c[1], n * 10, n * 5, n]), ex: `${n} × ${c[1]} = ${n * c[1]} cents.` }; }],
  [2, (r, d) => { const nm = r.pick(NAMES), t = r.pick(THINGS), a = rg(r, d, 3, 8, 12), b = rg(r, d, 2, 6, 9); return { q: `${nm} has ${a} ${t}. ${nm} gets ${b} more. How many ${t} now?`, ...num(r, a + b, [a - b, a]), ex: `${a} + ${b} = ${a + b}.` }; }],
  [3, (r, d) => { const nm = r.pick(NAMES), t = r.pick(THINGS), a = rg(r, d, 8, 12, 18), b = r.int(2, 7); return { q: `${nm} has ${a} ${t}. ${nm} gives away ${b}. How many are left?`, ...num(r, a - b, [a + b, b]), ex: `${a} − ${b} = ${a - b}.` }; }],
  [6, (r) => { const s = r.pick([2, 5, 10]), st = r.int(1, 3), seq = [0, 1, 2, 3].map((i) => s * (st + i)); return { q: `Count by ${s}s: ${seq[0]}, ${seq[1]}, ${seq[2]}, ?`, ...num(r, seq[3], [seq[2] + 1, seq[2] + 2, seq[2] + 10]), ex: `Add ${s} each time.` }; }],
  [7, (r) => { const a = r.int(2, 6), b = r.int(3, 8); return { q: `${a} + ${b} = ${a + b}. So ${a + b} − ${a} = ?`, ...num(r, b, [a, a + b + a]), ex: `Fact families: ${a + b} − ${a} = ${b}.` }; }],
  [8, (r) => { const s = r.pick([['square', 4], ['triangle', 3], ['rectangle', 4], ['hexagon', 6]]); return { q: `How many corners does a ${s[0]} have?`, ...num(r, s[1], [3, 4, 5, 6, 8]), ex: `A ${s[0]} has ${s[1]} corners.` }; }],
  // Grade 1 curriculum: reading the highest-frequency sight words in a short, simple sentence
  [1, (r) => { const [s, a, w] = r.pick(SIGHT_SENT); return { q: s, ...txt(a, w), ex: s.replace('___', a) }; }],
  [1, (r) => { const [s, a, w] = r.pick(SIGHT_SENT); return { q: s, ...txt(a, w), ex: s.replace('___', a) }; }],
  // Grade 1 curriculum: 10 more/less, wider 2-digit work, mixed coins, equal parts, 3D shapes
  [3, (r) => { const n = r.int(11, 89), more = r.chance(0.5); return { q: `What is 10 ${more ? 'more' : 'less'} than ${n}?`, ...num(r, more ? n + 10 : n - 10, [n, more ? n - 10 : n + 10, more ? n + 1 : n - 1]), ex: `${more ? '10 more than' : '10 less than'} ${n} is ${more ? n + 10 : n - 10}.` }; }],
  [3, (r) => { const a = r.int(10, 89), b = r.int(2, 9); return { q: `${a} + ${b} = ?`, ...num(r, a + b, [a + b + 10, a + 10, a - b]), ex: `${a} + ${b} = ${a + b}.` }; }],
  [4, (r) => { const bTens = r.int(1, 6), aTens = r.int(bTens + 1, 9), a = aTens * 10, b = bTens * 10; return { q: `${a} − ${b} = ?`, ...num(r, a - b, [a + b, a, a - b + 10]), ex: `${aTens} tens − ${bTens} tens = ${aTens - bTens} tens.` }; }],
  [6, (r) => { const plur = (w, c) => (c === 1 ? w : w === 'penny' ? 'pennies' : w + 's'); const combos = [['dime', 10, 'nickel', 5], ['dime', 10, 'penny', 1], ['quarter', 25, 'dime', 10], ['nickel', 5, 'penny', 1]]; const [n1, v1, n2, v2] = r.pick(combos), c1 = r.int(1, 3), c2 = r.int(1, 3), total = c1 * v1 + c2 * v2; return { q: `How much is ${c1} ${plur(n1, c1)} and ${c2} ${plur(n2, c2)}?`, ...num(r, total, [total + 5, total - 5, c1 * v1], { fmt: (n) => `${n}¢` }), ex: `${c1} × ${v1} + ${c2} × ${v2} = ${total} cents.` }; }],
  [4, (r) => { const n = r.pick([2, 4]), shape = r.pick(['circle', 'rectangle']); return { q: `If you cut a ${shape} into ${n} equal parts, what is each part called?`, ...txt(n === 2 ? 'a half' : 'a fourth', [n === 2 ? 'a fourth' : 'a half', 'a third', 'a whole']), ex: `Cut into ${n} equal parts: each part is ${n === 2 ? 'a half' : 'a fourth'}.` }; }],
  [5, (r) => { const s = r.pick([['cube', 'a box shape with 6 flat square sides'], ['sphere', 'round like a ball'], ['cone', 'has a point and a round bottom'], ['cylinder', 'has two round ends and a curved side']]); return { q: `Which 3D shape ${s[1]}?`, ...txt(s[0], ['cube', 'sphere', 'cone', 'cylinder'].filter((x) => x !== s[0])), ex: `A ${s[0]} ${s[1]}.` }; }],
];

// ---------------------------------------------------------------- GRADE 2
const G2 = [
  [1, (r, d) => { const a = rg(r, d, 12, 40, 76), b = rg(r, d, 10, 20, 23); return { q: `${a} + ${b} = ?`, ...num(r, a + b, [a + b - 10, a + b + 10, (Math.floor(a / 10) + Math.floor(b / 10)) * 10 + ((a % 10) + (b % 10)) % 10]), ex: `${a} + ${b} = ${a + b}.` }; }],
  [1, (r, d) => { const a = rg(r, d, 30, 60, 99), b = r.int(10, a - 5); return { q: `${a} − ${b} = ?`, ...num(r, a - b, [a - b + 10, a - b - 10, a + b]), ex: `${a} − ${b} = ${a - b}.` }; }],
  [2, (r, d) => { const a = r.int(15, 59), b = r.int(15, 39); return { q: `${a} + ${b} = ? (regroup ones)`, ...num(r, a + b, [a + b - 10, a + b + 10, a + b - 1]), ex: `Regroup 10 ones as 1 ten: ${a + b}.` }; }],
  [3, (r, d) => { const h = r.int(1, 9), t = r.int(0, 9), o = r.int(0, 9), n = h * 100 + t * 10 + o, pos = r.pick([['hundreds', h * 100], ['tens', t * 10], ['ones', o]]); return { q: `What is the value of the digit in the ${pos[0]} place of ${n}?`, ...num(r, pos[1], [h, t, o, h * 100, t * 10, o].filter((x) => x !== pos[1])), ex: `The ${pos[0]} digit is worth ${pos[1]}.` }; }],
  [4, (r) => { const h = r.int(1, 9), t = r.int(1, 9), o = r.int(1, 9); return { q: `${h * 100} + ${t * 10} + ${o} = ?`, ...num(r, h * 100 + t * 10 + o, [h + t + o, h * 100 + t + o, h * 10 + t * 10 + o]), ex: `Expanded form of ${h * 100 + t * 10 + o}.` }; }],
  [4, (r, d) => { const a = rg(r, d, 120, 300, 900), b = rg(r, d, 120, 300, 900); const sg = a > b ? '>' : a < b ? '<' : '='; return { q: `Which sign goes in the box? ${a} ▢ ${b}`, ...txt(sg, ['<', '>', '='].filter((x) => x !== sg)), ex: `Compare hundreds first.` }; }],
  [3, (r) => { const s = r.pick([5, 10, 100]), st = r.int(1, 5) * (s === 100 ? 1 : s === 10 ? 3 : 2), seq = [0, 1, 2, 3].map((i) => st * (s === 100 ? 100 : 1) + s * i); return { q: `Skip count by ${s}s: ${seq[0]}, ${seq[1]}, ${seq[2]}, ?`, ...num(r, seq[3], [seq[2] + 1, seq[2] + s / 5 + 1]), ex: `Add ${s} each time.` }; }],
  [5, (r) => { const q = r.int(1, 4), di = r.int(1, 4), nk = r.int(0, 3); return { q: `${q} quarters + ${di} dimes + ${nk} nickels = ? cents`, ...num(r, q * 25 + di * 10 + nk * 5, [q + di + nk, q * 25 + di * 10, q * 10 + di * 10 + nk * 5]), ex: `${q}×25 + ${di}×10 + ${nk}×5 = ${q * 25 + di * 10 + nk * 5}.` }; }],
  [6, (r) => { const h = r.int(1, 11), m = r.pick([5, 10, 15, 20, 25, 30]), add = r.pick([15, 30, 45]); const tot = h * 60 + m + add; const H = Math.floor(tot / 60) % 12 || 12, M = tot % 60; const f = (H2, M2) => `${H2}:${String(M2).padStart(2, '0')}`; return { q: `It is ${f(h, m)}. What time is it ${add} minutes later?`, ...txt(f(H, M), [f(H, (M + 5) % 60), f(H, (M + 55) % 60), f((H % 12) + 1, M), f(h, (m + add) % 60)]), ex: `${f(h, m)} + ${add} minutes = ${f(H, M)}.` }; }],
  [2, (r, d) => { const nm = r.pick(NAMES), t = r.pick(THINGS), a = rg(r, d, 20, 45, 78), b = rg(r, d, 12, 25, 43); return { q: `${nm} has ${a} ${t}. A friend gives ${nm} ${b} more. How many ${t} now?`, ...num(r, a + b, [a - b, a + b - 10, a + b + 10]), ex: `${a} + ${b} = ${a + b}.` }; }],
  [3, (r, d) => { const nm = r.pick(NAMES), t = r.pick(THINGS), a = rg(r, d, 50, 70, 99), b = rg(r, d, 12, 28, 45); return { q: `${nm} had ${a} ${t} and used ${b}. How many are left?`, ...num(r, a - b, [a + b, a - b + 10, a - b - 10]), ex: `${a} − ${b} = ${a - b}.` }; }],
  [4, (r) => { const a = r.int(2, 5), b = r.int(2, 6); return { q: `An array has ${a} rows with ${b} in each row. How many in all?`, ...num(r, a * b, [a + b, a * b + b, a * b - a]), ex: `${a} rows of ${b}: ${b} added ${a} times = ${a * b}.` }; }],
  [5, (r) => { const n = r.int(11, 94); const rn = Math.round(n / 10) * 10; return { q: `Round ${n} to the nearest ten.`, ...num(r, rn, [Math.floor(n / 10) * 10, Math.ceil(n / 10) * 10, n]), ex: `${n} is closest to ${rn}.` }; }],
  [6, (r) => { const n = r.pick([4, 6, 8, 10, 12, 16, 20]); return { q: `What is half of ${n}?`, ...num(r, n / 2, [n, n * 2, n / 2 + 1]), ex: `Half of ${n} is ${n / 2}.` }; }],
  [7, (r) => { const a = r.int(20, 60), b = r.int(12, 19); return { q: `A ribbon is ${a} cm long. Another is ${a - b} cm. How much longer is the first?`, ...num(r, b, [a, a + b, a - b]), ex: `${a} − ${a - b} = ${b} cm.` }; }],
  [8, (r) => { const a = r.int(20, 60), t = r.int(20, 98); return { q: `? + ${a} = ${a + t}`, ...num(r, t, [a + t, a, t + 10]), ex: `${a + t} − ${a} = ${t}.` }; }],
];

// ---------------------------------------------------------------- GRADE 3
const G3 = [
  [1, (r, d) => { const a = rg(r, d, 2, 5, 10), b = rg(r, d, 2, 6, 12); return { q: `${a} × ${b} = ?`, ...num(r, a * b, [a + b, a * b + a, a * b - b]), ex: `${a} groups of ${b} is ${a * b}.` }; }],
  [2, (r, d) => { const a = rg(r, d, 2, 5, 10), b = rg(r, d, 2, 6, 12); return { q: `${a * b} ÷ ${a} = ?`, ...num(r, b, [a, a * b - a, b + 1]), ex: `${a} × ${b} = ${a * b}, so ${a * b} ÷ ${a} = ${b}.` }; }],
  [3, (r, d) => { const a = r.int(3, 9), b = r.int(3, 9); return { q: `${a} × ? = ${a * b}`, ...num(r, b, [a, a * b - a, a + b]), ex: `${a * b} ÷ ${a} = ${b}.` }; }],
  [2, (r, d) => { const a = rg(r, d, 120, 350, 700), b = rg(r, d, 110, 200, 290); return { q: `${a} + ${b} = ?`, ...num(r, a + b, [a + b - 100, a + b + 10, a + b - 10]), ex: `${a} + ${b} = ${a + b}.` }; }],
  [3, (r, d) => { const a = rg(r, d, 400, 650, 990), b = rg(r, d, 110, 200, 399); return { q: `${a} − ${b} = ?`, ...num(r, a - b, [a - b + 10, a - b - 10, a - b + 100]), ex: `${a} − ${b} = ${a - b}.` }; }],
  [4, (r) => { const n = r.int(120, 990), p = r.pick([10, 100]); const rn = Math.round(n / p) * p; return { q: `Round ${n} to the nearest ${p}.`, ...num(r, rn, [Math.floor(n / p) * p, Math.ceil(n / p) * p, rn + p, rn - p]), ex: `${n} is closest to ${rn}.` }; }],
  [5, (r) => { const dn = r.pick([2, 3, 4, 5, 6, 8]), t = dn * r.int(2, 6); return { q: `What is 1/${dn} of ${t}?`, ...num(r, t / dn, [t - dn, t, dn]), ex: `${t} ÷ ${dn} = ${t / dn}.` }; }],
  [6, (r) => { const dn = r.pick([3, 4, 5, 6, 8]), a = r.int(1, dn - 1); return { q: `A pizza is cut into ${dn} equal slices. ${a} slices are eaten. What fraction was eaten?`, ...txt(`${a}/${dn}`, [`${dn - a}/${dn}`, `${a}/${dn + 1}`, `${dn}/${a}`, `1/${dn}`].filter((x) => x !== `${a}/${dn}`)), ex: `${a} out of ${dn} is ${a}/${dn}.` }; }],
  [7, (r) => { const a = r.pick([2, 3, 4, 5, 6, 8]); let b = r.pick([2, 3, 4, 5, 6, 8]); if (a === b) b = 10; const bigger = a < b ? `1/${a}` : `1/${b}`; return { q: `Which fraction is bigger: 1/${a} or 1/${b}?`, ...txt(bigger, [`1/${a}`, `1/${b}`, 'They are equal'].filter((x) => x !== bigger)), ex: 'Fewer equal parts means bigger pieces.' }; }],
  [3, (r, d) => { const l = rg(r, d, 3, 6, 12), w = rg(r, d, 2, 4, 9); return { q: `A rectangle is ${l} cm long and ${w} cm wide. What is its area?`, ...num(r, l * w, [2 * (l + w), l + w, l * w + l]), ex: `Area = ${l} × ${w} = ${l * w} square cm.` }; }],
  [4, (r, d) => { const l = rg(r, d, 4, 8, 15), w = rg(r, d, 2, 5, 9); return { q: `A rectangle is ${l} m long and ${w} m wide. What is its perimeter?`, ...num(r, 2 * (l + w), [l * w, l + w, 2 * l + w]), ex: `2 × (${l} + ${w}) = ${2 * (l + w)} m.` }; }],
  [3, (r, d) => { const nm = r.pick(NAMES), t = r.pick(THINGS), a = rg(r, d, 3, 5, 9), b = rg(r, d, 3, 6, 9); return { q: `${nm} has ${a} bags with ${b} ${t} in each bag. How many ${t} in all?`, ...num(r, a * b, [a + b, a * b + b]), ex: `${a} × ${b} = ${a * b}.` }; }],
  [4, (r, d) => { const nm = r.pick(NAMES), t = r.pick(THINGS), b = rg(r, d, 3, 5, 8), g = r.int(3, 9); return { q: `${nm} shares ${b * g} ${t} equally among ${b} friends. How many does each friend get?`, ...num(r, g, [b, b * g, g + 1]), ex: `${b * g} ÷ ${b} = ${g}.` }; }],
  [6, (r) => { const h = r.int(1, 8), m = r.pick([0, 15, 30]), add = r.pick([25, 35, 40, 50]); const f = (t) => `${Math.floor(t / 60) % 12 || 12}:${String(t % 60).padStart(2, '0')}`; const s = h * 60 + m; return { q: `A movie starts at ${f(s)} and ends at ${f(s + add)}. How many minutes long is it?`, ...num(r, add, [add + 10, add - 5, add + 15]), ex: `From ${f(s)} to ${f(s + add)} is ${add} minutes.` }; }],
  [8, (r) => { const a = r.int(2, 9), b = r.int(2, 9) * 10; return { q: `${a} × ${b} = ?`, ...num(r, a * b, [a * b / 10, a * b * 10, a * b + a]), ex: `${a} × ${b / 10} = ${a * b / 10}, then × 10 = ${a * b}.` }; }],
  [9, (r) => { const a = r.int(2, 6), b = r.int(2, 5), c2 = r.int(2, 9); return { q: `${a} × ${b} + ${c2} = ?`, ...num(r, a * b + c2, [a * (b + c2), a + b + c2]), ex: `Multiply first: ${a * b}, then add ${c2}.` }; }],
];

// ---------------------------------------------------------------- GRADE 4
const G4 = [
  [1, (r, d) => { const a = rg(r, d, 12, 60, 120), b = rg(r, d, 3, 6, 9); return { q: `${a} × ${b} = ?`, ...num(r, a * b, [a * b + 10, a * b - 10, a + b, a * b + 100]), ex: `${a} × ${b} = ${a * b}.` }; }],
  [3, (r, d) => { const a = rg(r, d, 12, 25, 60), b = rg(r, d, 11, 20, 45); return { q: `${a} × ${b} = ?`, ...num(r, a * b, [a * b + 10, a * b - 10, (a % 10) * (b % 10) + 10 * (Math.floor(a / 10) * Math.floor(b / 10))]), ex: `${a} × ${b} = ${a * b}.` }; }],
  [2, (r, d) => { const dv = r.int(3, 9), qq = rg(r, d, 5, 12, 40), rm = r.int(1, dv - 1); const n = dv * qq + rm; return { q: `${n} ÷ ${dv} = ? (give the quotient and remainder)`, ...txt(`${qq} R ${rm}`, [`${qq} R ${rm + 1 < dv ? rm + 1 : rm - 1}`, `${qq + 1} R ${rm}`, `${qq - 1} R ${rm}`, `${rm} R ${qq}`]), ex: `${dv} × ${qq} = ${dv * qq}; ${n} − ${dv * qq} = ${rm}.` }; }],
  [2, (r) => { const n = r.pick([12, 18, 20, 24, 30, 36, 40, 48]); const fs = []; for (let i = 1; i <= n; i++) if (n % i === 0) fs.push(i); const f = r.pick(fs.filter((x) => x > 1 && x < n)); const wr = []; for (let i = 2; i < n + 5; i++) if (n % i !== 0) wr.push(i); return { q: `Which number is a factor of ${n}?`, ...num(r, f, wr), ex: `${f} × ${n / f} = ${n}.` }; }],
  [4, (r) => { const p = r.pick([2, 3, 5, 7, 11, 13, 17, 19, 23]); const c = [4, 6, 8, 9, 15, 21, 25, 27, 33, 35].filter(() => true); return { q: `Which number is prime?`, ...num(r, p, c), ex: `${p} has only two factors: 1 and ${p}.` }; }],
  [3, (r) => { const dn = r.pick([2, 3, 4, 5, 6]), a = r.int(1, dn - 1), m = r.pick([2, 3, 4]); return { q: `${a}/${dn} = ?/${dn * m}`, ...num(r, a * m, [a, a + m, a * m + 1]), ex: `Multiply top and bottom by ${m}: ${a * m}/${dn * m}.` }; }],
  [4, (r) => { const dn = r.pick([5, 6, 8, 10, 12]), a = r.int(1, dn - 3), b = r.int(1, dn - a - 1); return { q: `${a}/${dn} + ${b}/${dn} = ?`, ...txt(`${a + b}/${dn}`, [`${a + b}/${dn * 2}`, `${a * b}/${dn}`, `${a + b + 1}/${dn}`, `${Math.abs(a - b)}/${dn}`].filter((x) => x !== `${a + b}/${dn}`)), ex: `Add the tops, keep the bottom: ${a + b}/${dn}.` }; }],
  [5, (r) => { const t = r.int(1, 9); return { q: `Which decimal is the same as ${t}/10?`, ...txt(`0.${t}`, [`${t}.0`, `0.0${t}`, `${t}0`, `0.${t}${t}`]), ex: `${t} tenths is 0.${t}.` }; }],
  [6, (r) => { const a = r.int(11, 89) / 10, b = r.int(11, 89) / 10; const sg = a > b ? '>' : a < b ? '<' : '='; return { q: `Which sign goes in the box? ${a.toFixed(1)} ▢ ${b.toFixed(1)}`, ...txt(sg, ['<', '>', '='].filter((x) => x !== sg)), ex: 'Compare the ones, then the tenths.' }; }],
  [7, (r) => { const a = r.int(11, 99) / 10, b = r.int(11, 99) / 10; return { q: `${a.toFixed(1)} + ${b.toFixed(1)} = ?`, ...num(r, +(a + b).toFixed(1), [+(a + b + 1).toFixed(1), +(a + b - 1).toFixed(1), +(a + b).toFixed(1) * 10], { int: false, fmt: (x) => Number(x).toFixed(1) }), ex: 'Line up the decimal points.' }; }],
  [3, (r) => { const n = r.int(10000, 999999); const s = String(n); const i = r.int(0, s.length - 1); const dg = +s[i]; if (dg === 0) return { q: `What is 4 × 1,000?`, ...num(r, 4000, [400, 40000, 4004]), ex: '4 thousands = 4,000.' }; const val = dg * Math.pow(10, s.length - 1 - i); return { q: `In ${comma(n)}, what is the value of the digit ${dg} in the ${['ten-thousands', 'thousands', 'hundreds', 'tens', 'ones'][5 - (s.length - i)] || ''} place?`.replace(' in the  place', ''), ...num(r, val, [dg, val * 10, val / 10 >= 1 ? val / 10 : val * 100]), ex: `The digit ${dg} is worth ${comma(val)}.` }; }],
  [5, (r) => { const n = r.int(1200, 98999); const rn = Math.round(n / 1000) * 1000; return { q: `Round ${comma(n)} to the nearest thousand.`, ...num(r, rn, [Math.floor(n / 1000) * 1000, Math.ceil(n / 1000) * 1000, rn + 1000, rn - 1000].filter((x) => x !== rn), { fmt: comma }), ex: `Look at the hundreds digit.` }; }],
  [3, (r) => { const p = r.int(20, 60), w = r.int(3, 12); const l = p / 2 - w; return { q: `A rectangle has a perimeter of ${p} cm and a width of ${w} cm. What is its length?`, ...num(r, l, [p - w, p / 2, l + w]), ex: `${p} ÷ 2 = ${p / 2}; ${p / 2} − ${w} = ${l}.` }; }],
  [6, (r) => { const a = r.pick([20, 30, 40, 50, 60, 70, 80]); return { q: `A straight line measures 180°. If one angle is ${a}°, how big is the other?`, ...num(r, 180 - a, [90 - a > 0 ? 90 - a : a, 360 - a, a]), ex: `180 − ${a} = ${180 - a}.` }; }],
  [5, (r) => { const u = r.pick([['m', 'cm', 100], ['km', 'm', 1000], ['hours', 'minutes', 60], ['kg', 'g', 1000]]), n = r.int(2, 9); return { q: `${n} ${u[0]} = ? ${u[1]}`, ...num(r, n * u[2], [n * u[2] / 10, n * u[2] * 10, n + u[2]]), ex: `${n} × ${u[2]} = ${n * u[2]}.` }; }],
  [4, (r) => { const a = r.int(2, 9), b = r.int(2, 9), c2 = r.int(2, 9); return { q: `${a} + ${b} × ${c2} = ?`, ...num(r, a + b * c2, [(a + b) * c2, a + b + c2]), ex: `Multiply first: ${b * c2}, then add ${a}.` }; }],
  [8, (r) => { const s = r.int(3, 9), st = r.int(2, 9), seq = [0, 1, 2, 3].map((i) => s + st * i); return { q: `Rule: add ${st}. ${seq[0]}, ${seq[1]}, ${seq[2]}, ?`, ...num(r, seq[3], [seq[2] + 1, seq[2] + st + 1, seq[2] * 2]), ex: `${seq[2]} + ${st} = ${seq[3]}.` }; }],
];

// ---------------------------------------------------------------- GRADE 5
const fr = (n, dn) => `${n}/${dn}`;
const G5 = [
  [1, (r) => { const a = r.int(11, 99) / 10, b = r.int(2, 9); return { q: `${a.toFixed(1)} × ${b} = ?`, ...num(r, +(a * b).toFixed(1), [+(a * b * 10).toFixed(1), +(a * b / 10).toFixed(2), +(a * b + 1).toFixed(1)], { int: false, fmt: (x) => String(+Number(x).toFixed(2)) }), ex: `${Math.round(a * 10)} × ${b} = ${Math.round(a * 10) * b}, then move the decimal one place.` }; }],
  [2, (r) => { const a = r.pick([2, 3, 4, 5]), b = r.pick([2, 3, 4, 5, 6].filter((x) => x !== a)); const n = a + b, dn = a * b; return { q: `1/${a} + 1/${b} = ?`, ...txt(fr(n, dn), [fr(2, a + b), fr(1, a + b), fr(n, a + b), fr(n + 1, dn), fr(dn, n)].filter((x) => x !== fr(n, dn))), ex: `Common denominator ${dn}: ${b}/${dn} + ${a}/${dn} = ${n}/${dn}.` }; }],
  [3, (r) => { const dn = r.pick([2, 3, 4, 5, 6, 8]), a = r.int(1, dn - 1), w = dn * r.int(2, 5); return { q: `${a}/${dn} of ${w} = ?`, ...num(r, (a * w) / dn, [w / dn, a * w, w - a]), ex: `${w} ÷ ${dn} = ${w / dn}; × ${a} = ${(a * w) / dn}.` }; }],
  [2, (r) => { const a = r.int(2, 9), b = r.int(2, 9), c2 = r.int(2, 6), d2 = r.int(1, 9); return { q: `(${a} + ${b}) × ${c2} − ${d2} = ?`, ...num(r, (a + b) * c2 - d2, [a + b * c2 - d2, (a + b) * (c2 - d2), (a + b) * c2 + d2]), ex: `Brackets first: ${a + b}; × ${c2} = ${(a + b) * c2}; − ${d2}.` }; }],
  [4, (r) => { const a = r.int(11, 99) / 10, p = r.pick([10, 100, 1000]); const op = r.pick(['×', '÷']); const res = op === '×' ? a * p : a / p; return { q: `${a.toFixed(1)} ${op} ${comma(p)} = ?`, ...num(r, +res.toFixed(4), [+(a * p).toFixed(4), +(a / p).toFixed(4), +(res * 10).toFixed(4), +(res / 10).toFixed(4)].filter((x) => x !== +res.toFixed(4)), { int: false, fmt: (x) => String(+Number(x).toFixed(4)) }), ex: `${op === '×' ? 'Move the decimal right' : 'Move the decimal left'} ${String(p).length - 1} places.` }; }],
  [3, (r, d) => { const l = rg(r, d, 2, 5, 12), w = r.int(2, 8), h = r.int(2, 9); return { q: `A box is ${l} cm long, ${w} cm wide and ${h} cm tall. What is its volume?`, ...num(r, l * w * h, [l + w + h, 2 * (l * w + w * h + l * h), l * w]), ex: `${l} × ${w} × ${h} = ${l * w * h} cubic cm.` }; }],
  [4, (r, d) => { const a = rg(r, d, 120, 300, 900), b = rg(r, d, 12, 25, 60); return { q: `${a} × ${b} = ?`, ...num(r, a * b, [a * b + 100, a * b - 100, a * b + 10]), ex: `${a} × ${b} = ${comma(a * b)}.` }; }],
  [5, (r, d) => { const b = r.int(11, 35), qq = rg(r, d, 20, 50, 200); return { q: `${comma(b * qq)} ÷ ${b} = ?`, ...num(r, qq, [qq + 10, qq - 10, qq + 1]), ex: `${b} × ${qq} = ${b * qq}.` }; }],
  [3, (r) => { const b = r.int(2, 9), e = r.pick([2, 3]); return { q: `${b}${e === 2 ? '²' : '³'} = ?`, ...num(r, Math.pow(b, e), [b * e, b + e, Math.pow(b, e) + b]), ex: `${b} used as a factor ${e} times = ${Math.pow(b, e)}.` }; }],
  [6, (r) => { const x = r.int(2, 9), y = r.int(2, 9); return { q: `Point A is at (${x}, ${y}) on a coordinate grid. How many units up from the x-axis is it?`, ...num(r, y, [x, x + y, y + 1]), ex: `The second number is how far up: ${y}.` }; }],
  [5, (r) => { const w = r.int(1, 4), dn = r.pick([3, 4, 5, 6]), a = r.int(1, dn - 1); return { q: `${w} ${a}/${dn} = ?/${dn}`, ...num(r, w * dn + a, [w + a, w * a + dn, w * dn - a]), ex: `${w} × ${dn} + ${a} = ${w * dn + a}.` }; }],
  [7, (r) => { const n = r.int(1000, 9999) / 1000; return { q: `Round ${n.toFixed(3)} to the nearest tenth.`, ...num(r, +n.toFixed(1), [+(n.toFixed(1)) + 0.1, +(n.toFixed(1)) - 0.1, +n.toFixed(2)], { int: false, fmt: (x) => Number(x).toFixed(1) }), ex: 'Look at the hundredths digit.' }; }],
  [6, (r) => { const nm = r.pick(NAMES), dn = r.pick([3, 4, 5]), w = dn * r.int(3, 8), a = r.int(1, dn - 1); return { q: `${nm} reads ${a}/${dn} of a ${w}-page book. How many pages did ${nm} read?`, ...num(r, (a * w) / dn, [w / dn, w - (a * w) / dn, a * w]), ex: `${w} ÷ ${dn} × ${a} = ${(a * w) / dn}.` }; }],
  [8, (r) => { const kg = r.int(2, 9) / 2; return { q: `${kg} kg = ? g`, ...num(r, kg * 1000, [kg * 100, kg * 10000, kg + 1000]), ex: `${kg} × 1000 = ${kg * 1000}.` }; }],
  [7, (r) => { const a = r.pick([2, 3, 4, 5]), b = r.pick([2, 3, 4, 5, 6].filter((x) => x !== a)); const n = a * b + 1 - 1; const num2 = b - a; return { q: `1/${a} − 1/${b} = ?`, ...txt(a > b ? 'A negative number' : fr(Math.abs(b - a), a * b), [fr(1, Math.abs(a - b) || 1), fr(Math.abs(b - a), a + b), fr(Math.abs(b - a) + 1, a * b)].filter((x) => x !== fr(Math.abs(b - a), a * b))), ex: `Use a common denominator ${a * b}.` }; }],
];

// ---------------------------------------------------------------- GRADE 6
const G6 = [
  [1, (r) => { const a = r.int(2, 6), b = r.int(3, 9), m = r.int(2, 6); return { q: `${a}:${b} = ${a * m}:?`, ...num(r, b * m, [b + m, b * m + a, a * m]), ex: `Multiply both parts by ${m}: ${a * m}:${b * m}.` }; }],
  [2, (r) => { const q = r.int(2, 8), price = r.int(2, 9) * q; return { q: `${q} notebooks cost $${price}. What is the price of 1 notebook?`, ...num(r, price / q, [price, price * q, price - q], { fmt: (x) => `$${x}` }), ex: `$${price} ÷ ${q} = $${price / q}.` }; }],
  [1, (r) => { const p = r.pick([10, 20, 25, 50, 75]), n = r.int(2, 20) * (100 / (p % 25 === 0 ? 4 : 10)) * (p % 25 === 0 ? 1 : 1); const base = p % 25 === 0 ? 4 * r.int(2, 25) : 10 * r.int(2, 20); return { q: `What is ${p}% of ${base}?`, ...num(r, (p * base) / 100, [p + base, base / p, (p * base) / 10, base - (p * base) / 100], { int: false, fmt: (x) => String(+Number(x).toFixed(2)) }), ex: `${p}% of ${base} = ${(p * base) / 100}.` }; }],
  [2, (r) => { const a = r.int(-12, -2), b = r.int(5, 15); return { q: `${a} + ${b} = ?`, ...num(r, a + b, [a - b, Math.abs(a) + b, -(a + b), b - a], { neg: true }), ex: `Start at ${a} and move ${b} to the right: ${a + b}.` }; }],
  [3, (r) => { const a = r.int(2, 12), b = r.int(2, 12); return { q: `${a} − (−${b}) = ?`, ...num(r, a + b, [a - b, -(a + b), b - a], { neg: true }), ex: `Subtracting a negative is adding: ${a} + ${b} = ${a + b}.` }; }],
  [1, (r) => { const x = r.int(3, 20), k = r.int(3, 15); return { q: `Solve: x + ${k} = ${x + k}`, ...num(r, x, [x + k, x + 2 * k, k], { neg: true }), ex: `${x + k} − ${k} = ${x}.` }; }],
  [2, (r) => { const x = r.int(2, 12), k = r.int(2, 9); return { q: `Solve: ${k}x = ${k * x}`, ...num(r, x, [k * x - k, k * x, k + x]), ex: `${k * x} ÷ ${k} = ${x}.` }; }],
  [4, (r) => { const x = r.int(2, 12), k = r.int(2, 9); return { q: `Solve: x ÷ ${k} = ${x}`, ...num(r, x * k, [x + k, x - k, x / k]), ex: `${x} × ${k} = ${x * k}.` }; }],
  [3, (r) => { const a = r.int(2, 5), b = r.int(2, 4); return { q: `${a}${b === 2 ? '²' : '³'} + ${r.int(1, 9)} = ?`, ...(() => { const t = r.int(1, 9); return { ...num(r, Math.pow(a, b) + t, [a * b + t, Math.pow(a, b), Math.pow(a, b) - t]), q: `${a}${b === 2 ? '²' : '³'} + ${t} = ?`, ex: `${a}${b === 2 ? '²' : '³'} = ${Math.pow(a, b)}; + ${t} = ${Math.pow(a, b) + t}.` }; })() }; }],
  [4, (r) => { const b = r.int(4, 14), h = r.int(3, 12) * 2; return { q: `What is the area of a triangle with base ${b} cm and height ${h} cm?`, ...num(r, (b * h) / 2, [b * h, b + h, (b * h) / 4]), ex: `½ × ${b} × ${h} = ${(b * h) / 2}.` }; }],
  [3, (r) => { const arr = [r.int(2, 9), r.int(4, 12), r.int(6, 14), r.int(8, 16)]; const s = arr.reduce((x, y) => x + y, 0); const adj = (4 - (s % 4)) % 4; arr[3] += adj; const tot = arr.reduce((x, y) => x + y, 0); return { q: `Find the mean of ${arr.join(', ')}.`, ...num(r, tot / 4, [Math.max(...arr), tot, (tot / 4) + 1]), ex: `${tot} ÷ 4 = ${tot / 4}.` }; }],
  [5, (r) => { const a = r.pick([4, 6, 8, 9, 10, 12, 14, 15, 18]), b = r.pick([6, 8, 10, 12, 15, 20]); return { q: `What is the greatest common factor (GCF) of ${a} and ${b}?`, ...num(r, gcd(a, b), [a * b, lcm(a, b), 1, Math.min(a, b)]), ex: `The largest number that divides both is ${gcd(a, b)}.` }; }],
  [6, (r) => { const a = r.pick([3, 4, 6, 8, 9]), b = r.pick([4, 6, 8, 10, 12]); return { q: `What is the least common multiple (LCM) of ${a} and ${b}?`, ...num(r, lcm(a, b), [a * b, gcd(a, b), a + b, Math.max(a, b)].filter((x) => x !== lcm(a, b))), ex: `The smallest number both divide into is ${lcm(a, b)}.` }; }],
  [5, (r) => { const a = r.int(2, 5), b = r.int(2, 9); return { q: `${a}(x + ${b}) = ${a}x + ?`, ...num(r, a * b, [b, a + b, a * b + a]), ex: `Distribute: ${a} × ${b} = ${a * b}.` }; }],
  [3, (r) => { const n = r.int(2, 9), a = r.int(2, 9), b = r.int(1, 9); return { q: `Evaluate ${a}n + ${b} when n = ${n}.`, ...num(r, a * n + b, [a + n + b, a * (n + b), a * n - b]), ex: `${a} × ${n} + ${b} = ${a * n + b}.` }; }],
  [7, (r) => { const n = r.int(2, 12); return { q: `What is |−${n}|?`, ...num(r, n, [-n, 0, n * 2], { neg: true }), ex: `Absolute value is distance from zero: ${n}.` }; }],
  [8, (r) => { const s = r.pick([40, 50, 60]), t = r.pick([1.5, 2, 2.5, 3]); return { q: `A car travels at ${s} mph for ${t} hours. How far does it go?`, ...num(r, s * t, [s + t, s / t, s * t + s], { int: false, fmt: (x) => String(+Number(x).toFixed(1)) }), ex: `${s} × ${t} = ${s * t} miles.` }; }],
  [9, (r) => { const nm = r.pick(NAMES), w = r.int(2, 5), k = r.int(2, 4); const x = r.int(2, 9); return { q: `${nm} says: "I am thinking of a number. If I multiply it by ${k} and add ${w}, I get ${k * x + w}." What is the number?`, ...num(r, x, [k * x, x + w, k * x + w - k]), ex: `(${k * x + w} − ${w}) ÷ ${k} = ${x}.` }; }],
  [8, (r) => { const a = r.int(2, 9), b = r.pick([2, 3, 4, 5]), c2 = r.int(1, b - 1) + 0; return { q: `Which number is a solution of x > ${a + 2}?`, ...num(r, a + 4, [a + 2, a + 1, a - 1, 2]), ex: `${a + 4} is greater than ${a + 2}.` }; }],
];

const TOPICS = { KG, G1, G2, G3, G4, G5, G6 };
const cache = new Map();
const built = new Set();

export const levelOfMath = (n) => Math.floor((n - 1) / MATH_PER_LEVEL) + 1;
export const mathNo = (level, slot) => (level - 1) * MATH_PER_LEVEL + slot + 1;

// Built in order (1..500) so duplicate-avoidance is identical on every device and every session.
function buildGrade(gradeKey) {
  const list = TOPICS[gradeKey] || G3;
  const seen = new Set();
  for (let n = 1; n <= STORIES_PER_GRADE; n++) {
    const level = levelOfMath(n);
    const slot = (n - 1) % MATH_PER_LEVEL;
    const d = (level - 1) / 49;
    const eligible = list.filter((t) => t[0] <= Math.ceil(level / 2.6));
    let out = null;
    for (let salt = 0; salt < 40 && !out; salt++) {
      const r = makeRng(`${gradeKey}|math|${n}|${salt}`);
      const ti = (slot + level * 3 + salt * 7) % eligible.length;
      const t = eligible[ti][1](r, d);
      if (!t || !t.q || t.wrong.length < 2) continue;
      if (seen.has(t.q) && salt < 39) continue;
      const nOpt = gradeKey === 'KG' || gradeKey === 'G1' ? 3 : 4;
      const { options, answer } = buildOptions(r, t.a, t.wrong, nOpt);
      if (options.length < 2) continue;
      seen.add(t.q);
      out = { id: `${gradeKey}-M${String(n).padStart(3, '0')}`, n, grade: gradeKey, level, q: t.q, options, answer, explain: t.ex || '' };
    }
    cache.set(`${gradeKey}|${n}`, out);
  }
  built.add(gradeKey);
}

export function generateMath(gradeKey, n) {
  if (n < 1 || n > STORIES_PER_GRADE) return null;
  if (!built.has(gradeKey)) buildGrade(gradeKey);
  return cache.get(`${gradeKey}|${n}`);
}
export const mathInLevel = (grade, level) => Array.from({ length: MATH_PER_LEVEL }, (_, i) => generateMath(grade, mathNo(level, i)));
export const allMathHeaders = (grade) => Array.from({ length: STORIES_PER_GRADE }, (_, i) => generateMath(grade, i + 1));
