import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Mic, MicOff, ArrowLeft, Sun, Moon, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { PHONICS_WORDS, getWordsByGrade, shuffle } from '../data/phonicsWords';
import { playPop, playCorrect, playIncorrect, fireConfetti, speakText, stopAudio } from '../utils/audio';

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

const GRADE_OPTS = [
  { label: 'Grade K', val: 0 },
  { label: 'Grade 1', val: 1 },
  { label: 'Grade 2', val: 2 },
  { label: 'Grade 3', val: 3 },
  { label: 'Grade 4', val: 4 },
  { label: 'Grade 5', val: 5 },
];

export function PhonicsAdventure({ onBack }) {
  const [gradeLevel, setGradeLevel] = useState(1);
  const [words, setWords] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stars, setStars] = useState(0);
  const [fontSize, setFontSize] = useState(80);
  const [dark, setDark] = useState(false);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // grade 0=K maps to words with grade<=1, etc.
    const pool = PHONICS_WORDS.filter(w => w.grade <= Math.max(gradeLevel, 1));
    setWords(shuffle(pool.length > 0 ? pool : PHONICS_WORDS));
    setCurrentIdx(0);
    setFeedback('');
  }, [gradeLevel]);

  const currentWord = words[currentIdx] || { word: '', sound: '', emoji: '📖' };
  const progress = words.length > 0 ? Math.round(((currentIdx + 1) / words.length) * 100) : 0;

  const handleListen = () => {
    stopAudio();
    playPop();
    speakText(currentWord.word);
  };

  const handleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setFeedback('Speech not supported in this browser.'); return; }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }

    const r = new SR();
    recognitionRef.current = r;
    r.continuous = false;
    r.lang = 'en-US';
    r.interimResults = true;
    r.maxAlternatives = 5;
    setListening(true);
    setFeedback('');

    const target = currentWord.word.toLowerCase();
    let matched = false;

    r.onresult = (e) => {
      if (matched) return;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript.toLowerCase().trim();
        if (t.includes(target) || target.includes(t) || levenshtein(t, target) <= 2) {
          matched = true;
          r.stop();
          setListening(false);
          setFeedback('🎉 Great job!');
          setStars(s => s + 1);
          setShowSuccess(true);
          playCorrect();
          fireConfetti();
          setTimeout(() => {
            setShowSuccess(false);
            setFeedback('');
            goNext();
          }, 1200);
          return;
        }
      }
    };
    r.onerror = () => { setListening(false); setFeedback('Could not hear you. Try again! 🎤'); };
    r.onend = () => setListening(false);
    r.start();
  };

  const goPrev = () => { if (currentIdx > 0) { setCurrentIdx(i => i - 1); setFeedback(''); } };
  const goNext = () => { setCurrentIdx(i => (i + 1) % words.length); setFeedback(''); };

  const toggleTheme = () => {
    setDark(d => !d);
    document.documentElement.classList.toggle('dark');
  };

  const bg = dark
    ? 'bg-slate-900 text-white'
    : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50';
  const cardCls = dark
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-gray-100';

  return (
    <div className={`flex flex-col min-h-screen ${bg} relative overflow-hidden`}>
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-300 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-300 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full opacity-10 blur-3xl" />
      </div>

      {/* Top toolbar */}
      <div className="relative z-10 flex items-center justify-between p-4 gap-2 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-1 bg-white dark:bg-slate-700 shadow-md rounded-2xl px-3 py-2 text-gray-600 dark:text-gray-200 font-bold text-sm border border-gray-100 dark:border-slate-600 hover:bg-gray-50 active:scale-95 transition-all"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex gap-2">
          <div className="bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-400 rounded-2xl px-3 py-1.5 flex items-center gap-1">
            <Star size={14} className="text-yellow-500 fill-yellow-400" />
            <span className="font-extrabold text-yellow-700 dark:text-yellow-300 text-sm">{stars}</span>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 border-2 border-blue-400 rounded-2xl px-3 py-1.5">
            <span className="font-extrabold text-blue-700 dark:text-blue-300 text-sm">{currentIdx + 1}/{words.length}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setFontSize(s => Math.max(40, s - 10))} className="bg-white dark:bg-slate-700 shadow rounded-xl px-2 py-1 font-bold text-blue-500 border border-gray-200 dark:border-slate-600 text-sm hover:bg-blue-50 active:scale-95">A-</button>
          <button onClick={() => setFontSize(s => Math.min(150, s + 10))} className="bg-white dark:bg-slate-700 shadow rounded-xl px-2 py-1 font-bold text-blue-500 border border-gray-200 dark:border-slate-600 text-sm hover:bg-blue-50 active:scale-95">A+</button>
          <button onClick={toggleTheme} className="bg-white dark:bg-slate-700 shadow rounded-xl px-2 py-1 text-purple-500 border border-gray-200 dark:border-slate-600 hover:bg-purple-50 active:scale-95">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 mx-4 mb-2">
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-center font-semibold text-gray-400 dark:text-gray-500 mt-0.5">{progress}% Complete</p>
      </div>

      {/* Grade selector */}
      <div className="relative z-10 flex gap-2 overflow-x-auto mx-4 pb-2 scrollbar-hide">
        {GRADE_OPTS.map(g => (
          <button
            key={g.val}
            onClick={() => setGradeLevel(g.val)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-2xl font-bold text-sm border-2 transition-all active:scale-95 ${
              gradeLevel === g.val
                ? 'bg-purple-600 text-white border-purple-700 shadow-md'
                : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-600 hover:bg-purple-50'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Main card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-3">
        <div className={`w-full max-w-lg ${cardCls} rounded-3xl shadow-2xl border-2 p-6 flex flex-col items-center`}>
          {/* Sound badge */}
          {currentWord.sound && (
            <div className="mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-1.5 rounded-full text-base font-extrabold shadow-md tracking-wide">
              {currentWord.sound.toUpperCase()} Sound
            </div>
          )}

          {/* Emoji */}
          <div className="text-6xl mb-3 select-none" role="img" aria-label={currentWord.word}>
            {currentWord.emoji || '📖'}
          </div>

          {/* Word */}
          <div
            className="font-black text-center leading-none mb-3 tracking-tight"
            style={{ fontSize: `${fontSize}px`, color: dark ? '#e2e8f0' : '#1e293b', fontFamily: "'Nunito', sans-serif" }}
          >
            {currentWord.word}
          </div>

          <p className="text-center text-gray-400 dark:text-gray-500 text-sm mb-5 font-semibold">
            Listen to the word, then say it aloud! 🎤
          </p>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            <button
              onClick={handleListen}
              className="flex flex-col items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 active:scale-95 text-white rounded-2xl py-5 shadow-lg border-b-4 border-orange-600 transition-all font-extrabold"
            >
              <Volume2 size={32} />
              <span className="text-base uppercase">Listen</span>
            </button>

            <button
              onClick={handleMic}
              className={`flex flex-col items-center justify-center gap-2 text-white rounded-2xl py-5 shadow-lg border-b-4 transition-all font-extrabold active:scale-95 ${
                listening
                  ? 'bg-red-500 border-red-700 animate-pulse'
                  : 'bg-green-500 hover:bg-green-600 border-green-700'
              }`}
            >
              {listening ? <MicOff size={32} /> : <Mic size={32} />}
              <span className="text-base uppercase">{listening ? 'Stop' : 'Say it!'}</span>
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`w-full text-center font-extrabold text-lg py-2 px-4 rounded-2xl mb-3 transition-all ${
              feedback.startsWith('🎉')
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                : 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
            }`}>
              {feedback}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 w-full">
            <button
              onClick={goPrev}
              disabled={currentIdx === 0}
              className="flex-1 flex items-center justify-center gap-1 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300 rounded-2xl py-3 font-extrabold text-base border-b-4 border-gray-300 dark:border-slate-900 transition-all active:scale-95 disabled:opacity-40"
            >
              <ChevronLeft size={20} /> BACK
            </button>
            <button
              onClick={goNext}
              className="flex-[2] flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-extrabold text-base shadow-lg border-b-4 border-blue-800 transition-all active:scale-95"
            >
              NEXT WORD <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Success flash */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500 text-white text-3xl font-black px-10 py-6 rounded-3xl shadow-2xl animate-bounce">
            ⭐ +1 Star!
          </div>
        </div>
      )}
    </div>
  );
}
