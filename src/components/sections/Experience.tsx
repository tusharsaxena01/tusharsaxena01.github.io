"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

gsap.registerPlugin(ScrollTrigger);

export const Experience = () => {
    const { data } = usePortfolioData();
    const container = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top 70%",
            },
        });

        tl.from(".exp-title", {
            y: 50, opacity: 0, duration: 0.5, ease: "power3.out", clearProps: "all"
        })
            .from(".exp-item", {
                x: -50, opacity: 0, duration: 0.5, stagger: 0.15, ease: "power2.out", clearProps: "all"
            }, "-=0.3");

    }, { scope: container });

    return (
        <section id="experience" ref={container} className="py-16 sm:py-20 px-4 sm:px-6 lg:px-20 relative overflow-hidden">
            {/* Decorative Grid Line */}
            <div className="absolute left-4 sm:left-6 lg:left-20 top-0 bottom-0 w-px bg-slate-800 hidden md:block" />

            <h2 className="exp-title text-2xl sm:text-3xl font-bold mb-12 sm:mb-16 flex items-center gap-3 sm:gap-4 text-white pl-0 md:pl-10">
                <span className="text-sky-500 font-mono text-lg sm:text-xl">{data.experience.sectionNumber}.</span>
                {data.experience.title}
            </h2>

            <div className="space-y-6 sm:space-y-8 pl-0 md:pl-10">
                {data.experience.items.map((exp, index) => (
                    <div
                        key={index}
                        className="exp-item relative"
                    >
                        {/* Timeline dot for desktop */}
                        <div className="hidden md:block absolute -left-[45px] top-8 w-3 h-3 rounded-full bg-sky-500 box-content border-4 border-slate-950 transition-colors" />

                        {/* Single unified box containing everything */}
                        <div className="border border-slate-800 bg-slate-900/30 rounded-lg p-6 sm:p-8 hover:border-slate-700 transition-colors">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                {exp.role} <span className="text-sky-400">@ {exp.company}</span>
                            </h3>
                            <div className="text-xs sm:text-sm font-mono text-slate-500 mb-6">{exp.period}</div>

                            {/* Details */}
                            <ul className="space-y-3 border-l-2 border-sky-500/30 pl-4 sm:pl-6">
                                {exp.description.map((desc, i) => (
                                    <li key={i} className="flex gap-2 sm:gap-3 text-slate-300 text-sm sm:text-base">
                                        <span className="text-sky-500 mt-1 flex-shrink-0">▹</span>
                                        <span>{desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
