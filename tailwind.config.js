/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040b17', // deepest midnight
          900: '#071326', // deep university background
          850: '#0b1d3a', // dark navy card
          800: '#0f2c59', // primary university navy
          700: '#153a70', // medium navy
          600: '#1d4d91', // light navy
          500: '#2563eb', // bright royal blue
        },
        crimson: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // primary red accent
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        ice: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'glow-red': 'glowRed 2s ease-in-out infinite alternate',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.025)', opacity: '0.92' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowRed: {
          '0%': { boxShadow: '0 0 5px rgba(220, 38, 38, 0.4), 0 0 10px rgba(15, 44, 89, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.8), 0 0 30px rgba(37, 99, 235, 0.5)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        }
      }
    },
  },
  plugins: [],
}
