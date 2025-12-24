"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useKeyboard = () => {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.key.toLowerCase()) {
                case 'a':
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'p':
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 's':
                    document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'e':
                    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'c':
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'h':
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);
};
