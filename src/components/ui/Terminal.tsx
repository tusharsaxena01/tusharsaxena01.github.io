"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn"; // Will create utils/cn later or inline it
import gsap from "gsap";

interface TerminalProps {
    initialMessage?: string[];
    className?: string;
    trigger?: string; // Optional ScrollTrigger ID
}

export const Terminal: React.FC<TerminalProps> = ({
    initialMessage = ["Initializing system...", "Loading profile..."],
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [lines, setLines] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => setIsTyping(false),
            });

            // Simple staggered typing simulation
            // In a real typing effect, we'd animate character by character.
            // For now, we'll reveal line by line quickly.

            const newLines = [...initialMessage];
            newLines.forEach((line, index) => {
                tl.to({}, {
                    duration: 0.5, onStart: () => {
                        setLines((prev) => [...prev, line]);
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, [initialMessage]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "rounded-lg border border-slate-800 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-sm font-mono text-sm sm:text-base",
                className
            )}
        >
            <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2 items-center">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-slate-500">guest@tranzita-systems:~</span>
            </div>

            <div className="space-y-2 text-slate-300">
                {lines.map((line, i) => (
                    <div key={i} className="flex">
                        <span className="mr-2 text-sky-400">➜</span>
                        <span>{line}</span>
                    </div>
                ))}
                {isTyping && (
                    <div className="animate-pulse text-sky-400">_</div>
                )}
                {!isTyping && (
                    <div
                        className="flex items-center cursor-pointer hover:text-sky-300 transition-colors"
                        onClick={() => {
                            const commands = ["uptime", "whoami", "ls -la", "date", "cat profile.json"];
                            const responses = ["Up 1000 days", "guest@portfolio", "drwx------ portfolio", new Date().toLocaleTimeString(), "{ \"status\": \"shipping code\" }"];
                            const idx = Math.floor(Math.random() * commands.length);
                            setLines(prev => [...prev, commands[idx], responses[idx]]);
                        }}
                    >
                        <div className="flex">
                            <span className="mr-2 text-sky-400">➜</span>
                            <span className="animate-pulse">_</span>
                        </div>
                        <span className="ml-2 opacity-50 text-xs text-slate-500">(Click to interact)</span>
                    </div>
                )}
            </div>
        </div>
    );
};
