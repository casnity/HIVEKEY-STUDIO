"use client";

import { motion, useScroll } from "motion/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0A0000]/75 backdrop-blur-md border-b border-[#FF0000]/20 py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="text-white font-semibold tracking-tight text-lg">
          Hive 65
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/60">
          <a href="#overview" onClick={(e) => handleScroll(e, 'overview')} className="hover:text-white transition-colors cursor-pointer">
            Overview
          </a>
          <a href="#technology" onClick={(e) => handleScroll(e, 'technology')} className="hover:text-white transition-colors cursor-pointer">
            Technology
          </a>
          <a href="#design" onClick={(e) => handleScroll(e, 'design')} className="hover:text-white transition-colors cursor-pointer">
            Design
          </a>
          <a href="#specs" onClick={(e) => handleScroll(e, 'specs')} className="hover:text-white transition-colors cursor-pointer">
            Specs
          </a>
        </div>

        <div>
          <a href="#buy" onClick={(e) => handleScroll(e, 'buy')} className="relative overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 group block cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A00] via-[#FF2E00] to-[#B30000] opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 shadow-[0_0_20px_rgba(255,106,0,0.25)]" />
            <span className="relative z-10">Experience Hive 65</span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
