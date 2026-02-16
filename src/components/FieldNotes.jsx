"use client";

import React from 'react';
import { motion } from 'framer-motion';

/**
 * FieldNotes // Principal Resolution
 * Purpose: Documenting Institutional Effectiveness and Results.
 * Tone: Direct, Unsentimental, and Data-Driven.
 */
export default function FieldNotes() {
  const caseStudies = [
    {
      sector: "Private Equity",
      friction: "Foundational Resentment",
      resolution: "Surgical leadership realignment and board-level mediation.",
      outcome: "2.4x Velocity Increase"
    },
    {
      sector: "Family Enterprise",
      friction: "Legacy Governance Stasis",
      resolution: "Separation of familial history from boardroom strategy.",
      outcome: "Succession Locked"
    },
    {
      sector: "Technology",
      friction: "The Silence Tax",
      resolution: "Implementation of Absolute Candor feedback protocols.",
      outcome: "Zero-Latency Decision Making"
    }
  ];

  return (
    <section className="py-32 bg-brand-bg transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-24">
        
        {/* SECTION HEADER */}
        <div className="max-w-3xl mb-24">
          <span className="font-mono text-[11px] uppercase tracking-[0.6em] text-brand-accent font-bold block mb-8">
            The Results Ledger // FieldNotes
          </span>
          <h2 className="text-5xl md:text-7xl font-serif italic tracking-tighter text-brand-text leading-none mb-10">
            Effectiveness is the <br />Only Metric.
          </h2>
          <p className="text-xl md:text-2xl font-serif italic text-brand-muted leading-relaxed">
            We don't provide advice; we provide resolution. Below are the reality summaries of recent institutional interventions.
          </p>
        </div>

        {/* CASE STUDY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {caseStudies.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-accent" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-brand-muted/60 font-bold">
                    Case Ref: {item.sector}
                  </span>
                </div>
                
                <h4 className="text-2xl font-serif italic text-brand-text group-hover:text-brand-accent transition-colors duration-500">
                  {item.friction}
                </h4>
                
                <p className="text-brand-muted font-serif italic text-lg leading-relaxed border-l border-brand-border pl-8">
                  {item.resolution}
                </p>
                
                <div className="pt-6">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-brand-muted block mb-2 font-bold">
                    Resolution Outcome:
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-brand-text font-bold">
                    {item.outcome}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* INSTITUTIONAL PROMISE */}
        <div className="mt-32 p-12 bg-brand-card-bg border border-brand-border flex flex-col md:flex-row items-center justify-between gap-12 transition-colors duration-500">
          <p className="font-serif italic text-2xl text-brand-text max-w-xl">
            "We treat culture as a data point, not a vibe. If it isn't impacting the P&L, it isn't our priority."
          </p>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent font-bold">
              Institutional Mandate
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-brand-muted italic font-bold">
              Absolute Candor // Expert Accuracy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}