"use client";

import React, { useRef, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  INDUSTRY_BENCHMARKS,
  ORG_STAGES,
  LEADERSHIP_TENURES,
  FRICTION_LOCATIONS,
  AVOIDANCE_MECHANISMS,
} from '../../lib/diagnostic-logic';

/**
 * ResultsLedger // Principal Resolution v3.3
 * Mobile-optimized layout pass.
 * Reduced padding, single-column grids, clamp floors adjusted.
 */

const formatCurrency = (val) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(val);

function buildSynthesis(summary, inputData) {
  const { state, recommendation, monthlyBurn, total, context } = summary;
  const {
    orgStage, leadershipTenure, frictionLocation,
    avoidanceMechanism,
  } = context;

  const industry = INDUSTRY_BENCHMARKS[inputData.industry]?.label  || inputData.industry;
  const stage    = ORG_STAGES[orgStage]?.label                     || orgStage;
  const tenure   = LEADERSHIP_TENURES[leadershipTenure]?.label     || leadershipTenure;
  const friction = FRICTION_LOCATIONS[frictionLocation]?.label?.toLowerCase() || 'an unlocated source';

  const avoidanceLine = {
    NO_FORUM:     "The absence of a safe forum means the real conversation has never had a place to happen.",
    PREDETERMINED:"When outcomes feel predetermined, filtered information reaches leadership — and the real problem stays hidden.",
    COST_TOO_HIGH:"The perceived cost of the conversation is being weighed against the actual cost of avoiding it. The math does not favor avoidance.",
  }[avoidanceMechanism] || "";

  const personnelRiskLine = {
    LOST:     "This organization has already lost someone because of this dynamic. That's a confirmed cost, not a projection.",
    YES:      "There is someone in the room this situation is making it harder to keep.",
    POSSIBLY: "There are early signs that this situation is affecting retention.",
  }[inputData.personnelRisk] || "";

  const resolutionBlockageLine = {
    ATTEMPTED: "Something is actively preventing a decision the organization knows needs to happen. That blockage is its own compounding liability.",
    KNOWN:     "The organization knows what needs to happen and hasn't been able to act on it. The cost of that gap is included in this assessment.",
    SUSPECTED: "There may be a personnel decision being avoided. Whether or not it's named, the organization is carrying its weight.",
  }[inputData.resolutionBlockage] || "";

  const priorAttemptLine = {
    EXTERNAL:     "A previous external engagement didn't hold, which means the resolution needs to go somewhere the last one didn't reach.",
    CONVERSATION: "A prior conversation addressed this without producing change — a signal that the source hasn't been reached yet.",
    UNCLEAR:      "It's unclear whether previous efforts addressed the right problem, which is itself a finding.",
  }[inputData.priorAttempt] || "";

  return [
    `This ${stage.toLowerCase()} ${industry} organization is presenting a ${state.label} pattern.`,
    `The friction is concentrated ${friction}, with leadership in place for ${tenure.toLowerCase()}.`,
    avoidanceLine,
    personnelRiskLine,
    resolutionBlockageLine,
    priorAttemptLine,
    `At ${formatCurrency(monthlyBurn)} per month, the annual institutional cost is ${formatCurrency(total)}.`,
    `Based on this profile, the recommended entry point is ${recommendation.name}.`,
  ].filter(Boolean).join(' ');
}

