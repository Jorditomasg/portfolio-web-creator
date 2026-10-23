/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F5A623',
          dark: '#D4901E',
          light: '#FFB94D',
        },
        dark: {
          bg: '#0D0D0D',
          surface: '#1A1A1A',
          border: '#2D2D2D',
        },
        paper: '#F4F4F1',
        ink: {
          DEFAULT: '#0E0E0E',
          soft: '#3A3A37',
          muted: '#4A4A46',
        },
        line: {
          DEFAULT: '#D9D9D3',
          dark: '#2A2A28',
        },
        stone: '#E4E4DF',
        accent: {
          yellow: '#F5A623',
          green: '#4CAF50',
          blue: '#2196F3',
        }
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
}
