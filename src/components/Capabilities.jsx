"use client";

import React from 'react';
import { ArrowRight, Map, Zap, Shield, BookOpen, HeartHandshake, Briefcase } from 'lucide-react';

let BriefcaseBusiness;
try { BriefcaseBusiness = require('lucide-react').BriefcaseBusiness; } catch (_) {}
const CounselIcon = BriefcaseBusiness || Briefcase;

/**
 * Capabilities // Principal Resolution
 * Final: Human-centered copy, servant leadership emphasis,
 * outcome sentences, tier-specific CTAs.
 * Tenet: People (The Human Variable).
 */

const tiers = [
  {
    id: "01",
    name: "The Roadmap",
    icon: <Map size={24} />,
    description: "30 days to find out why your team is exhausted. We listen to the people doing the work, not just the people managing it. You get a clear diagnosis and a 30-day plan that addresses the actual problem — not the one on the org chart.",
    outcome: "You leave with a diagnosis that names the real problem and a plan your team can actually execute.",
    cta: "Start the Roadmap",
  },
  {
    id: "02",
    name: "The Intervention",
    icon: <Zap size={24} />,
    description: "Direct tactical support for the hard stuff. We step into the room to handle the high-stakes conversations and structural resets that internal teams are too polite to attempt. The result is faster decisions, cleared air, and a team that knows someone finally said what needed to be said.",
    outcome: "You leave with resolution. Not a plan to resolve. Not a framework for resolving. The thing itself, done -- with the people who needed to be part of it having been part of it.",    
    cta: "Bring us in",
  },
  {
    id: "03",
    name: "Executive Counsel",
    icon: <CounselIcon size={24} />,
    description: "The ongoing advisory relationship for the conversations that cannot happen inside the building. No agenda, no allegiance, no filtered feedback. The leaders who use this arrangement make better decisions -- because they finally have somewhere to think out loud about the people and dynamics that every internal conversation has to work around.",    outcome: "You leave every session with clarity you couldn't have gotten from anyone inside the organization. That's the arrangement.",
    outcome: "You leave every session with clarity about the people, the dynamics, and the decisions -- clarity you couldn't have gotten from anyone inside the organization. That's the arrangement.",
    cta: "Inquire about Executive Counsel",
  },
  {
    id: "04",
    name: "Development",
    icon: <BookOpen size={24} />,
    description: "We develop leaders who make the people around them better — not leaders who make themselves more indispensable. Practical tools, real-world application, and a framework built on the principle that clarity is the highest form of kindness you can offer a team. The measure is not what the leader learns. It is what their team is able to do because of it.",    outcome: "You leave with leaders who make the people around them measurably better — and know exactly why that matters.",
    outcome: "You leave with leaders who make the people around them measurably better, who say the things that need to be said, and who know exactly why both of those things matter.",
    cta: "Schedule a Session",
  }
];

const stabilityTier = {
  id: "05",
  name: "Stability Support",
  icon: <HeartHandshake size={32} />,
  description: "When the situation has outrun your internal capacity to manage it. We come in during leadership pivots, mass exits, and organizational trauma -- name what is happening, tell the people who need to hear it, and start doing the things the organization cannot do for itself right now. This is not advisory work. We are in the room, making the hard calls, until the new normal is stabilized.",  outcome: "Your mission stays intact. Your people come through it with more trust in leadership than when the crisis began.",
  outcome: "Your mission stays intact. Your people come through it having been told the truth -- and with more trust in leadership than when the crisis began.",
  cta: "Call us now",
};

export default function Capabilities({ contactUrl }) {
  return (
    <section
      id="capabilities"
      className="py-32 bg-brand-bg text-brand-text border-t border-brand-border/50 transition-colors duration-700"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-24">

        {/* HEADER */}
        <div className="mb-24 max-w-4xl text-left">
          <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block mb-6">
            Engagement // Outcomes
          </span>

          <h2
            className="font-serif italic mb-8 tracking-tighter leading-verdict"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
          >
            How we work.{' '}
            <span className="text-brand-accent not-italic">Why it's different.</span>
          </h2>

          <p
            className="font-serif italic text-brand-text leading-relaxed opacity-80 max-w-2xl border-l-2 border-brand-accent/50 pl-8 py-2"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)' }}
          >
            The work is always about people. The outcome is always
            about performance. We don't separate the two.
          </p>
        </div>

        {/* 2x2 GRID: TIERS 01–04 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-border/50 border border-brand-border/50 shadow-2xl mb-px">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="bg-brand-bg p-10 lg:p-14 flex flex-col hover:bg-brand-accent/5 transition-all duration-700 group"
            >
              {/* Icon */}
              <div className="mb-8 text-brand-accent opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                {tier.icon}
              </div>

              {/* Tier label */}
              <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted mb-3 font-bold">
                Tier {tier.id}
              </span>

              {/* Name */}
              <h3
                className="font-serif italic text-brand-text mb-5 tracking-tight leading-none"
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
              >
                {tier.name}
              </h3>

              {/* Description */}
              <p
                className="font-serif italic text-brand-muted leading-relaxed mb-8 flex-grow border-l border-brand-border/50 pl-5"
                style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}
              >
                {tier.description}
              </p>

              {/* Outcome sentence */}
              <p
                className="font-mono text-brand-accent font-bold leading-relaxed mb-10"
                style={{ fontSize: 'clamp(0.65rem, 1vw, 0.75rem)' }}
              >
                {tier.outcome}
              </p>

              {/* Tier-specific CTA */}
              <button
                onClick={() => window.location.href = contactUrl}
                className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-briefing text-brand-text hover:text-brand-accent font-bold transition-colors duration-300 group/btn w-fit mt-auto"
              >
                {tier.cta}
                <ArrowRight
                  size={13}
                  className="group-hover/btn:translate-x-1 transition-transform duration-300"
                />
              </button>
            </div>
          ))}
        </div>

        {/* FULL WIDTH: TIER 05 — EMERGENCY */}
        <div
          onClick={() => window.location.href = contactUrl}
          className="bg-brand-text text-brand-bg p-10 lg:p-16 border-x border-b border-brand-border/50 shadow-2xl group transition-all duration-700 cursor-pointer hover:bg-brand-accent"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 text-left">

            {/* Left: Content */}
            <div className="max-w-2xl">
              <div className="mb-8 text-brand-accent group-hover:text-white transition-colors duration-500">
                {stabilityTier.icon}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-accent group-hover:text-white/70 mb-3 font-bold block transition-colors duration-500">
                Tier 05 // Emergency Stabilization
              </span>
              <h3
                className="font-serif italic text-brand-bg mb-6 tracking-tight leading-none"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}
              >
                {stabilityTier.name}
              </h3>
              <p
                className="font-serif italic text-brand-bg/70 group-hover:text-white/90 leading-relaxed mb-6 transition-colors duration-500"
                style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)' }}
              >
                {stabilityTier.description}
              </p>

              {/* Outcome sentence */}
              <p
                className="font-mono text-brand-accent group-hover:text-white font-bold leading-relaxed transition-colors duration-500"
                style={{ fontSize: 'clamp(0.65rem, 1vw, 0.75rem)' }}
              >
                {stabilityTier.outcome}
              </p>
            </div>

            {/* Right: CTA */}
            <div className="shrink-0">
              <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-briefing text-brand-bg group-hover:text-white font-bold group-hover:gap-6 transition-all duration-300">
                {stabilityTier.cta}
                <ArrowRight size={14} />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
