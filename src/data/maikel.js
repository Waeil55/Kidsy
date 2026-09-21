const families = {
  ck: 'back check duck luck neck pick rock sock sick tack black clock snack brick truck kick lick stick trick block dock flock lock shock smock stock buck cluck puck tuck',
  ch: 'chat chip chop rich much such chin chess bench lunch beach catch match patch chain chair chalk champ chart chase cheap cheat cheek cheer cheese cherry chest chew chick child',
  th: 'the they this that then them with moth path bath thin thick math tooth think thank third thumb thud thump cloth fourth mouth north south truth teeth thorn thaw thatch',
  sh: 'ship shop shut fish dish wish rush dash shell shine sheet shark trash brush flash shack shade shake shall shape share sharp shave shed sheep shelf shirt shoe short show',
  wh: 'when whip white whale wheel wheat whisk while which whack wharf whiff whine whirl whiz whim whinny whisper whistle why',
  ph: 'phone photo graph phase phlox dolphin trophy phantom orphan sphere phony phrase physic phobia phonic photon phyla nephew alphabet phew',
  ng: 'ring sing song long wing king hang bang lung sung fang gang pang rang slang sting swing thing tong young',
  qu: 'quit quiz quick quilt queen quack quest quill quart quite quake quark quartz quash quay queasy quell quench query quip',
};

const byFamily = Object.fromEntries(Object.entries(families).map(([sound, value]) => [sound, value.split(' ').map((word) => ({ word, sound }))]));
export const maikelWords = Object.values(byFamily).flat();
export const maikelFamilies = byFamily;

const gradeFamilies = {
  KG: ['ck', 'ch'],
  G1: ['ck', 'ch', 'sh'],
  G2: ['ck', 'ch', 'sh', 'th'],
  G3: ['th', 'wh', 'ng', 'qu'],
  G4: ['wh', 'ng', 'qu', 'ph'],
  G5: ['ng', 'qu', 'ph', 'wh'],
  G6: ['ph', 'qu', 'wh', 'ng'],
};
export const maikelWordsFor = (grade) => gradeFamilies[grade].flatMap((family) => byFamily[family]);
export const maikelFamilyFor = (grade) => gradeFamilies[grade];
export const maikelCoverage = Object.fromEntries(Object.keys(gradeFamilies).map((grade) => [grade, maikelWordsFor(grade).length]));
