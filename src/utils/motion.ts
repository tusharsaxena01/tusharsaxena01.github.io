export const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
