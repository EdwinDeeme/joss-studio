/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf7f2',
          100: '#f5f0e7',
          200: '#e8dcc9',
          300: '#dcc8ab',
          400: '#c4a46d',
          500: '#a88457',
          600: '#8b6d47',
          700: '#6e5638',
          800: '#52402a',
          900: '#362a1f',
        },
        accent: {
          beige: '#e8dcc9',
          cream: '#faf7f2',
          dark: '#3d3d3d',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        base: '0 2px 8px rgba(108, 90, 67, 0.08)',
        md: '0 4px 16px rgba(108, 90, 67, 0.1)',
        lg: '0 8px 32px rgba(108, 90, 67, 0.12)',
        xl: '0 16px 48px rgba(108, 90, 67, 0.15)',
        'premium': '0 20px 60px rgba(164, 132, 87, 0.2)',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
    },
  },
  plugins: [],
};
