import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Settings, 
  RotateCcw,
  Sparkles,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { playPop, playCorrect, playIncorrect, triggerAudioTone } from '../utils/audio';

export default function EducatorGateModal({
  isOpen,
  onClose,
  isPenaltyEnabled,
  setIsPenaltyEnabled,
  isDarkMode,
  setIsDarkMode,
  isMuted,
  onToggleAudio,
  onOpenParentStudio,
  onResetStats
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [challenge, setChallenge] = useState({ f1: 8, f2: 7, ans: 56, options: [56, 48, 64] });

  const generateChallenge = () => {
    const f1 = Math.floor(Math.random() * 5) + 5; // 5 - 9
    const f2 = Math.floor(Math.random() * 6) + 4; // 4 - 9
    const ans = f1 * f2;
    const distractors = [ans + (Math.random() > 0.5 ? 8 : -8), ans + (Math.random() > 0.5 ? 4 : -6)];
    const options = [ans, ...distractors].sort(() => 0.5 - Math.random());
    setChallenge({ f1, f2, ans, options });
    setIsUnlocked(false);
  };

  useEffect(() => {
    if (isOpen) {
      generateChallenge();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectAnswer = (picked) => {
    if (picked === challenge.ans) {
      playCorrect();
      setIsUnlocked(true);
    } else {
      playIncorrect();
      generateChallenge();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white pop">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-fredoka font-bold text-base leading-tight">Educator Portal Gate</h3>
              <p className="text-[10px] text-slate-400 font-fredoka">Institutional Governance & Controls</p>
            </div>
          </div>
          <button 
            onClick={() => { playPop(); onClose(); }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Step 1: Security Math Gate */}
        {!isUnlocked ? (
          <div className="text-center py-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-fredoka">
              Adult verification: Solve math challenge:
            </p>
            <div className="text-2xl font-fredoka font-bold bg-slate-100 dark:bg-slate-800 py-3 rounded-2xl mb-3 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300">
              <span>{challenge.f1}</span> × <span>{challenge.f2}</span> = ?
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-2">
              {challenge.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(opt)}
                  className="squish-btn py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 font-fredoka text-sm font-bold hover:border-indigo-500 hover:bg-indigo-50"
                >
                  {opt}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-fredoka">Adults only</span>
          </div>
        ) : (
          /* Step 2: Unlocked Institutional Settings Dashboard */
          <div className="space-y-2.5 text-xs font-medium py-1">
            
            {/* Penalty System Setting */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-fredoka font-bold text-xs text-slate-800 dark:text-white">Penalty System (-1 pt)</p>
                <p className="text-[10px] text-slate-400">Deduct 1 score point on error</p>
              </div>
              <button
                onClick={() => { playPop(); setIsPenaltyEnabled(!isPenaltyEnabled); }}
                className={`px-3 py-1 rounded-xl text-xs font-fredoka font-bold transition-all ${
                  isPenaltyEnabled 
                    ? 'bg-emerald-500 text-white shadow-xs' 
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {isPenaltyEnabled ? 'ENABLED' : 'OFF'}
              </button>
            </div>

            {/* Dark / Light Mode */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-fredoka font-bold text-xs text-slate-800 dark:text-white">Appearance Universe</p>
                <p className="text-[10px] text-slate-400">Light / Dark institutional mode</p>
              </div>
              <button
                onClick={() => { playPop(); setIsDarkMode(!isDarkMode); }}
                className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-fredoka font-bold text-xs flex items-center gap-1 btn-press"
              >
                {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>

            {/* Audio SFX */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-fredoka font-bold text-xs text-slate-800 dark:text-white">Synthesizer SFX</p>
                <p className="text-[10px] text-slate-400">Zero-latency acoustic feedback</p>
              </div>
              <button
                onClick={() => { onToggleAudio(); }}
                className={`px-3 py-1 rounded-xl text-xs font-fredoka font-bold transition-all ${
                  !isMuted 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700'
                }`}
              >
                {!isMuted ? 'SFX ON' : 'MUTED'}
              </button>
            </div>

            {/* Parent Studio Camera & Upload Trigger */}
            <button
              onClick={() => { playPop(); onClose(); onOpenParentStudio(); }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-fredoka font-bold text-xs shadow-squish-purple flex items-center justify-center gap-1.5 squish-btn"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Launch Parent Studio (Camera & OCR)</span>
            </button>

            {/* Save & Exit */}
            <button
              onClick={() => { playPop(); onClose(); }}
              className="w-full mt-2 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-fredoka font-bold text-xs btn-press"
            >
              Save & Exit Gate
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
