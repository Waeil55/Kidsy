import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Mic, MicOff, ArrowLeft, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { PHONICS_WORDS, getWordsByGrade, shuffle } from '../data/phonicsWords';
import { playPop, playCorrect, playIncorrect, fireConfetti, speakText, stopAudio } from '../utils/audio';
import { useApp } from '../store/AppContext';

// Levenshtein distance for fuzzy speech matching
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

// Map grade string to numeric level for phonicsWords (which uses 1/2/3)
function gradeToNum(gradeStr) {
  const g = String(gradeStr || '1').replace(/[^0-9KkGg]/g, '');
  if (g === '' || g.toLowerCase() === 'k') return 1;
  const n = parseInt(g, 10);
  return isNaN(n) ? 1 : Math.min(Math.max(n, 1), 5);
}

export function PhonicsAdventure({ onBack }) {
  const { child } = useApp();
  // Use child's grade from profile — never ask again
  const gradeNum = gradeToNum(child?.grade);

  const [words, setWords] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stars, setStars] = useState(0);
  const [fontSize, setFontSize] = useState(72);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const pool = PHONICS_WORDS.filter(w => w.grade <= gradeNum);
    setWords(shuffle(pool.length >= 10 ? pool : PHONICS_WORDS));
    setCurrentIdx(0);
    setFeedback('');
  }, [gradeNum]);

  const currentWord = words[currentIdx] || { word: '', sound: '', emoji: '📖' };
  const progress = words.length > 0 ? Math.round(((currentIdx + 1) / words.length) * 100) : 0;

  const handleListen = () => {
    stopAudio();
    playPop();
    speakText(currentWord.word);
  };

  const handleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setFeedback('🎤 Speech not supported in this browser.'); return; }
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
          setFeedback('🎉 Amazing! Keep going!');
          setStars(s => s + 1);
          setShowSuccess(true);
          playCorrect();
          fireConfetti();
          setTimeout(() => {
            setShowSuccess(false);
            setFeedback('');
            setCurrentIdx(i => (i + 1) % words.length);
          }, 1200);
          return;
        }
      }
    };
    r.onerror = () => { setListening(false); setFeedback('😅 Could not hear you — try again!'); };
    r.onend = () => setListening(false);
    r.start();
  };

  const goPrev = () => { if (currentIdx > 0) { setCurrentIdx(i => i - 1); setFeedback(''); } };
  const goNext = () => { setCurrentIdx(i => (i + 1) % words.length); setFeedback(''); };

  // Grade label for display only
  const gradeLabel = child?.grade ? `Grade ${child.grade}` : 'My Grade';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-300 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-300 rounded-full opacity-20 blur-3xl" />
      </div>

      {/* Top toolbar */}
      <div className="relative z-10 flex items-center justify-between p-4 gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 bg-white shadow-md rounded-2xl px-3 py-2 text-gray-600 font-bold text-sm border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center gap-1 bg-purple-100 border-2 border-purple-300 rounded-2xl px-3 py-1.5">
          <span className="text-xs font-extrabold text-purple-700">{gradeLabel} · Phonics</span>
        </div>

        <div className="flex gap-2 items-center">
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl px-3 py-1.5 flex items-center gap-1">
            <Star size={13} className="text-yellow-500 fill-yellow-400" />
            <span className="font-extrabold text-yellow-700 text-sm">{stars}</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setFontSize(s => Math.max(40, s - 10))} className="bg-white shadow rounded-xl px-2 py-1 font-bold text-blue-500 border border-gray-200 text-xs active:scale-95">A-</button>
            <button onClick={() => setFontSize(s => Math.min(140, s + 10))} className="bg-white shadow rounded-xl px-2 py-1 font-bold text-blue-500 border border-gray-200 text-xs active:scale-95">A+</button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 mx-4 mb-3">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-center font-semibold text-gray-400 mt-0.5">{currentIdx + 1} of {words.length} words · {progress}% done</p>
      </div>

      {/* Main card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-6 flex flex-col items-center">
          {/* Sound badge */}
          {currentWord.sound && (
            <div className="mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-1.5 rounded-full text-sm font-extrabold shadow-md tracking-wide uppercase">
              {currentWord.sound} Sound
            </div>
          )}

          {/* Emoji */}
          <div className="text-6xl mb-3 select-none" role="img">{currentWord.emoji || '📖'}</div>

          {/* Word — big, beautiful */}
          <div
            className="font-black text-center leading-none mb-3 tracking-tight"
            style={{ fontSize: `${fontSize}px`, color: '#1e293b', fontFamily: "'Nunito', sans-serif" }}
          >
            {currentWord.word}
          </div>

          <p className="text-center text-gray-400 text-sm mb-5 font-semibold">
            👂 Listen first, then say the word aloud!
          </p>

          {/* Listen + Say buttons */}
          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            <button
              onClick={handleListen}
              className="flex flex-col items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 active:scale-95 text-white rounded-2xl py-5 shadow-lg border-b-4 border-orange-600 transition-all font-extrabold"
            >
              <Volume2 size={30} />
              <span className="text-sm uppercase">Listen</span>
            </button>

            <button
              onClick={handleMic}
              className={`flex flex-col items-center justify-center gap-2 text-white rounded-2xl py-5 shadow-lg border-b-4 transition-all font-extrabold active:scale-95 ${
                listening
                  ? 'bg-red-500 border-red-700 animate-pulse'
                  : 'bg-green-500 hover:bg-green-600 border-green-700'
              }`}
            >
              {listening ? <MicOff size={30} /> : <Mic size={30} />}
              <span className="text-sm uppercase">{listening ? 'Stop' : 'Say it!'}</span>
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`w-full text-center font-extrabold text-base py-2 px-4 rounded-2xl mb-3 ${
              feedback.startsWith('🎉') || feedback.startsWith('⭐')
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {feedback}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 w-full">
            <button
              onClick={goPrev}
              disabled={currentIdx === 0}
              className="flex-1 flex items-center justify-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-2xl py-3 font-extrabold text-sm border-b-4 border-gray-300 transition-all active:scale-95 disabled:opacity-40"
            >
              <ChevronLeft size={18} /> Back
            </button>
            <button
              onClick={goNext}
              className="flex-[2] flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-extrabold text-sm shadow-lg border-b-4 border-blue-800 transition-all active:scale-95"
            >
              Next Word <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Success flash */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500 text-white text-2xl font-black px-10 py-6 rounded-3xl shadow-2xl animate-bounce">
            ⭐ +1 Star!
          </div>
        </div>
      )}
    </div>
  );
}
