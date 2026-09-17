import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Maximize2, Minimize2 } from 'lucide-react';

export function DeviceFrame({ children, isDarkStatus = false }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileOrPwa, setIsMobileOrPwa] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator?.standalone === true ||
      window.innerWidth <= 768
    );
  });

  useEffect(() => {
    const checkMode = () => {
      const isStandalone =
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator?.standalone === true ||
        window.innerWidth <= 768;
      setIsMobileOrPwa(isStandalone);
    };
    checkMode();
    window.addEventListener('resize', checkMode);
    return () => window.removeEventListener('resize', checkMode);
  }, []);

  return (
    <div className={`deviceWrapper ${isFullscreen ? 'fullscreen' : ''} ${isMobileOrPwa ? 'standalone' : ''}`}>
      {/* Desktop Mode Toggle - only visible on wide desktop view */}
      {!isMobileOrPwa && (
        <button
          className="desktopToggleBtn"
          onClick={() => setIsFullscreen((v) => !v)}
          title={isFullscreen ? 'Switch to Phone Mockup' : 'Switch to Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          <span>{isFullscreen ? 'Phone Preview' : 'Expand View'}</span>
        </button>
      )}

      <div className={`deviceFrame ${isFullscreen ? 'expanded' : ''} ${isMobileOrPwa ? 'standalone' : ''}`}>
        {/* iOS Status Bar - only shown on desktop mockup, hidden on mobile / PWA to reclaim screen space */}
        {!isMobileOrPwa && (
          <div className={`iosStatusBar ${isDarkStatus ? 'whiteText' : ''}`}>
            <span className="time">9:41</span>
            <div className="icons">
              <Signal size={14} />
              <Wifi size={14} />
              <Battery size={16} />
            </div>
          </div>
        )}

        {/* Inner Screen Content */}
        {children}

        {/* iOS Home Indicator - only shown on desktop preview, native OS handles it on mobile/PWA */}
        {!isMobileOrPwa && <div className="iosHomeBar" />}
      </div>
    </div>
  );
}
