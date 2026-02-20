"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import {
  calculateRealitySummary,
  INDUSTRY_BENCHMARKS,
  ORG_STAGES,
  LEADERSHIP_TENURES,
  FRICTION_LOCATIONS,
  AVOIDANCE_MECHANISMS,
  PRIOR_ATTEMPTS,
  PERSONNEL_RISK,
  RESOLUTION_BLOCKAGE,
  HEADCOUNT_RANGES,
} from '../../lib/diagnostic-logic';
import { useDiagnosticEngine } from '../../hooks/useDiagnosticEngine';
import ResultsLedger from './ResultsLedger';

/**
 * AuditSystem // Principal Resolution v3.2
 * Fix: scroll-to-section-top on step transitions.
 * Tenet: Truth (Absolute Candor).
 */

const STEPS = {
  INTRO:     -1,
  CONTEXT:    0,
  PERSONNEL:  1,
  BEHAVIOR:   2,
  FINANCIAL:  3,
  RESULTS:    4,
};

const STEP_TITLES = {
  [STEPS.CONTEXT]:   "Setting the Stage.",
  [STEPS.PERSONNEL]: "Mapping the Room.",
  [STEPS.BEHAVIOR]:  "Locating the Friction.",
  [STEPS.FINANCIAL]: "Counting the Cost.",
};

const initialData = {
  industry:              '',
  orgStage:              '',
  headcountRange:        '',
  headcountDisplay:      '',
  leadershipTenure:      '',
  personnel: [
    { id: 'EXECUTIVE',    label: 'Executives and Owners',  count: 0 },
    { id: 'MANAGER',      label: 'Managers and Directors', count: 0 },
    { id: 'PROFESSIONAL', label: 'Staff and Specialists',  count: 0 },
  ],
  frictionLocation:      '',
  avoidanceMechanism:    '',
  priorAttempt:          '',
  personnelRisk:         '',
  resolutionBlockage:    '',
  resolutionVision:      '',
  payroll:               '',
  revenueBest:           '',
  revenueWorst:          '',
  stalledProjectCapital: '',
  meetingHours:          5,
  isUnsurePayroll:       false,
  isUnsureRevenue:       false,
};

// ── MEMOIZED PERSONNEL STEPPER ──────────────────────────────────
const PersonnelStepper = memo(({ tier, onUpdate }) => (
  <div className="p-8 border border-brand-border hover:border-brand-accent/50 transition-colors duration-300 flex flex-col items-center gap-6">
    <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold text-center leading-relaxed">
      {tier.label}
    </span>
    <div className="flex items-center gap-6">
      <button
        type="button"
        onPointerDown={(e) => { e.preventDefault(); onUpdate(tier.id, -1); }}
        className="w-10 h-10 border border-brand-border text-brand-muted hover:text-brand-accent hover:border-brand-accent transition-colors duration-150 font-bold text-xl flex items-center justify-center select-none"
      >
        −
      </button>
      <span
        className="font-serif text-brand-text w-10 text-center tabular-nums"
        style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)' }}
      >
        {tier.count}
      </span>
      <button
        type="button"
        onPointerDown={(e) => { e.preventDefault(); onUpdate(tier.id, 1); }}
        className="w-10 h-10 border border-brand-border text-brand-muted hover:text-brand-accent hover:border-brand-accent transition-colors duration-150 font-bold text-xl flex items-center justify-center select-none"
      >
        +
      </button>
    </div>
  </div>
));
PersonnelStepper.displayName = 'PersonnelStepper';

// ── OPTION BUTTON ───────────────────────────────────────────────
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

