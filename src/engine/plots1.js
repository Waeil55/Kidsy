// Story plots, part 1. Every plot returns a "spec": title, paragraphs, and the facts the
// question builder needs. Text is written per language level (c.v) and gated by grade (c.g)
// so each grade reads material that fits it.
import { cap, withA } from '../lib/rng.js';
import { TRAITS } from './pools.js';

export const J = (...a) => a.filter(Boolean).join(' ');
export const Q = (q, a, w, ord = 15, minG = 0) => ({ q, a, w, ord, minG });
export const lc = (s) => (s ? s[0].toLowerCase() + s.slice(1) : s);

// Which trait word (if any) suits a plot at this language level.
export function traitFor(c, prefs) {
  const list = TRAITS[c.lv];
  if (!list) return null;
  return list.find((t) => prefs.includes(t[0])) || null;
}

// Plain-English summary lines used for "main problem / how solved / lesson" questions.
// Index = language level (0..4). Missing entries fall back to the level below.
export const META = {
  lost: {
    problem: ['a lost thing', 'a lost thing', 'a lost belonging', 'a missing treasured object', 'a treasured object that has gone missing'],
    solution: ['a friend told where to look', 'someone helped to look in a new place', 'thinking back to where it was last seen', 'retracing steps with help from another person', 'retracing steps and accepting guidance'],
    theme: ['Ask for help when you need it.', 'It is okay to ask for help.', 'Asking for help makes a problem smaller.', 'Staying calm and asking for help solves problems.', 'Calm thinking and cooperation can turn a problem into a solution.'],
    sum: 'A child loses something special and finds it again with help.',
  },
  skill: {
    problem: ['a hard new job', 'something new that is hard to do', 'a new skill that is hard to learn', 'a skill that is much harder than expected', 'a challenging skill that resists early attempts'],
    solution: ['try and try again', 'practice every day', 'practice with advice from a helper', 'daily practice and good advice', 'steady practice guided by good advice'],
    theme: ['Do not give up.', 'If you keep trying, you can do it.', 'Practice turns hard things into easy things.', 'Perseverance turns failure into success.', 'Persistence and guidance turn early failure into mastery.'],
    sum: 'A child struggles to learn a skill but improves through daily practice.',
  },
  share: {
    problem: ['a friend with no snack', 'a friend who has no snack', 'a friend who forgot lunch', 'a classmate who has nothing to eat', 'a classmate who has been left without a meal'],
    solution: ['share half', 'share the snack', 'share half of a snack', 'offering to divide the food', 'dividing what one has with someone in need'],
    theme: ['It is good to share.', 'Sharing makes everyone happy.', 'Being kind can change someone’s day.', 'Generosity strengthens friendships.', 'Small acts of generosity build trust between people.'],
    sum: 'A child shares food with a friend who has none.',
  },
  weather: {
    problem: ['bad weather ruins a plan', 'bad weather spoils a plan', 'bad weather spoils an outdoor plan', 'unexpected weather forces a change of plans', 'unpredictable weather disrupts carefully made plans'],
    solution: ['find a new game', 'find a fun new thing to do', 'pick a fun indoor activity', 'invent a new plan for the day', 'adapt by inventing a better plan'],
    theme: ['Make a new plan and have fun.', 'You can have fun even when plans change.', 'A change of plans can lead to something better.', 'A change of plans can lead to something better.', 'Flexibility can turn a disappointment into an opportunity.'],
    sum: 'Bad weather cancels a plan, so two friends invent a new one.',
  },
  animal: {
    problem: ['a lost animal', 'an animal that is lost', 'a young animal that is far from home', 'a frightened animal far from its home', 'a vulnerable animal separated from its habitat'],
    solution: ['take it home', 'take the animal home', 'bring the animal back to where it lives', 'return the animal to its natural home', 'returning the animal safely to its habitat'],
    theme: ['Be kind to animals.', 'Be kind to animals and help them.', 'Caring for animals means learning what they need.', 'Compassion means noticing when others need help.', 'Compassion requires understanding what another creature needs.'],
    sum: 'A child finds a lost animal and helps it get back home.',
  },
  mistake: {
    problem: ['a broken thing', 'something got broken', 'a mistake that breaks something', 'a mistake that is hard to admit', 'an accident that is difficult to own up to'],
    solution: ['tell the truth', 'tell the truth and say sorry', 'tell the truth and help fix it', 'admit the mistake and help repair it', 'admitting the mistake and helping to repair it'],
    theme: ['Tell the truth.', 'Telling the truth is always best.', 'Honesty is the best choice, even when it is hard.', 'Owning up to a mistake earns trust.', 'Accountability earns trust, even when the truth is uncomfortable.'],
    sum: 'A child breaks something, tells the truth, and helps fix it.',
  },
  team: {
    problem: ['too much work for one kid', 'too much work to do alone', 'a big job that is too large for one person', 'a huge task with too little time', 'a demanding project with a tight deadline'],
    solution: ['each kid does one part', 'split the job into parts', 'divide the work so everyone has a job', 'share the tasks among the team', 'dividing responsibilities among team members'],
    theme: ['Work as a team.', 'Working together is fun.', 'Working together makes hard jobs easier.', 'Teamwork can accomplish what one person cannot.', 'Collaboration multiplies what individuals can achieve.'],
    sum: 'Three kids split up a big job and finish it together.',
  },
  mystery: {
    problem: ['a strange sound', 'a strange sound that is scary', 'a mysterious sound that nobody understands', 'an unexplained noise that causes worry', 'an unexplained noise that provokes anxiety'],
    solution: ['go and look', 'go and find where it comes from', 'follow the sound to find the cause', 'investigate calmly to find the cause', 'investigating calmly until the cause is discovered'],
    theme: ['Look with care.', 'Do not be scared. Find out.', 'Fear often shrinks when you look at it closely.', 'Curiosity can turn a scary mystery into a discovery.', 'Calm investigation dissolves fear and reveals the truth.'],
    sum: 'A child hears a strange noise and discovers a harmless cause.',
  },
};
export const NARRATIVE_IDS = Object.keys(META);

