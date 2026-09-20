import React, { useMemo, useState } from 'react';
import { OFFLINE_DICTIONARY, speakWord, stripQuotes } from '../data/ewaData.js';

function allWords() {
  return Object.keys(OFFLINE_DICTIONARY).map((k) => ({ word: k, ...OFFLINE_DICTIONARY[k] }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Flashcards({ saved, onMarkEasy }) {
  const list = saved.length > 0 ? saved : allWords();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const safeIdx = list.length === 0 ? 0 : idx % list.length;
  const item = list[safeIdx];

  if (list.length === 0) {
    return (
      <div className="flex-1 p-5 flex flex-col items-center justify-center">
        <p className="font-black text-slate-500">No words yet!</p>
        <p className="text-xs text-slate-400">Tap words while reading</p>
      </div>
    );
  }

  const flip = () => {
    if (!flipped) speakWord(item.word);
    setFlipped(!flipped);
  };

  return (
    <div className="flex-1 p-5 flex flex-col items-center justify-center">
      <div onClick={flip} className="w-full max-w-[310px] min-h-[350px] bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col p-5 text-center cursor-pointer relative justify-between transition-transform duration-300 hover:scale-[1.01]">
        <div className="flex justify-between items-center text-slate-400 text-xs">
          <span>Card {safeIdx + 1} of {list.length}</span>
          <button
            onClick={(e) => { e.stopPropagation(); speakWord(item.word); }}
            className="text-ewa-blue hover:text-sky-600 p-1"
          >
            <i className="fa-solid fa-volume-high text-sm"></i>
          </button>
        </div>
        <div className="my-auto py-2">
          <h2 className="font-sans font-black text-3xl text-slate-800 mb-1">{item.word}</h2>
          <p className="text-xs text-slate-400 mb-3 font-mono">{item.ipa || `|${item.word}|`}</p>
          {flipped && (
            <div className="text-left space-y-2">
              <div className="bg-sky-50 rounded-xl p-2.5 border border-sky-100">
                <span className="text-[10px] font-black uppercase text-ewa-darkBlue block">Meaning:</span>
                <div className="text-xs font-semibold text-slate-700 mt-0.5">{item.meaning || 'Tap to learn meaning'}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-500 block">Sentence:</span>
                <div className="text-xs italic text-slate-600 mt-0.5">{item.sentence ? `"${stripQuotes(item.sentence)}"` : ''}</div>
              </div>
            </div>
          )}
          {!flipped && (
            <p className="text-[11px] text-slate-400 mt-4 flex items-center justify-center">
              <i className="fa-solid fa-hand-pointer mr-1.5 text-ewa-blue"></i> Tap card to flip
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={(e) => { e.stopPropagation(); setFlipped(false); setIdx(safeIdx + 1); }}
            className="py-2 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs hover:bg-amber-100 transition"
          >
            Need Practice
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkEasy(item);
              setFlipped(false);
              setIdx(safeIdx + 1);
            }}
            className="py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition"
          >
            I Know It!
          </button>
        </div>
      </div>
    </div>
  );
}

function WordQuiz({ saved }) {
  const pool = saved.length > 0 ? saved : allWords();
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [picked, setPicked] = useState(null);

  const current = pool[idx % Math.max(1, pool.length)];
  const choices = useMemo(() => {
    if (!current) return [];
    const others = shuffle(Object.keys(OFFLINE_DICTIONARY).filter((w) => w !== current.word)).slice(0, 2);
    return shuffle([current.word, ...others]);
  }, [current && current.word, idx, pool.length]);

  if (!current) return null;

  const pick = (ch) => {
    setPicked(ch);
    if (ch === current.word) {
      setFeedback({ ok: true, text: '★ Excellent! That is the right word!' });
      speakWord(current.word);
    } else {
      setFeedback({ ok: false, text: `Not quite! The word was "${current.word}".` });
    }
  };

  const next = () => {
    setIdx(idx + 1);
    setFeedback(null);
    setPicked(null);
  };

  return (
    <div className="flex-1 p-5 flex flex-col items-center justify-center">
      <div className="w-full max-w-[310px] bg-white rounded-3xl shadow-xl border border-slate-200 p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span className="font-bold text-ewa-blue"><i className="fa-solid fa-star text-amber-400 mr-1"></i> Challenge</span>
            <span>{(idx % pool.length) + 1} of {pool.length}</span>
          </div>
          <p className="text-sm font-bold text-slate-800 mb-4 text-center">
            {current.meaning ? `Which word means: "${current.meaning}"?` : `Which word is: "${current.word}"?`}
          </p>
          <div className="space-y-2 mb-3">
            {choices.map((ch) => (
              <button
                key={ch}
                onClick={() => pick(ch)}
                className={`w-full py-2.5 px-4 border font-bold text-xs rounded-xl transition text-left flex items-center justify-between ${
                  picked === ch
                    ? ch === current.word
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-slate-50 hover:bg-sky-50 border-slate-200 text-slate-800'
                }`}
              >
                <span>{ch}</span>
                <i className="fa-solid fa-arrow-right text-[10px] text-slate-300"></i>
              </button>
            ))}
          </div>
        </div>
        {feedback && (
          <div className={`text-xs font-bold text-center py-1 ${feedback.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
            {feedback.text}
          </div>
        )}
        <button onClick={next} className="mt-2 py-2 bg-ewa-blue text-white font-bold text-xs rounded-xl hover:bg-ewa-darkBlue transition">
          Next Question
        </button>
      </div>
    </div>
  );
}

function VocabList({ saved, onSpeak, onRemove }) {
  if (saved.length === 0) {
    return (
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-center py-12 text-slate-400 text-xs">
          <i className="fa-solid fa-bookmark text-2xl mb-2 text-slate-300"></i>
          <p>You haven&apos;t saved any words yet.</p>
          <p className="mt-1 font-semibold text-ewa-blue">Tap any word in the story to add it!</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-2">
      {saved.map((item, idx) => (
        <div key={item.word + idx} className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => onSpeak(item.word)} className="w-8 h-8 rounded-full bg-sky-50 text-ewa-blue hover:bg-sky-100 flex items-center justify-center text-xs">
              <i className="fa-solid fa-volume-high"></i>
            </button>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-slate-800 text-sm">{item.word}</span>
                <span className="text-[11px] text-slate-400 font-mono">{item.ipa}</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1">{item.meaning || item.sentence || ''}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${item.status === 'learned' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>
              {item.status}
            </span>
            <button onClick={() => onRemove(idx)} className="text-slate-300 hover:text-rose-500 p-1 text-xs">
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const TAB_ON = 'pb-2.5 font-bold text-xs border-b-2 border-ewa-blue text-ewa-darkBlue';
const TAB_OFF = 'pb-2.5 font-bold text-xs border-b-2 border-transparent text-slate-400 hover:text-slate-600';

export default function VocabDeck({ open, onClose, saved, onMarkEasy, onRemove }) {
  const [tab, setTab] = useState('study');
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col justify-end">
      <div className="bg-[#fafafa] rounded-t-3xl h-[88%] flex flex-col overflow-hidden shadow-2xl">
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-ewa-blue/10 text-ewa-blue flex items-center justify-center text-sm font-black">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">Vocabulary Deck</h3>
              <p className="text-xs text-slate-400">Review meanings and sentences</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="flex px-4 pt-3 bg-white border-b border-slate-200 space-x-4">
          <button onClick={() => setTab('study')} className={tab === 'study' ? TAB_ON : TAB_OFF}>
            Flashcards (<span>{saved.length}</span>)
          </button>
          <button onClick={() => setTab('quiz')} className={tab === 'quiz' ? TAB_ON : TAB_OFF}>
            Word Quiz
          </button>
          <button onClick={() => setTab('list')} className={tab === 'list' ? TAB_ON : TAB_OFF}>
            Word Bank
          </button>
        </div>
        {tab === 'study' && <Flashcards saved={saved} onMarkEasy={onMarkEasy} />}
        {tab === 'quiz' && <WordQuiz saved={saved} />}
        {tab === 'list' && <VocabList saved={saved} onSpeak={speakWord} onRemove={onRemove} />}
      </div>
    </div>
  );
}
