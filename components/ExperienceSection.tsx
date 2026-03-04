"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function ExperienceSection() {
  const [toast, setToast] = useState<string | null>(null);

  const handleAddToCart = () => {
    setToast("Hive 65 added to your cart.");
    setTimeout(() => setToast(null), 3000);
  };

  const handleBuyNow = () => {
    setToast("Proceeding to secure checkout...");
    setTimeout(() => setToast(null), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const cardContainerVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: 0.2,
        staggerChildren: 0.1,
        delayChildren: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <section id="buy" className="relative bg-[#050505] py-32 px-6 border-t border-white/5 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-[#FFF2EB] to-[#FFB08A]">
              Experience<br />Hive 65
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-white/60 mb-12 max-w-md">
              The flagship mechanical keyboard engineered for absolute precision, stability, and flow.
            </motion.p>
            
            <div className="space-y-8 mb-10">
              <motion.div variants={itemVariants} className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10 shrink-0">
                  <svg className="w-5 h-5 text-[#FF6A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h4 className="text-lg text-white font-medium mb-1">Hot-swappable PCB</h4>
                  <p className="text-white/50 leading-relaxed">Customize your switch feel instantly without soldering. Compatible with 3-pin and 5-pin mechanical switches.</p>
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10 shrink-0">
                  <svg className="w-5 h-5 text-[#FF6A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <h4 className="text-lg text-white font-medium mb-1">Ultra-low Latency</h4>
                  <p className="text-white/50 leading-relaxed">1000Hz polling rate in both wired and 2.4GHz wireless modes for a competitive edge in gaming and typing.</p>
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10 shrink-0">
                  <svg className="w-5 h-5 text-[#FF6A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                </div>
                <div>
                  <h4 className="text-lg text-white font-medium mb-1">Precision Gasket Mount</h4>
                  <p className="text-white/50 leading-relaxed">Multi-layer dampening and isolated mounting points deliver perfectly balanced acoustics and a soft bottom-out.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-[#0A0A0C] p-8 md:p-12 rounded-[2rem] border border-white/10 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.12),transparent_60%)] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_left,rgba(179,0,0,0.12),transparent_60%)] pointer-events-none" />
            
            <div className="relative z-10">
              <motion.div variants={itemVariants} className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Flow Hive 65</h3>
                  <p className="text-white/50 text-lg">Matte Black Edition</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/80 uppercase tracking-wider">
                  In Stock
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-end gap-3 mb-10">
                <span className="text-7xl font-bold tracking-tighter text-white">$79</span>
                <span className="text-lg text-white/50 mb-2 font-medium">USD</span>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <button onClick={handleAddToCart} className="w-full relative overflow-hidden rounded-2xl px-8 py-5 text-lg font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A00] via-[#FF2E00] to-[#B30000] opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 shadow-[0_0_30px_rgba(255,106,0,0.3)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Add to Cart
                  </span>
                </button>
                <button onClick={handleBuyNow} className="w-full rounded-2xl px-8 py-5 text-lg font-semibold text-white bg-white/5 hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Buy Now
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mt-8 text-sm text-white/40">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Free worldwide shipping. 30-day returns.</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-[#1A1A1A]/90 backdrop-blur-md border border-[#333] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 pointer-events-none"
          >
            <div className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse" />
            <span className="font-medium text-sm tracking-wide">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
