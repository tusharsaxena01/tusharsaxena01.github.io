"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

type Status = "idle" | "submitting" | "success" | "error";

export const Contact = () => {
    const { data } = usePortfolioData();
    const container = useRef<HTMLDivElement | null>(null);
    const [status, setStatus] = useState<Status>("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await fetch("https://formspree.io/f/xvojdryj", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json"
                }
            });

            if (!res.ok) throw new Error("Form submission failed");

            setStatus("success");
            form.reset();
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    useGSAP(
        () => {
            if (status === "success") {
                gsap.to(".contact-form", {
                    opacity: 0,
                    height: 0,
                    duration: 0.5,
                    ease: "power2.inOut"
                });

                gsap.fromTo(
                    ".success-message",
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, delay: 0.5 }
                );
            }
        },
        { dependencies: [status] }
    );

    return (
        <section
            id="contact"
            ref={container}
            className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-20 max-w-4xl mx-auto text-center"
        >
            <div className="mb-8 sm:mb-12">
                <p className="text-sky-500 font-mono mb-3 sm:mb-4 text-sm sm:text-base">
                    {data.contact.sectionNumber}. {data.contact.subtitle}
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                    {data.contact.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
                    {data.contact.description}
                </p>
            </div>

            {status !== "success" ? (
                <form
                    onSubmit={handleSubmit}
                    className="contact-form space-y-3 sm:space-y-4 max-w-md mx-auto text-left"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-xs sm:text-sm font-mono text-slate-400 mb-2"
                        >
                            Your email
                        </label>
                        <input
                            required
                            type="email"
                            name="email"
                            id="email"
                            className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-sm sm:text-base text-white focus:border-sky-500 outline-none transition-colors touch-manipulation"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="message"
                            className="block text-xs sm:text-sm font-mono text-slate-400 mb-2"
                        >
                            Your message
                        </label>
                        <textarea
                            required
                            name="message"
                            id="message"
                            rows={4}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-sm sm:text-base text-white focus:border-sky-500 outline-none transition-colors touch-manipulation resize-none"
                            placeholder="Hello world..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full py-3 sm:py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base"
                    >
                        {status === "submitting" ? "Sending..." : "Send Message"}
                    </button>

                    {status === "error" && (
                        <p className="text-red-400 font-mono text-xs sm:text-sm">
                            Something went wrong. Please try again.
                        </p>
                    )}
                </form>
            ) : (
                <div className="success-message p-6 sm:p-8 border border-green-500/30 bg-green-500/10 rounded text-green-400 font-mono text-sm sm:text-base">
                    <p>&gt; Message transmission successful.</p>
                    <p>&gt; I will get back to you shortly.</p>
                </div>
            )}

            <div className="my-8 sm:my-10">
                <a
                    href={`mailto:${data.personal.email}`}
                    className="font-mono text-xs sm:text-sm text-slate-500 hover:text-sky-400 transition-colors"
                >
                    {data.personal.email}
                </a>
            </div>
        </section>
    );
};
