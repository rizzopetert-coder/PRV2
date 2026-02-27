/**
 * DiagnosticGridPDF.jsx
 * Static SVG translation of DiagnosticGrid for @react-pdf/renderer.
 * No DOM, no Recharts, no canvas. Pure SVG primitives only.
 * Faithful to web version: same axes, same state labels, same dot logic.
 */

import React from 'react';
import { View, Text, Svg, Rect, Line, Circle, G, Defs, ClipPath } from '@react-pdf/renderer';

// ── DESIGN TOKENS (mirror DiagnosticPDF.jsx) ─────────────────────────────────
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

// ── STATE ZONES ───────────────────────────────────────────────────────────────
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

// ── Y-AXIS SCORING (same formula as web) ─────────────────────────────────────
function computeBehavioralScore(inputData) {
  const { personnelRisk, priorAttempt, avoidanceMechanism,
          resolutionBlockage, leadershipTenure, orgStage } = inputData;
  let raw = 0;
  if (personnelRisk === 'LOST')               raw += 30;
  else if (personnelRisk === 'YES')           raw += 20;
  if (avoidanceMechanism === 'PREDETERMINED') raw += 25;
  else if (avoidanceMechanism === 'NO_FORUM') raw += 15;
  if (priorAttempt === 'EXTERNAL')            raw += 25;
  if (resolutionBlockage === 'ATTEMPTED')     raw += 20;
  else if (resolutionBlockage === 'KNOWN')    raw += 10;
  if (priorAttempt === 'CONVERSATION')        raw += 10;
  if (leadershipTenure === 'SEVEN_PLUS')      raw += 15;
  if (orgStage === 'LEGACY')                  raw += 10;
  return Math.min(100, Math.round(raw / 1.25));
}

function computeFinancialScore(leakRatio) {
  const ratio = parseFloat(leakRatio) || 0;
  return Math.min(100, Math.round((ratio / 0.10) * 100));
}

