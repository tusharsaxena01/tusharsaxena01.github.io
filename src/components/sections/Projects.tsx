"use client";

import React from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Section } from "../ui/Section";
import { Scramble } from "../fx/Scramble";
import { index } from "./Skills";

export const Projects = () => {
    const { data } = usePortfolioData();

    return (
        <Section id="projects" index={data.projects.sectionNumber} title={data.projects.title} titleHi={data.projects.titleHi} label="projects">
            <div className="reveal grid gap-6 md:grid-cols-2">
                {data.projects.items.map((p, i) => (
                    <div key={p.title}>
                        <article className="frame jaali tilt group flex h-full flex-col p-6 sm:p-8">
                            <div className="meta flex justify-between">
                                <Scramble en={index(i)} className="text-marigold" />
                                <span>{p.type}</span>
                            </div>
                            <h3 className="mt-6 text-xl font-bold sm:text-2xl">
                                <Scramble glitch hover decode={false} en={p.title} className="glitch--hover" />
                            </h3>
                            <p className="mt-3 flex-1 text-sm leading-relaxed text-dim">{p.description}</p>
                            <ul className="relative mt-6 flex flex-wrap gap-2">
                                {p.tech.map((t) => <li key={t} className="chip">{t}</li>)}
                            </ul>
                            {p.link !== "#" && (
                                <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn mt-6 self-start">
                                    <Scramble hover decode={false} en="$ open" />
                                </a>
                            )}
                        </article>
                    </div>
                ))}
            </div>
        </Section>
    );
};
