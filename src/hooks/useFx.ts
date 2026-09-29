"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/utils/motion";

// Page-wide: scroll reveal for `.reveal` children (§5.6) and pointer tilt for `.tilt` cards (§5.7).
export const useFx = () => {
    useEffect(() => {
        const io = new IntersectionObserver((entries) => entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        }), { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });
        document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
            Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(i)));
            io.observe(el);
        });

        if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches || window.innerWidth < 768) {
            return () => io.disconnect();
        }

        const set = (el: HTMLElement, rx: number, ry: number, mx: number, my: number) => {
            el.style.setProperty("--rx", `${rx}deg`);
            el.style.setProperty("--ry", `${ry}deg`);
            el.style.setProperty("--mx", `${mx}%`);
            el.style.setProperty("--my", `${my}%`);
        };
        const move = (e: PointerEvent) => {
            const el = e.currentTarget as HTMLElement, r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
            set(el, (0.5 - py) * 16, (px - 0.5) * 16, px * 100, py * 100);
        };
        const leave = (e: PointerEvent) => set(e.currentTarget as HTMLElement, 0, 0, 50, 50);
        const cards = document.querySelectorAll<HTMLElement>(".tilt");
        cards.forEach((c) => { c.addEventListener("pointermove", move); c.addEventListener("pointerleave", leave); });

        return () => {
            io.disconnect();
            cards.forEach((c) => { c.removeEventListener("pointermove", move); c.removeEventListener("pointerleave", leave); });
        };
    }, []);
};
