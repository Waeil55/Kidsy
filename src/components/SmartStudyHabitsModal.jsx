import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Target,
  BookOpen,
  Gamepad2,
  FileEdit,
  Brain,
  Tv,
  MessageSquare,
  Gift,
  Heart,
  Sparkles,
  Trophy,
  Volume2
} from 'lucide-react';
import { playPop, playCorrect, fireConfetti, speakText } from '../utils/audio';

export function SmartStudyHabitsModal({ onClose, onRewardEarned }) {
  const HABITS = [
    {
      id: 'routine',
      title: 'Mini Routine',
      desc: 'Keep study time short (15–30 min sprints only)',
      icon: Clock,
      color: '#f59e0b',
      bg: '#fffbeb',
      border: '#fde68a'
    },
    {
      id: 'goals',
      title: 'Weekly Goals',
      desc: 'Set small, easy milestones to conquer step-by-step',
      icon: Target,
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd'
    },
    {
      id: 'reading',
      title: 'Daily Reading',
      desc: 'Read fun stories, adventure comics, or books every day',
      icon: BookOpen,
      color: '#3b82f6',
      bg: '#eff6ff',
      border: '#bfdbfe'
    },
    {
      id: 'play',
      title: 'Learn Through Play',
      desc: 'Use interactive games, flashcards, and picture quizzes',
      icon: Gamepad2,
      color: '#10b981',
      bg: '#ecfdf5',
      border: '#a7f3d0'
    },
    {
      id: 'worksheets',
      title: 'Fun Worksheets',
      desc: 'Short, colorful, and engaging hands-on activities',
      icon: FileEdit,
      color: '#f97316',
      bg: '#fff7ed',
      border: '#fed7aa'
    },
    {
      id: 'review',
      title: 'Review Lessons',
      desc: 'Revisit past topics so your memory stays rock solid',
      icon: Brain,
      color: '#ec4899',
      bg: '#fdf2f8',
      border: '#fbcfe8'
    },
    {
      id: 'screen',
      title: 'Smart Screen Time',
      desc: 'Watch purposeful educational videos & interactive labs',
      icon: Tv,
      color: '#14b8a6',
      bg: '#f0fdfa',
      border: '#99f6e4'
    },
    {
      id: 'everyday',
      title: 'Everyday Learning',
      desc: 'Spot words, shapes, and numbers during daily life',
      icon: MessageSquare,
      color: '#6366f1',
      bg: '#eef2ff',
      border: '#c7d2fe'
    },
    {
      id: 'reward',
      title: 'Reward Effort',
      desc: 'Celebrate hard work with toys, treats, and unboxing quests',
      icon: Gift,
      color: '#e11d48',
      bg: '#fff1f2',
      border: '#fecdd3'
    },
    {
      id: 'positive',
      title: 'Keep It Positive',
      desc: 'No pressure, lots of smiles, and high-five encouragement',
      icon: Heart,
      color: '#ef4444',
      bg: '#fef2f2',
      border: '#fecaca'
    }
  ];

  const todayKey = `merola_habits_${new Date().toISOString().slice(0, 10)}`;
  const [completedHabits, setCompletedHabits] = useState(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleHabit = (id) => {
    playPop();
    let updated;
    if (completedHabits.includes(id)) {
      updated = completedHabits.filter((h) => h !== id);
    } else {
      updated = [...completedHabits, id];
      playCorrect();
    }
    setCompletedHabits(updated);
    try {
      localStorage.setItem(todayKey, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    if (updated.length === HABITS.length) {
      fireConfetti(true);
      if (onRewardEarned) onRewardEarned(50);
    }
  };

  const progressPct = Math.round((completedHabits.length / HABITS.length) * 100);

  return (
    <div className="modal" style={{ zIndex: 120 }}>
      <div className="modalPanel" style={{ maxWidth: '580px', maxHeight: '92vh', overflowY: 'auto' }}>
        {/* Header (Matching Screenshot 1) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '99px', fontSize: '10.5px', fontWeight: 900 }}>
              <span>☀️ VACATION & DAILY HABITS</span>
            </div>
            <h2 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
              10 Smart Study Habits for Kids!
            </h2>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
              Fun + Learning = A Productive, Joyful Vacation!
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              border: 0,
              background: '#f1f5f9',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: '#475569',
              fontWeight: 900
            }}
          >
            ✕
          </button>
        </div>

        {/* Daily Progress Bar Track */}
        <div style={{ background: '#f1f5f9', borderRadius: '16px', padding: '12px 14px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 900, color: '#1e293b', marginBottom: '6px' }}>
            <span>Today's Progress: {completedHabits.length} of 10 Habits Checked</span>
            <span style={{ color: '#0284c7' }}>{progressPct}% Done</span>
          </div>
          <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #38bdf8, #0284c7)',
                borderRadius: '99px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* 10 Habits List Cards (Directly matching Screenshot 1) */}
        <div style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
          {HABITS.map((item, idx) => {
            const isDone = completedHabits.includes(item.id);
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => toggleHabit(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  background: isDone ? '#f0fdf4' : item.bg,
                  border: `1.5px solid ${isDone ? '#86efac' : item.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              >
                {/* Icon Circle */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: isDone ? '#22c55e' : item.color,
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0
                  }}
                >
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 900, color: '#0f172a' }}>
                      {idx + 1}. {item.title}
                    </span>
                    {isDone && (
                      <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '6px', fontWeight: 900 }}>
                        Completed ✓
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 650, marginTop: '2px' }}>
                    {item.desc}
                  </div>
                </div>

                {/* Checkbox */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: `2px solid ${isDone ? '#22c55e' : '#cbd5e1'}`,
                    background: isDone ? '#22c55e' : '#ffffff',
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0
                  }}
                >
                  {isDone && <CheckCircle2 size={16} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Motivation Message */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => {
              playCorrect();
              speakText("Remember: keep learning fun, set small weekly goals, read every day, and celebrate your great effort!");
            }}
            style={{
              background: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              color: '#1d4ed8',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Volume2 size={14} /> Listen to Study Coach Tip
          </button>
        </div>
      </div>
    </div>
  );
}
