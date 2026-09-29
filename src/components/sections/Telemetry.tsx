"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { prefersReducedMotion } from "@/utils/motion";
import { Section } from "../ui/Section";

const CAREER_START = new Date("2023-11-01").getTime();
const BLOCKS = 12;

export const Telemetry = () => {
    const { data } = usePortfolioData();
    const ref = useRef<HTMLDivElement>(null);
    const [t, setT] = useState(0); // 0 → 1 count-up progress

    const stats = [
        { label: "days_in_production", value: Math.floor((Date.now() - CAREER_START) / 864e5) },
        { label: "projects_shipped", value: data.projects.items.length },
        { label: "technologies", value: data.skills.categories.reduce((n, c) => n + c.items.length, 0) },
        { label: "skill_domains", value: data.skills.categories.length },
    ];

    useEffect(() => {
        let raf = 0;
        const io = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            io.disconnect();
            if (prefersReducedMotion()) return setT(1);
            const t0 = performance.now();
            const step = (now: number) => {
                const p = Math.min((now - t0) / 1200, 1);
                setT(1 - (1 - p) ** 3); // ease-out cubic
                if (p < 1) raf = requestAnimationFrame(step);
            };
            raf = requestAnimationFrame(step);
        }, { threshold: 0.4 });
        io.observe(ref.current!);
        return () => { io.disconnect(); cancelAnimationFrame(raf); };
    }, []);

    const filled = Math.round(t * BLOCKS);

    return (
        <Section id="telemetry" index="05" title="Telemetry" titleHi="टेलीमेट्री" label="stats --live">
            <div ref={ref} className="reveal grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                    <div key={s.label} className="frame">
                        <p className="meta">{s.label}</p>
                        <p className="mt-3 font-display text-5xl font-bold text-marigold tabular-nums">
                            {String(Math.round(s.value * t)).padStart(String(s.value).length, "0")}
                        </p>
                        <p className="mt-3 text-xs tracking-tighter text-saffron" aria-hidden>
                            {"█".repeat(filled)}<span className="text-line">{"█".repeat(BLOCKS - filled)}</span>
                        </p>
                    </div>
                ))}
            </div>
        </Section>
    );
};
