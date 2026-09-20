import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  ArrowLeft, Mic, Play, Volume2, Star, CheckCircle2, RotateCcw, Home, Sparkles, RefreshCw
} from 'lucide-react';
import {
  createSpeechRecognizer, speakText, playCorrect, playIncorrect,
  playPop, stopSpeech, fireConfetti, PRAISES, CORRECTIONS
} from '../utils/audio.js';

const SOUND_GROUPS = [
  { id: 'ck', label: 'ck', emoji: 'K', words: ['back', 'duck', 'luck', 'sock', 'rock', 'pick', 'truck', 'block', 'sick', 'neck'] },
  { id: 'ch', label: 'ch', emoji: 'C', words: ['chip', 'cheese', 'chick', 'chin', 'chess', 'chair', 'chalk', 'cherry', 'beach', 'lunch'] },
  { id: 'sh', label: 'sh', emoji: 'S', words: ['ship', 'shop', 'fish', 'dish', 'shoe', 'shell', 'shark', 'brush', 'wash', 'crash'] },
  { id: 'th', label: 'th', emoji: 'T', words: ['thumb', 'thick', 'thin', 'math', 'bath', 'moth', 'tooth', 'three', 'think', 'throw'] },
  { id: 'wh', label: 'wh', emoji: 'W', words: ['whale', 'whip', 'whisk', 'wheel', 'wheat', 'whim', 'whiz', 'where', 'when', 'whiff'] },
  { id: 'ph', label: 'ph', emoji: 'P', words: ['phone', 'photo', 'dolphin', 'trophy', 'graph', 'alphabet', 'elephant', 'sphere', 'phantom', 'orphan'] },
  { id: 'ng', label: 'ng', emoji: 'N', words: ['ring', 'sing', 'song', 'king', 'wing', 'hang', 'bang', 'long', 'swing', 'thing'] }
];

let _recognizer = null;
let _locked = false;
function getRecognizer(onResult, onEnd, onError) {
  if (_recognizer) return _recognizer;
  _recognizer = createSpeechRecognizer(onResult, onEnd, onError);
  return _recognizer;
}

