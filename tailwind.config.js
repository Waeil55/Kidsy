/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ewa: {
          blue: '#2db5ff',
          lightBlue: '#4ec7ff',
          darkBlue: '#1288c9',
          accent: '#ffb300',
          paper: '#fdfbf7',
          border: '#e8edf3',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        title: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
};
