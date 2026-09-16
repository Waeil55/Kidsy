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
  Lightbulb, 
  Image as ImageIcon 
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
  const [isFlipped, setIsFlipped] = useState(false);

  const currentItem = items && items.length > 0 ? items[currentIndex % items.length] : null;

  if (!currentItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-bold text-slate-500">No cards in this deck yet!</p>
        <p className="text-xs text-slate-400 mt-1">Visit the Parent Studio to add cards or switch to another subject.</p>
      </div>
    );
  }

  // Handle Speech Pronunciation Check
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
            detail: `You said: "${transcript}"`
          });
        } else {
          playIncorrect();
          setPronounceFeedback({
            success: false,
            title: "Try saying it again!",
            detail: `Heard: "${transcript}" • Target: "${currentItem.word}"`
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
      alert("Speech recognition is not supported in this browser. You can still listen and practice reading!");
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
    <section className="flex-1 flex flex-col fade-in w-full max-w-xl mx-auto py-2">
      
      {/* Top Deck Progress & Shuffle */}
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-bold text-slate-600">
          <span>Card {currentIndex + 1} of {items.length}</span>
          <span className="opacity-40">•</span>
          <span className="text-tealsoft-700 font-extrabold">{currentItem.category || "Grade 3"}</span>
        </div>

        <button
          onClick={() => { playPop(); onShuffle(); }}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 shadow-xs btn-press transition-colors"
          title="Shuffle Deck"
        >
          <Shuffle className="w-3.5 h-3.5 text-rosebloom-500" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Main Flashcard Container */}
      <div className="flex-1 flex flex-col justify-center min-h-[360px] relative">
        <div 
          onClick={() => { playPop(); setIsFlipped(!isFlipped); }}
          className="w-full bg-white/95 rounded-3xl p-6 sm:p-7 border border-rosebloom-200/80 shadow-xl shadow-slate-900/5 ring-1 ring-rosebloom-100/60 flex flex-col items-center justify-between cursor-pointer transition-all duration-300 hover:shadow-glow-rose relative overflow-hidden"
        >
          {/* Subtle Accent Glow Corner */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-rosebloom-200/30 via-tealsoft-200/20 to-transparent rounded-full blur-xl pointer-events-none" />

          {/* Card Category Pill */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{currentItem.image || "🌟"}</span>
            <span className="text-xs font-black uppercase tracking-wider text-rosebloom-600 bg-rosebloom-50 px-3 py-0.5 rounded-full border border-rosebloom-200/60">
              {currentItem.subject.toUpperCase()}
            </span>
          </div>

          {/* Main Word / Concept */}
          <div className="text-center my-auto py-2">
            <h2 className="text-4xl sm:text-5xl font-black font-display text-slate-900 tracking-tight capitalize drop-shadow-xs pop">
              {currentItem.displayTitle || currentItem.word}
            </h2>

            {/* Optional Math Visual (Grid or Fraction) */}
            {currentItem.mathVisual && currentItem.mathVisual.type === 'grid' && (
              <div className="mt-3 flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-400">
                  Visual Array: {currentItem.mathVisual.rows} rows × {currentItem.mathVisual.cols} columns
                </span>
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(currentItem.mathVisual.cols, 8)}, minmax(0, 1fr))` }}>
                  {Array.from({ length: Math.min(currentItem.mathVisual.rows * currentItem.mathVisual.cols, 32) }).map((_, i) => (
                    <span key={i} className="text-xs">{currentItem.mathVisual.emoji || "⭐"}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Image Preview if available */}
            {currentItem.imageUrl && !currentItem.mathVisual && (
              <div className="mt-3 w-full max-w-[200px] h-28 mx-auto rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs relative group">
                <img 
                  src={currentItem.imageUrl} 
                  alt={currentItem.word}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Meaning / Definition Box */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full p-4 rounded-2xl bg-gradient-to-br from-rosebloom-50/70 via-white to-tealsoft-50/40 border border-rosebloom-200/70 mb-3 text-center"
          >
            <p className="text-base sm:text-lg text-slate-800 font-semibold leading-relaxed">
              "{currentItem.definition}"
            </p>
            <button
              onClick={handleReadDefinition}
              className="mt-2 text-tealsoft-700 hover:text-tealsoft-800 hover:bg-tealsoft-50 px-3 py-1 rounded-full text-xs font-bold border border-tealsoft-200 inline-flex items-center gap-1.5 btn-press transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Read Definition</span>
            </button>
          </div>

          {/* Fun Fact Pill */}
          {currentItem.funFact && (
            <div className="w-full flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs text-left">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="leading-snug"><strong className="font-extrabold">Fun Fact:</strong> {currentItem.funFact}</span>
            </div>
          )}

          <div className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Tap card to flip • Listen or say it below
          </div>
        </div>
      </div>

      {/* Speech Pronunciation Feedback */}
      {pronounceFeedback && (
        <div className={`mt-3 p-3.5 rounded-2xl flex items-center gap-3 border-2 shadow-sm pop ${
          pronounceFeedback.success
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : 'bg-rose-50 text-rose-900 border-rose-300'
        }`}>
          {pronounceFeedback.success ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
          )}
          <div>
            <p className="font-extrabold text-sm">{pronounceFeedback.title}</p>
            <p className="text-xs opacity-80">{pronounceFeedback.detail}</p>
          </div>
        </div>
      )}

      {/* Sound & Speech Action Controls */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={handleReadWord}
          className="py-3 px-4 rounded-2xl bg-tealsoft-600 hover:bg-tealsoft-500 text-white font-black text-sm shadow-md shadow-tealsoft-600/20 flex items-center justify-center gap-2 btn-press transition-all"
        >
          <Volume2 className="w-5 h-5" />
          <span>Hear It</span>
        </button>

        <button
          onClick={handleToggleMic}
          className={`py-3 px-4 rounded-2xl text-white font-black text-sm shadow-md flex items-center justify-center gap-2 btn-press transition-all ${
            isRecording 
              ? 'bg-rose-600 animate-pulse shadow-rose-600/30' 
              : 'bg-rosebloom-500 hover:bg-rosebloom-400 shadow-rosebloom-500/20'
          }`}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span>{isRecording ? 'Listening...' : 'Say It!'}</span>
        </button>
      </div>

      {/* Navigation Buttons: Prev, Next, AI Tutor */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/80">
        <div className="flex gap-2">
          <button
            onClick={() => { playPop(); setPronounceFeedback(null); onPrev(); }}
            className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 btn-press font-bold shadow-xs"
            title="Previous Card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => { playPop(); setPronounceFeedback(null); onNext(); }}
            className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 btn-press font-bold shadow-xs"
            title="Next Card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => { playPop(); onOpenChat(); }}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 text-white font-extrabold text-xs shadow-md flex items-center gap-2 btn-press"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Super Tutor</span>
        </button>
      </div>

    </section>
  );
}
