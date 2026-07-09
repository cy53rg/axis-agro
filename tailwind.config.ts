import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#1E5631",
        navy: "#1B2E3C",
        gold: "#9B7E2F",
        sage: "#8FB89A",
        cream: "#F5F2EB",
        divider: "#E4DED3",
        "body-text": "#2C2C2C",
        muted: "#6B7280",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        label: ["Montserrat", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
