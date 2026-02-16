"use client";

import { useMemo } from 'react';

/**
 * Principal Resolution // Diagnostic Hook v2.6
 * Purpose: Real-time intelligence and visual state management.
 * Tenet: Absolute Candor.
 * Constraints: No em dashes. No semicolons. No technical jargon.
 */

export function useDiagnosticEngine(step, data) {
  
  /**
   * THE WISDOM ENGINE
   * Dynamic advisor notes based on industry and data thresholds.
   */
  const liveInsight = useMemo(() => {
    const { industry, payroll, personnel, revenueBest, revenueWorst, stalledProjectCapital } = data;

    // Module 01: Industry Specific Truths
    if (step === 0) {
      if (!payroll) {
        if (industry === 'TECH') return "In Technology high speed often masks a lack of institutional memory. You move fast but you might be repeating the same expensive mistakes.";
        if (industry === 'MEDIA') return "The human variable in Media is highly sensitive to atmospheric safety. If truth is punished your creative output becomes derivative.";
        if (industry === 'FINANCE') return "In Finance correctness is your baseline but it often becomes a bottleneck. Efficiency dies in the shadows of over compliance.";
        return "Institutional Truth. Numbers do not lie but culture often hides them.";
      }
      
      const pRoll = Number(payroll);
      if (pRoll > 5000000) return "At this scale a 5 percent friction rate equals a full executive salary lost to silence every year.";
      return "The baseline payroll sets the hourly friction rate. This is the literal price of indecision.";
    }

    // Module 02: Personnel & Decision Latency
    if (step === 1) {
      const execs = personnel.find(p => p.id === 'EXECUTIVE')?.count || 0;
      const total = personnel.reduce((acc, p) => acc + p.count, 0);
      
      if (execs > 4) return "Executive density increases decision latency. Too many captains often leave the ship in port.";
      if (total > 20) return "At this group size information decay is inevitable without absolute candor.";
      return "Who is in the room dictates the cost of the conversation.";
    }

    // Module 03: The Execution Gap
    if (step === 2) {
      const best = Number(revenueBest) || 0;
      const worst = Number(revenueWorst) || 0;
      const gap = best - worst;

      if (gap > 500000) return "A gap of this size is rarely a strategy problem. It is almost always a people variable problem.";
      if (gap > 0) return "The execution gap is the delta between potential and reality. Friction lives in that space.";
      return "Direct Reality. If there is no gap there is no need for intervention.";
    }

    // Module 04: Stalled Projects & Drag
    if (step === 3) {
      if (Number(stalledProjectCapital) > 100000) return "Stalled capital is the ghost of dead projects. Stop letting the past dictate your 2026 strategy.";
      return "Stalled costs are gone. The goal is to stop the bleed moving forward.";
    }

    return "Analyzing the human variable";
  }, [step, data]);

  /**
   * THE THERMAL INDICATOR
   * Calculates the heat of the institution from 0 to 1.
   * This drives the background glow intensity.
   */
  const burnIntensity = useMemo(() => {
    const base = Number(data.payroll) || 0;
    const gap = (Number(data.revenueBest) - Number(data.revenueWorst)) || 0;
    const stalled = Number(data.stalledProjectCapital) || 0;
    
    // Total financial weight of the problem
    const problemWeight = gap + stalled + (base * 0.1); 
    
    // Intensity threshold (Scale of 0 to 1)
    // Capped at 10M for maximum visual effect on the UI
    return Math.min(problemWeight / 10000000, 1);
  }, [data]);

  return { liveInsight, burnIntensity };
}