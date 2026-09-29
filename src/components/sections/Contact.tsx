"use client";

import React, { useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Section } from "../ui/Section";
import { Typewriter } from "../fx/Typewriter";
import { Scramble } from "../fx/Scramble";

type Status = "idle" | "submitting" | "success" | "error";

const FIELDS = [
    { name: "name", label: "enter_name", type: "text", placeholder: "john doe" },
    { name: "email", label: "enter_email", type: "email", placeholder: "john@example.com" },
] as const;

const inputCls =
    "w-full border-b border-line bg-transparent py-2 text-ink caret-[var(--saffron)] placeholder:text-dim focus:border-saffron focus-visible:outline-none";

export const Contact = () => {
    const { data } = usePortfolioData();
    const [status, setStatus] = useState<Status>("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");
        const form = e.currentTarget;
        try {
            const res = await fetch("https://formspree.io/f/xvojdryj", {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" },
            });
            if (!res.ok) throw new Error("Form submission failed");
            setStatus("success");
            form.reset();
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    const links = [
        { cmd: "mail", label: data.personal.email, href: `mailto:${data.personal.email}` },
        { cmd: "call", label: data.personal.phone, href: `tel:${data.personal.phone}` },
        { cmd: "open", label: "github", href: data.social.github },
        { cmd: "open", label: "linkedin", href: data.social.linkedin },
    ];

    return (
        <Section id="contact" index={data.contact.sectionNumber} title={data.contact.title} titleHi={data.contact.titleHi} label={data.contact.subtitle} alt>
            <div className="reveal grid gap-10 lg:grid-cols-[1fr_1.2fr]">
                <div className="frame p-6 sm:p-8">
                    <span className="frame-label"><Scramble en="[ SYS.०६ ]" /></span>
                    <p className="leading-relaxed">{data.contact.description}</p>
                    <ul className="mt-8 space-y-3 text-sm">
                        {links.map((l) => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    {...(l.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                                    className="group inline-flex gap-2 break-all text-marigold hover:text-saffron"
                                >
                                    <span className="text-marigold">$</span>
                                    <span className="text-dim group-hover:text-saffron">{l.cmd}</span> {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <p className="meta mt-8">{"// response time: 24–48h"}</p>
                </div>

                <div className="frame p-6 sm:p-8">
                    <span className="frame-label"><Scramble en="[ TX.०१ ]" /></span>
                    {status === "success" ? (
                        <p className="text-green" role="status">
                            <Typewriter text="> transmission received. dhanyavaad!" keepCursor />
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {FIELDS.map((f) => (
                                <label key={f.name} className="block">
                                    <span className="text-sm"><span className="text-marigold">&gt;</span> {f.label}:</span>
                                    <input required id={f.name} name={f.name} type={f.type} placeholder={f.placeholder} className={inputCls} />
                                </label>
                            ))}
                            <label className="block">
                                <span className="text-sm"><span className="text-marigold">&gt;</span> enter_message:</span>
                                <textarea required name="message" rows={5} placeholder="hello! i'd like to discuss..." className={`${inputCls} resize-none`} />
                            </label>
                            <button type="submit" disabled={status === "submitting"} className="btn btn--primary diya disabled:opacity-50">
                                {status === "submitting" ? "[ TRANSMITTING... ]" : <Scramble hover en="[ TRANSMIT ]" hi="[ भेजें ]" />}
                            </button>
                            {status === "error" && (
                                <p className="text-sm text-sindoor" role="alert">&gt; error: transmission failed. retry or use mail.</p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </Section>
    );
};
