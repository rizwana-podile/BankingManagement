/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#627D98',
          500: '#486581',
          600: '#334E68',
          700: '#1A365D',
          800: '#0F2744',
          900: '#0A2540', // Primary Deep Navy
          950: '#061626',
        },
        royal: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF', // Secondary Professional Blue
          900: '#1E3A8A',
        },
        gold: {
          50: '#FDFBF7',
          100: '#FAF4E7',
          200: '#F4E5C4',
          300: '#EBD19B',
          400: '#DCB762',
          500: '#C59B27', // Accent Subtle Gold
          600: '#A67E18',
          700: '#84620F',
          800: '#644A0B',
        },
        surface: {
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
        elevated: '0 10px 25px -3px rgba(10, 37, 64, 0.08), 0 4px 6px -4px rgba(10, 37, 64, 0.04)',
      }
    },
  },
  plugins: [],
}