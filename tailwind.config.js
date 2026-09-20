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
        display: ['Fredoka', 'Nunito', 'sans-serif'],
      },
      boxShadow: {
        'card-3d': '0 8px 0 rgba(0,0,0,0.06), 0 12px 20px -3px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
