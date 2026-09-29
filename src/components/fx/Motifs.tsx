import React from "react";
import { cn } from "@/utils/cn";

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const PETAL = "M0 -34 C 9 -52, 9 -72, 0 -92 C -9 -72, -9 -52, 0 -34Z";
const SMALL_PETAL = "M0 -30 C 5 -38, 5 -48, 0 -56 C -5 -48, -5 -38, 0 -30Z";

/** 24-petal mandala (§6.1.1). `spin` rotates the outer ring at 60s and counter-rotates the inner at 90s. */
export const Mandala = ({ className, spin = false }: { className?: string; spin?: boolean }) => (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden fill="none">
        <g className={cn(spin && "spin-60")} style={{ transformOrigin: "center" }} stroke="var(--saffron)" strokeOpacity=".16" strokeWidth=".6">
            {range(24).map((i) => <path key={i} d={PETAL} transform={`rotate(${i * 15})`} />)}
            <circle r="96" />
            <circle r="34" />
        </g>
        <g className={cn(spin && "spin-90r")} style={{ transformOrigin: "center" }} stroke="var(--marigold)" strokeOpacity=".18" strokeWidth=".6">
            {range(24).map((i) => <path key={i} d={SMALL_PETAL} transform={`rotate(${i * 15 + 7.5})`} />)}
            <circle r="26" strokeDasharray="2 3" />
        </g>
    </svg>
);

/** Ashoka-chakra-inspired 24-spoke wheel (§6.1.2). Abstract: thin marigold strokes, no filled disc. */
export const Chakra = ({ className, strokeWidth = 1 }: { className?: string; strokeWidth?: number }) => (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden fill="none" stroke="var(--marigold)" strokeWidth={strokeWidth}>
        <circle r="46" />
        <circle r="6" />
        {range(24).map((i) => <line key={i} y1="-8" y2="-46" transform={`rotate(${i * 15})`} />)}
    </svg>
);

/** Dashed rule with a small lotus at the centre (§6.1.4). */
export const LotusDivider = () => (
    <div aria-hidden className="mx-auto flex max-w-[1200px] items-center gap-4 px-4 sm:px-6">
        <span className="h-px flex-1 border-t border-dashed border-line" />
        <svg viewBox="-16 -12 32 16" className="h-4 w-8" fill="none" stroke="var(--marigold)" strokeWidth="1">
            <path d="M0 2 C -3 -3, -2 -8, 0 -11 C 2 -8, 3 -3, 0 2Z" />
            <path d="M0 2 C -6 0, -10 -4, -11 -8 C -6 -7, -2 -4, 0 2Z" />
            <path d="M0 2 C 6 0, 10 -4, 11 -8 C 6 -7, 2 -4, 0 2Z" />
            <path d="M-14 3 H14" />
        </svg>
        <span className="h-px flex-1 border-t border-dashed border-line" />
    </div>
);
