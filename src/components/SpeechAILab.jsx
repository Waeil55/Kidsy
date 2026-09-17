import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw,
  Radio
} from 'lucide-react';
import { 
  playPop, 
  playCorrect, 
  playIncorrect, 
  speakText, 
  fireConfetti, 
  createSpeechRecognizer, 
  PRAISES 
} from '../utils/audio';

export default function SpeechAILab({
  items = [],
  onScoreUpdate,
  onOpenChat
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [simulatedDecibels, setSimulatedDecibels] = useState(-18);
  const [confidence, setConfidence] = useState(96.4);

  const currentItem = items.length > 0 ? items[currentIndex % items.length] : {
    word: "oppose",
    displayTitle: "Oppose",
    definition: "To be against something"
  };

  // Animate decibel meter when recording
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSimulatedDecibels(Math.floor(-12 - Math.random() * 18));
      }, 200);
    } else {
      setSimulatedDecibels(-24);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleListenTarget = () => {
    playPop();
    speakText(currentItem.displayTitle || currentItem.word);
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
        const cleanT = transcript.toLowerCase().replace(/[^a-z0-9]/g, "");
        const cleanW = currentItem.word.toLowerCase().replace(/[^a-z0-9]/g, "");
        const isMatch = cleanT.includes(cleanW) || cleanT === cleanW;

        if (isMatch) {
          playCorrect();
          fireConfetti(false);
          setConfidence(Math.floor(92 + Math.random() * 7));
          onScoreUpdate(10, 'Acoustic Phoneme Matched! +10 Points');
          const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
          speakText(praise, 1.1, 1.25);
          setFeedback({
            success: true,
            title: "Super pronunciation match!",
            detail: `Heard: "${transcript}"`
          });
        } else {
          playIncorrect();
          onScoreUpdate(-1, 'Speech Missed! Score deducted 1 point (-1)');
          setFeedback({
            success: false,
            title: "Phoneme mismatch - try again!",
            detail: `Heard: "${transcript}" (Target: ${currentItem.word})`
          });
        }
      },
      () => setIsRecording(false),
      () => setIsRecording(false)
    );

    if (recognizer) {
      try {
        setIsRecording(true);
        setFeedback(null);
        recognizer.start();
      } catch (e) {
        setIsRecording(false);
      }
    } else {
      alert("Microphone speech recognition is not supported on this browser.");
    }
  };

  const simulateSuccess = () => {
    playCorrect();
    fireConfetti(false);
    onScoreUpdate(10, 'Acoustic Phoneme Matched! +10 Points');
    setFeedback({
      success: true,
      title: "Simulated Match Verified! +10 Points",
      detail: `Accurate pronunciation detected!`
    });
  };

  const simulateMiss = () => {
    playIncorrect();
    onScoreUpdate(-1, 'Speech Missed! Score returned back 1 point (-1)');
    setFeedback({
      success: false,
      title: "Simulated Miss! -1 Point",
      detail: "Try articulating clearly."
    });
  };

  const nextWord = () => {
    playPop();
    setFeedback(null);
    setCurrentIndex((currentIndex + 1) % items.length);
  };

  return (
    <section className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto text-center">
      
      {/* Top Status */}
      <div className="flex justify-between items-center px-1 shrink-0 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-fredoka font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Speech AI Acoustic Lab</span>
          </span>
          <span className="text-[10px] font-fredoka text-slate-400">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        <button
          onClick={nextWord}
          className="text-xs font-fredoka font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1 btn-press"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Next Word</span>
        </button>
      </div>

      {/* Main Workspace Card */}
      <div className="flex-1 min-h-[330px] bg-white dark:bg-kid-nightCard rounded-3xl p-3 sm:p-4 shadow-squish-card border-2 border-slate-100 dark:border-kid-nightBorder flex flex-col justify-between my-1">
        
        {/* Target Prompt Box with Audio Listen Trigger */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-3 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between shrink-0">
          <div className="text-left">
            <span className="text-[9px] font-fredoka uppercase text-emerald-600 dark:text-emerald-400 font-bold block">
              Target Word / Phoneme
            </span>
            <span className="font-fredoka text-xl font-bold text-slate-900 dark:text-white capitalize">
              {currentItem.displayTitle || currentItem.word}
            </span>
          </div>
          <button 
            onClick={handleListenTarget}
            className="squish-btn w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md active:scale-95"
            title="Hear Target Word"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Animated Audio Spectrometer & Waveform Visualizer */}
        <div className="bg-slate-900 rounded-2xl p-3 my-2 border border-slate-800 flex flex-col items-center shrink-0 shadow-inner">
          <div className="flex items-center justify-center gap-1.5 h-12 w-full px-4 mb-1">
            <div className={`wave-line w-2 bg-emerald-400 rounded-full ${isRecording ? 'animate-wave-bar' : 'h-3'}`}></div>
            <div className={`wave-line w-2 bg-emerald-400 rounded-full ${isRecording ? 'animate-wave-bar' : 'h-5'}`}></div>
            <div className={`wave-line w-2 bg-teal-400 rounded-full ${isRecording ? 'animate-wave-bar' : 'h-8'}`}></div>
            <div className={`wave-line w-2 bg-cyan-400 rounded-full ${isRecording ? 'animate-wave-bar' : 'h-10'}`}></div>
            <div className={`wave-line w-2 bg-indigo-400 rounded-full ${isRecording ? 'animate-wave-bar' : 'h-7'}`}></div>
            <div className={`wave-line w-2 bg-purple-400 rounded-full ${isRecording ? 'animate-wave-bar' : 'h-9'}`}></div>
            <div className={`wave-line w-2 bg-pink-400 rounded-full ${isRecording ? 'animate-wave-bar' : 'h-5'}`}></div>
            <div className={`wave-line w-2 bg-emerald-400 rounded-full ${isRecording ? 'animate-wave-bar' : 'h-3'}`}></div>
          </div>
          <div className="flex items-center justify-between w-full text-[10px] font-fredoka text-slate-400 px-2 pt-1 border-t border-slate-800">
            <span>Confidence: <strong className="text-emerald-400 font-bold">{confidence}%</strong></span>
            <span>Decibels: <strong className="text-cyan-400 font-bold">{simulatedDecibels} dB</strong></span>
          </div>
        </div>

        {/* Feedback Alert if Available */}
        {feedback && (
          <div className={`py-1.5 px-3 rounded-xl flex items-center justify-center gap-2 border shadow-xs pop shrink-0 my-1 ${
            feedback.success ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}>
            {feedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span className="text-xs font-fredoka font-bold">{feedback.title}</span>
          </div>
        )}

        {/* Interactive Big Microphone Trigger */}
        <div className="py-2 flex flex-col items-center my-auto">
          <button
            onClick={handleToggleMic}
            className={`squish-btn relative w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-squish-emerald flex items-center justify-center text-white text-3xl mb-2 transition-all ${
              isRecording 
                ? 'bg-rose-600 animate-pulse shadow-rose-500/50' 
                : 'bg-gradient-to-tr from-emerald-500 to-teal-600'
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          <span className="font-fredoka text-xs font-bold text-slate-600 dark:text-slate-300">
            {isRecording ? 'Listening... speak clearly!' : 'Tap Mic to Speak Word'}
          </span>
        </div>

      </div>

      {/* Simulated Evaluation Buttons for quick testing */}
      <div className="grid grid-cols-2 gap-2 shrink-0 mt-1">
        <button
          onClick={simulateSuccess}
          className="py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-fredoka text-xs font-bold shadow-sm squish-btn"
        >
          Simulate Match (+10)
        </button>
        <button
          onClick={simulateMiss}
          className="py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 font-fredoka text-xs font-bold border border-rose-200 dark:border-rose-800 squish-btn"
        >
          Simulate Miss (-1)
        </button>
      </div>

    </section>
  );
}
