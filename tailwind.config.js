/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
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
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glow-rose': '0 10px 30px -5px rgba(244, 63, 94, 0.12), 0 4px 12px -2px rgba(13, 148, 136, 0.04)',
        'glow-teal': '0 10px 25px -3px rgba(13, 148, 136, 0.20)',
        'glass-light': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
      }
    },
  },
  plugins: [],
};
