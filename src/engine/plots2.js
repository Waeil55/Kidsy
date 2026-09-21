// Story plots, part 2: animal rescue, teamwork, mystery, animal fact file, how-to text.
import { cap, withA, uniq } from '../lib/rng.js';
import { KINDS_INFO } from './pools.js';
import { J, Q, lc, traitFor } from './plots1.js';

const T = (c, s) => c.titleCase(s);

// [name, kind, covering, home, food, movement, baby, fun fact (verb phrase), min tier]
export const ANIMALS = [
  ['cow', 'mammal', 'hair', 'on a farm', 'grass', 'walks', 'calf', 'gives us milk', 0],
  ['hen', 'bird', 'feathers', 'on a farm', 'seeds', 'walks', 'chick', 'lays eggs', 0],
  ['duck', 'bird', 'feathers', 'near a pond', 'plants and bugs', 'swims', 'duckling', 'has webbed feet for swimming', 0],
  ['frog', 'amphibian', 'smooth skin', 'near a pond', 'bugs', 'hops', 'tadpole', 'starts life as a tadpole', 0],
  ['goldfish', 'fish', 'scales', 'in a pond', 'tiny plants and bugs', 'swims', 'fry', 'breathes with gills', 0],
  ['bee', 'insect', 'tiny hairs', 'in a hive', 'nectar', 'flies', 'larva', 'makes honey', 0],
  ['bear', 'mammal', 'thick fur', 'in a den', 'berries and fish', 'walks', 'cub', 'sleeps through much of the winter', 0],
  ['owl', 'bird', 'feathers', 'in a tree', 'mice', 'flies', 'owlet', 'hunts at night', 0],
  ['turtle', 'reptile', 'a hard shell', 'near the water', 'plants and bugs', 'crawls', 'hatchling', 'can pull its head into its shell', 0],
  ['dog', 'mammal', 'fur', 'in a home', 'meat', 'runs', 'puppy', 'has a great sense of smell', 0],
  ['butterfly', 'insect', 'thin wings', 'in a garden', 'nectar', 'flies', 'caterpillar', 'begins life as a caterpillar', 0],
  ['whale', 'mammal', 'smooth skin', 'in the ocean', 'tiny sea animals', 'swims', 'calf', 'breathes air through a blowhole', 0],
  ['snake', 'reptile', 'scales', 'under rocks', 'mice', 'slithers', 'hatchling', 'sheds its skin as it grows', 1],
  ['penguin', 'bird', 'feathers', 'in cold places', 'fish', 'swims', 'chick', 'cannot fly but swims fast', 1],
  ['rabbit', 'mammal', 'soft fur', 'in a burrow', 'grass and clover', 'hops', 'kit', 'has long ears that hear danger', 1],
  ['ant', 'insect', 'a hard body', 'in a colony', 'seeds and crumbs', 'crawls', 'larva', 'can carry things much heavier than itself', 1],
  ['dolphin', 'mammal', 'smooth skin', 'in the ocean', 'fish', 'swims', 'calf', 'talks with clicks and whistles', 1],
  ['eagle', 'bird', 'feathers', 'on high cliffs', 'fish and small animals', 'soars', 'eaglet', 'has very sharp eyesight', 1],
  ['camel', 'mammal', 'fur', 'in the desert', 'plants', 'walks', 'calf', 'stores fat in its hump', 2],
  ['salamander', 'amphibian', 'moist skin', 'in damp forests', 'worms and insects', 'crawls', 'larva', 'can regrow a lost tail', 2],
  ['bat', 'mammal', 'fur', 'in caves', 'insects', 'flies', 'pup', 'is the only mammal that can truly fly', 2],
  ['crocodile', 'reptile', 'scales', 'near rivers', 'fish and other animals', 'swims', 'hatchling', 'can stay underwater for a long time', 2],
  ['hummingbird', 'bird', 'feathers', 'in gardens', 'nectar', 'hovers', 'chick', 'flaps its wings many times each second', 2],
  ['kangaroo', 'mammal', 'fur', 'in grasslands', 'grass', 'hops', 'joey', 'carries its baby in a pouch', 2],
  ['shark', 'fish', 'tough skin', 'in the ocean', 'fish', 'swims', 'pup', 'has a skeleton made of cartilage', 2],
].map(([n, kind, cover, home, food, move, baby, fun, minTier]) => ({ n, kind, cover, home, food, move, baby, fun, minTier }));

