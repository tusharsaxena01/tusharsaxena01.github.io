"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { useLang } from "@/hooks/useLang";
import { currentText, graphemes, isDeva, isScrambling, scramble } from "@/utils/scramble";

interface ScrambleProps {
    en: string;
    hi?: string;
    className?: string;
    /** Adds glitch layers whose data-text tracks every scramble frame. */
    glitch?: boolean;
    /** Decode once on scroll-in. */
    decode?: boolean;
    /** Re-scramble when the nearest link/button/card is hovered. */
    hover?: boolean;
    /** Partial scramble every 4–7s (H1). */
    idle?: boolean;
    /** Morph through these phrases every 3.5s (status tag). */
    cycle?: string[];
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const langOf = (s: string) => (isDeva(s) ? "hi" : "en");

// React renders the initial markup once and never reconciles the children again,
// so scramble() can own the text nodes without fighting React.
export const Scramble = ({ en, hi, className, glitch, decode = true, hover, idle, cycle }: ScrambleProps) => {
    const { lang } = useLang();
    const text = lang === "hi" && hi ? hi : en;
    const ref = useRef<HTMLSpanElement>(null);
    const textRef = useRef(text);
    textRef.current = text;
    const [html] = useState(() => `<span class="sr-only">${esc(en)}</span><span aria-hidden="true">${esc(en)}</span>`);
    const mounted = useRef(false);

    const run = (to: string, opts: Parameters<typeof scramble>[2] = {}) => {
        const el = ref.current!;
        el.lang = langOf(to);
        return scramble(el, to, { ...opts, onFrame: glitch ? (s) => { el.dataset.text = s; } : undefined });
    };

    // Trigger 6: language toggle.
    useEffect(() => {
        // Mounting while already in Hindi (e.g. mobile menu, H1 after typing) still needs the swap.
        if (!mounted.current) { mounted.current = true; if (text === en) return; }
        if (!cycle) run(text);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

    useEffect(() => {
        const el = ref.current!;
        const cleanups: (() => void)[] = [];

        // Triggers 1 & 5: decode once on scroll-in.
        if (decode && !cycle) {
            const io = new IntersectionObserver(([e]) => {
                if (e.isIntersecting) { io.disconnect(); run(currentText(el)); }
            }, { threshold: 0.4 });
            io.observe(el);
            cleanups.push(() => io.disconnect());
        }

        // Trigger 2: hover.
        if (hover) {
            const host = (el.closest("a,button,.tilt") as HTMLElement | null) ?? el;
            const enter = () => { if (!isScrambling(el)) run(currentText(el), { duration: 600 }); };
            host.addEventListener("pointerenter", enter);
            cleanups.push(() => host.removeEventListener("pointerenter", enter));
        }

        // Trigger 3: idle partial scramble on the H1.
        if (idle) {
            let t: ReturnType<typeof setTimeout>;
            const loop = () => {
                t = setTimeout(() => {
                    if (!el.matches(":hover") && !isScrambling(el)) {
                        run(currentText(el), { duration: 250, subset: 0.3 + Math.random() * 0.2 });
                    }
                    loop();
                }, 4000 + Math.random() * 3000);
            };
            loop();
            cleanups.push(() => clearTimeout(t));
        }

        // Trigger 4: phrase morph, padded to equal grapheme length.
        if (cycle) {
            const len = Math.max(...cycle.map((p) => graphemes(p).length));
            let i = 0;
            const id = setInterval(() => {
                i = (i + 1) % cycle.length;
                const p = cycle[i];
                run(p + " ".repeat(len - graphemes(p).length));
            }, 3500);
            cleanups.push(() => clearInterval(id));
        }

        return () => cleanups.forEach((c) => c());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <span
            ref={ref}
            lang={langOf(en)}
            data-text={glitch ? en : undefined}
            className={cn("inline-block", glitch && "glitch", cycle && "whitespace-pre", className)}
            dangerouslySetInnerHTML={{ __html: html }}
            suppressHydrationWarning
        />
    );
};
