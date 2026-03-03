"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * SignalMatrix // Principal Resolution v6.0
 *
 * A diagnostic artifact — not a chart. Renders the behavioral and financial
 * signals that fired during the assessment as illuminated cells in a grid.
 * Lit cells = signals that contributed to state assignment.
 * Dim cells = signals that were evaluated but did not fire.
 * The active state name anchors the composition.
 *
 * Cells illuminate in sequence on mount, reading left to right, top to bottom.
 * The effect: the prospect watches their diagnostic being assembled in real time.
 */

// ── SIGNAL DEFINITIONS ────────────────────────────────────────────────────────
// Each signal has: id, label (short), category, and a resolver function
// that returns true if the signal fired given inputData + summary.

const SIGNALS = [
  // ── ROW 1: Organizational structure ──────────────────────────────────────
  {
    id:       'leadership_tenure',
    label:    'Entrenched Leadership',
    category: 'structure',
    fired:    ({ inputData }) => inputData.leadershipTenure === 'SEVEN_PLUS',
  },
  {
    id:       'legacy_stage',
    label:    'Institutional Inertia',
    category: 'structure',
    fired:    ({ inputData }) => inputData.orgStage === 'LEGACY',
  },
  {
    id:       'large_headcount',
    label:    'Coordination Overhead',
    category: 'structure',
    fired:    ({ inputData }) => inputData.headcount >= 100,
  },
  {
    id:       'new_leadership',
    label:    'Transitional Instability',
    category: 'structure',
    fired:    ({ inputData }) => inputData.leadershipTenure === 'UNDER_ONE',
  },
  {
    id:       'growth_stage',
    label:    'Scaling Pressure',
    category: 'structure',
    fired:    ({ inputData }) => inputData.orgStage === 'GROWTH',
  },
  {
    id:       'startup_stage',
    label:    'Structural Immaturity',
    category: 'structure',
    fired:    ({ inputData }) => inputData.orgStage === 'EARLY',
  },

  // ── ROW 2: Conflict location + evasion ───────────────────────────────────
  {
    id:       'within_leadership',
    label:    'Authority Conflict',
    category: 'conflict',
    fired:    ({ inputData }) => inputData.frictionLocation === 'WITHIN_LEADERSHIP',
  },
  {
    id:       'cross_functional',
    label:    'Siloed Execution',
    category: 'conflict',
    fired:    ({ inputData }) => inputData.frictionLocation === 'CROSS_FUNCTIONAL',
  },
  {
    id:       'team_friction',
    label:    'Surface-Level Friction',
    category: 'conflict',
    fired:    ({ inputData }) => inputData.frictionLocation === 'TEAM',
  },
  {
    id:       'no_forum',
    label:    'No Resolution Path',
    category: 'evasion',
    fired:    ({ inputData }) => inputData.avoidanceMechanism === 'NO_FORUM',
  },
  {
    id:       'predetermined',
    label:    'Outcome Fixed in Advance',
    category: 'evasion',
    fired:    ({ inputData }) => inputData.avoidanceMechanism === 'PREDETERMINED',
  },
  {
    id:       'cost_too_high',
    label:    'Conflict Avoidance Active',
    category: 'evasion',
    fired:    ({ inputData }) => inputData.avoidanceMechanism === 'COST_TOO_HIGH',
  },

  // ── ROW 3: People risk + obstruction ─────────────────────────────────────
  {
    id:       'personnel_lost',
    label:    'Talent Already Gone',
    category: 'people_risk',
    fired:    ({ inputData }) => inputData.personnelRisk === 'LOST',
  },
  {
    id:       'personnel_at_risk',
    label:    'Departure Risk Active',
    category: 'people_risk',
    fired:    ({ inputData }) => inputData.personnelRisk === 'YES',
  },
  {
    id:       'active_blockage',
    label:    'Resolution Actively Blocked',
    category: 'obstruction',
    fired:    ({ inputData }) => inputData.resolutionBlockage === 'ATTEMPTED',
  },
  {
    id:       'known_blockage',
    label:    'Known Obstacle, No Movement',
    category: 'obstruction',
    fired:    ({ inputData }) => inputData.resolutionBlockage === 'KNOWN',
  },
  {
    id:       'prior_external',
    label:    'Outside Help Already Failed',
    category: 'prior_attempts',
    fired:    ({ inputData }) => inputData.priorAttempt === 'EXTERNAL',
  },
  {
    id:       'prior_conversation',
    label:    'Conversation Didn\'t Hold',
    category: 'prior_attempts',
    fired:    ({ inputData }) => inputData.priorAttempt === 'CONVERSATION',
  },

  // ── ROW 4: Time in pattern + exposure + velocity ──────────────────────────
  {
    id:       'duration_long',
    label:    'Friction Compounding',
    category: 'time_in_pattern',
    fired:    ({ inputData }) => ['ONE_2YR', 'OVER_2YR'].includes(inputData.frictionDuration),
  },
  {
    id:       'duration_mid',
    label:    'Pattern Established',
    category: 'time_in_pattern',
    fired:    ({ inputData }) => ['SIX_12MO', 'UNDER_6MO'].includes(inputData.frictionDuration),
  },
  {
    id:       'downstream_large',
    label:    'Organization-Wide Exposure',
    category: 'exposure',
    fired:    ({ inputData }) => ['LARGE', 'FULL_ORG'].includes(inputData.downstreamPopulation),
  },
  {
    id:       'downstream_medium',
    label:    'Team-Level Exposure',
    category: 'exposure',
    fired:    ({ inputData }) => inputData.downstreamPopulation === 'INDIVIDUAL',
  },
  {
    id:       'decisions_stalled',
    label:    'Decisions Stopped',
    category: 'velocity',
    fired:    ({ inputData }) => inputData.decisions === 'STALLED',
  },
  {
    id:       'decisions_slow',
    label:    'Decision Velocity Low',
    category: 'velocity',
    fired:    ({ inputData }) => inputData.decisions === 'SLOW',
  },

  // ── ROW 5: Cost signals ───────────────────────────────────────────────────
  {
    id:       'high_leak_ratio',
    label:    'Capital Bleeding',
    category: 'cost_signals',
    fired:    ({ summary }) => (parseFloat(summary.leakRatio) || 0) >= 0.06,
  },
  {
    id:       'gravity_floor',
    label:    'Cost Too Low to Quantify',
    category: 'cost_signals',
    fired:    ({ summary }) => !!summary.showGravityFloor,
  },
  {
    id:       'execution_gap',
    label:    'Leadership Hours Lost',
    category: 'cost_signals',
    fired:    ({ summary }) => (summary.executionGap || 0) > 0,
  },
  {
    id:       'stalled_capital',
    label:    'Capital Tied to Friction',
    category: 'cost_signals',
    fired:    ({ summary }) => (summary.confirmedHistoricalLoss || 0) > 0,
  },
  {
    id:       'high_severity',
    label:    'State: Critical',
    category: 'risk_level',
    fired:    ({ summary }) => summary.state?.severity === 'high',
  },
  {
    id:       'agency_constrained',
    label:    'Resolution Capacity Low',
    category: 'risk_level',
    fired:    ({ summary }) => (summary.agencyScore || 0) < 40,
  },
];

