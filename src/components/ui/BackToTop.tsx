"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import gsap from "gsap";

export const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={cn(
                "fixed bottom-8 right-8 z-50 p-3 rounded-full bg-slate-800 border border-slate-700 text-sky-400 shadow-lg shadow-sky-500/10 hover:bg-slate-700 hover:text-white transition-all duration-300",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
            )}
            aria-label="Back to Top"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
        </button>
    );
};
