/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './template.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        rosebloom: {
          50: '#fff5f8',
          100: '#ffe8f0',
          200: '#ffd2e2',
          300: '#ffaccb',
          400: '#ff77a8',
          500: '#f44383',
          600: '#db2264',
          700: '#b8144c',
          800: '#98143f',
          900: '#7f1537',
        },
        tealsoft: {
          50: '#f0fdf9',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        brand: {
          50: '#F5F7FF',
          100: '#EBF0FE',
          200: '#CEDCFD',
          500: '#4F46E5',
          600: '#4338CA',
          700: '#3730A3',
        },
        kid: {
          yellow: '#FFDE59',
          orange: '#FF8A3D',
          coral: '#FF5757',
          purple: '#8B5CF6',
          deepPurple: '#6D28D9',
          cyan: '#06B6D4',
          blue: '#0EA5E9',
          emerald: '#10B981',
          darkGreen: '#047857',
          pink: '#F43F5E',
          amber: '#F59E0B',
          night: '#0B0F19',
          nightCard: '#151D2E',
          nightBorder: '#232E48'
        }
      },
      fontFamily: {
        fredoka: ['Fredoka', 'Outfit', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Fredoka"', '"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'squish-indigo': '0 6px 0 #3730A3, 0 10px 18px rgba(79, 70, 229, 0.35)',
        'squish-orange': '0 6px 0 #D97706, 0 10px 18px rgba(245, 158, 11, 0.35)',
        'squish-emerald': '0 6px 0 #047857, 0 10px 18px rgba(16, 185, 129, 0.35)',
        'squish-pink': '0 6px 0 #BE123C, 0 10px 18px rgba(244, 63, 94, 0.35)',
        'squish-purple': '0 6px 0 #5B21B6, 0 10px 18px rgba(139, 92, 246, 0.35)',
        'squish-neutral': '0 6px 0 #CBD5E1, 0 8px 15px rgba(0, 0, 0, 0.06)',
        'squish-card': '0 10px 0 rgba(0,0,0,0.04), 0 18px 30px rgba(0,0,0,0.06)',
        'inner-bevel': 'inset 0 2px 4px rgba(255, 255, 255, 0.6), inset 0 -2px 4px rgba(0, 0, 0, 0.08)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.35)',
        'glow-rose': '0 10px 30px -5px rgba(244, 63, 94, 0.12), 0 4px 12px -2px rgba(13, 148, 136, 0.04)',
        'glow-teal': '0 10px 25px -3px rgba(13, 148, 136, 0.20)',
        'glass-light': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 3s infinite ease-in-out',
        'float': 'floatSlow 4s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'wave-bar': 'waveBar 1.2s ease-in-out infinite alternate',
        'wiggle': 'wiggle 0.4s ease-in-out',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '50%': { transform: 'scale(1.08)', opacity: '0.3' },
          '100%': { transform: 'scale(0.95)', opacity: '0.8' },
        },
        waveBar: {
          '0%': { height: '15%' },
          '100%': { height: '100%' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-6deg) scale(1.02)' },
          '75%': { transform: 'rotate(6deg) scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
};