// ── FLOATING ADVISOR — defined outside to prevent remount on parent re-render ──
const FloatingAdvisor = ({ step, insightKey, liveInsight }) => (
  <AnimatePresence mode="wait">
    {step >= 0 && step < 4 && liveInsight && (
      <motion.div
        key={insightKey}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="fixed z-[150] shadow-2xl pointer-events-none
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
                  s === step ? 'w-6 bg-brand-accent' :
                  s < step   ? 'w-3 bg-brand-accent/40' :
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

export default function AuditSystem() {
  const [step, setStep]     = useState(STEPS.INTRO);
  const [data, setData]     = useState(initialData);
  const [result, setResult] = useState(null);
  const [dispatchUrl, setDispatchUrl] = useState('');
  const [showInsight, setShowInsight] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const activeFieldRef = useRef(null);
  const sectionRef = useRef(null);

  // ── SCROLL FIX ──────────────────────────────────────────────
  // On every step change, scroll the top of the audit section into
  // view so the module header + first question land at the top of
  // the viewport. 80px offset preserves the sticky site nav.
  // INTRO is excluded — it's entered by scrolling to #audit naturally.
  useEffect(() => {
    if (step === STEPS.INTRO) return;
    if (!sectionRef.current) return;
    const top = sectionRef.current.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [step]);

  const { liveInsight, insightKey, burnIntensity } = useDiagnosticEngine(step, data);

  useEffect(() => {
    setShowInsight(false);
    const timer = setTimeout(() => setShowInsight(true), 700);
    return () => clearTimeout(timer);
  }, [insightKey]);

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
    setActiveField(field);
  }, []);

  const resetAudit = useCallback(() => {
    setData(initialData);
    setResult(null);
    setStep(STEPS.INTRO);
    setActiveField(null);
  }, []);

  const handleAudit = () => {
    const summary = calculateRealitySummary(data);
    setResult(summary);

    const params = new URLSearchParams({
  Audit_Verdict:       summary.state.label,
  Industry:            INDUSTRY_BENCHMARKS[data.industry]?.label || data.industry,
  Recommended:         summary.recommendation.name,
  Personnel_Risk:      data.personnelRisk,
  Resolution_Blockage: data.resolutionBlockage,
  Prior_Attempt:       data.priorAttempt,
  Org_Stage:           data.orgStage,
  Friction:            data.frictionLocation,
});
    const formID = "698e21f6638e90df485f3b60";
    setDispatchUrl(
      `https://portal.principalresolution.com/public/form/view/${formID}?${params.toString()}`
    );
    setStep(STEPS.RESULTS);
  };

  const canProceed = () => {
    if (step === STEPS.CONTEXT)   return data.industry && data.orgStage && data.headcountRange && data.leadershipTenure;
    if (step === STEPS.PERSONNEL) return data.personnel.reduce((a, p) => a + p.count, 0) > 0;
if (step === STEPS.BEHAVIOR)  return data.frictionLocation && data.avoidanceMechanism && data.priorAttempt && data.personnelRisk && data.resolutionBlockage;
    if (step === STEPS.FINANCIAL) return true;
    return false;
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

          {step >= STEPS.CONTEXT && step < STEPS.RESULTS && (
            <div className="flex items-center gap-8">
              <div className="flex gap-2">
                {[0,1,2,3].map(s => (
                  <div
                    key={s}
                    className={`h-0.5 transition-all duration-500 ${
                      s === step ? 'w-10 bg-brand-accent' :
                      s < step   ? 'w-5 bg-brand-accent/40' :
                                   'w-5 bg-brand-border'
                    }`}
                  />
                ))}
              </div>
              {step > STEPS.CONTEXT && (
                <button
                  onClick={() => setStep(s => s - 1)}
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
                    You already know something is wrong. This puts a number on it — and names it. Not a survey, not a personality quiz. A straight look at what the friction inside your organization is costing you, built from your actual inputs.
                  </p>
                </div>

                <div className="space-y-6">
                  <h4 className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold">
                    What you will receive
                  </h4>
                  <div className="space-y-4">
                    {[
  "A name for the pattern your organization is running — because unnamed problems don't get solved",
  "An annual cost figure built from your numbers, not industry averages",
  "A recommended next step based on your specific profile — not a generic prescription",
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
                      Under 3 minutes. Four questions. You don't need exact numbers — honest estimates are enough to get an honest picture.
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
                  onClick={() => setStep(STEPS.CONTEXT)}
                  className="w-full py-8 bg-brand-accent text-white font-mono text-[13px] uppercase tracking-briefing font-bold hover:bg-brand-text transition-all shadow-xl flex items-center justify-center gap-4 group"
                >
                  Show Me What This Is Costing
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* ── STEP 0: CONTEXT ────────────────────────── */}
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
                    Module 01 of 04
                  </span>
                  <h3
                    className="font-serif italic tracking-tighter leading-none text-brand-text"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                  >
                    {STEP_TITLES[STEPS.CONTEXT]}
                  </h3>
                </div>

                <div className="space-y-3" onFocus={() => setActiveField('industry')}>
                  <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                    Sector
                  </label>
                  <select
                    value={data.industry}
                    onChange={(e) => setField('industry', e.target.value)}
                    className="w-full bg-transparent border-b-2 border-brand-border py-4 font-serif italic text-brand-text focus:outline-none focus:border-brand-accent appearance-none cursor-pointer transition-colors"
                    style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }}
                  >
                    <option value="" disabled className="bg-brand-bg text-brand-muted font-sans text-base">
                      Select your sector
                    </option>
                    {Object.entries(INDUSTRY_BENCHMARKS).map(([key, val]) => (
                      <option key={key} value={key} className="bg-brand-bg text-brand-text font-sans text-base">
                        {val.label}
                      </option>
                    ))}
                  </select>
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
                        headcountRange: bucket,
                        headcountDisplay: raw,
                      }));
                    }}
                    className="w-full bg-transparent border-b-2 border-brand-border py-4 font-serif italic text-brand-text focus:outline-none focus:border-brand-accent transition-colors"
                    style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }}
                  />
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

                <button
                  onClick={() => setStep(STEPS.PERSONNEL)}
                  disabled={!canProceed()}
                  className="w-full py-7 bg-brand-text text-brand-bg font-mono text-[13px] uppercase tracking-briefing font-bold hover:bg-brand-accent hover:text-white transition-all shadow-xl flex items-center justify-center gap-4 group disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  Map the Room
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* ── STEP 1: PERSONNEL ──────────────────────── */}
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
                    Module 02 of 04
                  </span>
                  <h3
                    className="font-serif italic tracking-tighter leading-none text-brand-text"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                  >
                    {STEP_TITLES[STEPS.PERSONNEL]}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-briefing text-brand-muted font-bold mt-4">
                    Count the leadership group being assessed — not the full organization.
                  </p>
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

                <button
                  onClick={() => setStep(STEPS.BEHAVIOR)}
                  disabled={!canProceed()}
                  className="w-full py-7 bg-brand-text text-brand-bg font-mono text-[13px] uppercase tracking-briefing font-bold hover:bg-brand-accent hover:text-white transition-all shadow-xl flex items-center justify-center gap-4 group disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  Locate the Friction
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: BEHAVIORAL ─────────────────────── */}
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
        Module 03 of 04
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

    <button
      onClick={() => setStep(STEPS.FINANCIAL)}
      disabled={!canProceed()}
      className="w-full py-7 bg-brand-text text-brand-bg font-mono text-[13px] uppercase tracking-briefing font-bold hover:bg-brand-accent hover:text-white transition-all shadow-xl flex items-center justify-center gap-4 group disabled:opacity-25 disabled:cursor-not-allowed"
    >
      Count the Cost
      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </motion.div>
)}

            {/* ── STEP 3: FINANCIAL ──────────────────────── */}
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
                    Module 04 of 04
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
                      onFocus={() => setActiveField('payroll')}
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
                      onFocus={() => setActiveField('stalledCapital')}
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
                      onFocus={() => setActiveField('revenueBest')}
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
                      onFocus={() => setActiveField('revenueWorst')}
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
    Optional. Whatever is shared here will not be reshared anywhere — not even in your report.
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
                <div className="space-y-4">
                  <label className="font-mono text-[12px] uppercase tracking-briefing text-brand-muted font-bold block">
                    Weekly Meeting Burden — {data.meetingHours} {data.meetingHours === 1 ? 'hour' : 'hours'}
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

                <button
                  onClick={handleAudit}
                  className="w-full py-7 bg-brand-accent text-white font-mono text-[13px] uppercase tracking-briefing font-bold hover:bg-brand-text hover:text-brand-bg transition-all shadow-xl flex items-center justify-center gap-4 group"
                >
                  Generate Institutional Record
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
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
                  inputData={data}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
</section>

      {/* FLOATING ADVISOR — outside section to escape overflow-hidden stacking context */}
      <FloatingAdvisor
        step={step}
        insightKey={insightKey}
        liveInsight={liveInsight}
      />
    </>

  );
}
