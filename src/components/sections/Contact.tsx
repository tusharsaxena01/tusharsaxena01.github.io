"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const Contact = () => {
    const container = useRef(null);
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        // Simulate API call
        setTimeout(() => {
            setStatus("success");
        }, 2000);
    };

    useGSAP(() => {
        if (status === "success") {
            gsap.to(".contact-form", { opacity: 0, height: 0, duration: 0.5, ease: "power2.inOut" });
            gsap.fromTo(".success-message", { opacity: 0, y: 20 }, { opacity: 1, y: 0, delay: 0.5 });
        }
    }, [status]);

    return (
        <section id="contact" ref={container} className="py-6 px-6 lg:px-20 max-w-4xl mx-auto text-center">
            <div className="mb-12">
                <p className="text-sky-500 font-mono mb-4">05. What's Next?</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Get In Touch</h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                    I am currently looking for new opportunities. Whether you have a question or just want to say hi, my inbox is always open.
                </p>
            </div>

            {status !== "success" ? (
                <form onSubmit={handleSubmit} className="contact-form space-y-4 max-w-md mx-auto text-left">
                    <div>
                        <label htmlFor="email" className="block text-sm font-mono text-slate-400 mb-2">Email</label>
                        <input required type="email" id="email" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-sky-500 outline-none transition-colors" placeholder="user@example.com" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-mono text-slate-400 mb-2">Message</label>
                        <textarea required id="message" rows={4} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-sky-500 outline-none transition-colors" placeholder="Hello world..." />
                    </div>
                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === "submitting" ? "Sending..." : "Send Message"}
                    </button>
                </form>
            ) : (
                <div className="success-message p-8 border border-green-500/30 bg-green-500/10 rounded text-green-400 font-mono">
                    <p>&gt; Message transmission successful.</p>
                    <p>&gt; I will get back to you shortly.</p>
                </div>
            )}

            <div className="my-10">
                <a href="mailto:saxena.abhi7007@gmail.com" className="font-mono text-slate-500 hover:text-sky-400 transition-colors">
                    saxena.abhi7007@gmail.com
                </a>
            </div>
        </section>
    );
};