const animalsFor = (tier) => ANIMALS.filter((a) => a.minTier <= tier);
const RESCUE = {
  0: ['duck', 'frog', 'turtle', 'dog', 'hen', 'owl'],
  1: ['duck', 'frog', 'turtle', 'owl', 'rabbit', 'snake'],
  2: ['owl', 'rabbit', 'bat', 'salamander', 'turtle', 'eagle', 'snake', 'hummingbird'],
};
const A = (n) => ANIMALS.find((a) => a.n === n);
const plural = (kind) => (kind === 'fish' ? 'fish' : `${kind}s`);

// ---------------------------------------------------------------- ANIMAL RESCUE
export const animal = {
  id: 'animal',
  build(c) {
    const { hero, He, His, he, his, him, pal, adult, emoMid, emoEnd, p1 } = c;
    const names = RESCUE[c.tier];
    const a = A(c.sc(names));
    const n = a.n;
    const An = withA(n);
    const others = names.map(A).filter((x) => x.n !== n);
    const titleFn = (nm, an) => c.v(`${nm} and the ${T(c, an)}`, `${nm} and the Lost ${T(c, an)}`, `${nm} Helps ${withA(T(c, an))}`, `${nm} and ${withA(T(c, an))} Far from Home`, `${nm} Returns ${withA(T(c, an))} to Its Home`);
    const P1 = c.v(
      J(`${hero} saw ${An} ${p1}. It looked lost.`, `${hero} felt ${emoMid}.`),
      J(`${hero} found ${An} ${p1}. It was far from home, and it looked scared.`, `${hero} felt ${emoMid}.`),
      J(`One day, ${hero} discovered ${An} ${p1}. It was far from home, and it seemed frightened.`, `${hero} felt ${emoMid}.`),
      J(`While exploring, ${hero} discovered ${An} ${p1}. It was far from its natural home, and it seemed frightened.`, `${hero} felt ${emoMid}.`, c.g >= 5 && `It trembled when ${he} came close.`),
      J(`While exploring, ${hero} discovered ${An} ${p1}, far from its natural habitat and visibly frightened.`, `${hero} felt ${emoMid}, unsure how to help.`),
    );
    const P2 = c.v(
      J(`${adult} said, "${cap(An)} lives ${a.home}. Let us take it home."`),
      J(`${adult} said, "${cap(An)} lives ${a.home}, and it eats ${a.food}. Let us take it home."`),
      J(`${hero} asked ${adult} what to do. "${cap(An)} lives ${a.home}," ${adult} explained. "It eats ${a.food}, so it will be hungry. We should take it back."`),
      J(`${hero} asked ${adult} what to do. "${cap(An)} lives ${a.home}," ${adult} explained. "It eats ${a.food}, so it will be hungry soon. The kindest thing is to take it back where it belongs."`),
      J(`${hero} asked ${adult} what to do. "${cap(An)} lives ${a.home}, and it feeds on ${a.food}," ${adult} explained. "The kindest thing is to return it to where it belongs."`),
    );
    const P3 = c.v(
      J(`They did. The ${n} went home. ${hero} felt ${emoEnd}.`),
      J(`They carried the ${n} home with care. ${hero} watched it go. ${hero} felt ${emoEnd}.`),
      J(`Together they carried the ${n} back to where it belonged, and ${hero} watched it settle in. ${hero} felt ${emoEnd}.`, c.g >= 3 && `${His} kindness had made a difference.`),
      J(`Together they carefully carried the ${n} back to where it belonged, and ${hero} watched it settle in. ${hero} felt ${emoEnd}.`, `${His} kindness had made a real difference.`),
      J(`Together they carefully returned the ${n} to where it belonged, and ${hero} watched it settle back in. ${hero} felt ${emoEnd}, knowing that ${his} compassion had made a real difference.`),
    );
    return {
      title: titleFn(hero, n), titleFn, emoji: '🐾', genre: 'Story',
      wrongTitles: others.map((o) => titleFn(hero, o.n)),
      paras: [P1, P2, P3],
      facts: { hero, pal, helper: adult, midWho: hero, endWho: hero, prob: `${he} saw the lost ${n}`, trait: traitFor(c, ['kind', 'compassionate', 'thoughtful']) },
      events: [`${hero} found ${An}`, `${adult} said where the ${n} lives`, `They took the ${n} home`],
      fakes: [`${hero} kept the ${n} as a pet forever`, `The ${n} got away by itself`, `${hero} left the ${n} alone`],
      predict: { q: `What will ${hero} probably do the next time an animal is lost?`, a: 'Help it get home', w: ['Ignore it', 'Run away', 'Take it far away'] },
      infer: { q: `Why did ${adult} say to take the ${n} home?`, a: `That is where ${An} belongs`, w: ['It was too loud', 'It was too big', 'It wanted to go to school'] },
      qs: [
        Q(`What did ${hero} find?`, cap(withA(n)), others.map((o) => cap(withA(o.n))), 3),
        Q(`Where did ${hero} find the ${n}?`, cap(p1), c.pool('places', [p1]), 4),
        Q(`Where does ${An} live?`, cap(a.home), uniq(others.map((o) => cap(o.home))).filter((x) => x !== cap(a.home)), 5),
        Q(`Who told ${hero} where the ${n} lives?`, adult, [...c.pool('names', [adult]), ...c.pool('adults', [adult])], 6),
        Q(`What does ${An} eat?`, cap(a.food), uniq(others.map((o) => cap(o.food))).filter((x) => x !== cap(a.food)), 9, 1),
        Q(`What kind of animal is ${An}?`, cap(a.kind), KINDS_INFO.filter((k) => k !== a.kind).map(cap), 41, 2),
        Q(`What did ${hero} do with the ${n}?`, 'Took it home', ['Kept it forever', 'Gave it a bath', 'Sold it'], 10),
      ],
    };
  },
};

