import React, { useState } from 'react';
import { X, Sparkles, Trophy, Check } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { playPop, playCorrect } from '../utils/audio';

export const GIFT_OPTIONS = [
  {
    id: 'food',
    category: 'food',
    title: 'Delicious Food Treat',
    desc: 'Pizza Party, Ice Cream Sundae or Fresh Burger',
    icon: '🍕',
    accentColor: '#FF6B6B',
    bgColor: '#FFF5F5'
  },
  {
    id: 'juice',
    category: 'juice',
    title: 'Yummy Juice & Smoothie',
    desc: 'Rainbow Berry Smoothie or Mango Slushie',
    icon: '🧃',
    accentColor: '#48DBFB',
    bgColor: '#F0F9FF'
  },
  {
    id: 'clothes',
    category: 'clothes',
    title: 'Cool Clothes & Outfit',
    desc: 'Superhero Cape, Cool Sneakers or Explorer Jacket',
    icon: '👕',
    accentColor: '#A55EEA',
    bgColor: '#F8F5FF'
  },
  {
    id: 'toy',
    category: 'toy',
    title: 'Awesome Fun Toy',
    desc: 'Lego Space Robot, Dino Plushie or Race Car',
    icon: '🧸',
    accentColor: '#FF9F43',
    bgColor: '#FFF9F0'
  }
];

const TARGET_LENGTHS = [
  { count: 70, label: '70 Questions Marathon', badge: '🏆 Week 5 Grand Master (70 Qs)' }
];

export function GiftSelectorModal({ onClose, onConfirm }) {
  const { child, setGiftGoal } = useApp();
  const [selectedGiftId, setSelectedGiftId] = useState(
    child.giftGoal?.category || 'toy'
  );
  const [selectedCount, setSelectedCount] = useState(70);

  const handleSelect = (giftId) => {
    playPop();
    setSelectedGiftId(giftId);
  };

  const handleSave = () => {
    playCorrect();
    const gift = GIFT_OPTIONS.find((g) => g.id === selectedGiftId) || GIFT_OPTIONS[3];
    const existingProgress = child?.giftGoal?.progress || 0;
    const existingAnswered = child?.giftGoal?.answeredQuestionIds || [];
    setGiftGoal({
      category: gift.category,
      title: `${gift.title} ${gift.icon}`,
      icon: gift.icon,
      targetQuestions: selectedCount,
      progress: existingProgress,
      answeredQuestionIds: existingAnswered,
      isUnlocked: existingProgress >= selectedCount
    });
    if (onConfirm) onConfirm();
    if (onClose) onClose();
  };

  return (
    <div className="modal" style={{ zIndex: 100 }}>
      <div className="modalPanel compact" style={{ maxWidth: '440px', padding: '22px 20px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Special Reward Quest
            </div>
            <h2 style={{ fontSize: '23px', margin: '4px 0', color: '#0f172a', fontWeight: 900 }}>
              Which gift do you want?
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
              Pick your reward and solve challenges to unlock it!
            </p>
          </div>
          {onClose && (
            <button
              onClick={() => {
                playPop();
                onClose();
              }}
              style={{
                border: 0,
                background: '#f1f5f9',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 4 Large 3D Gift Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '18px 0' }}>
          {GIFT_OPTIONS.map((g) => {
            const isChosen = selectedGiftId === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleSelect(g.id)}
                style={{
                  border: isChosen ? `2.5px solid ${g.accentColor}` : '1.5px solid #e2e8f0',
                  background: isChosen ? g.bgColor : '#ffffff',
                  borderRadius: '20px',
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: isChosen ? `0 8px 20px ${g.accentColor}33` : '0 4px 10px rgba(0,0,0,0.03)',
                  transform: isChosen ? 'scale(1.02)' : 'none',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                {isChosen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: g.accentColor,
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'grid',
                      placeItems: 'center'
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
                <div style={{ fontSize: '42px', marginBottom: '8px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                  {g.icon}
                </div>
                <strong style={{ fontSize: '14px', color: '#1e293b', lineHeight: 1.2 }}>
                  {g.title}
                </strong>
                <small style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px', lineHeight: 1.3 }}>
                  {g.desc}
                </small>
              </button>
            );
          })}
        </div>

        {/* Target Challenge Length Picker */}
        <div style={{ margin: '16px 0 8px', fontSize: '13px', fontWeight: 800, color: '#334155' }}>
          Choose Challenge Length:
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {TARGET_LENGTHS.map((t) => (
            <button
              key={t.count}
              type="button"
              onClick={() => {
                playPop();
                setSelectedCount(t.count);
              }}
              style={{
                flex: 1,
                padding: '10px 4px',
                borderRadius: '14px',
                border: selectedCount === t.count ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                background: selectedCount === t.count ? '#e0f2fe' : '#ffffff',
                color: selectedCount === t.count ? '#0369a1' : '#475569',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800 }}>{t.badge}</div>
              <div style={{ fontSize: '12px', fontWeight: 700 }}>{t.label}</div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '18px' }}>
          <button
            className="glossyPillBtn"
            style={{ width: '100%' }}
            onClick={handleSave}
          >
            <Sparkles size={18} /> Lock in My Goal & Begin!
          </button>

          {onClose && (
            <button
              type="button"
              onClick={() => {
                playPop();
                onClose();
              }}
              style={{
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '99px',
                padding: '10px 18px',
                fontSize: '13.5px',
                fontWeight: 800,
                color: '#475569',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              ← Back to Adventure
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
