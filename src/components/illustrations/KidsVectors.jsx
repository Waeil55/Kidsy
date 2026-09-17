import React from 'react';

// ============================================================================
// 1. SCREEN 1: ROCKET & ANIMAL PALS ON GRASSY HILL (1:1 with reference)
// ============================================================================
export function RocketSceneIllustration({ className = '', style = {} }) {
  return (
    <div
      className={`relative w-full flex items-end justify-center ${className}`}
      style={{ minHeight: '260px', overflow: 'visible', ...style }}
    >
      <svg
        viewBox="0 0 400 280"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="hillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7CD637" />
            <stop offset="55%" stopColor="#5EA928" />
            <stop offset="100%" stopColor="#4A881E" />
          </linearGradient>

          <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#48C6EF" />
            <stop offset="50%" stopColor="#6EE2F5" />
            <stop offset="100%" stopColor="#2E99DB" />
          </linearGradient>

          <linearGradient id="rocketCone" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#EE5253" />
          </linearGradient>

          <linearGradient id="fireOuter" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFA502" />
            <stop offset="100%" stopColor="#FF4757" />
          </linearGradient>

          <linearGradient id="fireInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF200" />
            <stop offset="100%" stopColor="#FF9F1A" />
          </linearGradient>

          <linearGradient id="foxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9F43" />
            <stop offset="100%" stopColor="#EE5253" />
          </linearGradient>

          <linearGradient id="bunnyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9FF3" />
            <stop offset="100%" stopColor="#F368E0" />
          </linearGradient>

          <linearGradient id="owlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#54A0FF" />
            <stop offset="100%" stopColor="#2E86DE" />
          </linearGradient>

          {/* Soft Drop Shadow */}
          <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.16" />
          </filter>
        </defs>

        {/* Rolling Grassy Hill */}
        <path
          d="M -40 280 Q 200 130 440 280 Z"
          fill="url(#hillGrad)"
          filter="url(#softShadow)"
        />
        {/* Hilltop Grass & Flowers Details */}
        <circle cx="120" cy="210" r="4" fill="#A8FF78" opacity="0.6" />
        <circle cx="280" cy="205" r="5" fill="#A8FF78" opacity="0.6" />
        <circle cx="70" cy="245" r="3" fill="#FFF275" opacity="0.8" />
        <circle cx="330" cy="240" r="3" fill="#FFF275" opacity="0.8" />

        {/* ---------------------------------------------------- */}
        {/* LEFT CHARACTER: CUTE ORANGE FOX WITH BACKPACK        */}
        {/* ---------------------------------------------------- */}
        <g transform="translate(68, 120)" filter="url(#softShadow)">
          {/* Teal Backpack */}
          <rect x="-8" y="42" width="22" height="34" rx="8" fill="#1DD1A1" />
          <path d="M 4 48 L 4 68" stroke="#10AC84" strokeWidth="2" strokeLinecap="round" />

          {/* Fox Body */}
          <ellipse cx="28" cy="62" rx="22" ry="26" fill="url(#foxGrad)" />
          {/* White Belly */}
          <ellipse cx="28" cy="66" rx="13" ry="17" fill="#FFFFFF" />

          {/* Bushy Tail */}
          <path
            d="M 45 68 C 65 65 72 45 65 30 C 58 40 50 55 42 62 Z"
            fill="url(#foxGrad)"
          />
          <path d="M 65 30 C 67 36 63 42 58 40 Z" fill="#FFFFFF" />

          {/* Fox Head */}
          <ellipse cx="28" cy="28" rx="26" ry="22" fill="url(#foxGrad)" />

          {/* Pointy Ears */}
          <polygon points="10,14 18,-6 26,12" fill="url(#foxGrad)" />
          <polygon points="13,12 18,-1 23,10" fill="#FFFFFF" />
          <polygon points="30,12 38,-6 46,14" fill="url(#foxGrad)" />
          <polygon points="33,10 38,-1 43,12" fill="#FFFFFF" />

          {/* White Cheeks */}
          <path d="M 6 28 Q 18 42 28 42 Q 38 42 50 28 Q 28 35 6 28 Z" fill="#FFFFFF" />

          {/* Cute Face: Eyes, Nose, Smile */}
          <ellipse cx="20" cy="25" rx="3.5" ry="4" fill="#222F3E" />
          <circle cx="19" cy="23.5" r="1.2" fill="#FFFFFF" />
          <ellipse cx="36" cy="25" rx="3.5" ry="4" fill="#222F3E" />
          <circle cx="35" cy="23.5" r="1.2" fill="#FFFFFF" />
          <polygon points="25,32 31,32 28,36" fill="#222F3E" />
          <path d="M 25 36 Q 28 39 31 36" stroke="#222F3E" strokeWidth="1.5" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          <ellipse cx="14" cy="30" rx="3" ry="2" fill="#FF7675" opacity="0.6" />
          <ellipse cx="42" cy="30" rx="3" ry="2" fill="#FF7675" opacity="0.6" />

          {/* Little Paws */}
          <ellipse cx="18" cy="85" rx="6" ry="4" fill="#EE5253" />
          <ellipse cx="38" cy="85" rx="6" ry="4" fill="#EE5253" />
        </g>

        {/* ---------------------------------------------------- */}
        {/* CENTER ROCKET: BLAST OFF FIRE & SHINY CAPSULE        */}
        {/* ---------------------------------------------------- */}
        <g transform="translate(200, 105)" filter="url(#softShadow)">
          {/* Flame Plume */}
          <path
            d="M -15 62 Q 0 102 0 120 Q 0 102 15 62 Z"
            fill="url(#fireOuter)"
          />
          <path
            d="M -9 62 Q 0 92 0 104 Q 0 92 9 62 Z"
            fill="url(#fireInner)"
          />

          {/* Aerodynamic Side Fins */}
          <path d="M -24 35 C -36 45 -42 62 -32 68 C -24 64 -20 54 -20 42 Z" fill="url(#rocketCone)" />
          <path d="M 24 35 C 36 45 42 62 32 68 C 24 64 20 54 20 42 Z" fill="url(#rocketCone)" />

          {/* Main Rocket Body */}
          <path
            d="M 0 -45 C -30 -10 -30 45 -22 62 L 22 62 C 30 45 30 -10 0 -45 Z"
            fill="url(#rocketBody)"
          />

          {/* Top Nose Cone */}
          <path
            d="M 0 -45 C -18 -22 -22 -5 -22 2 L 22 2 C 22 -5 18 -22 0 -45 Z"
            fill="url(#rocketCone)"
          />

          {/* Circular Porthole Window */}
          <circle cx="0" cy="18" r="14" fill="#FFFFFF" />
          <circle cx="0" cy="18" r="11" fill="#48DBFB" />
          <circle cx="-3" cy="15" r="4" fill="#FFFFFF" opacity="0.75" />

          {/* Rocket Highlights */}
          <path d="M -14 -12 Q -18 10 -15 45" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* ---------------------------------------------------- */}
        {/* CENTER-RIGHT: CUTE PINK BUNNY WITH GLASSES           */}
        {/* ---------------------------------------------------- */}
        <g transform="translate(196, 126)" filter="url(#softShadow)">
          {/* Bunny Ears */}
          <ellipse cx="14" cy="-12" rx="7" ry="24" transform="rotate(-6 14 -12)" fill="url(#bunnyGrad)" />
          <ellipse cx="14" cy="-12" rx="3.5" ry="17" transform="rotate(-6 14 -12)" fill="#FFFFFF" opacity="0.8" />
          <ellipse cx="36" cy="-10" rx="7" ry="24" transform="rotate(8 36 -10)" fill="url(#bunnyGrad)" />
          <ellipse cx="36" cy="-10" rx="3.5" ry="17" transform="rotate(8 36 -10)" fill="#FFFFFF" opacity="0.8" />

          {/* Bunny Body */}
          <ellipse cx="25" cy="56" rx="18" ry="22" fill="url(#bunnyGrad)" />
          <ellipse cx="25" cy="58" rx="10" ry="14" fill="#FFFFFF" />

          {/* Bunny Head */}
          <circle cx="25" cy="24" r="21" fill="url(#bunnyGrad)" />

          {/* Oversized Cute Glasses */}
          <circle cx="16" cy="24" r="8.5" fill="#FFFFFF" opacity="0.3" stroke="#F368E0" strokeWidth="2.5" />
          <circle cx="34" cy="24" r="8.5" fill="#FFFFFF" opacity="0.3" stroke="#F368E0" strokeWidth="2.5" />
          <path d="M 24.5 24 L 25.5 24" stroke="#F368E0" strokeWidth="3" strokeLinecap="round" />

          {/* Cute Eyes behind glasses */}
          <circle cx="16" cy="24" r="3.2" fill="#222F3E" />
          <circle cx="15" cy="22.5" r="1.1" fill="#FFFFFF" />
          <circle cx="34" cy="24" r="3.2" fill="#222F3E" />
          <circle cx="33" cy="22.5" r="1.1" fill="#FFFFFF" />

          {/* Nose & Smile */}
          <ellipse cx="25" cy="30" rx="2" ry="1.5" fill="#FF6B81" />
          <path d="M 23 32 Q 25 35 27 32" stroke="#222F3E" strokeWidth="1.2" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          <circle cx="10" cy="28" r="3" fill="#FF7675" opacity="0.5" />
          <circle cx="40" cy="28" r="3" fill="#FF7675" opacity="0.5" />

          {/* Paws */}
          <ellipse cx="16" cy="76" rx="5" ry="3.5" fill="#F368E0" />
          <ellipse cx="34" cy="76" rx="5" ry="3.5" fill="#F368E0" />
        </g>

        {/* ---------------------------------------------------- */}
        {/* RIGHT: CUTE BLUE OWL WITH GLASSES & STORYBOOK        */}
        {/* ---------------------------------------------------- */}
        <g transform="translate(265, 126)" filter="url(#softShadow)">
          {/* Owl Body / Head */}
          <ellipse cx="30" cy="42" rx="26" ry="32" fill="url(#owlGrad)" />

          {/* Ear Tufts */}
          <polygon points="12,18 8,4 22,12" fill="url(#owlGrad)" />
          <polygon points="48,18 52,4 38,12" fill="url(#owlGrad)" />

          {/* Spotted Belly */}
          <ellipse cx="30" cy="52" rx="15" ry="18" fill="#FFFFFF" opacity="0.9" />
          <path d="M 26 46 Q 30 49 34 46 M 24 54 Q 30 57 36 54" stroke="#2E86DE" strokeWidth="1.5" strokeLinecap="round" />

          {/* Red Glasses */}
          <circle cx="19" cy="30" r="10" fill="#FFFFFF" stroke="#EE5253" strokeWidth="2.5" />
          <circle cx="41" cy="30" r="10" fill="#FFFFFF" stroke="#EE5253" strokeWidth="2.5" />
          <path d="M 29 30 L 31 30" stroke="#EE5253" strokeWidth="3" strokeLinecap="round" />

          {/* Big Wise Eyes */}
          <circle cx="19" cy="30" r="4.2" fill="#222F3E" />
          <circle cx="17.5" cy="28.5" r="1.4" fill="#FFFFFF" />
          <circle cx="41" cy="30" r="4.2" fill="#222F3E" />
          <circle cx="39.5" cy="28.5" r="1.4" fill="#FFFFFF" />

          {/* Yellow Beak */}
          <polygon points="28,34 32,34 30,39" fill="#FFA502" />

          {/* Open Storybook in Wings */}
          <g transform="translate(14, 55)">
            {/* Red Book Cover */}
            <path d="M 0 6 Q 16 0 32 6 L 32 24 Q 16 18 0 24 Z" fill="#EE5253" />
            {/* White Book Pages */}
            <path d="M 2 4 Q 16 -1 30 4 L 30 21 Q 16 16 2 21 Z" fill="#FFFFFF" />
            {/* Spine separator */}
            <line x1="16" y1="0" x2="16" y2="20" stroke="#CAD3C8" strokeWidth="1.5" />
          </g>

          {/* Little Yellow Talons */}
          <ellipse cx="22" cy="74" rx="4" ry="2.5" fill="#FFA502" />
          <ellipse cx="38" cy="74" rx="4" ry="2.5" fill="#FFA502" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 2. SCREEN 3 HERO: DIDI THE DINOSAUR EXPLORER (Safari Hat & Magnifying Glass)
// ============================================================================
export function DidiExplorerHero({ onAsk, className = '' }) {
  return (
    <div
      className={`relative w-full rounded-[26px] overflow-hidden shadow-lg ${className}`}
      style={{
        background: 'linear-gradient(180deg, #bfe2ff 0%, #dff2fe 45%, #daf2cb 85%, #b2e697 100%)',
        minHeight: '120px',
        padding: '12px 18px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 12px 28px rgba(35, 95, 175, 0.16)'
      }}
    >
      {/* Puffy Clouds in Sky */}
      <svg
        className="absolute top-2 left-10 pointer-events-none opacity-80"
        width="65"
        height="26"
        viewBox="0 0 65 26"
        fill="#FFFFFF"
      >
        <path d="M 10 22 C 4 22 0 17 0 12 C 0 6 6 2 12 2 C 16 -2 24 -1 28 3 C 32 0 40 0 44 4 C 50 2 58 6 58 12 C 64 13 65 22 56 22 Z" />
      </svg>
      <svg
        className="absolute top-3 right-28 pointer-events-none opacity-60"
        width="45"
        height="18"
        viewBox="0 0 65 26"
        fill="#FFFFFF"
      >
        <path d="M 10 22 C 4 22 0 17 0 12 C 0 6 6 2 12 2 C 16 -2 24 -1 28 3 C 32 0 40 0 44 4 C 50 2 58 6 58 12 C 64 13 65 22 56 22 Z" />
      </svg>

      {/* Floating White Badge: Didi the Explorer */}
      <div
        className="absolute top-2.5 left-5 bg-white/95 backdrop-blur-md rounded-full px-3 py-0.5 shadow-sm text-xs font-black text-[#1d4ed8] tracking-wide"
        style={{ zIndex: 10, fontSize: '11px' }}
      >
        Didi the Explorer
      </div>

      {/* Didi Mascot Illustration (Green Dino with Pith Hat, Vest, Magnifying Glass) */}
      <div className="relative z-10 flex items-center pt-2" style={{ width: '135px', height: '95px' }}>
        <svg viewBox="0 0 140 120" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="dinoSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#48DBFB" />
              <stop offset="0%" stopColor="#2ED573" />
              <stop offset="100%" stopColor="#10AC84" />
            </linearGradient>
            <linearGradient id="vestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9CA24" />
              <stop offset="100%" stopColor="#F0932B" />
            </linearGradient>
            <linearGradient id="hatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFEAA7" />
              <stop offset="100%" stopColor="#DFE6E9" />
            </linearGradient>
          </defs>

          {/* Dino Body */}
          <ellipse cx="65" cy="85" rx="28" ry="26" fill="url(#dinoSkin)" />
          {/* Light Yellow Tummy */}
          <ellipse cx="60" cy="88" rx="16" ry="18" fill="#FFF275" opacity="0.9" />

          {/* Safari Explorer Scout Vest */}
          <path d="M 45 74 Q 65 72 85 74 L 83 98 Q 65 104 47 98 Z" fill="url(#vestGrad)" />
          {/* Vest Pockets & Buttons */}
          <rect x="49" y="80" width="8" height="7" rx="1.5" fill="#E67E22" />
          <rect x="73" y="80" width="8" height="7" rx="1.5" fill="#E67E22" />
          <circle cx="65" cy="78" r="1.8" fill="#D35400" />
          <circle cx="65" cy="87" r="1.8" fill="#D35400" />

          {/* Dino Head */}
          <ellipse cx="65" cy="46" rx="24" ry="22" fill="url(#dinoSkin)" />
          {/* Cheerful Snout */}
          <ellipse cx="78" cy="52" rx="14" ry="11" fill="url(#dinoSkin)" />
          <circle cx="85" cy="49" r="1.5" fill="#057C5A" />

          {/* Friendly Smiling Eyes */}
          <ellipse cx="62" cy="42" rx="4.5" ry="5.5" fill="#FFFFFF" />
          <circle cx="63" cy="42" r="3.2" fill="#222F3E" />
          <circle cx="62" cy="40.5" r="1.2" fill="#FFFFFF" />

          <ellipse cx="74" cy="42" rx="4" ry="5" fill="#FFFFFF" />
          <circle cx="75" cy="42" r="2.8" fill="#222F3E" />
          <circle cx="74" cy="40.5" r="1.1" fill="#FFFFFF" />

          {/* Happy Open Smile */}
          <path d="M 72 56 Q 80 63 86 54" stroke="#057C5A" strokeWidth="2" strokeLinecap="round" />
          {/* Rosy Cheek */}
          <circle cx="60" cy="52" r="3.5" fill="#FF7675" opacity="0.6" />

          {/* Safari Explorer Pith Hat */}
          <g transform="translate(62, 28) rotate(-5)">
            {/* Wide Hat Brim */}
            <ellipse cx="0" cy="2" rx="28" ry="7" fill="#ECCC68" stroke="#D3A93C" strokeWidth="1" />
            {/* Rounded Hat Crown */}
            <path d="M -16 2 C -16 -16 16 -16 16 2 Z" fill="url(#hatGrad)" />
            {/* Hat Band */}
            <path d="M -16 0 Q 0 -3 16 0 L 16 2 Q 0 -1 -16 2 Z" fill="#EE5253" />
            <circle cx="0" cy="-14" r="3" fill="#D3A93C" />
          </g>

          {/* Dino Hand Holding Golden Magnifying Glass */}
          <g transform="translate(94, 68) rotate(15)">
            {/* Glass Handle */}
            <rect x="0" y="16" width="5" height="18" rx="2" fill="#795548" />
            {/* Brass Ring */}
            <circle cx="2.5" cy="10" r="12" fill="#DFF9FB" opacity="0.8" stroke="#F1C40F" strokeWidth="3.5" />
            {/* Glass Reflection Highlight */}
            <path d="M -4 6 Q 0 2 6 5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Glossy 3D Blue "Ask ?" Button */}
      <button
        onClick={onAsk}
        className="relative z-10 flex items-center justify-center gap-1.5 text-white font-black rounded-full px-5 py-2.5 shadow-md active:scale-95 transition-transform"
        style={{
          background: 'linear-gradient(180deg, #2ea4ff 0%, #0077ff 100%)',
          boxShadow: '0 6px 16px rgba(0, 119, 255, 0.38), inset 0 2px 2px rgba(255, 255, 255, 0.4)',
          fontSize: '15px'
        }}
      >
        <span style={{ fontSize: '16px' }}>Ask ?</span>
      </button>
    </div>
  );
}

// ============================================================================
// 3. SCREEN 3: 2x2 3D TOY & SUBJECT ICONS
// ============================================================================

// Top-Left: 3D Wooden Paint Palette with Glossy Color Drops & Brush
export function Palette3DIcon({ className = 'w-12 h-12' }) {
  return (
    <svg viewBox="0 0 72 72" className={className} fill="none">
      <defs>
        <linearGradient id="woodPal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2D6" />
          <stop offset="50%" stopColor="#FFE0A3" />
          <stop offset="100%" stopColor="#F5B759" />
        </linearGradient>
        <radialGradient id="paintRed" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FF7675" />
          <stop offset="100%" stopColor="#D63031" />
        </radialGradient>
        <radialGradient id="paintBlue" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#74B9FF" />
          <stop offset="100%" stopColor="#0984E3" />
        </radialGradient>
        <radialGradient id="paintGreen" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#55EFC4" />
          <stop offset="100%" stopColor="#00B894" />
        </radialGradient>
        <radialGradient id="paintYellow" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFEAA7" />
          <stop offset="100%" stopColor="#FDCB6E" />
        </radialGradient>
        <filter id="palShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Wooden Palette Base */}
      <path
        d="M 18 54 C 6 42 6 22 20 12 C 34 2 54 8 62 20 C 70 32 64 54 48 58 C 42 60 38 52 32 50 C 26 48 22 58 18 54 Z"
        fill="url(#woodPal)"
        filter="url(#palShadow)"
      />
      {/* Thumb Hole */}
      <ellipse cx="44" cy="46" rx="6" ry="5" fill="#E59A30" opacity="0.6" />

      {/* Glossy 3D Paint Dollops */}
      <circle cx="22" cy="22" r="5.5" fill="url(#paintRed)" />
      <circle cx="20.5" cy="20.5" r="1.8" fill="#FFFFFF" opacity="0.85" />

      <circle cx="36" cy="16" r="5" fill="url(#paintYellow)" />
      <circle cx="34.5" cy="14.5" r="1.6" fill="#FFFFFF" opacity="0.85" />

      <circle cx="50" cy="24" r="5.5" fill="url(#paintGreen)" />
      <circle cx="48.5" cy="22.5" r="1.8" fill="#FFFFFF" opacity="0.85" />

      <circle cx="56" cy="38" r="5" fill="url(#paintBlue)" />
      <circle cx="54.5" cy="36.5" r="1.6" fill="#FFFFFF" opacity="0.85" />
    </svg>
  );
}

// Top-Right: Isometric 3D Colorful Geometric Building Blocks (Cube, Cone, Sphere)
export function Shapes3DIcon({ className = 'w-12 h-12' }) {
  return (
    <svg viewBox="0 0 72 72" className={className} fill="none">
      <defs>
        <linearGradient id="cubeTop" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF7675" />
          <stop offset="100%" stopColor="#FF9F9F" />
        </linearGradient>
        <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EE5253" />
          <stop offset="100%" stopColor="#C0392B" />
        </linearGradient>
        <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EA2027" />
          <stop offset="100%" stopColor="#B71540" />
        </linearGradient>

        <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#54A0FF" />
          <stop offset="100%" stopColor="#2E86DE" />
        </linearGradient>

        <radialGradient id="sphereGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#55EFC4" />
          <stop offset="60%" stopColor="#00B894" />
          <stop offset="100%" stopColor="#006266" />
        </radialGradient>
      </defs>

      {/* 3D Isometric Red Cube */}
      <g transform="translate(6, 26)">
        {/* Top Face */}
        <polygon points="18,0 34,8 18,16 2,8" fill="url(#cubeTop)" />
        {/* Left Face */}
        <polygon points="2,8 18,16 18,34 2,26" fill="url(#cubeLeft)" />
        {/* Right Face */}
        <polygon points="18,16 34,8 34,26 18,34" fill="url(#cubeRight)" />
      </g>

      {/* 3D Cyan Cone / Pyramid */}
      <g transform="translate(36, 12)">
        <polygon points="16,0 4,32 28,32" fill="url(#coneGrad)" />
        <ellipse cx="16" cy="32" rx="12" ry="4" fill="#1B1464" opacity="0.3" />
      </g>

      {/* 3D Green Emerald Sphere */}
      <g transform="translate(32, 38)">
        <circle cx="14" cy="14" r="14" fill="url(#sphereGrad)" />
        <ellipse cx="9" cy="9" rx="4" ry="2.5" transform="rotate(-30 9 9)" fill="#FFFFFF" opacity="0.75" />
      </g>
    </svg>
  );
}

// Bottom-Left: Cute 3D Pink Jellyfish with Animated Tentacles
export function Jellyfish3DIcon({ className = 'w-12 h-12' }) {
  return (
    <svg viewBox="0 0 72 72" className={className} fill="none">
      <defs>
        <radialGradient id="jellyDome" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFA0DF" />
          <stop offset="50%" stopColor="#F368E0" />
          <stop offset="100%" stopColor="#D940B7" />
        </radialGradient>
      </defs>

      {/* Main Dome Body */}
      <path
        d="M 12 36 C 12 16 22 10 36 10 C 50 10 60 16 60 36 C 60 41 54 44 48 42 C 42 40 38 43 36 43 C 34 43 30 40 24 42 C 18 44 12 41 12 36 Z"
        fill="url(#jellyDome)"
      />
      {/* Glossy White Highlight */}
      <path
        d="M 20 22 C 24 16 32 14 40 14"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Cute Kawaii Face */}
      <circle cx="28" cy="31" r="2.8" fill="#2C3E50" />
      <circle cx="27" cy="30" r="1" fill="#FFFFFF" />
      <circle cx="44" cy="31" r="2.8" fill="#2C3E50" />
      <circle cx="43" cy="30" r="1" fill="#FFFFFF" />

      {/* Shy Smile */}
      <path d="M 33 34 Q 36 37 39 34" stroke="#2C3E50" strokeWidth="1.6" strokeLinecap="round" />
      {/* Rosy Cheeks */}
      <ellipse cx="22" cy="34" rx="2.5" ry="1.5" fill="#FF7675" />
      <ellipse cx="50" cy="34" rx="2.5" ry="1.5" fill="#FF7675" />

      {/* Wavy Tentacles */}
      <path
        d="M 22 43 Q 18 52 24 62"
        stroke="#FF9FF3"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M 31 44 Q 35 53 29 64"
        stroke="#F368E0"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M 41 44 Q 37 53 43 64"
        stroke="#F368E0"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M 50 43 Q 54 52 48 62"
        stroke="#FF9FF3"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Bottom-Right: 3D Toy Counting Blocks "1 2 3"
export function NumberBlocks3DIcon({ className = 'w-12 h-12' }) {
  return (
    <svg viewBox="0 0 72 72" className={className} fill="none">
      <defs>
        <linearGradient id="b1Top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7675" />
          <stop offset="100%" stopColor="#D63031" />
        </linearGradient>
        <linearGradient id="b2Top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#54A0FF" />
          <stop offset="100%" stopColor="#2E86DE" />
        </linearGradient>
        <linearGradient id="b3Top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FECA57" />
          <stop offset="100%" stopColor="#FF9F43" />
        </linearGradient>
      </defs>

      {/* Block 1 (Top Center) */}
      <g transform="translate(24, 8)">
        <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#b1Top)" />
        <rect x="0" y="0" width="24" height="24" rx="6" stroke="#FF7675" strokeWidth="1.5" />
        <text
          x="12"
          y="18"
          fill="#FFFFFF"
          fontSize="17"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
        >
          1
        </text>
      </g>

      {/* Block 2 (Bottom Left) */}
      <g transform="translate(10, 36)">
        <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#b2Top)" />
        <text
          x="12"
          y="18"
          fill="#FFFFFF"
          fontSize="17"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
        >
          2
        </text>
      </g>

      {/* Block 3 (Bottom Right) */}
      <g transform="translate(38, 36)">
        <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#b3Top)" />
        <text
          x="12"
          y="18"
          fill="#FFFFFF"
          fontSize="17"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
        >
          3
        </text>
      </g>
    </svg>
  );
}

// ============================================================================
// 4. SCREEN 3: 4 BOTTOM ROUTINE ICONS (Tooth, Clock, Moon, Bulb)
// ============================================================================

// 🦷 Sparkling Clean Smiling Tooth with Bubbles
export function Tooth3DIcon({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <linearGradient id="toothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2EEF9" />
        </linearGradient>
      </defs>
      {/* Tooth Body with Roots */}
      <path
        d="M 12 12 C 12 4 36 4 36 12 C 38 18 38 28 34 40 C 31 43 27 41 26 33 C 25 28 23 28 22 33 C 21 41 17 43 14 40 C 10 28 10 18 12 12 Z"
        fill="url(#toothGrad)"
        stroke="#74B9FF"
        strokeWidth="2.5"
      />
      {/* Cute Smile */}
      <circle cx="19" cy="18" r="2" fill="#2C3E50" />
      <circle cx="29" cy="18" r="2" fill="#2C3E50" />
      <path d="M 20 23 Q 24 27 28 23" stroke="#2C3E50" strokeWidth="1.8" strokeLinecap="round" />
      {/* Blue Sparkles */}
      <path d="M 38 8 L 40 4 L 42 8 L 46 10 L 42 12 L 40 16 L 38 12 L 34 10 Z" fill="#54A0FF" />
    </svg>
  );
}

// ⏰ Cheerful Analog Clock
export function Clock3DIcon({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <circle cx="24" cy="24" r="20" fill="#FECA57" stroke="#F0932B" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="16" fill="#FFFFFF" />
      {/* Clock Hands */}
      <line x1="24" y1="24" x2="24" y2="14" stroke="#EE5253" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="24" y1="24" x2="31" y2="24" stroke="#2E86DE" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="3" fill="#2C3E50" />
    </svg>
  );
}

// 🌙 Crescent Moon with Nightcap
export function Moon3DIcon({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="100%" stopColor="#F9CA24" />
        </linearGradient>
      </defs>
      {/* Crescent Moon */}
      <path
        d="M 30 6 C 18 8 10 20 12 32 C 14 42 26 46 36 40 C 26 38 20 28 24 16 C 26 12 28 8 30 6 Z"
        fill="url(#moonGrad)"
        stroke="#E67E22"
        strokeWidth="1.5"
      />
      {/* Sleepy Eye */}
      <path d="M 18 24 Q 22 28 26 24" stroke="#795548" strokeWidth="2" strokeLinecap="round" />
      {/* Star */}
      <polygon points="38,12 40,8 42,12 46,14 42,16 40,20 38,16 34,14" fill="#54A0FF" />
    </svg>
  );
}

// 💡 Warm Glowing Lightbulb
export function Bulb3DIcon({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <radialGradient id="bulbGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF200" />
          <stop offset="70%" stopColor="#FFA502" />
          <stop offset="100%" stopColor="#FF7F50" />
        </radialGradient>
      </defs>
      {/* Bulb Dome */}
      <path
        d="M 16 18 C 16 10 32 10 32 18 C 32 23 28 26 28 32 L 20 32 C 20 26 16 23 16 18 Z"
        fill="url(#bulbGlow)"
      />
      {/* Silver Screw Base */}
      <rect x="20" y="33" width="8" height="3" rx="1.5" fill="#BDC581" />
      <rect x="21" y="37" width="6" height="3" rx="1.5" fill="#95A5A6" />
      {/* Filament */}
      <path d="M 21 21 Q 24 17 27 21" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ============================================================================
// 5. SCREEN 2: 6 CUTE VECTOR DINOSAUR / ANIMAL AVATAR CARDS
// ============================================================================
export function DinoAvatarVector({ id = 'rex', className = 'w-10 h-10' }) {
  switch (id) {
    case 'rex':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="22" fill="#E8F8F5" />
          <ellipse cx="24" cy="25" rx="14" ry="13" fill="#2ED573" />
          <ellipse cx="31" cy="28" rx="8" ry="6" fill="#2ED573" />
          <circle cx="27" cy="21" r="2.8" fill="#FFFFFF" />
          <circle cx="28" cy="21" r="1.8" fill="#222F3E" />
          <path d="M 28 29 Q 33 33 36 29" stroke="#057C5A" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'tricera':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="22" fill="#EBF5FB" />
          <circle cx="24" cy="26" r="14" fill="#48DBFB" />
          <polygon points="12,14 16,22 10,22" fill="#F9CA24" />
          <polygon points="36,14 32,22 38,22" fill="#F9CA24" />
          <circle cx="20" cy="24" r="2.2" fill="#222F3E" />
          <circle cx="28" cy="24" r="2.2" fill="#222F3E" />
          <path d="M 21 29 Q 24 32 27 29" stroke="#0984E3" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'stego':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="22" fill="#FEF9E7" />
          <polygon points="16,12 20,6 24,14" fill="#FF7675" />
          <polygon points="26,12 30,6 34,14" fill="#FF7675" />
          <ellipse cx="24" cy="27" rx="15" ry="12" fill="#1DD1A1" />
          <circle cx="28" cy="24" r="2.2" fill="#222F3E" />
          <path d="M 26 30 Q 30 33 34 30" stroke="#10AC84" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'bronto':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="22" fill="#F5EEF8" />
          <path d="M 18 36 C 18 24 22 10 30 10 C 35 10 36 18 32 24 C 28 28 26 36 26 36 Z" fill="#9B59B6" />
          <circle cx="31" cy="14" r="2.2" fill="#FFFFFF" />
          <circle cx="32" cy="14" r="1.4" fill="#222F3E" />
          <path d="M 29 18 Q 33 20 35 18" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'fox':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="22" fill="#FDF2E9" />
          <polygon points="12,14 16,6 22,14" fill="#E67E22" />
          <polygon points="26,14 32,6 36,14" fill="#E67E22" />
          <circle cx="24" cy="25" r="13" fill="#FF9F43" />
          <circle cx="19" cy="24" r="2.2" fill="#222F3E" />
          <circle cx="29" cy="24" r="2.2" fill="#222F3E" />
          <polygon points="22,28 26,28 24,31" fill="#222F3E" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="22" fill="#EAFAF1" />
          <ellipse cx="24" cy="26" rx="14" ry="13" fill="#10B981" />
          <circle cx="20" cy="23" r="2.5" fill="#222F3E" />
          <circle cx="28" cy="23" r="2.5" fill="#222F3E" />
          <path d="M 21 28 Q 24 32 27 28" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