// ---------------------------------------------------------------- TEAMWORK
const TASKS = {
  0: ['a tall block tower', 'a big puzzle', 'a paper chain', 'a sand castle'],
  1: ['a class poster', 'a garden bed', 'a science model', 'a recycling display', 'a paper-mache volcano'],
  2: ['a giant community mural', 'the science fair display', 'a robotics project', 'a river cleanup plan', 'a school newspaper', 'a documentary video'],
};
const JOBS = {
  0: ['cut the paper', 'glue the parts', 'add the color', 'check the work'],
  1: ['gather the supplies', 'build the base', 'decorate the top', 'check every detail'],
  2: ['research the facts', 'design the layout', 'assemble the pieces', 'proofread the details'],
};
export const team = {
  id: 'team',
  build(c) {
    const { hero, He, His, he, his, him, pal, emoMid, emoEnd } = c;
    let third = c.roster[(c.k + 13) % c.roster.length];
    if (third === hero || third === pal) third = c.roster[(c.k + 14) % c.roster.length];
    if (third === hero || third === pal) third = c.roster[(c.k + 15) % c.roster.length];
    const task = c.sc(TASKS[c.tier]);
    const jobs = c.rng.sample(JOBS[c.tier], 3);
    const titleFn = (nm) => c.v(`${nm} and the Team`, `${nm}’s Team`, `${nm}’s ${T(c, task.replace(/^(a|the) /, '').split(' ').slice(-1)[0])} Team`, `${nm}’s Team Effort`, `${nm} and the Power of Teamwork`);
    const P1 = c.v(
      J(`${hero}, ${pal}, and ${third} had to make ${task}. It was a lot!`, `${hero} felt ${emoMid}.`),
      J(`${hero}, ${pal}, and ${third} had to finish ${task}. It was too much work for one kid.`, `${hero} felt ${emoMid}.`),
      J(`${hero}, ${pal}, and ${third} had to finish ${task} by the end of the day. It was far too much work for one person, and ${hero} felt ${emoMid}.`),
      J(`${hero}, ${pal}, and ${third} were assigned to complete ${task} before the end of the day. The job was far too large for one person, and ${hero} felt ${emoMid}.`),
      J(`${hero}, ${pal}, and ${third} were assigned to complete ${task} before the deadline. The workload was far too large for a single person, and ${hero} felt ${emoMid}.`),
    );
    const P2 = c.v(
      J(`${hero} had an idea. "Each of us can do one part," ${he} said.`, `${hero} did a part. ${pal} did a part. ${third} did a part.`),
      J(`${hero} had an idea. "Each of us can do one part," ${he} said.`, `${hero} would ${jobs[0]}. ${pal} would ${jobs[1]}. ${third} would ${jobs[2]}.`),
      J(`${hero} had an idea. "Each of us can do one part," ${he} said.`, `${hero} would ${jobs[0]}, ${pal} would ${jobs[1]}, and ${third} would ${jobs[2]}.`, `Soon all three were hard at work.`),
      J(`${hero} suggested a plan. "If each of us takes one part, we can finish on time," ${he} said.`, `${hero} would ${jobs[0]}, ${pal} would ${jobs[1]}, and ${third} would ${jobs[2]}.`, `Soon all three were working steadily.`),
      J(`${hero} suggested a plan. "If each of us takes one part, we can finish on time," ${he} said.`, `${hero} would ${jobs[0]}, ${pal} would ${jobs[1]}, and ${third} would ${jobs[2]}.`, `Soon all three were working steadily and in sync.`),
    );
    const P3 = c.v(
      J(`They did it! They all felt ${emoEnd}.`),
      J(`They finished it! They all felt ${emoEnd}.`),
      J(`They finished with time to spare. All three felt ${emoEnd}.`),
      J(`They finished with time to spare, and all three felt ${emoEnd}.`, c.g >= 5 && `${hero} realized the plan had worked because everyone did a share.`),
      J(`They finished with time to spare, and all three felt ${emoEnd}. ${hero} realized that dividing the work had made the impossible achievable.`),
    );
    return {
      title: titleFn(hero), titleFn, emoji: '🧩', genre: 'Story',
      paras: [P1, P2, P3],
      facts: { hero, pal, helper: pal, midWho: hero, endWho: hero, prob: 'there was so much work', trait: traitFor(c, ['responsible', 'thoughtful', 'resourceful']), noHelperQ: true },
      events: [`The team had too much to do`, `${hero} shared the jobs`, `They finished ${task}`],
      fakes: [`${third} left the team`, `They gave up`, `The teacher finished it for them`],
      predict: { q: `What will the team probably do the next time a job is big?`, a: 'Share the work', w: ['Wait for someone else', 'Quit', 'Do it alone'] },
      infer: { q: `Why did they finish on time?`, a: 'Everyone did a part', w: ['One kid did all the work', 'They skipped steps', 'They got extra time'] },
      qs: [
        Q(`What did they have to make?`, cap(task), TASKS[c.tier].filter((x) => x !== task).map(cap), 3),
        Q(`How many kids were on the team?`, '3', ['2', '4', '5', '1'], 4),
        Q(`Who had the idea to share the work?`, hero, [pal, third, ...c.pool('names', [hero, pal, third])], 5),
        Q(`What was ${hero}’s job?`, cap(jobs[0]), JOBS[c.tier].filter((x) => x !== jobs[0]).map(cap), 8, 1),
        Q(`Who would ${jobs[1]}?`, pal, [third, ...c.pool('names', [hero, pal, third])], 9, 1),
        Q(`Who would ${jobs[2]}?`, third, [pal, ...c.pool('names', [hero, pal, third])], 10, 1),
        Q(`What did ${hero} say?`, c.lv >= 3 ? 'If each of us takes one part, we can finish on time' : 'Each of us can do one part', ['Let us give up', 'I will do it all', 'Do not tell the teacher'], 7),
      ],
    };
  },
};

