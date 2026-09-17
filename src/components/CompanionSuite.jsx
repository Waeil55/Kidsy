import React from 'react';
import { Heart, Sparkles, Volume2 } from 'lucide-react';
import { playPop, playCorrect, speakText, fireConfetti } from '../utils/audio';

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
    { emoji: '🦊', name: 'Pip the Fox', color: 'border-duo-orange bg-duo-orangeLight' },
    { emoji: '🐼', name: 'Bao the Panda', color: 'border-duo-gray-300 bg-duo-gray-50' },
    { emoji: '🦄', name: 'Glitter the Unicorn', color: 'border-duo-purple bg-duo-purpleLight' },
    { emoji: '🤖', name: 'Robo 404', color: 'border-duo-blue bg-duo-blueLight' },
  ];

  const hatsList = [
    { emoji: '👑', name: 'Crown' },
    { emoji: '🎩', name: 'Top Hat' },
    { emoji: '🚀', name: 'Rocket' },
    { emoji: '🌸', name: 'Blossom' },
    { emoji: '🧢', name: 'Cap' },
    { emoji: '⭐', name: 'Star' },
  ];

  const handlePet = () => {
    playPop();
    playCorrect();
    fireConfetti(false);
    speakText(`Yay! I am ${companionName}! You're doing amazing! Let's keep learning!`, 1.15, 1.3);
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar py-2 px-4 max-w-lg mx-auto w-full select-none text-center">
      
      {/* Header */}
      <div className="mb-2">
        <h2 className="font-fredoka font-bold text-xl sm:text-2xl text-duo-gray-800 leading-tight">
          Mascot Companion
        </h2>
        <p className="text-xs sm:text-sm font-fredoka text-duo-gray-500 mt-0.5">
          Customize your learning pal and equip cool accessories!
        </p>
      </div>

      {/* Main Companion Pedestal Card */}
      <div className="duo-card p-4 my-auto flex flex-col items-center">
        
        {/* Interactive Avatar Pedestal */}
        <div
          onClick={handlePet}
          className="cursor-pointer group relative w-36 h-36 mx-auto my-2 flex items-center justify-center active:scale-95 transition-transform"
          title="Tap to pet your buddy!"
        >
          <div className="w-32 h-32 rounded-full bg-duo-gray-50 border-4 border-duo-gray-100 flex items-center justify-center text-7xl relative shadow-inner">
            <span className="animate-bounce-subtle">{companionEmoji}</span>
            {companionHat && (
              <span className="absolute -top-3 text-4xl pop">{companionHat}</span>
            )}
          </div>
          <div className="absolute bottom-1 right-2 w-8 h-8 rounded-full bg-duo-red text-white flex items-center justify-center shadow-md border-2 border-white">
            <Heart className="w-4 h-4 fill-current animate-pulse" />
          </div>
        </div>

        <h3 className="font-fredoka font-bold text-xl text-duo-gray-800 mt-1 leading-tight">
          {companionName}
        </h3>
        <p className="text-xs font-fredoka text-duo-blue font-semibold mt-0.5">
          Tap mascot to hear cheerful greeting!
        </p>

        {/* Companion Species Selector */}
        <div className="w-full mt-4 pt-3 border-t-2 border-duo-gray-100">
          <span className="text-[11px] font-fredoka font-bold uppercase text-duo-gray-400 block mb-2 text-left">
            Choose Your Buddy:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {speciesList.map((sp) => {
              const isSelected = companionEmoji === sp.emoji;
              return (
                <button
                  key={sp.emoji}
                  onClick={() => {
                    playPop();
                    setCompanionEmoji(sp.emoji);
                    setCompanionName(sp.name);
                    speakText(`Meet ${sp.name}! Ready for action!`, 1.1, 1.25);
                  }}
                  className={`duo-btn py-2 px-1 rounded-2xl flex flex-col items-center transition-all ${
                    isSelected 
                      ? 'duo-btn-blue' 
                      : 'duo-btn-white'
                  }`}
                >
                  <span className="text-2xl mb-0.5">{sp.emoji}</span>
                  <span className="font-fredoka text-[10px] font-bold truncate w-full">
                    {sp.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Headwear Accessories */}
        <div className="w-full mt-3 pt-3 border-t-2 border-duo-gray-100">
          <span className="text-[11px] font-fredoka font-bold uppercase text-duo-gray-400 block mb-2 text-left">
            Equip Headwear:
          </span>
          <div className="flex justify-center gap-2 flex-wrap">
            {hatsList.map((h) => {
              const isEquipped = companionHat === h.emoji;
              return (
                <button
                  key={h.emoji}
                  onClick={() => {
                    playPop();
                    setCompanionHat(isEquipped ? '' : h.emoji);
                  }}
                  className={`duo-btn w-11 h-11 text-xl ${
                    isEquipped ? 'duo-btn-purple' : 'duo-btn-white'
                  }`}
                  title={h.name}
                >
                  {h.emoji}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Rewards Currency Footer */}
      <div className="grid grid-cols-2 gap-2 shrink-0 mt-2">
        <div className="duo-card p-2.5 flex items-center gap-2 text-left">
          <span className="text-2xl">🏆</span>
          <div>
            <span className="text-[9px] font-fredoka uppercase text-duo-gray-400 font-bold block">Total XP</span>
            <span className="font-fredoka font-bold text-sm text-duo-gray-800">{score} XP</span>
          </div>
        </div>

        <div className="duo-card p-2.5 flex items-center gap-2 text-left">
          <span className="text-2xl">💎</span>
          <div>
            <span className="text-[9px] font-fredoka uppercase text-duo-gray-400 font-bold block">Gems</span>
            <span className="font-fredoka font-bold text-sm text-duo-blueDark">{gems} Gems</span>
          </div>
        </div>
      </div>

    </div>
  );
}
