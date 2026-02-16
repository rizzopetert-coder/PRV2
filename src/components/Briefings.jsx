"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowUpRight, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { strategicBriefings } from '../data/briefingData';
import BriefingDrawer from './BriefingDrawer';

/**
 * Briefings // Principal Resolution
 * Refactored: Central Dispatch Routing and Expert Intelligence Track.
 * Tenet: Truth (Absolute Candor).
 */
export default function Briefings({ contactUrl }) {
  const [activeBriefing, setActiveBriefing] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const openBriefing = (briefing) => {
    setActiveBriefing(briefing);
    setIsDrawerOpen(true);
  };

  return (
    <section id="briefings" className="py-32 bg-brand-bg transition-colors duration-700 border-t border-brand-border/50 relative group">
      
      {/* HEADER BLOCK */}
      <div className="max-w-7xl mx-auto px-6 lg:px-24 mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 text-left">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-institutional text-brand-accent font-bold block mb-6">
            Intelligence Memos
          </span>
          <h2 className="text-6xl md:text-8xl font-serif italic text-brand-text tracking-tighter leading-none mb-8">
            Field Briefings.
          </h2>
          <p className="text-xl md:text-2xl font-serif italic text-brand-muted leading-relaxed border-l-2 border-brand-accent pl-8 py-2">
            Direct analysis of the human variables that dictate how your company actually performs.
          </p>
        </div>

        {/* 🏛️ DIRECT DISPATCH ESCAPE HATCH */}
        <button 
          onClick={() => window.location.href = contactUrl}
          className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-brand-muted hover:text-brand-accent transition-colors font-bold group/cta"
        >
          Request Custom Briefing <ArrowRight size={14} className="group-hover/cta:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* TACTICAL NAVIGATION */}
      <div className="hidden lg:block">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-6 bg-brand-bg/80 border border-brand-border text-brand-muted hover:text-brand-accent hover:border-brand-accent transition-all backdrop-blur-md opacity-0 group-hover:opacity-100"
          aria-label="Scroll Left"
        >
          <ChevronLeft size={32} strokeWidth={1} />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-6 bg-brand-bg/80 border border-brand-border text-brand-muted hover:text-brand-accent hover:border-brand-accent transition-all backdrop-blur-md opacity-0 group-hover:opacity-100"
          aria-label="Scroll Right"
        >
          <ChevronRight size={32} strokeWidth={1} />
        </button>
      </div>

      {/* HORIZONTAL TRACK */}
      <div 
        ref={scrollRef}
        className="flex flex-nowrap gap-8 overflow-x-auto pb-12 px-6 lg:px-24 snap-x scroll-smooth cursor-grab active:cursor-grabbing custom-scrollbar"
      >
        {strategicBriefings.map((memo) => (
          <motion.div 
            key={memo.id}
            whileHover={{ y: -10 }}
            onClick={() => openBriefing(memo)}
            className="flex-none w-[340px] md:w-[460px] aspect-[4/5] bg-brand-card border border-brand-border p-12 flex flex-col justify-between snap-start hover:border-brand-accent transition-all duration-700 cursor-pointer group relative shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <FileText size={120} />
            </div>

            <div className="space-y-6 text-left relative z-10">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] tracking-briefing text-brand-accent uppercase font-bold border-b border-brand-accent/20 pb-2">
                  {memo.category}
                </span>
                <ArrowUpRight size={18} className="text-brand-muted opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              
              <h3 className="text-4xl font-serif italic text-brand-text leading-tight tracking-tighter group-hover:text-brand-accent transition-colors duration-500">
                {memo.title}
              </h3>
              
              <p className="text-brand-muted font-serif italic text-lg opacity-80 group-hover:opacity-100 transition-opacity duration-700 leading-relaxed pt-4">
                {memo.excerpt}
              </p>
            </div>
            
            <div className="flex justify-between items-end relative z-10">
              <span className="font-mono text-[14px] text-brand-border group-hover:text-brand-accent transition-colors font-bold">
                REF // {memo.id}
              </span>
              <div className="w-12 h-px bg-brand-border group-hover:w-full transition-all duration-1000 origin-right" />
            </div>
          </motion.div>
        ))}
        
        <div className="flex-none w-px h-full pr-6 lg:pr-24" />
      </div>

      {/* THE READING ROOM */}
      <BriefingDrawer 
        briefing={activeBriefing} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        contactUrl={contactUrl} // Passing URL into the drawer for internal CTAs
      />
    </section>
  );
}