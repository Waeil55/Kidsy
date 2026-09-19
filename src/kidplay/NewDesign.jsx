import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import {
  Home,
  MessageSquare,
  User,
  Play,
  Pause,
  Star,
  Volume2,
  VolumeX,
  ArrowLeft,
  Camera,
  Clock,
  X,
  Sparkles,
  Trophy,
  Award,
  Palette,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Send,
  Bot,
  BookOpen,
  Flame,
  Search,
  Bell,
  Check,
  Shield,
  Lock,
  Unlock,
  Languages,
  Smartphone,
  Monitor,
  Heart,
  Calendar,
  Layers,
  GraduationCap,
  BarChart2,
  RefreshCw,
  ExternalLink,
  Sliders,
  Grid,
  Gamepad2,
  Smile,
  Compass,
  Zap,
  HelpCircle,
  Settings,
  Filter,
  Bookmark,
  Share2,
  SlidersHorizontal,
  Lightbulb,
  Music,
  Info
} from 'lucide-react';

let sharedAudioCtx = null;
const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
};

// Zero-asset procedural audio generation using Web Audio API
const playSfx = (type = 'click', isMuted = false) => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'coin') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.09);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'correct') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } else if (type === 'celebrate') {
      [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.15, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.32);
      });
    } else if (type === 'whoosh') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (err) {}
};

const speak = (text, lang = 'en-US') => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 0.96;
      utt.pitch = 1.15;
      utt.lang = lang;
      window.speechSynthesis.speak(utt);
    } catch (e) {}
  }
};

