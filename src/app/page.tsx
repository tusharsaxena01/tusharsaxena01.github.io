"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Telemetry } from "@/components/sections/Telemetry";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { BackToTop } from "@/components/ui/BackToTop";
import { BootLoader } from "@/components/fx/BootLoader";
import { Backdrop } from "@/components/fx/Backdrop";
import { Cursor } from "@/components/fx/Cursor";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useFx } from "@/hooks/useFx";
import { LangProvider } from "@/hooks/useLang";

export default function Home() {
  useKeyboard();
  useFx();
  const [booted, setBooted] = useState(false);

  return (
    <LangProvider>
      <BootLoader onDone={() => setBooted(true)} />
      <Backdrop />
      <Cursor />
      <Navbar />
      <main className="relative z-10">
        <Hero booted={booted} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Telemetry />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </LangProvider>
  );
}