// ---------------------------------------------------------------- MYSTERY NOISE
const NOISES = {
  0: [['a tap, tap, tap', 'a branch'], ['a thump', 'a cat'], ['a buzz', 'a bee'], ['a ding, ding', 'a bell'], ['a bump', 'a ball'], ['a squeak', 'a mouse']],
  1: [['a faint scratching sound', 'a puppy at the door'], ['a rattling noise', 'the wind in the window'], ['a low humming sound', 'the refrigerator'], ['a soft tapping sound', 'rain on the roof'], ['a strange whistle', 'the tea kettle'], ['a slow dripping sound', 'a leaky faucet']],
  2: [['an eerie creaking', 'the old floorboards settling'], ['a rhythmic thumping', 'the washing machine'], ['a muffled tune', 'a music box left open'], ['a faint tapping', 'a loose shutter'], ['a ghostly whistling', 'wind in the chimney'], ['a distant rumbling', 'a delivery truck passing by']],
};
export const mystery = {
  id: 'mystery',
  build(c) {
    const { hero, He, His, he, his, him, pal, emoMid, emoEnd, p1 } = c;
    const list = NOISES[c.tier];
    const idx = c.scAt(list);
    const [sound, cause] = list[idx];
    const otherPairs = list.filter((_, i) => i !== idx);
    const titleFn = (nm) => c.v(`${nm} and the Noise`, `${nm} and the Strange Sound`, `${nm} and the Mystery of the Sound`, `${nm} and the Sound in the ${T(c, ['Night', 'Hallway', 'Dark', 'Quiet'][c.k % 4])}`, `${nm} and the Unexplained Noise`);
    const P1 = c.v(
      J(`${hero} was ${p1}. ${hero} heard ${sound}!`, `${hero} felt ${emoMid}.`),
      J(`${hero} was ${p1} when ${he} heard ${sound}. ${He} felt ${emoMid}.`),
      J(`${hero} was ${p1} when ${he} heard ${sound}. ${He} froze, and ${he} felt ${emoMid}.`),
      J(`${hero} was ${p1} when ${he} heard ${sound}. ${He} froze in place, feeling ${emoMid}.`, c.g >= 5 && `${His} imagination began to race.`),
      J(`${hero} was ${p1} when ${he} heard ${sound}. ${He} froze in place, feeling ${emoMid} as ${his} imagination began to race.`),
    );
    const P2 = c.v(
      J(`${pal} and ${hero} went to look.`),
      J(`${He} called ${pal}, and they went to look.`),
      J(`${He} called ${pal}, and together they crept toward the sound.`),
      J(`${He} called ${pal}, and together they tiptoed toward the sound, listening carefully.`),
      J(`${He} called ${pal}, and together they tiptoed toward the sound, pausing to listen at each step.`),
    );
    const P3 = c.v(
      J(`It was ${cause}! ${hero} felt ${emoEnd}.`),
      J(`It was ${cause}! ${hero} laughed and felt ${emoEnd}.`),
      J(`There, they found ${cause}! ${hero} laughed and felt ${emoEnd}.`),
      J(`There, they discovered ${cause}! ${hero} laughed out loud and felt ${emoEnd}.`),
      J(`There, they discovered the cause: ${cause}. ${hero} laughed with relief and felt ${emoEnd}, amused that such a small thing had caused so much worry.`),
    );
    return {
      title: titleFn(hero), titleFn, emoji: '🔍', genre: 'Story',
      paras: [P1, P2, P3],
      facts: { hero, pal, helper: pal, midWho: hero, endWho: hero, prob: `${he} heard ${sound}`, trait: traitFor(c, ['curious', 'courageous', 'inquisitive', 'brave']) },
      events: [`${hero} heard ${sound}`, `${hero} and ${pal} went to look`, `They found ${cause}`],
      fakes: [`${hero} ran away and hid`, `They decided to ignore it`, `The sound never stopped`],
      predict: { q: `What will ${hero} probably do the next time ${he} hears a strange sound?`, a: 'Go and find out what it is', w: ['Hide forever', 'Scream and run', 'Cover ' + his + ' ears and never look'] },
      infer: { q: `Why did ${hero} feel ${emoEnd} at the end?`, a: 'The sound was harmless', w: ['The sound got louder', 'The sound came back', 'The sound was a monster'] },
      qs: [
        Q(`What did ${hero} hear?`, cap(sound), otherPairs.map((p) => cap(p[0])), 3),
        Q(`Where was ${hero} when ${he} heard it?`, cap(p1), c.pool('places', [p1]), 4),
        Q(`Who went with ${hero} to look?`, pal, c.pool('names', [pal, hero]), 5),
        Q(`What was making the sound?`, cap(cause), otherPairs.map((p) => cap(p[1])), 6),
        Q(`What did ${hero} do when ${he} heard the sound?`, c.lv >= 2 ? 'Went to find out what it was' : 'Went to look', ['Went to sleep', 'Ran far away', 'Hid in the closet'], 8),
        Q(`Was the sound dangerous?`, 'No, it was harmless', ['Yes, it was a monster', 'Yes, it was a thief', 'Nobody found out'], 9, 1),
      ],
    };
  },
};

