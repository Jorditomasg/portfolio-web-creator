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
        accent: {
          yellow: '#F5A623',
          green: '#4CAF50',
          blue: '#2196F3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
}