function buildInferredObservation(summary, inputData) {
  const { state } = summary;
  const {
    industry,
    orgStage,
    leadershipTenure,
    frictionLocation,
    avoidanceMechanism,
    priorAttempt,
    personnelRisk,
    resolutionBlockage,
  } = inputData;

  if (priorAttempt === 'EXTERNAL' && resolutionBlockage === 'ATTEMPTED') {
    return "Two attempts at resolution and something keeps getting in the way. In my experience, that pattern almost always means the blockage has institutional protection — someone or something with enough influence to survive the intervention. The next engagement needs to reach that layer directly.";
  }
  if (priorAttempt === 'EXTERNAL' && resolutionBlockage === 'KNOWN') {
    return "A previous external engagement didn't produce lasting change, and there's a decision the organization knows needs to happen but hasn't. Those two facts are usually related. The prior intervention likely addressed the visible dynamic without reaching the source of the blockage.";
  }
  if (priorAttempt === 'CONVERSATION' && frictionLocation === 'CROSS_FUNCTIONAL') {
    return "Cross-functional friction that survives a direct conversation is almost never a communication problem. If the conversation happened and nothing changed, the friction is structural — it lives in how the organization is designed, not in how the people in it are talking to each other.";
  }
  if (priorAttempt === 'CONVERSATION' && frictionLocation === 'WITHIN_LEADERSHIP') {
    return "A leadership team conversation that produced no lasting change usually means the conversation didn't include the person who most needed to be in it — or that person was in it and the dynamic made honest engagement impossible. The source is still in place.";
  }
  if (frictionLocation === 'WITHIN_LEADERSHIP' && avoidanceMechanism === 'PREDETERMINED' && priorAttempt === 'EXTERNAL') {
    return "The previous engagement didn't hold because predetermined outcomes in a leadership team almost always trace back to a single person whose position makes the outcome feel inevitable before the conversation starts. Until that dynamic is named directly, any intervention will work around it rather than through it.";
  }
  if (frictionLocation === 'WITHIN_LEADERSHIP' && avoidanceMechanism === 'NO_FORUM' && resolutionBlockage === 'KNOWN') {
    return "The organization knows what needs to happen and has built — probably without deciding to — a culture that makes it impossible to say so out loud. That's not an accident and it's not a coincidence. The absence of a forum and the presence of an unmade decision are the same problem from two different angles.";
  }
  if (frictionLocation === 'WITHIN_LEADERSHIP' && orgStage === 'LEGACY' && leadershipTenure === 'SEVEN_PLUS') {
    return "When leadership friction has been present for seven-plus years in a legacy organization with no forum to surface it, the patterns have usually been in place longer than anyone will admit out loud. The people who built them are still in the room. That's not an obstacle to resolution — it's the resolution. The conversation has to include them directly.";
  }
  if (state.label === 'Executive Embargo' && resolutionBlockage === 'KNOWN') {
    return "The leadership team is both the source of the friction and the reason the resolution can't happen. That's a closed loop — the people with the authority to make the decision are the same people whose dynamic is preventing it. Getting out of it requires someone outside that loop to name it clearly enough that action becomes possible.";
  }
  if (state.label === 'Caffeine Culture' && priorAttempt === 'NONE') {
    return "This organization has been moving fast enough that it hasn't stopped to name what it's actually running on. Speed is functioning as avoidance here — not deliberately, but effectively. The cost has been accumulating in the background while the activity level made it easy not to look.";
  }
  if (state.label === 'Talent Hemorrhage' && (personnelRisk === 'YES' || personnelRisk === 'LOST')) {
    return "The institutional state and the personnel risk signal are confirming the same thing: this culture is already selecting against the people it most needs to keep. That's not a retention problem with a recruiting solution. It's an environment problem, and the people with the highest standards for how they want to work are the first ones to act on it.";
  }
  if (state.label === 'Brilliant Sabotage' && priorAttempt === 'NONE') {
    return "High individual performance coexisting with collective dysfunction almost never resolves on its own — because the person at the center of it is also the person whose output makes it feel too costly to address. The longer it goes unnamed, the more entrenched the dynamic becomes and the more the organization shapes itself around accommodating it.";
  }
  if ((industry === 'CONSULTING' || industry === 'FINANCE') && avoidanceMechanism === 'PREDETERMINED') {
    return "In an organization that runs on analytical rigor, predetermined outcomes in leadership conversations are a specific kind of credibility problem. The analysis is real. The conclusion was decided before it started. The rigor is being used to justify a decision that was made on other grounds — and the people in the room know it.";
  }
  if (industry === 'NONPROFIT' && personnelRisk === 'LOST') {
    return "Losing someone to organizational dysfunction in a mission-driven organization carries a specific cost that doesn't appear in any financial calculation. The people who join nonprofits have already made a values-based trade. When the environment fails them, they don't just leave the organization — they often leave the sector. The mission didn't protect the person serving it.";
  }
  if (industry === 'MEDIA' && frictionLocation === 'WITHIN_LEADERSHIP' && avoidanceMechanism === 'NO_FORUM') {
    return "Creative cultures are often psychologically safer for disagreement about the work than for disagreement about the people doing it. The same environment that produces passionate creative debate can be completely silent about the leadership dynamic making that debate harder. The two cultures coexist in the same room and almost never interact.";
  }
  if (industry === 'TECH' && orgStage === 'STARTUP' && priorAttempt === 'EXTERNAL') {
    return "An external engagement that didn't hold in a startup usually means the founding dynamic reasserted itself as soon as the external presence left. That dynamic is the product of the founding relationships — it predates the organization and it will outlast any intervention that doesn't reach it directly.";
  }
  return null;
}

