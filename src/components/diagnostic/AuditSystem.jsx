"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import {
  runDiagnostic,
  INDUSTRY_BENCHMARKS,
  ORG_STAGES,
  LEADERSHIP_TENURES,
  FRICTION_LOCATIONS,
  AVOIDANCE_MECHANISMS,
  PRIOR_ATTEMPTS,
  PERSONNEL_RISK,
  RESOLUTION_BLOCKAGE,
  HEADCOUNT_RANGES,
  FRICTION_DURATIONS,
  DOWNSTREAM_POPULATIONS,
  METRIC_LEGEND,
} from '../../lib/diagnostic-logic';
import { useDiagnosticEngine } from '../../hooks/useDiagnosticEngine';
import ResultsLedger from './ResultsLedger';

/**
 * AuditSystem // Principal Resolution v6.0
 *
 * Changes from v5.0:
 * - New EMOTION step (between INTRO and CONTEXT) for primaryEmotion signal
 * - New `decisions` field in BEHAVIOR module
 * - Engine: runDiagnostic() replaces calculateRealitySummary()
 * - Summary shape updated to v6.0 (state.id, tier string, toneKey, agencyScore, financials)
 * - Dispatch payload updated to v6.0 field names
 * - Display lookup tables preserved for UI rendering
 */

// ── STEPS ─────────────────────────────────────────────────────────────────────
const STEPS = {
  INTRO:     -1,
  EMOTION:    0,  // new: primaryEmotion — "wade into the waters"
  CONTEXT:    1,
  PERSONNEL:  2,
  BEHAVIOR:   3,
  FINANCIAL:  4,
  RESULTS:    5,
};

const STEP_TITLES = {
  [STEPS.CONTEXT]:   "Setting the Stage.",
  [STEPS.PERSONNEL]: "Mapping the Room.",
  [STEPS.BEHAVIOR]:  "Locating the Friction.",
  [STEPS.FINANCIAL]: "Counting the Cost.",
};

// Module number display (EMOTION is not numbered — it is a pre-module beat)
const MODULE_NUMBERS = {
  [STEPS.CONTEXT]:   "Module 01 of 04",
  [STEPS.PERSONNEL]: "Module 02 of 04",
  [STEPS.BEHAVIOR]:  "Module 03 of 04",
  [STEPS.FINANCIAL]: "Module 04 of 04",
};

// ── PRIMARY EMOTION OPTIONS ───────────────────────────────────────────────────
// Human-facing labels map to engine enum values.
// The prospect never sees EXHAUSTION / FRUSTRATION / FEAR / APATHY.
const EMOTION_OPTIONS = [
  {
    value:   'EXHAUSTION',
    label:   'Tired',
    subtext: "I've been holding this longer than I should have to.",
  },
  {
    value:   'FRUSTRATION',
    label:   'Frustrated',
    subtext: "I can see what needs to happen and it keeps not happening.",
  },
  {
    value:   'FEAR',
    label:   'Uncertain',
    subtext: "I'm not sure what naming this out loud will change.",
  },
  {
    value:   'APATHY',
    label:   'Distant',
    subtext: "I've stopped expecting this to resolve on its own.",
  },
];

// ── DECISIONS OPTIONS ─────────────────────────────────────────────────────────
const DECISIONS_OPTIONS = {
  FAST:   { label: "Decisions get made and stay made" },
  SLOW:   { label: "Decisions require multiple rounds before they land" },
  STALLED:{ label: "Decisions get deferred or reopened constantly" },
};

// ── INITIAL DATA ──────────────────────────────────────────────────────────────
const initialData = {
  // v6.0 new fields
  primaryEmotion:        '',
  decisions:             '',

  // context
  industry:              '',
  orgStage:              '',
  headcountRange:        '',
  headcountDisplay:      '',
  headcount:             0,
  leadershipTenure:      '',

  // personnel
  personnel: [
    { id: 'EXECUTIVE',    label: 'Executives and Owners',  count: 0 },
    { id: 'MANAGER',      label: 'Managers and Directors', count: 0 },
    { id: 'PROFESSIONAL', label: 'Staff and Specialists',  count: 0 },
  ],

  // behavior
  frictionLocation:      '',
  avoidanceMechanism:    '',
  priorAttempt:          '',
  personnelRisk:         '',
  resolutionBlockage:    '',
  frictionDuration:      '',
  downstreamPopulation:  '',
  resolutionVision:      '',

  // financial
  payroll:               '',
  revenueBest:           '',
  revenueWorst:          '',
  stalledProjectCapital: '',
  meetingHours:          5,
  isUnsurePayroll:       false,
  isUnsureRevenue:       false,
  execCount:             undefined,
};

