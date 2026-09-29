"use client";

import React, { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/utils/motion";
import { Chakra } from "./Motifs";

const LINES = [
    "[ OK ] loading kernel",
    "[ OK ] mounting /dev/gpu",
    "[ OK ] loading 22 language packs",
    "[ OK ] resolving host abhi.portfolio",
    "[ OK ] decrypting experience.log",
    "[ OK ] compiling projects",
    "[ OK ] spawning terminal",
    "[ OK ] namaste, operator",
    "[ OK ] सिस्टम चालू है",
];
const BAR = 24;
// Three consecutive bands: an abstract stripe, not a flag.
const band = (i: number) => (i < BAR / 3 ? "text-saffron" : i < (2 * BAR) / 3 ? "text-white" : "text-green-deep");

export const BootLoader = ({ onDone }: { onDone: () => void }) => {
    const [shown, setShown] = useState(0);
    const [phase, setPhase] = useState<"boot" | "wipe" | "gone">("boot");

    useEffect(() => {
        let finished = false;
        const finish = (wipe: boolean) => {
            if (finished) return;
            finished = true;
            clearInterval(id);
            setPhase(wipe ? "wipe" : "gone");
            setTimeout(() => { setPhase("gone"); onDone(); }, wipe ? 400 : 0);
        };

        let i = 0;
        const id = setInterval(() => {
            setShown(++i);
            if (i >= LINES.length) { clearInterval(id); setTimeout(() => finish(true), 200); }
        }, 190);
        if (prefersReducedMotion()) finish(false);

        const skip = () => finish(true);
        window.addEventListener("keydown", skip);
        window.addEventListener("pointerdown", skip);
        return () => {
            clearInterval(id);
            window.removeEventListener("keydown", skip);
            window.removeEventListener("pointerdown", skip);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (phase === "gone") return null;
    const filled = Math.round((shown / LINES.length) * BAR);

    return (
        <div className={`boot flex items-center justify-center p-6 ${phase === "wipe" ? "boot-wipe" : ""}`} aria-hidden>
            <div className="w-full max-w-xl text-sm">
                <Chakra className="spin-2 mb-6 h-12 w-12" />
                {LINES.slice(0, shown).map((l) => (
                    <p key={l} className="text-ink">
                        <span className="text-green">[ OK ]</span>
                        <span lang={/[ऀ-ॿ]/.test(l) ? "hi" : undefined}>{l.slice(6)}</span>
                    </p>
                ))}
                <p className="mt-4 whitespace-pre">
                    {Array.from({ length: BAR }, (_, i) => (
                        <span key={i} className={i < filled ? band(i) : "text-line"}>█</span>
                    ))}
                    <span className="text-marigold">{" "}{String(Math.round((shown / LINES.length) * 100)).padStart(3, " ")}%</span>
                </p>
                <p className="meta mt-6">press any key to skip</p>
            </div>
        </div>
    );
};
