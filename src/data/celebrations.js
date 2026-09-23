// 20 different animated "you're on a streak!" celebration themes — pure CSS/emoji, no video or
// image files, so they stay light and never freeze the app. One plays every 4 correct answers
// in a row, picked in rotation so a child sees a different one almost every time.
export const CELEBRATIONS = [
  { id: 'bubbles', emoji: '🫧', bits: ['🫧', '💧', '✨'], bg: 'linear-gradient(160deg,#5fd0e8,#3fa0e0)', title: 'Bubble pop!', line: '4 in a row — pop pop pop!' },
  { id: 'balloons', emoji: '🎈', bits: ['🎈', '🎈', '✨'], bg: 'linear-gradient(160deg,#ff8fb3,#ff6fa7)', title: 'Balloon burst!', line: 'Your streak is floating high!' },
  { id: 'stars', emoji: '🌟', bits: ['⭐', '✨', '🌟'], bg: 'linear-gradient(160deg,#6a5cf0,#8b6cf2)', title: 'Starry streak!', line: 'You are shining bright!' },
  { id: 'confetti', emoji: '🎉', bits: ['🎊', '🎉', '✨'], bg: 'linear-gradient(160deg,#ffb14e,#ff9642)', title: 'Confetti time!', line: '4 correct — let it rain!' },
  { id: 'sparkle', emoji: '✨', bits: ['✨', '💫', '⭐'], bg: 'linear-gradient(160deg,#c26cf0,#8b6cf2)', title: 'Sparkle streak!', line: 'You are on fire!' },
  { id: 'butterfly', emoji: '🦋', bits: ['🦋', '🌸', '✨'], bg: 'linear-gradient(160deg,#7fd8c8,#5fd0e8)', title: 'Butterfly flutter!', line: 'Flying through these questions!' },
  { id: 'fireworks', emoji: '🎆', bits: ['🎆', '🎇', '✨'], bg: 'linear-gradient(160deg,#2f2e6e,#6a5cf0)', title: 'Fireworks!', line: '4 in a row — boom!' },
  { id: 'rainbow', emoji: '🌈', bits: ['🌈', '☁️', '✨'], bg: 'linear-gradient(160deg,#5fd0e8,#7fd8c8)', title: 'Rainbow streak!', line: 'Colorful and correct!' },
  { id: 'kite', emoji: '🪁', bits: ['🪁', '☁️', '✨'], bg: 'linear-gradient(160deg,#5fa8e8,#5fd0e8)', title: 'Kite high-flyer!', line: 'Soaring through your streak!' },
  { id: 'rocket', emoji: '🚀', bits: ['🚀', '⭐', '✨'], bg: 'linear-gradient(160deg,#2f2e6e,#5b3fa8)', title: 'Blast off!', line: '4 correct — to the moon!' },
  { id: 'dog', emoji: '🐶', bits: ['🐾', '🎾', '✨'], bg: 'linear-gradient(160deg,#ffb14e,#ff8f5e)', title: 'Good catch!', line: 'Your puppy caught the ball 4 times!' },
  { id: 'cat', emoji: '🐱', bits: ['🐾', '🧶', '✨'], bg: 'linear-gradient(160deg,#ff9fb0,#c26cf0)', title: 'Purr-fect!', line: 'The kitten is proud of you!' },
  { id: 'fish', emoji: '🐠', bits: ['🐠', '🫧', '✨'], bg: 'linear-gradient(160deg,#2fa0d0,#5fd0e8)', title: 'Swimming streak!', line: '4 in a row under the sea!' },
  { id: 'bird', emoji: '🐦', bits: ['🐦', '☁️', '✨'], bg: 'linear-gradient(160deg,#7fd8c8,#5fa8e8)', title: 'Flying high!', line: 'Your streak took off!' },
  { id: 'hearts', emoji: '💖', bits: ['💖', '💗', '✨'], bg: 'linear-gradient(160deg,#ff8fb3,#c26cf0)', title: 'Heart streak!', line: 'We love your hard work!' },
  { id: 'snow', emoji: '❄️', bits: ['❄️', '✨', '☁️'], bg: 'linear-gradient(160deg,#5fa8e8,#7fd8c8)', title: 'Snow streak!', line: '4 correct — cool and calm!' },
  { id: 'sun', emoji: '☀️', bits: ['☀️', '✨', '🌤️'], bg: 'linear-gradient(160deg,#ffd35e,#ff9642)', title: 'Sunny streak!', line: 'Bright and brilliant!' },
  { id: 'party', emoji: '🥳', bits: ['🎉', '🥳', '✨'], bg: 'linear-gradient(160deg,#ff6fa7,#8b6cf2)', title: 'Party time!', line: '4 in a row deserves a party!' },
  { id: 'ball', emoji: '⚽', bits: ['⚽', '✨', '🏆'], bg: 'linear-gradient(160deg,#5fd04d,#3fa0e0)', title: 'On a roll!', line: 'Bouncing from win to win!' },
  { id: 'unicorn', emoji: '🦄', bits: ['🦄', '🌈', '✨'], bg: 'linear-gradient(160deg,#c26cf0,#ff8fb3)', title: 'Magical streak!', line: 'You are a learning unicorn!' },
];
