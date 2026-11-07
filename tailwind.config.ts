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
        spotly: {
          bg: "#101820",
          card: "#1B2935",
          "card-hover": "#223342",
          "card-border": "#2A3D4E",
          primary: "#56B4E9",
          "primary-hover": "#429cd0",
          coral: "#FF776B",
          "coral-hover": "#ee6256",
          text: "#F7FAFC",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(86, 180, 233, 0.15) 0%, transparent 60%)",
        "radial-coral": "radial-gradient(circle at 80% 20%, rgba(255, 119, 107, 0.12) 0%, transparent 50%)",
      },
    },
  },
  plugins: [],
};
export default config;

