"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Lock } from "lucide-react";
import { featuredBriefings } from "../data/memos";
import BriefingDrawer from "./BriefingDrawer";

/**
 * VaultWindow // Principal Resolution
 * Homepage entry point to The Vault.
 * Replaces Briefings on the homepage.
 *
 * Surfaces 2 featured Intelligence Memos as editorial teasers.
 * Full carousel and gated content live at /vault/intelligence.
 *
 * Data source: src/data/memos.js (shared with /vault/intelligence)
 */

export default function VaultWindow({ contactUrl }) {
  const [activeBriefing, setActiveBriefing] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openBriefing = (briefing) => {
    setActiveBriefing(briefing);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <section
        id="vault-window"
        className="py-32 bg-brand-bg border-t border-brand-border/50 relative overflow-hidden"
      >
        {/* Atmospheric accent — mirrors AuditSystem glow, lower intensity */}
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-[0.04]"
          style={{ backgroundColor: "#FF4500" }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">

          {/* ── Header ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div className="max-w-2xl">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand-accent font-bold block mb-6">
                Principal Resolution // The Vault
              </span>
              <h2
                className="text-6xl md:text-8xl font-serif italic text-brand-text tracking-tighter leading-none mb-8"
              >
                Intelligence<br />Repository.
              </h2>
              <p
                className="text-xl md:text-2xl font-serif italic text-brand-muted leading-relaxed border-l-2 border-brand-accent pl-8 py-2"
              >
                Forensic proof and resolution architecture for the twelve patterns that consume leadership capacity. The proof is public. The resolution is earned.
              </p>
            </div>

            {/* Access structure legend */}
            <div className="flex flex-col gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#6B6560]" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6560]">
                  Public — Lexicon + Citations
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-accent" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-brand-muted">
                  Editorial — Intelligence Memos
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Lock size={8} className="text-brand-accent shrink-0" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-brand-muted">
                  Gated — Resolution Core
                </span>
              </div>
            </div>
          </div>

          {/* ── Featured Memo Teasers ── */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {featuredBriefings.map((memo) => (
              <motion.div
                key={memo.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={() => openBriefing(memo)}
                className="group relative bg-brand-card border border-brand-border p-10 flex flex-col justify-between cursor-pointer hover:border-brand-accent transition-colors duration-500 min-h-[320px]"
              >
                {/* Category + arrow */}
                <div className="flex items-start justify-between mb-6">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent font-bold border-b border-brand-accent/20 pb-1">
                    {memo.category}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-brand-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                  />
                </div>

                {/* Title */}
                <h3 className="font-serif italic text-3xl md:text-4xl text-brand-text leading-tight tracking-tighter group-hover:text-brand-accent transition-colors duration-400 mb-6 flex-1">
                  {memo.title}
                </h3>

                {/* Excerpt */}
                <p className="font-serif italic text-brand-muted leading-relaxed text-base opacity-80 group-hover:opacity-100 transition-opacity duration-500 mb-8">
                  {memo.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-brand-border group-hover:text-brand-accent transition-colors font-bold">
                    REF // {memo.id}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-muted group-hover:text-brand-accent transition-colors">
                    Read →
                  </span>
                </div>

                {/* Expanding underline accent */}
                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-brand-accent transition-all duration-700 origin-left" />
              </motion.div>
            ))}
          </div>

          {/* ── Vault CTA block ── */}
          <div className="border border-brand-border p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#6B6560] mb-3">
                12 Memos Published // Batch 01
              </p>
              <p
                className="font-serif italic text-2xl text-brand-text leading-tight"
              >
                The full editorial archive lives in The Vault.
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-brand-muted mt-2">
                Share a memo. Earn 72-hour access to the Resolution Core.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <a
                href="/vault"
                className="flex items-center gap-3 px-8 py-4 bg-brand-text text-brand-bg font-mono text-[11px] uppercase tracking-widest font-bold hover:bg-brand-accent hover:text-white transition-all duration-200 group/cta"
              >
                Enter The Vault
                <ArrowRight size={13} className="group-hover/cta:translate-x-1 transition-transform" />
              </a>
              <a
                href="/vault/intelligence"
                className="font-mono text-[9px] uppercase tracking-widest text-brand-muted hover:text-brand-accent transition-colors text-center"
              >
                Browse all memos →
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Briefing drawer — preserves full reading experience from Briefings component */}
      <BriefingDrawer
        briefing={activeBriefing}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        contactUrl={contactUrl}
      />
    </>
  );
}