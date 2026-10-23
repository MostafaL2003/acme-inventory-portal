/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        canvas: '#f8fafc',
        surface: '#ffffff',
        sidebar: {
          DEFAULT: '#0f172a',
          hover: '#1e293b',
          muted: '#94a3b8',
        },
        brand: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          subtle: '#eff6ff',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.06)',
        drawer: '-8px 0 24px -4px rgba(15, 23, 42, 0.15)',
        dock: '0 20px 25px -5px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
}

