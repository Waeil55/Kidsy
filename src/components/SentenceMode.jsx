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

export default function SentenceMode({
  items = [],
  onStreakUpdate,
  onOpenChat
}) {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedWord, setSelectedWord] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const loadQuestion = () => {
    playPop();
    if (!items || items.length === 0) return;
    const targetItem = items[Math.floor(Math.random() * items.length)];
    const sentenceTemplate = targetItem.sentences && targetItem.sentences.length > 0
      ? targetItem.sentences[Math.floor(Math.random() * targetItem.sentences.length)]
      : `The target word is _________ because it fits here.`;

    let optList = [];
    if (targetItem.contextOptions && targetItem.contextOptions.length >= 4) {
      optList = [...targetItem.contextOptions];
    } else if (targetItem.quizOptions && targetItem.quizOptions.length >= 4) {
      optList = [...targetItem.quizOptions];
    } else {
      const others = items
        .map(i => i.word)
        .filter(w => w.toLowerCase() !== targetItem.word.toLowerCase());
      optList = [targetItem.word, ...others.slice(0, 3)];
    }

    if (!optList.some(o => o.toLowerCase() === targetItem.word.toLowerCase())) {
      optList[0] = targetItem.word;
    }
    const finalOptions = [...optList].sort(() => 0.5 - Math.random());

    setQuestion({
      ...targetItem,
      selectedSentence: sentenceTemplate
    });
    setOptions(finalOptions);
    setSelectedWord("");
    setIsAnswered(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    loadQuestion();
  }, [items]);

  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    playPop();
    setSelectedWord(opt);
  };

  const handleCheck = () => {
    if (!question || !selectedWord) return;
    const cleanUser = selectedWord.trim().toLowerCase();
    const cleanTarget = question.word.trim().toLowerCase();
    const correct = cleanUser === cleanTarget;

    setIsAnswered(true);
    setIsCorrect(correct);
    onStreakUpdate(correct);

    if (correct) {
      playCorrect();
      fireConfetti(false);
      speakText(PRAISES[Math.floor(Math.random() * PRAISES.length)], 1.1, 1.25);
    } else {
      playIncorrect();
      speakText(`The correct answer is ${question.word}`, 1.0, 1.1);
    }
  };

  if (!question) return null;

  const parts = question.selectedSentence.split("_________");

  return (
    <section className="flex-1 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto select-none">
      
      {/* Question Instruction */}
      <div className="flex items-center justify-between px-1 mb-1 shrink-0">
        <h3 className="font-fredoka font-bold text-base sm:text-lg text-duo-gray-800">
          Fill in the blank
        </h3>
        <button
          onClick={() => { playPop(); speakText(question.selectedSentence.replace('_________', question.word)); }}
          className="p-1.5 rounded-xl bg-duo-gray-100 hover:bg-duo-gray-200 text-duo-gray-600 active:scale-95 transition-all"
          title="Hear Sentence"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Sentence Card with Photo */}
      <div className="duo-card p-4 my-auto flex flex-col items-center justify-center text-center">
        {question.imageUrl && (
          <div className="w-full h-24 sm:h-28 rounded-2xl overflow-hidden mb-3 border-2 border-duo-gray-100 shrink-0">
            <img 
              src={question.imageUrl} 
              alt={question.word} 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <p className="font-fredoka font-bold text-base sm:text-xl text-duo-gray-800 leading-relaxed">
          {parts[0]}
          <span className={`inline-block px-3 py-0.5 mx-1 rounded-xl border-2 font-bold text-base sm:text-xl ${
            isAnswered 
              ? (isCorrect ? 'bg-duo-greenLight border-duo-green text-duo-greenDark' : 'bg-duo-redLight border-duo-red text-duo-redDark line-through')
              : selectedWord
                ? 'bg-duo-blueLight border-duo-blue text-duo-blueDark'
                : 'border-dashed border-duo-gray-300 min-w-[80px] h-7 align-middle bg-duo-gray-50'
          }`}>
            {isAnswered ? question.word : (selectedWord || "")}
          </span>
          {parts[1] || ""}
        </p>
      </div>

      {/* 4 Chunky Choice Buttons (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2.5 my-2 shrink-0">
        {options.map((opt, idx) => {
          const isSelected = selectedWord.toLowerCase() === opt.toLowerCase();
          const isTarget = opt.toLowerCase() === question.word.toLowerCase();

          let btnClass = "duo-btn duo-btn-white";
          if (isSelected && !isAnswered) btnClass = "duo-btn duo-btn-selected";
          if (isAnswered) {
            if (isTarget) btnClass = "duo-btn duo-btn-correct";
            else if (isSelected && !isTarget) btnClass = "duo-btn duo-btn-wrong";
            else btnClass = "duo-btn duo-btn-disabled opacity-40";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
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
            disabled={!selectedWord}
            className={`duo-btn w-full py-3 text-sm tracking-wider ${
              selectedWord ? 'duo-btn-green' : 'duo-btn-disabled'
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
                  {isCorrect ? 'Awesome job!' : `Correct solution: ${question.word}`}
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
