import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wasil: {
          navy: "#181D48",
          "navy-dark": "#0F1230",
          violet: "#6317B5",
          "violet-light": "#9A81F8",
          turquoise: "#00B6B2",
          "turquoise-dark": "#009693",
          amber: "#E59F36",
          "amber-light": "#FCD385",
          bg: "#F7F8FC",
          text: "#20243A",
          muted: "#73798C",
          border: "#E2E5F0",
          surface: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Readex Pro", "sans-serif"],
        arabic: ["var(--font-arabic)", "Readex Pro", "IBM Plex Sans Arabic", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(24, 29, 72, 0.05), 0 4px 12px rgba(24, 29, 72, 0.03)",
        card: "0 4px 20px -2px rgba(24, 29, 72, 0.07)",
        elevated: "0 12px 36px -4px rgba(24, 29, 72, 0.12)",
        glow: "0 0 25px rgba(99, 23, 181, 0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
