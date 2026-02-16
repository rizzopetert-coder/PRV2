"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BriefingDrawer // Principal Resolution
 * Refactored: Central Dispatch Routing and Branded Typography.
 * Focus: Direct Institutional Analysis.
 * Tenet: Results (Effectiveness).
 */
export default function BriefingDrawer({ briefing, isOpen, onClose, contactUrl }) {
  if (!briefing) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY: ADAPTIVE ATMOSPHERIC DARKENING */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-text/40 backdrop-blur-sm z-[100] transition-colors duration-700"
          />
          
          {/* THE DRAWER: THE INNER SANCTUM */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-3xl bg-brand-bg shadow-2xl z-[101] overflow-y-auto border-l border-brand-border transition-colors duration-700 no-scrollbar"
          >
            <div className="p-10 md:p-16 lg:p-24">
              
              {/* RETURN TO HARBOR: TACTILE NAVIGATION */}
              <button 
                onClick={onClose}
                className="font-mono text-[11px] uppercase tracking-institutional text-brand-muted mb-24 hover:text-brand-accent transition-all flex items-center gap-6 group font-bold"
              >
                <div className="w-12 h-px bg-brand-border group-hover:w-24 group-hover:bg-brand-accent transition-all duration-700" /> 
                Return to Harbor
              </button>

              <div className="space-y-6 mb-16">
                <span className="font-mono text-[11px] uppercase tracking-institutional text-brand-accent font-bold block">
                  {briefing.category} // Intelligence Memo
                </span>
                <div className="flex flex-col gap-2">
                  <p className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted/60 font-bold italic">
                    For the Principal // Confidential
                  </p>
                  <div className="h-px w-32 bg-brand-border/40" />
                </div>
              </div>

              <h2 className="text-5xl md:text-7xl font-serif italic tracking-tightest text-brand-text mb-16 leading-tight">
                {briefing.title}
              </h2>
              
              <div className="h-px w-full bg-brand-border/40 mb-16" />

              <article className="max-w-none">
                {/* THE EXECUTIVE SUMMARY */}
                <p className="text-brand-muted font-serif italic text-2xl md:text-3xl leading-relaxed mb-20 border-l-4 border-brand-accent pl-10 py-2">
                  {briefing.excerpt}
                </p>

                {/* THE CORE CONTENT: UNFILTERED TRUTH */}
                <div className="text-brand-text font-serif italic text-xl md:text-2xl leading-relaxed space-y-12 whitespace-pre-wrap">
                  {briefing.content}
                </div>
              </article>

              {/* TACTICAL CALL TO ACTION: RESULTS */}
              <div className="mt-32 pt-16 border-t border-brand-border/40">
                <div className="mb-10 text-left">
                  <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold italic block">
                    End of Memo
                  </span>
                  <p className="text-lg font-serif italic text-brand-muted">
                    Immediate action required?
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    onClose();
                    window.location.href = contactUrl;
                  }}
                  className="inline-block w-full bg-brand-text text-brand-bg text-center py-8 px-12 font-mono text-[11px] uppercase tracking-institutional font-bold hover:bg-brand-accent hover:text-white transition-all duration-700 shadow-2xl active:scale-95"
                >
                  Initiate Resolution Protocol
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}