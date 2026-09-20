import React from 'react';
import {
  House, BookOpen, ChartNoAxesColumn, Users,
  Settings, WifiOff, ArrowLeft, Gift
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { playPop } from '../utils/audio';

const NAV = [
  { id: 'home',     label: 'Home',    icon: House,             emoji: '🏠', color: '#6366f1' },
  { id: 'learn',    label: 'Learn',   icon: BookOpen,          emoji: '🧠', color: '#0ea5e9' },
  { id: 'stories',  label: 'Stories', icon: null,              emoji: '📖', color: '#db2777' },
  { id: 'reels',    label: 'Reels',   icon: null,              emoji: '🎬', color: '#f59e0b' },
  { id: 'gift',     label: 'Gift',    icon: Gift,              emoji: '🎁', color: '#22c55e' },
  { id: 'progress', label: 'Progress',icon: ChartNoAxesColumn, emoji: '📊', color: '#8b5cf6' },
  { id: 'parent',   label: 'Family',  icon: Users,             emoji: '👨‍👩‍👧', color: '#ec4899' },
  { id: 'settings', label: 'More',    icon: Settings,          emoji: '⚙️', color: '#64748b' },
];

export function Layout({ page, setPage, children }) {
  const { child, children: kids, setChild, online } = useApp();

  return (
    <div
      className="shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        maxWidth: '100%',
        minHeight: 0,
        height: '100%',
        overflow: 'hidden',
        background: '#f7fafe',
        boxSizing: 'border-box',
      }}
    >
      {/* Top header bar (non-home pages) */}
      {page !== 'home' && (
        <header
          className="topbar"
          style={{
            height: '52px',
            padding: '0 14px',
            borderBottom: '1px solid #eef3f8',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => { playPop(); setPage('home'); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: '#eff6ff', color: '#1d4ed8',
                border: '1.5px solid #bfdbfe', borderRadius: '12px',
                padding: '5px 11px', fontSize: '12.5px', fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={15} strokeWidth={2.5} />
              <span>Back</span>
            </button>

            <button
              className="brand"
              onClick={() => { playPop(); setPage('home'); }}
              style={{ fontSize: '17px', gap: '6px' }}
            >
              <span className="brandMark" style={{ width: '26px', height: '26px', fontSize: '12px' }}>★</span>
              <span>Kidsy</span>
            </button>
          </div>

          <div className="topActions">
            {!online && (
              <span className="offline" style={{ fontSize: '11px' }}>
                <WifiOff size={12} />
              </span>
            )}
            <select
              value={child.id}
              onChange={(e) => setChild(e.target.value)}
              style={{
                padding: '6px 10px', fontSize: '12px',
                borderRadius: '10px', border: '1px solid #d9e5f1',
              }}
            >
              {kids.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.avatar} {k.name} (Gr {k.grade})
                </option>
              ))}
            </select>
          </div>
        </header>
      )}

      {/* Main content */}
      <main
        className="main"
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          padding: page === 'home' ? '0' : '14px 14px 20px',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation — horizontal scroll, emoji + label, beautiful */}
      <nav
        className="bottomnav"
        style={{
          width: '100%',
          flexShrink: 0,
          borderTop: '1px solid #f1f5f9',
          background: '#ffffff',
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          boxSizing: 'border-box',
          height: '62px',
          minHeight: '62px',
          alignItems: 'stretch',
        }}
      >
        {NAV.map(({ id, label, emoji, color }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => { playPop(); setPage(id); }}
              style={{
                flexShrink: 0,
                minWidth: '72px',
                padding: '4px 6px 2px',
                border: 'none',
                background: active ? `${color}14` : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1px',
                position: 'relative',
                transition: 'background 0.15s',
                borderTop: active ? `3px solid ${color}` : '3px solid transparent',
              }}
            >
              {/* Active dot */}
              <span style={{
                fontSize: active ? '22px' : '20px',
                lineHeight: 1,
                transition: 'font-size 0.15s',
                filter: active ? 'none' : 'grayscale(30%) opacity(0.7)',
              }}>
                {emoji}
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: active ? 900 : 600,
                color: active ? color : '#94a3b8',
                letterSpacing: '0.01em',
                lineHeight: 1,
                marginTop: '1px',
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
