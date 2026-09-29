"use client";

import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/utils/motion";

// Corner-bracket crosshair (§5.9). Native cursor is only hidden once this mounts on a fine pointer.
export const Cursor = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!window.matchMedia("(pointer: fine)").matches) return;
        const root = document.documentElement;
        root.classList.add("has-cursor");
        const el = ref.current!;
        const ease = prefersReducedMotion() ? 1 : 0.25;
        let x = -100, y = -100, cx = -100, cy = -100, raf = 0;

        const move = (e: PointerEvent) => {
            x = e.clientX; y = e.clientY;
            el.classList.toggle("is-hover", !!(e.target as Element).closest?.("a,button,input,textarea,label,.tilt"));
        };
        const loop = () => {
            cx += (x - cx) * ease; cy += (y - cy) * ease;
            el.style.transform = `translate3d(${cx}px,${cy}px,0)`;
            raf = requestAnimationFrame(loop);
        };
        window.addEventListener("pointermove", move);
        raf = requestAnimationFrame(loop);
        return () => {
            root.classList.remove("has-cursor");
            window.removeEventListener("pointermove", move);
            cancelAnimationFrame(raf);
        };
    }, []);

    return <div ref={ref} className="cursor" aria-hidden><span className="frame" /></div>;
};
