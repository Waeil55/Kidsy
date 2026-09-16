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

  // Load a random sentence question from active deck
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
    } else {
      alert("Microphone speech recognition is not supported in this browser.");
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
      // Offline fallback smart hint
      setAiHint(question.hint || `Clue: The first letter is "${question.word[0].toUpperCase()}" and it has ${question.word.length} letters!`);
      return;
    }

    setIsLoadingHint(true);
    try {
      const prompt = `Give a 1-sentence kid-friendly hint for a 3rd grader to fill in the blank: "${question.selectedSentence}". Target word: "${question.word}". DO NOT use the target word itself. Talk directly to the child.`;
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
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="font-bold text-slate-400">Loading sentence puzzle...</p>
      </div>
    );
  }

  // Render sentence with styled blank
  const parts = question.selectedSentence.split('_________');

  return (
    <section className="flex-1 flex flex-col fade-in w-full max-w-xl mx-auto py-2">
      
      {/* Subject & Mode Header */}
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tealsoft-700 bg-tealsoft-50 px-3 py-1 rounded-full border border-tealsoft-200">
          <Puzzle className="w-3.5 h-3.5" />
          <span>Fill in the Blank</span>
        </div>
        <span className="text-xs font-bold text-slate-400">{question.category}</span>
      </div>

      {/* Main Sentence Card */}
      <div className="flex-1 flex flex-col justify-center min-h-[220px]">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rosebloom-200/80 shadow-xl shadow-slate-900/5 relative overflow-hidden pop">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rosebloom-100/50 rounded-bl-[100px] pointer-events-none -z-0" />
          
          <p className="text-2xl sm:text-3xl text-slate-800 font-extrabold leading-relaxed z-10 relative">
            {parts[0]}
            {isAnswered ? (
              <span className={`inline-block px-3 py-1 mx-1 rounded-xl font-black text-xl sm:text-2xl border-2 ${
                isCorrect 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400 pop' 
                  : 'bg-rose-100 text-rose-800 border-rose-400 line-through'
              }`}>
                {question.word}
              </span>
            ) : (
              <span className="inline-block border-b-4 border-rosebloom-400 bg-rosebloom-50/50 min-w-[100px] sm:min-w-[130px] h-8 mx-1 align-middle rounded-sm animate-pulse" />
            )}
            {parts[1] || ""}
          </p>

          <button
            onClick={() => speakText(question.selectedSentence.replace('_________', 'blank'))}
            className="mt-4 text-xs font-bold text-tealsoft-700 hover:text-tealsoft-800 bg-tealsoft-50 hover:bg-tealsoft-100 px-3 py-1 rounded-full border border-tealsoft-200 inline-flex items-center gap-1.5 btn-press transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Read Sentence Out Loud</span>
          </button>
        </div>
      </div>

      {/* Input & Action Area */}
      <div className="mt-4 flex flex-col gap-3">
        {!isAnswered ? (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCheck(); }}
                placeholder="Type or speak the missing word..."
                className="w-full pl-4 pr-12 py-3.5 bg-white border-2 border-slate-200 rounded-2xl focus:border-rosebloom-400 focus:ring-4 focus:ring-rosebloom-100 text-base sm:text-lg font-extrabold outline-none shadow-sm transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={handleToggleMic}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors btn-press ${
                  isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:text-rosebloom-600'
                }`}
                title="Speak your answer"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleCheck}
              disabled={!userAnswer.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rosebloom-500 to-rosebloom-600 hover:from-rosebloom-600 text-white font-black text-base shadow-md shadow-rosebloom-500/20 disabled:opacity-50 btn-press transition-all"
            >
              Check
            </button>
          </div>
        ) : (
          <button
            onClick={loadQuestion}
            className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2 btn-press pop"
          >
            <span>Next Sentence</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {/* Feedback Alert */}
        {isAnswered && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 border-2 pop shadow-xs ${
            isCorrect 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
            )}
            <div>
              <p className="font-black text-base">
                {isCorrect ? 'Awesome job! You nailed it!' : `Oops! The correct word is "${question.word}".`}
              </p>
              <p className="text-xs font-semibold opacity-85 mt-0.5">
                {question.definition}
              </p>
            </div>
          </div>
        )}

        {/* AI Hint Section */}
        {aiHint && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm shadow-xs pop flex items-start gap-2.5">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-black text-amber-800 mb-0.5">Super Hint:</strong>
              <p className="leading-relaxed font-medium">{aiHint}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Helper Controls */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
        <button
          onClick={handleGetHint}
          disabled={isLoadingHint}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-100/80 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-extrabold border border-amber-300 btn-press transition-colors"
        >
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>{isLoadingHint ? "Thinking..." : (aiHint ? "Hide Hint" : "Get Hint")}</span>
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
