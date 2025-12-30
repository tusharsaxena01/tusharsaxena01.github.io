"use client";

import React from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export const Footer = () => {
    const { data } = usePortfolioData();

    return (
        <footer className="py-4 text-center bg-slate-950 border-t border-slate-900 text-slate-500 text-sm font-light">
            <div className="mb-2 flex justify-center gap-6">
                <a href={data.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">GitHub</a>
                <a href={data.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">LinkedIn</a>
                <a href={data.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">Twitter</a>
            </div>
            <p>{data.footer.text}</p>
        </footer>
    );
}
