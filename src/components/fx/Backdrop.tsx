"use client";

import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/utils/motion";

const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF";
const FS = 16;

// Fixed full-page layers: matrix code rain (§5.4), depth particles (§5.5), CRT overlay (§5.8).
export const Backdrop = () => {
    const rainRef = useRef<HTMLCanvasElement>(null);
    const dustRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;
        const rain = rainRef.current!, dust = dustRef.current!;
        const rc = rain.getContext("2d")!, dc = dust.getContext("2d")!;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const mobile = window.innerWidth < 768;
        let w = 0, h = 0, drops: number[] = [], speeds: number[] = [];

        const particles = Array.from({ length: mobile ? 40 : 90 }, (_, i) => ({
            x: Math.random(), y: Math.random(), depth: [0.15, 0.4, 0.8][i % 3],
        }));

        const resize = () => {
            w = window.innerWidth; h = window.innerHeight;
            for (const c of [rain, dust]) { c.width = w * dpr; c.height = h * dpr; }
            rc.setTransform(dpr, 0, 0, dpr, 0, 0);
            dc.setTransform(dpr, 0, 0, dpr, 0, 0);
            rc.font = `${FS}px monospace`;
            const n = Math.ceil(w / FS);
            drops = Array.from({ length: n }, () => Math.random() * -h / FS);
            speeds = Array.from({ length: n }, () => 0.4 + Math.random() * 0.6);
        };
        resize();
        window.addEventListener("resize", resize);

        let raf = 0, last = 0, drift = 0;
        const loop = (t: number) => {
            raf = requestAnimationFrame(loop);
            if (document.hidden) return;

            // Rain at ~30fps: fade old glyphs out, demote the previous head, draw the new bright head.
            if (t - last > 33) {
                last = t;
                rc.globalCompositeOperation = "destination-out";
                rc.fillStyle = "rgba(0,0,0,.08)";
                rc.fillRect(0, 0, w, h);
                rc.globalCompositeOperation = "source-over";
                drops.forEach((d, i) => {
                    const prev = Math.floor(d), next = Math.floor(d + speeds[i]);
                    if (next !== prev) {
                        const ch = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
                        rc.fillStyle = "#00b36e";
                        rc.fillText(ch(), i * FS, prev * FS);
                        rc.fillStyle = "#b8ffe0";
                        rc.fillText(ch(), i * FS, next * FS);
                    }
                    drops[i] = next * FS > h && Math.random() > 0.975 ? Math.random() * -20 : d + speeds[i];
                });
            }

            // Particles: three depth layers with scroll parallax.
            drift += 0.0002;
            dc.clearRect(0, 0, w, h);
            const sy = window.scrollY;
            for (const p of particles) {
                const y = ((((p.y - drift * p.depth) * h - sy * p.depth) % h) + h) % h;
                dc.globalAlpha = 0.15 + p.depth * 0.5;
                dc.fillStyle = "#cfe8dc";
                const r = 0.6 + p.depth * 1.4;
                dc.fillRect(p.x * w, y, r, r);
            }
        };
        raf = requestAnimationFrame(loop);
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    }, []);

    return (
        <>
            <canvas ref={rainRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[.12]" />
            <canvas ref={dustRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
            <div aria-hidden className="crt" />
        </>
    );
};
