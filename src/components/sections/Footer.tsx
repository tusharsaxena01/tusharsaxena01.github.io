"use client";

import React, { useEffect, useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Mandala } from "../fx/Motifs";

const hms = (s: number) =>
    [s / 3600, (s % 3600) / 60, s % 60].map((n) => String(Math.floor(n)).padStart(2, "0")).join(":");

export const Footer = () => {
    const { data } = usePortfolioData();
    const [uptime, setUptime] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setUptime((u) => u + 1), 1000);
        return () => clearInterval(id);
    }, []);

    const socials = Object.entries(data.social).filter(([, href]) => href);

    return (
        <footer className="relative z-10 overflow-hidden">
            <div className="tricolor" aria-hidden />
            <Mandala className="pointer-events-none absolute -right-24 -top-24 h-72 w-72" />
            <div className="relative mx-auto max-w-[1200px] px-4 pb-10 pt-10 sm:px-6">
                <p aria-hidden className="overflow-hidden whitespace-nowrap text-line">{"─═".repeat(120)}</p>
                <div className="meta mt-6 flex flex-wrap items-center justify-between gap-4">
                    <span>© {new Date().getFullYear()} {data.personal.name} {"//"} {data.footer.text}</span>
                    <span className="flex gap-4">
                        {socials.map(([name, href]) => (
                            <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="text-marigold hover:text-saffron">./{name}</a>
                        ))}
                    </span>
                    <span className="tabular-nums">session_uptime <span className="text-marigold">{hms(uptime)}</span></span>
                </div>
            </div>
        </footer>
    );
};
