"use client";

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';

// ── DESIGN TOKENS (mirror brand) ─────────────────────────────────────────────
const T = {
  bg:      '#FAF9F6',
  text:    '#1C1C1C',
  accent:  '#FF4500',
  muted:   '#6B6560',
  border:  '#D0CBC2',
  // Option A color logic
  financial:  '#4B6B8A',   // cool slate -- pure financial signals
  behavioral: '#B45309',   // warm amber -- pure behavioral signals
  shared:     '#FF4500',   // brand accent -- shared diagonal signals
  primary:    '#1C1C1C',   // user's state dot
};

// ── STATE ZONE COORDINATES (Gemini decision doc) ─────────────────────────────
const STATE_ZONES = [
  { key: 'STAGNANT_STABILITY',     label: 'Stagnant Stability',     x: 10, y: 15 },
  { key: 'PROCESS_PARALYSIS',      label: 'Process Paralysis',      x: 25, y: 45 },
  { key: 'SILO_ISOLATION',         label: 'Silo Isolation',         x: 35, y: 40 },
  { key: 'STRATEGIC_DRIFT',        label: 'Strategic Drift',        x: 45, y: 30 },
  { key: 'RELATIONAL_FRICTION',    label: 'Relational Friction',    x: 30, y: 65 },
  { key: 'CAFFEINE_CULTURE',       label: 'Caffeine Culture',       x: 60, y: 40 },
  { key: 'TALENT_HEMORRHAGE',      label: 'Talent Hemorrhage',      x: 55, y: 80 },
  { key: 'BRILLIANT_SABOTAGE',     label: 'Brilliant Sabotage',     x: 65, y: 75 },
  { key: 'STALLED_HEGEMONY',       label: 'Stalled Hegemony',       x: 70, y: 60 },
  { key: 'EXECUTIVE_EMBARGO',      label: 'Executive Embargo',      x: 50, y: 90 },
  { key: 'INSTITUTIONAL_RIGIDITY', label: 'Institutional Rigidity', x: 80, y: 85 },
  { key: 'TOTAL_FRICTION_COLLAPSE',label: 'Total Friction Collapse',x: 95, y: 95 },
];

// ── Y-AXIS SCORING (Gemini formula, proportional scaling) ────────────────────
function computeBehavioralScore(inputData) {
  const { personnelRisk, priorAttempt, avoidanceMechanism,
          resolutionBlockage, leadershipTenure, orgStage } = inputData;

  let raw = 0;

  // Social Friction
  if (personnelRisk === 'LOST')          raw += 30;
  else if (personnelRisk === 'YES')      raw += 20;
  if (avoidanceMechanism === 'PREDETERMINED') raw += 25;
  else if (avoidanceMechanism === 'NO_FORUM') raw += 15;

  // Structural Inertia
  if (priorAttempt === 'EXTERNAL')       raw += 25;
  if (resolutionBlockage === 'ATTEMPTED') raw += 20;
  else if (resolutionBlockage === 'KNOWN') raw += 10;
  if (priorAttempt === 'CONVERSATION')   raw += 10;

  // Contextual Drag
  if (leadershipTenure === 'SEVEN_PLUS') raw += 15;
  if (orgStage === 'LEGACY')             raw += 10;

  return Math.min(100, Math.round(raw / 1.25));
}

// ── X-AXIS SCORING ───────────────────────────────────────────────────────────
function computeFinancialScore(leakRatio) {
  const ratio = parseFloat(leakRatio) || 0;
  return Math.min(100, Math.round((ratio / 0.10) * 100));
}

