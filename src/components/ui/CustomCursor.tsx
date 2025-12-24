"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/utils/cn";

export const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if device is mobile/tablet
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        if (isMobile) {
            return () => window.removeEventListener('resize', checkMobile);
        }

        // Hide default cursor only on desktop
        document.body.style.cursor = 'none';
        // Ensure all interactive elements can receive pointer events
        document.body.style.pointerEvents = 'auto';

        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursorRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0,
            });
            gsap.to(followerRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: "power2.out"
            });

            // Check for hover state
            const target = e.target as HTMLElement;
            const isClickable = target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('cursor-pointer') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsHovering(!!isClickable);
        };

        const handleMouseDown = () => {
            gsap.to([cursorRef.current, followerRef.current], { scale: 0.8, duration: 0.1 });
        };

        const handleMouseUp = () => {
            gsap.to([cursorRef.current, followerRef.current], { scale: 1, duration: 0.1 });
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.body.style.cursor = 'auto';
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener('resize', checkMobile);
        };
    }, [isMobile]);

    // Don't render custom cursor on mobile devices
    if (isMobile) {
        return null;
    }

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-sky-400 rounded-full z-[9999] -translate-x-1/2 -translate-y-1/2"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
            />
            <div
                ref={followerRef}
                className={cn(
                    "fixed top-0 left-0 rounded-full border-2 border-sky-400/60 z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out will-change-transform",
                    isHovering ? "w-12 h-12 bg-sky-400/10" : "w-8 h-8"
                )}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
            />
        </>
    );
};
