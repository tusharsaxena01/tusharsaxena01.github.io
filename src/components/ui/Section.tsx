import React from "react";
import { cn } from "@/utils/cn";
import { devaDigits } from "@/utils/scramble";
import { Scramble } from "../fx/Scramble";
import { LotusDivider } from "../fx/Motifs";

interface SectionProps {
    id: string;
    index: string;
    title: string;
    titleHi: string;
    label: string;
    /** Alternate band: lighter surface with jaali texture. */
    alt?: boolean;
    children: React.ReactNode;
}

export const Section = ({ id, index, title, titleHi, label, alt, children }: SectionProps) => (
    <>
        <LotusDivider />
        <section id={id} className={cn("px-4 py-24 sm:px-6", alt && "jaali-bg bg-[rgba(20,16,32,.6)]")}>
            <div className="mx-auto max-w-[1200px]">
                <div className="reveal mb-12 sm:mb-16">
                    <p className="meta mb-3">
                        <Scramble en={`[ ${devaDigits(index)} ]`} className="text-marigold" /> {"//"} {label}
                    </p>
                    <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight">
                        <Scramble glitch en={title} hi={titleHi} />
                    </h2>
                </div>
                {children}
            </div>
        </section>
    </>
);
