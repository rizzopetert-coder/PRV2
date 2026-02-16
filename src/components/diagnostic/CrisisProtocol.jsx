"use client";

import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';

/**
 * CrisisProtocol // Principal Resolution
 * Triggered at Maximum Burn Threshold.
 * Focus: Absolute Candor and Direct Stabilization.
 */
export default function CrisisProtocol({ state }) {
  // Only triggers for states representing total institutional friction
  if (state.label !== "Total Friction Collapse" && state.label !== "Executive Embargo") return null;

  return (
    <div className="mt-16 p-10 bg-brand-accent/5 border-2 border-brand-accent shadow-2xl relative overflow-hidden">
      
      {/* ATMOSPHERIC ALERT LAYER */}
      <div className="absolute inset-0 bg-brand-accent/5 animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 text-left">
        <div className="bg-brand-accent p-5 rounded-full text-white shadow-lg">
          <AlertTriangle size={40} strokeWidth={1.5} />
        </div>
        
        <div className="flex-grow space-y-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-institutional text-brand-accent font-bold block">
              Critical Threshold Detected
            </span>
            <div className="h-px w-24 bg-brand-accent/40" />
          </div>
          
          <h4 className="text-3xl md:text-4xl font-serif italic text-brand-text leading-none">
            Stabilization Required.
          </h4>
          
          <p className="text-lg font-serif italic text-brand-muted leading-relaxed max-w-2xl">
            Your current burn rate exceeds institutional safety limits. Standard roadmaps are not enough to fix this. You require a Tier 05 Deployment to stop the immediate bleed and protect the mission.
          </p>
        </div>

        <button 
          onClick={() => window.location.href = 'tel:+15085550123'} 
          className="w-full lg:w-auto px-12 py-8 bg-brand-accent text-white font-mono text-[11px] uppercase tracking-institutional font-bold hover:bg-brand-text hover:text-brand-bg transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
        >
          <PhoneCall size={18} /> Direct Connection
        </button>
      </div>
    </div>
  );
}