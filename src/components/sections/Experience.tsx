"use client";

import React from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Section } from "../ui/Section";

export const Experience = () => {
    const { data } = usePortfolioData();

    return (
        <Section id="experience" index={data.experience.sectionNumber} title={data.experience.title} label="experience.log">
            <div className="reveal space-y-8">
                {data.experience.items.map((exp) => (
                    <article key={exp.company + exp.period} className="frame p-6 sm:p-8">
                        <span className="frame-label">{exp.period}</span>
                        <h3 className="text-xl sm:text-2xl">
                            {exp.role} <span className="text-green">@ {exp.company}</span>
                        </h3>
                        <ul className="mt-6 space-y-3 text-sm sm:text-base">
                            {exp.description.map((d) => (
                                <li key={d} className="flex gap-3">
                                    <span className="shrink-0 text-green">&gt;</span>
                                    <span className="text-ink">{d}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </Section>
    );
};
