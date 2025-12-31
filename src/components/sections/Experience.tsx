"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

export const Experience = () => {
    const { data } = usePortfolioData();
    const container = useRef(null);
    const isTouchDevice = useIsTouchDevice();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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

    const handleExpClick = (index: number) => {
        if (isTouchDevice) {
            setExpandedIndex(expandedIndex === index ? null : index);
        }
    };

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
                        className={`exp-item relative border-l-2 border-slate-700 pl-6 md:border-none md:pl-0 group cursor-pointer transition-all duration-300 ${isTouchDevice && expandedIndex === index ? 'expanded' : ''}`}
                        onClick={() => handleExpClick(index)}
                    >
                        {/* Timeline dot for desktop */}
                        <div className="hidden md:block absolute -left-[45px] top-2 w-3 h-3 rounded-full bg-slate-800 box-content border-4 border-slate-950 group-hover:bg-sky-500 transition-colors" />

                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{exp.role} <span className="text-sky-400">@ {exp.company}</span></h3>
                        <div className="text-xs sm:text-sm font-mono text-slate-500 mb-4">{exp.period}</div>

                        {/* Expandable details - hover on desktop, click/tap on mobile */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isTouchDevice
                                ? (expandedIndex === index ? 'max-h-96' : 'max-h-0')
                                : 'max-h-0 group-hover:max-h-96'
                            }`}>
                            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 sm:p-4 rounded-lg shadow-xl mt-4 mb-2">
                                <ul className="space-y-2 border-l border-sky-500/30 pl-3 sm:pl-4 py-1">
                                    {exp.description.map((desc, i) => (
                                        <li key={i} className="flex gap-2 sm:gap-3 text-slate-300 text-xs sm:text-sm">
                                            <span className="text-sky-500 mt-1">▹</span>
                                            <span>{desc}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className={`text-xs text-slate-600 mt-2 font-mono transition-opacity duration-200 ${isTouchDevice
                                ? (expandedIndex === index ? 'opacity-0' : 'opacity-100')
                                : 'group-hover:opacity-0'
                            }`}>
                            {isTouchDevice ? '<tap to expand />' : '<hover to expand />'}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