// ── CATEGORY COLORS ────────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  structure:       { color: '#6B6560', label: 'Structure'       },
  conflict:        { color: '#FF4500', label: 'Conflict'        },
  people_risk:     { color: '#CC2200', label: 'People Risk'     },
  obstruction:     { color: '#FF6B6B', label: 'Obstruction'     },
  risk_level:      { color: '#991A00', label: 'Risk Level'      },
  evasion:         { color: '#2D6A4F', label: 'Evasion'         },
  prior_attempts:  { color: '#52B788', label: 'Prior Attempts'  },
  velocity:        { color: '#95D5B2', label: 'Velocity'        },
  time_in_pattern: { color: '#1B4F72', label: 'Time in Pattern' },
  exposure:        { color: '#2E86AB', label: 'Exposure'        },
  cost_signals:    { color: '#7EC8E3', label: 'Cost Signals'    },
};

// ── SIGNAL CELL ───────────────────────────────────────────────────────────────
const SignalCell = ({ signal, fired, delay, revealed }) => {
  const cfg   = CATEGORY_CONFIG[signal.category];
  const color = fired ? cfg.color : 'transparent';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={revealed ? {
        opacity: fired ? 1 : 0.18,
        scale:   1,
      } : { opacity: 0, scale: 0.85 }}
      transition={{
        duration: fired ? 0.5 : 0.3,
        delay:    revealed ? delay : 0,
        ease:     'easeOut',
      }}
      className="relative group"
      title={signal.label}
    >
      {/* Cell body */}
      <div
        className="relative overflow-hidden transition-all duration-300"
        style={{
          border:           `1px solid ${fired ? color : '#D0CBC2'}`,
          backgroundColor:  fired ? `${color}12` : 'transparent',
          padding:          '10px 8px',
          minHeight:        '52px',
        }}
      >
        {/* Fired indicator — top-left pip */}
        {fired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.3 }}
            className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}

        {/* Corner accent for fired cells */}
        {fired && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.4, ease: 'easeOut' }}
            className="absolute top-0 left-0 right-0 h-px origin-left"
            style={{ backgroundColor: color }}
          />
        )}

        {/* Label */}
        <span
          className="font-mono font-bold leading-tight block"
          style={{
            fontSize:      '8.5px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color:         fired ? color : '#6B6560',
            marginTop:     '8px',
            lineHeight:    1.3,
          }}
        >
          {signal.label}
        </span>
      </div>
    </motion.div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function SignalMatrix({ summary, inputData }) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef(null);

  // Trigger reveal on mount with slight delay
  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Evaluate which signals fired
  const evaluated = SIGNALS.map(signal => ({
    ...signal,
    hasFired: signal.fired({ summary, inputData }),
  }));

  const firedCount = evaluated.filter(s => s.hasFired).length;
  const totalCount = evaluated.length;

  // Stagger delay — fired cells get priority sequencing
  const getDelay = (index, fired) => {
    const base = 0.04 * index;
    return fired ? base : base + 0.02;
  };

  return (
    <div className="space-y-4" ref={ref}>

      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold">
            Signal Matrix
          </span>
          <div className="flex-1 h-px bg-brand-border w-16" />
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold"
        >
          {firedCount} of {totalCount} signals active
        </motion.span>
      </div>

      {/* State name — large, anchors the composition */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: revealed ? 1 : 0, x: revealed ? 0 : -8 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-baseline gap-4 border-l-4 border-brand-accent pl-4 py-1"
      >
        <span
          className="font-serif italic text-brand-accent leading-none tracking-tight"
          style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
        >
          {summary.state?.label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold">
          {summary.tier}
        </span>
      </motion.div>

      {/* The Matrix */}
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
      >
        {evaluated.map((signal, i) => (
          <SignalCell
            key={signal.id}
            signal={signal}
            fired={signal.hasFired}
            delay={getDelay(i, signal.hasFired)}
            revealed={revealed}
          />
        ))}
      </div>

      {/* Category legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ delay: 2.0, duration: 0.5 }}
        className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1"
      >
        {Array.from(new Set(SIGNALS.map(s => s.category))).map(cat => {
          const cfg    = CATEGORY_CONFIG[cat];
          const active = evaluated.some(s => s.category === cat && s.hasFired);
          return (
            <div key={cat} className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: active ? cfg.color : '#D0CBC2',
                  opacity:         active ? 1 : 0.5,
                }}
              />
              <span
                className="font-mono font-bold uppercase"
                style={{
                  fontSize:      '8px',
                  letterSpacing: '0.08em',
                  color:         active ? cfg.color : '#6B6560',
                  opacity:       active ? 0.8 : 0.4,
                }}
              >
                {cfg.label}
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* Scan line — decorative, reinforces "instrument" feel */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: revealed ? 1 : 0, opacity: revealed ? 1 : 0 }}
        transition={{ delay: 2.2, duration: 0.8, ease: 'easeInOut' }}
        className="h-px bg-gradient-to-r from-brand-accent via-brand-border to-transparent origin-left"
      />
    </div>
  );
}
