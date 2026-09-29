"use client";

import React from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Section } from "../ui/Section";

export const Projects = () => {
    const { data } = usePortfolioData();

    return (
        <Section id="projects" index={data.projects.sectionNumber} title={data.projects.title} label="projects">
            <div className="reveal grid gap-6 md:grid-cols-2">
                {data.projects.items.map((p, i) => (
                    <div key={p.title}>
                        <article className="frame tilt group flex h-full flex-col p-6 sm:p-8">
                            <div className="meta flex justify-between">
                                <span className="text-green-dim">[ {String(i + 1).padStart(2, "0")} ]</span>
                                <span>{p.type}</span>
                            </div>
                            <h3 className="glitch glitch--hover mt-6 text-xl sm:text-2xl" data-text={p.title}>{p.title}</h3>
                            <p className="mt-3 flex-1 text-sm leading-relaxed text-dim">{p.description}</p>
                            <ul className="mt-6 flex flex-wrap gap-2">
                                {p.tech.map((t) => <li key={t} className="chip">{t}</li>)}
                            </ul>
                            {p.link !== "#" && (
                                <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn mt-6 self-start">
                                    <span className="text-green">$</span> open
                                </a>
                            )}
                        </article>
                    </div>
                ))}
            </div>
        </Section>
    );
};
