"use client";

import React from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Section } from "../ui/Section";
import { Typewriter } from "../fx/Typewriter";
import { Terminal } from "../ui/Terminal";

export const About = () => {
    const { data, interpolateHTML } = usePortfolioData();
    const [lead, ...rest] = data.personal.bio.paragraphs.map(interpolateHTML);

    return (
        <Section id="about" index={data.about.sectionNumber} title={data.about.title} label="whoami">
            <div className="reveal grid gap-10 lg:grid-cols-2">
                <div className="frame p-6 sm:p-8">
                    <span className="frame-label">[ README.md ]</span>
                    <p className="text-green">{"// about"}</p>
                    <p className="mt-4 text-lg leading-relaxed">
                        <Typewriter text={lead} speed={12} jitter={8} onView />
                    </p>
                    {rest.map((p) => (
                        <p key={p} className="mt-4 text-sm leading-relaxed text-dim">{p}</p>
                    ))}
                </div>
                <Terminal autorun={["whoami", "status"]} />
            </div>
        </Section>
    );
};
