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

    // Generate 4 distinct options from current deck if possible
    const otherWords = items
      .map(i => i.word)
      .filter(w => w.toLowerCase() !== targetItem.word.toLowerCase());
    
    // Shuffle other words
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
    
    const pickedOptions = [targetItem.word];
    for (let w of shuffledOthers) {
      if (pickedOptions.length >= 4) break;
      if (!pickedOptions.includes(w)) pickedOptions.push(w);
    }

    // If deck has fewer than 4 items, fall back to target's pre-configured quizOptions
    if (pickedOptions.length < 4 && targetItem.quizOptions) {
      for (let w of targetItem.quizOptions) {
        if (pickedOptions.length >= 4) break;
        if (!pickedOptions.includes(w)) pickedOptions.push(w);
      }
    }

    // Final shuffle of options
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
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="font-bold text-slate-400">Loading Quiz Question...</p>
      </div>
    );
  }

  return (
    <section className="flex-1 flex flex-col fade-in w-full max-w-xl mx-auto py-2">
      
      {/* Subject & Category Pill */}
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Target className="w-3.5 h-3.5" />
          <span>Match the Concept</span>
        </div>
        <span className="text-xs font-bold text-slate-400">{question.category}</span>
      </div>

      {/* Question Prompt Card */}
      <div className="flex-1 flex flex-col justify-center min-h-[190px]">
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-tealsoft-200/80 shadow-xl shadow-slate-900/5 text-center relative overflow-hidden pop">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-tealsoft-500 to-emerald-500 rounded-b-full" />
          
          <span className="text-3xl mb-2 inline-block">{question.image || "🎯"}</span>
          
          <p className="text-lg sm:text-2xl text-slate-800 font-extrabold leading-relaxed mb-3">
            "{question.definition}"
          </p>

          <button
            onClick={() => speakText(question.definition)}
            className="text-xs font-bold text-tealsoft-700 hover:text-tealsoft-800 bg-tealsoft-50 hover:bg-tealsoft-100 px-3 py-1 rounded-full border border-tealsoft-200 inline-flex items-center gap-1.5 btn-press transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Hear Definition</span>
          </button>
        </div>
      </div>

      {/* 4 Multi-Choice Option Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {options.map((opt, idx) => {
          const isChosen = selectedOption === opt;
          const isTarget = opt.toLowerCase() === question.word.toLowerCase();
          
          let btnClass = "bg-white border-2 border-slate-200 text-slate-800 hover:border-tealsoft-400 hover:bg-tealsoft-50/50 shadow-xs";

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
              className={`p-4 rounded-2xl text-base sm:text-lg font-black capitalize transition-all flex items-center justify-center btn-press ${btnClass}`}
            >
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Next Question Button once answered */}
      {selectedOption !== null && (
        <div className="mt-4 pop">
          <button
            onClick={loadQuestion}
            className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2 btn-press"
          >
            <span>Next Question</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Hint Accordion */}
      {hintShown && (
        <div className="mt-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm shadow-xs pop flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-black text-amber-800 mb-0.5">Hint:</strong>
            <p className="leading-snug">{question.hint || `The word begins with "${question.word[0].toUpperCase()}"!`}</p>
          </div>
        </div>
      )}

      {/* Footer Tools */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
        <button
          onClick={() => { playPop(); setHintShown(!hintShown); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-100/80 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-extrabold border border-amber-300 btn-press transition-colors"
        >
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>{hintShown ? "Hide Hint" : "Need a Hint?"}</span>
        </button>

        <button
          onClick={() => { playPop(); onOpenChat(); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 text-white rounded-xl text-xs font-extrabold shadow-sm btn-press"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Tutor</span>
        </button>
      </div>

    </section>
  );
}
