"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useLang } from "@/hooks/useLang";
import { Scramble } from "../fx/Scramble";

export const Navbar = () => {
    const { data } = usePortfolioData();
    const { lang, setLang } = useLang();
    const [open, setOpen] = useState(false);
    const resume = data.hero.cta.find((c) => c.variant === "primary");
    const logo = data.personal.name.split(" ")[0].toUpperCase();

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const links = data.navbar.links.map((l) => ({
        href: l.href,
        en: `./${l.name.toLowerCase()}`,
        hi: `./${l.nameHi}`,
    }));

    const toggle = (
        <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="btn px-3 py-2 text-xs"
            aria-label={lang === "en" ? "हिंदी में देखें" : "View in English"}
        >
            [ <span className={cn(lang === "en" ? "text-saffron" : "text-dim")}>EN</span> |{" "}
            <span lang="hi" className={cn(lang === "hi" ? "text-saffron" : "text-dim")}>हिं</span> ]
        </button>
    );

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-[rgba(12,10,18,.75)] backdrop-blur-[8px]">
                <div className="tricolor" aria-hidden />
                <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    <a href="#top" className="glitch font-display text-xl font-bold tracking-wider text-ivory" data-text={`${logo}//OS`}>
                        {logo}<span className="text-saffron">{"//"}</span>OS
                    </a>

                    <ul className="hidden items-center gap-6 text-sm lg:flex">
                        {links.map((l) => (
                            <li key={l.href}>
                                <a href={l.href} className="text-ink transition-colors hover:text-saffron">
                                    <Scramble hover en={l.en} hi={l.hi} />
                                </a>
                            </li>
                        ))}
                        <li>{toggle}</li>
                        {resume && (
                            <li>
                                <a href={resume.href} download={resume.download} className="btn btn--primary">
                                    <Scramble hover en="[ RESUME ]" hi="[ रिज़्यूमे ]" />
                                </a>
                            </li>
                        )}
                    </ul>

                    <div className="flex items-center gap-3 lg:hidden">
                        {toggle}
                        <button className="btn px-3 py-2 text-xs" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu">
                            {open ? "[ EXIT ]" : "[ MENU ]"}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Sibling of <header>: its backdrop-filter would otherwise trap this fixed overlay inside the bar. */}
            {open && (
                <div id="mobile-menu" className="jaali-bg fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-bg-0 px-8 lg:hidden">
                    <p className="meta">{"// select destination"}</p>
                    {links.map((l) => (
                        <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-2xl text-ivory hover:text-saffron">
                            <span className="text-marigold">$</span> cd <Scramble en={l.en} hi={l.hi} />
                        </a>
                    ))}
                    {resume && (
                        <a href={resume.href} download={resume.download} className="btn btn--primary diya mt-4 self-start">[ RESUME ]</a>
                    )}
                </div>
            )}
        </>
    );
};
