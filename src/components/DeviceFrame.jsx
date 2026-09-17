import React, { useState } from 'react';
import { Wifi, Battery, Signal, Maximize2, Minimize2 } from 'lucide-react';

export function DeviceFrame({ children, isDarkStatus = false }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`deviceWrapper ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Desktop Mode Toggle */}
      <button
        className="desktopToggleBtn"
        onClick={() => setIsFullscreen((v) => !v)}
        title={isFullscreen ? 'Switch to Phone Mockup' : 'Switch to Fullscreen'}
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        <span>{isFullscreen ? 'Phone Preview' : 'Expand View'}</span>
      </button>

      <div className={`deviceFrame ${isFullscreen ? 'expanded' : ''}`}>
        {/* iOS Status Bar */}
        <div className={`iosStatusBar ${isDarkStatus ? 'whiteText' : ''}`}>
          <span className="time">9:41</span>
          <div className="icons">
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={16} />
          </div>
        </div>

        {/* Inner Screen Content */}
        {children}

        {/* iOS Home Indicator */}
        <div className="iosHomeBar" />
      </div>
    </div>
  );
}
