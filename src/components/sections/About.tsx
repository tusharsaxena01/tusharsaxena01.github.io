"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
    const { data } = usePortfolioData();
    const container = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
        });

        tl.from(".about-title", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
        })
            .from(".about-text", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
            }, "-=0.4");
    }, { scope: container });

    return (
        <section id="about" ref={container} className="py-32 px-6 lg:px-20 relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50" />

            <div className="max-w-4xl mx-auto">
                <h2 className="about-title text-3xl font-bold mb-12 flex items-center gap-4 text-white">
                    <span className="text-sky-500 font-mono text-xl">{data.about.sectionNumber}.</span>
                    {data.about.title}
                </h2>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-6 text-slate-300 leading-relaxed font-light about-text">
                        {data.personal.bio.paragraphs.map((paragraph, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                    </div>

                    <div className="about-text p-6 border border-slate-800 bg-slate-900/50 rounded-lg font-mono text-xs text-slate-400 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="mb-4 text-sky-500">
                    // current_status.json
                        </div>
                        <pre className="space-y-1">
                            {JSON.stringify(data.personal.bio.currentStatus, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </section>
    );
};
