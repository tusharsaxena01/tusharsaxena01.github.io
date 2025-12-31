"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to detect screen size and device capabilities
 */
export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        // Set initial value
        setMatches(media.matches);

        // Create event listener
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

        // Add listener
        media.addEventListener("change", listener);

        // Cleanup
        return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
};

/**
 * Hook to detect if device is mobile (< 768px)
 */
export const useIsMobile = (): boolean => {
    return useMediaQuery("(max-width: 767px)");
};

/**
 * Hook to detect if device is tablet (768px - 1023px)
 */
export const useIsTablet = (): boolean => {
    return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
};

/**
 * Hook to detect if device is desktop (>= 1024px)
 */
export const useIsDesktop = (): boolean => {
    return useMediaQuery("(min-width: 1024px)");
};

/**
 * Hook to detect if device supports touch
 */
export const useIsTouchDevice = (): boolean => {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const checkTouch = () => {
            return (
                "ontouchstart" in window ||
                navigator.maxTouchPoints > 0 ||
                // @ts-ignore - msMaxTouchPoints is IE specific
                navigator.msMaxTouchPoints > 0
            );
        };

        setIsTouch(checkTouch());
    }, []);

    return isTouch;
};
