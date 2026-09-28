import React, { useState, useMemo, useEffect } from 'react';
import { LuRotateCw, LuVolume2, LuCheck, LuRotateCcw, LuShuffle, LuChevronLeft, LuChevronRight, LuSparkles, LuTrophy, LuBookOpen } from 'react-icons/lu';
import { useStore } from '../store/store.js';
import { GRADE_BY_KEY } from '../data/grades.js';
import { vocabFor } from '../data/vocab.js';
import { speak, stopSpeaking } from '../lib/speech.js';
import { G3_PDF_WORD_ROWS } from '../data/g3ela.js';
import { ExplainBtn } from '../ui/Explainer.jsx';
import Celebration from '../ui/Celebration.jsx';

function buildKgDecks() {
  const alphabet = [
    { front: 'Aa', kicker: 'Letter & Sound', prompt: '🍎 Apple', back: 'A is for Apple\nSound: /æ/', speech: 'A is for Apple' },
    { front: 'Bb', kicker: 'Letter & Sound', prompt: '⚽ Ball', back: 'B is for Ball\nSound: /b/', speech: 'B is for Ball' },
    { front: 'Cc', kicker: 'Letter & Sound', prompt: '🐱 Cat', back: 'C is for Cat\nSound: /k/', speech: 'C is for Cat' },
    { front: 'Dd', kicker: 'Letter & Sound', prompt: '🐶 Dog', back: 'D is for Dog\nSound: /d/', speech: 'D is for Dog' },
    { front: 'Ee', kicker: 'Letter & Sound', prompt: '🐘 Elephant', back: 'E is for Elephant\nSound: /ɛ/', speech: 'E is for Elephant' },
    { front: 'Ff', kicker: 'Letter & Sound', prompt: '🐟 Fish', back: 'F is for Fish\nSound: /f/', speech: 'F is for Fish' },
    { front: 'Gg', kicker: 'Letter & Sound', prompt: '🍇 Grapes', back: 'G is for Grapes\nSound: /ɡ/', speech: 'G is for Grapes' },
    { front: 'Hh', kicker: 'Letter & Sound', prompt: '👒 Hat', back: 'H is for Hat\nSound: /h/', speech: 'H is for Hat' },
    { front: 'Ii', kicker: 'Letter & Sound', prompt: '🦎 Iguana', back: 'I is for Iguana\nSound: /ɪ/', speech: 'I is for Iguana' },
    { front: 'Jj', kicker: 'Letter & Sound', prompt: '🧃 Juice', back: 'J is for Juice\nSound: /dʒ/', speech: 'J is for Juice' },
    { front: 'Kk', kicker: 'Letter & Sound', prompt: '🪁 Kite', back: 'K is for Kite\nSound: /k/', speech: 'K is for Kite' },
    { front: 'Ll', kicker: 'Letter & Sound', prompt: '🦁 Lion', back: 'L is for Lion\nSound: /l/', speech: 'L is for Lion' },
    { front: 'Mm', kicker: 'Letter & Sound', prompt: '🌙 Moon', back: 'M is for Moon\nSound: /m/', speech: 'M is for Moon' },
    { front: 'Nn', kicker: 'Letter & Sound', prompt: '🪺 Nest', back: 'N is for Nest\nSound: /n/', speech: 'N is for Nest' },
    { front: 'Oo', kicker: 'Letter & Sound', prompt: '🦉 Owl', back: 'O is for Owl\nSound: /ɒ/', speech: 'O is for Owl' },
    { front: 'Pp', kicker: 'Letter & Sound', prompt: '🐷 Pig', back: 'P is for Pig\nSound: /p/', speech: 'P is for Pig' },
    { front: 'Qq', kicker: 'Letter & Sound', prompt: '👑 Queen', back: 'Q is for Queen\nSound: /kw/', speech: 'Q is for Queen' },
    { front: 'Rr', kicker: 'Letter & Sound', prompt: '🌈 Rainbow', back: 'R is for Rainbow\nSound: /r/', speech: 'R is for Rainbow' },
    { front: 'Ss', kicker: 'Letter & Sound', prompt: '☀️ Sun', back: 'S is for Sun\nSound: /s/', speech: 'S is for Sun' },
    { front: 'Tt', kicker: 'Letter & Sound', prompt: '🌳 Tree', back: 'T is for Tree\nSound: /t/', speech: 'T is for Tree' },
    { front: 'Uu', kicker: 'Letter & Sound', prompt: '☂️ Umbrella', back: 'U is for Umbrella\nSound: /ʌ/', speech: 'U is for Umbrella' },
    { front: 'Vv', kicker: 'Letter & Sound', prompt: '🚐 Van', back: 'V is for Van\nSound: /v/', speech: 'V is for Van' },
    { front: 'Ww', kicker: 'Letter & Sound', prompt: '🍉 Watermelon', back: 'W is for Watermelon\nSound: /w/', speech: 'W is for Watermelon' },
    { front: 'Xx', kicker: 'Letter & Sound', prompt: '📦 Box', back: 'X is for Box\nSound: /ks/', speech: 'X is in Box' },
    { front: 'Yy', kicker: 'Letter & Sound', prompt: '🧶 Yarn', back: 'Y is for Yarn\nSound: /j/', speech: 'Y is for Yarn' },
    { front: 'Zz', kicker: 'Letter & Sound', prompt: '🦓 Zebra', back: 'Z is for Zebra\nSound: /z/', speech: 'Z is for Zebra' },
  ];

  const numbers = [
    { front: '1', kicker: 'Number & Count', prompt: '⭐', back: 'One\nCount: 1 item', speech: 'One star' },
    { front: '2', kicker: 'Number & Count', prompt: '⭐⭐', back: 'Two\nCount: 2 items', speech: 'Two stars' },
    { front: '3', kicker: 'Number & Count', prompt: '⭐⭐⭐', back: 'Three\nCount: 3 items', speech: 'Three stars' },
    { front: '4', kicker: 'Number & Count', prompt: '⭐⭐⭐⭐', back: 'Four\nCount: 4 items', speech: 'Four stars' },
    { front: '5', kicker: 'Number & Count', prompt: '⭐⭐⭐⭐⭐', back: 'Five\nCount: 5 items', speech: 'Five stars' },
    { front: '6', kicker: 'Number & Count', prompt: '⭐⭐⭐⭐⭐⭐', back: 'Six\nCount: 6 items', speech: 'Six stars' },
    { front: '7', kicker: 'Number & Count', prompt: '⭐⭐⭐⭐⭐⭐⭐', back: 'Seven\nCount: 7 items', speech: 'Seven stars' },
    { front: '8', kicker: 'Number & Count', prompt: '⭐⭐⭐⭐⭐⭐⭐⭐', back: 'Eight\nCount: 8 items', speech: 'Eight stars' },
    { front: '9', kicker: 'Number & Count', prompt: '⭐⭐⭐⭐⭐⭐⭐⭐⭐', back: 'Nine\nCount: 9 items', speech: 'Nine stars' },
    { front: '10', kicker: 'Number & Count', prompt: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐', back: 'Ten\nCount: 10 items', speech: 'Ten stars' },
  ];

  const math = [
    { front: '1 + 1 = ?', kicker: 'Adding', prompt: '🍎 + 🍎', back: '= 2\nOne plus one is two', speech: 'One plus one equals two' },
    { front: '2 + 1 = ?', kicker: 'Adding', prompt: '🍎🍎 + 🍎', back: '= 3\nTwo plus one is three', speech: 'Two plus one equals three' },
    { front: '2 + 2 = ?', kicker: 'Adding', prompt: '🍎🍎 + 🍎🍎', back: '= 4\nTwo plus two is four', speech: 'Two plus two equals four' },
    { front: '3 + 1 = ?', kicker: 'Adding', prompt: '🍎🍎🍎 + 🍎', back: '= 4\nThree plus one is four', speech: 'Three plus one equals four' },
    { front: '3 + 2 = ?', kicker: 'Adding', prompt: '🍎🍎🍎 + 🍎🍎', back: '= 5\nThree plus two is five', speech: 'Three plus two equals five' },
    { front: '4 + 1 = ?', kicker: 'Adding', prompt: '🍎🍎🍎🍎 + 🍎', back: '= 5\nFour plus one is five', speech: 'Four plus one equals five' },
    { front: '2 - 1 = ?', kicker: 'Take Away', prompt: '🍎 (take away 1)', back: '= 1\nTwo minus one is one', speech: 'Two minus one equals one' },
    { front: '3 - 1 = ?', kicker: 'Take Away', prompt: '🍎🍎 (take away 1)', back: '= 2\nThree minus one is two', speech: 'Three minus one equals two' },
    { front: '4 - 1 = ?', kicker: 'Take Away', prompt: '🍎🍎🍎 (take away 1)', back: '= 3\nFour minus one is three', speech: 'Four minus one equals three' },
    { front: '5 - 1 = ?', kicker: 'Take Away', prompt: '🍎🍎🍎🍎 (take away 1)', back: '= 4\nFive minus one is four', speech: 'Five minus one equals four' },
  ];

  return [
    { id: 'alphabet', label: '🔤 Alphabet', items: alphabet },
    { id: 'numbers', label: '🔢 Numbers', items: numbers },
    { id: 'math', label: '➕ Math + & -', items: math },
  ];
}

function buildG1Decks() {
  const sightWords = [
    { front: 'the', kicker: 'Sight Word', prompt: 'Read out loud', back: 'the\n"Look at the cat."', speech: 'the. Look at the cat.' },
    { front: 'and', kicker: 'Sight Word', prompt: 'Read out loud', back: 'and\n"Mom and Dad."', speech: 'and. Mom and Dad.' },
    { front: 'you', kicker: 'Sight Word', prompt: 'Read out loud', back: 'you\n"You are my friend."', speech: 'you. You are my friend.' },
    { front: 'that', kicker: 'Sight Word', prompt: 'Read out loud', back: 'that\n"Look at that bird."', speech: 'that. Look at that bird.' },
    { front: 'was', kicker: 'Sight Word', prompt: 'Read out loud', back: 'was\n"The dog was happy."', speech: 'was. The dog was happy.' },
    { front: 'for', kicker: 'Sight Word', prompt: 'Read out loud', back: 'for\n"This gift is for you."', speech: 'for. This gift is for you.' },
    { front: 'are', kicker: 'Sight Word', prompt: 'Read out loud', back: 'are\n"We are at school."', speech: 'are. We are at school.' },
    { front: 'with', kicker: 'Sight Word', prompt: 'Read out loud', back: 'with\n"Play with me."', speech: 'with. Play with me.' },
    { front: 'they', kicker: 'Sight Word', prompt: 'Read out loud', back: 'they\n"They run fast."', speech: 'they. They run fast.' },
    { front: 'have', kicker: 'Sight Word', prompt: 'Read out loud', back: 'have\n"I have a red ball."', speech: 'have. I have a red ball.' },
    { front: 'said', kicker: 'Sight Word', prompt: 'Read out loud', back: 'said\n"She said hello."', speech: 'said. She said hello.' },
    { front: 'like', kicker: 'Sight Word', prompt: 'Read out loud', back: 'like\n"I like apples."', speech: 'like. I like apples.' },
    { front: 'come', kicker: 'Sight Word', prompt: 'Read out loud', back: 'come\n"Come and play."', speech: 'come. Come and play.' },
    { front: 'here', kicker: 'Sight Word', prompt: 'Read out loud', back: 'here\n"Look over here."', speech: 'here. Look over here.' },
    { front: 'play', kicker: 'Sight Word', prompt: 'Read out loud', back: 'play\n"We like to play."', speech: 'play. We like to play.' },
  ];

  const cvcWords = [
    { front: 'c-a-t', kicker: 'Phonics CVC', prompt: 'Blend the sounds', back: '🐱 cat\n/k/ /æ/ /t/ → cat', speech: 'cat' },
    { front: 'd-o-g', kicker: 'Phonics CVC', prompt: 'Blend the sounds', back: '🐶 dog\n/d/ /ɒ/ /ɡ/ → dog', speech: 'dog' },
    { front: 's-u-n', kicker: 'Phonics CVC', prompt: 'Blend the sounds', back: '☀️ sun\n/s/ /ʌ/ /n/ → sun', speech: 'sun' },
    { front: 'p-i-g', kicker: 'Phonics CVC', prompt: 'Blend the sounds', back: '🐷 pig\n/p/ /ɪ/ /ɡ/ → pig', speech: 'pig' },
    { front: 'h-a-t', kicker: 'Phonics CVC', prompt: 'Blend the sounds', back: '👒 hat\n/h/ /æ/ /t/ → hat', speech: 'hat' },
    { front: 'b-e-d', kicker: 'Phonics CVC', prompt: 'Blend the sounds', back: '🛏️ bed\n/b/ /ɛ/ /d/ → bed', speech: 'bed' },
    { front: 'c-u-p', kicker: 'Phonics CVC', prompt: 'Blend the sounds', back: '🥤 cup\n/k/ /ʌ/ /p/ → cup', speech: 'cup' },
    { front: 'b-u-s', kicker: 'Phonics CVC', prompt: 'Blend the sounds', back: '🚌 bus\n/b/ /ʌ/ /s/ → bus', speech: 'bus' },
    { front: 'f-a-n', kicker: 'Phonics CVC', prompt: 'Blend the sounds', back: '🪭 fan\n/f/ /æ/ /n/ → fan', speech: 'fan' },
    { front: 'r-e-d', kicker: 'Phonics CVC', prompt: 'Blend the sounds', back: '🔴 red\n/r/ /ɛ/ /d/ → red', speech: 'red' },
  ];

  const math = [
    { front: '5 + 3 = ?', kicker: 'Math to 20', prompt: 'Count on from 5', back: '= 8\nFive plus three is eight', speech: 'Five plus three equals eight' },
    { front: '6 + 4 = ?', kicker: 'Math to 20', prompt: 'Make a ten!', back: '= 10\nSix plus four is ten', speech: 'Six plus four equals ten' },
    { front: '7 + 5 = ?', kicker: 'Math to 20', prompt: '7 + 3 + 2', back: '= 12\nSeven plus five is twelve', speech: 'Seven plus five equals twelve' },
    { front: '9 + 4 = ?', kicker: 'Math to 20', prompt: '9 + 1 + 3', back: '= 13\nNine plus four is thirteen', speech: 'Nine plus four equals thirteen' },
    { front: '8 + 8 = ?', kicker: 'Math to 20', prompt: 'Doubles fact', back: '= 16\nEight plus eight is sixteen', speech: 'Eight plus eight equals sixteen' },
    { front: '10 - 4 = ?', kicker: 'Subtraction', prompt: 'Take away 4 from 10', back: '= 6\nTen minus four is six', speech: 'Ten minus four equals six' },
    { front: '12 - 5 = ?', kicker: 'Subtraction', prompt: 'Take away 5 from 12', back: '= 7\nTwelve minus five is seven', speech: 'Twelve minus five equals seven' },
    { front: '15 - 5 = ?', kicker: 'Subtraction', prompt: 'Take away the ones', back: '= 10\nFifteen minus five is ten', speech: 'Fifteen minus five equals ten' },
  ];

  return [
    { id: 'sight', label: '⭐ Sight Words', items: sightWords },
    { id: 'cvc', label: '🐱 Phonics CVC', items: cvcWords },
    { id: 'math', label: '➕ Math to 20', items: math },
  ];
}

function buildG3Decks() {
  const merolaWords = G3_PDF_WORD_ROWS.map((row) => ({
    front: row[0],
    kicker: `Part of Speech: ${row[1]}`,
    prompt: 'Define & Use',
    back: `${row[0].toUpperCase()} (${row[1]})\n\nMeaning: ${row[2]}\n\nExample: ${row[3]}\n\nSynonyms: ${row[4] || '—'}\nAntonyms: ${row[5] || '—'}`,
    speech: `${row[0]}. Part of speech: ${row[1]}. Definition: ${row[2]}. Example: ${row[3]}`,
  }));

  const mult = [
    { front: '3 × 4 = ?', kicker: 'Multiplication', prompt: '3 groups of 4', back: '= 12\nThree times four is 12', speech: 'Three times four equals twelve' },
    { front: '6 × 7 = ?', kicker: 'Multiplication', prompt: '6 groups of 7', back: '= 42\nSix times seven is 42', speech: 'Six times seven equals forty-two' },
    { front: '8 × 9 = ?', kicker: 'Multiplication', prompt: '8 groups of 9', back: '= 72\nEight times nine is 72', speech: 'Eight times nine equals seventy-two' },
    { front: '7 × 8 = ?', kicker: 'Multiplication', prompt: '7 groups of 8', back: '= 56\nSeven times eight is 56', speech: 'Seven times eight equals fifty-six' },
    { front: '9 × 6 = ?', kicker: 'Multiplication', prompt: '9 groups of 6', back: '= 54\nNine times six is 54', speech: 'Nine times six equals fifty-four' },
    { front: '4 × 8 = ?', kicker: 'Multiplication', prompt: '4 groups of 8', back: '= 32\nFour times eight is 32', speech: 'Four times eight equals thirty-two' },
    { front: '5 × 9 = ?', kicker: 'Multiplication', prompt: '5 groups of 9', back: '= 45\nFive times nine is 45', speech: 'Five times nine equals forty-five' },
    { front: '6 × 8 = ?', kicker: 'Multiplication', prompt: '6 groups of 8', back: '= 48\nSix times eight is 48', speech: 'Six times eight equals forty-eight' },
  ];

  const div = [
    { front: '24 ÷ 6 = ?', kicker: 'Division', prompt: 'How many 6s in 24?', back: '= 4\nTwenty-four divided by six is 4', speech: 'Twenty-four divided by six equals four' },
    { front: '56 ÷ 8 = ?', kicker: 'Division', prompt: 'How many 8s in 56?', back: '= 7\nFifty-six divided by eight is 7', speech: 'Fifty-six divided by eight equals seven' },
    { front: '72 ÷ 9 = ?', kicker: 'Division', prompt: 'How many 9s in 72?', back: '= 8\nSeventy-two divided by nine is 8', speech: 'Seventy-two divided by nine equals eight' },
    { front: '42 ÷ 7 = ?', kicker: 'Division', prompt: 'How many 7s in 42?', back: '= 6\nForty-two divided by seven is 6', speech: 'Forty-two divided by seven equals six' },
    { front: '63 ÷ 9 = ?', kicker: 'Division', prompt: 'How many 9s in 63?', back: '= 7\nSixty-three divided by nine is 7', speech: 'Sixty-three divided by nine equals seven' },
    { front: '36 ÷ 4 = ?', kicker: 'Division', prompt: 'How many 4s in 36?', back: '= 9\nThirty-six divided by four is 9', speech: 'Thirty-six divided by four equals nine' },
  ];

  return [
    { id: 'merola', label: `🏫 School Vocab (${merolaWords.length} Words)`, items: merolaWords },
    { id: 'mult', label: '✖️ Multiplication', items: mult },
    { id: 'div', label: '➗ Division Facts', items: div },
  ];
}

function buildGenericDecks(gradeKey) {
  const words = vocabFor(gradeKey);
  const vocabCards = words.map((w) => ({
    front: w.w,
    kicker: `Part of Speech: ${w.pos || 'word'}`,
    prompt: 'Tap to see definition',
    back: `${w.w.toUpperCase()}\n\nMeaning: ${w.def}\n\nExample: ${w.ex || '—'}${w.syn?.length ? `\nSynonyms: ${w.syn.join(', ')}` : ''}${w.ant?.length ? `\nAntonyms: ${w.ant.join(', ')}` : ''}`,
    speech: `${w.w}. Definition: ${w.def}. ${w.ex ? 'Example: ' + w.ex : ''}`,
  }));

  const mult = [
    { front: '12 × 11 = ?', kicker: 'Mental Math', prompt: 'Calculate', back: '= 132\nTwelve times eleven is 132', speech: 'Twelve times eleven equals 132' },
    { front: '15 × 6 = ?', kicker: 'Mental Math', prompt: 'Calculate', back: '= 90\nFifteen times six is 90', speech: 'Fifteen times six equals ninety' },
    { front: '144 ÷ 12 = ?', kicker: 'Mental Math', prompt: 'Calculate', back: '= 12\n144 divided by 12 is 12', speech: '144 divided by 12 equals twelve' },
    { front: '25 × 4 = ?', kicker: 'Mental Math', prompt: 'Calculate', back: '= 100\nTwenty-five times four is 100', speech: 'Twenty-five times four equals 100' },
  ];

  return [
    { id: 'vocab', label: '📖 Vocabulary Words', items: vocabCards },
    { id: 'math', label: '🔢 Math Facts', items: mult },
  ];
}

export default function FlashcardsScreen() {
  const { state, dispatch } = useStore();
  const grade = GRADE_BY_KEY[state.gradeKey] || GRADE_BY_KEY.G3;
  const gk = state.gradeKey;

  const decks = useMemo(() => {
    if (gk === 'KG') return buildKgDecks();
    if (gk === 'G1') return buildG1Decks();
    if (gk === 'G3') return buildG3Decks();
    return buildGenericDecks(gk);
  }, [gk]);

  const [deckId, setDeckId] = useState(decks[0]?.id || '');
  const activeDeck = useMemo(() => decks.find((d) => d.id === deckId) || decks[0], [decks, deckId]);

  const [cards, setCards] = useState(() => activeDeck?.items.slice() || []);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState(new Set());
  const [celeb, setCeleb] = useState(null);

  useEffect(() => {
    setCards(activeDeck?.items.slice() || []);
    setIndex(0);
    setFlipped(false);
    setMastered(new Set());
    stopSpeaking();
  }, [activeDeck]);

  const card = cards[index];
  const isMastered = card && mastered.has(card.front);

  const flip = () => setFlipped((f) => !f);

  const nextCard = () => {
    stopSpeaking();
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };

  const prevCard = () => {
    stopSpeaking();
    setFlipped(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    stopSpeaking();
    const shuffled = cards.slice().sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setIndex(0);
    setFlipped(false);
  };

  const handleGotIt = () => {
    if (!card) return;
    const nextSet = new Set(mastered);
    nextSet.add(card.front);
    setMastered(nextSet);
    dispatch({ type: 'answer', grade: gk, subject: 'flashcards', correct: true });

    if (nextSet.size === cards.length || nextSet.size % 5 === 0) {
      setCeleb({ count: nextSet.size });
    }
    nextCard();
  };

  const handleStudyAgain = () => {
    nextCard();
  };

  const handleListen = (e) => {
    e.stopPropagation();
    if (!card) return;
    const textToSpeak = flipped ? card.speech || card.back : card.speech || card.front;
    speak(textToSpeak);
  };

  return (
    <div className="flashcards-screen">
      <div className="flashcards-header">
        <div className="grow">
          <div className="row" style={{ alignItems: 'center', gap: 8 }}>
            <span className="eyebrow" style={{ margin: 0 }}>Interactive Learning</span>
            <ExplainBtn topic="cards" small />
          </div>
          <h1>Flashcards 🃏</h1>
          <p>Tap a card to flip and learn. Made for {grade.label}.</p>
        </div>
        <div className="flashcards-stats">
          <div className="stat-pill"><LuTrophy /> <b>{mastered.size}</b> / {cards.length} Mastered</div>
          <div className="stat-pill points"><LuSparkles /> <b>{state.score}</b> pts</div>
        </div>
      </div>

      {/* Deck Selector Tabs */}
      <div className="flashcards-tabs">
        {decks.map((d) => (
          <button
            key={d.id}
            className={`tab-btn ${d.id === activeDeck?.id ? 'active' : ''}`}
            onClick={() => { setDeckId(d.id); stopSpeaking(); }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Main Flashcard Arena */}
      {card ? (
        <div className="flashcard-container">
          <div className="flashcard-meta">
            <span className="card-counter">Card {index + 1} of {cards.length}</span>
            <div className="card-meta-actions">
              <button className="iconbtn-text" onClick={handleShuffle} title="Shuffle Deck"><LuShuffle /> Shuffle</button>
              <button className="iconbtn-text" onClick={handleListen} title="Listen"><LuVolume2 /> Listen</button>
            </div>
          </div>

          <div
            className={`flashcard ${flipped ? 'flipped' : ''} ${isMastered ? 'mastered' : ''}`}
            onClick={flip}
            role="button"
            tabIndex={0}
            aria-label={`Flashcard: ${flipped ? card.back : card.front}. Tap to flip.`}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } }}
          >
            <div className="flashcard-inner">
              {/* Front Side */}
              <div className="flashcard-face flashcard-front">
                <div className="card-face-top">
                  <span className="kicker-tag">{card.kicker}</span>
                  {isMastered && <span className="mastered-badge"><LuCheck /> Mastered</span>}
                </div>
                <div className="card-face-body">
                  <h2 className="front-text">{card.front}</h2>
                  {card.prompt && <p className="front-prompt">{card.prompt}</p>}
                </div>
                <div className="card-face-bottom">
                  <span className="flip-hint"><LuRotateCw /> Tap to flip</span>
                </div>
              </div>

              {/* Back Side */}
              <div className="flashcard-face flashcard-back">
                <div className="card-face-top">
                  <span className="kicker-tag">Answer & Explanation</span>
                  <button className="card-sound-btn" onClick={handleListen} aria-label="Listen to answer"><LuVolume2 /></button>
                </div>
                <div className="card-face-body">
                  <pre className="back-text">{card.back}</pre>
                </div>
                <div className="card-face-bottom">
                  <span className="flip-hint"><LuRotateCw /> Tap to flip back</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flashcard-controls">
            <button className="btn nav-btn" onClick={prevCard} aria-label="Previous card"><LuChevronLeft /> Prev</button>
            <button className="btn flip-btn" onClick={flip}><LuRotateCw /> Flip Card</button>
            <button className="btn study-again-btn" onClick={handleStudyAgain}><LuRotateCcw /> Again</button>
            <button className="btn got-it-btn" onClick={handleGotIt}><LuCheck /> Got it! (+1 pt)</button>
            <button className="btn nav-btn" onClick={nextCard} aria-label="Next card">Next <LuChevronRight /></button>
          </div>
        </div>
      ) : (
        <div className="empty-deck">No cards available in this deck.</div>
      )}

      {celeb && <Celebration streak={celeb.count} onDone={() => setCeleb(null)} />}
    </div>
  );
}
