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
  const [status, setStatus] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const loadQuestion = () => {
    playPop();
    if (!items || items.length === 0) return;
    const target = items[Math.floor(Math.random() * items.length)];
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
      setFeedbackMsg("Super Solver! 🌟");
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
      }, 1000);
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
      <div className="flex-1 flex items-center justify-center p-4">
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
    <section className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto">
      
      {/* Top Clue & Audio Row */}
      <div className="flex justify-between items-center px-1 shrink-0 mb-1">
        <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[10px] font-black uppercase">
          {question.category}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => { playPop(); speakText(question.word); }}
            className="px-2 py-0.5 rounded-full bg-tealsoft-600 text-white font-extrabold text-[10px] flex items-center gap-1 btn-press"
          >
            <Volume2 className="w-3 h-3" />
            <span>Hear</span>
          </button>
          <button
            onClick={() => { playPop(); speakText(question.definition); }}
            className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[10px] flex items-center gap-1 btn-press"
          >
            <BookOpen className="w-3 h-3 text-rosebloom-500" />
            <span>Meaning</span>
          </button>
        </div>
      </div>

      {/* Clue Prompt & Meaning Summary */}
      <div className="px-3 py-1.5 rounded-2xl bg-white border border-rosebloom-200 text-center shrink-0 my-0.5 shadow-xs">
        <p className="text-xs text-slate-700 font-bold line-clamp-2">
          "{question.definition}"
        </p>
      </div>

      {/* Letter Boxes Container */}
      <div className="flex flex-col items-center justify-center my-auto py-1 shrink-0">
        <div className="flex flex-wrap justify-center gap-1.5 px-1 max-w-full">
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
              <div 
                key={idx} 
                className={`letter-box w-9 h-11 sm:w-10 sm:h-12 text-lg sm:text-xl rounded-xl ${boxClass}`}
              >
                {char}
              </div>
            );
          })}
        </div>

        {/* Feedback Banner */}
        {feedbackMsg && (
          <div className={`mt-1.5 px-3 py-0.5 rounded-full text-[11px] font-black pop inline-flex items-center gap-1 ${
            status === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {status === 'correct' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-600" />}
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Next Question Button if correct */}
      {(status === 'correct' || status === 'revealed') && (
        <div className="shrink-0 my-1 pop">
          <button
            onClick={loadQuestion}
            className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 btn-press"
          >
            <span>Next Word</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Compact Virtual Keyboard (Pinned, Never Missed!) */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0 mt-auto">
        <div className="flex flex-col gap-1 items-center">
          {keyboardRows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-1 w-full">
              {row.split('').map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyPress(k)}
                  disabled={status === 'correct' || status === 'revealed'}
                  className="flex-1 max-w-[34px] sm:max-w-[40px] h-9 sm:h-10 bg-white border border-slate-200 rounded-lg text-slate-800 font-black text-xs sm:text-sm hover:bg-pink-50 hover:border-pink-300 active:scale-95 transition-all flex items-center justify-center btn-press shadow-xs disabled:opacity-40"
                >
                  {k}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls: Backspace, Reveal, Ask Tutor (Pinned, Never Missed!) */}
      <div className="flex items-center justify-between shrink-0 pt-1.5 border-t border-slate-200/80 mt-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleBackspace}
            disabled={inputChars.length === 0 || status !== null}
            className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold btn-press disabled:opacity-30"
            title="Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>

          <button
            onClick={handleReveal}
            disabled={status !== null}
            className="px-2.5 py-1.5 bg-white border border-rosebloom-200 text-rosebloom-700 rounded-xl font-extrabold text-[11px] hover:bg-rosebloom-50 btn-press disabled:opacity-30"
          >
            Reveal
          </button>
        </div>

        <button
          onClick={() => { playPop(); onOpenChat(); }}
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 text-white rounded-xl text-xs font-black shadow-xs btn-press"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Ask Tutor</span>
        </button>
      </div>

    </section>
  );
}
