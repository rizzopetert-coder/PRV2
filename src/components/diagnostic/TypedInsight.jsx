"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TypedInsight // Principal Resolution
 * Purpose: Delivering expert observations with deliberate pacing.
 * Tenet: Absolute Candor.
 * Constraints: No em dashes. No semicolons. No technical jargon.
 */
export default function TypedInsight({ insight = "" }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    // Reset state for new observation
    setDisplayedText(""); 
    let i = 0;
    
    // Mimics the deliberate speed of a human advisor
    const typingInterval = setInterval(() => {
      if (i < insight.length) {
        setDisplayedText((prev) => insight.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 25); 

    return () => clearInterval(typingInterval);
  }, [insight]);

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={insight}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className="p-10 bg-brand-card border-l-4 border-brand-accent shadow-2xl backdrop-blur-md my-12 transition-colors duration-700"
      >
        <div className="flex items-center gap-6 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-institutional text-brand-accent font-bold">
            Advisor Note // 2026
          </span>
          <div className="h-px flex-grow bg-brand-border/40" />
        </div>
        
        <p className="text-2xl md:text-3xl font-serif italic text-brand-text leading-tight-editorial tracking-tighter">
          {displayedText}
          <motion.span 
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-6 bg-brand-accent ml-2 align-middle"
          />
        </p>
      </motion.div>
    </AnimatePresence>
  );
}