const T = (c, s) => c.titleCase(s);

// ---------------------------------------------------------------- LOST & FOUND
const LOST_WHILE = {
  0: ['ran to pet a dog', 'ran to see a bug', 'sat down to eat a snack', 'went to get a drink', 'ran to hug a friend'],
  1: ['stopped to pet a neighbor’s dog', 'ran to catch the school bus', 'set it down to tie a shoe', 'got busy talking with a friend', 'went to help carry the groceries', 'stopped to watch a butterfly'],
  2: ['became absorbed in a conversation', 'rushed to catch the ferry', 'set it aside while helping a neighbor', 'got distracted by a street musician', 'hurried off to answer the door', 'was distracted by a sudden rainstorm'],
};

export const lost = {
  id: 'lost',
  build(c) {
    const { hero, He, His, he, his, him, pal, itn, it, aIt, p1, p2, p3, emoMid, emoEnd } = c;
    const wh = c.sc(LOST_WHILE[c.tier]);
    const palHelps = c.k % 2 === 0;
    const helper = palHelps ? pal : c.adult;
    const titleFn = (nm, n) => c.v(`${nm} and the Lost ${T(c, n)}`, `${nm} and the Lost ${T(c, n)}`, `${nm}’s Missing ${T(c, n)}`, `The Search for ${nm}’s ${T(c, n)}`, `${nm} and the Vanished ${T(c, n)}`);
    const s2 = c.v(`${He} looked ${p1}. No ${itn}.`, `${He} looked ${p1}, but it was not there.`, `${He} searched ${p1} first, but found nothing.`, `${He} retraced ${his} steps ${p1}, but there was no sign of it.`, `${He} retraced ${his} steps ${p1}, yet there was no trace of it.`);
    const P1 = c.v(
      J(`${hero} had ${aIt}.`, `${He} had fun with it.`),
      J(`${hero} loved ${his} ${it}.`, `${He} took it everywhere.`),
      J(`${hero} carried ${his} ${it} everywhere.`, `One afternoon, ${he} ${wh}.`, `When ${he} looked down, the ${itn} was gone!`, c.g >= 3 && `${His} heart sank.`),
      J(`${hero} had owned ${his} ${it} for years, and ${he} rarely let it out of ${his} sight.`, `Yet one afternoon, ${he} ${wh}, and when ${he} turned back, the ${itn} had vanished.`, c.g >= 5 && `${He} could hardly believe it.`),
      J(`${hero} treasured ${his} ${it}, and ${he} guarded it carefully.`, `Nevertheless, one afternoon ${he} ${wh}, and by the time ${he} turned around, the ${itn} had disappeared without a trace.`, `${He} stood motionless, unable to believe it.`),
    );
    const P2 = c.v(
      J(`Then it was not there! ${hero} felt ${emoMid}.`, s2, `${He} looked ${p2}. No ${itn}.`),
      J(`One day, ${he} could not find it. ${hero} felt ${emoMid}.`, s2, `Then ${he} looked ${p2}. It was not there, too.`),
      J(`${hero} felt ${emoMid}.`, s2, `Next, ${he} searched ${p2}. Still no ${itn}.`, c.g >= 3 && `${He} tried to remember the last place ${he} had seen it.`),
      J(`Panic rose in ${his} chest, and ${he} felt ${emoMid}.`, s2, `Then ${he} combed the area ${p2}, but the ${itn} was nowhere to be found.`, c.g >= 5 && `Every minute made the search seem more hopeless.`),
      J(`A wave of worry swept over ${him}, and ${he} felt ${emoMid}.`, s2, `${He} then combed the area ${p2}, but the ${itn} was nowhere to be found.`, `Each passing minute made the search seem more futile.`),
    );
    const P3 = c.v(
      J(`${helper} said, "Look ${p3}!"`, `${hero} looked ${p3}. Yes! The ${itn} was there!`, `${hero} felt ${emoEnd}.`),
      J(`${helper} came to help. "Did you check ${p3}?" ${helper} asked.`, `${hero} ran to look ${p3}. There it was!`, `${hero} felt ${emoEnd} and said, "Thank you!"`),
      J(`${helper} noticed the trouble. "Let us think," ${helper} said. "Where were you before you noticed it was gone?"`, `${hero} thought hard and remembered being ${p3}.`, `${He} hurried there, and the ${itn} was waiting.`, `${hero} felt ${emoEnd}.`),
      J(`Then ${helper} suggested a new approach. "Instead of searching everywhere, think backward from the last moment you had it."`, `Following that advice, ${hero} remembered being ${p3}. ${He} rushed there and found the ${itn} sitting in plain view.`, `${hero} felt ${emoEnd}.`),
      J(`At that moment ${helper} offered a calmer strategy. "Rather than searching at random, think backward from the last moment you had it."`, `Heeding the advice, ${hero} recalled being ${p3}, hurried there, and discovered the ${itn} sitting in plain view.`, `${hero} felt ${emoEnd}, and the tension drained away.`),
    );
    const tf = traitFor(c, ['careful', 'responsible', 'resourceful']);
    const others = LOST_WHILE[c.tier].filter((x) => x !== wh);
    return {
      title: titleFn(hero, itn), titleFn, emoji: c.item.e, genre: 'Story',
      paras: [P1, P2, P3],
      facts: { hero, pal, helper, itemCentral: true, midWho: hero, endWho: hero, prob: `the ${itn} was gone`, trait: tf },
      events: [`${hero} could not find ${his} ${itn}`, `${hero} looked ${p1} and ${p2}`, `${hero} found the ${itn} ${p3}`],
      fakes: [`${hero} bought a new ${itn}`, `${hero} gave the ${itn} away`, `${pal} broke the ${itn}`],
      pron: c.lv >= 2 ? { sent: s2, w: He, ans: hero } : null,
      predict: { q: `What will ${hero} probably do next time?`, a: `Keep ${his} ${itn} in a safe place`, w: [`Throw the ${itn} away`, `Lose it on purpose`, `Stop looking for things`] },
      infer: { q: `Why did ${hero} feel ${emoEnd} at the end?`, a: `The ${itn} was found`, w: ['A new toy arrived', 'School ended early', 'A storm passed'] },
      qs: [
        Q(`What did ${hero} lose?`, cap(aIt), c.pool('items'), 3),
        Q(`Where did ${hero} look first?`, cap(p1), [...(c.stage >= 1 ? [cap(p2)] : []), ...c.pool('places', [p1, p2, p3])], 4),
        Q(`Where did ${hero} look second?`, cap(p2), [...(c.stage >= 1 ? [cap(p1)] : []), ...c.pool('places', [p1, p2, p3])], 5),
        Q(`Where was the ${itn} at last?`, cap(p3), [cap(p1), cap(p2), ...c.pool('places', [p1, p2, p3])], 6),
        Q(`Who helped ${hero}?`, helper, [...c.pool('names', [helper]), ...c.pool('adults', [helper])], 7),
        Q(`How many places did ${hero} look?`, '3', ['2', '4', '5', '1'], 8),
        Q(`Why did ${hero} lose the ${itn}?`, `${He} ${wh}.`, others.map((x) => `${He} ${x}.`), 16, 1),
        Q(`What helped ${hero} find it?`, c.lv >= 2 ? `Thinking about where ${he} had been` : `Someone told ${him} where to look`, [`It came back by itself`, `A dog brought it`, `It was in ${his} pocket the whole time`], 17, 1),
      ],
    };
  },
};