function computeGhostDots(inputData, xScore, yScore) {
  const { personnelRisk, frictionLocation, downstreamPopulation, resolutionBlockage } = inputData;
  const dots = [];
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
  if (frictionLocation === 'WITHIN_LEADERSHIP') {
    dots.push({
      id: 'frictionLocation',
      label: 'Leadership Friction',
      x: Math.min(95, xScore * 0.80),
      y: Math.min(95, yScore * 0.70),
      type: 'shared',
    });
  }
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

// ── SVG GRID CONSTANTS ────────────────────────────────────────────────────────
const CHART_W   = 440;  // total SVG width
const CHART_H   = 300;  // total SVG height
const MARGIN    = { top: 16, right: 16, bottom: 32, left: 36 };
const PLOT_W    = CHART_W - MARGIN.left - MARGIN.right;
const PLOT_H    = CHART_H - MARGIN.top  - MARGIN.bottom;

// Convert 0-100 score to SVG pixel coordinates
const toSvgX = (score) => MARGIN.left + (score / 100) * PLOT_W;
const toSvgY = (score) => MARGIN.top  + PLOT_H - (score / 100) * PLOT_H;  // invert Y

// ── GRID LINES ────────────────────────────────────────────────────────────────
const TICK_VALUES = [0, 25, 50, 75, 100];

function GridLines() {
  return (
    <G>
      {TICK_VALUES.map(v => (
        <G key={`grid-${v}`}>
          {/* Vertical */}
          <Line
            x1={toSvgX(v)} y1={MARGIN.top}
            x2={toSvgX(v)} y2={MARGIN.top + PLOT_H}
            stroke={T.border} strokeWidth={0.4} strokeDasharray="2 4"
          />
          {/* Horizontal */}
          <Line
            x1={MARGIN.left} y1={toSvgY(v)}
            x2={MARGIN.left + PLOT_W} y2={toSvgY(v)}
            stroke={T.border} strokeWidth={0.4} strokeDasharray="2 4"
          />
        </G>
      ))}
    </G>
  );
}

// ── AXES ──────────────────────────────────────────────────────────────────────
function Axes() {
  return (
    <G>
      {/* X axis */}
      <Line
        x1={MARGIN.left} y1={MARGIN.top + PLOT_H}
        x2={MARGIN.left + PLOT_W} y2={MARGIN.top + PLOT_H}
        stroke={T.border} strokeWidth={0.75}
      />
      {/* Y axis */}
      <Line
        x1={MARGIN.left} y1={MARGIN.top}
        x2={MARGIN.left} y2={MARGIN.top + PLOT_H}
        stroke={T.border} strokeWidth={0.75}
      />
    </G>
  );
}

// ── DANGER ZONE REFERENCE LINES ───────────────────────────────────────────────
function DangerZone() {
  return (
    <G>
      <Line
        x1={toSvgX(70)} y1={MARGIN.top}
        x2={toSvgX(70)} y2={MARGIN.top + PLOT_H}
        stroke={T.accent} strokeWidth={0.5} strokeDasharray="3 3" strokeOpacity={0.25}
      />
      <Line
        x1={MARGIN.left} y1={toSvgY(70)}
        x2={MARGIN.left + PLOT_W} y2={toSvgY(70)}
        stroke={T.accent} strokeWidth={0.5} strokeDasharray="3 3" strokeOpacity={0.25}
      />
    </G>
  );
}

// ── STATE ZONE LABELS ─────────────────────────────────────────────────────────
// @react-pdf/renderer SVG Text has limited support -- keep it simple
function StateZoneLabels({ activeStateLabel }) {
  return (
    <G>
      {STATE_ZONES.map(zone => {
        const isActive = zone.label === activeStateLabel;
        const cx = toSvgX(zone.x);
        const cy = toSvgY(zone.y);
        // Skip active zone label -- it gets the callout treatment
        if (isActive) return null;
        return (
          <G key={zone.key}>
            {/* Subtle crosshair dot */}
            <Circle
              cx={cx} cy={cy} r={1.5}
              fill={T.border}
              fillOpacity={0.8}
            />
            {/* Label -- split on space for word wrap approximation */}
            {zone.label.split(' ').map((word, wi) => (
              <G key={wi}>
                {/* @react-pdf SVG text */}
                <G transform={`translate(${cx + 4}, ${cy + (wi * 6) - 3})`}>
                  <Rect x={0} y={-4} width={word.length * 3.8} height={5.5} fill={T.bg} fillOpacity={0.7} />
                </G>
              </G>
            ))}
          </G>
        );
      })}
    </G>
  );
}

// ── PRIMARY DOT + CALLOUT ─────────────────────────────────────────────────────
function PrimaryDot({ cx, cy, label, xScore }) {
  const goRight = xScore < 50;
  const lineEndX = goRight ? cx + 36 : cx - 36;
  const lineEndY = cy - 16;
  const textAnchorX = goRight ? lineEndX + 4 : lineEndX - 4;

  // Split label for two-line callout if long
  const words = label.split(' ');
  const mid   = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(' ');
  const line2 = words.slice(mid).join(' ');

  return (
    <G>
      {/* Glow rings */}
      <Circle cx={cx} cy={cy} r={18} fill={T.accent} fillOpacity={0.08} />
      <Circle cx={cx} cy={cy} r={12} fill={T.accent} fillOpacity={0.15} />
      {/* Primary dot */}
      <Circle cx={cx} cy={cy} r={7} fill={T.primary} stroke={T.accent} strokeWidth={1.5} />
      {/* Callout line */}
      <Line
        x1={cx} y1={cy}
        x2={lineEndX} y2={lineEndY}
        stroke={T.accent} strokeWidth={0.75} strokeDasharray="2 2"
      />
      <Circle cx={lineEndX} cy={lineEndY} r={1.5} fill={T.accent} />
    </G>
  );
}

// ── GHOST DOTS ────────────────────────────────────────────────────────────────
function GhostDot({ dot }) {
  const cx = toSvgX(dot.x);
  const cy = toSvgY(dot.y);
  const color = dot.type === 'shared' ? T.shared
    : dot.type === 'financial'        ? T.financial
    : T.behavioral;

  return (
    <G>
      <Circle cx={cx} cy={cy} r={4} fill={color} fillOpacity={0.65} stroke={color} strokeWidth={0.75} />
      <Circle cx={cx} cy={cy} r={4} fill="none" stroke={color} strokeWidth={0.75} strokeOpacity={0.35} />
    </G>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export function DiagnosticGridPDF({ summary, inputData }) {
  const leakRatio  = parseFloat(summary.leakRatio) || 0;
  const xScore     = computeFinancialScore(leakRatio);
  const yScore     = computeBehavioralScore(inputData);
  const ghostDots  = computeGhostDots(inputData, xScore, yScore);
  const px         = toSvgX(xScore);
  const py         = toSvgY(yScore);
  const stateLabel = summary.state.label;

  // Explanation: first sentence of state desc
  const explanationText = summary.state.desc?.split('.')[0] + '.';

  return (
    <View>
      {/* Section label row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View style={{
          fontFamily: 'SpaceMono', fontSize: 7, letterSpacing: 2,
          textTransform: 'uppercase', color: T.accent, fontWeight: 700,
        }}>
          <Text style={{
            fontFamily: 'SpaceMono', fontSize: 7, letterSpacing: 2,
            color: T.accent, fontWeight: 700,
          }}>
            DIAGNOSTIC POSITION
          </Text>
        </View>
        <View style={{ flex: 1, borderTopWidth: 0.5, borderTopColor: T.border, marginLeft: 8 }} />
      </View>

      {/* SVG Grid */}
      <View style={{ borderWidth: 0.5, borderColor: T.border, backgroundColor: T.bg }}>
        <Svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>

          {/* Background */}
          <Rect x={0} y={0} width={CHART_W} height={CHART_H} fill={T.bg} />

          {/* Plot area background */}
          <Rect
            x={MARGIN.left} y={MARGIN.top}
            width={PLOT_W} height={PLOT_H}
            fill={T.bg}
          />

          {/* Danger zone fill */}
          <Rect
            x={toSvgX(70)} y={MARGIN.top}
            width={PLOT_W - (toSvgX(70) - MARGIN.left)}
            height={toSvgY(70) - MARGIN.top}
            fill={T.accent} fillOpacity={0.025}
          />

          <GridLines />
          <DangerZone />
          <Axes />

          {/* State zone labels -- simple text positioned at each zone */}
          {STATE_ZONES.map(zone => {
            const isActive = zone.label === stateLabel;
            if (isActive) return null;
            const cx = toSvgX(zone.x);
            const cy = toSvgY(zone.y);
            const words = zone.label.split(' ');
            return (
              <G key={zone.key}>
                <Circle cx={cx} cy={cy} r={1.5} fill={T.border} fillOpacity={0.9} />
                {words.map((word, wi) => (
                  <G key={wi} transform={`translate(${cx + 3}, ${cy + wi * 6 - (words.length * 3)})`}>
                    <text
                      fontSize={5.5}
                      fontFamily="Helvetica"
                      fill={T.muted}
                      fillOpacity={0.7}
                    >
                      {word}
                    </text>
                  </G>
                ))}
              </G>
            );
          })}

          {/* Ghost dots */}
          {ghostDots.map(dot => <GhostDot key={dot.id} dot={dot} />)}

          {/* Primary dot */}
          <PrimaryDot cx={px} cy={py} label={stateLabel} xScore={xScore} />

          {/* Callout label text (separate from PrimaryDot for z-ordering) */}
          {(() => {
            const goRight = xScore < 50;
            const lineEndX = goRight ? px + 36 : px - 36;
            const lineEndY = py - 16;
            const words    = stateLabel.split(' ');
            const mid      = Math.ceil(words.length / 2);
            const line1    = words.slice(0, mid).join(' ');
            const line2    = words.slice(mid).join(' ');
            const anchorX  = goRight ? lineEndX + 4 : lineEndX - 4;
            return (
              <G>
                <G transform={`translate(${anchorX}, ${lineEndY - 10})`}>
                  <text
                    fontSize={6.5}
                    fontFamily="Helvetica-Bold"
                    fill={T.accent}
                    fillOpacity={1}
                  >
                    {line1}
                  </text>
                </G>
                {line2 && (
                  <G transform={`translate(${anchorX}, ${lineEndY - 3})`}>
                    <text
                      fontSize={6.5}
                      fontFamily="Helvetica-Bold"
                      fill={T.accent}
                      fillOpacity={1}
                    >
                      {line2}
                    </text>
                  </G>
                )}
              </G>
            );
          })()}

          {/* X axis label */}
          <G transform={`translate(${MARGIN.left + PLOT_W / 2}, ${CHART_H - 6})`}>
            <text fontSize={6} fontFamily="Helvetica" fill={T.muted} textAnchor="middle">
              FINANCIAL GRAVITY
            </text>
          </G>

          {/* Y axis label -- rotated */}
          <G transform={`translate(8, ${MARGIN.top + PLOT_H / 2}) rotate(-90)`}>
            <text fontSize={6} fontFamily="Helvetica" fill={T.muted} textAnchor="middle">
              BEHAVIORAL COMPLEXITY
            </text>
          </G>

          {/* Danger zone corner label */}
          <G transform={`translate(${toSvgX(72)}, ${MARGIN.top + 8})`}>
            <text fontSize={5} fontFamily="Helvetica" fill={T.accent} fillOpacity={0.4}>
              DANGER ZONE
            </text>
          </G>

          {/* Axis tick labels */}
          {[0, 25, 50, 75, 100].map(v => (
            <G key={`tick-${v}`}>
              <G transform={`translate(${toSvgX(v)}, ${MARGIN.top + PLOT_H + 10})`}>
                <text fontSize={5} fontFamily="Helvetica" fill={T.muted} textAnchor="middle">
                  {v}
                </text>
              </G>
              <G transform={`translate(${MARGIN.left - 6}, ${toSvgY(v) + 2})`}>
                <text fontSize={5} fontFamily="Helvetica" fill={T.muted} textAnchor="end">
                  {v}
                </text>
              </G>
            </G>
          ))}

        </Svg>
      </View>

      {/* Explanation line below grid */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 8, gap: 6 }}>
        <View style={{ width: 10, borderTopWidth: 0.75, borderTopColor: T.accent, marginTop: 5 }} />
        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: 'SpaceMono',
            fontSize: 7,
            color: T.muted,
            lineHeight: 1.5,
            letterSpacing: 0.5,
          }}>
            <Text style={{ color: T.accent, fontWeight: 700 }}>{stateLabel.toUpperCase()}: </Text>
            {explanationText}
          </Text>
        </View>
      </View>

      {/* Ghost dot legend */}
      {ghostDots.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: T.primary }} />
            <Text style={{ fontFamily: 'SpaceMono', fontSize: 6, color: T.muted, letterSpacing: 0.5 }}>
              DIAGNOSED STATE
            </Text>
          </View>
          {ghostDots.map(dot => (
            <View key={dot.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{
                width: 6, height: 6, borderRadius: 3,
                backgroundColor: dot.type === 'shared' ? T.shared
                  : dot.type === 'financial' ? T.financial : T.behavioral,
                opacity: 0.75,
              }} />
              <Text style={{ fontFamily: 'SpaceMono', fontSize: 6, color: T.muted, letterSpacing: 0.5 }}>
                {dot.label.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