const SayItScreen = memo(({ profile, onFinish, onBack }) => {
  const [group, setGroup] = useState(null);
  const [word, setWord] = useState(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [stars, setStars] = useState(0);
  const [done, setDone] = useState(false);
  const wordIndexRef = useRef(0     );

  const speakWord = useCallback(() => {
    stopSpeech();
    if (word) { setListening(false); speakText(word.toLowerCase(), 0.85, 1.1); playPop(); }
  }, [word]);

  const handleResult = useCallback((text) => {
    setListening(false);
    setTranscript(text);
    if (!word) return;
    const norm = (text || '').toLowerCase().replace(/[^a-z]/g, '');
    if (norm === word.toLowerCase()) {
      setFeedback({ ok: true, msg: PRAISES[Math.floor(Math.random() * PRAISES.length)] });
      playCorrect();
      setStars(s => s + 1);
      fireConfetti(false);
    } else {
      setFeedback({ ok: false, msg: CORRECTIONS[Math.floor(Math.random() * CORRECTIONS.length)] + ' Say: ' + word });
      playIncorrect();
    }
  }, [word]);

  const handleEnd = useCallback(() => setListening(false), []);
  const handleError = useCallback(() => {
    setListening(false);
    setFeedback({ ok: false, msg: 'Mic issue. Tap the mic and try again.' });
  }, []);

  const startListening = useCallback(() => {
    if (_locked) return;
    _locked = true;
    setTimeout(() => { _locked = false; }, 900);
    stopSpeech();
    setTranscript('');
    setFeedback(null);
    setListening(true);
    const rec = getRecognizer(handleResult, handleEnd, handleError);
    rec.start && rec.start();
  }, [handleResult, handleEnd, handleError]);

  const stopListening = useCallback(() => {
    setListening(false);
    if (_recognizer) { _recognizer.stop && _recognizer.stop(); }
  }, []);

  const nextWord = useCallback((currentWord, currentIndex) => {
    const g = group;
    if (!g) return;
    const nextIdx = currentIndex + 1;
    if (nextIdx >= g.words.length) {
      setWord(null);
      setDone(true);
      const finalCoins = stars + 2;
      if (onFinish) onFinish({ stars, coins: finalCoins });
      return;
    }
    const w = g.words[nextIdx];
    setWord(w);
    setTranscript('');
    setFeedback(null);
    wordIndexRef.current = nextIdx;
    setTimeout(() => speakText(w.toLowerCase(), 0.85, 1.1), 400);
  }, [group, stars, onFinish]);

  const skipWord = useCallback(() => {
    playPop();
    stopSpeech();
    setListening(false);
    const idx = wordIndexRef.current;
    nextWord(word, idx);
  }, [word, nextWord]);

  const restart = useCallback(() => {
    playPop();
    stopSpeech();
    setListening(false);
    setWord(null);
    setTranscript('');
    setFeedback(null);
    setStars(0);
    setDone(false);
    wordIndexRef.current = 0;
    if (group) {
      const w = group.words[0];
      setWord(w);
      setTimeout(() => speakText(w.toLowerCase(), 0.85, 1.1), 400);
    }
  }, [group]);

  const chooseGroup = useCallback((g) => {
    playPop();
    stopSpeech();
    setListening(false);
    setGroup(g);
    setWord(null);
    setTranscript('');
    setFeedback(null);
    setStars(0);
    setDone(false);
    wordIndexRef.current = 0;
  }, []);

  useEffect(() => () => { stopSpeech(); if (_recognizer) { _recognizer.stop && _recognizer.stop(); } }, []);

  if (!group) {
    return (
      <div className="min-h-screen pb-24 bg-gradient-to-b from-teal-50 to-emerald-100">
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { playPop(); onBack && onBack(); }} className="kid-3d-btn w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600"><ArrowLeft size={20} /></button>
            <div className="flex items-center gap-1 bg-white shadow-md px-3 py-2 rounded-2xl">
              <Star size={18} color="#F59E0B" fill="#F59E0B" />
              <span className="font-black text-gray-700">{profile && profile.stars}</span>
            </div>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-gray-800 mb-1">Say-It!</h1>
            <p className="text-sm text-gray-500">Pick a sound, say the word, earn stars.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {SOUND_GROUPS.map(g => (
              <button key={g.id} onClick={() => chooseGroup(g)} className="kid-3d-btn rounded-3xl bg-white shadow-lg p-5 flex flex-col items-center gap-2 active:scale-95 transition">
                <span className="text-3xl">{g.emoji}</span>
                <span className="text-xl font-black text-gray-700">{g.label}</span>
                <span className="text-[11px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">{g.words.length} words</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-teal-50 to-emerald-100">
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { playPop(); onBack && onBack(); }} className="kid-3d-btn w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600"><ArrowLeft size={20} /></button>
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-wide text-teal-600 bg-white/80 rounded-full px-3 py-1">{group.label} sounds</span>
          </div>
          <div className="flex items-center gap-1 bg-white shadow-md px-3 py-2 rounded-2xl">
            <Star size={18} color="#F59E0B" fill="#F59E0B" />
            <span className="font-black text-gray-700">{stars}</span>
          </div>
        </div>

        {!done ? (
          <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
            <div className="text-6xl font-black text-gray-800 mb-1">{word || 'Ready?'}</div>
            <p className="text-sm text-gray-500 mb-5">Tap the speaker, then tap the mic and say it!</p>

            <div className="flex items-center justify-center gap-3 mb-5">
              <button onClick={speakWord} className="kid-3d-btn w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center"><Volume2 size={26} /></button>
              <button
                onClick={listening ? stopListening : startListening}
                className={`kid-3d-btn w-20 h-20 rounded-full text-white shadow-xl flex items-center justify-center transition-all ${listening ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}
              >
                <Mic size={34} />
              </button>
              <button onClick={skipWord} className="kid-3d-btn w-14 h-14 rounded-full bg-amber-400 text-white shadow-lg flex items-center justify-center"><RefreshCw size={26} /></button>
            </div>

            {listening && <p className="text-sm font-bold text-red-500 animate-pulse mb-2">Listening... say the word!</p>}
            {transcript && <p className="text-sm text-gray-600 mb-2">You said: <span className="font-bold">{transcript}</span></p>}
            {feedback && (
              <div className={`flex items-center justify-center gap-2 text-sm font-bold ${feedback.ok ? 'text-emerald-600' : 'text-rose-500'}`}>
                {feedback.ok ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
                {feedback.msg}
              </div>
            )}
            {feedback && feedback.ok && (
              <button onClick={() => nextWord(word, wordIndexRef.current)} className="kid-3d-btn mt-4 bg-emerald-500 text-white px-5 py-2 rounded-2xl shadow-md">
                <Play size={18} /> Next Word
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
            <Sparkles size={48} color="#F59E0B" className="mx-auto mb-2" />
            <div className="text-2xl font-black text-gray-800 mb-1">Great job!</div>
            <p className="text-sm text-gray-500 mb-3">You finished all {group.label} words!</p>
            <div className="flex items-center justify-center gap-1 mb-4">
              <Star size={22} color="#F59E0B" fill="#F59E0B" />
              <span className="text-xl font-black text-gray-700">+{stars} stars</span>
            </div>
            <button onClick={restart} className="kid-3d-btn bg-teal-500 text-white px-5 py-2.5 rounded-2xl shadow-md mb-3">
              <RotateCcw size={18} /> Play Again
            </button>
            <button onClick={() => { playPop(); onBack && onBack(); }} className="kid-3d-btn bg-gray-200 text-gray-600 px-5 py-2.5 rounded-2xl shadow-md">
              <Home size={18} /> Back Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default SayItScreen;
