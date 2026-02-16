"use client";

import { motion } from 'framer-motion';

/**
 * ThinkingState // Principal Resolution
 * Purpose: Visualizing the computational weight of the audit.
 * Tone: Deliberate and institutional.
 */
export default function ThinkingState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-24 transition-colors duration-700">
      
      {/* 🏛️ THE TACTILE INDICATOR */}
      <div className="flex space-x-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.1, 1, 0.1],
              scale: [1, 1.15, 1] 
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              delay: i * 0.5,
              ease: "easeInOut" 
            }}
            className="w-1.5 h-1.5 bg-brand-accent rounded-full"
          />
        ))}
      </div>

      {/* 🏛️ THE INSTITUTIONAL VOICE */}
      <div className="text-center space-y-4">
        <p className="text-xl font-serif italic text-brand-text animate-pulse leading-relaxed">
          Analyzing the reality of your environment
        </p>
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-institutional text-brand-muted block font-bold">
            Institutional Processing // 2026
          </span>
          <div className="h-px w-12 bg-brand-border/40" />
        </div>
      </div>
    </div>
  );
}