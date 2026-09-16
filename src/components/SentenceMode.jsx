import React, { useState, useEffect } from 'react';
import { 
  Puzzle, 
  Mic, 
  MicOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Volume2 
} from 'lucide-react';
import { 
  speakText, 
  playPop, 
  playCorrect, 
  playIncorrect, 
  fireConfetti, 
  createSpeechRecognizer, 
  PRAISES 
} from '../utils/audio';
import { getGeminiApiKey } from '../utils/storage';

export default function SentenceMode({
  items,
  onStreakUpdate,
  onOpenChat
}) {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedWord, setSelectedWord] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  const loadQuestion = () => {
    playPop();
    if (!items || items.length === 0) return;
    const targetItem = items[Math.floor(Math.random() * items.length)];
    const sentenceTemplate = targetItem.sentences && targetItem.sentences.length > 0
      ? targetItem.sentences[Math.floor(Math.random() * targetItem.sentences.length)]
      : `The target word is _________ because it fits here.`;

    // Generate 4 challenging options
    let optList = [];
    if (targetItem.contextOptions && targetItem.contextOptions.length >= 4) {
      optList = [...targetItem.contextOptions];
    } else if (targetItem.quizOptions && targetItem.quizOptions.length >= 4) {
      optList = [...targetItem.quizOptions];
    } else {
      // Pick related words from current deck
      const otherWords = items
        .map(i => i.word)
        .filter(w => w.toLowerCase() !== targetItem.word.toLowerCase());
      const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
      optList = [targetItem.word];
      for (let w of shuffledOthers) {
        if (optList.length >= 4) break;
        if (!optList.includes(w)) optList.push(w);
      }
    }

    // Ensure target word is definitely in options and shuffle
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
    setAiHint("");
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
      const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
      speakText(praise, 1.1, 1.25);
    } else {
      playIncorrect();
      speakText(`The correct word is ${question.word}`, 1.0, 1.1);
    }
  };

  const handleToggleMic = () => {
    playPop();
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsRecording(false);
        const cleanT = transcript.toLowerCase().replace(/[^a-z0-9]/g, '');
        // Check if spoken word matches any of the options
        const match = options.find(o => o.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanT);
        if (match) {
          setSelectedWord(match);
        } else {
          // Fallback closest
          setSelectedWord(transcript.trim());
        }
      },
      () => setIsRecording(false),
      () => setIsRecording(false)
    );

    if (recognizer) {
      try {
        setIsRecording(true);
        recognizer.start();
      } catch (e) {
        setIsRecording(false);
      }
    }
  };

  const handleGetHint = async () => {
    playPop();
    if (!question) return;
    if (aiHint) {
      setAiHint("");
      return;
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      setAiHint(question.hint || `Clue: Starts with "${question.word[0].toUpperCase()}" and means: ${question.definition}`);
      return;
    }

    setIsLoadingHint(true);
    try {
      const prompt = `Give a 1-sentence kid-friendly clue for a 3rd grader for: "${question.selectedSentence}". Target word: "${question.word}". DO NOT use the target word itself. Talk directly to the student.`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      const hintText = data?.candidates?.[0]?.content?.parts?.[0]?.text || question.hint;
      setAiHint(hintText);
    } catch (err) {
      setAiHint(question.hint || `Starts with "${question.word[0].toUpperCase()}"!`);
    } finally {
      setIsLoadingHint(false);
    }
  };

  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="font-bold text-slate-400">Loading sentence puzzle...</p>
      </div>
    );
  }

  const parts = question.selectedSentence.split('_________');

  return (
    <section className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto">
      
      {/* Top Category & Audio Bar */}
      <div className="flex justify-between items-center px-1 shrink-0 mb-1">
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase flex items-center gap-1">
          <Puzzle className="w-3 h-3 text-amber-600" />
          <span>{question.category}</span>
        </span>
        <button
          onClick={() => speakText(question.selectedSentence.replace('_________', selectedWord || 'blank'))}
          className="text-tealsoft-700 text-[11px] font-extrabold flex items-center gap-1 btn-press"
        >
          <Volume2 className="w-3 h-3" />
          <span>Read Aloud</span>
        </button>
      </div>

      {/* Sentence Display Card with Photo */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-white rounded-3xl p-3 sm:p-4 border-2 border-amber-200/90 shadow-lg relative overflow-hidden my-1">
        
        {/* Photo Banner */}
        {question.imageUrl && (
          <div className="w-full h-20 sm:h-26 rounded-2xl overflow-hidden mb-2 border border-slate-100 shadow-xs shrink-0">
            <img 
              src={question.imageUrl} 
              alt={question.word} 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <div className="text-center my-auto">
          <p className="text-base sm:text-xl text-slate-800 font-extrabold leading-relaxed">
            {parts[0]}
            {isAnswered ? (
              <span className={`inline-block px-2.5 py-0.5 mx-1 rounded-xl font-black text-base sm:text-lg border-2 ${
                isCorrect 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400 pop' 
                  : 'bg-rose-100 text-rose-800 border-rose-400 line-through'
              }`}>
                {question.word}
              </span>
            ) : selectedWord ? (
              <span className="inline-block px-2.5 py-0.5 mx-1 rounded-xl font-black text-base sm:text-lg bg-amber-100 text-amber-900 border-2 border-amber-300 pop">
                {selectedWord}
              </span>
            ) : (
              <span className="inline-block border-b-4 border-amber-400 bg-amber-50 min-w-[80px] sm:min-w-[110px] h-6 mx-1 align-middle rounded-sm animate-pulse" />
            )}
            {parts[1] || ""}
          </p>
        </div>

        {/* Feedback Alert if Answered */}
        {isAnswered && (
          <div className={`mt-2 py-1 px-3 rounded-xl flex items-center gap-1.5 border w-full shrink-0 pop ${
            isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span className="text-xs font-black">{isCorrect ? 'Super job! Exactly right!' : `Correct: "${question.word}"`}</span>
          </div>
        )}
      </div>

      {/* AI Hint Pill */}
      {aiHint && (
        <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shadow-xs pop shrink-0 flex items-start gap-1 my-0.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="line-clamp-2"><strong className="font-black">Hint:</strong> {aiHint}</p>
        </div>
      )}

      {/* 4 Challenging Word Options (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2 shrink-0 my-1">
        {options.map((opt, idx) => {
          const isSelected = selectedWord.toLowerCase() === opt.toLowerCase();
          const isTarget = opt.toLowerCase() === question.word.toLowerCase();
          
          let btnClass = "bg-white border-2 border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/50 shadow-xs";

          if (isSelected && !isAnswered) {
            btnClass = "bg-amber-100 border-2 border-amber-400 text-amber-900 font-black scale-[1.02] shadow-sm";
          }

          if (isAnswered) {
            if (isTarget) {
              btnClass = "bg-emerald-500 border-2 border-emerald-600 text-white shadow-md scale-[1.02] pop";
            } else if (isSelected && !isTarget) {
              btnClass = "bg-rose-500 border-2 border-rose-600 text-white shadow-inner shake";
            } else {
              btnClass = "bg-slate-100 border-slate-200 text-slate-400 opacity-40";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered}
              className={`py-2 px-3 rounded-2xl text-xs sm:text-sm font-black capitalize transition-all flex items-center justify-center btn-press ${btnClass}`}
            >
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Action Row: Check / Mic OR Next Sentence */}
      <div className="shrink-0 mt-1">
        {!isAnswered ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-2.5 rounded-2xl border transition-colors btn-press ${
                isRecording ? 'bg-rose-600 text-white border-rose-600 animate-pulse' : 'bg-white text-slate-600 border-slate-200 hover:text-amber-600'
              }`}
              title="Speak choice"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={handleCheck}
              disabled={!selectedWord}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-black text-sm shadow-md shadow-amber-500/20 disabled:opacity-40 btn-press"
            >
              Check Answer
            </button>
          </div>
        ) : (
          <button
            onClick={loadQuestion}
            className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-1.5 btn-press pop"
          >
            <span>Next Sentence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bottom Dock: Hint & Tutor Buttons */}
      <div className="flex items-center justify-between shrink-0 pt-1.5 border-t border-slate-200/80 mt-1">
        <button
          onClick={handleGetHint}
          disabled={isLoadingHint}
          className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-black border border-amber-300 btn-press"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          <span>{isLoadingHint ? "Thinking..." : (aiHint ? "Hide Hint" : "Need a Hint?")}</span>
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