function buildRecommendationRationale(summary, inputData) {
  const { state, recommendation } = summary;
  const {
    industry,
    orgStage,
    frictionLocation,
    avoidanceMechanism,
    priorAttempt,
    personnelRisk,
    resolutionBlockage,
    leadershipTenure,
  } = inputData;

  const tier = recommendation.name;

  if (tier === 'Stability Support') {
    return "The math has turned on this one. The diagnostic is showing a cost of inaction that exceeds what a structured intervention can address incrementally. What's needed now isn't a plan — it's immediate stabilization. Stability Support is the right entry point because the window for a deliberate process has closed and what happens in the next few weeks will determine what's possible after that.";
  }

  if (tier === 'Safe Harbor') {
    if (priorAttempt === 'EXTERNAL' && resolutionBlockage === 'ATTEMPTED') {
      return "Safe Harbor is the right entry point here because two prior attempts at resolution haven't held, which tells us the source of the blockage has institutional protection. What's needed isn't another structured engagement — it's a sustained, confidential relationship that can operate outside the dynamics that have protected the problem so far.";
    }
    if (leadershipTenure === 'UNDER_ONE') {
      return "Safe Harbor is the right entry point because you're navigating a problem you inherited, not one you created. The friction predates your tenure and the people who built it are probably still in the room. What you need isn't an intervention — it's a confidential relationship with someone who can help you see the landscape clearly and move through it without the constraints that come with a formal engagement.";
    }
    if (frictionLocation === 'WITHIN_LEADERSHIP' && avoidanceMechanism === 'PREDETERMINED') {
      return "Safe Harbor is the right entry point because predetermined outcomes in a leadership team almost always trace back to a single dynamic that a structured intervention can work around but rarely reaches directly. What's needed is the kind of relationship where that dynamic can be named without consequence and addressed without the political weight that comes with a formal process.";
    }
    if (personnelRisk === 'LOST' || resolutionBlockage === 'ATTEMPTED') {
      return "Safe Harbor is the right entry point because this situation has already produced consequences — and something is actively preventing the resolution the organization knows it needs. A structured engagement alone won't reach that. What's needed is a sustained, confidential presence that can operate where the formal process can't.";
    }
    return "Safe Harbor is the right entry point because what this profile describes isn't a situation that a time-bound structured engagement will resolve. The friction is too embedded, the stakes are too specific, and what's needed is an indefinite confidential relationship — not a project with a deliverable at the end.";
  }

  if (tier === 'The Intervention') {
    if (personnelRisk === 'YES' && resolutionBlockage === 'KNOWN') {
      return `Based on what this diagnostic describes — ${state.label.toLowerCase()} in a ${INDUSTRY_BENCHMARKS[industry]?.label || industry} organization, with someone at risk of leaving and a decision the organization knows needs to happen — The Intervention is the right entry point. The situation is already in motion. What's needed isn't a roadmap for addressing it. It's someone in the room to move it through.`;
    }
    if (priorAttempt === 'CONVERSATION') {
      return `The Intervention is the right entry point because a prior conversation addressed this without producing change — which means the source hasn't been reached yet. The Roadmap assumes a level of organizational readiness to act on its findings that this profile suggests isn't fully in place. The Intervention goes where the conversation didn't.`;
    }
    if (priorAttempt === 'EXTERNAL') {
      return `A previous external engagement didn't hold, which tells us the resolution needs to go somewhere the last one didn't reach. The Intervention is the right entry point because it doesn't produce a plan for your organization to execute — it produces the resolution directly, in the room, with the people who need to be part of it.`;
    }
    if (frictionLocation === 'WITHIN_LEADERSHIP' && personnelRisk !== 'NONE') {
      return `The Intervention is the right entry point because the friction is inside the leadership team and there's already a personnel consequence in play. At that combination, a diagnostic and roadmap phase delays the resolution the organization actually needs. We come in, we address it directly, and you leave with the thing done — not a plan to do it.`;
    }
    if (orgStage === 'LEGACY' && leadershipTenure === 'SEVEN_PLUS') {
      return `The Intervention is the right entry point because what this profile describes has been in place long enough that a roadmap phase would spend its time documenting what everyone already knows. The patterns are established, the cost is confirmed, and the organization needs someone to move it — not map it.`;
    }
    return `The Intervention is the right entry point based on this profile. The ${state.label} pattern combined with the behavioral signals this diagnostic has surfaced indicates that what's needed is resolution, not a plan for resolution. The Roadmap is the right entry point when the organization needs clarity on what to address. This organization already has that clarity. What it needs now is someone to address it.`;
  }

  if (tier === 'The Roadmap') {
    if (priorAttempt === 'NONE') {
      return `The Roadmap is the right entry point because this is the first structured look at what's happening and what it's costing. Before bringing someone in to resolve it, it's worth getting a precise diagnosis of where the friction lives, what's sustaining it, and what resolution actually needs to look like for this specific organization. The Roadmap produces that — and a plan your team can execute on.`;
    }
    if (frictionLocation === 'CROSS_FUNCTIONAL') {
      return `Cross-functional friction is the hardest kind to resolve without first mapping it precisely — because what looks like a relationship problem is almost always a structural one. The Roadmap is the right entry point because it will identify whether the friction is in the design of the organization or in the dynamics between the people in it. Those are different problems with different solutions, and the distinction is worth getting right before bringing someone in to address it.`;
    }
    if (frictionLocation === 'TEAM') {
      return `The Roadmap is the right entry point because friction between leadership and the team almost always has a specific origin point that a diagnostic phase will surface. Going straight to intervention without that clarity risks addressing the symptom rather than the source. The Roadmap gives you the precise picture and a structured path forward.`;
    }
    return `The Roadmap is the right entry point based on this profile. The friction is real and the cost is confirmed — but the profile indicates this organization is in a position to address it deliberately rather than urgently. The Roadmap will name the source precisely, build the case internally, and give your team a structured path to resolution that doesn't require an external presence to execute.`;
  }

  return null;
}