// ---------------------------------------------------------------- LEARNING A SKILL
const SKILLS = {
  0: ['hop on one foot', 'tie a shoe', 'clap a beat', 'zip a coat', 'throw a ball', 'skip'],
  1: ['ride a bike', 'swim', 'whistle', 'jump rope', 'bake cookies', 'juggle', 'catch a ball', 'do a cartwheel'],
  2: ['play chess', 'play the violin', 'build a birdhouse', 'code a game', 'speak Spanish', 'bake bread', 'play the drums', 'paint with watercolors'],
};
const TIPS = {
  0: ['Go slow and try again.', 'Watch me, then you try.', 'Take a big breath.', 'Try one small step.'],
  1: ['Start slowly and keep going.', 'Watch my hands, then copy me.', 'Practice a little each day.', 'Break it into small steps.'],
  2: ['Break it into small steps and practice each one.', 'Practice a little every day.', 'Learn from every mistake.', 'Watch an expert, then try it yourself.'],
};

export const skill = {
  id: 'skill',
  build(c) {
    const { hero, He, His, he, his, him, pal, adult, emoMid, emoEnd } = c;
    const sk = c.sc(SKILLS[c.tier]);
    const tip = c.sc(TIPS[c.tier], 2);
    const days = c.rng.int(2, 6);
    const titleFn = (nm) => c.v(`${nm} Can Do It`, `${nm} Learns to ${cap(sk.split(' ')[0])}`, `${nm} Keeps Trying`, `${nm}’s Big Challenge`, `The Patience of ${nm}`);
    const P1 = c.v(
      J(`${hero} wanted to ${sk}.`, `It was hard!`, `${hero} felt ${emoMid}.`),
      J(`${hero} wanted to learn to ${sk}.`, `But it was hard, and ${he} felt ${emoMid}.`),
      J(`${hero} wanted to learn to ${sk}, but it was harder than ${he} had expected.`, `${He} tried once, then twice, and each time it went wrong.`, `${hero} felt ${emoMid}.`),
      J(`${hero} had always wanted to learn to ${sk}, but it proved far harder than ${he} had imagined.`, `After a few clumsy attempts, ${he} felt ${emoMid}.`),
      J(`${hero} had long hoped to learn to ${sk}, yet the skill proved far more demanding than ${he} had anticipated.`, `After several clumsy attempts, ${he} felt ${emoMid}.`),
    );
    const P2 = c.v(
      J(`${adult} said, "${tip}"`, `${hero} did try, and try, and try.`),
      J(`${adult} said, "${tip}"`, `So ${hero} tried for ${days} days.`),
      J(`That evening, ${adult} gave ${him} some advice: "${tip}"`, `For the next ${days} days, ${hero} practiced every afternoon.`),
      J(`That evening, ${adult} offered some advice: "${tip}"`, `For the next ${days} days, ${hero} practiced every afternoon, even when progress felt slow.`, c.g >= 5 && `${His} mistakes became lessons instead of setbacks.`),
      J(`That evening, ${adult} offered some advice: "${tip}"`, `For ${days} days, ${hero} practiced every afternoon, treating each mistake as a lesson rather than a setback.`),
    );
    const P3 = c.v(
      J(`Then ${he} did it! ${hero} felt ${emoEnd}.`),
      J(`On day ${days}, ${he} did it! ${hero} felt ${emoEnd}.`),
      J(`On day ${days}, everything clicked, and ${hero} could ${sk}!`, `${hero} felt ${emoEnd}, and ${he} could not stop smiling.`),
      J(`On day ${days}, everything finally clicked, and ${hero} could ${sk} with confidence.`, `${hero} felt ${emoEnd}, proud of ${his} hard work.`),
      J(`By day ${days}, everything had finally clicked, and ${hero} could ${sk} with real confidence.`, `${hero} felt ${emoEnd}, and ${he} was proud of the effort behind the result.`),
    );
    const tf = traitFor(c, ['patient', 'determined', 'persistent']);
    return {
      title: titleFn(hero), titleFn, emoji: '🌟', genre: 'Story',
      paras: [P1, P2, P3],
      facts: { hero, pal, helper: adult, midWho: hero, endWho: hero, prob: `it was hard to ${sk}`, trait: tf },
      events: [`${hero} tried and it was hard`, `${adult} gave ${him} advice`, `${hero} learned to ${sk}`],
      fakes: [`${hero} gave up right away`, `${hero} asked ${pal} to do it instead`, `${hero} won a big prize`],
      predict: { q: `What will ${hero} probably do the next time something is hard?`, a: 'Keep practicing', w: ['Give up quickly', 'Never try anything new', 'Ask someone else to do it'] },
      infer: { q: `What helped ${hero} get better?`, a: 'Practice', w: ['Luck', 'A magic wand', 'A new toy'] },
      qs: [
        Q(`What did ${hero} want to learn?`, cap(sk), SKILLS[c.tier].filter((x) => x !== sk).map(cap), 3),
        Q(`Who gave ${hero} advice?`, adult, [...c.pool('names', [adult]), ...c.pool('adults', [adult])], 6),
        Q(`What did ${adult} say to do?`, tip, TIPS[c.tier].filter((x) => x !== tip), 8),
        Q(`How many days did ${hero} practice?`, String(days), [String(days + 1), String(Math.max(1, days - 1)), String(days + 2), String(days + 3)], 9, 1),
        Q(`What happened when ${hero} first tried?`, 'It was hard', ['It was easy', 'It was boring', 'It was over in a minute'], 10),
        Q(`What did ${hero} do every day?`, 'Practice', ['Rest all day', 'Watch TV', 'Give up'], 11, 1),
      ],
    };
  },
};