// ── MEMOIZED COMPONENTS ───────────────────────────────────────────────────────

const PersonnelStepper = memo(({ tier, onUpdate }) => (
  <div className="p-8 border border-brand-border hover:border-brand-accent/50 transition-colors duration-300 flex flex-col items-center gap-6">
    <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold text-center leading-relaxed">
      {tier.label}
    </span>
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={tier.count === 0 ? '' : tier.count}
      placeholder="0"
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        const num = raw === '' ? 0 : Math.min(9999, parseInt(raw, 10));
        onUpdate(tier.id, num - tier.count);
      }}
      className="w-full bg-transparent border-b-2 border-brand-border text-center font-serif italic text-brand-text focus:outline-none focus:border-brand-accent transition-colors"
      style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)' }}
    />
  </div>
));
PersonnelStepper.displayName = 'PersonnelStepper';

const OptionButton = memo(({ value, current, field, onSelect, children }) => (
  <button
    type="button"
    onClick={() => onSelect(field, value)}
    className={`w-full text-left p-5 border font-mono text-[12px] uppercase tracking-briefing font-bold transition-all duration-200
      ${current === value
        ? 'border-brand-accent text-brand-accent bg-brand-accent/5'
        : 'border-brand-border text-brand-muted hover:border-brand-accent/40 hover:text-brand-text'
      }`}
  >
    {children}
  </button>
));
OptionButton.displayName = 'OptionButton';

