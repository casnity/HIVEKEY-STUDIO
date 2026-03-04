"use client";

import { useRef } from "react";
import { useScroll } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { BackgroundGlow } from "@/components/BackgroundGlow";
import { InteractiveKeyboard } from "@/components/InteractiveKeyboard";
import { ScrollSections } from "@/components/ScrollSections";
import { ExperienceSection } from "@/components/ExperienceSection";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className="bg-black text-white min-h-screen selection:bg-[#FF6A00]/30 font-sans">
      <Navbar />
      
      <div ref={containerRef} className="relative h-[400vh]" id="scroll-container">
        {/* Anchor Points for Navigation */}
        <div id="overview" className="absolute top-0 w-full h-10 pointer-events-none" />
        <div id="technology" className="absolute top-[80vh] w-full h-10 pointer-events-none" />
        <div id="design" className="absolute top-[150vh] w-full h-10 pointer-events-none" />
        <div id="specs" className="absolute top-[225vh] w-full h-10 pointer-events-none" />

        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <BackgroundGlow progress={scrollYProgress} />
          
          {/* Interactive 3D Keyboard Model */}
          <InteractiveKeyboard />
          
          <ScrollSections progress={scrollYProgress} />
        </div>
      </div>

      <ExperienceSection />

      <div className="h-32 bg-black flex items-center justify-center border-t border-white/10">
        <p className="text-white/40">© 2026 Flow Hive. All rights reserved.</p>
      </div>
    </main>
  );
}
