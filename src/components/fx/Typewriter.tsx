"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { prefersReducedMotion, sleep } from "@/utils/motion";
import { graphemes, isDeva } from "@/utils/scramble";

interface TypewriterProps {
    text?: string;
    /** Cycles forever: type → hold 1.8s → delete → next */
    phrases?: string[];
    speed?: number;
    jitter?: number;
    startDelay?: number;
    /** false = wait (e.g. for the boot loader) */
    start?: boolean;
    /** Start when scrolled into view instead of immediately */
    onView?: boolean;
    keepCursor?: boolean;
    onDone?: () => void;
    className?: string;
}

// Terminal prompts (>, $, //) render in marigold.
const prompt = (s: string) => {
    const m = s.match(/^(>|\$|\/\/)/);
    return m ? <><span className="text-marigold">{m[0]}</span>{s.slice(m[0].length)}</> : s;
};

export const Typewriter = ({
    text = "", phrases, speed = 28, jitter = 18, startDelay = 0,
    start = true, onView = false, keepCursor = false, onDone, className,
}: TypewriterProps) => {
    const list = phrases ?? [text];
    const longest = list.reduce((a, b) => (b.length > a.length ? b : a), "");
    const ref = useRef<HTMLSpanElement>(null);
    const doneRef = useRef(onDone);
    doneRef.current = onDone;
    const [out, setOut] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!start) return;
        let dead = false;
        const finish = () => { setDone(true); doneRef.current?.(); };

        if (prefersReducedMotion()) {
            setOut(list[0]);
            finish();
            return;
        }

        const run = async () => {
            await sleep(startDelay);
            for (let i = 0; !dead; i = (i + 1) % list.length) {
                const p = graphemes(list[i]);
                for (let n = 1; n <= p.length && !dead; n++) {
                    setOut(p.slice(0, n).join(""));
                    await sleep(speed + (Math.random() * 2 - 1) * jitter);
                }
                if (list.length === 1) break;
                await sleep(1800);
                for (let n = p.length - 1; n >= 0 && !dead; n--) {
                    setOut(p.slice(0, n).join(""));
                    await sleep(speed / 3);
                }
            }
            if (!dead) finish();
        };

        if (!onView) {
            run();
            return () => { dead = true; };
        }
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { io.disconnect(); run(); }
        }, { threshold: 0.4 });
        io.observe(ref.current!);
        return () => { dead = true; io.disconnect(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start]);

    // The invisible copy of the longest string reserves space so nothing shifts while typing.
    return (
        <span ref={ref} className={cn("relative inline-grid", className)}>
            <span className="sr-only">{list.join(" ")}</span>
            <span aria-hidden className="invisible [grid-area:1/1]">{prompt(longest)}<span>▋</span></span>
            <span aria-hidden lang={isDeva(out) ? "hi" : undefined} className="[grid-area:1/1]">
                {prompt(out)}
                {(!done || keepCursor) && <span className="caret">▋</span>}
            </span>
        </span>
    );
};
