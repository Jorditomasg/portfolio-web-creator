const token = name => `rgb(var(--c-${name}) / <alpha-value>)`;

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
        paper: token('paper'),
        surface: token('surface'),
        ink: {
          DEFAULT: token('ink'),
          soft: token('ink-soft'),
          muted: token('ink-muted'),
        },
        line: token('line'),
        stone: token('stone'),
        band: {
          DEFAULT: token('band'),
          line: token('band-line'),
          ink: token('band-ink'),
          muted: token('band-muted'),
        },
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
