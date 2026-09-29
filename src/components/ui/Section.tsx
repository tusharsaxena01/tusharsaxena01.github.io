import React from "react";

interface SectionProps {
    id: string;
    index: string;
    title: string;
    label: string;
    children: React.ReactNode;
}

export const Section = ({ id, index, title, label, children }: SectionProps) => (
    <section id={id} className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
            <div className="reveal mb-12 sm:mb-16">
                <p className="meta mb-3"><span className="text-green">[ {index} ]</span> {"//"} {label}</p>
                <h2 className="glitch text-[clamp(1.75rem,4vw,3rem)] leading-tight" data-text={title}>{title}</h2>
            </div>
            {children}
        </div>
    </section>
);
