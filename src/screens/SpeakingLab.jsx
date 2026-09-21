import React, { useEffect, useMemo, useState } from 'react';
import { LuCheck, LuChevronRight, LuFlame, LuGauge, LuHeadphones, LuMic, LuRotateCcw, LuSparkles, LuVolume2 } from 'react-icons/lu';
import { useStore } from '../store/store.js';
import { GRADE_BY_KEY } from '../data/grades.js';
import { vocabFor } from '../data/vocab.js';
import { maikelFamilyFor, maikelWordsFor } from '../data/maikel.js';
import { matchTyped, speak } from '../lib/speech.js';
import { MicBtn, Notice, useMic } from '../ui/ui.jsx';

const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z\s']/g, '').trim();

export default function SpeakingLab() {
  const { state, dispatch } = useStore();
  const grade = GRADE_BY_KEY[state.gradeKey];
  const [mode, setMode] = useState('phonics');
  const [position, setPosition] = useState(0);
  const [heard, setHeard] = useState('');
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const phonics = useMemo(() => maikelWordsFor(state.gradeKey), [state.gradeKey]);
  const vocabulary = useMemo(() => vocabFor(state.gradeKey).slice(0, 30), [state.gradeKey]);
  const target = mode === 'phonics' ? phonics[position % phonics.length] : vocabulary[position % vocabulary.length];
  const phrase = mode === 'phonics' ? `Say the sound in ${target.word}` : `The word ${target.w} means ${target.def}.`;
  const expected = mode === 'phonics' ? target.word : phrase;

  const onFinal = (text) => {
    const accepted = mode === 'phonics' ? [target.word] : [phrase, target.w];
    const good = mode === 'vocabulary' ? normalize(text).includes(normalize(target.w)) || !!matchTyped([text], accepted) : !!matchTyped([text], accepted);
    setHeard(text); setResult(good ? 'good' : 'try'); setAttempts((n) => n + 1);
    setCorrect((n) => n + (good ? 1 : 0)); setStreak((n) => good ? n + 1 : 0);
    if (good) dispatch({ type: 'answer', grade: state.gradeKey, subject: 'speaking', correct: true });
  };
  const mic = useMic({ onFinal });
  const next = () => { mic.stop(); setPosition((n) => n + 1); setHeard(''); setResult(null); };
  const reset = () => { mic.stop(); setPosition(0); setHeard(''); setResult(null); setAttempts(0); setCorrect(0); setStreak(0); };
  const listenTarget = () => speak(mode === 'phonics' ? target.word : phrase, { rate: state.settings.rate });

  return <div className="speaking-lab">
    <section className="lab-hero"><div><span className="eyebrow">Grade-locked voice coaching</span><h1>Speaking Lab <LuSparkles /></h1><p>Listen, speak, and get instant feedback for {grade.label}.</p></div><div className="lab-score"><LuFlame /><b>{streak}</b><small>streak</small></div></section>
    <section className="lab-toolbar"><div className="seg" role="tablist"><button className={mode === 'phonics' ? 'on' : ''} onClick={() => { setMode('phonics'); reset(); }}>Sound words</button><button className={mode === 'vocabulary' ? 'on' : ''} onClick={() => { setMode('vocabulary'); reset(); }}>Speak a sentence</button></div><span className="lab-grade">🔒 {grade.short} · {maikelFamilyFor(state.gradeKey).join(' · ')}</span></section>
    <section className={`voice-card ${result || ''}`}>
      <div className="voice-card-top"><span className="pill w">{mode === 'phonics' ? `${position + 1} of ${phonics.length}` : `${position + 1} of ${vocabulary.length}`}</span><span className="voice-family">{mode === 'phonics' ? `${target.sound} sound family` : target.pos}</span></div>
      <div className="voice-visual" aria-hidden="true">{result === 'good' ? '🌟' : result === 'try' ? '💛' : mode === 'phonics' ? '🗣️' : '📣'}</div>
      <span className="eyebrow light">Your challenge</span>
      <h2>{mode === 'phonics' ? target.word : target.w}</h2>
      <p className="voice-prompt">{mode === 'phonics' ? `Say “${target.word}” clearly.` : phrase}</p>
      <button className="listen-word" onClick={listenTarget}><LuVolume2 /> Hear an example</button>
      <div className="record-zone"><MicBtn mic={mic} label="Start speaking" /><div><b>{mic.live ? 'Listening now...' : 'Tap the microphone and speak'}</b><small>{mic.live ? 'Take your time. I am listening.' : 'Use your normal voice.'}</small></div></div>
      {heard && <div className="heard-line"><span>You said</span><b>“{heard}”</b></div>}
      {result && <div className={`voice-feedback ${result}`}><span>{result === 'good' ? <LuCheck /> : <LuRotateCcw />}</span><div><b>{result === 'good' ? 'Excellent speaking!' : 'Almost there!'}</b><small>{result === 'good' ? 'That sounded clear and confident.' : `Try saying “${expected}” once more.`}</small></div></div>}
      <div className="voice-actions">{result ? <button className="btn white" onClick={next}><LuChevronRight /> Next challenge</button> : <button className="btn white" onClick={listenTarget}><LuHeadphones /> Listen first</button>}<button className="btn ghost" onClick={reset}><LuRotateCcw /> Reset</button></div>
    </section>
    <section className="lab-metrics"><div><LuGauge /><b>{attempts ? Math.round((correct / attempts) * 100) : 0}%</b><small>accuracy</small></div><div><LuMic /><b>{attempts}</b><small>attempts</small></div><div><LuCheck /><b>{correct}</b><small>clear words</small></div></section>
    {!mic.supported && <Notice kind="warn">Your browser does not provide speech recognition. You can still listen and practise aloud. Chrome, Edge and Safari support the microphone.</Notice>}
  </div>;
}
