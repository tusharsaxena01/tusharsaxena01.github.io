"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Atropos from "atropos/react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

export const Projects = () => {
    const { data } = usePortfolioData();
    const container = useRef(null);
    const isTouchDevice = useIsTouchDevice();

    useGSAP(() => {
        gsap.from(".project-card", {
            scrollTrigger: {
                trigger: container.current,
                start: "top 75%",
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: "power2.out",
        });
    }, { scope: container });

    return (
        <section id="projects" ref={container} className="py-16 sm:py-20 px-4 sm:px-6 lg:px-20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-12 sm:mb-16 flex items-center gap-3 sm:gap-4 text-white">
                <span className="text-sky-500 font-mono text-lg sm:text-xl">{data.projects.sectionNumber}.</span>
                {data.projects.title}
            </h2>

            <div className="space-y-12 sm:space-y-16">
                {data.projects.items.map((project, index) => (
                    <div key={index} className="project-card group relative">
                        {isTouchDevice ? (
                            // Render without Atropos on touch devices to prevent scroll blocking
                            <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-6 sm:p-8 lg:p-12 overflow-hidden">
                                {/* Background Grid Pattern inside card */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10 pointer-events-none" />

                                <div className="relative z-10 flex flex-col gap-6 sm:gap-8 items-start">
                                    <div className="space-y-3 sm:space-y-4 w-full">
                                        <div className="text-sky-500 font-mono text-xs tracking-widest uppercase">
                                            {project.type} Project
                                        </div>
                                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-sky-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 sm:gap-4 pt-2 sm:pt-4">
                                            {project.tech.map(t => (
                                                <span key={t} className="text-xs sm:text-sm font-mono text-slate-500 hover:text-sky-300 transition-colors">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button className="w-full sm:w-auto px-6 py-2 border border-slate-700 rounded-full text-sm text-white hover:bg-slate-800 transition-colors touch-manipulation">
                                        View Case Study &rarr;
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Render with Atropos on non-touch devices
                            <Atropos
                                activeOffset={40}
                                shadowScale={1.05}
                                className="w-full"
                            >
                                <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-6 sm:p-8 lg:p-12 overflow-hidden">
                                    {/* Background Grid Pattern inside card */}
                                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10 pointer-events-none" />

                                    <div className="relative z-10 flex flex-col md:flex-row gap-6 sm:gap-8 items-start justify-between">
                                        <div className="space-y-3 sm:space-y-4 max-w-2xl">
                                            <div className="text-sky-500 font-mono text-xs tracking-widest uppercase" data-atropos-offset="-5">
                                                {project.type} Project
                                            </div>
                                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-sky-400 transition-colors" data-atropos-offset="0">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm sm:text-base text-slate-400 leading-relaxed" data-atropos-offset="2">
                                                {project.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2 sm:gap-4 pt-2 sm:pt-4" data-atropos-offset="5">
                                                {project.tech.map(t => (
                                                    <span key={t} className="text-xs sm:text-sm font-mono text-slate-500 hover:text-sky-300 transition-colors">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <button className="px-6 py-2 border border-slate-700 rounded-full text-sm text-white hover:bg-slate-800 transition-colors" data-atropos-offset="8">
                                            View Case Study &rarr;
                                        </button>
                                    </div>
                                </div>
                            </Atropos>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
