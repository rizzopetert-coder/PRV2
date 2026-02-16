"use client";

import React from 'react';
import { ArrowRight, Map, Zap, Shield, BookOpen, HeartHandshake } from 'lucide-react';

/**
 * Capabilities // Principal Resolution
 * Centralized Routing: Connects all service tiers to the Dubsado backbone.
 * Tenet: People (The Human Variable).
 */

const tiers = [
  {
    id: "01",
    name: "The Roadmap",
    icon: <Map size={24} />,
    description: "30 days to find out why your team is exhausted. We do not look at spreadsheets; we look at how your people talk to each other. We identify exactly what needs to be said to clear the air.",
    outcomes: ["The Human Variable Audit", "Identifying the unsaid", "30-day resolution plan"]
  },
  {
    id: "02",
    name: "The Intervention",
    icon: <Zap size={24} />,
    description: "Direct tactical support for the hard stuff. We step into the room to handle high-stakes conversations and structural resets that internal teams are often too polite to suggest.",
    outcomes: ["The cultural reset", "Tactical room mediation", "Removing institutional friction"]
  },
  {
    id: "03",
    name: "Safe Harbor",
    icon: <Shield size={24} />,
    description: "Confidential advisory for the Principal. A quiet, unvarnished space for a second opinion where you can prioritize the mission over office politics.",
    outcomes: ["Blind spot detection", "Trust stewardship", "The ROI of Truth"]
  },
  {
    id: "04",
    name: "Development",
    icon: <BookOpen size={24} />,
    description: "Investing in the people who do the work. We strip away corporate theory and provide your team with practical tools for direct communication and stewardship.",
    outcomes: ["Clarity as Kindness™ training", "Real-world leadership", "Effective communication"]
  }
];

const stabilityTier = {
  id: "05",
  name: "Stability Support",
  icon: <HeartHandshake size={32} />,
  description: "When the wheels are coming off. We provide a steady hand during leadership pivots, mass exits, or organizational trauma to keep the mission safe while you find your footing.",
  outcomes: ["Emergency transition care", "Cultural stabilization", "Interim leadership support"]
};

export default function Capabilities({ contactUrl }) {
  return (
    <section id="capabilities" className="py-32 bg-brand-bg text-brand-text border-t border-brand-border/50 transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-24">
        
        {/* HEADER BLOCK: The Burden Acknowledged */}
        <div className="mb-24 max-w-4xl text-left">
          <span className="font-mono text-[11px] uppercase tracking-[0.6em] text-brand-accent font-bold block mb-6">
            Engagement // Outcomes
          </span>
          <h2 className="text-5xl md:text-7xl font-serif italic mb-8 tracking-tighter leading-tight">
            Resolving the <br />
            <span className="text-brand-accent not-italic font-bold">Human Variable.</span>
          </h2>
          <p className="text-2xl font-serif italic text-brand-text leading-relaxed opacity-80 max-w-2xl border-l border-brand-accent pl-8 py-2">
            Most institutional waste is just unaddressed conflict. We find the friction so you can focus on the results.
          </p>
        </div>

        {/* 2x2 GRID: TIERS 01-04 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-border/30 border border-brand-border/30 shadow-2xl mb-px">
          {tiers.map((tier) => (
            <div key={tier.id} className="bg-brand-card p-10 lg:p-14 flex flex-col hover:bg-brand-bg transition-all duration-700 group">
              <div className="mb-8 text-brand-accent opacity-60 group-hover:opacity-100 transition-opacity">
                {tier.icon}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-muted mb-3 font-bold">
                Tier {tier.id}
              </span>
              <h3 className="font-serif italic text-3xl text-brand-text mb-6 tracking-tight leading-none">
                {tier.name}
              </h3>
              <p className="text-brand-muted font-serif italic text-lg leading-relaxed mb-10 flex-grow">
                {tier.description}
              </p>
              
              <ul className="space-y-4 mb-12">
                {tier.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-brand-muted font-bold group-hover:text-brand-text transition-colors">
                    <div className="w-1.5 h-1.5 bg-brand-accent mt-1 shrink-0" /> 
                    {outcome}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => window.location.href = contactUrl} 
                className="inline-flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-brand-text hover:text-brand-accent font-bold transition-colors group/btn"
              >
                Initiate Protocol <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* FULL WIDTH: TIER 05 (EMERGENCY) */}
        <div 
          onClick={() => window.location.href = contactUrl}
          className="bg-brand-text text-brand-bg p-10 lg:p-14 border-x border-b border-brand-border shadow-2xl group transition-all duration-700 cursor-pointer hover:bg-brand-accent/90"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 text-left">
            <div className="max-w-2xl">
              <div className="mb-8 text-brand-accent">{stabilityTier.icon}</div>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-accent mb-3 font-bold block">
                Tier 05 // Emergency Stabilization
              </span>
              <h3 className="font-serif italic text-4xl text-brand-bg mb-6 tracking-tight">
                {stabilityTier.name}
              </h3>
              <p className="text-brand-bg/70 font-serif italic text-xl leading-relaxed">
                {stabilityTier.description}
              </p>
            </div>
            
            <div className="shrink-0">
              <ul className="space-y-4 mb-10 md:mb-6">
                {stabilityTier.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-brand-bg font-bold">
                    <div className="w-2 h-2 bg-brand-accent shadow-[0_0_10px_rgba(255,69,0,0.5)]" /> 
                    {outcome}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-brand-bg font-bold">
                Inquire Immediately <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}