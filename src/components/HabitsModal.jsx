import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Moon, Sun, Sparkles } from 'lucide-react';
import { playPop, playCorrect, fireConfetti } from '../utils/audio';

export function HabitsModal({ type, onClose }) {
  // Tooth Brushing Timer State (120 seconds = 2 min)
  const [brushSeconds, setBrushSeconds] = useState(120);
  const [isBrushing, setIsBrushing] = useState(false);

  // Daily Routine checklist
  const [routineTasks, setRoutineTasks] = useState([
    { id: 1, text: 'Morning wake-up & stretch', done: true },
    { id: 2, text: 'Brush teeth & wash face', done: true },
    { id: 3, text: 'Practice 3 Week 5 vocabulary words', done: false },
    { id: 4, text: 'Complete 1 Math multiplication game', done: false },
    { id: 5, text: 'Read bedtime story & good night', done: false }
  ]);

  // Night light mode
  const [warmth, setWarmth] = useState(60);

  useEffect(() => {
    let timer = null;
    if (isBrushing && brushSeconds > 0) {
      timer = setInterval(() => {
        setBrushSeconds((s) => s - 1);
      }, 1000);
    } else if (brushSeconds === 0 && isBrushing) {
      setIsBrushing(false);
      fireConfetti(true);
      playCorrect();
    }
    return () => clearInterval(timer);
  }, [isBrushing, brushSeconds]);

  const toggleTask = (id) => {
    playPop();
    setRoutineTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="modal">
      <div className="modalPanel compact">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px' }}>
              {type === 'teeth' ? '🦷' : type === 'routine' ? '⏰' : type === 'night' ? '🌙' : '💡'}
            </span>
            <h2 style={{ margin: 0, fontSize: '20px' }}>
              {type === 'teeth'
                ? 'Brushing Teeth Timer'
                : type === 'routine'
                ? 'Daily Habit Routine'
                : type === 'night'
                ? 'Good Night Lullaby'
                : 'Reading Light Comfort'}
            </h2>
          </div>
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
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. Tooth Brushing Timer */}
        {type === 'teeth' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '72px', margin: '10px 0' }}>🪥✨</div>
            <div style={{ fontSize: '46px', fontWeight: 900, color: '#0284c7' }}>
              {formatTime(brushSeconds)}
            </div>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 20px' }}>
              Dentists recommend brushing for 2 full minutes for sparkly healthy teeth!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                className="primary"
                onClick={() => {
                  playPop();
                  setIsBrushing((v) => !v);
                }}
              >
                {isBrushing ? <Pause size={18} /> : <Play size={18} />}
                {isBrushing ? 'Pause' : 'Start Brushing'}
              </button>
              <button
                className="secondary"
                onClick={() => {
                  playPop();
                  setIsBrushing(false);
                  setBrushSeconds(120);
                }}
              >
                <RotateCcw size={18} /> Reset
              </button>
            </div>
          </div>
        )}

        {/* 2. Daily Routine Checklist */}
        {type === 'routine' && (
          <div style={{ padding: '16px 0' }}>
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: '0 0 14px' }}>
              Build confidence and consistency one daily milestone at a time:
            </p>
            <div style={{ display: 'grid', gap: '10px' }}>
              {routineTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: `1.5px solid ${task.done ? '#86efac' : '#e2e8f0'}`,
                    background: task.done ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <CheckCircle2
                    size={20}
                    color={task.done ? '#16a34a' : '#94a3b8'}
                  />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: task.done ? '#15803d' : '#1e293b',
                      textDecoration: task.done ? 'line-through' : 'none'
                    }}
                  >
                    {task.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Good Night Sleep Mode */}
        {type === 'night' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '64px', margin: '10px 0' }}>🌙⭐💤</div>
            <h3 style={{ fontSize: '22px', margin: '8px 0', color: '#1e293b' }}>
              Rest Well, Explorer!
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '300px', margin: 'auto' }}>
              Your brain consolidates all the words, math facts, and stories you learned today while you sleep.
            </p>
            <button
              className="primary full"
              style={{ marginTop: '20px' }}
              onClick={() => {
                playCorrect();
                onClose();
              }}
            >
              <Moon size={16} /> Good Night Merola!
            </button>
          </div>
        )}

        {/* 4. Blue Light Reading Warmth */}
        {type === 'light' && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ textAlign: 'center', fontSize: '50px', margin: '10px 0' }}>💡📖</div>
            <h3 style={{ textAlign: 'center', margin: '0 0 12px' }}>Gentle Reading Warmth</h3>
            <p style={{ color: '#64748b', fontSize: '13.5px', textAlign: 'center', margin: '0 0 20px' }}>
              Reduces blue light exposure so your eyes stay comfortable while reading.
            </p>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '13px', color: '#475569' }}>
              Warmth Filter: {warmth}%
              <input
                type="range"
                min="0"
                max="100"
                value={warmth}
                onChange={(e) => setWarmth(Number(e.target.value))}
                style={{ width: '100%', marginTop: '8px' }}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
