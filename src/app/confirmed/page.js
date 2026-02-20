"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';

/**
 * Confirmed // Principal Resolution
 * The Success Redirect Page.
 * Focus: Institutional assurance and next steps.
 * Tenet: Absolute Candor.
 */
export default function ConfirmedPage() {
  return (
    <main className="min-h-screen bg-brand-bg flex items-center justify-center relative overflow-hidden px-6">
      
      {/* 🏛️ THE ATMOSPHERIC GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[160px] pointer-events-none opacity-40" />

      <div className="max-w-3xl w-full relative z-10 text-left">
        
        {/* STATUS INDICATOR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-px w-12 bg-brand-accent/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.5em] text-brand-accent font-bold">
            Protocol Initiated
          </span>
        </motion.div>

        {/* THE MAIN VERDICT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <h1 className="text-6xl md:text-8xl font-serif italic text-brand-text tracking-tighter leading-none">
            The handshake <br />
            <span className="text-brand-accent not-italic font-bold">is complete.</span>
          </h1>
          
          <p className="text-2xl md:text-3xl font-serif italic text-brand-muted leading-tight border-l-4 border-brand-accent pl-10 py-2">
            Your intelligence has been logged. I am reviewing the friction points now to prepare a direct path to resolution.
          </p>
        </motion.div>

        {/* 🏛️ NEXT STEPS: THE INSTITUTIONAL TIMELINE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-brand-border/30 pt-16"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-brand-accent">
              <Clock size={18} />
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold">The Timeline</span>
            </div>
            <p className="font-serif italic text-lg text-brand-text/70">
              Expect a direct briefing via email within 24 hours to coordinate our initial conversation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-brand-accent">
              <ShieldCheck size={18} />
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Data Privacy</span>
            </div>
            <p className="font-serif italic text-lg text-brand-text/70">
              Your analysis remains in safe harbor. All diagnostic data is encrypted and strictly for my review.
            </p>
          </div>
        </motion.div>

        {/* 🏛️ RETURN ANCHOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-6 group"
          >
            <div className="w-12 h-px bg-brand-border group-hover:w-24 group-hover:bg-brand-accent transition-all duration-700" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-brand-muted group-hover:text-brand-text transition-colors font-bold flex items-center gap-2">
              <ArrowLeft size={14} /> Return to Harbor
            </span>
          </Link>
        </motion.div>

      </div>
    </main>
  );
}