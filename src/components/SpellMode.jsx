import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Delete, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Sparkles 
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
  items = [],
  onStreakUpdate,
  onOpenChat
}) {
  const [question, setQuestion] = useState(null);
  const [slottedChars, setSlottedChars] = useState([]);
  const [candidateTiles, setCandidateTiles] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const loadQuestion = () => {
    playPop();
    if (!items || items.length === 0) return;
    const target = items[Math.floor(Math.random() * items.length)];
    const cleanLetters = target.word.trim().toUpperCase().replace(/[^A-Z]/g, '').split('');

    // Generate candidate tiles: the real letters + 2-3 extra distractors
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const distractors = [];
    while (distractors.length < 3) {
      const rand = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!cleanLetters.includes(rand) && !distractors.includes(rand)) {
        distractors.push(rand);
      }
    }

    const allTiles = [...cleanLetters, ...distractors]
      .map((char, idx) => ({ id: `${idx}-${char}`, char, isUsed: false }))
      .sort(() => 0.5 - Math.random());

    setQuestion({
      ...target,
      cleanLetters
    });
    setSlottedChars([]);
    setCandidateTiles(allTiles);
    setIsAnswered(false);
    setIsCorrect(false);
    speakText(target.displayTitle || target.word);
  };

  useEffect(() => {
    loadQuestion();
  }, [items]);

  const handlePickCandidate = (tile) => {
    if (isAnswered || tile.isUsed || !question) return;
    if (slottedChars.length >= question.cleanLetters.length) return;

    playPop();
    // Mark tile as used
    setCandidateTiles(candidateTiles.map(t => t.id === tile.id ? { ...t, isUsed: true } : t));
    const nextSlotted = [...slottedChars, tile];
    setSlottedChars(nextSlotted);

    // Auto check when all slots filled
    if (nextSlotted.length === question.cleanLetters.length) {
      const spelled = nextSlotted.map(t => t.char).join('');
      const target = question.cleanLetters.join('');
      const win = spelled === target;

      setIsAnswered(true);
      setIsCorrect(win);
      onStreakUpdate(win);

      if (win) {
        playCorrect();
        fireConfetti(false);
        speakText(PRAISES[Math.floor(Math.random() * PRAISES.length)], 1.1, 1.25);
      } else {
        playIncorrect();
        speakText(`It is spelled ${question.word}`, 1.0, 1.1);
      }
    }
  };

  const handleRemoveSlotted = (tile) => {
    if (isAnswered) return;
    playPop();
    setSlottedChars(slottedChars.filter(t => t.id !== tile.id));
    setCandidateTiles(candidateTiles.map(t => t.id === tile.id ? { ...t, isUsed: false } : t));
  };

  const handleClearAll = () => {
    if (isAnswered) return;
    playPop();
    setSlottedChars([]);
    setCandidateTiles(candidateTiles.map(t => ({ ...t, isUsed: false })));
  };

  if (!question) return null;

  return (
    <section className="flex-1 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto select-none">
      
      {/* Top Title & Hear Audio */}
      <div className="flex items-center justify-between px-1 mb-1 shrink-0">
        <h3 className="font-fredoka font-bold text-base sm:text-lg text-duo-gray-800">
          Spell the word
        </h3>
        <button
          onClick={() => { playPop(); speakText(question.word); }}
          className="p-1.5 rounded-xl bg-duo-gray-100 hover:bg-duo-gray-200 text-duo-gray-600 active:scale-95 transition-all"
          title="Pronounce word"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Target Clue Card */}
      <div className="duo-card p-3 my-auto flex flex-col items-center justify-center text-center">
        {question.imageUrl ? (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-2 border-2 border-duo-gray-100 shrink-0">
            <img 
              src={question.imageUrl} 
              alt={question.word} 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        ) : (
          <span className="text-4xl mb-1">{question.image || "🔤"}</span>
        )}
        <p className="font-fredoka text-xs sm:text-sm text-duo-gray-500 font-medium">
          "{question.definition}"
        </p>
      </div>

      {/* Letter Slots Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 my-2 shrink-0">
        {question.cleanLetters.map((_, idx) => {
          const filledTile = slottedChars[idx];
          return (
            <button
              key={idx}
              onClick={() => filledTile && handleRemoveSlotted(filledTile)}
              disabled={isAnswered || !filledTile}
              className={`w-11 h-13 sm:w-12 sm:h-14 rounded-2xl font-fredoka font-bold text-xl sm:text-2xl flex items-center justify-center transition-all ${
                filledTile
                  ? (isAnswered 
                      ? (isCorrect ? 'bg-duo-green text-white border-b-4 border-duo-greenDark' : 'bg-duo-red text-white border-b-4 border-duo-redDark')
                      : 'bg-white text-duo-blueDark border-2 border-duo-blue border-b-4 pop shadow-xs')
                  : 'bg-duo-gray-50 border-2 border-dashed border-duo-gray-300'
              }`}
            >
              {filledTile ? filledTile.char : ""}
            </button>
          );
        })}
      </div>

      {/* Candidate Letter Tiles Matrix */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-2.5 rounded-2xl bg-duo-gray-50 border-2 border-duo-gray-100 my-1 shrink-0">
        {candidateTiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => handlePickCandidate(tile)}
            disabled={tile.isUsed || isAnswered}
            className={`duo-btn w-11 h-11 sm:w-12 sm:h-12 text-lg sm:text-xl rounded-2xl ${
              tile.isUsed 
                ? 'duo-btn-disabled opacity-30' 
                : 'duo-btn-white'
            }`}
          >
            {tile.char}
          </button>
        ))}

        <button
          onClick={handleClearAll}
          disabled={slottedChars.length === 0 || isAnswered}
          className="duo-btn duo-btn-white p-2.5 rounded-2xl text-duo-gray-500 disabled:opacity-30"
          title="Clear slots"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Feedback Bar */}
      <div className="shrink-0 pt-2 border-t-2 border-duo-gray-100 mt-1">
        {isAnswered && (
          <div className={`p-3 rounded-2xl flex items-center justify-between pop ${
            isCorrect ? 'bg-duo-greenLight border-2 border-duo-green' : 'bg-duo-redLight border-2 border-duo-red'
          }`}>
            <div className="flex items-center gap-2 text-left">
              {isCorrect 
                ? <CheckCircle2 className="w-6 h-6 text-duo-greenDark shrink-0" />
                : <XCircle className="w-6 h-6 text-duo-redDark shrink-0" />
              }
              <div>
                <h4 className={`font-fredoka font-bold text-sm leading-tight ${
                  isCorrect ? 'text-duo-greenDark' : 'text-duo-redDark'
                }`}>
                  {isCorrect ? 'Spelling Verified!' : `Spelling: ${question.word}`}
                </h4>
                <p className="text-[11px] font-fredoka text-duo-gray-600">
                  {isCorrect ? '+10 XP Earned!' : 'Keep practicing!'}
                </p>
              </div>
            </div>

            <button
              onClick={loadQuestion}
              className={`duo-btn px-5 py-2 text-xs shrink-0 ${
                isCorrect ? 'duo-btn-green' : 'duo-btn-blue'
              }`}
            >
              CONTINUE
            </button>
          </div>
        )}
      </div>

    </section>
  );
}
