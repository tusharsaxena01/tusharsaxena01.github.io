"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Atropos from "atropos/react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

export const Skills = () => {
    const { data } = usePortfolioData();
    const container = useRef(null);
    const isTouchDevice = useIsTouchDevice();

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
        <section id="skills" ref={container} className="py-16 sm:py-20 px-4 sm:px-6 lg:px-20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-12 sm:mb-16 flex items-center gap-3 sm:gap-4 text-white">
                <span className="text-sky-500 font-mono text-lg sm:text-xl">{data.skills.sectionNumber}.</span>
                {data.skills.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {data.skills.categories.map((skill, index) => (
                    isTouchDevice ? (
                        // Render without Atropos on touch devices to prevent scroll blocking
                        <div key={index} className="skill-card h-full">
                            <div className="h-full p-6 sm:p-8 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-sky-500/50 transition-colors backdrop-blur-sm group">
                                <h3 className="text-lg sm:text-xl font-bold text-sky-400 mb-4 sm:mb-6 font-mono">
                                    {`> ${skill.category}`}
                                </h3>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    {skill.items.map((item) => (
                                        <span
                                            key={item}
                                            className="px-2.5 sm:px-3 py-1 bg-slate-800 rounded text-xs sm:text-sm text-slate-300 border border-slate-700 hover:border-sky-500/30 hover:text-sky-300 transition-colors cursor-default"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Render with Atropos on non-touch devices
                        <Atropos key={index} className="skill-card h-full" highlight={false} shadow={false}>
                            <div className="h-full p-6 sm:p-8 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-sky-500/50 transition-colors backdrop-blur-sm group">
                                <h3 className="text-lg sm:text-xl font-bold text-sky-400 mb-4 sm:mb-6 font-mono" data-atropos-offset="5">
                                    {`> ${skill.category}`}
                                </h3>
                                <div className="flex flex-wrap gap-2 sm:gap-3" data-atropos-offset="2">
                                    {skill.items.map((item) => (
                                        <span
                                            key={item}
                                            className="px-2.5 sm:px-3 py-1 bg-slate-800 rounded text-xs sm:text-sm text-slate-300 border border-slate-700 hover:border-sky-500/30 hover:text-sky-300 transition-colors cursor-default"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Atropos>
                    )
                ))}
            </div>
        </section>
    );
};