const CustomSelect = memo(({ value, options, field, onSelect, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selectedLabel = value ? options[value]?.label : null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full text-left border-b-2 py-4 font-mono text-[12px] uppercase tracking-briefing font-bold not-italic transition-colors flex items-center justify-between gap-4
          ${open ? 'border-brand-accent' : 'border-brand-border hover:border-brand-accent/40'}
          ${selectedLabel ? 'text-brand-text' : 'text-brand-muted'}`}
      >
        <span>{selectedLabel || placeholder}</span>
        <span className={`text-brand-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border border-brand-border bg-brand-bg shadow-2xl max-h-72 overflow-y-auto">
          {Object.entries(options).map(([key, val]) => (
            <button
              key={key}
              type="button"
              onClick={() => { onSelect(field, key); setOpen(false); }}
              className={`w-full text-left px-5 py-4 font-mono text-[12px] uppercase tracking-briefing font-bold transition-all duration-150 border-b border-brand-border/40 last:border-0
                ${value === key
                  ? 'text-brand-accent bg-brand-accent/5'
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-accent/5'
                }`}
            >
              {val.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
CustomSelect.displayName = 'CustomSelect';

const BackButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full py-5 border-2 border-brand-border text-brand-muted font-mono text-[12px] uppercase tracking-briefing font-bold hover:border-brand-accent hover:text-brand-accent transition-all flex items-center justify-center gap-3 group"
  >
    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
    Previous Step
  </button>
);

const FloatingAdvisor = ({ step, insightKey, liveInsight }) => (
  <AnimatePresence mode="wait">
    {step >= STEPS.EMOTION && step < STEPS.RESULTS && liveInsight && (
      <motion.div
        key={insightKey}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="fixed z-[150] shadow-2xl pointer-events-auto
          bottom-0 left-0 right-0
          md:bottom-8 md:right-8 md:left-auto md:w-80 xl:w-96"
        style={{ maxWidth: '100vw' }}
      >
        <div className="border-l-4 border-brand-accent bg-brand-text text-brand-bg p-4 md:p-6 relative overflow-hidden max-h-[40vh] md:max-h-none overflow-y-auto">
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-brand-accent to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 mb-3 md:mb-4 relative z-10">
            <div className="flex gap-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatType: 'loop', delay }}
                  className="w-1.5 h-1.5 rounded-full bg-brand-accent"
                />
              ))}
            </div>
            <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold">
              Advisor Intelligence
            </span>
          </div>
          <p
            className="font-serif italic leading-relaxed relative z-10 text-brand-bg"
            style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)' }}
          >
            {liveInsight}
          </p>
          <div className="flex gap-1.5 mt-3 md:mt-4 relative z-10">
            {[0,1,2,3].map(s => (
              <div
                key={s}
                className={`h-0.5 transition-all duration-500 ${
                  s === (step - 1) ? 'w-6 bg-brand-accent' :
                  s < (step - 1)  ? 'w-3 bg-brand-accent/40' :
                                    'w-3 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function AuditSystem() {
  const [step, setStep]     = useState(STEPS.INTRO);
  const [data, setData]     = useState(initialData);
  const [result, setResult] = useState(null);
  const [dispatchUrl, setDispatchUrl] = useState('');
  const sectionRef = useRef(null);

  // Scroll to top of section on step change
  useEffect(() => {
    if (step === STEPS.INTRO) return;
    if (!sectionRef.current) return;
    const top = sectionRef.current.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [step]);

  const { liveInsight, insightKey, burnIntensity } = useDiagnosticEngine(step, data);

  const formatCurrency = useCallback((val) => {
    if (!val || val === 'UNSURE') return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    }).format(val);
  }, []);

  const handleNumericInput = useCallback((field, rawValue) => {
    const numeric = rawValue.replace(/[^0-9]/g, '');
    const unsureMap = {
      payroll:      'isUnsurePayroll',
      revenueWorst: 'isUnsureRevenue',
    };
    const unsureField = unsureMap[field] || null;
    setData(prev => ({
      ...prev,
      [field]: numeric,
      ...(unsureField ? { [unsureField]: false } : {}),
    }));
  }, []);

  const updatePersonnel = useCallback((id, delta) => {
    setData(prev => ({
      ...prev,
      personnel: prev.personnel.map(p =>
        p.id === id ? { ...p, count: Math.max(0, p.count + delta) } : p
      ),
    }));
  }, []);

  const setField = useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetAudit = useCallback(() => {
    setData(initialData);
    setResult(null);
    setStep(STEPS.INTRO);
  }, []);

  const handleBack = useCallback(() => {
    setStep(prev => Math.max(STEPS.INTRO, prev - 1));
  }, []);

  // ── PROCEED VALIDATION ────────────────────────────────────────────────────
  const canProceed = () => {
    if (step === STEPS.EMOTION)   return !!data.primaryEmotion;
    if (step === STEPS.CONTEXT)   return data.industry && data.orgStage && data.leadershipTenure;
    if (step === STEPS.PERSONNEL) return data.headcountRange && data.personnel.reduce((a, p) => a + p.count, 0) > 0;
    if (step === STEPS.BEHAVIOR)  return (
      data.frictionLocation &&
      data.avoidanceMechanism &&
      data.priorAttempt &&
      data.personnelRisk &&
      data.resolutionBlockage &&
      data.frictionDuration &&
      data.downstreamPopulation &&
      data.decisions
    );
    if (step === STEPS.FINANCIAL) return true;
    return false;
  };

  // ── GENERATE RESULT ───────────────────────────────────────────────────────
  const handleAudit = () => {
    // Build inputs for v6.0 engine
    const inputs = {
      // org context
      industry:             data.industry,
      orgStage:             data.orgStage,
      leadershipTenure:     data.leadershipTenure,
      headcount:            data.headcount || 0,

      // behavioral signals
      frictionLocation:     data.frictionLocation,
      avoidanceMechanism:   data.avoidanceMechanism,
      priorAttempt:         data.priorAttempt,
      personnelRisk:        data.personnelRisk,
      resolutionBlockage:   data.resolutionBlockage,
      frictionDuration:     data.frictionDuration,
      downstreamPopulation: data.downstreamPopulation,
      decisions:            data.decisions,

      // copy modifier — zero scoring weight
      primaryEmotion:       data.primaryEmotion,

      // financial inputs
      payroll:               Number(data.payroll)               || 0,
      leadershipHoursLost:   data.meetingHours * 4              || 0, // weekly → monthly
      avgLeadershipSalary:   deriveAvgSalary(data),
      teamMultiplier:        deriveTeamMultiplier(data),
      historicalLoss:        Number(data.stalledProjectCapital)  || 0,
      monthlyRevenue:        Number(data.revenueBest)            || 0,
      stalledProjectCapital: Number(data.stalledProjectCapital)  || 0,
    };

    const diagnostic = runDiagnostic(inputs);

    // Flatten financials into the summary shape ResultsLedger expects
    const summary = {
      // state + tier
      state:        diagnostic.state,
      tier:         diagnostic.tier,
      toneKey:      diagnostic.toneKey,
      agencyScore:  diagnostic.agencyScore,
      stateScore:   diagnostic.stateScore,
      signals:      diagnostic.signals,

      // financials (flattened for display compatibility)
      total:                   diagnostic.financials.total,
      monthlyBurn:             diagnostic.financials.monthlyBurn,
      executionGap:            diagnostic.financials.executionGap,
      radiatedImpact:          diagnostic.financials.radiatedImpact,
      confirmedHistoricalLoss: diagnostic.financials.confirmedHistoricalLoss,
      showGravityFloor:        diagnostic.financials.showGravityFloor,
      leakRatio:               diagnostic.financials.leakRatio,

      // context passthrough for dispatch
      context: {
        orgStage:           data.orgStage,
        leadershipTenure:   data.leadershipTenure,
        frictionLocation:   data.frictionLocation,
        avoidanceMechanism: data.avoidanceMechanism,
      },
    };

    setResult(summary);

    // Build Dubsado dispatch URL with v6.0 field names
    const params = new URLSearchParams({
      Audit_Verdict:       diagnostic.state.label,
      Audit_Tier:          diagnostic.tier,
      Industry:            INDUSTRY_BENCHMARKS[data.industry]?.label || data.industry,
      Personnel_Risk:      data.personnelRisk,
      Resolution_Blockage: data.resolutionBlockage,
      Prior_Attempt:       data.priorAttempt,
      Org_Stage:           data.orgStage,
      Friction:            data.frictionLocation,
      Decisions:           data.decisions,
      Primary_Emotion:     data.primaryEmotion,
    });

    const formID = "698e21f6638e90df485f3b60";
    setDispatchUrl(
      `https://portal.principalresolution.com/public/form/view/${formID}?${params.toString()}`
    );

    setStep(STEPS.RESULTS);
  };

  return (
    <>
      <section
        id="audit"
        ref={sectionRef}
        className="min-h-screen bg-brand-bg text-brand-text relative flex flex-col transition-colors duration-700 overflow-hidden border-t border-brand-border/50"
      >
        {/* ATMOSPHERIC GLOW */}
        <motion.div
          animate={{
            opacity: 0.05 + (burnIntensity * 0.15),
            scale:   1 + (burnIntensity * 0.12),
          }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-brand-accent blur-[160px] pointer-events-none z-0"
          style={{ willChange: 'transform, opacity' }}
        />

        {/* HEADER */}
        <div className="w-full border-b border-brand-border/30 px-6 lg:px-24 py-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div>
            <span className="font-mono text-[13px] uppercase tracking-briefing text-brand-accent font-bold block mb-3">
              Institutional Diagnostic // 2026
            </span>
            <h2
              className="font-serif italic tracking-tighter leading-none"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
            >
              Price the <span className="text-brand-accent not-italic">Friction.</span>
            </h2>
          </div>

          {step >= STEPS.CONTEXT && (
            <div className="flex items-center gap-8">
              {step >= STEPS.CONTEXT && step < STEPS.RESULTS && (
                <div className="flex gap-2">
                  {[0,1,2,3].map(s => (
                    <div
                      key={s}
                      className={`h-0.5 transition-all duration-500 ${
                        s === (step - 1) ? 'w-10 bg-brand-accent' :
                        s < (step - 1)  ? 'w-5 bg-brand-accent/40' :
                                          'w-5 bg-brand-border'
                      }`}
                    />
                  ))}
                </div>
              )}
              {step > STEPS.EMOTION && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-briefing text-brand-muted hover:text-brand-accent transition-colors group"
                >
                  <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
              )}
              <button
                onClick={resetAudit}
                className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-briefing text-brand-muted hover:text-brand-accent transition-colors"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
          )}
        </div>

        {/* WORKSPACE */}
        <div className="flex-grow relative z-10 px-6 lg:px-24 py-16">
          <div className="w-full max-w-3xl mx-auto">
            <AnimatePresence mode="wait">

              {/* ── INTRO ──────────────────────────────────── */}
              {step === STEPS.INTRO && (
                <motion.div
                  key="step-intro"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-16 max-w-2xl"
                >
                  <div className="space-y-6">
                    <span className="font-mono text-[13px] uppercase tracking-briefing text-brand-accent font-bold block">
                      Before You Begin
                    </span>
                    <h3
                      className="font-serif italic tracking-tighter leading-none text-brand-text"
                      style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
                    >
                      Let's figure out what this is actually costing you.
                    </h3>
                    <p
                      className="font-serif italic text-brand-muted leading-relaxed border-l-2 border-brand-accent/50 pl-6"
                      style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)' }}
                    >
                      You already know something is wrong. This puts a number on it -- and names it. Not a survey, not a personality quiz. A straight look at what the friction inside your organization is costing you, built from your actual inputs.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold">
                      What you will receive
                    </h4>
                    <div className="space-y-4">
                      {[
                        "A name for the pattern your organization is running -- because unnamed problems don't get solved",
                        "An annual cost figure built from your numbers, not industry averages",
                        "A recommended next step based on your specific profile -- not a generic prescription",
                        "A side-by-side look at what inaction costs versus what resolution costs",
                        "A record you can download and bring into any leadership conversation that needs it",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="w-1.5 h-1.5 bg-brand-accent mt-2 shrink-0" />
                          <p
                            className="font-serif italic text-brand-text leading-relaxed"
                            style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}
                          >
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 border border-brand-border space-y-3">
                      <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
                        Time required
                      </span>
                      <p className="font-serif italic text-brand-text" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}>
                        Under 3 minutes. Four questions. You don't need exact numbers -- honest estimates are enough to get an honest picture.
                      </p>
                    </div>
                    <div className="p-6 border border-brand-border space-y-3">
                      <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold block">
                        How it works
                      </span>
                      <p className="font-serif italic text-brand-text" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}>
                        As you answer, the advisor reads what you're describing and tells you what it's seeing. Nothing is stored unless you choose to download it.
                      </p>
                    </div>
                  </div>

                  <p className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold">
                    No email required. No pitch waiting at the end. Just an honest picture of what's happening.
                  </p>

                  <button
                    onClick={() => setStep(STEPS.EMOTION)}
                    className="w-full py-8 bg-brand-accent text-white font-mono text-[13px] uppercase tracking-briefing font-bold hover:bg-brand-text transition-all shadow-xl flex items-center justify-center gap-4 group"
                  >
                    Show Me What This Is Costing
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {/* ── EMOTION STEP ────────────────────────────── */}
              {step === STEPS.EMOTION && (
                <motion.div
                  key="step-emotion"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-12 max-w-2xl"
                >
                  <div className="space-y-6">
                    <h3
                      className="font-serif italic tracking-tighter leading-tight text-brand-text"
                      style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                    >
                      Before we get into the numbers -- how would you describe where you are with this right now?
                    </h3>
                    <p
                      className="font-serif italic text-brand-muted leading-relaxed"
                      style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}
                    >
                      There's no wrong answer here. This helps the advisor speak to your situation rather than just your data.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EMOTION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setField('primaryEmotion', opt.value)}
                        className={`w-full text-left p-6 border transition-all duration-200 space-y-2 ${
                          data.primaryEmotion === opt.value
                            ? 'border-brand-accent bg-brand-accent/5'
                            : 'border-brand-border hover:border-brand-accent/40'
                        }`}
                      >
                        <span
                          className={`font-serif italic block leading-none ${
                            data.primaryEmotion === opt.value
                              ? 'text-brand-accent'
                              : 'text-brand-text'
                          }`}
                          style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}
                        >
                          {opt.label}
                        </span>
                        <span
                          className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold block leading-relaxed"
                        >
                          {opt.subtext}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setStep(STEPS.CONTEXT)}
                      disabled={!canProceed()}
                      className="w-full py-7 bg-brand-text text-brand-bg font-mono text-[13px] uppercase tracking-briefing font-bold hover:bg-brand-accent hover:text-white transition-all shadow-xl flex items-center justify-center gap-4 group disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      Continue
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <BackButton onClick={handleBack} />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 1: CONTEXT ────────────────────────── */}
              {step === STEPS.CONTEXT && (
                <motion.div
                  key="step-context"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-10"
                >
                  <div>
                    <span className="font-mono text-[13px] uppercase tracking-briefing text-brand-accent font-bold block mb-3">
                      {MODULE_NUMBERS[STEPS.CONTEXT]}
                    </span>
                    <h3
                      className="font-serif italic tracking-tighter leading-none text-brand-text"
                      style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                    >
                      {STEP_TITLES[STEPS.CONTEXT]}
                    </h3>
                  </div>

                  <div className="space-y-3">
  <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
    Sector
  </label>
  <CustomSelect
    value={data.industry}
    options={INDUSTRY_BENCHMARKS}
    field="industry"
    onSelect={setField}
    placeholder="Select your sector"
  />
</div>

                  <div className="space-y-3">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      Organizational Stage
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(ORG_STAGES).map(([key, val]) => (
                        <OptionButton key={key} value={key} current={data.orgStage} field="orgStage" onSelect={setField}>
                          {val.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      How long has current leadership been in place?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(LEADERSHIP_TENURES).map(([key, val]) => (
                        <OptionButton key={key} value={key} current={data.leadershipTenure} field="leadershipTenure" onSelect={setField}>
                          {val.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setStep(STEPS.PERSONNEL)}
                      disabled={!canProceed()}
                      className="w-full py-7 bg-brand-text text-brand-bg font-mono text-[13px] uppercase tracking-briefing font-bold hover:bg-brand-accent hover:text-white transition-all shadow-xl flex items-center justify-center gap-4 group disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      Map the Room
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <BackButton onClick={handleBack} />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: PERSONNEL ──────────────────────── */}
              {step === STEPS.PERSONNEL && (
                <motion.div
                  key="step-personnel"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-10"
                >
                  <div>
                    <span className="font-mono text-[13px] uppercase tracking-briefing text-brand-accent font-bold block mb-3">
                      {MODULE_NUMBERS[STEPS.PERSONNEL]}
                    </span>
                    <h3
                      className="font-serif italic tracking-tighter leading-none text-brand-text"
                      style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                    >
                      {STEP_TITLES[STEPS.PERSONNEL]}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      Approximately how many people work in your organization?
                    </label>
                    <input
                      type="text"
                      placeholder="Estimated total headcount"
                      value={data.headcountRange ? data.headcountDisplay || '' : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        const num = parseInt(raw, 10);
                        const bucket = !raw ? ''
                          : num < 25  ? 'MICRO'
                          : num < 100 ? 'SMALL'
                          : num < 500 ? 'MID'
                          : 'LARGE';
                        setData(prev => ({
                          ...prev,
                          headcountRange:   bucket,
                          headcountDisplay: raw,
                          headcount:        num || 0,
                        }));
                      }}
                      className="w-full bg-transparent border-b-2 border-brand-border py-4 font-serif italic text-brand-text focus:outline-none focus:border-brand-accent transition-colors"
                      style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }}
                    />
                  </div>

                  <div className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold space-y-3">
                    <p>This diagnostic measures what leadership friction is costing your organization. Enter the number of people in each role category for the group this assessment is about.</p>
                    <p>Not sure how to scope it? Three common starting points:</p>
                    <p>-- A pure executive team: 3 Executives, 0 Managers, 0 Staff</p>
                    <p>-- A department with its leadership: 1 Executive, 2 Managers, 8 Staff</p>
                    <p>-- A cross-functional group: 2 Executives, 4 Managers, 0 Staff</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {data.personnel.map(tier => (
                      <PersonnelStepper key={tier.id} tier={tier} onUpdate={updatePersonnel} />
                    ))}
                  </div>

                  {data.personnel.reduce((a, p) => a + p.count, 0) > 0 && (
                    <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold">
                      <div className="w-4 h-px bg-brand-accent" />
                      {data.personnel.reduce((a, p) => a + p.count, 0)} people in the room
                      <div className="flex-1 h-px bg-brand-border" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={() => setStep(STEPS.BEHAVIOR)}
                      disabled={!canProceed()}
                      className="w-full py-7 bg-brand-text text-brand-bg font-mono text-[13px] uppercase tracking-briefing font-bold hover:bg-brand-accent hover:text-white transition-all shadow-xl flex items-center justify-center gap-4 group disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      Locate the Friction
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <BackButton onClick={handleBack} />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: BEHAVIOR ───────────────────────── */}
              {step === STEPS.BEHAVIOR && (
                <motion.div
                  key="step-behavior"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-10"
                >
                  <div>
                    <span className="font-mono text-[13px] uppercase tracking-briefing text-brand-accent font-bold block mb-3">
                      {MODULE_NUMBERS[STEPS.BEHAVIOR]}
                    </span>
                    <h3
                      className="font-serif italic tracking-tighter leading-none text-brand-text"
                      style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                    >
                      {STEP_TITLES[STEPS.BEHAVIOR]}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      Every organization carries friction somewhere. Where does it tend to concentrate in yours?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(FRICTION_LOCATIONS).map(([key, val]) => (
                        <OptionButton key={key} value={key} current={data.frictionLocation} field="frictionLocation" onSelect={setField}>
                          {val.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      When difficult conversations don't happen here, what's the usual reason?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(AVOIDANCE_MECHANISMS).map(([key, val]) => (
                        <OptionButton key={key} value={key} current={data.avoidanceMechanism} field="avoidanceMechanism" onSelect={setField}>
                          {val.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      Has your organization attempted to address this before?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(PRIOR_ATTEMPTS).map(([key, val]) => (
                        <OptionButton key={key} value={key} current={data.priorAttempt} field="priorAttempt" onSelect={setField}>
                          {val.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      Is there someone this situation is making it harder to keep?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(PERSONNEL_RISK).map(([key, val]) => (
                        <OptionButton key={key} value={key} current={data.personnelRisk} field="personnelRisk" onSelect={setField}>
                          {val.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      Is there a personnel decision that has been identified but you haven't been able to move forward?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(RESOLUTION_BLOCKAGE).map(([key, val]) => (
                        <OptionButton key={key} value={key} current={data.resolutionBlockage} field="resolutionBlockage" onSelect={setField}>
                          {val.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      How long has this been going on?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(FRICTION_DURATIONS).map(([key, val]) => (
                        <OptionButton key={key} value={key} current={data.frictionDuration} field="frictionDuration" onSelect={setField}>
                          {val.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      Beyond the friction group itself, how many people are waiting on decisions this situation is holding up?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(DOWNSTREAM_POPULATIONS).map(([key, val]) => (
                        <OptionButton key={key} value={key} current={data.downstreamPopulation} field="downstreamPopulation" onSelect={setField}>
                          {val.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  {/* ── NEW v6.0: DECISION VELOCITY ──────────────────────── */}
                  <div className="space-y-3">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      How would you describe the way decisions get made in this organization right now?
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(DECISIONS_OPTIONS).map(([key, val]) => (
                        <OptionButton key={key} value={key} current={data.decisions} field="decisions" onSelect={setField}>
                          {val.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setStep(STEPS.FINANCIAL)}
                      disabled={!canProceed()}
                      className="w-full py-7 bg-brand-text text-brand-bg font-mono text-[13px] uppercase tracking-briefing font-bold hover:bg-brand-accent hover:text-white transition-all shadow-xl flex items-center justify-center gap-4 group disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      Count the Cost
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <BackButton onClick={handleBack} />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: FINANCIAL ──────────────────────── */}
              {step === STEPS.FINANCIAL && (
                <motion.div
                  key="step-financial"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-10"
                >
                  <div>
                    <span className="font-mono text-[13px] uppercase tracking-briefing text-brand-accent font-bold block mb-3">
                      {MODULE_NUMBERS[STEPS.FINANCIAL]}
                    </span>
                    <h3
                      className="font-serif italic tracking-tighter leading-none text-brand-text"
                      style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                    >
                      {STEP_TITLES[STEPS.FINANCIAL]}
                    </h3>
                    <p className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold mt-3">
                      All fields optional. Estimates are sufficient. Bypasses available for every input.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                        Annual Cumulative Payroll
                      </label>
                      <input
                        type="text"
                        placeholder="Estimate is sufficient"
                        value={data.isUnsurePayroll ? 'USING INDUSTRY ESTIMATE' : formatCurrency(data.payroll)}
                        onChange={(e) => handleNumericInput('payroll', e.target.value)}
                        className={`w-full bg-transparent border-b-2 border-brand-border py-3 font-serif italic focus:outline-none focus:border-brand-accent transition-colors ${data.isUnsurePayroll ? 'text-brand-accent' : 'text-brand-text'}`}
                        style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }}
                      />
                      <button
                        type="button"
                        onClick={() => setData(prev => ({ ...prev, isUnsurePayroll: true, payroll: 'UNSURE' }))}
                        className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent hover:underline font-bold"
                      >
                        Use industry average instead
                      </button>
                    </div>

                    <div className="space-y-3">
                      <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                        Capital in Stalled Initiatives
                      </label>
                      <input
                        type="text"
                        placeholder="Optional"
                        value={formatCurrency(data.stalledProjectCapital)}
                        onChange={(e) => handleNumericInput('stalledProjectCapital', e.target.value)}
                        className="w-full bg-transparent border-b-2 border-brand-border py-3 font-serif italic text-brand-text focus:outline-none focus:border-brand-accent transition-colors"
                        style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                        Target Monthly Revenue
                      </label>
                      <input
                        type="text"
                        placeholder="Optional"
                        value={formatCurrency(data.revenueBest)}
                        onChange={(e) => handleNumericInput('revenueBest', e.target.value)}
                        className="w-full bg-transparent border-b-2 border-brand-border py-3 font-serif italic text-brand-text focus:outline-none focus:border-brand-accent transition-colors"
                        style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                        Current Monthly Trend
                      </label>
                      <input
                        type="text"
                        placeholder="Optional"
                        value={data.isUnsureRevenue ? 'USING SECTOR PROJECTION' : formatCurrency(data.revenueWorst)}
                        onChange={(e) => handleNumericInput('revenueWorst', e.target.value)}
                        className={`w-full bg-transparent border-b-2 border-brand-border py-3 font-serif italic focus:outline-none focus:border-brand-accent transition-colors ${data.isUnsureRevenue ? 'text-brand-accent' : 'text-brand-text'}`}
                        style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }}
                      />
                      <button
                        type="button"
                        onClick={() => setData(prev => ({ ...prev, isUnsureRevenue: true, revenueWorst: 'UNSURE' }))}
                        className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent hover:underline font-bold"
                      >
                        Use sector projection instead
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      If this situation resolved completely in the next 90 days, what would become possible that isn't possible now?
                    </label>
                    <p className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold">
                      Optional. Whatever is shared here will not be reshared anywhere -- not even in your report.
                    </p>
                    <textarea
                      placeholder="What does the other side of this look like for you?"
                      value={data.resolutionVision}
                      onChange={(e) => setData(prev => ({ ...prev, resolutionVision: e.target.value }))}
                      rows={3}
                      className="w-full bg-transparent border border-brand-border p-4 font-serif italic text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-colors resize-none"
                      style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}
                    />
                  </div>

                  {/* CRITICAL: DO NOT RENAME OR REMOVE. Used by Playwright forensic matrix testing. */}
                  {/* This is the Forensic Portal -- a hidden input that allows automated tests       */}
                  {/* to inject a manual execCount value, bypassing the 5% headcount formula.        */}
                  <input
                    type="hidden"
                    id="execCount-override"
                    value={data.execCount || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val > 0) {
                        setData(prev => ({ ...prev, execCount: val }));
                      }
                    }}
                  />

                  <div className="space-y-4">
                    <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                      Weekly Meeting Burden -- {data.meetingHours} {data.meetingHours === 1 ? 'hour' : 'hours'}
                    </label>
                    <input
                      type="range" min="0" max="40" step="1"
                      value={data.meetingHours}
                      onChange={(e) => setField('meetingHours', Number(e.target.value))}
                      className="w-full h-0.5 bg-brand-border rounded appearance-none cursor-pointer accent-brand-accent"
                    />
                    <div className="flex justify-between font-mono text-[11px] text-brand-muted uppercase tracking-briefing">
                      <span>None</span>
                      <span>20 hrs</span>
                      <span>40 hrs</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleAudit}
                      className="w-full py-7 bg-brand-accent text-white font-mono text-[13px] uppercase tracking-briefing font-bold hover:bg-brand-text hover:text-brand-bg transition-all shadow-xl flex items-center justify-center gap-4 group"
                    >
                      Generate Institutional Record
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <BackButton onClick={handleBack} />
                  </div>
                </motion.div>
              )}

              {/* ── RESULTS ────────────────────────────────── */}
              {step === STEPS.RESULTS && result && (
                <motion.div
                  key="step-results"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ResultsLedger
                    summary={result}
                    dispatchUrl={dispatchUrl}
                    onReset={resetAudit}
                    onBack={handleBack}
                    inputData={data}
                  />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </section>

      <FloatingAdvisor
        step={step}
        insightKey={insightKey}
        liveInsight={liveInsight}
      />
    </>
  );
}

// ── FINANCIAL DERIVATION HELPERS ──────────────────────────────────────────────
// These convert the form inputs into values the v6.0 engine expects.
// Kept local to AuditSystem — not engine logic, just input translation.

function deriveAvgSalary(data) {
  // Use payroll / total headcount as a proxy for avg leadership salary
  // Falls back to industry-typical estimate if payroll not provided
  const payroll  = Number(data.payroll) || 0;
  const headcount = data.headcount || 1;
  if (payroll > 0) return Math.round(payroll / headcount);

  // Industry fallback estimates (annual)
  const fallbacks = {
    TECH:         160000,
    FINANCE:      180000,
    CONSULTING:   150000,
    HEALTH:       140000,
    NONPROFIT:    100000,
    MEDIA:        120000,
    MANUFACTURING:110000,
    RETAIL:       90000,
    ENERGY:       130000,
    CONSTRUCTION: 105000,
    LOGISTICS:    100000,
    OTHER:        120000,
  };
  return fallbacks[data.industry] || 120000;
}

function deriveTeamMultiplier(data) {
  // Team multiplier reflects radiated impact beyond the direct friction group
  const downstream = data.downstreamPopulation;
  const map = {
    NONE:     1.0,
    SMALL:    1.3,
    MEDIUM:   1.6,
    LARGE:    2.0,
    FULL_ORG: 2.5,
  };
  return map[downstream] || 1.0;
}