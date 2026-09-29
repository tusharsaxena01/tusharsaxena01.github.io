import type { Config } from "tailwindcss";

const mono = ["var(--font-mono)", "JetBrains Mono", "Fira Code", "ui-monospace", "Menlo", "Consolas", "monospace"];

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-0": "var(--bg-0)",
        "bg-1": "var(--bg-1)",
        "bg-2": "var(--bg-2)",
        line: "var(--line)",
        white: "var(--white)",
        ivory: "var(--ivory)",
        ink: "var(--text)",
        dim: "var(--text-dim)",
        saffron: "var(--saffron)",
        marigold: "var(--marigold)",
        sindoor: "var(--sindoor)",
        green: { DEFAULT: "var(--green)", deep: "var(--green-deep)" },
        rani: "var(--rani)",
        chakra: "var(--chakra)",
      },
      fontFamily: {
        mono,
        sans: mono,
        display: ["var(--font-display)", "var(--font-deva)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
