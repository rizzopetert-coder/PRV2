"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * IdentityAnchor // Principal Resolution
 * Refactored: Branded typography on primary actions.
 * Tenet: Absolute Candor.
 */
export default function IdentityAnchor({ onComplete }) {
  const [email, setEmail] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-card border border-brand-border p-12 md:p-16 backdrop-blur-3xl shadow-2xl text-left relative overflow-hidden"
    >
      {/* ATMOSPHERIC ACCENT */}
      <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent/20" />

      <div className="mb-12">
        <span className="font-mono text-[10px] uppercase tracking-institutional text-brand-accent font-bold block mb-4">
          Analysis Identification // Optional
        </span>
        <h3 className="text-4xl font-serif italic tracking-tighter text-brand-text leading-tight">
          Establish the <span className="text-brand-muted italic">Professional Record.</span>
        </h3>
      </div>

      <div className="space-y-10">
        <div className="space-y-4">
          <label className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold block italic">
            Professional Email (To save progress)
          </label>
          <input 
            type="email"
            placeholder="principal@firm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-brand-border py-4 text-3xl font-serif italic focus:outline-none focus:border-brand-accent text-brand-text transition-colors"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* 🏛️ BRANDED PRIMARY BUTTON */}
          <button 
            onClick={() => onComplete(email)}
            className="flex-1 py-8 bg-brand-text text-brand-bg font-mono text-[11px] uppercase tracking-institutional font-bold hover:bg-brand-accent hover:text-white transition-all shadow-xl active:scale-95 border border-transparent"
          >
            Secure Analysis Record
          </button>
          
          {/* 🏛️ BRANDED SECONDARY BUTTON */}
          <button 
            onClick={() => onComplete(null)}
            className="px-10 py-8 font-mono text-[11px] uppercase tracking-institutional text-brand-muted hover:text-brand-text transition-all font-bold active:scale-95"
          >
            Continue as Anonymous
          </button>
        </div>
      </div>
    </motion.div>
  );
}