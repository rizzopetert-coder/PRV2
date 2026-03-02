/**
 * SignalMatrixPDF.jsx
 * Static SVG translation of SignalMatrix for @react-pdf/renderer.
 * No DOM, no motion, no canvas. Pure SVG and View primitives.
 * Faithful to web version: same signals, same layout, same category colors.
 * Principal Resolution v6.0
 */

import React from 'react';
import { View, Text, Svg, Rect, Line, Circle, G } from '@react-pdf/renderer';

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const T = {
  bg:         '#FAF9F6',
  text:       '#1C1C1C',
  accent:     '#FF4500',
  muted:      '#6B6560',
  border:     '#D0CBC2',
  financial:  '#4B6B8A',
  behavioral: '#B45309',
  shared:     '#FF4500',
  primary:    '#1C1C1C',
};

// ── CATEGORY COLORS ────────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  context:    { color: '#6B6560', label: 'Context'    },
  friction:   { color: '#FF4500', label: 'Friction'   },
  personnel:  { color: '#CC2200', label: 'Personnel'  },
  blockage:   { color: '#FF6B6B', label: 'Blockage'   },
  severity:   { color: '#991A00', label: 'Severity'   },
  avoidance:  { color: '#2D6A4F', label: 'Avoidance'  },
  history:    { color: '#52B788', label: 'History'    },
  decisions:  { color: '#95D5B2', label: 'Decisions'  },
  duration:   { color: '#1B4F72', label: 'Duration'   },
  downstream: { color: '#2E86AB', label: 'Downstream' },
  financial:  { color: '#7EC8E3', label: 'Financial'  },
};

