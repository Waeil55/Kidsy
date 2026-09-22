// Tiny, code-only "explainer" scenes — like a short YouTube explainer, but built from a few emoji
// and a caption per step, animated with CSS only. No video files, nothing heavy: each scene mounts
// only when a child opens it, and unmounts (and stops any audio/timers) the moment it closes.
export const EXPLAINERS = {
  math: {
    emoji: '🔢', title: 'How math works',
    steps: [
      { big: '🍎🍎🍎', cap: 'Numbers can count real things, like these apples.' },
      { big: '🍎🍎🍎 ➕ 🍎🍎', cap: 'Adding puts two groups together.' },
      { big: '🍎🍎🍎🍎🍎', cap: 'Count them all: 1, 2, 3, 4, 5!' },
      { big: '🔍', cap: 'Read the question first. What is it really asking?' },
      { big: '✅', cap: 'Pick your answer, then check it makes sense.' },
    ],
  },
  fill: {
    emoji: '🧩', title: 'How fill-in-the-blank works',
    steps: [
      { big: '📄___📄', cap: 'A sentence is missing one word.' },
      { big: '👀', cap: 'Read the whole sentence first, blank and all.' },
      { big: '🤔', cap: 'Try each word in the blank. Which one sounds right?' },
      { big: '✅', cap: 'Pick the word that makes the sentence make sense.' },
    ],
  },
  vocab: {
    emoji: '🔤', title: 'How words work',
    steps: [
      { big: '🔤', cap: 'A vocabulary word is a new word to learn.' },
      { big: '📖', cap: 'The definition tells you what a word means.' },
      { big: '🟢 = 🟢', cap: 'A synonym means almost the same thing.' },
      { big: '🟢 ≠ 🔴', cap: 'An antonym means the opposite.' },
      { big: '🔊', cap: 'Say it, hear it, then try it in your own sentence!' },
    ],
  },
  grammar: {
    emoji: '✏️', title: 'How grammar works',
    steps: [
      { big: '✏️', cap: 'Grammar is the rules that make sentences make sense.' },
      { big: 'A a → A', cap: 'Every sentence starts with a CAPITAL letter.' },
      { big: '. ? !', cap: 'Every sentence ends with a punctuation mark.' },
      { big: '🐶 vs 🏃', cap: 'A noun is a person, place or thing. A verb is an action!' },
    ],
  },
  reading: {
    emoji: '📖', title: 'How to read a story',
    steps: [
      { big: '🌱 🌳 🍂', cap: 'Every story has a beginning, a middle and an end.' },
      { big: '🔊', cap: 'Tap Listen to hear the story read out loud to you.' },
      { big: '👉📝', cap: 'Tap any word to hear it and learn what it means.' },
      { big: '❓', cap: 'After reading, answer questions about what happened.' },
    ],
  },
  exam: {
    emoji: '🎓', title: 'How exams work',
    steps: [
      { big: '🎓', cap: 'An exam mixes questions from everything you practiced.' },
      { big: '⏱️', cap: 'Take your time — there is no clock ticking!' },
      { big: '🔁', cap: 'You can try again any time and beat your best score.' },
    ],
  },
  speaking: {
    emoji: '🎤', title: 'How Speaking Lab works',
    steps: [
      { big: '🎤', cap: 'Speaking Lab listens to YOU talk.' },
      { big: '👂', cap: 'Tap Listen first to hear how to say it.' },
      { big: '🗣️', cap: 'Then tap the microphone and say it out loud.' },
      { big: '🌟', cap: 'Say it clearly and earn a star!' },
    ],
  },
  break: {
    emoji: '✨', title: 'How Study break works',
    steps: [
      { big: '✨', cap: 'Study break is a fun mini-quiz you can swipe through.' },
      { big: '👉', cap: 'Swipe, or tap the arrows, to see the next card.' },
      { big: '🎉', cap: 'Answer for fun — every card is quick and easy!' },
    ],
  },
  points: {
    emoji: '⭐', title: 'How points & stickers work',
    steps: [
      { big: '✅ ⭐', cap: 'Every right answer earns you a point.' },
      { big: '🔥', cap: 'Answer every day to grow your streak.' },
      { big: '🎁', cap: 'Points and streaks unlock stickers to collect.' },
    ],
  },
};