// ---------------------------------------------------------------- ANIMAL FACT FILE (informational text)
const ATTRS = [
  ['kind', (a) => `What kind of animal is the ${a.n}?`, (a) => cap(a.kind), 5, 0],
  ['cover', (a) => `What covers the ${a.n}’s body?`, (a) => cap(a.cover), 6, 0],
  ['home', (a) => `Where does the ${a.n} live?`, (a) => cap(a.home), 7, 0],
  ['food', (a) => `What does the ${a.n} eat?`, (a) => cap(a.food), 8, 0],
  ['move', (a) => `How does the ${a.n} move?`, (a) => `It ${a.move}`, 9, 0],
  ['baby', (a) => `What is a baby ${a.n} called?`, (a) => cap(a.baby), 10, 1],
  ['fun', (a) => `Which fact is true about the ${a.n}?`, (a) => `It ${a.fun}`, 11, 2],
];
export const fact = {
  id: 'fact',
  build(c) {
    const pool = animalsFor(c.tier);
    const a = pool[(c.k * 5 + c.g * 7 + Math.floor(c.k / pool.length)) % pool.length];
    const n = a.n;
    const others = pool.filter((x) => x.n !== n);
    const titleFn = (_, an) => c.v(`The ${T(c, an)}`, `All About the ${T(c, an)}`, `Meet the ${T(c, an)}`, `Amazing Facts About the ${T(c, an)}`, `The ${T(c, an)}: A Closer Look`);
    const p1 = c.v(
      J(`The ${n} is ${withA(a.kind)}.`, `It has ${a.cover}.`, `It lives ${a.home}.`, `It eats ${a.food}.`),
      J(`The ${n} is ${withA(a.kind)}.`, `It has ${a.cover}.`, `It lives ${a.home}.`, `It eats ${a.food}.`),
      J(`The ${n} is ${withA(a.kind)}.`, `It has ${a.cover}.`, `It lives ${a.home}, and it eats ${a.food}.`),
      J(`The ${n} belongs to a group of animals called ${plural(a.kind)}.`, `Its body is covered with ${a.cover}.`, `It lives ${a.home} and eats ${a.food}.`),
      J(`The ${n} belongs to a group of animals called ${plural(a.kind)}, which share certain features.`, `Its body is protected by ${a.cover}.`, `It makes its home ${a.home} and feeds on ${a.food}.`),
    );
    const p2 = c.v(
      J(`It ${a.move}.`),
      J(`The ${n} ${a.move}.`, `A baby ${n} is called ${withA(a.baby)}.`),
      J(`The ${n} ${a.move}.`, `A baby ${n} is called ${withA(a.baby)}.`, `Did you know? The ${n} ${a.fun}.`),
      J(`The ${n} ${a.move}.`, `A young ${n} is called ${withA(a.baby)}.`, `Here is an interesting fact: the ${n} ${a.fun}.`),
      J(`The ${n} ${a.move}, and a young ${n} is called ${withA(a.baby)}.`, `Here is an interesting fact: the ${n} ${a.fun}.`, `Scientists study the ${n} to learn how animals adapt to life ${a.home}.`),
    );
    const qs = [];
    for (const [key, qf, af, ord, minG] of ATTRS) {
      if (key === 'fun') {
        qs.push(Q(qf(a), af(a), others.map((o) => `It ${o.fun}`), ord, minG));
      } else if (key === 'kind') {
        qs.push(Q(qf(a), af(a), KINDS_INFO.filter((k) => k !== a.kind).map(cap), ord, minG));
      } else {
        qs.push(Q(qf(a), af(a), uniq(others.map(af)).filter((x) => x !== af(a)), ord, minG));
      }
    }
    qs.push(Q('Which animal is this text about?', cap(n), others.map((o) => cap(o.n)), 2));
    qs.push(Q('What is this text mostly about?', `The ${n} and how it lives`, ['How to bake a cake', 'A trip to the moon', 'How to build a house'], 3));
    qs.push(Q(`Which sentence is true?`, `The ${n} eats ${a.food}.`, others.map((o) => `The ${n} eats ${o.food}.`), 12));
    qs.push(Q(`Which sentence is true?`, `The ${n} lives ${a.home}.`, others.map((o) => `The ${n} lives ${o.home}.`), 13));
    qs.push(Q(`Which sentence is NOT true?`, `The ${n} is a ${others.find((o) => o.kind !== a.kind).kind}.`, [`The ${n} has ${a.cover}.`, `The ${n} eats ${a.food}.`, `The ${n} lives ${a.home}.`], 14, 1));
    return {
      title: titleFn('', n), titleFn, emoji: '📗', genre: 'Informational text',
      wrongTitles: others.slice(0, 6).map((o) => titleFn('', o.n)),
      paras: [p1, p2],
      facts: { noWho: true, topic: n },
      events: null, fakes: null, qs,
    };
  },
};

