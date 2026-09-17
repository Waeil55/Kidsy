import React from 'react';
import { 
  Sparkles, 
  Heart, 
  Crown, 
  Award, 
  Smile, 
  Volume2 
} from 'lucide-react';
import { playPop, triggerAudioTone, speakText, fireConfetti } from '../utils/audio';

export default function CompanionSuite({
  companionEmoji,
  setCompanionEmoji,
  companionName,
  setCompanionName,
  companionHat,
  setCompanionHat,
  gems = 450,
  score = 100
}) {
  const speciesList = [
    { emoji: '🦊', name: 'Captain Pip', role: 'Clever Explorer', bg: 'bg-amber-100 border-amber-400' },
    { emoji: '🐼', name: 'Master Bao', role: 'Wise Scholar', bg: 'bg-slate-100 border-slate-300' },
    { emoji: '🦄', name: 'Star Glitter', role: 'Magic Dreamer', bg: 'bg-pink-100 border-pink-300' },
    { emoji: '🤖', name: 'Unit 404', role: 'Math & Tech Bot', bg: 'bg-cyan-100 border-cyan-300' },
  ];

  const hatsList = [
    { emoji: '👑', name: 'Royal Crown' },
    { emoji: '🎩', name: 'Top Hat' },
    { emoji: '🚀', name: 'Cosmic Rocket' },
    { emoji: '🌸', name: 'Spring Blossom' },
    { emoji: '🧢', name: 'Cool Cap' },
    { emoji: '⭐', name: 'Super Star' },
  ];

  const handlePetCompanion = () => {
    playPop();
    triggerAudioTone('success');
    fireConfetti(false);
    const cheer = `Hello there! I am ${companionName}, your learning buddy! Let's conquer the next lesson!`;
    speakText(cheer, 1.15, 1.3);
  };

  const selectSpecies = (sp) => {
    playPop();
    setCompanionEmoji(sp.emoji);
    setCompanionName(sp.name);
    speakText(`Yay! ${sp.name} is ready for adventure!`, 1.1, 1.25);
  };

  const selectHat = (hatEmoji) => {
    playPop();
    setCompanionHat(companionHat === hatEmoji ? '' : hatEmoji);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-y-auto no-scrollbar py-1 w-full max-w-lg mx-auto text-center">
      
      {/* Top Banner */}
      <div className="flex justify-between items-center px-1 shrink-0 mb-1">
        <span className="text-[10px] font-fredoka font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-lg border border-purple-200 dark:border-purple-800 flex items-center gap-1">
          <Smile className="w-3 h-3" />
          <span>Mascot Companion & Rewards Suite</span>
        </span>
        <span className="text-xs font-fredoka font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center gap-1">
          <span>💎 {gems} Gems</span>
        </span>
      </div>

      {/* Main Companion Pedestal Card */}
      <div className="bg-white dark:bg-kid-nightCard rounded-3xl p-4 shadow-squish-card border-2 border-slate-100 dark:border-kid-nightBorder my-1 flex flex-col items-center">
        
        {/* Pedestal with Glowing Halo */}
        <div 
          onClick={handlePetCompanion}
          className="cursor-pointer group relative w-36 h-36 mx-auto my-2 flex items-center justify-center active:scale-95 transition-transform"
          title="Tap to pet your companion!"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="w-32 h-32 rounded-full bg-slate-50 dark:bg-slate-800 border-4 border-white dark:border-slate-700 flex items-center justify-center text-7xl shadow-inner relative">
            <span className="animate-bounce-subtle">{companionEmoji}</span>
            {companionHat && (
              <span className="absolute -top-3 text-4xl pop">{companionHat}</span>
            )}
          </div>
          <div className="absolute bottom-0 right-2 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
            <Heart className="w-4 h-4 fill-current animate-ping" />
          </div>
        </div>

        {/* Mascot Name & Speech */}
        <h3 className="font-fredoka text-xl font-bold text-slate-800 dark:text-white mt-1 leading-none">
          {companionName}
        </h3>
        <p className="text-[11px] font-fredoka text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
          Tap companion to hear cheerful greeting!
        </p>

        {/* Switch Companion Species */}
        <div className="w-full mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-fredoka font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Switch Companion Pal:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {speciesList.map((sp) => (
              <button
                key={sp.emoji}
                onClick={() => selectSpecies(sp)}
                className={`py-2 px-1 rounded-2xl border-2 flex flex-col items-center transition-all squish-btn ${
                  companionEmoji === sp.emoji
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 scale-105 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300'
                }`}
              >
                <span className="text-2xl mb-0.5">{sp.emoji}</span>
                <span className="font-fredoka text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate w-full">
                  {sp.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Equip Accessories / Headwear */}
        <div className="w-full mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-fredoka font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Equip Headwear Accessories:
          </span>
          <div className="flex justify-center gap-2 flex-wrap">
            {hatsList.map((h) => (
              <button
                key={h.emoji}
                onClick={() => selectHat(h.emoji)}
                className={`p-2 rounded-xl border text-xl squish-btn transition-all ${
                  companionHat === h.emoji 
                    ? 'border-indigo-600 bg-indigo-100 dark:bg-indigo-950 text-white scale-110 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                }`}
                title={h.name}
              >
                {h.emoji}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Institutional Progress Stats */}
      <div className="grid grid-cols-2 gap-2 shrink-0 mt-1">
        <div className="bg-white dark:bg-kid-nightCard p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <div className="text-left">
            <span className="text-[9px] font-fredoka uppercase text-slate-400 font-bold block">Total Score</span>
            <span className="font-fredoka font-bold text-sm text-slate-900 dark:text-white">{score} Pts</span>
          </div>
        </div>

        <div className="bg-white dark:bg-kid-nightCard p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2">
          <span className="text-xl">💎</span>
          <div className="text-left">
            <span className="text-[9px] font-fredoka uppercase text-slate-400 font-bold block">Token Currency</span>
            <span className="font-fredoka font-bold text-sm text-amber-600">{gems} Gems</span>
          </div>
        </div>
      </div>

    </div>
  );
}