// ---------------------------------------------------------------- SHARING
const SNACKS = {
  0: ['apple', 'bun', 'pear', 'plum', 'fig', 'egg'],
  1: ['banana', 'orange', 'cookie', 'sandwich', 'pretzel', 'muffin', 'peach', 'granola bar'],
  2: ['pear', 'blueberry muffin', 'trail mix bar', 'sandwich', 'tangerine', 'rice cake', 'apple', 'hard-boiled egg'],
};
export const share = {
  id: 'share',
  build(c) {
    const { hero, He, His, he, his, him, pal, emoMid, emoEnd, p1 } = c;
    const sn = c.sc(SNACKS[c.tier]);
    const titleFn = (nm) => c.v(`${nm} Shares`, `${nm} Shares a Snack`, `${nm} and the Half ${T(c, sn)}`, `${nm}’s Generous Gift`, `${nm} and an Act of Generosity`);
    const P1 = c.v(
      J(`${hero} sat ${p1}. ${hero} had ${withA(sn)}. ${pal} had no snack.`, `${pal} felt ${emoMid}.`),
      J(`It was snack time. ${hero} sat ${p1} with ${withA(sn)}.`, `${pal} sat down, too, but ${pal} had no snack. ${pal} felt ${emoMid}.`),
      J(`At snack time, ${hero} sat ${p1} with ${withA(sn)}.`, `${pal} sat nearby with empty hands, because ${pal} had forgotten to pack a snack.`, `${pal} felt ${emoMid}.`),
      J(`At lunch, ${hero} sat ${p1} with ${withA(sn)}.`, `Nearby, ${pal} stared at an empty lunch bag, having forgotten to pack anything to eat.`, `${pal} felt ${emoMid}.`, c.g >= 5 && `The rumble in ${pal}’s stomach was hard to hide.`),
      J(`At lunch, ${hero} sat ${p1} with ${withA(sn)}.`, `Nearby, ${pal} gazed into an empty lunch bag, having forgotten to pack anything to eat.`, `${pal} felt ${emoMid}, and the rumble of a hungry stomach was hard to conceal.`),
    );
    const P2 = c.v(
      J(`${hero} said, "Here, ${pal}! Have half."`),
      J(`${hero} saw this. ${He} said, "Here, ${pal}! You can have half of mine."`),
      J(`${hero} noticed. Without a word, ${he} broke the ${sn} in half and said, "Here, ${pal}. You can have half of mine."`),
      J(`${hero} noticed and did not hesitate. ${He} split the ${sn} evenly and said, "Here, ${pal}. Half of this is yours."`),
      J(`${hero} noticed and did not hesitate. ${He} divided the ${sn} evenly and said, "Here, ${pal}. Half of this is yours."`),
    );
    const P3 = c.v(
      J(`${pal} felt ${emoEnd}. ${hero} felt ${emoEnd}, too.`),
      J(`${pal} smiled and said, "Thank you!" Both kids felt ${emoEnd}.`),
      J(`${pal} smiled and said, "Thank you so much!" They ate together, and both kids felt ${emoEnd}.`),
      J(`${pal} smiled gratefully, and the two friends ate together. Both of them felt ${emoEnd}.`),
      J(`${pal} smiled gratefully, and the two friends ate together, both feeling ${emoEnd} at such a small act of kindness.`),
    );
    const tf = traitFor(c, ['kind', 'generous', 'compassionate']);
    return {
      title: titleFn(hero), titleFn, emoji: '🤝', genre: 'Story',
      paras: [P1, P2, P3],
      facts: { hero, pal, helper: pal, midWho: pal, endWho: pal, prob: `${c.phe} had no snack`, trait: tf, noHelperQ: true },
      events: [`${pal} had no snack`, `${hero} shared the ${sn}`, `${pal} and ${hero} felt ${emoEnd}`],
      fakes: [`${pal} ate ${hero}’s whole ${sn}`, `${hero} hid the ${sn}`, `${hero} threw the ${sn} away`],
      predict: { q: `What might ${pal} do the next time ${hero} needs help?`, a: `Help ${hero}`, w: [`Ignore ${hero}`, `Hide from ${hero}`, `Leave right away`] },
      infer: { q: `Why did ${hero} share?`, a: `${He} saw that ${pal} needed food`, w: [`${He} had too many snacks`, `${He} was told to`, `${He} did not like the ${sn}`] },
      qs: [
        Q(`What did ${hero} have?`, cap(withA(sn)), SNACKS[c.tier].filter((x) => x !== sn).map((x) => cap(withA(x))), 3),
        Q(`Who had no snack?`, pal, c.pool('names', [pal, hero]), 4),
        Q(`What did ${hero} share?`, cap(sn), SNACKS[c.tier].filter((x) => x !== sn).map(cap), 5),
        Q(`Where did ${hero} sit?`, cap(p1), c.pool('places', [p1]), 6),
        Q(`How much did ${hero} give to ${pal}?`, 'Half', ['All of it', 'A crumb', 'None'], 7),
        Q(`What did ${pal} say?`, 'Thank you', ['Go away', 'I do not like it', 'That is mine'], 9, 1),
        Q(`Why was ${pal} sad at first?`, c.lv >= 2 ? 'There was nothing to eat' : `${pal} had no snack`, ['A toy was lost', 'It was raining', 'School was over'], 10),
      ],
    };
  },
};

