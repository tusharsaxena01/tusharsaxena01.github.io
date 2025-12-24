"use client";

import { GridBackground } from "@/components/ui/GridBackground";
import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { useKeyboard } from "@/hooks/useKeyboard";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { BackToTop } from "@/components/ui/BackToTop";

export default function Home() {
  useKeyboard();

  return (
    <main className="min-h-screen relative flex flex-col font-sans text-gray-200">
      {/* <CustomCursor /> */}
      <BackToTop />
      <GridBackground />
      <Navbar />

      <div className="container mx-auto">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </div>

      <Footer />
    </main>
  );
}
