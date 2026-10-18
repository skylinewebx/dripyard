import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: "#1a0505",
        brand: "#b3202a",
        coral: "#d94a4a",
        cream: "#f6f1ea",
        sun: "#f5e23b",
      },
      fontFamily: {
        display: ["'Oswald Variable'", "Oswald", "Impact", "'Arial Narrow'", "sans-serif"],
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,5,5,.05), 0 12px 32px -12px rgba(26,5,5,.18)",
        lift: "0 2px 4px rgba(26,5,5,.06), 0 28px 48px -16px rgba(26,5,5,.28)",
      },
      transitionTimingFunction: { premium: "cubic-bezier(.22,1,.36,1)" },
    },
  },
  plugins: [],
};

export default config;
