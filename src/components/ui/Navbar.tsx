"use client";

import React, { useEffect, useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export const Navbar = () => {
    const { data } = usePortfolioData();
    const [open, setOpen] = useState(false);
    const resume = data.hero.cta.find((c) => c.variant === "primary");
    const logo = data.personal.name.split(" ")[0].toUpperCase();

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const links = data.navbar.links.map((l) => ({ ...l, label: `./${l.name.toLowerCase()}` }));

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-[rgba(5,7,10,.7)] backdrop-blur-[8px]">
                <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6">
                    <a href="#top" className="glitch font-display text-lg font-bold tracking-wider" data-text={`${logo}//OS`}>
                        {logo}<span className="text-green">{"//"}</span>OS
                    </a>

                    <ul className="hidden items-center gap-6 text-sm md:flex">
                        {links.map((l) => (
                            <li key={l.href}>
                                <a href={l.href} className="text-dim transition-colors hover:text-green">{l.label}</a>
                            </li>
                        ))}
                        {resume && (
                            <li><a href={resume.href} download={resume.download} className="btn text-green">[ RESUME ]</a></li>
                        )}
                    </ul>

                    <button
                        className="btn px-3 py-2 text-xs md:hidden"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                    >
                        {open ? "[ EXIT ]" : "[ MENU ]"}
                    </button>
                </nav>
            </header>

            {/* Sibling of <header>: its backdrop-filter would otherwise trap this fixed overlay inside the bar. */}
            {open && (
                <div id="mobile-menu" className="fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-bg-0 px-8 md:hidden">
                    <p className="meta">{"// select destination"}</p>
                    {links.map((l) => (
                        <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-2xl hover:text-green">
                            <span className="text-green">$</span> cd {l.label}
                        </a>
                    ))}
                    {resume && (
                        <a href={resume.href} download={resume.download} className="btn mt-4 self-start text-green">[ RESUME ]</a>
                    )}
                </div>
            )}
        </>
    );
};
