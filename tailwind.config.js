/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './template.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        duo: {
          green: '#58CC02',
          greenDark: '#46A302',
          greenLight: '#D7FFB8',
          blue: '#1CB0F6',
          blueDark: '#1899D6',
          blueLight: '#DDF4FF',
          orange: '#FF9600',
          orangeDark: '#E68700',
          orangeLight: '#FFF0D4',
          purple: '#CE82FF',
          purpleDark: '#A855F7',
          purpleLight: '#F3E5FF',
          red: '#FF4B4B',
          redDark: '#EA2B2B',
          redLight: '#FFDFE0',
          yellow: '#FFC800',
          yellowDark: '#E5A500',
          gray: {
            50: '#F7F7F7',
            100: '#E5E5E5',
            200: '#D6D6D6',
            300: '#CCCCCC',
            400: '#AFAFAF',
            500: '#777777',
            600: '#4B4B4B',
            700: '#3C3C3C',
            800: '#1E293B',
            900: '#0F172A',
          }
        }
      },
      fontFamily: {
        sans: ['Fredoka', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Rounded"', '"SF Pro Display"', 'system-ui', 'sans-serif'],
        fredoka: ['Fredoka', 'sans-serif'],
      },
      boxShadow: {
        'duo-green': '0 4px 0 #46A302',
        'duo-blue': '0 4px 0 #1899D6',
        'duo-orange': '0 4px 0 #E68700',
        'duo-purple': '0 4px 0 #A855F7',
        'duo-red': '0 4px 0 #EA2B2B',
        'duo-gray': '0 4px 0 #CCCCCC',
        'duo-card': '0 4px 0 #E5E5E5',
      }
    },
  },
  plugins: [],
};
