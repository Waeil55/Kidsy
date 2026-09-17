import React from 'react';
import { BookOpen, ChartNoAxesColumn, House, Settings, ShieldCheck, Users, WifiOff } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { playPop } from '../utils/audio';

export function Layout({ page, setPage, children }) {
  const { child, children: kids, setChild, online, role, setRole } = useApp();

  const nav = [
    ['home', 'Home', House],
    ['learn', 'Learn', BookOpen],
    ['progress', 'Progress', ChartNoAxesColumn],
    ['parent', 'Family', Users],
    ['settings', 'Settings', Settings]
  ];

  return (
    <div
      className="shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        height: '100%',
        overflow: 'hidden',
        background: '#ffffff'
      }}
    >
      {/* Slim Header Bar for non-Home pages */}
      {page !== 'home' && (
        <header
          className="topbar"
          style={{
            height: '54px',
            padding: '0 16px',
            position: 'relative',
            borderBottom: '1px solid #eef3f8'
          }}
        >
          <button
            className="brand"
            onClick={() => {
              playPop();
              setPage('home');
            }}
            style={{ fontSize: '18px', gap: '8px' }}
          >
            <span className="brandMark" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
              ★
            </span>
            <span>MerolaApp</span>
          </button>

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
                padding: '6px 10px',
                fontSize: '12px',
                borderRadius: '10px',
                border: '1px solid #d9e5f1'
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

      {/* Main Viewport */}
      <main
        className="main"
        style={{
          flex: 1,
          padding: page === 'home' ? '0' : '16px 16px 20px',
          overflowY: 'auto',
          maxWidth: '100%'
        }}
      >
        {children}
      </main>

      {/* Clean In-Device Bottom Navigation Dock */}
      <nav
        className="bottomnav"
        style={{
          position: 'relative',
          height: '60px',
          borderTop: '1px solid #f1f5f9',
          background: '#ffffff',
          gap: 'min(4vw, 36px)',
          backdropFilter: 'none'
        }}
      >
        {nav.map(([id, label, IconComponent]) => (
          <button
            key={id}
            className={page === id ? 'active' : ''}
            onClick={() => {
              playPop();
              setPage(id);
            }}
            style={{
              padding: '4px 0',
              minWidth: '48px',
              color: page === id ? '#157aff' : '#94a3b8'
            }}
          >
            <IconComponent size={20} />
            <span style={{ fontSize: '10.5px', marginTop: '2px' }}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
