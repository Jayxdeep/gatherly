import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
        celebrate: {
          gold: "#f59e0b",
          amber: "#d97706",
          emerald: "#10b981",
          violet: "#8b5cf6",
          indigo: "#6366f1",
          fuchsia: "#d946ef",
          rose: "#f43f5e",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(190, 18, 60, 0.08)",
        "glass-lg": "0 16px 48px 0 rgba(190, 18, 60, 0.12)",
        "glow-brand": "0 0 25px -5px rgba(225, 29, 72, 0.35)",
        "glow-amber": "0 0 25px -5px rgba(245, 158, 11, 0.35)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
