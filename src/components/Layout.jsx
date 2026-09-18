import React from 'react';
import { BookOpen, ChartNoAxesColumn, House, Settings, ShieldCheck, Users, WifiOff, ArrowLeft } from 'lucide-react';
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
        width: '100%',
        maxWidth: '100%',
        minHeight: 0,
        height: '100%',
        overflow: 'hidden',
        background: '#f7fafe',
        boxSizing: 'border-box'
      }}
    >
      {/* Slim Header Bar for non-Home pages with Dedicated Back Button */}
      {page !== 'home' && (
        <header
          className="topbar"
          style={{
            height: '52px',
            padding: '0 14px',
            position: 'relative',
            borderBottom: '1px solid #eef3f8',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                playPop();
                setPage('home');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1.5px solid #bfdbfe',
                borderRadius: '12px',
                padding: '5px 11px',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
              title="Back to Home Dashboard"
            >
              <ArrowLeft size={15} strokeWidth={2.5} />
              <span>Back</span>
            </button>

            <button
              className="brand"
              onClick={() => {
                playPop();
                setPage('home');
              }}
              style={{ fontSize: '17px', gap: '6px' }}
            >
              <span className="brandMark" style={{ width: '26px', height: '26px', fontSize: '12px' }}>
                ★
              </span>
              <span>MerolaApp</span>
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
          width: '100%',
          maxWidth: '100%',
          padding: page === 'home' ? '0' : '14px 14px 20px',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </main>

      {/* Clean Bottom Navigation Dock - Full Mobile Width */}
      <nav
        className="bottomnav"
        style={{
          position: 'relative',
          width: '100%',
          height: '54px',
          minHeight: '54px',
          borderTop: '1px solid #f1f5f9',
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          backdropFilter: 'none',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          boxSizing: 'border-box'
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
              padding: '2px 0',
              minWidth: '46px',
              color: page === id ? '#157aff' : '#94a3b8'
            }}
          >
            <IconComponent size={19} />
            <span style={{ fontSize: '10px', marginTop: '1px' }}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
