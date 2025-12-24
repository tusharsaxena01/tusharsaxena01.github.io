"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
    {
        company: "Tranzita Systems",
        role: "Software Developer",
        period: "2023 - Present",
        description: [
            "Architected and maintained core microservices handling high-frequency data.",
            "Optimized frontend performance, reducing TTI by 40% using Next.js optimization techniques.",
            "Collaborated with cross-functional teams to deliver pixel-perfect UI/UX.",
        ],
    },
    {
        company: "Freelance",
        role: "Full Stack Developer",
        period: "2021 - 2023",
        description: [
            "Delivered custom web solutions for clients in E-commerce and EdTech.",
            "Built performant REST APIs using Node.js and Express.",
        ],
    },
];

export const Experience = () => {
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
        <section id="experience" ref={container} className="py-20 px-6 lg:px-20 relative overflow-hidden">
            {/* Decorative Grid Line */}
            <div className="absolute left-6 lg:left-20 top-0 bottom-0 w-px bg-slate-800 hidden md:block" />

            <h2 className="exp-title text-3xl font-bold mb-16 flex items-center gap-4 text-white pl-0 md:pl-10">
                <span className="text-sky-500 font-mono text-xl">04.</span>
                Experience
            </h2>

            <div className="space-y-8 pl-0 md:pl-10">
                {experiences.map((exp, index) => (
                    <div key={index} className="exp-item relative border-l-2 border-slate-700 pl-6 md:border-none md:pl-0 group cursor-default transition-all duration-300">
                        {/* Timeline dot for desktop */}
                        <div className="hidden md:block absolute -left-[45px] top-2 w-3 h-3 rounded-full bg-slate-800 box-content border-4 border-slate-950 group-hover:bg-sky-500 transition-colors" />

                        <h3 className="text-2xl font-bold text-white mb-2">{exp.role} <span className="text-sky-400">@ {exp.company}</span></h3>
                        <div className="text-sm font-mono text-slate-500 mb-4">{exp.period}</div>

                        {/* Expandable details with max-height transition */}
                        <div className="max-h-0 overflow-hidden group-hover:max-h-96 transition-all duration-500 ease-in-out">
                            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-lg shadow-xl mt-4 mb-2">
                                <ul className="space-y-2 border-l border-sky-500/30 pl-4 py-1">
                                    {exp.description.map((desc, i) => (
                                        <li key={i} className="flex gap-3 text-slate-300 text-sm">
                                            <span className="text-sky-500 mt-1">▹</span>
                                            <span>{desc}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="text-xs text-slate-600 group-hover:opacity-0 mt-2 font-mono transition-opacity duration-200">&lt;hover to expand /&gt;</div>
                    </div>
                ))}
            </div>
        </section>
    );
};
