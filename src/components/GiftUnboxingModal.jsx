import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, CheckCircle2, RotateCcw } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { fireConfetti, playCorrect, speakText, playPop } from '../utils/audio';

export function GiftUnboxingModal({ onClose, onPickNext }) {
  const { child, claimGift } = useApp();
  const [isUnwrapped, setIsUnwrapped] = useState(false);
  const gift = child.giftGoal || {
    title: 'Awesome Toy',
    icon: '🧸',
    targetQuestions: 20
  };

  useEffect(() => {
    fireConfetti(true);
    playCorrect();
    setTimeout(() => {
      speakText(
        `Congratulations ${child.name}! You solved all ${gift.targetQuestions} challenges and unlocked your ${gift.title}! You are an amazing superstar explorer!`
      );
    }, 400);
  }, []);

  const handleClaim = () => {
    playPop();
    claimGift();
    if (onPickNext) onPickNext();
    else if (onClose) onClose();
  };

  return (
    <div className="modal" style={{ zIndex: 120 }}>
      <div
        className="modalPanel compact"
        style={{
          maxWidth: '420px',
          padding: '30px 24px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)'
        }}
      >
        {/* Celebration Header */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef08a', color: '#854d0e', padding: '5px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 900, marginBottom: '14px' }}>
          <Trophy size={15} /> CHALLENGE COMPLETED!
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 6px', color: '#0f172a', letterSpacing: '-0.5px' }}>
          You Unlocked Your Gift!
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>
          You answered all <b>{gift.targetQuestions}</b> challenges without stopping!
        </p>

        {/* 3D Animated Gift Box or Unwrapped Prize */}
        <div
          onClick={() => {
            setIsUnwrapped(true);
            fireConfetti(false);
          }}
          style={{
            cursor: 'pointer',
            margin: '20px auto',
            width: '150px',
            height: '150px',
            borderRadius: '30px',
            background: 'radial-gradient(circle, #ffffff 0%, #e0f2fe 100%)',
            boxShadow: '0 16px 36px rgba(2, 132, 199, 0.25)',
            display: 'grid',
            placeItems: 'center',
            fontSize: isUnwrapped ? '80px' : '75px',
            border: '2px solid #bae6fd',
            transition: 'transform 0.2s ease',
            animation: !isUnwrapped ? 'rocketBob 1.5s ease-in-out infinite alternate' : 'none'
          }}
          title={!isUnwrapped ? 'Tap to open!' : 'Reward claimed!'}
        >
          {isUnwrapped ? gift.icon : '🎁'}
        </div>

        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0369a1', marginBottom: '20px' }}>
          {!isUnwrapped ? '✨ Tap the gift box to unwrap! ✨' : `🎉 Unlocked: ${gift.title}! 🎉`}
        </div>

        {/* Reward Bonus Pill */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
          <span className="pill" style={{ background: '#fef3c7', color: '#d97706', fontSize: '12px', padding: '6px 14px' }}>
            +100 Bonus XP ⭐
          </span>
          <span className="pill" style={{ background: '#dcfce7', color: '#15803d', fontSize: '12px', padding: '6px 14px' }}>
            +1 Day Streak 🔥
          </span>
        </div>

        {/* Claim & Next Challenge Button */}
        <button className="glossyPillBtn" onClick={handleClaim}>
          <Sparkles size={18} /> Claim & Choose Next Reward!
        </button>
      </div>
    </div>
  );
}
