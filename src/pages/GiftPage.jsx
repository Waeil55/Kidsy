import React, { useState } from 'react';
import { Gift, Star, Trophy, Zap, ChevronRight, CheckCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GiftSelectorModal } from '../components/GiftSelectorModal';
import { GiftUnboxingModal } from '../components/GiftUnboxingModal';
import { fireConfetti, playCorrect } from '../utils/audio';

// Milestone rewards shown on the progress path
const MILESTONES = [10, 25, 40, 55, 70];

const MOTIVATIONAL = [
  "Every question gets you closer! 🚀",
  "You're doing amazing! Keep reading! 📚",
  "Stars are earned one question at a time! ⭐",
  "Champions never give up! 🏆",
  "Your gift is waiting — keep going! 🎁",
];

export function GiftPage({ go }) {
  const { child } = useApp();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [unboxOpen, setUnboxOpen] = useState(false);

  const gift = child?.giftGoal || {
    title: 'Pick Your Gift!',
    icon: '🎁',
    targetQuestions: 70,
    progress: 0,
    isUnlocked: false,
    hasPicked: false,
  };

  const progress = Math.min(gift.targetQuestions, gift.progress || 0);
  const pct = Math.min(100, Math.round((progress / Math.max(1, gift.targetQuestions)) * 100));
  const remaining = Math.max(0, gift.targetQuestions - progress);
  const isUnlocked = gift.isUnlocked || progress >= gift.targetQuestions;
  const motto = MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)];

  const handleUnlock = () => {
    if (isUnlocked) {
      fireConfetti();
      setUnboxOpen(true);
    }
  };

  return (
    <div style={{
      minHeight: '100%',
      background: 'linear-gradient(160deg, #fdf4ff 0%, #eff6ff 50%, #f0fdf4 100%)',
      padding: '20px 16px 40px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', paddingTop: '8px' }}>
        <div style={{ fontSize: '56px', marginBottom: '8px' }}>{gift.hasPicked ? gift.icon : '🎁'}</div>
        <h1 style={{
          fontSize: '22px',
          fontWeight: 900,
          color: '#1e293b',
          margin: 0,
          fontFamily: "'Nunito', 'Fredoka', sans-serif",
        }}>
          {isUnlocked ? '🎉 Gift Unlocked!' : gift.hasPicked ? gift.title : 'Pick Your Gift!'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '6px', fontWeight: 600 }}>
          {isUnlocked
            ? 'Amazing work! You earned your reward!'
            : gift.hasPicked
            ? motto
            : 'Choose what you want to earn by studying!'}
        </p>
      </div>

      {/* Progress ring card */}
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        border: '2px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        {/* Circular progress */}
        <div style={{ position: 'relative', width: '140px', height: '140px' }}>
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="70" cy="70" r="58" fill="none" stroke="#f1f5f9" strokeWidth="14" />
            <circle
              cx="70" cy="70" r="58" fill="none"
              stroke={isUnlocked ? '#22c55e' : '#a855f7'}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 58}`}
              strokeDashoffset={`${2 * Math.PI * 58 * (1 - pct / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '28px', fontWeight: 900, color: isUnlocked ? '#22c55e' : '#a855f7' }}>
              {pct}%
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>Complete</span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>
            {progress} / {gift.targetQuestions} questions answered
          </div>
          {!isUnlocked && (
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
              {remaining} more to unlock your gift! 🔓
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', background: '#f1f5f9', borderRadius: '99px', height: '12px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: '99px',
            background: isUnlocked
              ? 'linear-gradient(90deg, #22c55e, #16a34a)'
              : 'linear-gradient(90deg, #a855f7, #6366f1)',
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>

      {/* Milestone path */}
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        border: '2px solid #f1f5f9',
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', margin: '0 0 16px 0' }}>
          🗺️ Reward Milestones
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MILESTONES.map((m, i) => {
            const reached = progress >= m;
            return (
              <div key={m} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', borderRadius: '14px',
                background: reached ? '#f0fdf4' : '#f8fafc',
                border: `2px solid ${reached ? '#bbf7d0' : '#e2e8f0'}`,
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: reached ? '#22c55e' : '#e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {reached
                    ? <CheckCircle size={20} color="#fff" />
                    : <span style={{ fontSize: '16px' }}>
                        {i === 0 ? '⭐' : i === 1 ? '🏅' : i === 2 ? '🏆' : i === 3 ? '💎' : '🎁'}
                      </span>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: reached ? '#15803d' : '#475569' }}>
                    {m} Questions {reached ? '— Reached! 🎉' : ''}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                    {i === 0 ? 'Star Badge unlocked'
                      : i === 1 ? 'Gold Medal unlocked'
                      : i === 2 ? 'Trophy unlocked'
                      : i === 3 ? 'Diamond rank!'
                      : '🎁 Final Gift Unlocked!'}
                  </div>
                </div>
                {!reached && (
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8' }}>
                    {m - progress > 0 ? `${m - progress} to go` : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isUnlocked ? (
          <button
            onClick={handleUnlock}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff', border: 'none', borderRadius: '20px',
              padding: '18px', fontSize: '17px', fontWeight: 900,
              cursor: 'pointer', boxShadow: '0 8px 24px rgba(34,197,94,0.4)',
              borderBottom: '4px solid #15803d', transition: 'transform 0.1s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            🎁 Open My Gift!
          </button>
        ) : (
          <>
            <button
              onClick={() => go('learn')}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: '#fff', border: 'none', borderRadius: '20px',
                padding: '16px', fontSize: '16px', fontWeight: 900,
                cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                borderBottom: '4px solid #4338ca', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <Zap size={20} /> Study Now to Earn It!
            </button>
            {!gift.hasPicked && (
              <button
                onClick={() => setSelectorOpen(true)}
                style={{
                  background: '#fff', color: '#6366f1',
                  border: '2px solid #c7d2fe', borderRadius: '20px',
                  padding: '14px', fontSize: '15px', fontWeight: 800,
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <Gift size={18} /> Choose My Gift
              </button>
            )}
            {gift.hasPicked && (
              <button
                onClick={() => setSelectorOpen(true)}
                style={{
                  background: '#f8fafc', color: '#94a3b8',
                  border: '2px solid #e2e8f0', borderRadius: '20px',
                  padding: '12px', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Change Gift Goal
              </button>
            )}
          </>
        )}
      </div>

      {/* Quick stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        {[
          { icon: '⭐', label: 'XP', value: child?.xp || 0 },
          { icon: '🔥', label: 'Streak', value: `${child?.streak || 0}d` },
          { icon: '⏱️', label: 'Minutes', value: child?.minutes || 0 },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{
            background: '#fff', borderRadius: '16px', padding: '14px 8px',
            textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            border: '2px solid #f1f5f9',
          }}>
            <div style={{ fontSize: '22px' }}>{icon}</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#1e293b' }}>{value}</div>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {selectorOpen && (
        <GiftSelectorModal
          onClose={() => setSelectorOpen(false)}
          onConfirm={() => setSelectorOpen(false)}
        />
      )}
      {unboxOpen && (
        <GiftUnboxingModal
          gift={gift}
          onClose={() => setUnboxOpen(false)}
        />
      )}
    </div>
  );
}
