import React, { useState } from 'react';
import { Zap, CheckCircle, Gift } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GiftSelectorModal } from '../components/GiftSelectorModal';
import { GiftUnboxingModal } from '../components/GiftUnboxingModal';
import { fireConfetti } from '../utils/audio';

const MILESTONES = [
  { q: 10,  emoji: '⭐', label: 'Star Earner',    color: '#f59e0b' },
  { q: 25,  emoji: '🏅', label: 'Gold Learner',   color: '#f97316' },
  { q: 40,  emoji: '🏆', label: 'Trophy Hunter',  color: '#8b5cf6' },
  { q: 55,  emoji: '💎', label: 'Diamond Coder',  color: '#0ea5e9' },
  { q: 70,  emoji: '🎁', label: 'Gift Unlocked!', color: '#22c55e' },
];

const MOTIVATIONAL = [
  "Every question gets you closer! 🚀",
  "You're doing amazing! Keep studying! 📚",
  "Champions earn one question at a time! ⭐",
  "Your gift is waiting — you've got this! 🎁",
];

export function GiftPage({ go }) {
  const { child } = useApp();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [unboxOpen, setUnboxOpen] = useState(false);

  const gift = child?.giftGoal || { title: 'Pick Your Gift!', icon: '🎁', targetQuestions: 70, progress: 0, isUnlocked: false, hasPicked: false };
  const progress = Math.min(gift.targetQuestions, gift.progress || 0);
  const pct = Math.min(100, Math.round((progress / Math.max(1, gift.targetQuestions)) * 100));
  const remaining = Math.max(0, gift.targetQuestions - progress);
  const isUnlocked = gift.isUnlocked || progress >= gift.targetQuestions;
  const motto = MOTIVATIONAL[Math.floor(Date.now() / 60000) % MOTIVATIONAL.length];

  return (
    <div className="page-content" style={{ minHeight: '100%' }}>
      {/* Gift hero */}
      <div style={{
        background: isUnlocked
          ? 'linear-gradient(135deg,#f0fdf4,#dcfce7)'
          : 'linear-gradient(135deg,#fdf4ff,#eff6ff)',
        border: `1.5px solid ${isUnlocked ? '#bbf7d0' : '#e9d5ff'}`,
        borderRadius: '24px', padding: '24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '58px', lineHeight: 1 }} className="animate-kid-bounce">
          {gift.hasPicked ? gift.icon : '🎁'}
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#1e293b' }}>
            {isUnlocked ? '🎉 Gift Unlocked!' : gift.hasPicked ? gift.title : 'Choose Your Gift!'}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
            {isUnlocked ? 'Amazing! Tap below to open it!' : motto}
          </div>
        </div>

        {/* Circular ring */}
        <div style={{ position: 'relative', width: '130px', height: '130px' }}>
          <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="65" cy="65" r="52" fill="none" stroke="#e9d5ff" strokeWidth="12" />
            <circle cx="65" cy="65" r="52" fill="none"
              stroke={isUnlocked ? '#22c55e' : '#8b5cf6'} strokeWidth="12" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
              style={{ transition: 'stroke-dashoffset .8s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: isUnlocked ? '#22c55e' : '#8b5cf6' }}>{pct}%</span>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>COMPLETE</span>
          </div>
        </div>

        <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>
          <span style={{ fontWeight: 900, color: '#6366f1' }}>{progress}</span> / {gift.targetQuestions} questions answered
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', background: '#e9d5ff', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: isUnlocked ? 'linear-gradient(90deg,#22c55e,#16a34a)' : 'linear-gradient(90deg,#8b5cf6,#6366f1)',
            borderRadius: '99px', transition: 'width .8s ease',
          }} />
        </div>
        {!isUnlocked && (
          <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: 800 }}>
            🔓 {remaining} more to unlock!
          </div>
        )}
      </div>

      {/* Milestone path */}
      <div style={{ background: '#fff', borderRadius: '20px', border: '1.5px solid #f1f5f9', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 900, color: '#1e293b', marginBottom: '14px' }}>
          🗺️ Milestone Path
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MILESTONES.map((m, i) => {
            const reached = progress >= m.q;
            return (
              <div key={m.q} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', borderRadius: '14px',
                background: reached ? '#f0fdf4' : '#f8fafc',
                border: `1.5px solid ${reached ? '#bbf7d0' : '#e2e8f0'}`,
              }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                  background: reached ? m.color : '#e2e8f0',
                  display: 'grid', placeItems: 'center', fontSize: '18px',
                }}>
                  {reached ? <CheckCircle size={18} color="#fff" /> : m.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: reached ? '#15803d' : '#475569' }}>
                    {m.label} {reached ? '✓' : ''}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                    {m.q} questions
                  </div>
                </div>
                {!reached && progress < m.q && (
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8' }}>
                    {m.q - progress} left
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      {isUnlocked ? (
        <button
          onClick={() => { fireConfetti(); setUnboxOpen(true); }}
          className="btn-primary"
          style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', borderBottomColor: '#15803d', boxShadow: '0 4px 16px rgba(34,197,94,.4)' }}
        >
          🎁 Open My Gift!
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn-primary" onClick={() => go('learn')}>
            <Zap size={18} /> Study Now to Earn It!
          </button>
          <button
            className="btn-secondary"
            onClick={() => setSelectorOpen(true)}
            style={{ border: '1.5px solid #c7d2fe', color: '#6366f1' }}
          >
            <Gift size={16} /> {gift.hasPicked ? 'Change Gift Goal' : 'Choose My Gift'}
          </button>
        </div>
      )}

      {/* XP / Streak / Minutes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        {[
          { emoji: '⭐', label: 'XP',      value: child?.xp || 0 },
          { emoji: '🔥', label: 'Streak',  value: `${child?.streak || 0}d` },
          { emoji: '⏱️', label: 'Minutes', value: child?.minutes || 0 },
        ].map(({ emoji, label, value }) => (
          <div key={label} style={{
            background: '#fff', borderRadius: '16px', padding: '14px 8px',
            textAlign: 'center', border: '1.5px solid #f1f5f9',
            boxShadow: '0 2px 8px rgba(0,0,0,.04)',
          }}>
            <div style={{ fontSize: '22px' }}>{emoji}</div>
            <div style={{ fontSize: '17px', fontWeight: 900, color: '#1e293b', marginTop: '2px' }}>{value}</div>
            <div style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
          </div>
        ))}
      </div>

      {selectorOpen && <GiftSelectorModal onClose={() => setSelectorOpen(false)} onConfirm={() => setSelectorOpen(false)} />}
      {unboxOpen && <GiftUnboxingModal gift={gift} onClose={() => setUnboxOpen(false)} />}
    </div>
  );
}