// ── SIGNAL DEFINITIONS (mirrored from SignalMatrix.jsx) ───────────────────────
const SIGNALS = [
  { id: 'leadership_tenure',    label: 'Long Tenure',           category: 'context',    fired: ({ i }) => i.leadershipTenure === 'SEVEN_PLUS' },
  { id: 'legacy_stage',         label: 'Legacy Stage',          category: 'context',    fired: ({ i }) => i.orgStage === 'LEGACY' },
  { id: 'large_headcount',      label: 'Large Org',             category: 'context',    fired: ({ i }) => i.headcount >= 100 },
  { id: 'new_leadership',       label: 'New Leadership',        category: 'context',    fired: ({ i }) => i.leadershipTenure === 'UNDER_ONE' },
  { id: 'growth_stage',         label: 'Growth Stage',          category: 'context',    fired: ({ i }) => i.orgStage === 'GROWTH' },
  { id: 'startup_stage',        label: 'Startup Stage',         category: 'context',    fired: ({ i }) => i.orgStage === 'EARLY',
  { id: 'within_leadership',    label: 'Leadership Friction',   category: 'friction',   fired: ({ i }) => i.frictionLocation === 'WITHIN_LEADERSHIP' },
  { id: 'cross_functional',     label: 'Cross-Functional',      category: 'friction',   fired: ({ i }) => i.frictionLocation === 'CROSS_FUNCTIONAL' },
  { id: 'team_friction',        label: 'Team Friction',         category: 'friction',   fired: ({ i }) => i.frictionLocation === 'TEAM' },
  { id: 'no_forum',             label: 'No Forum',              category: 'avoidance',  fired: ({ i }) => i.avoidanceMechanism === 'NO_FORUM' },
  { id: 'predetermined',        label: 'Predetermined',         category: 'avoidance',  fired: ({ i }) => i.avoidanceMechanism === 'PREDETERMINED' },
  { id: 'cost_too_high',        label: 'Cost Perceived High',   category: 'avoidance',  fired: ({ i }) => i.avoidanceMechanism === 'COST_TOO_HIGH' },
  { id: 'personnel_lost',       label: 'Personnel Lost',        category: 'personnel',  fired: ({ i }) => i.personnelRisk === 'LOST' },
  { id: 'personnel_at_risk',    label: 'Personnel at Risk',     category: 'personnel',  fired: ({ i }) => i.personnelRisk === 'YES' },
  { id: 'active_blockage',      label: 'Active Blockage',       category: 'blockage',   fired: ({ i }) => i.resolutionBlockage === 'ATTEMPTED' },
  { id: 'known_blockage',       label: 'Known Blockage',        category: 'blockage',   fired: ({ i }) => i.resolutionBlockage === 'KNOWN' },
  { id: 'prior_external',       label: 'Prior External',        category: 'history',    fired: ({ i }) => i.priorAttempt === 'EXTERNAL' },
  { id: 'prior_conversation',   label: 'Prior Conversation',    category: 'history',    fired: ({ i }) => i.priorAttempt === 'CONVERSATION' },
  { id: 'duration_long',        label: 'Long Duration',         category: 'duration',   fired: ({ i }) => ['ONE_2YR','OVER_2YR'].includes(i.frictionDuration),
  { id: 'duration_mid',         label: 'Mid Duration',          category: 'duration',   fired: ({ i }) => ['SIX_12MO','UNDER_6MO'].includes(i.frictionDuration),
  { id: 'downstream_large',     label: 'Wide Downstream',       category: 'downstream', fired: ({ i }) => ['LARGE','FULL_ORG'].includes(i.downstreamPopulation) },
  { id: 'downstream_medium',    label: 'Mid Downstream',        category: 'downstream', fired: ({ i }) => i.downstreamPopulation === 'INDIVIDUAL',
  { id: 'decisions_stalled',    label: 'Decisions Stalled',     category: 'decisions',  fired: ({ i }) => i.decisions === 'STALLED' },
  { id: 'decisions_slow',       label: 'Decisions Slow',        category: 'decisions',  fired: ({ i }) => i.decisions === 'SLOW' },
  { id: 'high_leak_ratio',      label: 'High Leak Ratio',       category: 'financial',  fired: ({ s }) => (parseFloat(s.leakRatio) || 0) >= 0.06 },
  { id: 'gravity_floor',        label: 'Gravity Floor',         category: 'financial',  fired: ({ s }) => !!s.showGravityFloor },
  { id: 'execution_gap',        label: 'Execution Gap',         category: 'financial',  fired: ({ s }) => (s.executionGap || 0) > 0 },
  { id: 'stalled_capital',      label: 'Stalled Capital',       category: 'financial',  fired: ({ s }) => (s.confirmedHistoricalLoss || 0) > 0 },
  { id: 'high_severity',        label: 'High Severity',         category: 'severity',   fired: ({ s }) => (s.state?.severity || 0) >= 4 },
  { id: 'agency_constrained',   label: 'Agency Constrained',    category: 'severity',   fired: ({ s }) => (s.agencyScore || 0) < 40 },
];

// ── SVG GRID CONSTANTS ────────────────────────────────────────────────────────
const COLS       = 6;
const ROWS       = Math.ceil(SIGNALS.length / COLS);
const CELL_W     = 70;
const CELL_H     = 36;
const CELL_GAP   = 2;
const SVG_W      = COLS * (CELL_W + CELL_GAP) - CELL_GAP;
const SVG_H      = ROWS * (CELL_H + CELL_GAP) - CELL_GAP;

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export function SignalMatrixPDF({ summary, inputData }) {
  // Evaluate signals
  const evaluated = SIGNALS.map(signal => ({
    ...signal,
    hasFired: signal.fired({ i: inputData, s: summary }),
  }));

  const firedCount = evaluated.filter(s => s.hasFired).length;
  const totalCount = evaluated.length;

  // Unique categories that fired
  const activeCategories = Array.from(
    new Set(evaluated.filter(s => s.hasFired).map(s => s.category))
  );

  return (
    <View>
      {/* Section header row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{
          fontFamily:    'SpaceMono',
          fontSize:      7,
          letterSpacing: 2,
          color:         T.accent,
          fontWeight:    700,
        }}>
          SIGNAL MATRIX
        </Text>
        <View style={{ flex: 1, borderTopWidth: 0.5, borderTopColor: T.border, marginLeft: 8, marginRight: 8 }} />
        <Text style={{
          fontFamily:    'SpaceMono',
          fontSize:      6,
          letterSpacing: 1,
          color:         T.muted,
        }}>
          {firedCount} OF {totalCount} SIGNALS ACTIVE
        </Text>
      </View>

      {/* State name anchor */}
      <View style={{
        borderLeftWidth:  2,
        borderLeftColor:  T.accent,
        paddingLeft:      8,
        paddingVertical:  4,
        marginBottom:     10,
        flexDirection:    'row',
        alignItems:       'baseline',
        gap:              10,
      }}>
        <Text style={{
        fontFamily: 'Newsreader',
        fontStyle:  'italic',
        fontSize:   16,
        color:      T.accent,
        lineHeight: 1,
      }}>
        {summary.state?.label}
        </Text>
        <Text style={{
          fontFamily:    'SpaceMono',
          fontSize:      6,
          letterSpacing: 1.5,
          color:         T.muted,
          fontWeight:    700,
        }}>
          {summary.tier}
        </Text>
      </View>

      {/* SVG Matrix */}
      <Svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
        {evaluated.map((signal, idx) => {
          const col   = idx % COLS;
          const row   = Math.floor(idx / COLS);
          const x     = col * (CELL_W + CELL_GAP);
          const y     = row * (CELL_H + CELL_GAP);
          const cfg   = CATEGORY_CONFIG[signal.category];
          const color = signal.hasFired ? cfg.color : T.border;
          const bgAlpha = signal.hasFired ? '15' : '00'; // hex alpha

          return (
            <G key={signal.id}>
              {/* Cell background */}
              <Rect
                x={x} y={y}
                width={CELL_W} height={CELL_H}
                fill={signal.hasFired ? `${color}` : T.bg}
                fillOpacity={signal.hasFired ? 0.07 : 1}
                stroke={color}
                strokeWidth={signal.hasFired ? 0.75 : 0.4}
                strokeOpacity={signal.hasFired ? 1 : 0.4}
              />

              {/* Top accent line for fired cells */}
              {signal.hasFired && (
                <Line
                  x1={x} y1={y}
                  x2={x + CELL_W} y2={y}
                  stroke={color}
                  strokeWidth={1.5}
                />
              )}

              {/* Pip indicator top-left */}
              {signal.hasFired && (
                <Circle
                  cx={x + 5} cy={y + 5}
                  r={2}
                  fill={color}
                />
              )}

              {/* Signal label — word-wrapped manually */}
              {signal.label.split(' ').slice(0, 2).map((word, wi) => (
                <G key={wi} transform={`translate(${x + 4}, ${y + 18 + wi * 8})`}>
                  <text
                    fontSize={5.5}
                    fontFamily={signal.hasFired ? 'Helvetica-Bold' : 'Helvetica'}
                    fill={signal.hasFired ? color : T.muted}
                    fillOpacity={signal.hasFired ? 1 : 0.45}
                    letterSpacing={0.5}
                  >
                    {word.toUpperCase()}
                  </text>
                </G>
              ))}
            </G>
          );
        })}
      </Svg>

      {/* Category legend */}
      <View style={{
        flexDirection: 'row',
        flexWrap:      'wrap',
        gap:           10,
        marginTop:     8,
      }}>
        {Array.from(new Set(SIGNALS.map(s => s.category))).map(cat => {
          const cfg    = CATEGORY_CONFIG[cat];
          const active = evaluated.some(s => s.category === cat && s.hasFired);
          return (
            <View key={cat} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <View style={{
                width:           5,
                height:          5,
                borderRadius:    2.5,
                backgroundColor: active ? cfg.color : T.border,
                opacity:         active ? 1 : 0.4,
              }} />
              <Text style={{
                fontFamily:    'SpaceMono',
                fontSize:      5.5,
                letterSpacing: 0.5,
                color:         active ? cfg.color : T.muted,
                opacity:       active ? 0.85 : 0.4,
              }}>
                {cfg.label.toUpperCase()}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Scan line */}
      <View style={{
        borderTopWidth: 0.5,
        borderTopColor: T.accent,
        marginTop:      10,
        opacity:        0.3,
      }} />
    </View>
  );
}
