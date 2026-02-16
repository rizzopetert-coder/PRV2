"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

/**
 * HeroV2 // Principal Resolution
 * Refactored: Expert Confidant Persona with Central Dispatch Routing.
 * Tenet: Results (Effectiveness).
 */
export default function HeroV2({ contactUrl }) {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  
  const headlines = [
    { main: "Absolute Candor.", accent: "Expertly Applied." },
    { main: "Leadership is the", accent: "Human Variable." },
    { main: "Uncovering the Truth", accent: "in the Friction." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [headlines.length]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-brand-bg overflow-hidden border-b border-brand-border/20 pt-20">
      
      {/* 🏛️ THE ATMOSPHERIC GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-accent/5 rounded-full blur-[160px] pointer-events-none opacity-60" />
      
      <div className="relative z-10 text-center space-y-16 max-w-7xl px-6 py-20">
        
        {/* BRAND ANCHOR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6"
        >
          <span className="font-mono text-[11px] uppercase tracking-[1em] text-brand-accent font-bold block">
            Principal Resolution // 2026
          </span>
          <div className="h-px w-32 bg-brand-accent/40" />
        </motion.div>
        
        {/* CONFIDANT HEADLINE ROTATION */}
        <div className="h-[200px] md:h-[320px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1 
              key={headlineIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="text-6xl md:text-[10rem] font-serif italic text-brand-text tracking-tighter leading-[0.85]"
            >
              {headlines[headlineIndex].main} <br />
              <span className="text-brand-accent not-italic">{headlines[headlineIndex].accent}</span>
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* THE INSTITUTIONAL MANDATE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left max-w-5xl mx-auto border-t border-brand-border/30 pt-16"
        >
          <div className="space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-accent font-bold">The Mandate</span>
            <p className="text-2xl md:text-3xl font-serif italic text-brand-text leading-tight tracking-tight">
              We bring absolute candor to institutional friction, resolving the human variables that stall performance.
            </p>
          </div>
          
          <div className="space-y-4 lg:border-l lg:border-brand-border/30 lg:pl-12">
            <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold">The Objective</span>
            <p className="text-lg font-serif italic text-brand-muted leading-relaxed mb-6">
              To return your organization to its highest state of effectiveness, where truth drives results and leadership functions as a precision instrument.
            </p>
            
            {/* 🏛️ DIRECT DISPATCH BUTTON */}
            <button 
              onClick={() => window.location.href = contactUrl}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-brand-accent hover:text-brand-text transition-colors font-bold group"
            >
              Skip to Direct Inquiry <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* 🏛️ DESCENT INDICATOR */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col items-center gap-4 cursor-pointer pt-20"
          onClick={() => document.getElementById('audit').scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-brand-muted font-bold italic">Begin the Conversation</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown size={20} className="text-brand-accent opacity-60" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}