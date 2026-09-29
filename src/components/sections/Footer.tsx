"use client";

import React, { useEffect, useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

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
        <footer className="relative z-10 px-4 pb-10 sm:px-6">
            <div className="mx-auto max-w-[1200px]">
                <p aria-hidden className="overflow-hidden whitespace-nowrap text-green-dim opacity-60">{"─".repeat(240)}</p>
                <div className="meta mt-6 flex flex-wrap items-center justify-between gap-4">
                    <span>© {new Date().getFullYear()} {data.personal.name} {"//"} {data.footer.text}</span>
                    <span className="flex gap-4">
                        {socials.map(([name, href]) => (
                            <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-green">./{name}</a>
                        ))}
                    </span>
                    <span className="tabular-nums">session_uptime {hms(uptime)}</span>
                </div>
            </div>
        </footer>
    );
};
