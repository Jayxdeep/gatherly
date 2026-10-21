import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf4f7",
          100: "#fbe8ee",
          200: "#f7d5df",
          300: "#f1b3c5",
          400: "#e785a1",
          500: "#d9597e",
          600: "#c43c64",
          700: "#a62c4e",
          800: "#8a2742",
          900: "#74243a",
        },
        celebrate: {
          gold: "#f59e0b",
          amber: "#d97706",
          emerald: "#10b981",
          violet: "#8b5cf6",
          rose: "#f43f5e",
        }
      },
    },
  },
  plugins: [],
};
export default config;