// ---------------------------------------------------------------- HOW-TO TEXT
const HOWTO = {
  0: [
    ['a sandwich', ['Get two slices of bread.', 'Put cheese on one slice.', 'Put the slices together.']],
    ['a paper hat', ['Get a big sheet of paper.', 'Fold it in half.', 'Fold the top corners in.']],
    ['a cup of juice', ['Get a cup.', 'Pour in the juice.', 'Take a sip.']],
    ['a sand hill', ['Get a pail.', 'Fill the pail with sand.', 'Flip the pail over.']],
    ['a bed for a doll', ['Get a small box.', 'Put a cloth in the box.', 'Lay the doll on the cloth.']],
    ['a card for Mom', ['Fold a sheet of paper.', 'Draw a big heart.', 'Write your name.']],
    ['a snack of apple slices', ['Wash the apple.', 'Cut it into slices.', 'Put the slices on a plate.']],
    ['a kite', ['Get a sheet of paper.', 'Tape a stick to it.', 'Tie on a long string.']],
  ],
  1: [
    ['a fruit salad', ['Wash the fruit.', 'Cut the fruit into small pieces.', 'Put the pieces in a bowl.', 'Stir them together.']],
    ['a paper airplane', ['Fold a sheet of paper in half.', 'Fold the top corners to the middle.', 'Fold the sides in again.', 'Fold the wings down and toss it.']],
    ['a bird feeder', ['Get a clean cardboard tube.', 'Spread peanut butter on the tube.', 'Roll the tube in birdseed.', 'Hang it from a tree branch.']],
    ['a bean plant', ['Fill a cup with soil.', 'Push a bean into the soil.', 'Add a little water.', 'Put the cup near a sunny window.']],
    ['lemonade', ['Squeeze the lemons into a pitcher.', 'Add water.', 'Stir in some sugar.', 'Pour it over ice.']],
    ['a friendship bracelet', ['Cut three strings of yarn.', 'Tie them together at the top.', 'Braid the strings.', 'Tie the ends together.']],
    ['a paper bag puppet', ['Draw a face on a paper bag.', 'Cut out paper ears.', 'Glue the ears on the bag.', 'Slide your hand into the bag.']],
    ['a fruit smoothie', ['Put banana slices in a blender.', 'Add a cup of milk.', 'Blend until smooth.', 'Pour it into a glass.']],
  ],
  2: [
    ['a simple circuit', ['Gather a battery, a bulb, and two wires.', 'Attach one wire to the battery.', 'Connect the other end to the bulb.', 'Attach a second wire from the bulb to the battery.', 'Watch the bulb light up.']],
    ['a compost bin', ['Choose a shady spot outside.', 'Layer dry leaves on the bottom.', 'Add fruit and vegetable scraps.', 'Cover the scraps with more leaves.', 'Stir the pile every week.']],
    ['a model volcano', ['Build a cone out of clay around a bottle.', 'Pour baking soda into the bottle.', 'Add a drop of dish soap.', 'Pour in some vinegar.', 'Step back and watch it erupt.']],
    ['a research report', ['Choose a topic.', 'Gather facts from reliable sources.', 'Write an outline.', 'Draft each paragraph.', 'Proofread the final copy.']],
    ['pizza dough', ['Mix flour, yeast, and warm water.', 'Knead the dough for ten minutes.', 'Let it rise for one hour.', 'Roll it out flat.', 'Add toppings and bake.']],
    ['a stop-motion movie', ['Plan a short story.', 'Set up a camera on a tripod.', 'Take a photo of the scene.', 'Move the figures a tiny bit and take another photo.', 'Play the photos quickly in order.']],
    ['a garden bed', ['Pick a sunny spot.', 'Remove the weeds.', 'Loosen and enrich the soil.', 'Plant the seeds in rows.', 'Water them and add a label.']],
    ['a solar oven', ['Line a pizza box with foil.', 'Cut a flap in the lid.', 'Cover the opening with plastic wrap.', 'Set a snack inside on a plate.', 'Place the box in direct sunlight.']],
  ],
};
const SEQ = { 3: ['First,', 'Next,', 'Last,'], 4: ['First,', 'Next,', 'Then,', 'Last,'], 5: ['First,', 'Next,', 'Then,', 'After that,', 'Last,'] };

