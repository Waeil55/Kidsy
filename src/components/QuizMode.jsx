import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Volume2, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Lightbulb 
} from 'lucide-react';
import { 
  speakText, 
  playPop, 
  playCorrect, 
  playIncorrect, 
  fireConfetti, 
  PRAISES 
} from '../utils/audio';

export default function QuizMode({
  items,
  onStreakUpdate,
  onOpenChat
}) {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hintShown, setHintShown] = useState(false);

  const loadQuestion = () => {
    playPop();
    if (!items || items.length === 0) return;
    const targetItem = items[Math.floor(Math.random() * items.length)];

    const otherWords = items
      .map(i => i.word)
      .filter(w => w.toLowerCase() !== targetItem.word.toLowerCase());
    
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
    
    const pickedOptions = [targetItem.word];
    for (let w of shuffledOthers) {
      if (pickedOptions.length >= 4) break;
      if (!pickedOptions.includes(w)) pickedOptions.push(w);
    }

    if (pickedOptions.length < 4 && targetItem.quizOptions) {
      for (let w of targetItem.quizOptions) {
        if (pickedOptions.length >= 4) break;
        if (!pickedOptions.includes(w)) pickedOptions.push(w);
      }
    }

    const finalOptions = [...pickedOptions].sort(() => 0.5 - Math.random());

    setQuestion(targetItem);
    setOptions(finalOptions);
    setSelectedOption(null);
    setHintShown(false);
  };

  useEffect(() => {
    loadQuestion();
  }, [items]);

  const handleSelectOption = (opt) => {
    if (selectedOption !== null || !question) return;
    setSelectedOption(opt);

    const isCorrect = opt.toLowerCase() === question.word.toLowerCase();
    onStreakUpdate(isCorrect);

    if (isCorrect) {
      playCorrect();
      fireConfetti(false);
      const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
      speakText(praise, 1.1, 1.25);
    } else {
      playIncorrect();
      speakText(`The answer is ${question.word}`, 1.0, 1.1);
    }
  };

  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="font-bold text-slate-400">Loading Quiz Question...</p>
      </div>
    );
  }

  return (
    <section className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto">
      
      {/* Top Category Bar */}
      <div className="flex justify-between items-center px-1 shrink-0 mb-1">
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase flex items-center gap-1">
          <Target className="w-3 h-3 text-emerald-600" />
          <span>{question.category}</span>
        </span>
        <button
          onClick={() => speakText(question.definition)}
          className="text-emerald-700 text-[11px] font-extrabold flex items-center gap-1 btn-press"
        >
          <Volume2 className="w-3 h-3" />
          <span>Hear Question</span>
        </button>
      </div>

      {/* Main Question Box with Picture */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-white rounded-3xl p-3 sm:p-4 border-2 border-emerald-200/90 shadow-lg relative overflow-hidden my-1">
        
        {/* Photo Preview if available */}
        {question.imageUrl && (
          <div className="w-full h-20 sm:h-28 rounded-2xl overflow-hidden mb-2 border border-slate-100 shadow-xs shrink-0">
            <img 
              src={question.imageUrl} 
              alt={question.word} 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <div className="text-center my-auto">
          <p className="text-sm sm:text-lg text-slate-800 font-extrabold leading-relaxed">
            "{question.definition}"
          </p>
        </div>
      </div>

      {/* 4 Multi-Choice Option Buttons in 2x2 Grid (Super Colorful!) */}
      <div className="grid grid-cols-2 gap-2 shrink-0 my-1">
        {options.map((opt, idx) => {
          const isChosen = selectedOption === opt;
          const isTarget = opt.toLowerCase() === question.word.toLowerCase();
          
          let btnClass = "bg-white border-2 border-slate-200 text-slate-800 hover:border-emerald-400 hover:bg-emerald-50/50 shadow-xs";

          if (selectedOption !== null) {
            if (isTarget) {
              btnClass = "bg-emerald-500 border-emerald-600 text-white shadow-md scale-[1.02] pop";
            } else if (isChosen && !isTarget) {
              btnClass = "bg-rose-500 border-rose-600 text-white shadow-inner shake";
            } else {
              btnClass = "bg-slate-100 border-slate-200 text-slate-400 opacity-40";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              disabled={selectedOption !== null}
              className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black capitalize transition-all flex items-center justify-center btn-press ${btnClass}`}
            >
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Next Question Button (Pinned when answered) */}
      {selectedOption !== null && (
        <div className="shrink-0 my-1 pop">
          <button
            onClick={loadQuestion}
            className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-1.5 btn-press"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hint Accordion */}
      {hintShown && (
        <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shadow-xs pop shrink-0 flex items-start gap-1 my-0.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="line-clamp-2"><strong className="font-black">Hint:</strong> {question.hint || `Starts with "${question.word[0].toUpperCase()}"!`}</p>
        </div>
      )}

      {/* Bottom Dock: Hint & Tutor Buttons (Pinned, Never Missed!) */}
      <div className="flex items-center justify-between shrink-0 pt-1.5 border-t border-slate-200/80 mt-1">
        <button
          onClick={() => { playPop(); setHintShown(!hintShown); }}
          className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-black border border-amber-300 btn-press"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          <span>{hintShown ? "Hide Hint" : "Hint"}</span>
        </button>

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
