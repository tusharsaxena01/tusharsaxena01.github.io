"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
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
                    <span className="text-sky-500 font-mono text-xl">01.</span>
                    About Me
                </h2>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-6 text-slate-300 leading-relaxed font-light about-text">
                        <p>
                            I am a software developer based in India, currently building robust systems at <strong className="text-white">Tranzita Systems</strong>.
                            My philosophy is simple: <span className="text-sky-400 italic">Code is a tool, not the goal.</span> The goal is solving problems with efficiency and elegance.
                        </p>
                        <p>
                            I started coding 2+ years ago, diving deep into the Javascript ecosystem. I don't just write functions; I architect experiences.
                            From optimizing database queries to crafting pixel-perfect 60fps animations, I obsess over the details that others overlook.
                        </p>
                        <p>
                            When I'm not pushing to production, I'm exploring new technologies, refining my mental models of distributed systems, or just tweaking my terminal config.
                        </p>
                    </div>

                    <div className="about-text p-6 border border-slate-800 bg-slate-900/50 rounded-lg font-mono text-xs text-slate-400 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="mb-4 text-sky-500">
                    // current_status.json
                        </div>
                        <pre className="space-y-1">
                            {`{
  "role": "Software Developer",
  "company": "Tranzita Systems",
  "location": "India",
  "learning": ["Next.js", "Rust", "Three.js"],
  "coffee_level": "High"
}`}
                        </pre>
                    </div>
                </div>
            </div>
        </section>
    );
};
