"use client";

import Link from "next/link";
import FuzzyText from "@/components/ui/FuzzyText";
import { GridBackground } from "@/components/ui/GridBackground";

export default function NotFound() {
    return (
        <main className="min-h-screen relative flex flex-col items-center justify-center bg-slate-950 text-gray-200 overflow-hidden">
            <GridBackground />

            <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                <FuzzyText
                    fontSize="clamp(4rem, 20vw, 12rem)"
                    fontWeight={900}
                    color="#38bdf8"
                    glitchMode={true}
                    glitchInterval={3000}
                    glitchDuration={300}
                    baseIntensity={0.2}
                    hoverIntensity={0.8}
                    fuzzRange={40}
                    className="mb-8"
                >
                    404
                </FuzzyText>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 font-mono">
                    &lt;Page Not Found /&gt;
                </h1>

                <p className="text-slate-400 text-sm sm:text-base md:text-lg mb-8 max-w-md">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <Link
                    href="/"
                    className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded transition-colors font-mono text-sm sm:text-base"
                >
                    &lt; Back to Home /&gt;
                </Link>

                <div className="mt-12 text-slate-600 font-mono text-xs sm:text-sm">
                    <p>&gt; Error Code: 404</p>
                    <p>&gt; Status: Not Found</p>
                </div>
            </div>
        </main>
    );
}
