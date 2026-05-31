// Shared Tailwind (Play CDN) configuration for the whole app.
// Loaded right after the Tailwind CDN script on every page.
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8eb6ff',
          400: '#598dff',
          500: '#3563ff',
          600: '#1d40f5',
          700: '#162ee1',
          800: '#1828b6',
          900: '#1a298f',
          950: '#151a57',
        },
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(16,24,40,0.08), 0 4px 16px -4px rgba(16,24,40,0.06)',
        card: '0 1px 2px 0 rgba(16,24,40,0.05)',
      },
    },
  },
};
