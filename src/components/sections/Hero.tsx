"use client";

import React, { useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useLang } from "@/hooks/useLang";
import { Typewriter } from "../fx/Typewriter";
import { Scramble } from "../fx/Scramble";
import { Hero3D } from "../fx/Hero3D";

const toCommand = (text: string) => text.toLowerCase().replace(/\s+/g, "_");
const STATUS = ["SYSTEM ONLINE", "NEURAL LINK ACTIVE", "सिस्टम चालू है", "AWAITING INPUT"];

export const Hero = ({ booted }: { booted: boolean }) => {
    const { data } = usePortfolioData();
    const { lang } = useLang();
    const [typed, setTyped] = useState(false);
    const [first, last] = data.personal.name.split(" ");
    const [firstHi, lastHi] = data.personal.nameHi.split(" ");

    return (
        <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-20 pt-28 sm:px-6">
            <div className="surya-glow" aria-hidden />
            <div className="surya" aria-hidden />
            <div className="grid-floor" aria-hidden />

            <div className="frame frame--hero relative mx-auto grid w-full max-w-[1200px] items-center gap-12 p-6 sm:p-10 lg:grid-cols-2">
                <div>
                    <p className="meta flex items-center gap-3">
                        <span className="pulse-dot" />
                        <Scramble cycle={STATUS} en={STATUS[0]} className="text-ivory" />
                    </p>
                    <p className="mt-8 text-marigold">{data.hero.greeting}</p>

                    <h1 className="mt-2 text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[.95] text-white">
                        {/* Typewriter first, then glitch layers + idle scramble take over. */}
                        {typed ? (
                            <>
                                <Scramble glitch idle decode={false} en={first} hi={firstHi} />{" "}
                                <Scramble glitch idle decode={false} en={last} hi={lastHi} className="hl" />
                            </>
                        ) : (
                            <Typewriter text={data.personal.name} speed={70} jitter={30} start={booted} onDone={() => setTyped(true)} />
                        )}
                    </h1>
                    <p lang="hi" className="glitch deva-display mt-3 text-2xl text-saffron opacity-60" data-text="भविष्य बनाओ">
                        भविष्य बनाओ
                    </p>

                    <p className="mt-6 text-base sm:text-lg">
                        <Typewriter
                            key={lang}
                            phrases={lang === "hi" ? data.hero.phrasesHi : data.hero.phrases}
                            start={booted}
                            startDelay={900}
                            keepCursor
                        />
                    </p>
                    <p className="mt-4 max-w-xl text-dim">{data.personal.tagline}</p>

                    <div className="mt-10 flex flex-wrap gap-5">
                        {data.hero.cta.map((b) => {
                            const primary = b.variant === "primary";
                            const p = primary ? ">" : "$";
                            return (
                                <a key={b.text} href={b.href} download={b.download} className={primary ? "btn btn--primary diya" : "btn"}>
                                    <Scramble hover en={`${p} ${toCommand(b.text)}`} hi={`${p} ${b.textHi}`} />
                                </a>
                            );
                        })}
                    </div>
                </div>

                <Hero3D />
            </div>
        </section>
    );
};
