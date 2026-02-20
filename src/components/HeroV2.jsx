"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

/**
 * HeroV2 // Principal Resolution
 * Typography: Sorts Mill Goudy (setup) + Fjalla One (verdict)
 * Routing: Dual-path Dubsado dispatch
 * Tenet: Truth (Absolute Candor)
 */
export default function HeroV2({ contactUrl }) {

  const scrollToAudit = () => {
    document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between bg-brand-bg overflow-hidden border-b border-brand-border/20">

      {/* ATMOSPHERIC GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-brand-accent/5 rounded-full blur-[160px] pointer-events-none" />

      {/* TOP BAR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex justify-between items-center px-6 lg:px-24 pt-12"
      >
        <span className="font-mono text-[10px] uppercase tracking-institutional text-brand-accent font-bold">
          Principal Resolution
        </span>
        <button
          onClick={() => window.location.href = contactUrl}
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-briefing text-brand-muted hover:text-brand-accent transition-colors font-bold group"
        >
          Direct Inquiry
          <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col justify-center flex-grow px-6 lg:px-24 py-20 max-w-7xl mx-auto w-full">

        {/* EYEBROW */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-6 mb-12"
        >
          <div className="w-8 h-px bg-brand-accent" />
          <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-accent font-bold">
            Institutional Diagnostic // 2026
          </span>
        </motion.div>

        {/* HEADLINE — Goudy setup + Fjalla verdict */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mb-12"
        >
          {/* Line 1: The observation — Goudy italic */}
          <h1
            className="font-serif italic text-brand-text block leading-verdict tracking-tighter"
            style={{ fontSize: 'clamp(3.2rem, 7vw, 8.5rem)' }}
          >
            We don't fix people.
          </h1>

          {/* Line 2: The verdict — Fjalla One */}
          <span
            className="font-fjalla text-brand-accent block uppercase tracking-tight"
            style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 7rem)',
              lineHeight: '1',
              letterSpacing: '0.02em',
            }}
          >
            We fix what breaks them.
          </span>

          {/* Line 3: The credential — Goudy italic, stepped back */}
          <span
            className="font-serif italic text-brand-muted block mt-4"
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.5rem)',
              lineHeight: '1.4',
              opacity: 0.75,
            }}
          >
25 years. Enough to know what nobody in the building wants to say.
          </span>
        </motion.div>

        {/* SUBHEAD */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="font-serif italic text-brand-muted leading-relaxed text-left max-w-2xl mb-16 border-l-2 border-brand-accent/40 pl-8"
          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)' }}
        >
          Most organizations have already named the problem.
          They are waiting for someone with the standing to say it
          out loud — and the skill to do something about it.
        </motion.p>

        {/* DUAL-PATH CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          {/* PRIMARY: Diagnostic path → AuditSystem */}
          <button
            onClick={scrollToAudit}
            className="flex items-center gap-4 bg-brand-accent text-white font-mono text-[11px] uppercase tracking-briefing font-bold px-10 py-5 hover:bg-brand-text hover:text-brand-bg transition-all duration-300 shadow-lg group"
          >
            Price the Friction
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* SECONDARY: Direct path → Dubsado */}
          <button
            onClick={() => window.location.href = contactUrl}
            className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-briefing text-brand-text font-bold border border-brand-border/60 px-10 py-5 hover:border-brand-accent hover:text-brand-accent transition-all duration-300 group"
          >
            Speak Directly
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.div>

      </div>

      {/* BOTTOM STATS BAR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative z-10 border-t border-brand-border/30 px-6 lg:px-24 py-8 grid grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {[
          { value: "70%",  label: "of initiatives fail due to people factors" },
          { value: "25+",  label: "years of institutional field experience" },
          { value: "3×",   label: "performance gap in high-trust teams" },
          { value: "30",   label: "days to a resolution roadmap" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-2">
            <span
              className="font-fjalla text-brand-accent leading-none uppercase"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}
            >
              {stat.value}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-briefing text-brand-muted font-bold leading-snug">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

    </section>
  );
}