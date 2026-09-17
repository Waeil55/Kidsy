import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
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

export default function QuizMode({
  items = [],
  onStreakUpdate,
  onOpenChat
}) {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

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

    setQuestion(targetItem);
    setOptions([...pickedOptions].sort(() => 0.5 - Math.random()));
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    loadQuestion();
  }, [items]);

  const handleSelect = (opt) => {
    if (isAnswered) return;
    playPop();
    setSelectedOption(opt);
  };

  const handleCheck = () => {
    if (!question || !selectedOption) return;
    const win = selectedOption.trim().toLowerCase() === question.word.trim().toLowerCase();
    setIsAnswered(true);
    setIsCorrect(win);
    onStreakUpdate(win);

    if (win) {
      playCorrect();
      fireConfetti(false);
      speakText(PRAISES[Math.floor(Math.random() * PRAISES.length)], 1.1, 1.25);
    } else {
      playIncorrect();
      speakText(`The answer is ${question.word}`, 1.0, 1.1);
    }
  };

  if (!question) return null;

  return (
    <section className="flex-1 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto select-none">
      
      {/* Top Title */}
      <div className="flex items-center justify-between px-1 mb-1 shrink-0">
        <h3 className="font-fredoka font-bold text-base sm:text-lg text-duo-gray-800">
          Match the definition
        </h3>
        <button
          onClick={() => { playPop(); speakText(question.definition); }}
          className="p-1.5 rounded-xl bg-duo-gray-100 hover:bg-duo-gray-200 text-duo-gray-600 active:scale-95 transition-all"
          title="Hear definition"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Target Clue Card */}
      <div className="duo-card p-4 my-auto flex flex-col items-center justify-center text-center">
        <span className="text-3xl mb-1">{question.image || "🎯"}</span>
        <h2 className="font-fredoka font-bold text-lg sm:text-xl text-duo-gray-800 leading-relaxed">
          "{question.definition}"
        </h2>
        {question.imageUrl && (
          <div className="w-20 h-20 rounded-2xl overflow-hidden mt-2 border-2 border-duo-gray-100 shrink-0">
            <img 
              src={question.imageUrl} 
              alt={question.word}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      {/* 4 Chunky Choice Buttons */}
      <div className="grid grid-cols-2 gap-2.5 my-2 shrink-0">
        {options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const isThisCorrect = opt.trim().toLowerCase() === question.word.trim().toLowerCase();

          let btnClass = "duo-btn duo-btn-white";
          if (isSelected && !isAnswered) btnClass = "duo-btn duo-btn-selected";
          if (isAnswered) {
            if (isThisCorrect) btnClass = "duo-btn duo-btn-correct";
            else if (isSelected && !isThisCorrect) btnClass = "duo-btn duo-btn-wrong";
            else btnClass = "duo-btn duo-btn-disabled opacity-40";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              disabled={isAnswered}
              className={`py-3 px-3 rounded-2xl text-sm sm:text-base capitalize transition-all ${btnClass}`}
            >
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Duolingo Signature Bottom Action / Feedback Bar */}
      <div className="shrink-0 pt-2 border-t-2 border-duo-gray-100 mt-1">
        {!isAnswered ? (
          <button
            onClick={handleCheck}
            disabled={!selectedOption}
            className={`duo-btn w-full py-3 text-sm tracking-wider ${
              selectedOption ? 'duo-btn-green' : 'duo-btn-disabled'
            }`}
          >
            CHECK
          </button>
        ) : (
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
                  {isCorrect ? 'Great match!' : `Target word: ${question.word}`}
                </h4>
                <p className="text-[11px] font-fredoka text-duo-gray-600">
                  {isCorrect ? '+10 XP Earned!' : 'Try the next one!'}
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
