import React, { useState, useEffect } from 'react';
import { 
  Puzzle, 
  RotateCcw, 
  Check, 
  Volume2, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles 
} from 'lucide-react';
import { 
  playPop, 
  playCorrect, 
  playIncorrect, 
  speakText, 
  fireConfetti, 
  PRAISES 
} from '../utils/audio';

export default function SyntaxBuilder({
  items = [],
  onScoreUpdate,
  onOpenChat
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [assembledTokens, setAssembledTokens] = useState([]);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentItem = items.length > 0 ? items[currentIndex % items.length] : {
    word: "oppose",
    teacherSentence: "Dad will oppose mom's idea to go to the beach.",
    sentences: ["Dad will oppose mom's idea to go to the beach."]
  };

  // Extract a clean sentence to scramble
  const rawSentence = currentItem.teacherSentence || 
    (currentItem.sentences && currentItem.sentences[0] 
      ? currentItem.sentences[0].replace('_________', currentItem.word) 
      : `We will definitely ${currentItem.word} this plan.`);

  const cleanWords = rawSentence
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  // Take first 4-6 words for kid-friendly assembly
  const targetWords = cleanWords.slice(0, Math.min(cleanWords.length, 6));

  const loadExercise = () => {
    playPop();
    const shuffled = [...targetWords].map((word, idx) => ({ id: `${idx}-${word}`, word })).sort(() => 0.5 - Math.random());
    setAvailableTokens(shuffled);
    setAssembledTokens([]);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    loadExercise();
  }, [currentIndex, items]);

  const handlePickToken = (tokenObj) => {
    if (isAnswered) return;
    playPop();
    setAvailableTokens(availableTokens.filter(t => t.id !== tokenObj.id));
    setAssembledTokens([...assembledTokens, tokenObj]);
  };

  const handleRemoveToken = (tokenObj) => {
    if (isAnswered) return;
    playPop();
    setAssembledTokens(assembledTokens.filter(t => t.id !== tokenObj.id));
    setAvailableTokens([...availableTokens, tokenObj]);
  };

  const handleValidate = () => {
    if (assembledTokens.length === 0) return;
    const userString = assembledTokens.map(t => t.word.toLowerCase()).join(' ');
    const targetString = targetWords.map(w => w.toLowerCase()).join(' ');

    const win = userString === targetString;
    setIsAnswered(true);
    setIsCorrect(win);

    if (win) {
      playCorrect();
      fireConfetti(false);
      onScoreUpdate(10, 'Sentence Syntax Validated! +10 Points');
      const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
      speakText(praise, 1.1, 1.25);
    } else {
      playIncorrect();
      onScoreUpdate(-1, 'Syntax Order Missed! Deducted 1 point (-1)');
      speakText(`The correct order is: ${targetWords.join(' ')}`, 1.0, 1.1);
    }
  };

  const handleHearSentence = () => {
    playPop();
    speakText(targetWords.join(' '));
  };

  return (
    <section className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto">
      
      {/* Header Info */}
      <div className="flex justify-between items-center px-1 shrink-0 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-fredoka font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-lg border border-purple-200 dark:border-purple-800 flex items-center gap-1">
            <Puzzle className="w-3 h-3" />
            <span>Syntax Builder (Word Order)</span>
          </span>
          <span className="text-[10px] font-fredoka text-slate-400">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        <button
          onClick={handleHearSentence}
          className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 btn-press"
          title="Hear Complete Sentence"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Workspace Card */}
      <div className="flex-1 min-h-[330px] bg-white dark:bg-kid-nightCard rounded-3xl p-3 sm:p-4 shadow-squish-card border-2 border-slate-100 dark:border-kid-nightBorder flex flex-col justify-between my-1">
        
        <div>
          <span className="text-[10px] font-fredoka uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Construct Sentence in Grammatical Order:
          </span>

          {/* Assembled Word Strip (Assembly Rack) */}
          <div className="min-h-[64px] p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border-2 border-dashed border-indigo-300 dark:border-indigo-800 flex flex-wrap items-center gap-2 mb-3 shadow-inner">
            {assembledTokens.length === 0 ? (
              <span className="text-xs text-slate-400 font-fredoka italic px-2">
                Tap word token chips below to construct the sentence order...
              </span>
            ) : (
              assembledTokens.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleRemoveToken(t)}
                  disabled={isAnswered}
                  className="squish-btn px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-fredoka text-xs sm:text-sm font-bold shadow-xs hover:bg-indigo-700 pop"
                  title="Tap to remove"
                >
                  {t.word}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Available Token Choices Rack */}
        <div>
          <span className="text-[10px] font-fredoka font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Token Choices Index Rack:
          </span>
          <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[58px] items-center">
            {availableTokens.map((t, idx) => {
              const colors = [
                'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-700',
                'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-700',
                'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-700',
                'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700',
                'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-950/60 dark:text-pink-200 dark:border-pink-700',
              ];
              const colorCls = colors[idx % colors.length];

              return (
                <button
                  key={t.id}
                  onClick={() => handlePickToken(t)}
                  disabled={isAnswered}
                  className={`token-btn squish-btn px-3 py-2 rounded-xl border font-fredoka text-xs sm:text-sm font-bold transition-all shadow-xs ${colorCls}`}
                >
                  {t.word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert if Answered */}
        {isAnswered && (
          <div className={`py-1.5 px-3 rounded-xl flex items-center justify-between border shadow-xs pop shrink-0 my-1 ${
            isCorrect ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}>
            <div className="flex items-center gap-1.5">
              {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span className="text-xs font-fredoka font-bold">
                {isCorrect ? 'Sentence Syntax Validated! +10 Points' : `Order: "${targetWords.join(' ')}"`}
              </span>
            </div>
            <button
              onClick={() => setCurrentIndex((currentIndex + 1) % items.length)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-fredoka text-xs font-bold flex items-center gap-1 btn-press shrink-0"
            >
              <span>Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

      </div>

      {/* Action Row: Reset Rack or Validate */}
      <div className="flex items-center gap-2 shrink-0 mt-1">
        <button
          onClick={loadExercise}
          className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-fredoka text-xs font-bold squish-btn flex items-center justify-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Rack</span>
        </button>

        <button
          onClick={handleValidate}
          disabled={assembledTokens.length === 0}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white font-fredoka text-xs font-bold shadow-squish-purple squish-btn disabled:opacity-40 flex items-center justify-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Validate Sentence ✓</span>
        </button>
      </div>

    </section>
  );
}
