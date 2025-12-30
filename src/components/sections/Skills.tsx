"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Atropos from "atropos/react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

gsap.registerPlugin(ScrollTrigger);

export const Skills = () => {
    const { data } = usePortfolioData();
    const container = useRef(null);

    useGSAP(() => {
        gsap.from(".skill-card", {
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
        });
    }, { scope: container });

    return (
        <section id="skills" ref={container} className="py-20 px-6 lg:px-20">
            <h2 className="text-3xl font-bold mb-16 flex items-center gap-4 text-white">
                <span className="text-sky-500 font-mono text-xl">{data.skills.sectionNumber}.</span>
                {data.skills.title}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
                {data.skills.categories.map((skill, index) => (
                    <Atropos key={index} className="skill-card h-full" highlight={false} shadow={false}>
                        <div className="h-full p-8 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-sky-500/50 transition-colors backdrop-blur-sm group">
                            <h3 className="text-xl font-bold text-sky-400 mb-6 font-mono" data-atropos-offset="5">
                                {`> ${skill.category}`}
                            </h3>
                            <div className="flex flex-wrap gap-3" data-atropos-offset="2">
                                {skill.items.map((item) => (
                                    <span
                                        key={item}
                                        className="px-3 py-1 bg-slate-800 rounded text-sm text-slate-300 border border-slate-700 hover:border-sky-500/30 hover:text-sky-300 transition-colors cursor-default"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Atropos>
                ))}
            </div>
        </section>
    );
};
