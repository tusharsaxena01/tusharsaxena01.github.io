"use client";

import React from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Section } from "../ui/Section";
import { Typewriter } from "../fx/Typewriter";
import { Scramble } from "../fx/Scramble";
import { Terminal } from "../ui/Terminal";

export const About = () => {
    const { data, interpolateHTML } = usePortfolioData();
    const [lead, ...rest] = data.personal.bio.paragraphs.map(interpolateHTML);

    return (
        <Section id="about" index={data.about.sectionNumber} title={data.about.title} titleHi={data.about.titleHi} label="whoami">
            <div className="reveal grid gap-10 lg:grid-cols-2">
                <div className="frame p-6 sm:p-8">
                    <span className="frame-label"><Scramble en="[ SYS.०१ ]" /></span>
                    <p className="text-marigold">{"// about — thoda sa intro"}</p>
                    <p className="mt-4 text-lg leading-relaxed text-ivory">
                        <Typewriter text={lead} speed={12} jitter={8} onView />
                    </p>
                    {rest.map((p) => (
                        <p key={p} className="mt-4 text-sm leading-relaxed text-dim">{p}</p>
                    ))}
                </div>
                <Terminal autorun={["whoami", "cat mission.txt", 'echo "namaste, duniya"']} />
            </div>
        </Section>
    );
};
