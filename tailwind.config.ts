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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#38bdf8", // Electric Blue
        secondary: "#10b981", // Emerald Green (as neon green)
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "monospace"], // Placeholder, will update with real fonts
      },
    },
  },
  plugins: [],
};
export default config;
