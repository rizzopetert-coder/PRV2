"use client";

import React from 'react';

/**
 * RecoveryROI // Principal Resolution
 * Purpose: Visualizing the ROI of intervention vs the cost of inaction.
 * Tenet: Results (Effectiveness).
 */
export default function RecoveryROI({ summary }) {
  const { monthlyBurn } = summary;

  // RECOVERY ASSUMPTION
  // We assume a 10 percent reduction in friction as a conservative baseline.
  const monthlySavings = Math.round(monthlyBurn * 0.10);
  const annualSavings = monthlySavings * 12;

  const SERVICE_ANCHORS = [
    { name: "The Roadmap", fee: 9500, timeToROI: 9500 / Math.max(1, monthlySavings) },
    { name: "The Intervention", fee: 29500, timeToROI: 29500 / Math.max(1, monthlySavings) }
  ];

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(val);

  return (
    <div className="mt-20 pt-16 border-t border-brand-border/40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* THE CALCULATION */}
        <div className="space-y-10 text-left">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-institutional text-brand-accent font-bold">
              Recovery Ratio // The Dividend
            </span>
            <div className="h-px w-24 bg-brand-accent/40" />
          </div>
          
          <h3 className="text-4xl md:text-5xl font-serif italic text-brand-text leading-tight tracking-tighter">
            A 10 percent reduction in friction recovers <span className="text-brand-accent">{formatCurrency(annualSavings)}</span> per year.
          </h3>
          
          <p className="text-lg font-serif italic text-brand-muted leading-relaxed max-w-xl">
            Intervention is not an expense. It is the reclamation of trapped capital. Based on your active leak our protocols often pay for themselves within the first fiscal quarter.
          </p>
        </div>

        {/* THE RATIO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {SERVICE_ANCHORS.map((service) => (
            <div key={service.name} className="p-10 bg-brand-card border border-brand-border/60 shadow-xl transition-all duration-700 hover:border-brand-accent">
              <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted block mb-6 font-bold">
                {service.name}
              </span>
              
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-brand-accent uppercase font-bold tracking-widest">
                  Est. Recovery Time
                </span>
                <span className="text-5xl font-serif text-brand-text block tracking-tight">
                  {Math.ceil(service.timeToROI)} <span className="text-xl italic text-brand-muted">Months</span>
                </span>
              </div>
              
              <div className="mt-8 pt-6 border-t border-brand-border/20">
                <p className="text-[9px] font-mono uppercase tracking-widest text-brand-muted/60 font-bold">
                  * Based on active institutional burn
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}