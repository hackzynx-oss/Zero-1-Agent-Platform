/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: '#00ff41',
        'dark-bg': '#0a0e27',
        'dark-card': '#0f1729',
        'dark-border': '#1a2f4a',
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
        sans: ['Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 65, 0.3)',
        'neon-lg': '0 0 40px rgba(0, 255, 65, 0.5)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '0.5', textShadow: '0 0 10px rgba(0, 255, 65, 0.3)' },
          '50%': { opacity: '1', textShadow: '0 0 20px rgba(0, 255, 65, 0.6)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
