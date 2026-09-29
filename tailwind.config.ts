import type { Config } from "tailwindcss";

const mono = ["var(--font-mono)", "JetBrains Mono", "Fira Code", "IBM Plex Mono", "ui-monospace", "Menlo", "Consolas", "monospace"];

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
        green: { DEFAULT: "var(--green)", dim: "var(--green-dim)" },
        ink: "var(--text)",
        dim: "var(--text-dim)",
      },
      fontFamily: {
        mono,
        sans: mono,
        display: ["var(--font-display)", "Space Grotesk", ...mono],
      },
    },
  },
  plugins: [],
};
export default config;
