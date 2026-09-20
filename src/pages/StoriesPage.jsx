import React from 'react';
import { StoryReader } from '../components/StoryReader';
import { useApp } from '../store/AppContext';

/**
 * StoriesPage — full-screen EWA-style story reader accessible from bottom nav.
 * Wraps the existing StoryReader component; `go` is used to navigate back.
 */
export function StoriesPage({ go }) {
  const { child } = useApp();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      background: '#fcfbf7',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <StoryReader onBack={() => go('home')} />
    </div>
  );
}