// ---------------------------------------------------------------- WEATHER CHANGES THE PLAN
const PLANS = {
  0: ['play in the yard', 'go to the park', 'fly a kite', 'run in the sun'],
  1: ['have a picnic at the park', 'ride bikes to the lake', 'fly kites on the hill', 'play soccer outside', 'plant a garden'],
  2: ['hike to the lookout', 'have a picnic by the river', 'play a soccer match', 'paint the fence outside', 'set up a lemonade stand'],
};
const ALTS = {
  0: ['make a fort', 'play a game', 'read a book', 'paint a picture', 'build with blocks'],
  1: ['build a blanket fort', 'bake cookies', 'play a board game', 'put on a puppet show', 'make paper airplanes'],
  2: ['build an indoor obstacle course', 'bake a batch of muffins', 'organize a board game tournament', 'write and perform a short play', 'turn the living room into a movie theater'],
};
const WX = [
  ['rain', ['It began to rain.', 'Dark clouds rolled in, and rain began to fall.', 'Dark clouds gathered, and a steady rain began to drum on the roof.']],
  ['wind', ['The wind got big.', 'The wind grew strong and blew the leaves around.', 'A fierce wind swept in, rattling the windows and scattering leaves across the yard.']],
  ['snow', ['Snow came down.', 'Snow began to fall, thick and soft.', 'Thick snow began to swirl down, covering the ground in white.']],
  ['fog', ['Fog came in.', 'A thick fog rolled in and hid the street.', 'A dense fog crept in, hiding the street and muffling every sound.']],
  ['a storm', ['It went boom!', 'Thunder rumbled and the sky turned dark.', 'Thunder rumbled in the distance as the sky turned an ominous gray.']],
];
export const weather = {
  id: 'weather',
  build(c) {
    const { hero, He, His, he, his, him, pal, emoMid, emoEnd } = c;
    const plan = c.sc(PLANS[c.tier]);
    const alt = c.sc(ALTS[c.tier], 1);
    const wx = WX[c.scAt(WX, 2)];
    const wxs = wx[1][c.tier];
    const titleFn = (nm) => c.v(`${nm} and the ${T(c, wx[0].replace('a ', ''))}`, `A ${T(c, wx[0].replace('a ', ''))} Day for ${nm}`, `${nm}’s Change of Plans`, `${nm} and the ${T(c, wx[0].replace('a ', ''))} Day`, `${nm}: A Plan Interrupted`);
    const P1 = c.v(
      J(`${hero} and ${pal} had a plan. They would ${plan}.`, `But then... ${wxs}`, `${hero} felt ${emoMid}.`),
      J(`${hero} and ${pal} planned to ${plan}.`, `But then ${lc(wxs)}`, `${hero} felt ${emoMid}.`),
      J(`${hero} and ${pal} had been looking forward to the day all week. They planned to ${plan}.`, `But then ${lc(wxs)}`, `${hero} felt ${emoMid}.`),
      J(`${hero} and ${pal} had looked forward to the day all week. Their plan was to ${plan}.`, `Then, without warning, ${lc(wxs)}`, `${hero} felt ${emoMid}.`),
      J(`${hero} and ${pal} had anticipated the day for weeks. Their plan was to ${plan}.`, `Then, without warning, ${lc(wxs)}`, `${hero} felt ${emoMid}, and ${his} disappointment was plain.`),
    );
    const P2 = c.v(
      J(`${pal} had an idea. "Let us ${alt}!"`, `They went in and did it.`),
      J(`${pal} had an idea. "Let us ${alt} instead!"`, `So they went inside and did it.`),
      J(`${pal} thought for a moment and had an idea. "We could ${alt} instead!"`, `So they hurried inside and got to work.`),
      J(`After a moment, ${pal} had an idea. "Why don’t we ${alt} instead?"`, `${hero} agreed, and the two friends hurried inside to get started.`, c.g >= 5 && `They gathered everything they needed in minutes.`),
      J(`After a moment of thought, ${pal} proposed a new plan. "Why don’t we ${alt} instead?"`, `${hero} agreed, and the two friends hurried inside to begin.`),
    );
    const P3 = c.v(
      J(`It was fun! ${hero} felt ${emoEnd}.`),
      J(`It was so much fun! ${hero} felt ${emoEnd}.`),
      J(`It turned out to be even more fun than the first plan. ${hero} felt ${emoEnd}.`),
      J(`It turned out to be even more enjoyable than the original plan, and ${hero} felt ${emoEnd}.`),
      J(`The new plan proved even more enjoyable than the original, and ${hero} felt ${emoEnd} that the day had not been wasted.`),
    );
    return {
      title: titleFn(hero), titleFn, emoji: '🌦️', genre: 'Story',
      paras: [P1, P2, P3],
      facts: { hero, pal, helper: pal, midWho: hero, endWho: hero, prob: `the ${wx[0].replace('a ', '')} came`, trait: traitFor(c, ['resourceful', 'thoughtful', 'curious']) },
      events: [`${hero} and ${pal} planned to ${plan}`, `The ${wx[0].replace('a ', '')} came`, `They decided to ${alt}`],
      fakes: [`They went to the beach anyway`, `They went home and slept all day`, `They asked the teacher to change the weather`],
      predict: { q: `What will ${hero} probably do the next time a plan changes?`, a: 'Think of a new plan', w: ['Get very angry', 'Refuse to do anything', 'Cry all day'] },
      infer: { q: `Why did ${hero} feel ${emoEnd} at the end?`, a: 'The new plan was fun', w: ['The weather was still bad', 'The friends had a fight', 'The day was over'] },
      qs: [
        Q(`What was the plan?`, cap(plan), PLANS[c.tier].filter((x) => x !== plan).map(cap), 3),
        Q(`What was the weather?`, cap(wx[0]), WX.filter((w) => w !== wx).map((w) => cap(w[0])), 4),
        Q(`Who had a new idea?`, pal, c.pool('names', [pal, hero]), 5),
        Q(`What did they do instead?`, cap(alt), ALTS[c.tier].filter((x) => x !== alt).map(cap), 6),
        Q(`What did they want to do at first?`, cap(plan), PLANS[c.tier].filter((x) => x !== plan).map(cap), 7),
        Q(`Where did they go when the weather changed?`, 'Inside', ['To the beach', 'To the moon', 'To the store'], 8),
      ],
    };
  },
};

