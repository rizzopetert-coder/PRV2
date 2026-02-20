/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:       "var(--brand-bg)",
          text:     "var(--brand-text)",
          accent:   "var(--brand-accent)",
          muted:    "var(--brand-muted)",
          border:   "var(--brand-border)",
          card:     "var(--brand-card-bg)",   // fixed: was var(--brand-card)
          copper:   "#B87333",
          forest:   "#121F1F",
          burgundy: "#2D0B0B",
          obsidian: "#1A1A1A",
          cyan:     "#00E5FF",
        }
      },
      fontFamily: {
        serif:  ["var(--font-instrument-serif)", "Georgia", "serif"],
        sans:   ["var(--font-inter)", "sans-serif"],
        mono:   ["var(--font-space-mono)", "Space Mono", "monospace"],
        fjalla: ["var(--font-fjalla)", "sans-serif"],
      },
      letterSpacing: {
        // Single block — duplicate removed
        tightest:      "-.06em",
        tighter:       "-.04em",
        briefing:      ".4em",
        institutional: ".8em",
      },
      lineHeight: {
        verdict:          "0.85",
        "tight-editorial": "1.1",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};