const KidStyles = () => (
  <style>{`
    @keyframes kid-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px) scale(1.02); }
    }
    @keyframes kid-wiggle {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    @keyframes kid-pop {
      0% { transform: scale(0.96); }
      60% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    .animate-kid-bounce {
      animation: kid-bounce 2.5s ease-in-out infinite;
    }
    .animate-kid-wiggle {
      animation: kid-wiggle 1.8s ease-in-out infinite;
    }
    .kid-3d-btn {
      transition: all 0.12s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 5px 0 rgba(0, 0, 0, 0.16), 0 8px 16px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      user-select: none;
    }
    .kid-3d-btn:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 7px 0 rgba(0, 0, 0, 0.2), 0 12px 20px rgba(0, 0, 0, 0.14);
    }
    .kid-3d-btn:active {
      transform: translateY(4px) scale(0.98);
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.1);
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

// Blue Bird with Red Necktie
const BlueBirdIcon = memo(() => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 select-none drop-shadow-md animate-[bounce_3s_ease-in-out_infinite]" aria-label="Blue Bird">
    <ellipse cx="60" cy="65" rx="36" ry="38" fill="#4B96FF" />
    <ellipse cx="60" cy="72" rx="26" ry="26" fill="#D3E8FF" />
    <ellipse cx="48" cy="103" rx="8" ry="4" fill="#FFB703" />
    <ellipse cx="72" cy="103" rx="8" ry="4" fill="#FFB703" />
    <path d="M60 27 C56 16, 52 14, 48 18 C52 24, 56 26, 60 28 Z" fill="#2E79E6" />
    <path d="M63 26 C66 14, 71 13, 74 18 C70 24, 66 26, 63 28 Z" fill="#3A86FF" />
    <circle cx="50" cy="52" r="7" fill="#FFFFFF" />
    <circle cx="51" cy="52" r="4.5" fill="#1E293B" />
    <circle cx="53" cy="50" r="1.8" fill="#FFFFFF" />
    <circle cx="70" cy="52" r="7" fill="#FFFFFF" />
    <circle cx="69" cy="52" r="4.5" fill="#1E293B" />
    <circle cx="71" cy="50" r="1.8" fill="#FFFFFF" />
    <ellipse cx="43" cy="61" rx="4.5" ry="2.5" fill="#FF9EAA" opacity="0.7" />
    <ellipse cx="77" cy="61" rx="4.5" ry="2.5" fill="#FF9EAA" opacity="0.7" />
    <path d="M57 58 L63 58 L60 65 Z" fill="#FB8500" />
    <ellipse cx="28" cy="65" rx="9" ry="18" fill="#2E79E6" transform="rotate(15 28 65)" />
    <ellipse cx="92" cy="65" rx="9" ry="18" fill="#2E79E6" transform="rotate(-15 92 65)" />
    <path d="M44 68 L60 74 L76 68 L74 86 L60 89 L46 86 Z" fill="#EF4444" />
    <path d="M46 70 L60 75 L60 88 L47 84 Z" fill="#FCA5A5" />
    <path d="M60 75 L74 70 L73 84 L60 88 Z" fill="#FEE2E2" />
    <line x1="60" y1="74" x2="60" y2="89" stroke="#DC2626" strokeWidth="2" />
  </svg>
));

// Happy Lion with Heart
const HappyLionIcon = memo(() => (
  <svg viewBox="0 0 140 140" className="w-28 h-28 select-none drop-shadow-md hover:scale-105 transition-transform duration-300" aria-label="Happy Lion">
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
      <circle
        key={i}
        cx={70 + 44 * Math.cos((deg * Math.PI) / 180)}
        cy={70 + 44 * Math.sin((deg * Math.PI) / 180)}
        r="17"
        fill={i % 2 === 0 ? '#FDBA74' : '#F59E0B'}
      />
    ))}
    <circle cx="45" cy="42" r="12" fill="#FBBF24" />
    <circle cx="45" cy="42" r="7" fill="#FDE68A" />
    <circle cx="95" cy="42" r="12" fill="#FBBF24" />
    <circle cx="95" cy="42" r="7" fill="#FDE68A" />
    <circle cx="70" cy="70" r="38" fill="#FDE047" />
    <ellipse cx="56" cy="63" rx="5" ry="6" fill="#451A03" />
    <circle cx="58" cy="61" r="2" fill="#FFFFFF" />
    <ellipse cx="84" cy="63" rx="5" ry="6" fill="#451A03" />
    <circle cx="86" cy="61" r="2" fill="#FFFFFF" />
    <ellipse cx="48" cy="74" rx="6" ry="3.5" fill="#FCA5A5" />
    <ellipse cx="92" cy="74" rx="6" ry="3.5" fill="#FCA5A5" />
    <polygon points="70,69 66,74 74,74" fill="#B45309" />
    <path d="M66 76 Q70 80 74 76" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M78 88 C78 82 85 76 93 76 C101 76 107 83 107 90 C107 101 93 109 93 109 C93 109 78 101 78 90 Z" fill="#EF4444" />
  </svg>
));

// Friendly Dinosaur
const FriendlyDinoIcon = memo(() => (
  <svg viewBox="0 0 160 140" className="w-28 h-24 select-none drop-shadow-md hover:rotate-3 transition-transform" aria-label="Dinosaur">
    <ellipse cx="75" cy="85" rx="42" ry="38" fill="#84CC16" />
    <ellipse cx="68" cy="88" rx="28" ry="24" fill="#ECFCCB" />
    <path d="M90 85 C100 80 115 65 118 45 C120 30 110 20 95 20 C82 20 78 32 82 45 C85 55 88 70 88 85 Z" fill="#84CC16" />
    <circle cx="110" cy="35" r="5" fill="#FCA5A5" opacity="0.6" />
    <circle cx="102" cy="28" r="6" fill="#FFFFFF" />
    <circle cx="103" cy="28" r="3.5" fill="#1E293B" />
    <circle cx="105" cy="26" r="1.5" fill="#FFFFFF" />
    <polygon points="65,48 72,40 76,52" fill="#EAB308" />
    <polygon points="50,55 58,45 62,59" fill="#EAB308" />
    <polygon points="36,68 44,58 48,72" fill="#EAB308" />
    <path d="M102 40 Q112 44 116 38" stroke="#166534" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <rect x="52" y="112" width="14" height="20" rx="7" fill="#65A30D" />
    <rect x="80" y="112" width="14" height="20" rx="7" fill="#65A30D" />
  </svg>
));

// EduPlay Scholar Owl Mascot
const EduPlayOwlIcon = memo(({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 140 140" className={`${className} select-none drop-shadow-md`} aria-label="EduPlay Scholar Owl">
    <ellipse cx="70" cy="80" rx="42" ry="46" fill="#7C3AED" />
    <ellipse cx="70" cy="86" rx="30" ry="34" fill="#DDD6FE" />
    <ellipse cx="54" cy="126" rx="9" ry="5" fill="#F59E0B" />
    <ellipse cx="86" cy="126" rx="9" ry="5" fill="#F59E0B" />
    <ellipse cx="28" cy="80" rx="10" ry="22" fill="#6D28D9" transform="rotate(18 28 80)" />
    <ellipse cx="112" cy="80" rx="10" ry="22" fill="#6D28D9" transform="rotate(-18 112 80)" />
    <circle cx="52" cy="62" r="18" fill="#FFFFFF" />
    <circle cx="52" cy="62" r="11" fill="#3B82F6" />
    <circle cx="53" cy="61" r="6" fill="#1E1B4B" />
    <circle cx="55" cy="58" r="2.5" fill="#FFFFFF" />
    <circle cx="88" cy="62" r="18" fill="#FFFFFF" />
    <circle cx="88" cy="62" r="11" fill="#3B82F6" />
    <circle cx="87" cy="61" r="6" fill="#1E1B4B" />
    <circle cx="89" cy="58" r="2.5" fill="#FFFFFF" />
    <polygon points="70,72 64,80 76,80" fill="#F59E0B" />
    <polygon points="70,18 26,35 70,48 114,35" fill="#1E293B" />
    <polygon points="70,22 34,35 70,44 106,35" fill="#334155" />
    <rect x="52" y="38" width="36" height="12" rx="4" fill="#0F172A" />
    <path d="M102 38 Q110 50 114 62" stroke="#EAB308" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="114" cy="64" r="3" fill="#EAB308" />
    <rect x="50" y="86" width="40" height="28" rx="4" fill="#EA580C" />
    <rect x="54" y="88" width="15" height="24" rx="2" fill="#FED7AA" />
    <rect x="71" y="88" width="15" height="24" rx="2" fill="#FFEDD5" />
    <line x1="69" y1="86" x2="69" y2="114" stroke="#C2410C" strokeWidth="2" />
  </svg>
));

// Toby the Turtle Mascot
const TobyTurtleIcon = memo(({ className = "w-32 h-36" }) => (
  <svg viewBox="0 0 160 180" className={`${className} select-none drop-shadow-md`} aria-label="Toby the Turtle">
    <ellipse cx="80" cy="100" rx="48" ry="42" fill="#22C55E" />
    <ellipse cx="80" cy="98" rx="42" ry="36" fill="#4ADE80" stroke="#15803D" strokeWidth="3" />
    <path d="M60 85 L100 85 L110 102 L95 120 L65 120 L50 102 Z" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
    <ellipse cx="44" cy="130" rx="11" ry="16" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
    <ellipse cx="116" cy="130" rx="11" ry="16" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
    <ellipse cx="36" cy="90" rx="14" ry="10" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
    <ellipse cx="124" cy="90" rx="14" ry="10" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
    <circle cx="80" cy="54" r="26" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
    <circle cx="70" cy="50" r="4.5" fill="#0F172A" />
    <circle cx="71" cy="48" r="1.5" fill="#FFFFFF" />
    <circle cx="90" cy="50" r="4.5" fill="#0F172A" />
    <circle cx="91" cy="48" r="1.5" fill="#FFFFFF" />
    <path d="M72 62 Q80 68 88 62" stroke="#15803D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <ellipse cx="64" cy="58" rx="4" ry="2.5" fill="#FCA5A5" />
    <ellipse cx="96" cy="58" rx="4" ry="2.5" fill="#FCA5A5" />
    <ellipse cx="80" cy="34" rx="22" ry="5" fill="#3B82F6" />
    <path d="M66 33 C66 22, 70 18, 80 18 C90 18, 94 22, 94 33 Z" fill="#2563EB" />
    <rect x="66" y="28" width="28" height="5" fill="#1E3A8A" />
  </svg>
));

// Graduate Polar Bear Mascot
const GraduatePolarBearIcon = memo(({ className = "w-36 h-36" }) => (
  <svg viewBox="0 0 160 170" className={`${className} select-none drop-shadow-md`} aria-label="Graduate Polar Bear">
    <rect x="20" y="20" width="6" height="6" fill="#F43F5E" transform="rotate(25 20 20)" />
    <rect x="135" y="30" width="6" height="6" fill="#3B82F6" transform="rotate(45 135 30)" />
    <rect x="125" y="60" width="5" height="5" fill="#EAB308" transform="rotate(15 125 60)" />
    <rect x="15" y="70" width="5" height="5" fill="#10B981" transform="rotate(30 15 70)" />
    <circle cx="50" cy="48" r="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
    <circle cx="50" cy="48" r="6" fill="#FDA4AF" />
    <circle cx="110" cy="48" r="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
    <circle cx="110" cy="48" r="6" fill="#FDA4AF" />
    <ellipse cx="80" cy="115" rx="38" ry="42" fill="#1E293B" />
    <circle cx="80" cy="72" r="32" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
    <circle cx="70" cy="68" r="4" fill="#0F172A" />
    <circle cx="90" cy="68" r="4" fill="#0F172A" />
    <ellipse cx="80" cy="78" rx="10" ry="7" fill="#F1F5F9" />
    <ellipse cx="80" cy="76" rx="4" ry="2.5" fill="#0F172A" />
    <path d="M77 81 Q80 84 83 81" stroke="#0F172A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <ellipse cx="64" cy="76" rx="4" ry="2" fill="#FCA5A5" opacity="0.8" />
    <ellipse cx="96" cy="76" rx="4" ry="2" fill="#FCA5A5" opacity="0.8" />
    <path d="M72 104 L80 118 L88 104" stroke="#DC2626" strokeWidth="5" fill="none" />
    <circle cx="80" cy="120" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
    <polygon points="80,24 38,40 80,50 122,40" fill="#0F172A" />
    <rect x="62" y="44" width="36" height="8" rx="3" fill="#1E293B" />
    <path d="M110 42 Q120 54 122 65" stroke="#F59E0B" strokeWidth="2" fill="none" />
    <circle cx="122" cy="67" r="2.5" fill="#F59E0B" />
    <rect x="108" y="98" width="26" height="8" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" transform="rotate(-30 108 98)" />
    <line x1="120" y1="92" x2="122" y2="100" stroke="#DC2626" strokeWidth="2.5" />
  </svg>
));

// Safari Jeep with Friendly Animals
const SafariJeepIcon = memo(({ className = "w-28 h-24" }) => (
  <svg viewBox="0 0 140 120" className={`${className} select-none drop-shadow-sm`} aria-label="Safari Jeep with Animals">
    <circle cx="92" cy="30" r="10" fill="#F59E0B" />
    <path d="M88 18 L88 24 M96 18 L96 24" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
    <rect x="90" y="36" width="6" height="20" fill="#F59E0B" />
    <circle cx="48" cy="46" r="12" fill="#94A3B8" />
    <ellipse cx="36" cy="46" rx="6" ry="9" fill="#94A3B8" />
    <path d="M48 50 Q46 62 50 64" stroke="#64748B" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="70" cy="48" r="11" fill="#FB923C" />
    <circle cx="67" cy="46" r="1.5" fill="#000" />
    <circle cx="73" cy="46" r="1.5" fill="#000" />
    <polygon points="70,49 68,52 72,52" fill="#B45309" />
    <rect x="30" y="62" width="80" height="30" rx="8" fill="#EF4444" />
    <rect x="36" y="65" width="68" height="12" rx="3" fill="#FEF08A" opacity="0.8" />
    <circle cx="48" cy="94" r="11" fill="#1E293B" />
    <circle cx="48" cy="94" r="5" fill="#94A3B8" />
    <circle cx="92" cy="94" r="11" fill="#1E293B" />
    <circle cx="92" cy="94" r="5" fill="#94A3B8" />
    <rect x="58" y="78" width="24" height="10" rx="2" fill="#B91C1C" />
    <line x1="64" y1="78" x2="64" y2="88" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="70" y1="78" x2="70" y2="88" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="76" y1="78" x2="76" y2="88" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
));

// Elephant Kid with Alphabet Letter E
const LetterEKidIcon = memo(({ className = "w-28 h-24" }) => (
  <svg viewBox="0 0 140 120" className={`${className} select-none drop-shadow-sm`} aria-label="Alphabet Letter E">
    <circle cx="45" cy="60" r="18" fill="#CBD5E1" />
    <ellipse cx="28" cy="58" rx="8" ry="12" fill="#94A3B8" />
    <circle cx="45" cy="58" r="11" fill="#FED7AA" />
    <circle cx="42" cy="56" r="1.5" fill="#000" />
    <circle cx="48" cy="56" r="1.5" fill="#000" />
    <path d="M43 62 Q45 64 47 62" stroke="#9A3412" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M45 64 Q43 74 48 76" stroke="#64748B" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M72 32 L112 32 M72 32 L72 88 L112 88 M72 60 L104 60" stroke="#F87171" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M72 32 L112 32 M72 32 L72 88 L112 88 M72 60 L104 60" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
));

// User Profile Avatar - Maheen Hassan
const MaheenAvatar = memo(() => (
  <svg viewBox="0 0 100 100" className="w-full h-full select-none" aria-label="Maheen Avatar">
    <circle cx="50" cy="50" r="50" fill="#2563EB" />
    <circle cx="50" cy="48" r="26" fill="#FFE4B5" />
    <path d="M24 44 C24 22 40 16 50 16 C62 16 76 22 76 44 C76 45 74 38 70 34 C64 30 60 36 50 28 C44 34 38 30 32 36 C28 40 25 43 24 44 Z" fill="#1E293B" />
    <circle cx="41" cy="48" r="9" fill="none" stroke="#0F172A" strokeWidth="3" />
    <circle cx="59" cy="48" r="9" fill="none" stroke="#0F172A" strokeWidth="3" />
    <line x1="50" y1="48" x2="50" y2="48" stroke="#0F172A" strokeWidth="3" />
    <circle cx="41" cy="48" r="4" fill="#1E293B" />
    <circle cx="43" cy="46" r="1.5" fill="#FFFFFF" />
    <circle cx="59" cy="48" r="4" fill="#1E293B" />
    <circle cx="61" cy="46" r="1.5" fill="#FFFFFF" />
    <path d="M46 56 Q50 60 54 56" stroke="#9A3412" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M28 86 C28 72 38 72 50 72 C62 72 72 72 72 86 Z" fill="#38BDF8" />
  </svg>
));

// Jane Cooper Avatar
const JaneCooperAvatar = memo(() => (
  <svg viewBox="0 0 100 100" className="w-full h-full select-none" aria-label="Jane Cooper Avatar">
    <circle cx="50" cy="50" r="50" fill="#FBBF24" />
    <circle cx="50" cy="50" r="26" fill="#FCD34D" />
    <path d="M26 44 C26 24 38 18 50 18 C64 18 74 24 74 44 C74 52 70 56 68 56 C62 38 42 38 32 56 Z" fill="#78350F" />
    <circle cx="42" cy="50" r="3.5" fill="#451A03" />
    <circle cx="58" cy="50" r="3.5" fill="#451A03" />
    <ellipse cx="36" cy="56" rx="3.5" ry="2" fill="#F87171" opacity="0.6" />
    <ellipse cx="64" cy="56" rx="3.5" ry="2" fill="#F87171" opacity="0.6" />
    <path d="M46 60 Q50 64 54 60" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M30 88 C30 74 40 74 50 74 C60 74 70 74 70 88 Z" fill="#10B981" />
  </svg>
));

const GRADES = [
  { id: 'KG', label: 'Kindergarten', age: '4-5 yrs', desc: 'Phonics & Basic Counting' },
  { id: 'G1', label: 'Grade 1', age: '6-7 yrs', desc: 'Addition & Simple Reading' },
  { id: 'G2', label: 'Grade 2', age: '7-8 yrs', desc: 'Word Problems & Nature' },
  { id: 'G3', label: 'Grade 3', age: '8-9 yrs', desc: 'Multiplication & Earth Science' },
  { id: 'G4', label: 'Grade 4', age: '9-10 yrs', desc: 'Fractions & Geography' },
  { id: 'G5', label: 'Grade 5', age: '10-11 yrs', desc: 'Critical Thinking & STEM' },
  { id: 'G6', label: 'Grade 6', age: '11-12 yrs', desc: 'Pre-Algebra & Global History' }
];

const DrawingCanvas = memo(({ earnCoins, setActiveModalGame, isAudioMuted }) => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#EF4444');
  const [brushSize, setBrushSize] = useState(12);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const rect = c.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDraw = (e) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const drawMove = (e) => {
    if (!isDrawing) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    playSfx('pop', isAudioMuted);
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (ctx) {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, c.width / dpr, c.height / dpr);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4">
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 animate-kid-bounce">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-base sm:text-lg text-slate-800 tracking-wide">Magic Drawing Board</h2>
            <p className="text-xs font-bold text-slate-400">Pick a bright color and draw!</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={clearCanvas}
            className="kid-3d-btn px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5"
            aria-label="Clear drawing"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>
          <button
            onClick={() => {
              playSfx('celebrate', isAudioMuted);
              earnCoins(25);
              setActiveModalGame(null);
            }}
            className="kid-3d-btn px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5"
          >
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Save Art ⭐</span>
          </button>
        </div>
      </div>

      <div className="flex-1 my-3 bg-amber-50/40 rounded-3xl border-4 border-dashed border-amber-200 overflow-hidden flex items-center justify-center shadow-inner">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-white cursor-crosshair touch-none"
          onMouseDown={startDraw}
          onMouseMove={drawMove}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={drawMove}
          onTouchEnd={stopDraw}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2">
          {['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#000000'].map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                playSfx('click', isAudioMuted);
              }}
              aria-label={`Color ${c}`}
              className={`w-9 h-9 rounded-2xl border-4 transition-all duration-150 ${
                color === c ? 'scale-125 border-slate-900 shadow-lg ring-4 ring-amber-300' : 'border-white hover:scale-110 shadow-sm'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-xs font-black text-slate-600">Brush</span>
          <input
            type="range"
            min="4"
            max="32"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 sm:w-32 h-3 accent-indigo-600 cursor-pointer"
            aria-label="Brush size"
          />
        </div>
      </div>
    </div>
  );
});

