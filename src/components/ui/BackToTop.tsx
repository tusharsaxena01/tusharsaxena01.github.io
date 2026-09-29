"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 500);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <a
            href="#top"
            aria-label="Back to top"
            className={cn(
                "btn fixed bottom-6 right-6 z-50 px-3 py-2 text-xs text-green transition-opacity",
                !visible && "pointer-events-none opacity-0"
            )}
        >
            ↑ top
        </a>
    );
};
