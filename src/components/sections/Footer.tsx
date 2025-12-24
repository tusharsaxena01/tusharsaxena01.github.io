"use client";

import React from "react";

export const Footer = () => {
    return (
        <footer className="py-8 text-center bg-slate-950 border-t border-slate-900 text-slate-500 text-sm font-light">
            <div className="mb-4 flex justify-center gap-6">
                {/* Social Icons Placeholder */}
                <a href="#" className="hover:text-sky-400 transition-colors">GitHub</a>
                <a href="#" className="hover:text-sky-400 transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-sky-400 transition-colors">Twitter</a>
            </div>
            <p className="font-mono text-xs">Based on designs by Antigravity</p>
        </footer>
    );
}
