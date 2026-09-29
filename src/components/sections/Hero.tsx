"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Typewriter } from "../fx/Typewriter";
import { Hero3D } from "../fx/Hero3D";

const toCommand = (text: string) => text.toLowerCase().replace(/\s+/g, "_");

export const Hero = ({ booted }: { booted: boolean }) => {
    const { data } = usePortfolioData();
    const [glitch, setGlitch] = useState(false);
    const name = data.personal.name;

    return (
        <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-16 pt-28 sm:px-6">
            <div className="grid-floor" aria-hidden />

            <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-12 lg:grid-cols-2">
                <div>
                    <p className="meta flex items-center gap-3">
                        <span className="pulse-dot" /> system online {"//"} {data.personal.location}
                    </p>
                    <p className="mt-8 text-green">{data.hero.greeting}</p>
                    <h1
                        className={cn("mt-2 text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[.95]", glitch && "glitch")}
                        data-text={name}
                    >
                        <Typewriter text={name} speed={70} jitter={30} start={booted} onDone={() => setGlitch(true)} />
                    </h1>
                    <p className="mt-6 text-base sm:text-lg">
                        <Typewriter phrases={data.hero.phrases} start={booted} startDelay={900} keepCursor />
                    </p>
                    <p className="mt-4 max-w-xl text-dim">{data.personal.tagline}</p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        {data.hero.cta.map((b) => (
                            <a key={b.text} href={b.href} download={b.download} className="btn">
                                <span className="text-green">{b.variant === "primary" ? ">" : "$"}</span>
                                {toCommand(b.text)}
                            </a>
                        ))}
                    </div>
                </div>

                <Hero3D />
            </div>
        </section>
    );
};
