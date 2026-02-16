/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🏛️ Institutional Palette Mapping
        brand: {
          bg: 'var(--brand-bg)',
          text: 'var(--brand-text)',
          muted: 'var(--brand-text-muted)',
          accent: 'var(--brand-accent)',
          border: 'var(--brand-border)',
          card: 'var(--brand-card-bg)',
        }
      },
      fontFamily: {
        // The Principal's Voice: High-contrast, elegant, unhurried
        serif: ['var(--font-instrument-serif)', 'serif'],
        // The Institutional Foundation: Clean and out of the way
        sans: ['var(--font-inter)', 'sans-serif'],
        // The Direct Detail: Crisp, technical, and honest
        // Recommended: Import 'JetBrains Mono' in your layout
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        // Tension: Tighter for large serif verdicts, wider for technical mono labels
        'tightest': '-.06em',
        'tighter': '-.04em',
        'briefing': '.4em',
        'institutional': '.8em',
      },
      lineHeight: {
        // Creating that heavy, editorial "stack" for headlines
        'verdict': '0.85',
        'tight-editorial': '1.1',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};