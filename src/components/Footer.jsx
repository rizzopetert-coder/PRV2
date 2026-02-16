"use client";

import React from 'react';

/**
 * Institutional Footer // Principal Resolution
 * Refactored: Clarity is Kindness update.
 * Constraints: No em dashes. No semicolons. 
 * Tenet: Absolute Candor.
 */
export default function Footer({ contactUrl }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-brand-bg border-t border-brand-border/50 pt-32 pb-12 transition-colors duration-700 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-24">
        
        {/* THE FINAL CALL: A peer-to-peer invitation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          <div className="space-y-10 text-left">
            <h2 className="text-6xl md:text-7xl font-serif italic tracking-tighter text-brand-text leading-[0.9]">
              Resolve the <br />
              <span className="text-brand-accent not-italic font-bold">Human Variable.</span>
            </h2>
            <p className="text-2xl font-serif italic text-brand-muted max-w-lg leading-relaxed border-l border-brand-accent pl-8 py-2">
              We do not fix people. We fix the environments that break them. Truth is a kindness and effectiveness is our only metric.
            </p>
          </div>

          <div className="flex flex-col justify-center space-y-12">
            <div className="space-y-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.6em] text-brand-accent font-bold block text-left md:text-center">
                Next Task // Protocol Initiation
              </span>
              <div className="flex flex-col items-center gap-6">
                <button 
                  onClick={() => window.location.href = contactUrl}
                  className="w-full md:w-auto bg-brand-text text-brand-bg px-16 py-8 font-mono text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-brand-accent hover:text-white transition-all text-center shadow-2xl relative group overflow-hidden"
                >
                  <span className="relative z-10">Initiate Resolution Protocol</span>
                  <div className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </button>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-brand-muted italic">
                  Strictly Confidential // Board Level Privacy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* IDENTITY ANCHOR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-20 border-t border-brand-border/20">
          
          <div className="space-y-6 text-left">
            <span className="font-mono text-[11px] uppercase tracking-[0.8em] text-brand-text font-bold block">
              Principal Resolution
            </span>
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted leading-loose italic">
                Direct Partnership for <br />
                Institutional Performance.
              </p>
              <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-brand-accent font-bold">
                EST. 2026 // Remote First Deployment
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-left md:items-center">
             <div className="flex flex-col gap-4">
               <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-brand-muted font-bold mb-2">Core Pillars</span>
               {['The Human Variable', 'Absolute Candor', 'Institutional Effectiveness'].map((pillar) => (
                 <span key={pillar} className="font-serif italic text-base text-brand-text opacity-50 hover:opacity-100 hover:text-brand-accent transition-all cursor-default">
                   {pillar}
                 </span>
               ))}
             </div>
          </div>

          <div className="md:text-right flex flex-col justify-end space-y-4">
            <div className="space-y-1">
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-brand-muted/40 font-bold">
                Privacy is Absolute. All data is purged after resolution.
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-brand-muted/40 italic">
                &copy; {currentYear} Principal Resolution. All Rights Reserved.
              </p>
            </div>
            <div className="flex md:justify-end gap-6">
               <span className="font-mono text-[8px] uppercase tracking-widest text-brand-muted/30 hover:text-brand-accent cursor-pointer transition-colors">Terms of Protocol</span>
               <span className="font-mono text-[8px] uppercase tracking-widest text-brand-muted/30 hover:text-brand-accent cursor-pointer transition-colors">Privacy Clause</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}