export default function ResultsLedger({ summary, dispatchUrl, onReset, inputData }) {
  const {
    total, monthlyBurn, executionGap,
    state, recommendation, resolvedTier,
  } = summary;

  const reportRef       = useRef(null);
  const synthesis       = useMemo(() => buildSynthesis(summary, inputData), [summary, inputData]);
  const monthlyRecovery = Math.round(monthlyBurn * 0.10);
  const annualRecovery  = monthlyRecovery * 12;
  const returnMultiple  = recommendation.fee
    ? (annualRecovery / recommendation.fee).toFixed(1)
    : null;

  // ── EMAIL CAPTURE STATE ──────────────────────────────────────
  const [email, setEmail]                     = useState('');
  const [optSendRecord, setOptSendRecord]     = useState(false);
  const [optIntelligence, setOptIntelligence] = useState(false);
  const [dispatched, setDispatched]           = useState(false);

  const handleEmailDispatch = async () => {
    try {
      await fetch('/api/diagnostic-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verdict:             state.label,
          tier:                resolvedTier,
          monthlyBurn:         monthlyBurn,
          total:               total,
          context:             summary.context,
          email:               email,
          optSendRecord:       optSendRecord,
          optIntelligence:     optIntelligence,
          prior_attempt:       inputData.priorAttempt,
          personnel_risk:      inputData.personnelRisk,
          resolution_blockage: inputData.resolutionBlockage,
          resolution_vision:   inputData.resolutionVision,
        }),
      });
      setDispatched(true);
    } catch (err) {
      setDispatched(true);
    }
  };

  const downloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    const prev = {
      overflow:  element.style.overflow,
      height:    element.style.height,
      maxHeight: element.style.maxHeight,
    };
    element.style.overflow  = 'visible';
    element.style.height    = 'auto';
    element.style.maxHeight = 'none';

    const canvas = await html2canvas(element, {
      scale:           2,
      backgroundColor: '#FAF9F6',
      useCORS:         true,
      logging:         false,
      scrollY:         -window.scrollY,
      windowWidth:     800,
      windowHeight:    element.scrollHeight,
      onclone: (clonedDoc) => {
        const el = clonedDoc.querySelector('[data-report-container]');
        if (el) {
          el.style.width      = '800px';
          el.style.padding    = '48px';
          el.style.height     = 'auto';
          el.style.maxHeight  = 'none';
          el.style.overflow   = 'visible';
          el.style.position   = 'relative';
          el.style.background = '#FAF9F6';
          el.style.color      = '#1C1C1C';
          el.querySelectorAll('*').forEach(node => {
            node.style.color = '#1C1C1C';
            node.style.backgroundColor = 'transparent';
            node.style.borderColor = '#D0CBC2';
          });
          el.querySelectorAll('[class*="text-brand-accent"]').forEach(node => {
            node.style.color = '#FF4500';
          });
          el.style.background = '#FAF9F6';
          el.querySelectorAll('[class*="select-none"]').forEach(node => {
            node.style.color = 'rgba(28,28,28,0.08)';
          });
          el.querySelectorAll('[class*="font-fjalla"]').forEach(node => {
            node.style.fontFamily = 'Georgia, serif';
          });
        }
      },
    });

    element.style.overflow  = prev.overflow;
    element.style.height    = prev.height;
    element.style.maxHeight = prev.maxHeight;

    const imgData   = canvas.toDataURL('image/png');
    const pdf       = new jsPDF('p', 'mm', 'a4');
    const pdfWidth  = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position   = 0;
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`Principal_Resolution_Record_${Date.now()}.pdf`);

    if (dispatchUrl) {
      fetch('/api/diagnostic-dispatch', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verdict:          state.label,
          tier:             resolvedTier,
          monthlyBurn:      monthlyBurn,
          total:            total,
          context:          summary.context,
          Client_Email:     'diagnostic@principalresolution.com',
          Opt_Send_Record:  false,
          Opt_Intelligence: false,
        }),
      }).catch(() => {});
    }
  };

  return (
    <div className="space-y-10 w-full">

      {/* ── CAPTURE TARGET ─────────────────────────────── */}
      <div
        ref={reportRef}
        data-report-container
        className="bg-brand-bg border border-brand-border p-6 md:p-10 lg:p-16 shadow-2xl relative transition-colors duration-700"
      >
        {/* Watermark */}
        <div className="absolute top-10 right-10 font-mono text-[9px] uppercase tracking-institutional opacity-10 rotate-90 origin-top-right text-brand-text font-bold select-none">
          Confidential // Record v3.1
        </div>

        <div className="space-y-12">

          {/* VERDICT */}
          <div className="space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
              Institutional State
            </span>
            <h2
              className="font-serif italic tracking-tighter text-brand-text leading-none"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 6.5rem)' }}
            >
              {state.label}.
            </h2>
            <p
              className="font-serif italic text-brand-muted border-l-4 border-brand-accent pl-4 md:pl-8 py-2 max-w-3xl leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.3rem)' }}
            >
              {state.desc}
            </p>
          </div>

          {/* COST FIGURE */}
          <div className="border-y border-brand-border/40 py-8 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">
                Annual Institutional Cost
              </span>
              <div
                className="font-fjalla text-brand-text leading-none overflow-hidden"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
              >
                {formatCurrency(total)}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">
                  Monthly Burn
                </span>
                <span
                  className="font-serif italic text-brand-accent block"
                  style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2.4rem)' }}
                >
                  {formatCurrency(monthlyBurn)}
                </span>
              </div>
              {executionGap > 0 && (
                <div className="space-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">
                    Execution Gap
                  </span>
                  <span
                    className="font-serif italic text-brand-text block"
                    style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2.4rem)' }}
                  >
                    {formatCurrency(executionGap)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ADVISOR SYNTHESIS */}
          <div className="space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
              Advisor Synthesis
            </span>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-serif italic text-brand-text leading-relaxed max-w-3xl border-l-2 border-brand-accent/40 pl-4 md:pl-8"
              style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)' }}
            >
              {synthesis}
            </motion.p>
          </div>

          {/* ADVISOR INFERENCE */}
          {(() => {
            const inferredObservation = buildInferredObservation(summary, inputData);
            return inferredObservation ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold">
                    Advisor Inference
                  </span>
                  <div className="flex-1 h-px bg-brand-border" />
                </div>
                <div className="border-l-4 border-brand-accent/40 pl-4 md:pl-6">
                  <p
                    className="font-serif italic text-brand-muted leading-relaxed"
                    style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}
                  >
                    {inferredObservation}
                  </p>
                </div>
              </div>
            ) : null;
          })()}

          {/* RECOMMENDED TIER */}
          <div className="space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
              Recommended Engagement
            </span>
            <div className="p-6 md:p-8 border border-brand-accent/30 space-y-4">
              <h3
                className="font-serif italic text-brand-text tracking-tight leading-none"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
              >
                {recommendation.name}
              </h3>
              <p
                className="font-mono text-brand-accent font-bold leading-relaxed"
                style={{ fontSize: 'clamp(0.7rem, 1vw, 0.75rem)' }}
              >
                {recommendation.outcome}
              </p>
            </div>
          </div>

          {/* WHY THIS ENGAGEMENT */}
          {(() => {
            const rationale = buildRecommendationRationale(summary, inputData);
            return rationale ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold">
                    Why This Engagement
                  </span>
                  <div className="flex-1 h-px bg-brand-border" />
                </div>
                <div className="border-l-4 border-brand-accent pl-4 md:pl-6">
                  <p
                    className="font-serif italic text-brand-text leading-relaxed"
                    style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}
                  >
                    {rationale}
                  </p>
                </div>
              </div>
            ) : null;
          })()}

          {/* COST COMPARISON */}
          <div className="space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
              The Case for Action
            </span>
            <div className="grid grid-cols-1 gap-px bg-brand-border/40 border border-brand-border/40">
              <div className="bg-brand-bg p-6 md:p-8 space-y-3">
                <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">
                  Cost of inaction // Per year
                </span>
                <div
                  className="font-fjalla text-brand-text leading-none"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}
                >
                  {formatCurrency(total)}
                </div>
                <p className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold">
                  Confirmed by this diagnostic
                </p>
              </div>
              <div className="bg-brand-accent/5 p-6 md:p-8 space-y-3 border-t border-brand-border/40">
                <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block">
                  Cost of resolution // {recommendation.name}
                </span>
                <div
                  className="font-fjalla text-brand-accent leading-none"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}
                >
                  {recommendation.feeLabel}
                </div>
                {returnMultiple && (
                  <p className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold">
                    {returnMultiple}× return on a 10% friction reduction
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>  {/* closes space-y-12 */}
      </div>    {/* closes data-report-container */}

      {/* ── DISPATCH — outside PDF capture ─────────────── */}
      <div className="border-t-2 border-brand-accent p-6 md:p-10 space-y-8 bg-brand-bg">
        <div className="space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
            Next Step
          </span>
          <h4
            className="font-serif italic text-brand-text tracking-tighter leading-tight"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            You've seen the number. Here's what to do with it.
          </h4>
          <p className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold">
            Download the record and sit with it — or let's talk about what it means for you specifically.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={downloadPDF}
            className="w-full flex items-center justify-center gap-4 border-2 border-brand-border text-brand-text font-mono text-[11px] uppercase tracking-briefing font-bold py-5 hover:border-brand-accent hover:text-brand-accent transition-all group"
          >
            <Download size={13} className="group-hover:translate-y-0.5 transition-transform" />
            Download the Record
          </button>
          <button
            onClick={() => dispatchUrl && (window.location.href = dispatchUrl)}
            className="w-full flex items-center justify-center gap-4 bg-brand-accent text-white font-mono text-[11px] uppercase tracking-briefing font-bold py-5 hover:bg-brand-text transition-all group shadow-lg"
          >
            {recommendation.cta}
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ── OPTIONAL EMAIL CAPTURE ─────────────────────── */}
        <div className="border border-brand-border p-5 space-y-5">
          <div className="space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
              Optional
            </span>
            <p className="font-serif italic text-brand-text leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}>
              Leave your email to receive this record directly — and to hear from us when new Intelligence Memos are published.
            </p>
          </div>

          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-brand-border py-3 font-serif italic text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-colors"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)' }}
          />

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={optSendRecord}
                onChange={(e) => setOptSendRecord(e.target.checked)}
                className="mt-1 accent-brand-accent shrink-0 w-4 h-4"
              />
              <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted group-hover:text-brand-text transition-colors font-bold">
                Send me this record
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={optIntelligence}
                onChange={(e) => setOptIntelligence(e.target.checked)}
                className="mt-1 accent-brand-accent shrink-0 w-4 h-4"
              />
              <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted group-hover:text-brand-text transition-colors font-bold">
                Keep me informed of new Intelligence Memos
              </span>
            </label>
          </div>

          {email && (optSendRecord || optIntelligence) && (
            dispatched ? (
              <p className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold py-4">
                Received. You'll hear from us.
              </p>
            ) : (
              <button
                onClick={handleEmailDispatch}
                className="w-full py-4 border border-brand-accent text-brand-accent font-mono text-[11px] uppercase tracking-briefing font-bold hover:bg-brand-accent hover:text-white transition-all"
              >
                Submit
              </button>
            )
          )}
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-briefing text-brand-muted hover:text-brand-accent transition-colors font-bold"
        >
          <RotateCcw size={12} />
          Run it again with different inputs
        </button>
      </div>
    </div>
  );
}
