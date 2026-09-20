import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronRight, Star, Volume2, Mic, MicOff } from 'lucide-react';
import { PHONICS_WORDS, getWordsByGrade, shuffle } from '../data/phonicsWords';
import { playCorrect, playIncorrect, fireConfetti, speakText } from '../utils/audio';
import { useApp } from '../store/AppContext';

// Map grade string to phonicsWords numeric level
function gradeToNum(gradeStr) {
  const g = String(gradeStr || '1').replace(/[^0-9KkGg]/g, '');
  if (g === '' || g.toLowerCase() === 'k') return 1;
  const n = parseInt(g, 10);
  return isNaN(n) ? 1 : Math.min(Math.max(n, 1), 5);
}

// ─── Spell Card ───────────────────────────────────────────────────────────────
function SpellCard({ item, onSuccess }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const check = () => {
    if (!input.trim()) return;
    if (input.trim().toLowerCase() === item.word.toLowerCase()) {
      setResult('correct'); playCorrect(); fireConfetti();
      setTimeout(() => { setResult(null); setInput(''); onSuccess(); }, 900);
    } else {
      setResult('wrong'); playIncorrect();
      setTimeout(() => setResult(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="text-7xl">{item.emoji}</div>
      <p className="text-white font-extrabold text-xl text-center drop-shadow">✏️ Spell this word!</p>
      <div className="bg-white rounded-2xl w-full px-4 py-3 flex items-center gap-2 shadow-lg">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="Type the word..."
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="flex-1 outline-none text-2xl font-bold text-gray-800 bg-transparent"
        />
        <button onClick={check} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold active:scale-95 shadow text-lg">✓</button>
      </div>
      {result === 'correct' && <div className="text-green-300 font-extrabold text-2xl animate-bounce">🎉 Correct!</div>}
      {result === 'wrong' && <div className="text-red-300 font-extrabold text-xl">❌ Try again!</div>}
    </div>
  );
}

// ─── MCQ Card ─────────────────────────────────────────────────────────────────
function MCQCard({ item, allWords, onSuccess }) {
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const others = allWords.filter(w => w.word !== item.word);
    const picked = shuffle(others).slice(0, 3);
    setChoices(shuffle([item, ...picked]));
    setSelected(null);
  }, [item.word]);

  const pick = (w) => {
    if (selected) return;
    setSelected(w.word);
    if (w.word === item.word) { playCorrect(); fireConfetti(); setTimeout(() => { setSelected(null); onSuccess(); }, 900); }
    else { playIncorrect(); setTimeout(() => setSelected(null), 800); }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="text-7xl">{item.emoji}</div>
      <p className="text-white font-extrabold text-xl text-center drop-shadow">🔍 Which word matches?</p>
      <div className="grid grid-cols-2 gap-3 w-full">
        {choices.map(c => (
          <button key={c.word} onClick={() => pick(c)}
            className={`py-4 rounded-2xl font-extrabold text-xl transition-all active:scale-95 shadow ${
              selected === c.word
                ? c.word === item.word ? 'bg-green-400 text-white scale-105' : 'bg-red-400 text-white'
                : 'bg-white text-gray-800 hover:bg-blue-50'
            }`}>
            {c.word}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Say Card ─────────────────────────────────────────────────────────────────
function SayCard({ item, onSuccess }) {
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const rRef = useRef(null);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  const start = () => {
    if (!SR) { setFeedback('Speech not supported'); return; }
    if (listening) { rRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    rRef.current = r;
    r.lang = 'en-US'; r.interimResults = true; r.maxAlternatives = 5;
    setListening(true); setFeedback('');
    const tgt = item.word.toLowerCase();
    r.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript.toLowerCase().trim();
        if (t.includes(tgt) || tgt.includes(t) || Math.abs(t.length - tgt.length) <= 2) {
          r.stop(); setListening(false);
          setFeedback('🎉 Perfect!'); playCorrect(); fireConfetti();
          setTimeout(() => { setFeedback(''); onSuccess(); }, 900);
          return;
        }
      }
    };
    r.onerror = () => { setListening(false); setFeedback('Try again! 🎤'); };
    r.onend = () => setListening(false);
    r.start();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="text-7xl">{item.emoji}</div>
      <div className="text-white text-5xl font-black drop-shadow-lg">{item.word}</div>
      <button onClick={() => speakText(item.word)}
        className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg active:scale-95">
        <Volume2 size={20} /> Hear it
      </button>
      <button onClick={start}
        className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all ${
          listening ? 'bg-red-500 border-b-4 border-red-700 animate-pulse' : 'bg-green-500 border-b-4 border-green-700 hover:bg-green-600'
        }`}>
        {listening ? <><MicOff size={22} /> Listening...</> : <><Mic size={22} /> Say it!</>}
      </button>
      {feedback && <div className="font-extrabold text-2xl text-green-300 animate-bounce">{feedback}</div>}
    </div>
  );
}

// ─── Card Types ───────────────────────────────────────────────────────────────
const CARD_TYPES = ['mcq', 'say', 'spell'];
const GRAD_BG = [
  'from-indigo-700 to-purple-800',
  'from-pink-600 to-rose-800',
  'from-green-600 to-teal-800',
  'from-orange-500 to-amber-700',
  'from-sky-600 to-blue-800',
  'from-violet-600 to-purple-900',
];

// ─── Main KidsReels Page ──────────────────────────────────────────────────────
export function KidsReels({ onBack }) {
  const { child } = useApp();
  const gradeNum = gradeToNum(child?.grade);

  const [reels, setReels] = useState([]);
  const [current, setCurrent] = useState(0);
  const [stars, setStars] = useState(0);
  const [showStar, setShowStar] = useState(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    // Use grade-appropriate word pool
    const pool = PHONICS_WORDS.filter(w => w.grade <= gradeNum);
    const usable = pool.length >= 10 ? pool : PHONICS_WORDS;
    const shuffled = shuffle([...usable]);
    // Create 45 reels cycling through card types
    setReels(shuffled.slice(0, 45).map((w, i) => ({ idx: i, word: w })));
  }, [gradeNum]);

  const onSuccess = () => {
    setStars(s => s + 1);
    setShowStar(true);
    setTimeout(() => {
      setShowStar(false);
      setCurrent(i => Math.min(i + 1, reels.length - 1));
    }, 800);
  };

  const prev = () => setCurrent(i => Math.max(i - 1, 0));
  const next = () => setCurrent(i => Math.min(i + 1, reels.length - 1));

  const onTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e) => {
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (dy > 60) next();
    if (dy < -60) prev();
  };

  const reel = reels[current];
  const cardType = reel ? CARD_TYPES[reel.idx % CARD_TYPES.length] : 'mcq';
  const gradBg = GRAD_BG[current % GRAD_BG.length];

  const typeBadge = { spell: '✏️ Spell It', mcq: '🔍 Pick It', say: '🎤 Say It' };
  const typeBadgeBg = { spell: 'bg-blue-500', mcq: 'bg-purple-500', say: 'bg-green-500' };

  const gradeLabel = child?.grade ? `Grade ${child.grade}` : '';

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-4 pb-2 bg-black bg-opacity-40 backdrop-blur-sm">
        <button onClick={onBack}
          className="flex items-center gap-1 bg-white bg-opacity-20 text-white rounded-2xl px-3 py-2 font-bold text-sm active:scale-95 border border-white border-opacity-20">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="text-center">
          <div className="text-white font-black text-base drop-shadow">🎬 Kidsy Reels</div>
          {gradeLabel && <div className="text-white text-opacity-60 text-xs">{gradeLabel}</div>}
        </div>
        <div className="flex items-center gap-1 bg-yellow-400 bg-opacity-95 rounded-2xl px-3 py-1.5 shadow-md">
          <Star size={14} className="text-yellow-800 fill-yellow-800" />
          <span className="font-extrabold text-yellow-900 text-sm">{stars}</span>
        </div>
      </div>

      {/* Reel card */}
      {reel && (
        <div className={`flex-1 mx-3 mb-4 rounded-3xl overflow-hidden bg-gradient-to-br ${gradBg} shadow-2xl relative flex flex-col items-center justify-center p-6`}>
          {/* Blur blobs */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />

          {/* Type badge */}
          <div className={`${typeBadgeBg[cardType]} text-white px-4 py-1 rounded-full text-sm font-extrabold mb-6 shadow-lg z-10`}>
            {typeBadge[cardType]}
          </div>

          {/* Card content */}
          <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
            {cardType === 'spell' && <SpellCard key={`spell-${current}`} item={reel.word} onSuccess={onSuccess} />}
            {cardType === 'mcq' && <MCQCard key={`mcq-${current}`} item={reel.word} allWords={PHONICS_WORDS} onSuccess={onSuccess} />}
            {cardType === 'say' && <SayCard key={`say-${current}`} item={reel.word} onSuccess={onSuccess} />}
          </div>

          {/* Swipe hint */}
          <p className="absolute bottom-16 text-white text-opacity-40 text-xs font-semibold tracking-wide">
            ↑ Swipe up for next
          </p>

          {/* Progress dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5">
            {Array.from({ length: Math.min(reels.length, 9) }).map((_, i) => {
              const dotIdx = Math.floor(current / 9) * 9 + i;
              return (
                <div key={dotIdx}
                  className={`rounded-full transition-all duration-300 ${dotIdx === current ? 'w-5 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white bg-opacity-35'}`}
                />
              );
            })}
          </div>

          {/* Nav arrows */}
          <button onClick={prev} disabled={current === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 active:scale-90 disabled:opacity-30 backdrop-blur">
            <ChevronRight size={22} className="rotate-180" />
          </button>
          <button onClick={next} disabled={current === reels.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 active:scale-90 disabled:opacity-30 backdrop-blur">
            <ChevronRight size={22} />
          </button>
        </div>
      )}

      {/* Loading state */}
      {reels.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-white text-xl font-bold">
          Loading reels...
        </div>
      )}

      {/* Star flash */}
      {showStar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-yellow-400 text-yellow-900 font-black text-4xl px-10 py-6 rounded-3xl shadow-2xl animate-bounce">
            ⭐ +1
          </div>
        </div>
      )}
    </div>
  );
}
