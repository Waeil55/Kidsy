import React, { useMemo, useRef, useState } from 'react';
import { storyQuizSet } from '../data/grades.js';
import { playChime, speakText } from '../lib/sound.js';
import { micSupported, listenOnce, transcriptMatches } from '../lib/mic.js';

/* After-reading quiz: the story STAYS visible above while questions
   appear one-by-one in this docked bottom panel. */

export default function StoryQuizDock({ story, gradeKey, onClose, onFinish, notify }) {
  const questions = useMemo(() => storyQuizSet(story, 10), [story]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]);
  const [listening, setListening] = useState(false);
  const stopMic = useRef(null);

  const q = questions[idx];

  if (!q) {
    return (
      <div className="absolute inset-x-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 p-6 max-w-2xl mx-auto text-center text-sm font-bold text-slate-500">
        No questions for this story yet.
        <button onClick={onClose} className="ml-3 text-theme-main font-black">Close</button>
      </div>
    );
  }

  const choose = (i) => {
    if (picked !== null) return;
    playChime('pop');
    setPicked(i);
  };

  const hearAnswer = () => {
    if (!micSupported()) {
      notify('Mic not supported here — tap an answer instead 🎤');
      return;
    }
    if (listening) {
      stopMic.current && stopMic.current();
      setListening(false);
      return;
    }
    setListening(true);
    stopMic.current = listenOnce({
      onResult: (text) => {
        setListening(false);
        const hit = q.options.findIndex((o) => transcriptMatches(text, o));
        if (hit >= 0) {
          choose(hit);
          notify(`Heard you: "${text}" ✅`);
        } else {
          notify(`Heard: "${text}" — try again or tap! 🎤`);
        }
      },
      onError: () => {
        setListening(false);
        notify('Could not hear you — tap an answer instead 🎤');
      },
      onEnd: () => setListening(false),
    });
  };

  const next = () => {
    if (picked === null) {
      notify('Tap an answer first! (or say it 🎤)');
      return;
    }
    const ok = picked === q.correct;
    const newResults = [...results, ok];
    setResults(newResults);
    if (ok) playChime('success');
    else playChime('fail');
    setTimeout(() => {
      if (idx < questions.length - 1) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        onFinish(newResults.filter(Boolean).length, questions.length);
      }
    }, 650);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[62%] overflow-y-auto max-w-2xl mx-auto">
      <div className="sticky top-0 bg-white/95 backdrop-blur px-5 pt-3 pb-2 border-b border-slate-100">
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-2"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center">
            <i className="fa-solid fa-circle-question mr-1.5"></i> Story Quiz · {idx + 1} of {questions.length}
          </span>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {questions.map((_, i) => (
                <div key={i} className={`w-3 h-1 rounded-full ${i === idx ? 'bg-theme-main' : i < idx ? (results[i] ? 'bg-emerald-400' : 'bg-rose-400') : 'bg-slate-200'}`}></div>
              ))}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm p-1">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between space-x-2">
          <p className="font-display font-black text-slate-800 text-base flex-1">{q.q}</p>
          <div className="flex space-x-1.5 shrink-0">
            <button onClick={() => speakText(q.q)} className="w-8 h-8 rounded-full bg-theme-light text-theme-main flex items-center justify-center text-xs active:scale-90">
              <i className="fa-solid fa-volume-high"></i>
            </button>
            <button onClick={hearAnswer} title="Say your answer" className={`w-8 h-8 rounded-full flex items-center justify-center text-xs active:scale-90 transition ${listening ? 'bg-rose-500 text-white animate-pulse' : 'bg-theme-light text-theme-main'}`}>
              <i className="fa-solid fa-microphone"></i>
            </button>
          </div>
        </div>
        {listening && <p className="text-xs font-black text-rose-500 mt-1 animate-pulse">🎤 Listening… speak now!</p>}
        <div className="grid grid-cols-1 gap-2 mt-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => choose(i)}
              className={'w-full py-2.5 px-4 text-sm font-bold rounded-2xl border-2 text-left transition ' + (
                picked === null
                  ? 'bg-white border-slate-200 text-slate-700 hover:border-theme-main'
                  : i === q.correct
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                    : picked === i
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'bg-white border-slate-100 text-slate-400'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        <button onClick={next} className="mt-3 w-full py-3 bg-theme-main text-white font-display font-black text-sm rounded-2xl active:scale-95 transition">
          {idx < questions.length - 1 ? 'Next' : 'Finish'} →
        </button>
      </div>
    </div>
  );
}
