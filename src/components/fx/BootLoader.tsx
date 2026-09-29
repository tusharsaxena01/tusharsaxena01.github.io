"use client";

import React, { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/utils/motion";

const LINES = [
    "[ OK ] loading kernel",
    "[ OK ] mounting /dev/gpu",
    "[ OK ] starting network daemon",
    "[ OK ] resolving host abhi.portfolio",
    "[ OK ] decrypting experience.log",
    "[ OK ] indexing tech_stack",
    "[ OK ] compiling projects",
    "[ OK ] spawning terminal",
    "[ OK ] handshake complete",
    "> welcome, operator.",
];
const BAR = 24;

export const BootLoader = ({ onDone }: { onDone: () => void }) => {
    const [shown, setShown] = useState(0);
    const [phase, setPhase] = useState<"boot" | "wipe" | "gone">("boot");

    useEffect(() => {
        let seen = false;
        try {
            seen = sessionStorage.getItem("booted") === "1";
            sessionStorage.setItem("booted", "1");
        } catch { /* storage blocked: just show the boot */ }

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
        }, 180);
        if (seen || prefersReducedMotion()) finish(false);

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
                {LINES.slice(0, shown).map((l) => (
                    <p key={l} className={l.startsWith(">") ? "text-green" : "text-dim"}>
                        {l.startsWith("[ OK ]") ? <><span className="text-green">[ OK ]</span>{l.slice(6)}</> : l}
                    </p>
                ))}
                <p className="mt-4 text-green whitespace-pre">
                    {"█".repeat(filled)}<span className="text-line">{"█".repeat(BAR - filled)}</span>
                    {" "}{String(Math.round((shown / LINES.length) * 100)).padStart(3, " ")}%
                </p>
                <p className="meta mt-6">press any key to skip</p>
            </div>
        </div>
    );
};
