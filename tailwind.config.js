/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        raised: 'rgb(var(--c-raised) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--c-ink-soft) / <alpha-value>)',
        'ink-faint': 'rgb(var(--c-ink-faint) / <alpha-value>)',
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        'gold-dim': 'rgb(var(--c-gold-dim) / <alpha-value>)',
        olive: 'rgb(var(--c-olive) / <alpha-value>)',
        terracotta: 'rgb(var(--c-terracotta) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '5px',
        pill: '4px',
      },
      boxShadow: {
        leaf: '0 1px 2px rgb(0 0 0 / 0.18), 0 12px 30px -12px rgb(0 0 0 / 0.35)',
        inset: 'inset 0 1px 0 rgb(255 255 255 / 0.04)',
      },
      transitionTimingFunction: {
        vellum: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-5px)' },
          '40%': { transform: 'translateX(5px)' },
          '60%': { transform: 'translateX(-3px)' },
          '80%': { transform: 'translateX(3px)' },
        },
      },
      animation: {
        shake: 'shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
      },
    },
  },
  plugins: [],
};
