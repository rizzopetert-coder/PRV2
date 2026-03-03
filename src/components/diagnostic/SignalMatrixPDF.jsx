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

// ── SIGNAL DEFINITIONS (mirrored from SignalMatrix.jsx) ───────────────────────
const SIGNALS = [
  { id: 'leadership_tenure',  label: 'Entrenched Leadership',      category: 'structure',       fired: ({ i }) => i.leadershipTenure === 'SEVEN_PLUS' },
  { id: 'legacy_stage',       label: 'Institutional Inertia',      category: 'structure',       fired: ({ i }) => i.orgStage === 'LEGACY' },
  { id: 'large_headcount',    label: 'Coordination Overhead',      category: 'structure',       fired: ({ i }) => i.headcount >= 100 },
  { id: 'new_leadership',     label: 'Transitional Instability',   category: 'structure',       fired: ({ i }) => i.leadershipTenure === 'UNDER_ONE' },
  { id: 'growth_stage',       label: 'Scaling Pressure',           category: 'structure',       fired: ({ i }) => i.orgStage === 'GROWTH' },
  { id: 'startup_stage',      label: 'Structural Immaturity',      category: 'structure',       fired: ({ i }) => i.orgStage === 'EARLY' },
  { id: 'within_leadership',  label: 'Authority Conflict',         category: 'conflict',        fired: ({ i }) => i.frictionLocation === 'WITHIN_LEADERSHIP' },
  { id: 'cross_functional',   label: 'Siloed Execution',           category: 'conflict',        fired: ({ i }) => i.frictionLocation === 'CROSS_FUNCTIONAL' },
  { id: 'team_friction',      label: 'Surface-Level Friction',     category: 'conflict',        fired: ({ i }) => i.frictionLocation === 'TEAM' },
  { id: 'no_forum',           label: 'No Resolution Path',         category: 'evasion',         fired: ({ i }) => i.avoidanceMechanism === 'NO_FORUM' },
  { id: 'predetermined',      label: 'Outcome Fixed in Advance',   category: 'evasion',         fired: ({ i }) => i.avoidanceMechanism === 'PREDETERMINED' },
  { id: 'cost_too_high',      label: 'Conflict Avoidance Active',  category: 'evasion',         fired: ({ i }) => i.avoidanceMechanism === 'COST_TOO_HIGH' },
  { id: 'personnel_lost',     label: 'Talent Already Gone',        category: 'people_risk',     fired: ({ i }) => i.personnelRisk === 'LOST' },
  { id: 'personnel_at_risk',  label: 'Departure Risk Active',      category: 'people_risk',     fired: ({ i }) => i.personnelRisk === 'YES' },
  { id: 'active_blockage',    label: 'Resolution Actively Blocked',category: 'obstruction',     fired: ({ i }) => i.resolutionBlockage === 'ATTEMPTED' },
  { id: 'known_blockage',     label: 'Known Obstacle, No Movement',category: 'obstruction',     fired: ({ i }) => i.resolutionBlockage === 'KNOWN' },
  { id: 'prior_external',     label: 'Outside Help Already Failed',category: 'prior_attempts',  fired: ({ i }) => i.priorAttempt === 'EXTERNAL' },
  { id: 'prior_conversation', label: "Conversation Didn't Hold",   category: 'prior_attempts',  fired: ({ i }) => i.priorAttempt === 'CONVERSATION' },
  { id: 'duration_long',      label: 'Friction Compounding',       category: 'time_in_pattern', fired: ({ i }) => ['ONE_2YR','OVER_2YR'].includes(i.frictionDuration) },
  { id: 'duration_mid',       label: 'Pattern Established',        category: 'time_in_pattern', fired: ({ i }) => ['SIX_12MO','UNDER_6MO'].includes(i.frictionDuration) },
  { id: 'downstream_large',   label: 'Organization-Wide Exposure', category: 'exposure',        fired: ({ i }) => ['LARGE','FULL_ORG'].includes(i.downstreamPopulation) },
  { id: 'downstream_medium',  label: 'Team-Level Exposure',        category: 'exposure',        fired: ({ i }) => i.downstreamPopulation === 'INDIVIDUAL' },
  { id: 'decisions_stalled',  label: 'Decisions Stopped',          category: 'velocity',        fired: ({ i }) => i.decisions === 'STALLED' },
  { id: 'decisions_slow',     label: 'Decision Velocity Low',      category: 'velocity',        fired: ({ i }) => i.decisions === 'SLOW' },
  { id: 'high_leak_ratio',    label: 'Capital Bleeding',           category: 'cost_signals',    fired: ({ s }) => (parseFloat(s.leakRatio) || 0) >= 0.06 },
  { id: 'gravity_floor',      label: 'Cost Too Low to Quantify',   category: 'cost_signals',    fired: ({ s }) => !!s.showGravityFloor },
  { id: 'execution_gap',      label: 'Leadership Hours Lost',      category: 'cost_signals',    fired: ({ s }) => (s.executionGap || 0) > 0 },
  { id: 'stalled_capital',    label: 'Capital Tied to Friction',   category: 'cost_signals',    fired: ({ s }) => (s.confirmedHistoricalLoss || 0) > 0 },
  { id: 'high_severity',      label: 'State: Critical',            category: 'risk_level',      fired: ({ s }) => s.state?.severity === 'high' },
  { id: 'agency_constrained', label: 'Resolution Capacity Low',    category: 'risk_level',      fired: ({ s }) => (s.agencyScore || 0) < 40 },
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
