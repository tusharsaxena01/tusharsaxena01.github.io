"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import gsap from "gsap";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export const Navbar = () => {
    const { data } = usePortfolioData();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const toggleMenu = () => {
        if (!mobileMenuOpen) {
            // Scroll to top to ensure menu is properly positioned
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setMobileMenuOpen(true);
            gsap.fromTo(".mobile-menu-item",
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }
            );
        } else {
            gsap.to(".mobile-menu-item", {
                x: 50, opacity: 0, duration: 0.3, stagger: 0.05, ease: "power2.in",
                onComplete: () => setMobileMenuOpen(false)
            });
        }
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled
                    ? "bg-slate-950/80 backdrop-blur-md border-slate-800 py-3 sm:py-4"
                    : "bg-transparent py-4 sm:py-6"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
                <div className="font-mono font-bold text-lg sm:text-xl tracking-tighter text-sky-400 z-50 relative touch-manipulation">
                    <a href="/">
                        &lt;{data.personal.initials} /&gt;
                    </a>
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-6 lg:gap-8">
                    {data.navbar.links.map((item, index) => (
                        <li key={item.name}>
                            <a
                                href={item.href}
                                className="group flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                            >
                                <span className="text-sky-500 opacity-100 group-hover:opacity-0 transition-opacity font-mono text-xs">
                                    [{item.name.charAt(0).toUpperCase()}]
                                </span>
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-slate-400 z-50 relative focus:outline-none touch-manipulation px-2 py-1 text-sm sm:text-base"
                    onClick={toggleMenu}
                >
                    {mobileMenuOpen ? "Close" : "Menu"}
                </button>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="fixed top-0 left-0 right-0 bottom-0 bg-slate-950/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-6 sm:space-y-8 md:hidden overflow-hidden">
                        {data.navbar.links.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="mobile-menu-item text-xl sm:text-2xl font-bold text-white hover:text-sky-400 transition-colors touch-manipulation"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};
