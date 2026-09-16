import React, { useState } from 'react';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Lightbulb 
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

export default function StudyMode({
  items,
  currentIndex,
  onNext,
  onPrev,
  onShuffle,
  onStreakUpdate,
  onOpenChat
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [pronounceFeedback, setPronounceFeedback] = useState(null);

  const currentItem = items && items.length > 0 ? items[currentIndex % items.length] : null;

  if (!currentItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <p className="text-base font-bold text-slate-500">No cards in this deck yet!</p>
        <p className="text-xs text-slate-400 mt-1">Open Parent Studio to add cards or pick another topic.</p>
      </div>
    );
  }

  const handleToggleMic = () => {
    playPop();
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setIsRecording(false);
        const cleanT = transcript.toLowerCase().replace(/[^a-z0-9]/g, "");
        const cleanW = currentItem.word.toLowerCase().replace(/[^a-z0-9]/g, "");
        const isMatch = cleanT.includes(cleanW) || cleanT === cleanW;

        if (isMatch) {
          playCorrect();
          fireConfetti(false);
          onStreakUpdate(true);
          const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
          speakText(praise, 1.1, 1.25);
          setPronounceFeedback({
            success: true,
            title: "Super pronunciation!",
            detail: `Heard: "${transcript}"`
          });
        } else {
          playIncorrect();
          setPronounceFeedback({
            success: false,
            title: "Try saying it again!",
            detail: `Heard: "${transcript}"`
          });
        }
      },
      () => setIsRecording(false),
      () => setIsRecording(false)
    );

    if (recognizer) {
      try {
        setIsRecording(true);
        setPronounceFeedback(null);
        recognizer.start();
      } catch (e) {
        setIsRecording(false);
      }
    } else {
      alert("Microphone speech recognition is not supported on this browser.");
    }
  };

  const handleReadWord = () => {
    playPop();
    speakText(currentItem.displayTitle || currentItem.word);
  };

  const handleReadDefinition = () => {
    playPop();
    speakText(currentItem.definition);
  };

  return (
    <section className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto">
      
      {/* Top Card Counter & Shuffle Bar */}
      <div className="flex justify-between items-center px-1 shrink-0 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-black text-slate-700">
            {currentIndex + 1} / {items.length}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-tealsoft-100 text-tealsoft-800 text-[10px] font-extrabold uppercase">
            {currentItem.category}
          </span>
        </div>

        <button
          onClick={() => { playPop(); onShuffle(); }}
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600 shadow-xs btn-press"
          title="Shuffle Deck"
        >
          <Shuffle className="w-3 h-3 text-rosebloom-500" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Main Flashcard Body (Fits vertically, no scroll) */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-between bg-white rounded-3xl p-3 sm:p-4 border-2 border-rosebloom-200/90 shadow-lg relative overflow-hidden my-1">
        
        {/* Top Header inside Card */}
        <div className="w-full flex items-center justify-between gap-2 shrink-0">
          <span className="text-2xl">{currentItem.image || "🌟"}</span>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rosebloom-500 to-pink-600 text-white shadow-xs">
            {currentItem.subject.toUpperCase()}
          </span>
        </div>

        {/* Prominent Photo or Math Visual */}
        {currentItem.imageUrl ? (
          <div className="w-full h-24 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-xs my-1 relative shrink-0">
            <img 
              src={currentItem.imageUrl} 
              alt={currentItem.word}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        ) : currentItem.mathVisual ? (
          <div className="w-full py-2 px-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center my-1 shrink-0">
            {currentItem.mathVisual.type === 'grid' && (
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(currentItem.mathVisual.cols, 8)}, minmax(0, 1fr))` }}>
                {Array.from({ length: Math.min(currentItem.mathVisual.rows * currentItem.mathVisual.cols, 24) }).map((_, i) => (
                  <span key={i} className="text-xs">{currentItem.mathVisual.emoji || "⭐"}</span>
                ))}
              </div>
            )}
            {currentItem.mathVisual.type === 'fraction' && (
              <div className="flex items-center gap-2 text-xl font-black text-rosebloom-600">
                <span>🍕</span>
                <span>{currentItem.mathVisual.num} / {currentItem.mathVisual.den}</span>
              </div>
            )}
          </div>
        ) : null}

        {/* Word / Question Title */}
        <div className="text-center my-auto py-0.5">
          <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-900 tracking-tight capitalize drop-shadow-xs leading-tight">
            {currentItem.displayTitle || currentItem.word}
          </h2>
        </div>

        {/* Definition / Explanation Box */}
        <div className="w-full p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-rosebloom-50/80 via-white to-tealsoft-50/50 border border-rosebloom-200 text-center shrink-0">
          <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed line-clamp-2">
            "{currentItem.definition}"
          </p>
          <button
            onClick={handleReadDefinition}
            className="mt-1 text-tealsoft-700 hover:text-tealsoft-800 text-[11px] font-extrabold inline-flex items-center gap-1 btn-press"
          >
            <Volume2 className="w-3 h-3" />
            <span>Hear Meaning</span>
          </button>
        </div>

        {/* Optional Fun Fact Pill */}
        {currentItem.funFact && (
          <div className="w-full flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium shrink-0 mt-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <p className="line-clamp-1"><strong className="font-black">Fact:</strong> {currentItem.funFact}</p>
          </div>
        )}

      </div>

      {/* Speech Pronunciation Feedback (Inline Pop) */}
      {pronounceFeedback && (
        <div className={`py-1.5 px-3 rounded-xl flex items-center gap-2 border shadow-xs pop shrink-0 my-0.5 ${
          pronounceFeedback.success ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-rose-50 text-rose-900 border-rose-300'
        }`}>
          {pronounceFeedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span className="text-xs font-black">{pronounceFeedback.title}</span>
          <span className="text-[11px] opacity-80">{pronounceFeedback.detail}</span>
        </div>
      )}

      {/* Voice & Sound Control Row (Never Missed!) */}
      <div className="grid grid-cols-2 gap-2 shrink-0 mt-1">
        <button
          onClick={handleReadWord}
          className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-tealsoft-600 to-emerald-600 hover:from-tealsoft-500 text-white font-black text-xs sm:text-sm shadow-md shadow-tealsoft-600/20 flex items-center justify-center gap-2 btn-press"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen Word</span>
        </button>

        <button
          onClick={handleToggleMic}
          className={`py-2.5 px-3 rounded-2xl text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 btn-press transition-all ${
            isRecording 
              ? 'bg-rose-600 animate-pulse shadow-rose-600/30' 
              : 'bg-gradient-to-r from-rosebloom-500 to-pink-600 hover:from-rosebloom-400 shadow-rosebloom-500/20'
          }`}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isRecording ? 'Listening...' : 'Say It!'}</span>
        </button>
      </div>

      {/* Bottom Dock: Prev, Next & AI Tutor (Always Pinned, Never Missed!) */}
      <div className="flex items-center justify-between shrink-0 pt-1.5 border-t border-slate-200/80 mt-1">
        <div className="flex gap-1.5">
          <button
            onClick={() => { playPop(); setPronounceFeedback(null); onPrev(); }}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 btn-press font-bold shadow-xs"
            title="Previous Card"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => { playPop(); setPronounceFeedback(null); onNext(); }}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 btn-press font-bold shadow-xs"
            title="Next Card"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => { playPop(); onOpenChat(); }}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 text-white font-black text-xs shadow-md flex items-center gap-1.5 btn-press"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Ask AI Super Tutor</span>
        </button>
      </div>

    </section>
  );
}
