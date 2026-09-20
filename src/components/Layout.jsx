import React from 'react';
import { WifiOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { playPop } from '../utils/audio';

const NAV = [
  { id: 'home',     label: 'Home',     emoji: '🏠', color: '#6366f1' },
  { id: 'learn',    label: 'Learn',    emoji: '🧠', color: '#0ea5e9' },
  { id: 'stories',  label: 'Stories',  emoji: '📖', color: '#db2777' },
  { id: 'reels',    label: 'Reels',    emoji: '🎬', color: '#f59e0b' },
  { id: 'gift',     label: 'Gift',     emoji: '🎁', color: '#22c55e' },
  { id: 'progress', label: 'Progress', emoji: '📊', color: '#8b5cf6' },
  { id: 'parent',   label: 'Family',   emoji: '👨‍👩‍👧', color: '#ec4899' },
  { id: 'settings', label: 'More',     emoji: '⚙️',  color: '#64748b' },
];

export function Layout({ page, setPage, children }) {
  const { child, children: kids, setChild, online } = useApp();
  const isHome = page === 'home';
  const isFullscreen = page === 'stories' || page === 'reels';

  return (
    <div className="shell">
      {/* ── Top bar (hidden on home & fullscreen pages) ── */}
      {!isHome && !isFullscreen && (
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => { playPop(); setPage('home'); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: '#eff6ff', color: '#4338ca',
                border: '1.5px solid #c7d2fe', borderRadius: '12px',
                padding: '5px 12px', fontSize: '12.5px', fontWeight: 800,
              }}
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              Back
            </button>
            <button className="brand" onClick={() => { playPop(); setPage('home'); }}>
              <span className="brandMark">★</span>
              <span>Kidsy</span>
            </button>
          </div>

          <div className="topActions">
            {!online && <span className="offline"><WifiOff size={13} /> Offline</span>}
            <select
              value={child.id}
              onChange={e => setChild(e.target.value)}
            >
              {kids.map(k => (
                <option key={k.id} value={k.id}>
                  {k.avatar} {k.name} · G{k.grade}
                </option>
              ))}
            </select>
          </div>
        </header>
      )}

      {/* ── Main content ── */}
      <main className="main" style={{ padding: 0 }}>
        {children}
      </main>

      {/* ── Bottom Navigation ── */}
      {!isFullscreen && (
        <nav className="bottomnav hide-scrollbar">
          {NAV.map(({ id, label, emoji, color }) => {
            const active = page === id;
            return (
              <button
                key={id}
                className={active ? 'active' : ''}
                onClick={() => { playPop(); setPage(id); }}
                style={active ? { borderTopColor: color, background: `${color}12`, color } : {}}
              >
                <span className="nav-emoji">{emoji}</span>
                <span className="nav-label">{label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
