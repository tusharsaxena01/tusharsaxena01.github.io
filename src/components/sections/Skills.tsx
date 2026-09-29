"use client";

import React from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { devaDigits } from "@/utils/scramble";
import { Section } from "../ui/Section";
import { Scramble } from "../fx/Scramble";

// Line icons, one per category in order: frontend, backend, databases, cloud, data.
const ICONS = [
    "M3 4h18v12H3zM8 20h8M12 16v4",
    "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
    "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
    "M7 18a4 4 0 0 1-.6-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z",
    "M4 20V10M10 20V4M16 20v-7M22 20H2",
];

export const index = (i: number) => `[ ${devaDigits(String(i + 1).padStart(2, "0"))} ]`;

export const Skills = () => {
    const { data } = usePortfolioData();

    return (
        <Section id="skills" index={data.skills.sectionNumber} title={data.skills.title} titleHi={data.skills.titleHi} label="stack" alt>
            <div className="reveal grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.skills.categories.map((s, i) => (
                    <div key={s.category}>
                        <article className="frame jaali tilt group h-full">
                            <div className="flex items-start justify-between">
                                <Scramble en={index(i)} className="meta text-marigold" />
                                <svg viewBox="0 0 24 24" className={`h-7 w-7 ${i % 2 ? "text-marigold" : "text-saffron"}`} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                    <path d={ICONS[i % ICONS.length]} />
                                </svg>
                            </div>
                            <h3 className="mt-6 text-xl font-bold">
                                <Scramble glitch hover decode={false} en={s.category} className="glitch--hover" />
                            </h3>
                            <ul className="relative mt-4 flex flex-wrap gap-2">
                                {s.items.map((item) => <li key={item} className="chip">{item}</li>)}
                            </ul>
                        </article>
                    </div>
                ))}
            </div>
        </Section>
    );
};