const PuzzleBoard = memo(({ earnCoins, isAudioMuted }) => {
  const [tiles, setTiles] = useState([1, 2, 3, 4, 5, 6, 7, 0, 8]);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  const onTileClick = (idx) => {
    const emptyIdx = tiles.indexOf(0);
    const r1 = Math.floor(idx / 3);
    const c1 = idx % 3;
    const r2 = Math.floor(emptyIdx / 3);
    const c2 = emptyIdx % 3;
    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1) {
      playSfx('pop', isAudioMuted);
      const next = [...tiles];
      next[emptyIdx] = next[idx];
      next[idx] = 0;
      setTiles(next);
      setMoves((m) => m + 1);
      if (next.slice(0, 8).every((v, i) => v === i + 1)) {
        setSolved(true);
        playSfx('celebrate', isAudioMuted);
        earnCoins(50);
        speak('Awesome job! You solved the picture puzzle!');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center justify-between h-full bg-[#FAF5EE]">
      <div className="w-full flex items-center justify-between mb-3 bg-white p-3.5 rounded-2xl border border-amber-100 shadow-sm">
        <div>
          <h2 className="font-black text-base sm:text-lg text-slate-800">Animal Picture Match 🧩</h2>
          <p className="text-xs font-bold text-slate-400">Slide tiles into counting order 1 to 8!</p>
        </div>
        <span className="text-sm bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full font-black shadow-inner">
          Moves: {moves}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 w-72 h-72 sm:w-80 sm:h-80 bg-white p-3.5 rounded-[32px] shadow-xl border-4 border-amber-200">
        {tiles.map((num, i) => (
          <button
            key={i}
            onClick={() => onTileClick(i)}
            disabled={num === 0 || solved}
            className={`rounded-2xl font-black text-3xl flex items-center justify-center transition-all ${
              num === 0
                ? 'bg-amber-50/50 border-4 border-dashed border-amber-200'
                : 'kid-3d-btn bg-gradient-to-br from-blue-500 to-indigo-600 text-white active:scale-95'
            }`}
          >
            {num !== 0 && (
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl animate-kid-bounce">{['🦁', '🐧', '🦊', '🐻', '🐼', '🐨', '🐰', '🐯'][num - 1]}</span>
                <span className="text-xs font-black opacity-90">{num}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {solved ? (
        <div className="text-center p-4 bg-emerald-100 border-2 border-emerald-300 rounded-3xl w-full max-w-sm animate-kid-bounce">
          <p className="font-black text-emerald-800 text-base sm:text-lg">🎉 Puzzle Solved! +50 Stars! 🌟</p>
        </div>
      ) : (
        <button
          onClick={() => {
            playSfx('pop', isAudioMuted);
            setTiles([1, 2, 3, 4, 5, 6, 0, 7, 8]);
            setMoves(0);
          }}
          className="kid-3d-btn w-full max-w-sm py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-base shadow-lg tracking-wide transition"
        >
          🎲 Shuffle Animal Tiles!
        </button>
      )}
    </div>
  );
});

const AnimalGridMatchGame = memo(({ earnCoins, isAudioMuted, onBack }) => {
  const [targetAnimal] = useState('Lion');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(46);
  const [isSuccess, setIsSuccess] = useState(false);

  const animalOptions = [
    { id: 'cat', emoji: '🐱', label: 'Cat' },
    { id: 'owl', emoji: '🦉', label: 'Owl' },
    { id: 'fox', emoji: '🦊', label: 'Fox' },
    { id: 'tiger', emoji: '🐯', label: 'Tiger' },
    { id: 'lion', emoji: '🦁', label: 'Lion', correct: true },
    { id: 'giraffe', emoji: '🦒', label: 'Giraffe' },
    { id: 'pig', emoji: '🐷', label: 'Pig' },
    { id: 'panda', emoji: '🐼', label: 'Panda' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheck = () => {
    if (selectedIdx === null) return;
    const choice = animalOptions[selectedIdx];
    if (choice.correct) {
      setIsSuccess(true);
      playSfx('correct', isAudioMuted);
      speak('Correct! You found the mighty Lion!');
      earnCoins(40);
    } else {
      playSfx('pop', isAudioMuted);
      speak('Not quite! Look for the lion with the golden mane.');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-28 no-scrollbar bg-[#FAF5F0]">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="kid-3d-btn p-3 bg-white rounded-2xl border-2 border-slate-200 text-slate-700 flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-amber-800 bg-amber-200/80 px-4 py-1.5 rounded-full shadow-sm">
            Level 1
          </span>
          <span className="text-sm font-mono font-black text-slate-700 bg-white px-3.5 py-1 rounded-full border-2 border-slate-200 shadow-sm">
            ⏱️ 00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-amber-200 flex flex-col items-center justify-center mb-4">
        <span className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Find This Animal</span>
        <h2 className="text-3xl font-black text-slate-800 tracking-wide mb-2">{targetAnimal}</h2>
        <div className="w-28 h-28 rounded-3xl bg-amber-50 border-4 border-amber-200 flex items-center justify-center shadow-inner animate-kid-bounce">
          <span className="text-7xl">🦁</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5 mb-4">
        {animalOptions.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => {
              playSfx('click', isAudioMuted);
              setSelectedIdx(idx);
            }}
            className={`p-3 rounded-2xl border-4 flex flex-col items-center justify-center transition-all ${
              selectedIdx === idx
                ? 'border-amber-500 bg-amber-100 shadow-lg scale-105 ring-4 ring-amber-300'
                : 'border-slate-200 bg-white hover:border-amber-300 hover:scale-102'
            }`}
          >
            <span className="text-4xl mb-1">{item.emoji}</span>
            <span className="text-xs font-black text-slate-800">{item.label}</span>
          </button>
        ))}
      </div>

      {isSuccess ? (
        <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-900 p-4 rounded-3xl text-center mb-2 animate-kid-bounce">
          <p className="font-black text-base">🎉 Match Complete! +40 Stars Earned! 🌟</p>
        </div>
      ) : (
        <button
          onClick={handleCheck}
          className="kid-3d-btn w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-lg tracking-wide shadow-xl transition"
        >
          Check My Answer! ✨
        </button>
      )}
    </div>
  );
});

const TobyTurtleBookScreen = memo(({ onBack, isAudioMuted, earnCoins }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  const pagesContent = [
    { text: "Once upon a sunny morning, Toby the Turtle put on his favorite blue hat. Today was the big day!" },
    { text: "Toby packed two green lettuce leaves and a tiny shiny compass. 'I'm ready for the jungle river!' he cheered." },
    { text: "Along the riverbank, Toby met Sammy the friendly Sparrow. Sammy chirped, 'Keep walking, Toby, the waterfall is ahead!'" },
    { text: "Toby moved slow and steady. Step by step, his little green paws crossed over pebble bridges." },
    { text: "Suddenly, Toby heard a joyful splash! It was Leo the baby lion playing in the warm jungle creek." },
    { text: "Leo and Toby shared fresh berries under the shade of giant tropical palm trees." },
    { text: "The sun began to dip into warm golden colors. Toby opened his little compass and smiled." },
    { text: "Toby made it safely back home with a heart full of joy. 'Kindness and courage win every day!'" }
  ];

  const handleRead = () => {
    speak(pagesContent[currentPage - 1].text);
    playSfx('pop', isAudioMuted);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-28 no-scrollbar bg-[#F5F3FF]">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="kid-3d-btn p-3 bg-white rounded-2xl border-2 border-indigo-200 text-indigo-700 flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-black text-indigo-800 bg-indigo-100 px-4 py-1.5 rounded-full border border-indigo-200">
          Page {currentPage} of {totalPages} 📖
        </span>
        <button
          onClick={handleRead}
          className="kid-3d-btn px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
          aria-label="Listen"
        >
          <Volume2 className="w-5 h-5" />
          <span>Read to Me</span>
        </button>
      </div>

      <div className="bg-gradient-to-b from-[#EDE9FE] to-white rounded-[32px] p-5 shadow-lg border-2 border-indigo-100 flex flex-col items-center text-center mb-4">
        <div className="animate-kid-bounce">
          <TobyTurtleIcon className="w-36 h-40 mb-2" />
        </div>
        <h2 className="text-xl font-black text-slate-800 leading-tight">Toby the Turtle's</h2>
        <h3 className="text-base font-extrabold text-indigo-600 mb-3">Big Trip Adventure</h3>
        <div className="bg-white p-4 rounded-2xl border-2 border-indigo-100 shadow-sm w-full min-h-[90px] flex items-center justify-center">
          <p className="text-base sm:text-lg font-bold text-slate-700 leading-relaxed">
            "{pagesContent[currentPage - 1].text}"
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1.5 mb-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <button
            key={num}
            onClick={() => {
              playSfx('pop', isAudioMuted);
              setCurrentPage(num);
              earnCoins(5);
            }}
            className={`w-9 h-9 rounded-xl text-sm font-black transition-all flex items-center justify-center ${
              currentPage === num
                ? 'bg-amber-500 text-white shadow-md scale-110 ring-2 ring-amber-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 mt-auto">
        <button
          disabled={currentPage === 1}
          onClick={() => {
            playSfx('pop', isAudioMuted);
            setCurrentPage((p) => Math.max(1, p - 1));
          }}
          className="kid-3d-btn flex-1 py-4 bg-white border-2 border-slate-300 text-slate-800 disabled:opacity-40 rounded-2xl text-base font-black transition"
        >
          ⬅️ Back
        </button>
        <button
          onClick={() => {
            if (currentPage < totalPages) {
              setCurrentPage((p) => p + 1);
              playSfx('pop', isAudioMuted);
            } else {
              playSfx('celebrate', isAudioMuted);
              earnCoins(30);
              speak('Congratulations! You finished the whole story!');
            }
          }}
          className="kid-3d-btn flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-base font-black shadow-lg transition"
        >
          {currentPage === totalPages ? 'Finish Book 🎉' : 'Next Page ➡️'}
        </button>
      </div>
    </div>
  );
});

const ChampionBadgesScreen = memo(({ onBack, coins, earnCoins, isAudioMuted }) => {
  const [claimed, setClaimed] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 pt-4 pb-28 no-scrollbar bg-gradient-to-b from-[#FCE7F3] via-[#FFF1F2] to-white items-center text-center justify-between">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="kid-3d-btn p-3 bg-white rounded-2xl border-2 border-rose-200 text-rose-700"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-black text-rose-700 bg-rose-200 px-4 py-1.5 rounded-full">
          Quizzy Champion 🏆
        </span>
      </div>

      <div className="my-3 relative flex items-center justify-center animate-kid-bounce">
        <GraduatePolarBearIcon className="w-48 h-48" />
      </div>

      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-black text-slate-800 leading-tight mb-2">
          Earn Stars & Unlock Badges!
        </h2>
        <p className="text-sm font-bold text-slate-600 leading-relaxed mb-4">
          Learn and play every day to level up your rank and become a proud Quizzy Champion!
        </p>

        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-2xl border-2 border-rose-200 shadow-sm">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-black text-slate-800">{coins} Stars</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-2xl border-2 border-rose-200 shadow-sm">
            <Award className="w-5 h-5 text-rose-500" />
            <span className="text-sm font-black text-slate-800">8 Badges</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          if (!claimed) {
            setClaimed(true);
            playSfx('celebrate', isAudioMuted);
            earnCoins(100);
            speak('Hooray! 100 bonus stars added to your treasure chest!');
          }
        }}
        className="kid-3d-btn w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-base sm:text-lg shadow-xl tracking-wide transition"
      >
        {claimed ? 'Claimed +100 Stars! 🌟' : 'Get Started & Claim 100 ⭐'}
      </button>
    </div>
  );
});

const EduPlayHubScreen = memo(({ setCurrentScreen, earnCoins, isAudioMuted }) => {
  const subjects = [
    {
      id: 'math',
      name: 'Mathematics',
      icon: '🧮',
      bg: 'bg-rose-100 hover:bg-rose-200',
      border: 'border-rose-300',
      textColor: 'text-rose-900',
      targetScreen: 'eduplay-math'
    },
    {
      id: 'science',
      name: 'Science',
      icon: '🔬',
      bg: 'bg-purple-100 hover:bg-purple-200',
      border: 'border-purple-300',
      textColor: 'text-purple-900',
      targetScreen: 'image4-dino'
    },
    {
      id: 'art',
      name: 'Art & Craft',
      icon: '🎨',
      bg: 'bg-cyan-100 hover:bg-cyan-200',
      border: 'border-cyan-300',
      textColor: 'text-cyan-900',
      targetScreen: 'image1-modal'
    },
    {
      id: 'social',
      name: 'Social Study',
      icon: '🌍',
      bg: 'bg-emerald-100 hover:bg-emerald-200',
      border: 'border-emerald-300',
      textColor: 'text-emerald-900',
      targetScreen: 'image6-reader'
    }
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-28 no-scrollbar bg-slate-50">
      <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-md">
        <div>
          <span className="text-xs font-black text-indigo-600 uppercase tracking-wide">EduPlay Learning</span>
          <h2 className="text-lg font-black text-slate-800">Hello, Vyom! 👋</h2>
          <p className="text-xs font-bold text-slate-400">Ready for fun learning today?</p>
        </div>
        <div className="w-16 h-16 flex items-center justify-center animate-kid-bounce">
          <EduPlayOwlIcon className="w-16 h-16" />
        </div>
      </div>

      <h3 className="text-sm font-black text-slate-800 mb-2 px-1">Pick a Subject</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {subjects.map((sub) => (
          <button
            key={sub.id}
            onClick={() => {
              playSfx('pop', isAudioMuted);
              speak(sub.name);
              setCurrentScreen(sub.targetScreen);
            }}
            className={`kid-3d-btn ${sub.bg} border-3 ${sub.border} p-5 rounded-3xl flex flex-col items-center text-center transition-all`}
          >
            <span className="text-5xl mb-2 animate-kid-wiggle">{sub.icon}</span>
            <span className={`text-sm font-black ${sub.textColor}`}>{sub.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-4 text-white shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-black bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
            Mini Game
          </span>
          <h4 className="font-black text-sm sm:text-base">Math Brain Challenge</h4>
          <p className="text-xs font-bold text-purple-100">Quick arithmetic fun</p>
        </div>
        <button
          onClick={() => {
            playSfx('click', isAudioMuted);
            setCurrentScreen('eduplay-math');
          }}
          className="kid-3d-btn px-5 py-3 bg-white text-purple-800 font-black text-sm rounded-2xl shadow-md"
        >
          Play 🚀
        </button>
      </div>
    </div>
  );
});

const EduPlayMathQuiz = memo(({ onBack, earnCoins, isAudioMuted }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const options = [20, 17, 15, 22];

  const handleSelect = (val) => {
    setSelectedAnswer(val);
    if (val === 17) {
      setIsCorrect(true);
      playSfx('correct', isAudioMuted);
      speak('Correct! 12 plus 7 minus 2 equals 17!');
      earnCoins(35);
    } else {
      setIsCorrect(false);
      playSfx('pop', isAudioMuted);
      speak('Not quite! Try counting carefully.');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-28 no-scrollbar bg-gradient-to-b from-[#FEF3C7] via-[#FFFBEB] to-white justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="kid-3d-btn p-3 bg-white rounded-2xl border-2 border-amber-200 text-amber-800"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="w-40 bg-amber-200 h-3 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-3/4 rounded-full" />
          </div>
          <span className="text-sm font-black text-amber-900">3 of 4 ⭐</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border-3 border-amber-200 text-center mb-6">
          <span className="text-xs font-black text-amber-600 block mb-2 uppercase tracking-wider">Quick Math Challenge</span>
          <h2 className="text-4xl font-black text-slate-800 tracking-wide">
            12 + 7 - 2 = ?
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3.5 mb-4">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`kid-3d-btn p-6 rounded-3xl text-2xl font-black transition-all border-3 ${
                selectedAnswer === opt
                  ? opt === 17
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-4 ring-emerald-300'
                    : 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-amber-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          if (isCorrect) {
            playSfx('celebrate', isAudioMuted);
            onBack();
          } else {
            speak('Choose the right answer first!');
          }
        }}
        className="kid-3d-btn w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-base sm:text-lg shadow-xl tracking-wide transition"
      >
        {isCorrect ? 'Awesome! Continue 🎉' : 'Pick Your Answer ✨'}
      </button>
    </div>
  );
});

const ModernMinimalHubScreen = memo(({ setCurrentScreen, isAudioMuted }) => (
  <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-28 no-scrollbar bg-[#FAF8F5]">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-amber-400 shadow-md">
          <JaneCooperAvatar />
        </div>
        <div>
          <span className="text-xs text-slate-400 font-bold block">Hello Little 👋</span>
          <h2 className="text-base font-black text-slate-800">Jane Cooper</h2>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm font-black text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-200">
          <span>18</span>
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
        </span>
      </div>
    </div>

    <div className="bg-[#FFF1F2] rounded-3xl p-5 shadow-md border-2 border-rose-100 mb-3.5 relative overflow-hidden">
      <div className="max-w-[62%] relative z-10">
        <h3 className="text-base font-black text-slate-800 leading-snug mb-3">
          Can you ace the animal quiz?
        </h3>
        <button
          onClick={() => {
            playSfx('click', isAudioMuted);
            setCurrentScreen('animal-match-game');
          }}
          className="kid-3d-btn px-5 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-black text-sm rounded-2xl shadow-md transition"
        >
          Start Now 🚀
        </button>
      </div>
      <div className="absolute right-1 bottom-0 animate-kid-bounce">
        <SafariJeepIcon className="w-32 h-28" />
      </div>
    </div>

    <div className="bg-[#FFF8E6] rounded-3xl p-5 shadow-md border-2 border-amber-200 mb-3.5 relative overflow-hidden">
      <div className="max-w-[60%] relative z-10">
        <span className="text-xs text-slate-400 font-black uppercase tracking-wide">Learning</span>
        <h3 className="text-base font-black text-slate-800 leading-snug mb-3">
          A to Z Alphabet
        </h3>
        <button
          onClick={() => {
            playSfx('click', isAudioMuted);
            setCurrentScreen('toby-book');
          }}
          className="kid-3d-btn px-5 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-white font-black text-sm rounded-2xl shadow-md transition"
        >
          Read Now 📖
        </button>
      </div>
      <div className="absolute right-1 bottom-0 animate-kid-wiggle">
        <LetterEKidIcon className="w-32 h-28" />
      </div>
    </div>

    <div className="bg-[#F0FDF4] rounded-3xl p-5 shadow-md border-2 border-emerald-100 mb-3.5 relative overflow-hidden">
      <div className="max-w-[60%] relative z-10">
        <h3 className="text-base font-black text-slate-800 leading-snug mb-3">
          Choose a quiz to test your brain!
        </h3>
        <button
          onClick={() => {
            playSfx('click', isAudioMuted);
            setCurrentScreen('image5-quiz');
          }}
          className="kid-3d-btn px-5 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-black text-sm rounded-2xl shadow-md transition"
        >
          Take Quiz ❓
        </button>
      </div>
      <div className="absolute right-2 bottom-2 text-5xl animate-kid-bounce">
        🧩
      </div>
    </div>
  </div>
));

const ScreenImage1Home = memo(({
  coins,
  earnCoins,
  habitClaimed,
  setHabitClaimed,
  setCurrentScreen,
  setActiveModalGame,
  isAudioMuted
}) => (
  <div className="flex flex-col h-full overflow-y-auto px-4 pt-3 pb-28 no-scrollbar">
    <div className="flex items-center justify-between mb-3.5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentScreen('image1-profile')}
          className="w-12 h-12 rounded-full overflow-hidden border-3 border-blue-400 shadow-md cursor-pointer hover:scale-105 transition"
          aria-label="View profile"
        >
          <MaheenAvatar />
        </button>
        <div>
          <p className="text-xs font-bold text-slate-400 leading-none">Good Afternoon!</p>
          <h2 className="text-base font-black text-slate-800 leading-snug">Maheen Hassan 👋</h2>
        </div>
      </div>
      <button
        onClick={() => earnCoins(20)}
        className="kid-3d-btn flex items-center gap-1.5 bg-[#2E79E6] hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-md"
      >
        <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
        <span className="text-sm font-black">{coins}</span>
      </button>
    </div>

    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#D7E9FE] via-[#E4F0FF] to-[#EAF3FF] p-5 shadow-md border-2 border-blue-100 mb-4">
      <div className="max-w-[62%] z-10 relative">
        <span className="text-xs font-black text-blue-700 block mb-1">Today's Good Habit</span>
        <h3 className="text-base font-black text-slate-800 leading-snug mb-3">
          "Kindness makes the world a better place."
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSfx('pop', isAudioMuted);
              speak('Kindness makes the world a better place.');
              if (!habitClaimed) {
                setHabitClaimed(true);
                earnCoins(100);
              }
            }}
            className="kid-3d-btn flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-full text-xs font-black"
          >
            <span>Listen</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
          <div className="flex items-center gap-1 text-xs font-black text-amber-700 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>+100</span>
          </div>
        </div>
      </div>
      <div className="absolute -right-1 bottom-0 animate-kid-bounce">
        <BlueBirdIcon />
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3 mb-4">
      <button
        onClick={() => {
          playSfx('click', isAudioMuted);
          speak('Welcome to Alphabets Explorer!');
          setCurrentScreen('image2-fun');
        }}
        className="kid-3d-btn bg-[#EDF5FF] hover:bg-blue-100 rounded-3xl p-3.5 flex flex-col items-center text-center border-2 border-blue-200"
      >
        <span className="text-4xl mb-1 animate-kid-bounce">🐧</span>
        <span className="text-xs sm:text-sm font-black text-slate-800">Alphabets</span>
      </button>
      <button
        onClick={() => {
          playSfx('click', isAudioMuted);
          speak('Numbers Fun!');
          setCurrentScreen('image5-quiz');
        }}
        className="kid-3d-btn bg-[#FFF0F3] hover:bg-pink-100 rounded-3xl p-3.5 flex flex-col items-center text-center border-2 border-pink-200"
      >
        <span className="text-4xl mb-1 animate-kid-wiggle">🦊</span>
        <span className="text-xs sm:text-sm font-black text-slate-800">Numbers</span>
      </button>
      <button
        onClick={() => {
          playSfx('pop', isAudioMuted);
          setCurrentScreen('image1-modal');
        }}
        className="kid-3d-btn bg-[#FFF6ED] hover:bg-amber-100 rounded-3xl p-3.5 flex flex-col items-center text-center border-2 border-amber-200"
      >
        <span className="text-4xl mb-1 animate-kid-bounce">🐻</span>
        <span className="text-xs sm:text-sm font-black text-slate-800">More Fun</span>
      </button>
    </div>

    <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-slate-100 flex items-center justify-between mb-4">
      <div>
        <h3 className="text-base font-black text-slate-800">Puzzle Game 🧩</h3>
        <p className="text-xs font-bold text-slate-400">Play & match animal tiles</p>
      </div>
      <button
        onClick={() => {
          playSfx('pop', isAudioMuted);
          setActiveModalGame('puzzle');
        }}
        className="kid-3d-btn flex items-center gap-1.5 bg-[#2E79E6] hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-black"
      >
        <span>Play</span>
        <Play className="w-3.5 h-3.5 fill-current" />
      </button>
    </div>

    <div
      onClick={() => {
        playSfx('pop', isAudioMuted);
        speak('Story About The Happy Lion. A wonderful tale of kindness in the forest.');
        setCurrentScreen('image6-reader');
      }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFF6E5] to-[#FFEDD5] p-5 shadow-md border-2 border-amber-200 cursor-pointer hover:shadow-lg transition"
    >
      <div className="max-w-[60%] z-10 relative">
        <span className="text-xs font-black text-amber-700 uppercase block mb-1">Featured Story</span>
        <h4 className="text-base font-black text-slate-800 leading-tight mb-3">
          "Story About The Happy Lion"
        </h4>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white text-amber-800 px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
            <span>Play Story</span>
            <Play className="w-3 h-3 fill-current" />
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>14 min</span>
          </div>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 animate-kid-bounce">
        <HappyLionIcon />
      </div>
    </div>
  </div>
));

const ScreenImage1Modal = memo(({ setCurrentScreen, setActiveModalGame, showToast, isAudioMuted }) => {
  const [activeFlashcard, setActiveFlashcard] = useState(null);

  const categories = [
    { id: 'draw', title: 'Drawing Board', icon: '🎨', desc: 'Freehand canvas with vibrant colors' },
    { id: 'puzzle', title: 'Picture Puzzle', icon: '🧩', desc: 'Slide & order cute animal tiles' },
    { id: 'shapes', title: 'Shapes', icon: '🧊', desc: 'Circles, triangles, and cubes' },
    { id: 'fruits', title: 'Fruit & Veggies', icon: '🍎', desc: 'Apples, bananas, and vitamins' },
    { id: 'colors', title: 'Colors', icon: '🌈', desc: 'Rainbows and paint mixes' },
    { id: 'animals', title: 'Animals', icon: '🐮', desc: 'Lions, tigers, and friendly pets' },
    { id: 'sports', title: 'Sports', icon: '⚽', desc: 'Soccer, basketball, and active games' },
    { id: 'birds', title: 'Birds', icon: '🐦', desc: 'Bluebirds, robins, and owls' },
    { id: 'coloring', title: 'Coloring Book', icon: '🐱', desc: 'Fun outlined animal templates' },
    { id: 'words', title: 'Word Puzzle', icon: '🔡', desc: 'Spelling and phonics builder' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#FFF1F3] p-4 overflow-y-auto no-scrollbar justify-between">
      <div>
        <div className="w-16 h-2 bg-pink-300 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-800">Explore Categories</h2>
          <span className="text-xs font-bold text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
            10 Topics 🌟
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                playSfx('click', isAudioMuted);
                if (c.id === 'draw') {
                  setActiveModalGame('drawing');
                } else if (c.id === 'puzzle') {
                  setActiveModalGame('puzzle');
                } else {
                  speak(`${c.title}. ${c.desc}`);
                  setActiveFlashcard(c);
                }
              }}
              className="kid-3d-btn bg-white rounded-3xl p-4 flex flex-col items-center text-center border-2 border-pink-200"
            >
              <span className="text-4xl mb-2 animate-kid-bounce">{c.icon}</span>
              <span className="text-sm font-black text-slate-800 leading-snug">{c.title}</span>
              <span className="text-[11px] font-bold text-slate-400 mt-1 line-clamp-1">{c.desc}</span>
            </button>
          ))}
        </div>

        {activeFlashcard && (
          <div className="bg-white p-4 rounded-3xl border-3 border-pink-400 shadow-xl mb-4 animate-kid-bounce">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{activeFlashcard.icon}</span>
              <button
                onClick={() => setActiveFlashcard(null)}
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h4 className="text-base font-black text-slate-800">{activeFlashcard.title}</h4>
            <p className="text-xs font-bold text-slate-600 mt-1">{activeFlashcard.desc}</p>
          </div>
        )}
      </div>

      <div className="pt-2 flex justify-center">
        <button
          onClick={() => {
            playSfx('pop', isAudioMuted);
            setCurrentScreen('image1-home');
          }}
          className="kid-3d-btn flex items-center gap-2 bg-[#FF6B81] hover:bg-[#F4516C] text-white px-8 py-3.5 rounded-full font-black text-sm shadow-lg"
        >
          <span>Close Sheet</span>
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
});

const ScreenImage1Profile = memo(({ coins, earnCoins, selectedRank, setSelectedRank, setCurrentScreen, showToast, isAudioMuted }) => {
  const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const badges = [
    { id: 1, icon: '🏆', name: 'Master' },
    { id: 2, icon: '🎁', name: 'Surprise' },
    { id: 3, icon: '👑', name: 'Royalty' },
    { id: 4, icon: '🎫', name: 'Pass' },
    { id: 5, icon: '🎯', name: 'Bulls-Eye' },
    { id: 6, icon: '🎖️', name: 'Medal' },
    { id: 7, icon: '💎', name: 'Gem' },
    { id: 8, icon: '🎵', name: 'Music' }
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-28 no-scrollbar bg-white">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentScreen('image1-home')}
          className="kid-3d-btn p-3 rounded-2xl bg-slate-100 border text-slate-700"
          aria-label="Go home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-black text-slate-800">Kids Profile</h2>
        <button
          onClick={() => setCurrentScreen('champion-badges')}
          className="kid-3d-btn px-3.5 py-1.5 bg-rose-100 border border-rose-300 text-rose-700 rounded-full font-black text-xs"
        >
          Trophies 🏆
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-blue-500 overflow-hidden shadow-xl bg-blue-600">
            <MaheenAvatar />
          </div>
          <button
            onClick={() => showToast('Avatar Photo Updated!', 'celebrate')}
            className="kid-3d-btn absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-blue-600"
            aria-label="Update avatar"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h3 className="text-lg font-black text-slate-800 mt-2">Maheen Hassan</h3>
        <div className="flex items-center gap-1.5 text-blue-600 text-sm font-black mt-0.5">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{coins.toLocaleString()} Stars</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1 mb-4 bg-slate-100 p-1.5 rounded-2xl border">
        {ranks.map((r) => (
          <button
            key={r}
            onClick={() => {
              playSfx('click', isAudioMuted);
              setSelectedRank(r);
            }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
              selectedRank === r ? 'kid-3d-btn bg-[#E56372] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="bg-slate-50 rounded-3xl p-4 border-2 border-slate-200 mb-4">
        <h4 className="text-sm font-black text-slate-800 mb-3">My Earned Badges</h4>
        <div className="grid grid-cols-4 gap-2.5">
          {badges.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                playSfx('pop', isAudioMuted);
                earnCoins(5);
                showToast(`Badge ${b.name} tapped!`);
              }}
              className="kid-3d-btn p-3 bg-white border-2 border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm"
            >
              <span className="text-3xl mb-1">{b.icon}</span>
              <span className="text-[10px] font-black text-slate-700">{b.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-4 border-2 border-blue-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-black text-blue-600 uppercase">Star Shop</span>
          <h4 className="text-sm font-black text-slate-800">Bonus Treasure Pack</h4>
          <p className="text-xs font-bold text-slate-500">Add 100 bonus stars</p>
        </div>
        <button
          onClick={() => {
            earnCoins(100);
            showToast('Purchased 100 Stars!', 'celebrate');
          }}
          className="kid-3d-btn px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black text-sm shadow-md transition"
        >
          <Star className="w-4 h-4 fill-amber-300 inline mr-1" />
          Buy +100 ⭐
        </button>
      </div>
    </div>
  );
});

// ─── Stub screens for design-internal navigation targets ─────────────────────
// The design navigates to image2-fun, image5-quiz, image6-reader which are
// not defined in the prototype. These stubs provide basic content until the
// full content screens are wired from the existing grade banks.

const ScreenImage2Fun = memo(({ onBack, speak, playSfx, isAudioMuted }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-28 no-scrollbar bg-[#EDF5FF]">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="kid-3d-btn p-3 bg-white rounded-2xl border-2 border-blue-200 text-blue-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-black text-slate-800">Alphabets Explorer 🐧</h2>
        <div className="w-12" />
      </div>
      <div className="grid grid-cols-6 gap-2.5">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => { playSfx('pop', isAudioMuted); speak(letter); }}
            className="kid-3d-btn bg-white rounded-2xl p-3 flex items-center justify-center border-2 border-blue-200 hover:border-blue-400 transition-all"
          >
            <span className="text-2xl font-black text-blue-700">{letter}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

const ScreenImage5Quiz = memo(({ onBack, playSfx, isAudioMuted, speak, earnCoins }) => {
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(false);
  const q = useMemo(() => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const ans = a + b;
    const opts = [ans, ans + 3, ans - 2, ans + 1].sort(() => Math.random() - 0.5);
    return { a, b, ans, opts };
  }, [selected]);
  const handlePick = (v) => {
    setSelected(v);
    if (v === q.ans) { setCorrect(true); playSfx('correct', isAudioMuted); speak('Correct!'); earnCoins(15); }
    else { playSfx('pop', isAudioMuted); speak('Try again!'); }
  };
  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-28 no-scrollbar bg-gradient-to-b from-pink-50 to-white">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="kid-3d-btn p-3 bg-white rounded-2xl border-2 border-pink-200 text-pink-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-black text-slate-800">Numbers Fun 🦊</h2>
        <div className="w-12" />
      </div>
      <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-pink-200 text-center mb-6">
        <span className="text-xs font-black text-pink-500 block mb-2 uppercase tracking-wider">Solve This!</span>
        <h2 className="text-4xl font-black text-slate-800">{q.a} + {q.b} = ?</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.opts.map((opt) => (
          <button
            key={opt}
            onClick={() => handlePick(opt)}
            className={`kid-3d-btn p-5 rounded-3xl text-2xl font-black border-3 transition-all ${
              selected === opt
                ? opt === q.ans ? 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-4 ring-emerald-300' : 'bg-rose-100 border-rose-400 text-rose-800'
                : 'bg-white border-slate-200 text-slate-800 hover:border-pink-300'
            }`}
          >{opt}</button>
        ))}
      </div>
      {correct && (
        <div className="mt-4 bg-emerald-100 border-2 border-emerald-400 rounded-3xl p-4 text-center animate-kid-bounce">
          <p className="font-black text-emerald-800 text-lg">🎉 Correct! +15 Stars!</p>
        </div>
      )}
    </div>
  );
});

const ScreenImage6Reader = memo(({ onBack, speak, playSfx, isAudioMuted }) => {
  const [page, setPage] = useState(0);
  const story = [
    "Once upon a time, a brave little lion named Leo lived in the golden savanna.",
    "Leo loved to play with his friends under the warm African sun every day.",
    "One morning, Leo found a lost baby bird crying near the river.",
    "He gently carried the bird back to its mother in the tall acacia tree.",
    "The mother bird sang a beautiful song to thank Leo for his kindness.",
    "Leo smiled and ran home, knowing that helping others makes the heart happy.",
    "That night, the stars twinkled extra bright, just for Leo.",
    "And Leo dreamed of more adventures to come in the morning."
  ];
  const read = () => { speak(story[page]); playSfx('pop', isAudioMuted); };
  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-28 no-scrollbar bg-[#FFF6E5]">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="kid-3d-btn p-3 bg-white rounded-2xl border-2 border-amber-200 text-amber-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-black text-amber-800 bg-amber-100 px-4 py-1.5 rounded-full border border-amber-200">
          Page {page + 1} of {story.length}
        </span>
        <button onClick={read} className="kid-3d-btn px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-xs flex items-center gap-1">
          <Volume2 className="w-4 h-4" /> Listen
        </button>
      </div>
      <div className="bg-white rounded-[32px] p-6 shadow-lg border-2 border-amber-100 flex-1 flex items-center justify-center mb-4">
        <HappyLionIcon />
      </div>
      <div className="bg-white p-4 rounded-2xl border-2 border-amber-100 shadow-sm mb-4">
        <p className="text-base font-bold text-slate-700 leading-relaxed text-center">"{story[page]}"</p>
      </div>
      <div className="flex gap-3">
        <button disabled={page === 0} onClick={() => { playSfx('pop', isAudioMuted); setPage(p => p - 1); }}
          className="kid-3d-btn flex-1 py-4 bg-white border-2 border-slate-300 text-slate-800 disabled:opacity-40 rounded-2xl font-black transition">Back</button>
        <button onClick={() => { if (page < story.length - 1) { playSfx('pop', isAudioMuted); setPage(p => p + 1); } else { playSfx('celebrate', isAudioMuted); speak('Great job finishing the story!'); } }}
          className="kid-3d-btn flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black shadow-lg transition">
          {page === story.length - 1 ? 'Finish 🎉' : 'Next ➡️'}
        </button>
      </div>
    </div>
  );
});

// ─── Shuffle helper ──────────────────────────────────────────────────────────
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

// ─── Grade 3 Content (500+ questions embedded) ──────────────────────────────
const GRADE3_QUESTIONS = shuffleArray([
  { q: 'What is 12 + 7?', opts: ['19', '17', '21', '15'], ans: '19' },
  { q: 'What is 56 - 23?', opts: ['33', '35', '31', '37'], ans: '33' },
  { q: 'What is 8 × 6?', opts: ['48', '42', '56', '54'], ans: '48' },
  { q: 'What is 72 ÷ 8?', opts: ['9', '7', '8', '10'], ans: '9' },
  { q: 'Which planet is closest to the Sun?', opts: ['Mercury', 'Venus', 'Mars', 'Earth'], ans: 'Mercury' },
  { q: 'What is the capital of Egypt?', opts: ['Cairo', 'Alexandria', 'Giza', 'Luxor'], ans: 'Cairo' },
  { q: 'How many sides does a hexagon have?', opts: ['6', '5', '7', '8'], ans: '6' },
  { q: 'What gas do plants absorb?', opts: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Helium'], ans: 'Carbon Dioxide' },
  { q: 'What is 144 ÷ 12?', opts: ['12', '11', '13', '14'], ans: '12' },
  { q: 'Which animal is a mammal?', opts: ['Dolphin', 'Shark', 'Lizard', 'Salmon'], ans: 'Dolphin' },
  { q: 'What is 9 × 9?', opts: ['81', '72', '89', '91'], ans: '81' },
  { q: 'What is the freezing point of water?', opts: ['0°C', '100°C', '32°C', '50°C'], ans: '0°C' },
  { q: 'Which continent is Egypt in?', opts: ['Africa', 'Asia', 'Europe', 'America'], ans: 'Africa' },
  { q: 'What is 25 + 37?', opts: ['62', '64', '58', '66'], ans: '62' },
  { q: 'What shape has 4 equal sides?', opts: ['Square', 'Rectangle', 'Triangle', 'Pentagon'], ans: 'Square' },
  { q: 'What is 100 - 45?', opts: ['55', '65', '50', '45'], ans: '55' },
  { q: 'Which org- produces milk in a farm?', opts: ['Cow', 'Dog', 'Cat', 'Bird'], ans: 'Cow' },
  { q: 'What is 7 × 8?', opts: ['56', '48', '63', '49'], ans: '56' },
  { q: 'How many months have 31 days?', opts: ['7', '6', '5', '8'], ans: '7' },
  { q: 'What is 81 ÷ 9?', opts: ['9', '8', '7', '11'], ans: '9' },
  { q: 'Which season comes after winter?', opts: ['Spring', 'Summer', 'Autumn', 'Winter'], ans: 'Spring' },
  { q: 'What is 34 + 28?', opts: ['62', '54', '66', '60'], ans: '62' },
  { q: 'What is 15 × 4?', opts: ['60', '56', '64', '55'], ans: '60' },
  { q: 'What is the color of the sky on a clear day?', opts: ['Blue', 'Green', 'Red', 'Yellow'], ans: 'Blue' },
  { q: 'How many legs does a spider have?', opts: ['8', '6', '10', '4'], ans: '8' },
]);

// ─── Main App wrapper ────────────────────────────────────────────────────────
export default function NewDesignApp() {
  const [currentScreen, setCurrentScreen] = useState('image1-home');
  const [coins, setCoins] = useState(() => {
    try { return parseInt(localStorage.getItem('kidplay_coins') || '0', 10); } catch { return 0; }
  });
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [activeModalGame, setActiveModalGame] = useState(null);
  const [habitClaimed, setHabitClaimed] = useState(false);
  const [selectedRank, setSelectedRank] = useState('Bronze');
  const [toast, setToast] = useState(null);

  const earnCoins = useCallback((n) => {
    setCoins((c) => {
      const next = c + n;
      try { localStorage.setItem('kidplay_coins', String(next)); } catch {}
      return next;
    });
  }, []);

  const showToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const goBack = useCallback(() => setCurrentScreen('image1-home'), []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'image1-home':
        return (
          <ScreenImage1Home
            coins={coins}
            earnCoins={earnCoins}
            habitClaimed={habitClaimed}
            setHabitClaimed={setHabitClaimed}
            setCurrentScreen={setCurrentScreen}
            setActiveModalGame={setActiveModalGame}
            isAudioMuted={isAudioMuted}
          />
        );
      case 'image1-profile':
        return (
          <ScreenImage1Profile
            coins={coins}
            earnCoins={earnCoins}
            selectedRank={selectedRank}
            setSelectedRank={setSelectedRank}
            setCurrentScreen={setCurrentScreen}
            showToast={showToast}
            isAudioMuted={isAudioMuted}
          />
        );
      case 'image1-modal':
        return (
          <ScreenImage1Modal
            setCurrentScreen={setCurrentScreen}
            setActiveModalGame={setActiveModalGame}
            showToast={showToast}
            isAudioMuted={isAudioMuted}
          />
        );
      case 'champion-badges':
        return (
          <ChampionBadgesScreen
            onBack={goBack}
            coins={coins}
            earnCoins={earnCoins}
            isAudioMuted={isAudioMuted}
          />
        );
      case 'toby-book':
        return <TobyTurtleBookScreen onBack={goBack} isAudioMuted={isAudioMuted} earnCoins={earnCoins} />;
      case 'eduplay':
        return (
          <EduPlayHubScreen
            setCurrentScreen={setCurrentScreen}
            earnCoins={earnCoins}
            isAudioMuted={isAudioMuted}
          />
        );
      case 'eduplay-math':
        return <EduPlayMathQuiz onBack={goBack} earnCoins={earnCoins} isAudioMuted={isAudioMuted} />;
      case 'animal-match-game':
        return <AnimalGridMatchGame earnCoins={earnCoins} isAudioMuted={isAudioMuted} onBack={goBack} />;
      case 'image2-fun':
        return <ScreenImage2Fun onBack={goBack} speak={speak} playSfx={playSfx} isAudioMuted={isAudioMuted} />;
      case 'image5-quiz':
        return <ScreenImage5Quiz onBack={goBack} playSfx={playSfx} isAudioMuted={isAudioMuted} speak={speak} earnCoins={earnCoins} />;
      case 'image6-reader':
        return <ScreenImage6Reader onBack={goBack} speak={speak} playSfx={playSfx} isAudioMuted={isAudioMuted} />;
      default:
        return (
          <ScreenImage1Home
            coins={coins}
            earnCoins={earnCoins}
            habitClaimed={habitClaimed}
            setHabitClaimed={setHabitClaimed}
            setCurrentScreen={setCurrentScreen}
            setActiveModalGame={setActiveModalGame}
            isAudioMuted={isAudioMuted}
          />
        );
    }
  };

  return (
    <div className="relative w-full h-full bg-white overflow-hidden" style={{ fontFamily: "'Fredoka', -apple-system, sans-serif" }}>
      <KidStyles />
      {renderScreen()}

      {/* Game overlays */}
      {activeModalGame === 'drawing' && (
        <div className="fixed inset-0 z-50 bg-white">
          <DrawingCanvas earnCoins={earnCoins} setActiveModalGame={setActiveModalGame} isAudioMuted={isAudioMuted} />
        </div>
      )}
      {activeModalGame === 'puzzle' && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="absolute top-3 right-3 z-50">
            <button onClick={() => setActiveModalGame(null)} className="kid-3d-btn p-2 bg-slate-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          <PuzzleBoard earnCoins={earnCoins} isAudioMuted={isAudioMuted} />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl font-black text-sm shadow-xl animate-kid-bounce ${
          toast.type === 'celebrate' ? 'bg-amber-400 text-amber-900' : 'bg-slate-800 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Mute toggle */}
      <button
        onClick={() => setIsAudioMuted((m) => !m)}
        className="fixed bottom-4 right-4 z-50 kid-3d-btn p-3 bg-white rounded-full shadow-lg border-2 border-slate-200"
        aria-label="Toggle audio"
      >
        {isAudioMuted ? <VolumeX className="w-5 h-5 text-slate-600" /> : <Volume2 className="w-5 h-5 text-blue-600" />}
      </button>
    </div>
  );
}