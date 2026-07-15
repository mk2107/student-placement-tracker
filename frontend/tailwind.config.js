/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#161B27',        // primary text
        navy: {
          DEFAULT: '#1F2A44',  // primary brand color - sidebar, headers
          light: '#2E3B5C',
          dark: '#141B2E',
        },
        gold: {
          DEFAULT: '#B8862E',  // accent - CTAs, highlights
          light: '#D9A441',
        },
        surface: '#FFFFFF',
        canvas: '#F5F6F8',      // page background
        border: '#E3E6EC',
        muted: '#6B7280',
        success: '#2F7A54',
        'success-bg': '#E7F5EE',
        danger: '#C0392B',
        'danger-bg': '#FBEAE8',
        warning: '#B7791F',
        'warning-bg': '#FBF2E0',
        info: '#2E5FA3',
        'info-bg': '#E9F0FA',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(22, 27, 39, 0.04), 0 1px 8px rgba(22, 27, 39, 0.06)',
      },
    },
  },
  plugins: [],
}