// ── GHOST DOTS: shared signals with their axis contributions ─────────────────
function computeGhostDots(inputData, xScore, yScore) {
  const { personnelRisk, frictionLocation, downstreamPopulation,
          resolutionBlockage } = inputData;
  const dots = [];

  // personnelRisk: shared (replacement cost X + cultural damage Y)
  if (personnelRisk === 'YES' || personnelRisk === 'LOST') {
    const yContrib = personnelRisk === 'LOST' ? 30 : 20;
    dots.push({
      id: 'personnelRisk',
      label: personnelRisk === 'LOST' ? 'Personnel Lost' : 'Personnel at Risk',
      x: Math.min(95, xScore * 0.65),
      y: Math.min(95, Math.round(yContrib / 1.25)),
      type: 'shared',
    });
  }

  // frictionLocation WITHIN_LEADERSHIP: shared (high-cost meetings X + bottleneck Y)
  if (frictionLocation === 'WITHIN_LEADERSHIP') {
    dots.push({
      id: 'frictionLocation',
      label: 'Leadership Friction',
      x: Math.min(95, xScore * 0.80),
      y: Math.min(95, yScore * 0.70),
      type: 'shared',
    });
  }

  // downstreamPopulation: shared (radiated impact X + coordination complexity Y)
  if (downstreamPopulation && downstreamPopulation !== 'NONE') {
    const xContrib = downstreamPopulation === 'FULL_ORG' ? xScore * 0.90
                   : downstreamPopulation === 'LARGE'    ? xScore * 0.75
                   : xScore * 0.55;
    dots.push({
      id: 'downstream',
      label: 'Downstream Population',
      x: Math.min(95, Math.round(xContrib)),
      y: Math.min(95, yScore * 0.45),
      type: 'shared',
    });
  }

  // resolutionBlockage: behavioral (pure Y)
  if (resolutionBlockage === 'ATTEMPTED' || resolutionBlockage === 'KNOWN') {
    dots.push({
      id: 'blockage',
      label: resolutionBlockage === 'ATTEMPTED' ? 'Active Blockage' : 'Known Blockage',
      x: Math.min(95, xScore * 0.35),
      y: Math.min(95, resolutionBlockage === 'ATTEMPTED' ? Math.round(20/1.25) : Math.round(10/1.25)),
      type: 'behavioral',
    });
  }

  return dots;
}

// ── QUADRANT LABELS ───────────────────────────────────────────────────────────
const QUADRANT_LABELS = [
  { x: 10, y: 92, text: 'Low Gravity\nHigh Complexity',  align: 'left'  },
  { x: 90, y: 92, text: 'High Gravity\nHigh Complexity', align: 'right' },
  { x: 10, y:  8, text: 'Low Gravity\nLow Complexity',   align: 'left'  },
  { x: 90, y:  8, text: 'High Gravity\nLow Complexity',  align: 'right' },
];

// ── CUSTOM TOOLTIP ────────────────────────────────────────────────────────────
const GridTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="bg-brand-text border border-brand-accent px-4 py-3 shadow-xl pointer-events-none">
      <p className="font-mono text-[10px] uppercase tracking-briefing text-brand-accent font-bold mb-1">
        {d.label}
      </p>
      <p className="font-mono text-[10px] text-brand-bg">
        Financial Gravity: {Math.round(d.x)}
      </p>
      <p className="font-mono text-[10px] text-brand-bg">
        Behavioral Complexity: {Math.round(d.y)}
      </p>
    </div>
  );
};

// ── CUSTOM DOT RENDERER ───────────────────────────────────────────────────────
const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (!payload) return null;

  const isPrimary = payload.type === 'primary';
  const color = isPrimary ? T.primary
    : payload.type === 'shared'    ? T.shared
    : payload.type === 'financial' ? T.financial
    : T.behavioral;

  const r = isPrimary ? 10 : 6;

  return (
    <g>
      {isPrimary && (
        <>
          <circle cx={cx} cy={cy} r={22} fill={T.accent} opacity={0.12} />
          <circle cx={cx} cy={cy} r={15} fill={T.accent} opacity={0.20} />
        </>
      )}
      <circle
        cx={cx} cy={cy} r={r}
        fill={color}
        stroke={isPrimary ? T.accent : color}
        strokeWidth={isPrimary ? 2 : 1}
        opacity={isPrimary ? 1 : 0.75}
      />
      {!isPrimary && (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={1} opacity={0.4} />
      )}
    </g>
  );
};

