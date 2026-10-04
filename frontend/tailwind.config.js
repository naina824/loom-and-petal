/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F0',
          200: '#F4ECE1',
          300: '#EBDDCB',
          400: '#DFCCB4',
        },
        blush: {
          50: '#FDF7F7',
          100: '#FBF0F1',
          200: '#F5DCE0',
          300: '#ECBFC6',
          400: '#E098A3',
          500: '#CF7281',
          600: '#B85363',
        },
        warmbrown: {
          50: '#F9F7F5',
          100: '#F2ECE6',
          200: '#E4D8CE',
          300: '#CEB9A7',
          400: '#B3967F',
          500: '#8E6E56',
          600: '#71543E',
          700: '#573F2E',
          800: '#402E22',
          900: '#2A1E16',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E6EFE7',
          200: '#CCDCCF',
          300: '#A9C3AC',
          400: '#86A789',
          500: '#68896C',
        },
        butter: {
          50: '#FEFDF8',
          100: '#FDF9E6',
          200: '#F9F0C2',
          300: '#F3E292',
          400: '#E8CE5D',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        handwritten: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(113, 84, 62, 0.06), 0 2px 6px -1px rgba(113, 84, 62, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(113, 84, 62, 0.08), 0 4px 12px -2px rgba(113, 84, 62, 0.04)',
        'soft-xl': '0 20px 40px -6px rgba(113, 84, 62, 0.10), 0 8px 16px -4px rgba(113, 84, 62, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
