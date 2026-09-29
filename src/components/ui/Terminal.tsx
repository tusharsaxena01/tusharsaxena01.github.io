"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { prefersReducedMotion, sleep } from "@/utils/motion";
import { Scramble } from "../fx/Scramble";

interface Line {
    type: "command" | "output" | "error";
    content: string;
}

const PROMPT = "abhi@portfolio:~$";

// Types `autorun` commands when scrolled into view, then hands the prompt to the visitor.
export const Terminal = ({ autorun = [], className }: { autorun?: string[]; className?: string }) => {
    const { data } = usePortfolioData();
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const [history, setHistory] = useState<Line[]>([]);
    const [input, setInput] = useState("");
    const [ready, setReady] = useState(false);
    const [past, setPast] = useState<string[]>([]);
    const [idx, setIdx] = useState(-1);

    const run = (cmd: string) => {
        const c = cmd.trim().toLowerCase();
        if (!c) return;
        setPast((p) => [...p, cmd]);
        if (c === "clear") return setHistory([]);
        const out =
            c === "date" ? new Date().toLocaleString()
            : c.startsWith("echo ") ? cmd.trim().slice(5).replace(/^["']|["']$/g, "")
            : c === "status" ? JSON.stringify(data.personal.bio.currentStatus, null, 2).split("\n")
            : data.terminal.commands[c];
        setHistory((h) => [
            ...h,
            { type: "command", content: cmd },
            ...(out === undefined
                ? [{ type: "error" as const, content: `command not found: ${c}. type 'help'.` }]
                : [out].flat().map((content) => ({ type: "output" as const, content }))),
        ]);
    };

    useEffect(() => {
        let dead = false;
        const go = async () => {
            for (const cmd of autorun) {
                if (!prefersReducedMotion()) {
                    for (let n = 1; n <= cmd.length && !dead; n++) {
                        setInput(cmd.slice(0, n));
                        await sleep(45 + Math.random() * 40);
                    }
                    await sleep(200);
                }
                if (dead) return;
                setInput("");
                run(cmd);
            }
            setReady(true);
        };
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { io.disconnect(); go(); }
        }, { threshold: 0.4 });
        io.observe(rootRef.current!);
        return () => { dead = true; io.disconnect(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }, [history]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            run(input);
            setInput("");
            setIdx(-1);
        } else if (e.key === "ArrowUp" && past.length) {
            e.preventDefault();
            const i = Math.min(idx + 1, past.length - 1);
            setIdx(i);
            setInput(past[past.length - 1 - i]);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const i = idx - 1;
            setIdx(Math.max(i, -1));
            setInput(i >= 0 ? past[past.length - 1 - i] : "");
        }
    };

    return (
        <div ref={rootRef} className={cn("frame flex flex-col p-0", className)} onClick={() => inputRef.current?.focus()}>
            <span className="frame-label"><Scramble en="[ TTY.०१ ]" /></span>
            <div className="meta flex justify-between border-b border-line px-5 py-3">
                <span>~/abhi — zsh</span>
                <span className={ready ? "text-green" : ""}>{ready ? "interactive" : "running"}</span>
            </div>
            <div ref={outputRef} className="h-80 space-y-1 overflow-y-auto p-5 text-sm">
                {history.map((l, i) =>
                    l.type === "command" ? (
                        <p key={i} className="break-all"><span className="mr-2 text-marigold">{PROMPT}</span>{l.content}</p>
                    ) : (
                        <p key={i} className={cn("whitespace-pre-wrap break-words", l.type === "error" ? "text-sindoor" : "text-ink")}>
                            {l.content}
                        </p>
                    )
                )}
                <label className="flex gap-2">
                    <span className="shrink-0 text-marigold">{PROMPT}</span>
                    <input
                        ref={inputRef}
                        value={input}
                        readOnly={!ready}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        aria-label="Terminal command, type help"
                        spellCheck={false}
                        autoComplete="off"
                        className="min-w-0 flex-1 bg-transparent caret-[var(--saffron)] outline-none focus-visible:outline-none"
                    />
                </label>
                {ready && history.length < 20 && <p className="meta pt-2">{"// click and type 'help'"}</p>}
            </div>
        </div>
    );
};