// ── CALLOUT LINE: primary dot to label ───────────────────────────────────────
// Rendered as an SVG overlay on top of the chart
const CalloutLabel = ({ cx, cy, label, xScore }) => {
  // Anchor line direction based on quadrant
  const goRight = xScore < 50;
  const lineLen = 40;
  const x2 = goRight ? cx + lineLen : cx - lineLen;
  const labelAnchor = goRight ? 'start' : 'end';
  const labelX = goRight ? x2 + 6 : x2 - 6;

  return (
    <g>
      <line
        x1={cx} y1={cy}
        x2={x2} y2={cy - 18}
        stroke={T.accent}
        strokeWidth={1}
        strokeDasharray="3 2"
      />
      <circle cx={x2} cy={cy - 18} r={2} fill={T.accent} />
      <text
        x={labelX}
        y={cy - 22}
        textAnchor={labelAnchor}
        fontSize={9}
        fontFamily="'Space Mono', monospace"
        fontWeight={700}
        fill={T.accent}
        letterSpacing={1}
        style={{ textTransform: 'uppercase' }}
      >
        {label}
      </text>
    </g>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function DiagnosticGrid({ summary, inputData }) {
  const [hoveredDot, setHoveredDot] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const leakRatio = parseFloat(summary.leakRatio) || 0;
  const xScore    = computeFinancialScore(leakRatio);
  const yScore    = computeBehavioralScore(inputData);
  const ghostDots = useMemo(() => computeGhostDots(inputData, xScore, yScore), [inputData, xScore, yScore]);

  // Find active state zone
  const activeZone = STATE_ZONES.find(z => z.label === summary.state.label)
    || STATE_ZONES.find(z => z.key === 'STAGNANT_STABILITY');

  // All scatter data: primary dot + ghost dots
  const scatterData = [
    { x: xScore, y: yScore, label: summary.state.label, type: 'primary' },
    ...ghostDots,
  ];

  // Explanation line below grid
  const explanationText = summary.state.desc?.split('.')[0] + '.';

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-accent font-bold">
          Diagnostic Position
        </span>
        <div className="flex-1 h-px bg-brand-border" />
      </div>

      {/* Grid container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 12 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="border border-brand-border bg-brand-bg relative"
        style={{ paddingBottom: '0' }}
      >
        {/* Y-axis label */}
        <div
          className="absolute left-0 top-1/2 font-mono text-[8px] uppercase tracking-briefing text-brand-muted font-bold select-none pointer-events-none"
          style={{
            transform: 'translate(-50%, -50%) rotate(-90deg)',
            transformOrigin: 'center',
            left: '10px',
            whiteSpace: 'nowrap',
          }}
        >
          Behavioral Complexity →
        </div>

        <div style={{ height: 480, marginLeft: 24, marginRight: 16, marginTop: 16, marginBottom: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
              {/* Grid */}
              <CartesianGrid
                strokeDasharray="2 4"
                stroke={T.border}
                strokeOpacity={0.6}
              />

              {/* Axes */}
              <XAxis
                type="number"
                dataKey="x"
                domain={[0, 100]}
                tick={{ fontFamily: 'Space Mono', fontSize: 8, fill: T.muted }}
                tickLine={false}
                axisLine={{ stroke: T.border }}
                label={{
                  value: 'Financial Gravity →',
                  position: 'insideBottom',
                  offset: -20,
                  fontFamily: 'Space Mono',
                  fontSize: 8,
                  fill: T.muted,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                domain={[0, 100]}
                tick={{ fontFamily: 'Space Mono', fontSize: 8, fill: T.muted }}
                tickLine={false}
                axisLine={{ stroke: T.border }}
                width={30}
              />

              {/* State zone labels */}
              {STATE_ZONES.map((zone) => {
                const isActive = zone.label === summary.state.label;
                return (
                  <ReferenceDot
                    key={zone.key}
                    x={zone.x}
                    y={zone.y}
                    r={0}
                    label={{
                      value: zone.label,
                      position: 'center',
                      fontFamily: 'Space Mono',
                      fontSize: isActive ? 0 : 6.5,  // hide active -- shown via callout
                      fill: isActive ? T.accent : T.muted,
                      fontWeight: isActive ? 700 : 400,
                      opacity: isActive ? 1 : 0.55,
                    }}
                  />
                );
              })}

              {/* Danger zone boundary */}
              <ReferenceLine
                x={70}
                stroke={T.accent}
                strokeDasharray="4 3"
                strokeOpacity={0.20}
              />
              <ReferenceLine
                y={70}
                stroke={T.accent}
                strokeDasharray="4 3"
                strokeOpacity={0.20}
              />

              <Tooltip content={<GridTooltip />} cursor={false} />

              {/* All dots */}
              <Scatter
                data={scatterData}
                shape={<CustomDot />}
                isAnimationActive={true}
                animationBegin={600}
                animationDuration={900}
                animationEasing="easeOut"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Danger zone corner label */}
        <div className="absolute top-5 right-8 font-mono text-[7px] uppercase tracking-briefing text-brand-accent opacity-30 font-bold text-right select-none">
          Danger Zone
        </div>
      </motion.div>

      {/* Explanation line below grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="flex items-start gap-3 pt-1"
      >
        <div className="w-3 h-px bg-brand-accent mt-2.5 shrink-0" />
        <p className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold leading-relaxed">
          <span className="text-brand-accent">{summary.state.label}: </span>
          {explanationText}
        </p>
      </motion.div>

      {/* Signal legend */}
      {ghostDots.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="flex flex-wrap gap-4 pt-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: T.primary }} />
            <span className="font-mono text-[9px] uppercase tracking-briefing text-brand-muted font-bold">
              Diagnosed State
            </span>
          </div>
          {ghostDots.map(dot => (
            <div key={dot.id} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: dot.type === 'shared' ? T.shared
                    : dot.type === 'financial' ? T.financial
                    : T.behavioral,
                  opacity: 0.75,
                }}
              />
              <span className="font-mono text-[9px] uppercase tracking-briefing text-brand-muted font-bold">
                {dot.label}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
