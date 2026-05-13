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
        'rosa': '#FFB6C1',
        'lila': '#DDA0DD',
        'mint': '#98FB98',
        'gold': '#FFD700',
      },
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
        'nunito': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}