// ---------------------------------------------------------------- HONESTY / A MISTAKE
const BREAKS = {
  0: ['cup', 'jar', 'dish', 'pot', 'mug'],
  1: ['vase', 'glass', 'picture frame', 'lamp', 'flower pot', 'clay bowl'],
  2: ['antique vase', 'model ship', 'ceramic lamp', 'glass jar', 'picture frame', 'clay sculpture'],
};
export const mistake = {
  id: 'mistake',
  build(c) {
    const { hero, He, His, he, his, him, pal, adult, emoMid, emoEnd } = c;
    const th = c.sc(BREAKS[c.tier]);
    const titleFn = (nm) => c.v(`${nm} Tells the Truth`, `${nm} and the Broken ${T(c, th)}`, `${nm}’s Honest Choice`, `The Broken ${T(c, th)} and ${nm}’s Choice`, `${nm}: An Honest Answer`);
    const P1 = c.v(
      J(`${hero} ran in the house. Crash! ${hero} hit ${withA(th)}, and it fell. It was in bits.`, `${hero} felt ${emoMid}.`),
      J(`${hero} ran in the house and bumped into ${withA(th)}. Crash! It fell and broke.`, `${hero} felt ${emoMid}.`),
      J(`${hero} was hurrying through the house when ${he} bumped into ${withA(th)}. Crash! It tumbled to the floor and broke into pieces.`, `${hero} felt ${emoMid}.`),
      J(`${hero} was hurrying through the house when ${he} accidentally knocked over ${withA(th)}. It crashed to the floor and shattered into pieces.`, `${hero} felt ${emoMid}.`),
      J(`${hero} was hurrying through the house when ${he} accidentally knocked over ${withA(th)}, which crashed to the floor and shattered.`, `${hero} felt ${emoMid}.`),
    );
    const P2 = c.v(
      J(`${hero} did not want to tell.`, `But then ${he} said, "${adult}, I did it. I am so sorry."`),
      J(`${hero} wanted to hide it. But ${he} knew that was not right.`, `${He} found ${adult} and said, "I broke it. I am sorry."`),
      J(`${hero} thought about hiding the pieces. But ${he} knew that would not be right.`, `${He} found ${adult} and said, "I broke the ${th}. I am really sorry."`),
      J(`For a moment, ${hero} considered hiding the pieces. But ${he} knew that would be dishonest.`, `${He} found ${adult} and confessed, "I broke the ${th}. I am truly sorry."`, c.g >= 5 && `${His} voice shook, but the words came out anyway.`),
      J(`For a moment, ${hero} considered concealing the pieces, but ${he} knew that would be dishonest.`, `${He} found ${adult} and confessed, "I broke the ${th}, and I am truly sorry."`),
    );
    const P3 = c.v(
      J(`${adult} said, "Thanks for the truth."`, `${hero} felt ${emoEnd}.`),
      J(`${adult} said, "Thank you for telling the truth." Then they cleaned it up together.`, `${hero} felt ${emoEnd}.`),
      J(`${adult} said, "Thank you for telling me the truth. Accidents happen." Then they cleaned up the pieces together.`, `${hero} felt ${emoEnd}.`),
      J(`${adult} said, "Thank you for being honest. Accidents happen." Together they swept up the pieces, and ${hero} felt ${emoEnd}.`),
      J(`${adult} replied, "Thank you for being honest. Accidents happen, but trust is harder to repair." Together they cleared away the pieces, and ${hero} felt ${emoEnd}.`),
    );
    return {
      title: titleFn(hero), titleFn, emoji: '💛', genre: 'Story',
      paras: [P1, P2, P3],
      facts: { hero, pal, helper: adult, midWho: hero, endWho: hero, prob: `the ${th} broke`, trait: traitFor(c, ['honest', 'responsible', 'principled']) },
      events: [`${hero} broke ${withA(th)}`, `${hero} decided to tell the truth`, `${adult} said thank you and they cleaned up`],
      fakes: [`${hero} hid the ${th} and said nothing`, `${pal} got blamed`, `${hero} bought a new ${th}`],
      predict: { q: `What will ${hero} probably do the next time ${he} makes a mistake?`, a: 'Tell the truth', w: ['Hide it', 'Blame someone else', 'Run away'] },
      infer: { q: `Why did ${adult} say thank you?`, a: `${hero} was honest`, w: [`${hero} was fast`, `${hero} was quiet`, `${hero} was funny`] },
      qs: [
        Q(`What did ${hero} break?`, cap(withA(th)), BREAKS[c.tier].filter((x) => x !== th).map((x) => cap(withA(x))), 3),
        Q(`Who did ${hero} tell?`, adult, [...c.pool('names', [adult]), ...c.pool('adults', [adult])], 5),
        Q(`What did ${hero} do after the ${th} broke?`, 'Told the truth', ['Ran outside', 'Hid it', 'Blamed someone'], 6),
        Q(`What did ${adult} say?`, ['Thanks for the truth', 'Thank you for telling the truth', 'Thank you for telling me the truth', 'Thank you for being honest'][Math.min(c.lv, 3)], ['You are in big trouble', 'Go to your room', 'Do not tell anyone'], 7),
        Q(`Where did the ${th} break?`, 'In the house', ['At the park', 'At school', 'On a bus'], 8),
        Q(`How did the ${th} break?`, c.lv >= 3 ? `${hero} knocked it over` : c.lv >= 1 ? `${hero} bumped into it` : `${hero} hit it`, [`${pal} dropped it`, `The wind blew it over`, `A cat jumped on it`], 9),
      ],
    };
  },
};