export const howto = {
  id: 'howto',
  build(c) {
    const { hero, he, He, emoEnd } = c;
    const list = HOWTO[c.tier];
    const idx = (c.k * 3 + c.g * 5 + Math.floor(c.k / list.length)) % list.length;
    const [thing, steps] = list[idx];
    const otherSteps = list.filter((_, i) => i !== idx).flatMap((x) => x[1]);
    const seq = SEQ[steps.length];
    const TT = (th) => T(c, th.replace(/^(a|an|the) /, ''));
    const titleFn = (_, th) => c.v(`How to Make ${TT(th)}`, `How to Make ${TT(th)}`, `Making ${TT(th)}`, `A Guide to Making ${TT(th)}`, `Step by Step: ${TT(th)}`);
    const body = steps.map((s, i) => `${seq[i]} ${lc(s)}`).join(' ');
    const intro = c.v(`Let us make ${thing}.`, `Do you want to make ${thing}? Here is how.`, `Do you want to make ${thing}? Follow these steps.`, `Making ${thing} is easier than it looks. Follow these steps in order.`, `Making ${thing} is easier than it looks, provided the steps are followed in order.`);
    const outro = c.g >= 1 ? `${hero} tried these steps and felt ${emoEnd}.` : null;
    const wrongTitles = list.filter((_, i) => i !== idx).slice(0, 5).map((x) => titleFn('', x[0]));
    const ord = ['first', 'second', 'third', 'fourth', 'fifth'];
    const qs = [
      Q(`What is the first step?`, steps[0], otherSteps, 3),
      Q(`What is the last step?`, steps[steps.length - 1], otherSteps, 4),
      Q(`What do you do right after "${steps[0].replace(/\.$/, '')}"?`, steps[1], [steps[steps.length - 1], ...otherSteps], 5),
      Q(`What is this text about?`, `How to make ${thing}`, list.filter((_, i) => i !== idx).map((x) => `How to make ${x[0]}`), 2),
      Q(`How many steps are there?`, String(steps.length), [String(steps.length + 1), String(steps.length - 1), String(steps.length + 2), String(steps.length + 3)], 6),
      Q(`Which step comes ${ord[1]}?`, steps[1], [steps[0], steps[steps.length - 1], ...otherSteps], 7),
      Q(`Which step comes ${ord[2]}?`, steps[2], [steps[0], steps[1], ...otherSteps], 8),
      Q(`Which of these is NOT a step?`, otherSteps[(c.k * 3) % otherSteps.length], steps, 9),
      Q(`What do you do right before "${steps[steps.length - 1].replace(/\.$/, '')}"?`, steps[steps.length - 2], [steps[0], ...otherSteps], 12, 1),
      Q(`Which word tells you a step comes first?`, 'First', ['Last', 'Then', 'Finally'], 14, 1),
      Q(`Which word tells you a step comes at the end?`, 'Last', ['First', 'Next', 'Begin'], 15, 1),
    ];
    return {
      title: titleFn('', thing), titleFn, emoji: '🛠️', genre: 'How-to text', wrongTitles,
      paras: [J(intro), body, outro].filter(Boolean),
      facts: c.g >= 1 ? { noWho: true, hero, endWho: hero, topic: thing } : { noWho: true, topic: thing },
      events: null, fakes: null, qs,
    };
  },
};
