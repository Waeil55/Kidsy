import React from 'react';
import { TrendingUp, Flame, Clock, Award, BookOpen, Star, Zap, Trophy } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { getLessons, subjects } from '../data/curriculum';

export function Progress() {
  const { child } = useApp();
  const allLessons = getLessons(child.grade);
  const completedSet = new Set(child.completed || []);
  const pct = Math.round((completedSet.size / Math.max(1, allLessons.length)) * 100);
  const xp = child.xp || 0;
  const streak = child.streak || 0;
  const minutes = child.minutes || 0;

  // XP level
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  const STATS = [
    { icon: '⭐', label: 'Total XP',    value: xp,              color: '#f59e0b', bg: '#fef3c7' },
    { icon: '🔥', label: 'Day Streak',  value: `${streak}d`,   color: '#ef4444', bg: '#fef2f2' },
    { icon: '⏱️', label: 'Minutes',     value: minutes,         color: '#0ea5e9', bg: '#e0f2fe' },
    { icon: '🏆', label: 'Level',       value: `Lv ${level}`,  color: '#8b5cf6', bg: '#ede9fe' },
  ];

  const BADGES = [
    { emoji: '🌟', name: 'First Step',    earned: completedSet.size >= 1 },
    { emoji: '📚', name: 'Bookworm',      earned: completedSet.size >= 5 },
    { emoji: '🔥', name: 'On Fire',       earned: streak >= 3 },
    { emoji: '⚡', name: 'Speed Reader',  earned: minutes >= 30 },
    { emoji: '🏆', name: 'Champion',      earned: xp >= 500 },
    { emoji: '💎', name: 'Diamond Star',  earned: xp >= 1000 },
  ];

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <div style={{ fontSize: '42px', marginBottom: '6px' }}>📊</div>
        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#1e293b', margin: 0 }}>
          {child.name}'s Progress
        </h1>
        <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, margin: '4px 0 0' }}>
          Grade {child.grade} · Keep up the amazing work! 🚀
        </p>
      </div>

      {/* Circular progress ring */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #fdf4ff 100%)',
        borderRadius: '24px',
        border: '1.5px solid #e9d5ff',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}>
        {/* Ring */}
        <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
          <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="55" cy="55" r="44" fill="none" stroke="#e2e8f0" strokeWidth="11" />
            <circle
              cx="55" cy="55" r="44" fill="none"
              stroke="url(#prog-grad)" strokeWidth="11" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <defs>
              <linearGradient id="prog-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#6366f1' }}>{pct}%</span>
            <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700 }}>DONE</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#1e293b', marginBottom: '4px' }}>
            Curriculum Mastery
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '10px' }}>
            {completedSet.size} of {allLessons.length} activities done
          </div>
          {/* XP Level bar */}
          <div style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 800, marginBottom: '4px' }}>
            Level {level} · {xpInLevel}/100 XP
          </div>
          <div style={{ background: '#e9d5ff', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${xpInLevel}%`,
              background: 'linear-gradient(90deg,#8b5cf6,#6366f1)',
              borderRadius: '99px', transition: 'width .6s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {STATS.map(({ icon, label, value, color, bg }) => (
          <div key={label} style={{
            background: '#fff', borderRadius: '18px',
            border: '1.5px solid #f1f5f9', padding: '16px 12px',
            display: 'flex', alignItems: 'center', gap: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,.05)',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: bg, display: 'grid', placeItems: 'center', fontSize: '20px',
            }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: '19px', fontWeight: 900, color }}>{value}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Subject progress bars */}
      <div style={{
        background: '#fff', borderRadius: '20px',
        border: '1.5px solid #f1f5f9', padding: '18px',
        boxShadow: '0 2px 12px rgba(0,0,0,.05)',
      }}>
        <h2 style={{ fontSize: '15px', fontWeight: 900, color: '#1e293b', marginBottom: '14px' }}>
          📘 Subject Progress
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {subjects.map(s => {
            const subLessons = allLessons.filter(l => l.subject === s.id);
            const done = subLessons.filter(l => completedSet.has(l.id)).length;
            const subPct = Math.round((done / Math.max(1, subLessons.length)) * 100);
            return (
              <div key={s.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>
                    {s.emoji} {s.name}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1' }}>
                    {done}/{subLessons.length}
                  </span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${subPct}%`,
                    background: `linear-gradient(90deg,${s.color || '#6366f1'},${s.color2 || '#8b5cf6'})`,
                    borderRadius: '99px', transition: 'width .6s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div style={{
        background: '#fff', borderRadius: '20px',
        border: '1.5px solid #f1f5f9', padding: '18px',
        boxShadow: '0 2px 12px rgba(0,0,0,.05)',
      }}>
        <h2 style={{ fontSize: '15px', fontWeight: 900, color: '#1e293b', marginBottom: '14px' }}>
          🏅 Achievement Badges
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {BADGES.map(b => (
            <div key={b.name} style={{
              background: b.earned ? '#f0fdf4' : '#f8fafc',
              borderRadius: '14px', padding: '12px 8px', textAlign: 'center',
              border: `1.5px solid ${b.earned ? '#bbf7d0' : '#e2e8f0'}`,
              opacity: b.earned ? 1 : 0.45,
            }}>
              <div style={{ fontSize: '26px', marginBottom: '4px', filter: b.earned ? 'none' : 'grayscale(1)' }}>
                {b.emoji}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: b.earned ? '#15803d' : '#94a3b8' }}>
                {b.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
