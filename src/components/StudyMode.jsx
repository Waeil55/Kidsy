import React, { useState } from 'react';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  CheckCircle2, 
  XCircle, 
  Sparkles 
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
  items = [],
  currentIndex = 0,
  onNext,
  onPrev,
  onShuffle,
  onStreakUpdate,
  onOpenChat
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [pronounceFeedback, setPronounceFeedback] = useState(null);

  const currentItem = items.length > 0 ? items[currentIndex % items.length] : null;

  if (!currentItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <p className="font-fredoka text-base font-bold text-duo-gray-400">No cards in this deck yet!</p>
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
          if (onStreakUpdate) onStreakUpdate(true);
          speakText(PRAISES[Math.floor(Math.random() * PRAISES.length)], 1.1, 1.25);
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

  return (
    <section className="flex-1 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto select-none">
      
      {/* Top Card Counter & Shuffle */}
      <div className="flex justify-between items-center px-1 mb-1 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-duo-gray-100 text-[11px] font-fredoka font-bold text-duo-gray-600">
            {currentIndex + 1} / {items.length}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-duo-blueLight text-duo-blueDark text-[10px] font-fredoka font-bold uppercase">
            {currentItem.category || "Vocabulary"}
          </span>
        </div>

        <button
          onClick={() => { playPop(); if (onShuffle) onShuffle(); }}
          className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white hover:bg-duo-gray-50 border-2 border-duo-gray-100 font-fredoka text-[11px] font-bold text-duo-gray-600 active:scale-95 transition-all shadow-xs"
        >
          <Shuffle className="w-3 h-3 text-duo-blue" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Main Duolingo Flashcard Body */}
      <div className="duo-card flex-1 min-h-0 flex flex-col items-center justify-between p-3.5 sm:p-4 my-auto relative overflow-hidden text-center">
        
        {/* Top Header inside Card */}
        <div className="w-full flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl">{currentItem.image || "🌟"}</span>
            {currentItem.partOfSpeech && (
              <span className="text-[10px] font-fredoka font-bold uppercase px-2 py-0.5 rounded-lg bg-duo-greenLight text-duo-greenDark border border-duo-green">
                {currentItem.partOfSpeech}
              </span>
            )}
          </div>
          <span className="text-[10px] font-fredoka font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-duo-blue text-white shadow-xs">
            {currentItem.subject?.toUpperCase() || "VOCAB"}
          </span>
        </div>

        {/* Photo Visual */}
        {currentItem.imageUrl && (
          <div className="w-full h-24 sm:h-28 rounded-2xl overflow-hidden border-2 border-duo-gray-100 shrink-0 my-1">
            <img 
              src={currentItem.imageUrl} 
              alt={currentItem.word}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Word Title */}
        <div className="text-center my-auto py-1">
          <h2 className="font-fredoka font-bold text-2xl sm:text-3xl text-duo-gray-800 capitalize leading-tight">
            {currentItem.displayTitle || currentItem.word}
          </h2>
        </div>

        {/* Synonyms & Antonyms */}
        {(currentItem.synonyms?.length > 0 || currentItem.antonyms?.length > 0) && (
          <div className="w-full flex flex-wrap items-center justify-center gap-1.5 py-0.5 shrink-0">
            {currentItem.synonyms?.length > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-duo-greenLight border border-duo-green text-duo-greenDark font-fredoka text-[10px] font-bold">
                <span className="uppercase">Syn:</span>
                <span>{currentItem.synonyms.join(', ')}</span>
              </div>
            )}
            {currentItem.antonyms?.length > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-duo-purpleLight border border-duo-purple text-duo-purpleDark font-fredoka text-[10px] font-bold">
                <span className="uppercase">Ant:</span>
                <span>{currentItem.antonyms.join(', ')}</span>
              </div>
            )}
          </div>
        )}

        {/* Definition Box */}
        <div className="w-full p-2.5 rounded-2xl bg-duo-gray-50 border-2 border-duo-gray-100 text-center shrink-0">
          <p className="font-fredoka text-xs sm:text-sm text-duo-gray-700 font-bold leading-relaxed line-clamp-2">
            "{currentItem.definition}"
          </p>
          <button
            onClick={() => { playPop(); speakText(currentItem.definition); }}
            className="mt-1 text-duo-blue font-fredoka text-[11px] font-bold inline-flex items-center gap-1 active:scale-95 transition-all"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Hear Meaning</span>
          </button>
        </div>

        {/* Example Sentence */}
        {currentItem.teacherSentence && (
          <div className="w-full flex items-center justify-between gap-1 px-2.5 py-1 rounded-xl bg-white border border-duo-gray-200 text-duo-gray-700 font-fredoka text-[11px] shrink-0 mt-1">
            <p className="italic line-clamp-1">"{currentItem.teacherSentence}"</p>
            <button
              onClick={() => { playPop(); speakText(currentItem.teacherSentence); }}
              className="p-1 text-duo-blue active:scale-95 shrink-0"
              title="Hear Sentence"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* Speech Pronunciation Feedback Pill */}
      {pronounceFeedback && (
        <div className={`py-1.5 px-3 rounded-2xl flex items-center gap-2 border-2 pop shrink-0 my-1 ${
          pronounceFeedback.success 
            ? 'bg-duo-greenLight border-duo-green text-duo-greenDark' 
            : 'bg-duo-redLight border-duo-red text-duo-redDark'
        }`}>
          {pronounceFeedback.success 
            ? <CheckCircle2 className="w-4 h-4 text-duo-greenDark shrink-0" /> 
            : <XCircle className="w-4 h-4 text-duo-redDark shrink-0" />
          }
          <span className="font-fredoka text-xs font-bold">{pronounceFeedback.title}</span>
          <span className="text-[11px] font-fredoka opacity-80">{pronounceFeedback.detail}</span>
        </div>
      )}

      {/* Voice Audio Action Buttons */}
      <div className="grid grid-cols-2 gap-2 shrink-0 my-1">
        <button
          onClick={() => { playPop(); speakText(currentItem.displayTitle || currentItem.word); }}
          className="duo-btn duo-btn-blue py-2.5 text-xs sm:text-sm flex items-center justify-center gap-1.5"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen Word</span>
        </button>

        <button
          onClick={handleToggleMic}
          className={`duo-btn py-2.5 text-xs sm:text-sm flex items-center justify-center gap-1.5 ${
            isRecording 
              ? 'bg-duo-red border-b-4 border-duo-redDark text-white animate-pulse' 
              : 'duo-btn-green'
          }`}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isRecording ? 'Listening...' : 'Say It!'}</span>
        </button>
      </div>

      {/* Bottom Pinned Controls (Previous & Next) */}
      <div className="flex items-center justify-between shrink-0 pt-2 border-t-2 border-duo-gray-100 mt-1">
        <div className="flex gap-2">
          <button
            onClick={() => { playPop(); setPronounceFeedback(null); if (onPrev) onPrev(); }}
            className="duo-btn duo-btn-white px-4 py-2 text-xs"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => { playPop(); setPronounceFeedback(null); if (onNext) onNext(); }}
            className="duo-btn duo-btn-white px-4 py-2 text-xs"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => { playPop(); onOpenChat(); }}
          className="duo-btn duo-btn-purple px-4 py-2 text-xs flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
          <span>Ask AI Tutor</span>
        </button>
      </div>

    </section>
  );
}
