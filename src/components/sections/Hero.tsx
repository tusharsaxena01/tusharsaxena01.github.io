"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Terminal } from "../ui/Terminal";
import Atropos from "atropos/react";
import "atropos/css";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";

export const Hero = () => {
    const { data, interpolate } = usePortfolioData();
    const containerRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subheadlineRef = useRef<HTMLParagraphElement>(null);
    const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);
    const isTouchDevice = useIsTouchDevice();

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(headlineRef.current, {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: "power4.out",
            })
                .from(subheadlineRef.current, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    delay: -0.5,
                    ease: "power3.out",
                })
                .from(".hero-cta", {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "back.out(1.7)",
                    clearProps: "all",
                }, "-=0.5")
                .from(".hero-terminal", {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                }, "-=0.5");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleTerminalClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsTerminalModalOpen(true);
    };

    return (
        <section ref={containerRef} className="relative h-screen lg:min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 sm:px-6 lg:px-20 py-16 sm:py-20 gap-8 lg:gap-10">

            <div className="flex-1 space-y-6 sm:space-y-8 z-10 text-center lg:text-left w-full">
                <h1 ref={headlineRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white">
                    <span className="block text-slate-400 text-lg sm:text-xl lg:text-3xl font-mono mb-2">{data.hero.greeting}</span>
                    {interpolate(data.hero.headline).split(' ').slice(0, 2).join(' ')} <span className="text-sky-400">{data.personal.name}</span>.
                </h1>

                <p ref={subheadlineRef} className="text-base sm:text-lg lg:text-2xl text-slate-400 max-w-2xl mx-auto lg:mx-0">
                    <span dangerouslySetInnerHTML={{ __html: interpolate(data.hero.subheadline[0]) }} />
                    <br />
                    {data.hero.subheadline[1]}
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                    {data.hero.cta.map((button, index) => (
                        <a
                            key={index}
                            href={button.href}
                            className={`hero-cta opacity-100 px-6 sm:px-8 py-3 font-bold rounded-lg transition-all hover:scale-105 active:scale-95 text-center touch-manipulation ${button.variant === 'primary'
                                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-500/20 border border-sky-400/50'
                                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                                }`}
                            download={button.download}
                        >
                            {button.text}
                        </a>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full max-w-lg lg:max-w-xl hero-terminal z-10" onClick={handleTerminalClick}>
                {isTouchDevice ? (
                    // Render without Atropos on touch devices
                    <div className="cursor-pointer">
                        <Terminal
                            initialMessage={data.hero.terminal.initialMessages}
                            className="w-full h-[250px] sm:h-[300px] lg:h-[400px]"
                        />
                    </div>
                ) : (
                    // Render with Atropos on non-touch devices
                    <Atropos
                        activeOffset={20}
                        shadow={false}
                    >
                        <div className="cursor-pointer">
                            <Terminal
                                initialMessage={data.hero.terminal.initialMessages}
                                className="w-full h-[250px] sm:h-[300px] lg:h-[400px]"
                            />
                        </div>
                    </Atropos>
                )}
            </div>

            {/* Terminal Modal */}
            {isTerminalModalOpen && (
                <Terminal
                    initialMessage={data.hero.terminal.modalMessages}
                    isModalOpen={true}
                    onClose={() => setIsTerminalModalOpen(false)}
                />
            )}

        </section>
    );
};
