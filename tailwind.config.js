/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent': {
          '50': '#f0f9ff',
          '100': '#e0f2fe',
          '200': '#bae6fd',
          '300': '#7dd3fc',
          '400': '#38bdf8',
          '500': '#0ea5e9',
          '600': '#0284c7',
          '700': '#0369a1',
          '800': '#075985',
          '900': '#0c4a6e',
        },
        'gold': {
          '50': '#fffbeb',
          '100': '#fef3c7',
          '200': '#fde68a',
          '300': '#fcd34d',
          '400': '#fbbf24',
          '500': '#f59e0b',
          '600': '#d97706',
          '700': '#b45309',
          '800': '#92400e',
          '900': '#78350f',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gold-glow': 'goldGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(14, 165, 233, 0.8), 0 0 40px rgba(14, 165, 233, 0.4)' },
        },
        goldGlow: {
          '0%': { 
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.6), 0 0 40px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.2)' 
          },
          '100%': { 
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.8), 0 0 60px rgba(245, 158, 11, 0.6), 0 0 90px rgba(245, 158, 11, 0.4)' 
          },
        },
      },
    },
  },
  plugins: [],
}

