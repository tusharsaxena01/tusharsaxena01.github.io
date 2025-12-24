"use client";

import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { cn } from "@/utils/cn";
import gsap from "gsap";

interface TerminalLine {
    type: 'command' | 'output' | 'error';
    content: string;
}

interface TerminalProps {
    initialMessage?: string[];
    className?: string;
}

const commands: Record<string, () => string | string[]> = {
    help: () => [
        "Available commands:",
        "  help       - Show this help message",
        "  about      - Learn more about me",
        "  skills     - View my technical skills",
        "  contact    - Get my contact information",
        "  projects   - List my projects",
        "  experience - View work experience",
        "  clear      - Clear the terminal",
        "  date       - Show current date and time",
        "  whoami     - Display user information",
    ],
    about: () => [
        "Hi! I'm Abhi Saxena, a passionate Full Stack Developer.",
        "I love building modern web applications with cutting-edge technologies.",
        "Currently working at Tranzita Systems, crafting scalable solutions.",
    ],
    skills: () => [
        "Technical Skills:",
        "  • Frontend: React, Next.js, TypeScript, TailwindCSS",
        "  • Backend: Node.js, Express, NestJS",
        "  • Database: PostgreSQL, MongoDB, Redis",
        "  • Tools: Git, Docker, GSAP, Framer Motion",
    ],
    contact: () => [
        "Contact Information:",
        "  • Email: abhi@example.com",
        "  • GitHub: github.com/abhisaxena",
        "  • LinkedIn: linkedin.com/in/abhisaxena",
    ],
    projects: () => [
        "Featured Projects:",
        "  1. E-commerce Platform - Full-stack solution with Next.js",
        "  2. Task Management App - Real-time collaboration tool",
        "  3. Portfolio Website - You're looking at it! 🎨",
    ],
    experience: () => [
        "Work Experience:",
        "  • Tranzita Systems (2023 - Present)",
        "    Software Developer",
        "  • Freelance (2021 - 2023)",
        "    Full Stack Developer",
    ],
    date: () => new Date().toLocaleString(),
    whoami: () => "abhi@portfolio - Full Stack Developer",
    clear: () => "",
};

export const Terminal: React.FC<TerminalProps> = ({
    initialMessage = ["Welcome to my interactive terminal!", "Type 'help' to see available commands."],
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const [history, setHistory] = useState<TerminalLine[]>([]);
    const [currentInput, setCurrentInput] = useState("");
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => setIsInitialized(true),
            });

            initialMessage.forEach((line, index) => {
                tl.to({}, {
                    duration: 0.5,
                    onStart: () => {
                        setHistory((prev) => [...prev, { type: 'output', content: line }]);
                    }
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [initialMessage]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [history]);

    // Handle ESC key to deactivate terminal
    useEffect(() => {
        const handleEscape = (e: globalThis.KeyboardEvent) => {
            if (e.key === "Escape" && isActive) {
                setIsActive(false);
                setCurrentInput("");
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isActive]);

    // Handle click outside to deactivate terminal
    useEffect(() => {
        const handleClickOutside = (e: globalThis.MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node) && isActive) {
                setIsActive(false);
                setCurrentInput("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isActive]);

    const executeCommand = (cmd: string) => {
        const trimmedCmd = cmd.trim().toLowerCase();

        if (trimmedCmd === "") return;

        // Add command to history
        setHistory(prev => [...prev, { type: 'command', content: cmd }]);
        setCommandHistory(prev => [...prev, cmd]);

        if (trimmedCmd === "clear") {
            setHistory([]);
            return;
        }

        // Execute command
        if (commands[trimmedCmd]) {
            const output = commands[trimmedCmd]();
            if (Array.isArray(output)) {
                output.forEach(line => {
                    setHistory(prev => [...prev, { type: 'output', content: line }]);
                });
            } else if (output) {
                setHistory(prev => [...prev, { type: 'output', content: output }]);
            }
        } else {
            setHistory(prev => [...prev, {
                type: 'error',
                content: `Command not found: ${trimmedCmd}. Type 'help' for available commands.`
            }]);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Stop propagation to prevent page navigation
        e.stopPropagation();

        if (e.key === "Enter") {
            executeCommand(currentInput);
            setCurrentInput("");
            setHistoryIndex(-1);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
                setHistoryIndex(newIndex);
                setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
            } else {
                setHistoryIndex(-1);
                setCurrentInput("");
            }
        }
    };

    const focusInput = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isActive) {
            setIsActive(true);
        }
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "rounded-lg border border-slate-800 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-sm font-mono text-sm sm:text-base",
                className
            )}
            onClick={focusInput}
        >
            <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2 items-center">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                {/* <span className="ml-2 text-xs text-slate-500">abhi@portfolio:~</span> */}
                <span className="ml-2 text-xs text-slate-500">Terminal</span>
            </div>

            <div
                ref={outputRef}
                className="space-y-1 text-slate-300 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
            >
                {history.map((line, i) => (
                    <div key={i} className="flex flex-col">
                        {line.type === 'command' ? (
                            <div className="flex">
                                <span className="mr-2 text-sky-400">&gt;</span>
                                <span className="text-green-400">{line.content}</span>
                            </div>
                        ) : (
                            <div className={cn(
                                "flex",
                                line.type === 'error' && "text-red-400"
                            )}>
                                <span className="mr-2 text-sky-400">abhi@portfolio:~$</span>
                                {line.content}
                            </div>
                        )}
                    </div>
                ))}

                {isInitialized && isActive && (
                    <div className="flex items-center">
                        <span className="mr-2 text-sky-400">abhi@portfolio:~$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent outline-none text-slate-300 caret-sky-400"
                            autoFocus
                            spellCheck={false}
                        />
                        <span className="animate-pulse text-sky-400">_</span>
                    </div>
                )}

                {isInitialized && !isActive && (
                    <div className="flex items-center cursor-pointer hover:text-sky-300 transition-colors mt-4"
                    >
                        <span className="mr-2 text-sky-400">&gt;</span>
                        <span className="animate-pulse mr-2">_</span>
                        <span className="text-xs text-slate-500 opacity-70">(Click to interact)</span>
                    </div>
                )}
            </div>
        </div>
    );
};
