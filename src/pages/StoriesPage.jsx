import React from 'react';
import { StoryReader } from '../components/StoryReader';

/**
 * StoriesPage — EWA-style full-screen story reader from bottom nav.
 * Layout hides the nav bar for this page (isFullscreen=true).
 */
export function StoriesPage({ go }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: '#fcfbf7',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <StoryReader onBack={() => go('home')} />
    </div>
  );
}
