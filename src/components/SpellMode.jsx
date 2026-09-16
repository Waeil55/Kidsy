import React, { useState, useEffect } from 'react';
import { 
  Keyboard, 
  Volume2, 
  BookOpen, 
  Delete, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight 
} from 'lucide-react';
import { 
  speakText, 
  playPop, 
  playCorrect, 
  playIncorrect, 
  fireConfetti, 
  PRAISES 
} from '../utils/audio';

export default function SpellMode({
  items,
  onStreakUpdate,
  onOpenChat
}) {
  const [question, setQuestion] = useState(null);
  const [inputChars, setInputChars] = useState([]);
  const [status, setStatus] = useState(null); // 'correct' | 'incorrect' | 'revealed' | null
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const loadQuestion = () => {
    playPop();
    if (!items || items.length === 0) return;
    const target = items[Math.floor(Math.random() * items.length)];
    // Clean word for spelling (alphanumeric only)
    const cleanedTargetWord = target.word.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    setQuestion({
      ...target,
      cleanWord: cleanedTargetWord
    });
    setInputChars([]);
    setStatus(null);
    setFeedbackMsg("");
    speakText(target.displayTitle || target.word);
  };

  useEffect(() => {
    loadQuestion();
  }, [items]);

  const handleKeyPress = (char) => {
    playPop();
    if (status || !question || inputChars.length >= question.cleanWord.length) return;
    
    const nextChars = [...inputChars, char.toLowerCase()];
    setInputChars(nextChars);

    if (nextChars.length === question.cleanWord.length) {
      checkWord(nextChars.join(''));
    }
  };

  const handleBackspace = () => {
    playPop();
    if (status || inputChars.length === 0) return;
    setInputChars(inputChars.slice(0, -1));
  };

  const checkWord = (enteredWord) => {
    if (!question) return;
    if (enteredWord.toLowerCase() === question.cleanWord.toLowerCase()) {
      setStatus('correct');
      setFeedbackMsg("Genius Speller & Solver! 🌟");
      onStreakUpdate(true);
      playCorrect();
      fireConfetti(false);
      const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
      speakText(praise, 1.1, 1.25);
    } else {
      onStreakUpdate(false);
      playIncorrect();
      setStatus('incorrect');
      setFeedbackMsg("Not quite! Try again.");
      setTimeout(() => {
        setStatus(null);
        setInputChars([]);
        setFeedbackMsg("");
      }, 1200);
    }
  };

  const handleReveal = () => {
    playPop();
    if (!question || status) return;
    setStatus('revealed');
    setFeedbackMsg(`Answer: ${question.word}`);
    onStreakUpdate(false);
    speakText(`The answer is spelled ${question.word}`);
  };

  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="font-bold text-slate-400">Loading spelling challenge...</p>
      </div>
    );
  }

  const targetChars = question.cleanWord.split('');
  const hasNumbers = /\d/.test(question.cleanWord);

  const keyboardRows = [
    hasNumbers ? "1234567890" : null,
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
  ].filter(Boolean);

  return (
    <section className="flex-1 flex flex-col fade-in w-full max-w-xl mx-auto py-2">
      
      {/* Subject & Instructions Header */}
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rosebloom-700 bg-rosebloom-50 px-3 py-1 rounded-full border border-rosebloom-200">
          <Keyboard className="w-3.5 h-3.5" />
          <span>Spell & Solve</span>
        </div>
        <span className="text-xs font-bold text-slate-400">{question.category}</span>
      </div>

      {/* Target Word Clue & Audio Buttons */}
      <div className="bg-white rounded-3xl p-5 border border-rosebloom-100 shadow-sm flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => { playPop(); speakText(question.word); }}
          className="px-5 py-2.5 rounded-2xl bg-tealsoft-600 hover:bg-tealsoft-500 text-white font-extrabold text-xs shadow-md shadow-tealsoft-600/20 flex items-center gap-2 btn-press transition-all"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen</span>
        </button>

        <button
          onClick={() => { playPop(); speakText(question.definition); }}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1.5 btn-press transition-all"
        >
          <BookOpen className="w-4 h-4 text-rosebloom-500" />
          <span>Meaning</span>
        </button>
      </div>

      {/* Letter Boxes Container */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[110px] my-2">
        <div className="flex flex-wrap justify-center gap-2 px-2 max-w-full">
          {targetChars.map((targetChar, idx) => {
            let char = inputChars[idx] || '';
            let boxClass = '';

            if (status === 'correct') {
              boxClass = 'correct';
              char = targetChar;
            } else if (status === 'revealed') {
              boxClass = 'revealed';
              char = targetChar;
            } else if (status === 'incorrect') {
              boxClass = 'filled shake border-rose-500 text-rose-600';
            } else if (char) {
              boxClass = 'filled';
            }

            return (
              <div key={idx} className={`letter-box ${boxClass}`}>
                {char}
              </div>
            );
          })}
        </div>

        {/* Feedback Banner */}
        {feedbackMsg && (
          <div className={`mt-3 px-4 py-1.5 rounded-full text-xs font-black pop inline-flex items-center gap-1.5 ${
            status === 'correct' 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
              : (status === 'revealed' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-rose-100 text-rose-800 border border-rose-300')
          }`}>
            {status === 'correct' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {status === 'incorrect' && <XCircle className="w-4 h-4 text-rose-600" />}
            {status === 'revealed' && <HelpCircle className="w-4 h-4 text-amber-600" />}
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Next Question button if finished */}
      {(status === 'correct' || status === 'revealed') && (
        <div className="my-2 pop">
          <button
            onClick={loadQuestion}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-lg flex items-center justify-center gap-2 btn-press"
          >
            <span>Next Word</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Virtual Keyboard */}
      <div className="bg-slate-100/90 p-2 sm:p-3 rounded-3xl border border-slate-200/90 shadow-inner mt-auto">
        <div className="flex flex-col gap-1.5 items-center">
          {keyboardRows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-1 sm:gap-1.5 w-full">
              {row.split('').map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyPress(k)}
                  disabled={status === 'correct' || status === 'revealed'}
                  className="flex-1 max-w-[38px] sm:max-w-[44px] h-11 sm:h-12 bg-white border border-slate-200 rounded-xl text-slate-800 font-extrabold text-base hover:bg-rosebloom-50 hover:border-rosebloom-300 hover:text-rosebloom-600 active:scale-95 shadow-xs transition-all flex items-center justify-center btn-press disabled:opacity-40"
                >
                  {k}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions: Backspace, Reveal, Ask Tutor */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackspace}
            disabled={inputChars.length === 0 || status !== null}
            className="p-3 bg-slate-200/80 hover:bg-slate-300 text-slate-700 rounded-xl font-bold btn-press disabled:opacity-30 transition-colors"
            title="Backspace"
          >
            <Delete className="w-5 h-5" />
          </button>

          <button
            onClick={handleReveal}
            disabled={status !== null}
            className="px-3.5 py-2.5 bg-white border border-rosebloom-200 text-rosebloom-700 rounded-xl font-extrabold text-xs hover:bg-rosebloom-50 btn-press disabled:opacity-40 transition-colors"
          >
            Give Up
          </button>
        </div>

        <button
          onClick={() => { playPop(); onOpenChat(); }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 text-white rounded-xl text-xs font-extrabold shadow-sm btn-press"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Tutor</span>
        </button>
      </div>

    </section>
  );
}
