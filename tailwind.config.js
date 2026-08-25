/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#faf8f0',
          100: '#f5edd6',
          200: '#e8dcc4',
          300: '#d4c4a0',
          400: '#d4af37',
          500: '#c9a227',
          600: '#b8942a',
          700: '#a6872d',
          800: '#8a7028',
          900: '#6e5a20',
        },
        cream: {
          50: '#f5f3ee',
          100: '#f0ece4',
          200: '#e8e0d4',
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'vibes': ['Great Vibes', 'cursive'],
      }
    },
  },
  plugins: [],
}
