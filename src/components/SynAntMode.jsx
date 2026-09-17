import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Volume2, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Lightbulb,
  RotateCcw
} from 'lucide-react';
import { 
  speakText, 
  playPop, 
  playCorrect, 
  playIncorrect, 
  fireConfetti, 
  PRAISES 
} from '../utils/audio';

export default function SynAntMode({
  items,
  onStreakUpdate,
  onOpenChat
}) {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  // Filter items that have synonyms or antonyms defined
  const eligibleItems = items.filter(item => 
    (item.synonyms && item.synonyms.length > 0) || 
    (item.antonyms && item.antonyms.length > 0)
  );

  const activePool = eligibleItems.length > 0 ? eligibleItems : items;

  const loadQuestion = () => {
    playPop();
    if (!activePool || activePool.length === 0) return;

    // Pick random target word from pool
    const targetItem = activePool[Math.floor(Math.random() * activePool.length)];

    // Decide if this question is for Synonym or Antonym
    const hasSyn = targetItem.synonyms && targetItem.synonyms.length > 0;
    const hasAnt = targetItem.antonyms && targetItem.antonyms.length > 0;

    let testType = 'synonym';
    if (hasSyn && hasAnt) {
      testType = Math.random() > 0.5 ? 'synonym' : 'antonym';
    } else if (hasAnt) {
      testType = 'antonym';
    }

    const isSyn = testType === 'synonym';
    const correctAnswerList = isSyn ? (targetItem.synonyms || []) : (targetItem.antonyms || []);
    const correctAnswer = correctAnswerList.length > 0 
      ? correctAnswerList[Math.floor(Math.random() * correctAnswerList.length)]
      : (isSyn ? targetItem.word : "different");

    // Gather distractors: opposite list, other deck words, other synonyms/antonyms
    const distractors = new Set();

    // The counterpart list (e.g. antonyms if testing synonyms) makes GREAT challenging distractors!
    const oppositeList = isSyn ? (targetItem.antonyms || []) : (targetItem.synonyms || []);
    oppositeList.forEach(w => distractors.add(w));

    // Also add other words from this deck or other items' syn/ant
    items.forEach(other => {
      if (other.word !== targetItem.word) {
        if (other.synonyms) other.synonyms.forEach(s => distractors.add(s));
        if (other.antonyms) other.antonyms.forEach(a => distractors.add(a));
        distractors.add(other.word);
      }
    });

    // Remove the correct answer and target word from distractors
    distractors.delete(correctAnswer);
    distractors.delete(targetItem.word);

    // Shuffle and pick 3 distractors
    const shuffledDistractors = Array.from(distractors).sort(() => 0.5 - Math.random());
    const finalOptions = [correctAnswer];
    for (let d of shuffledDistractors) {
      if (finalOptions.length >= 4) break;
      finalOptions.push(d);
    }

    // Fallback if not enough distractors
    const fallbacks = ["agree", "disagree", "start", "finish", "kind", "mean", "stack", "pile", "unlike", "alike"];
    for (let f of fallbacks) {
      if (finalOptions.length >= 4) break;
      if (!finalOptions.includes(f) && f !== correctAnswer) {
        finalOptions.push(f);
      }
    }

    const randomizedOptions = finalOptions.sort(() => 0.5 - Math.random());

    setQuestion({
      targetItem,
      testType,
      correctAnswer,
      title: isSyn ? "Find the SYNONYM (Same Meaning)" : "Find the ANTONYM (Opposite Meaning)",
      promptText: isSyn 
        ? `Which word means the SAME as "${targetItem.displayTitle || targetItem.word}"?`
        : `Which word is the OPPOSITE of "${targetItem.displayTitle || targetItem.word}"?`
    });
    setOptions(randomizedOptions);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setHintShown(false);
  };

  useEffect(() => {
    loadQuestion();
  }, [items]);

  const handleSelect = (opt) => {
    if (isAnswered || !question) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const win = opt.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    setIsCorrect(win);
    onStreakUpdate(win);

    if (win) {
      playCorrect();
      fireConfetti(false);
      const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
      speakText(praise, 1.1, 1.25);
    } else {
      playIncorrect();
      const typeLabel = question.testType === 'synonym' ? 'synonym' : 'opposite';
      speakText(`The correct ${typeLabel} is ${question.correctAnswer}`, 1.0, 1.1);
    }
  };

  const handleReadPrompt = () => {
    if (!question) return;
    playPop();
    speakText(question.promptText);
  };

  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="font-bold text-slate-400">Loading Exam Question...</p>
      </div>
    );
  }

  const isSynonym = question.testType === 'synonym';

  return (
    <section className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto">
      
      {/* Top Banner: Mode Indicator */}
      <div className="flex justify-between items-center px-1 shrink-0 mb-1">
        <div className="flex items-center gap-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-xs ${
            isSynonym 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
              : 'bg-purple-100 text-purple-800 border border-purple-200'
          }`}>
            <ArrowLeftRight className="w-3 h-3" />
            <span>{isSynonym ? '⭐ SYNONYM EXAM' : '⚡ ANTONYM EXAM'}</span>
          </span>
          {question.targetItem.partOfSpeech && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase">
              {question.targetItem.partOfSpeech}
            </span>
          )}
        </div>

        <button
          onClick={() => { playPop(); setHintShown(!hintShown); }}
          className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full btn-press shadow-xs"
        >
          <Lightbulb className="w-3 h-3 text-amber-500" />
          <span>{hintShown ? 'Hide Hint' : 'Hint'}</span>
        </button>
      </div>

      {/* Target Word Card Banner */}
      <div className={`w-full rounded-3xl p-3 sm:p-4 border-2 shadow-md relative overflow-hidden shrink-0 my-1 ${
        isSynonym 
          ? 'bg-gradient-to-br from-emerald-500/10 via-white to-tealsoft-100/30 border-emerald-200' 
          : 'bg-gradient-to-br from-purple-500/10 via-white to-rosebloom-100/30 border-purple-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">{question.targetItem.image || "🎯"}</span>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider block ${
                isSynonym ? 'text-emerald-700' : 'text-purple-700'
              }`}>
                {isSynonym ? 'Find Matching Word (Same)' : 'Find Opposite Word (Contrast)'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight capitalize">
                {question.targetItem.displayTitle || question.targetItem.word}
              </h2>
            </div>
          </div>

          <button
            onClick={handleReadPrompt}
            className="p-2 sm:p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-xs btn-press shrink-0"
            title="Listen to question"
          >
            <Volume2 className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        {/* Question Text */}
        <p className="text-xs sm:text-sm text-slate-700 font-bold mt-2 leading-relaxed bg-white/70 p-2 rounded-xl border border-slate-100">
          {question.promptText}
        </p>

        {/* Hint Pill */}
        {hintShown && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-1.5 pop">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p><strong>Definition:</strong> "{question.targetItem.definition}"</p>
              {question.targetItem.teacherSentence && (
                <p className="mt-0.5 text-slate-600 italic">"{question.targetItem.teacherSentence}"</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4 Interactive Option Buttons (2x2 Grid, Always Fits) */}
      <div className="grid grid-cols-2 gap-2 my-auto shrink-0">
        {options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const isThisCorrect = opt.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

          let btnClass = "bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 shadow-sm";
          if (isAnswered) {
            if (isThisCorrect) {
              btnClass = "bg-emerald-500 border-2 border-emerald-600 text-white shadow-emerald-500/30 scale-[1.02]";
            } else if (isSelected && !isThisCorrect) {
              btnClass = "bg-rose-500 border-2 border-rose-600 text-white shadow-rose-500/30 shake";
            } else {
              btnClass = "bg-slate-100/70 border-slate-200 text-slate-400 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              disabled={isAnswered}
              className={`min-h-[54px] sm:min-h-[64px] p-2.5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-between transition-all btn-press ${btnClass}`}
            >
              <span className="truncate pr-1 capitalize">{opt}</span>
              {isAnswered && isThisCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
              {isAnswered && isSelected && !isThisCorrect && <XCircle className="w-5 h-5 text-white shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback Alert Banner */}
      {isAnswered && (
        <div className={`py-2 px-3.5 rounded-2xl flex items-center justify-between border shadow-sm pop shrink-0 my-1 ${
          isCorrect ? 'bg-emerald-50 text-emerald-950 border-emerald-300' : 'bg-rose-50 text-rose-950 border-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            <div>
              <h4 className="text-xs sm:text-sm font-black">
                {isCorrect ? 'Outstanding! You nailed it!' : `Answer: "${question.correctAnswer}"`}
              </h4>
              <p className="text-[11px] opacity-80">
                {isSynonym 
                  ? `"${question.correctAnswer}" and "${question.targetItem.word}" share the same meaning!`
                  : `"${question.correctAnswer}" is the direct opposite of "${question.targetItem.word}".`
                }
              </p>
            </div>
          </div>

          <button
            onClick={loadQuestion}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center gap-1 shadow-xs btn-press shrink-0"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bottom Pinned Controls (Never Missed!) */}
      <div className="flex items-center justify-between shrink-0 pt-1.5 border-t border-slate-200/80 mt-1">
        <button
          onClick={loadQuestion}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 shadow-xs btn-press"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>New Question</span>
        </button>

        <button
          onClick={() => { playPop(); onOpenChat(); }}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 text-white font-black text-xs shadow-md flex items-center gap-1.5 btn-press"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Ask AI Tutor</span>
        </button>
      </div>

    </section>
  );
}
