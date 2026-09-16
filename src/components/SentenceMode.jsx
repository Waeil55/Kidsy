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
  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  const loadQuestion = () => {
    playPop();
    if (!items || items.length === 0) return;
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const sentenceTemplate = randomItem.sentences && randomItem.sentences.length > 0
      ? randomItem.sentences[Math.floor(Math.random() * randomItem.sentences.length)]
      : `The target word is _________ because it fits here.`;

    setQuestion({
      ...randomItem,
      selectedSentence: sentenceTemplate
    });
    setUserAnswer("");
    setIsAnswered(false);
    setIsCorrect(false);
    setAiHint("");
  };

  useEffect(() => {
    loadQuestion();
  }, [items]);

  const handleCheck = () => {
    if (!question || !userAnswer.trim()) return;
    const cleanUser = userAnswer.trim().toLowerCase();
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
      speakText(`The correct answer is ${question.word}`, 1.0, 1.1);
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
        setUserAnswer(transcript.trim());
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
      
      {/* Top Category Bar */}
      <div className="flex justify-between items-center px-1 shrink-0 mb-1">
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase flex items-center gap-1">
          <Puzzle className="w-3 h-3 text-amber-600" />
          <span>{question.category}</span>
        </span>
        <button
          onClick={() => speakText(question.selectedSentence.replace('_________', 'blank'))}
          className="text-tealsoft-700 text-[11px] font-extrabold flex items-center gap-1 btn-press"
        >
          <Volume2 className="w-3 h-3" />
          <span>Read Aloud</span>
        </button>
      </div>

      {/* Main Sentence Card with Photo / Emoji Header */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-white rounded-3xl p-4 border-2 border-amber-200/90 shadow-lg relative overflow-hidden my-1">
        
        {/* Photo Banner if available */}
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
          <p className="text-lg sm:text-2xl text-slate-800 font-extrabold leading-relaxed">
            {parts[0]}
            {isAnswered ? (
              <span className={`inline-block px-2.5 py-0.5 mx-1 rounded-xl font-black text-lg sm:text-xl border-2 ${
                isCorrect 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400 pop' 
                  : 'bg-rose-100 text-rose-800 border-rose-400 line-through'
              }`}>
                {question.word}
              </span>
            ) : (
              <span className="inline-block border-b-4 border-amber-400 bg-amber-50 min-w-[90px] sm:min-w-[120px] h-7 mx-1 align-middle rounded-sm animate-pulse" />
            )}
            {parts[1] || ""}
          </p>
        </div>

        {/* Feedback notification if answered */}
        {isAnswered && (
          <div className={`mt-2 py-1.5 px-3 rounded-2xl flex items-center gap-2 border w-full shrink-0 pop ${
            isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span className="text-xs font-black">{isCorrect ? 'Awesome job! You got it!' : `Answer: "${question.word}"`}</span>
          </div>
        )}
      </div>

      {/* AI Hint Box (if shown) */}
      {aiHint && (
        <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shadow-xs pop shrink-0 flex items-start gap-1.5 my-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="line-clamp-2"><strong className="font-black">Hint:</strong> {aiHint}</p>
        </div>
      )}

      {/* Input Action Controls (Pinned, Never Missed!) */}
      <div className="shrink-0 mt-1">
        {!isAnswered ? (
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCheck(); }}
                placeholder="Type or speak missing word..."
                className="w-full pl-3 pr-10 py-2.5 bg-white border-2 border-slate-200 rounded-2xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-sm sm:text-base font-extrabold outline-none shadow-xs"
                autoFocus
              />
              <button
                type="button"
                onClick={handleToggleMic}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-colors btn-press ${
                  isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:text-amber-600'
                }`}
                title="Speak answer"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleCheck}
              disabled={!userAnswer.trim()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-black text-sm shadow-md shadow-amber-500/20 disabled:opacity-40 btn-press"
            >
              Check
            </button>
          </div>
        ) : (
          <button
            onClick={loadQuestion}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-1.5 btn-press pop"
          >
            <span>Next Sentence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bottom Dock: Hint & Tutor Buttons (Pinned, Never Missed!) */}
      <div className="flex items-center justify-between shrink-0 pt-1.5 border-t border-slate-200/80 mt-1">
        <button
          onClick={handleGetHint}
          disabled={isLoadingHint}
          className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-black border border-amber-300 btn-press"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          <span>{isLoadingHint ? "Thinking..." : (aiHint ? "Hide Hint" : "Get Hint")}</span>
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
