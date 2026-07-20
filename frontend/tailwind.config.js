/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#FFFFFF',
          dark: '#0F172A',
        },
        surface: {
          light: '#F8FAFC',
          dark: '#1E293B',
        },
        heading: {
          light: '#0F172A',
          dark: '#F8FAFC',
        },
        body: {
  light: '#000000',
  dark: '#FFFFFF',
},
        accent: {
          DEFAULT: '#00D2C4',
          dark: '#00E6D7',
          hoverLight: '#00B3A6',
          hoverDark: '#00D2C4',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.08)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
