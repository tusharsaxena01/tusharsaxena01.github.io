"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import gsap from "gsap";
import { usePortfolioData } from "@/hooks/usePortfolioData";

interface HistoryLine {
    type: 'command' | 'output' | 'error';
    content: string;
}

interface TerminalProps {
    initialMessage?: string[];
    className?: string;
    isModalOpen?: boolean;
    onClose?: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({
    initialMessage = ["Welcome to my interactive terminal!", "Type 'help' to see available commands."],
    className,
    isModalOpen = false,
    onClose,
}) => {
    const { data } = usePortfolioData();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const [history, setHistory] = useState<HistoryLine[]>([]);
    const [currentInput, setCurrentInput] = useState("");
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Build commands object from JSON data
    const commands: Record<string, () => string | string[]> = {
        help: () => data.terminal.commands.help,
        about: () => data.terminal.commands.about,
        skills: () => data.terminal.commands.skills,
        contact: () => data.terminal.commands.contact,
        projects: () => data.terminal.commands.projects,
        experience: () => data.terminal.commands.experience,
        date: () => new Date().toLocaleString(),
        whoami: () => data.terminal.commands.whoami as string,
        clear: () => "",
    };

    useEffect(() => {
        // Only run once on mount to prevent messages from repeating
        if (history.length > 0) return;

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
    }, []); // Empty dependency array to run only once

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [history]);

    // Handle ESC key to deactivate terminal or close modal
    useEffect(() => {
        const handleEscape = (e: globalThis.KeyboardEvent) => {
            if (e.key === "Escape") {
                if (isModalOpen && onClose) {
                    onClose();
                } else if (isActive) {
                    setIsActive(false);
                    setCurrentInput("");
                }
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isActive, isModalOpen, onClose]);

    // Handle click outside to deactivate terminal (only when not in modal mode)
    useEffect(() => {
        const handleClickOutside = (e: globalThis.MouseEvent) => {
            if (!isModalOpen && containerRef.current && !containerRef.current.contains(e.target as Node) && isActive) {
                setIsActive(false);
                setCurrentInput("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isActive, isModalOpen]);

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

        // Handle exit command to close modal
        if (trimmedCmd === "exit") {
            if (isModalOpen && onClose) {
                onClose();
            } else {
                setHistory(prev => [...prev, {
                    type: 'output',
                    content: "Exit command only works in modal mode."
                }]);
            }
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

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClose) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    const terminalContent = (
        <div
            ref={containerRef}
            className={cn(
                "rounded-lg border border-slate-800 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-sm font-mono text-sm sm:text-base",
                isModalOpen && "w-full max-w-4xl mx-auto",
                className
            )}
            onClick={focusInput}
        >
            <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2 items-center">
                <div
                    className="h-3 w-3 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-400 transition-colors"
                    onClick={handleClose}
                    title="Close"
                />
                <div
                    className="h-3 w-3 rounded-full bg-yellow-500/80 cursor-pointer hover:bg-yellow-400 transition-colors"
                    onClick={handleClose}
                    title="Minimize"
                />
                <div
                    className="h-3 w-3 rounded-full bg-green-500/80 cursor-pointer hover:bg-green-400 transition-colors"
                    onClick={handleClose}
                    title="Maximize"
                />
                <span className="ml-2 text-xs text-slate-500 flex-1">Terminal</span>
            </div>

            <div
                ref={outputRef}
                className={cn(
                    "space-y-1 text-slate-300 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent",
                    isModalOpen ? "max-h-[60vh]" : "max-h-96"
                )}
            >
                {history.map((line, i) => (
                    <div key={i} className="flex flex-col">
                        {line.type === 'command' ? (
                            <div className="flex">
                                <span className="mr-2 text-sky-400">abhi@portfolio:~$</span>
                                <span className="text-green-400">{line.content}</span>
                            </div>
                        ) : (
                            <div className={cn(
                                "ml-1",
                                line.type === 'error' && "text-red-400"
                            )}>
                                {line.content}
                            </div>
                        )}
                    </div>
                ))}

                {isInitialized && isActive && (
                    <div className="flex items-center">
                        <span className="mr-2 text-sky-400">abhi@portfolio:~$</span>
                        <div className="flex-1 flex items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                value={currentInput}
                                onChange={(e) => setCurrentInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="bg-transparent outline-none text-slate-300 caret-transparent"
                                style={{ width: `${Math.max(1, currentInput.length)} ch` }}
                                autoFocus
                                spellCheck={false}
                            />
                            <span className="animate-pulse text-sky-400 ml-0">_</span>
                        </div>
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

    if (isModalOpen) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={handleBackdropClick}
            >
                {terminalContent}
            </div>
        );
    }

    return terminalContent;
};
