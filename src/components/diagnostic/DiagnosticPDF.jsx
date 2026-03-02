import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import {
  STATES,
  TIERS,
  TIER_META,
} from '../../lib/diagnostic-logic';
import {
  STATE_GLOSSARY,
  getSynthesis,
  getInference,
  getPathToVerdict,
  buildRecommendationRationale,
} from './ResultsLedger';
import { SignalMatrixPDF } from './SignalMatrixPDF.jsx';

/**
 * DiagnosticPDF // Principal Resolution v6.0
 * Triple-File Sync: strings sourced from ResultsLedger.jsx string tables.
 * Retired: hammerCitation / Forensic Proof block (relocated to Vault)
 * Retired: v5.0 buildSynthesis / buildInferredObservation / buildRecommendationRationale
 * New: Path to Verdict section
 * New: Glossary as a final PDF page (fine-print supplement register)
 */

Font.register({
  family: 'Newsreader',
  fonts: [
    { src: '/fonts/Newsreader-Italic.ttf', fontStyle: 'italic' },
  ],
});
Font.register({
  family: 'SpaceMono',
  fonts: [
    { src: '/fonts/SpaceMono-Regular.ttf', fontWeight: 400, fontStyle: 'normal' },
    { src: '/fonts/SpaceMono-Bold.ttf',    fontWeight: 700, fontStyle: 'normal' },
    { src: '/fonts/SpaceMono-Regular.ttf', fontWeight: 400, fontStyle: 'italic' },
    { src: '/fonts/SpaceMono-Bold.ttf',    fontWeight: 700, fontStyle: 'italic' },
  ],
});
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 700, fontStyle: 'normal' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 700, fontStyle: 'italic' },
  ],
});

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const T = {
  bg:     '#FAF9F6',
  text:   '#1C1C1C',
  accent: '#FF4500',
  muted:  '#6B6560',
  border: '#D0CBC2',
};

const styles = StyleSheet.create({

  // ── PAGE ──
  page: {
    backgroundColor: T.bg,
    paddingTop:        36,
    paddingBottom:     36,
    paddingHorizontal: 52,
    fontFamily:  'Newsreader',
    fontStyle:   'italic',
    color:       T.text,
  },
  // Glossary page uses same padding but smaller type scale
  glossaryPage: {
    backgroundColor: T.bg,
    paddingTop:        48,
    paddingBottom:     48,
    paddingHorizontal: 52,
    fontFamily:  'Newsreader',
    fontStyle:   'italic',
    color:       T.text,
  },

  // ── WATERMARK ──
  watermark: {
    position:      'absolute',
    top:           40,
    right:         32,
    fontSize:      7,
    fontFamily:    'SpaceMono',
    color:         T.text,
    opacity:       0.08,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // ── SECTION SPACING ──
  section:     { marginBottom: 32 },
  sectionLast: { marginBottom: 0 },
  sectionSm:   { marginBottom: 20 },

  // ── LABEL / EYEBROW ──
  label: {
    fontFamily:    'SpaceMono',
    fontSize:      8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color:         T.accent,
    fontWeight:    700,
    marginBottom:  8,
  },
  labelMuted: {
    fontFamily:    'SpaceMono',
    fontSize:      8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color:         T.muted,
    fontWeight:    700,
    marginBottom:  6,
  },

  // ── VERDICT ──
  verdictTitle: {
    fontFamily: 'Newsreader',
    fontStyle:  'italic',
    fontSize:   52,
    color:      T.text,
    lineHeight: 1,
    marginBottom: 14,
  },
  verdictDesc: {
    fontFamily:      'Newsreader',
    fontStyle:       'italic',
    fontSize:        12,
    color:           T.muted,
    lineHeight:      1.6,
    borderLeftWidth: 3,
    borderLeftColor: T.accent,
    paddingLeft:     14,
    maxWidth:        480,
  },

  // ── DIVIDER ──
  divider: {
    borderTopWidth:  0.5,
    borderTopColor:  T.border,
    marginVertical:  24,
  },
  dividerSm: {
    borderTopWidth:  0.5,
    borderTopColor:  T.border,
    marginVertical:  16,
  },

  // ── COST FIGURE ──
  costFigureLarge: {
    fontFamily:   'Roboto',
    fontWeight:   700,
    fontSize:     48,
    color:        T.text,
    lineHeight:   1.4,
    marginBottom: 16,
  },
  costFigureFloor: {
    fontFamily:   'Newsreader',
    fontStyle:    'italic',
    fontSize:     18,
    color:        T.accent,
    lineHeight:   1.4,
    maxWidth:     400,
    marginBottom: 16,
  },
  costFigureRow:          { flexDirection: 'row', marginTop: 4, flexWrap: 'wrap' },
  costFigureItem:         { flexDirection: 'column', marginRight: 32 },
  costFigureValue:        { fontFamily: 'Newsreader', fontStyle: 'italic', fontSize: 22, color: T.accent },
  costFigureValueNeutral: { fontFamily: 'Newsreader', fontStyle: 'italic', fontSize: 22, color: T.text },

  // ── BODY TEXT ──
  body: {
    fontFamily:      'Newsreader',
    fontStyle:       'italic',
    fontSize:        11,
    color:           T.text,
    lineHeight:      1.65,
    borderLeftWidth: 1.5,
    borderLeftColor: T.accent,
    paddingLeft:     14,
    maxWidth:        480,
  },
  bodyMuted: {
    fontFamily:      'Newsreader',
    fontStyle:       'italic',
    fontSize:        10.5,
    color:           T.muted,
    lineHeight:      1.65,
    borderLeftWidth: 2.5,
    borderLeftColor: T.border,
    paddingLeft:     14,
    maxWidth:        480,
  },
  bodyPath: {
    fontFamily:      'Newsreader',
    fontStyle:       'italic',
    fontSize:        10,
    color:           T.muted,
    lineHeight:      1.65,
    borderLeftWidth: 1,
    borderLeftColor: T.border,
    paddingLeft:     14,
    maxWidth:        480,
  },

  // ── LABEL ROW (label + rule) ──
  labelRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  10,
  },
  labelRule: { flex: 1, borderTopWidth: 0.5, borderTopColor: T.border, marginLeft: 10 },

  // ── RECOMMENDED ENGAGEMENT BOX ──
  engagementBox: {
    borderWidth:  0.75,
    borderColor:  T.accent,
    padding:      20,
    marginTop:    4,
  },
  engagementName: {
    fontFamily:   'Newsreader',
    fontStyle:    'italic',
    fontSize:     22,
    color:        T.text,
    marginBottom: 8,
  },
  engagementOutcome: {
    fontFamily:    'SpaceMono',
    fontSize:      7.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color:         T.accent,
    fontWeight:    700,
    lineHeight:    1.5,
  },

  // ── METRIC LEGEND ──
  legendTable: {
    borderWidth:  0.5,
    borderColor:  T.border,
    marginTop:    4,
  },
  legendRow: {
    flexDirection:     'row',
    alignItems:        'flex-start',
    padding:           12,
    borderBottomWidth: 0.5,
    borderBottomColor: T.border,
  },
  legendRowLast: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    padding:       12,
  },
  legendTerm: {
    fontFamily:    'SpaceMono',
    fontSize:      7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color:         T.accent,
    fontWeight:    700,
    width:         110,
    marginRight:   16,
    paddingTop:    1,
  },
  legendDefinition: {
    fontFamily:  'Newsreader',
    fontStyle:   'italic',
    fontSize:    9.5,
    color:       T.muted,
    lineHeight:  1.55,
    flex:        1,
  },

  // ── CASE FOR ACTION ──
  caseGrid:    { borderWidth: 0.5, borderColor: T.border, marginTop: 4 },
  caseCell:    { padding: 20 },
  caseCellBottom: {
    padding:           20,
    borderTopWidth:    0.5,
    borderTopColor:    T.border,
    backgroundColor:   '#FFF5F0',
  },
  caseCostNeutral: {
    fontFamily:  'SpaceMono',
    fontWeight:  700,
    fontSize:    28,
    color:       T.text,
    lineHeight:  1,
  },
  caseCostAccent: {
    fontFamily:  'SpaceMono',
    fontWeight:  700,
    fontSize:    28,
    color:       T.accent,
    lineHeight:  1,
  },
  caseNote: {
    fontFamily:    'SpaceMono',
    fontSize:      7.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color:         T.muted,
    fontWeight:    700,
  },

  // ── GLOSSARY PAGE ──
  glossaryHeader: {
    fontFamily:    'SpaceMono',
    fontSize:      9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color:         T.muted,
    fontWeight:    700,
    marginBottom:  4,
  },
  glossarySubhead: {
    fontFamily:  'Newsreader',
    fontStyle:   'italic',
    fontSize:    9,
    color:       T.muted,
    lineHeight:  1.5,
    marginBottom: 20,
    maxWidth:    420,
  },
  glossaryTable: {
    borderWidth:  0.5,
    borderColor:  T.border,
  },
  glossaryRow: {
    flexDirection:     'row',
    alignItems:        'flex-start',
    padding:           10,
    borderBottomWidth: 0.5,
    borderBottomColor: T.border,
  },
  glossaryRowLast: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    padding:       10,
  },
  glossaryRowActive: {
    flexDirection:     'row',
    alignItems:        'flex-start',
    padding:           10,
    borderBottomWidth: 0.5,
    borderBottomColor: T.border,
    backgroundColor:   '#FFF5F0',
    borderLeftWidth:   2,
    borderLeftColor:   T.accent,
  },
  glossaryLabel: {
    fontFamily:    'SpaceMono',
    fontSize:      7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color:         T.muted,
    fontWeight:    700,
    width:         110,
    marginRight:   16,
    paddingTop:    1,
    opacity:       0.6,
  },
  glossaryLabelActive: {
    fontFamily:    'SpaceMono',
    fontSize:      7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color:         T.accent,
    fontWeight:    700,
    width:         110,
    marginRight:   16,
    paddingTop:    1,
  },
  glossaryDefinition: {
    fontFamily:  'Newsreader',
    fontStyle:   'italic',
    fontSize:    9,
    color:       T.muted,
    lineHeight:  1.55,
    flex:        1,
    opacity:     0.6,
  },
  glossaryDefinitionActive: {
    fontFamily:  'Newsreader',
    fontStyle:   'italic',
    fontSize:    9,
    color:       T.text,
    lineHeight:  1.55,
    flex:        1,
  },
  glossaryFooter: {
    fontFamily:    'SpaceMono',
    fontSize:      7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color:         T.muted,
    fontWeight:    700,
    marginTop:     20,
    opacity:       0.5,
  },
});

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (val) =>
  new Intl.NumberFormat('en-US', {
    style:              'currency',
    currency:           'USD',
    maximumFractionDigits: 0,
  }).format(val);

const METRIC_LEGEND_DISPLAY = [
  {
    term: 'Leadership Execution Gap',
    definition: 'The monthly cost of leadership hours consumed by friction rather than productive work, calculated from your meeting burden and salary inputs.',
  },
  {
    term: 'Radiated Team Impact',
    definition: 'The downstream cost applied to the broader team, weighted by the size of the population waiting on decisions this friction is holding up.',
  },
  {
    term: 'Confirmed Historical Loss',
    definition: 'Capital tied up in stalled initiatives -- projects that cannot move forward because the decisions required to advance them have not been made.',
  },
  {
    term: 'Monthly Burn',
    definition: 'The combined monthly cost of all active friction signals -- execution gap, radiated impact, and confirmed historical loss -- running simultaneously.',
  },
  {
    term: 'Annual Institutional Cost',
    definition: 'Monthly burn annualized. The total cost this organization is absorbing each year as a direct result of the friction pattern identified in this diagnostic.',
  },
];

// ── DOCUMENT ──────────────────────────────────────────────────────────────────
export function DiagnosticDocument({ summary, inputData }) {
  const {
    state,
    tier,
    toneKey,
    agencyScore,
    showGravityFloor,
  } = summary;

  const total                   = Number(summary.total)                   || 0;
  const monthlyBurn             = Number(summary.monthlyBurn)             || 0;
  const executionGap            = Number(summary.executionGap)            || 0;
  const radiatedImpact          = Number(summary.radiatedImpact)          || 0;
  const confirmedHistoricalLoss = Number(summary.confirmedHistoricalLoss) || 0;

  const tierMeta = TIER_META[tier] || {};

  const synthesis     = getSynthesis(state.id, toneKey);
  const inference     = getInference(state.id, toneKey);
  const pathToVerdict = getPathToVerdict(state.id);
  const rationale     = buildRecommendationRationale(tier, state, agencyScore, inputData);

  const monthlyRecovery = Math.round(monthlyBurn * 0.10);
  const annualRecovery  = monthlyRecovery * 12;
  const returnMultiple  = tierMeta.fee
    ? (annualRecovery / tierMeta.fee).toFixed(1)
    : null;

  // Glossary definition for current state
  const stateGlossaryEntry = STATE_GLOSSARY.find(s => s.id === state.id);

  return (
    <Document>

      {/* ══════════════════════════════════════════════════════
          PAGE 1 — THE DIAGNOSTIC RECORD
      ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, paddingBottom: 36 }}>

          {/* Watermark */}
          <Text style={styles.watermark}>Confidential // Record v6.0</Text>

          {/* ── 1. VERDICT ── */}
          <View style={styles.section}>
            <Text style={styles.label}>Institutional State</Text>
            <Text style={styles.verdictTitle}>{state.label}</Text>
            {stateGlossaryEntry && (
              <Text style={styles.verdictDesc}>{stateGlossaryEntry.definition}</Text>
            )}
          </View>
          <View style={styles.divider} />

          {/* ── 2. COST FIGURE ── */}
          <View style={styles.section}>
            <Text style={styles.labelMuted}>Annual Institutional Cost</Text>
            <View style={{ minHeight: 110 }}>
              {showGravityFloor ? (
                <Text style={styles.costFigureFloor}>
                  This is the beginning of an expensive pattern.
                </Text>
              ) : (
                <Text style={styles.costFigureLarge}>{fmt(total)}</Text>
              )}
            </View>
            <View style={styles.costFigureRow}>
              <View style={styles.costFigureItem}>
                <Text style={styles.labelMuted}>Monthly Burn</Text>
                <Text style={styles.costFigureValue}>{fmt(monthlyBurn)}</Text>
              </View>
              {radiatedImpact > 0 && (
                <View style={styles.costFigureItem}>
                  <Text style={styles.labelMuted}>Radiated Impact</Text>
                  <Text style={styles.costFigureValueNeutral}>{fmt(radiatedImpact)}</Text>
                </View>
              )}
              {confirmedHistoricalLoss > 0 && (
                <View style={styles.costFigureItem}>
                  <Text style={styles.labelMuted}>Confirmed Historical Loss</Text>
                  <Text style={styles.costFigureValueNeutral}>{fmt(confirmedHistoricalLoss)}</Text>
                </View>
              )}
              {executionGap > 0 && (
                <View style={styles.costFigureItem}>
                  <Text style={styles.labelMuted}>Execution Gap</Text>
                  <Text style={styles.costFigureValueNeutral}>{fmt(executionGap)}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.divider} />

          {/* ── 3. SIGNAL MATRIX ── */}
          <View style={styles.section}>
            <SignalMatrixPDF summary={summary} inputData={inputData} />
          </View>
          <View style={styles.divider} />

          {/* ── 4. ADVISOR SYNTHESIS ── */}
          <View style={styles.section}>
            <Text style={styles.label}>Advisor Synthesis</Text>
            <Text style={styles.body}>{synthesis}</Text>
          </View>

          {/* ── 5. ADVISOR INFERENCE (conditional) ── */}
          {inference ? (
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Advisor Inference</Text>
                <View style={styles.labelRule} />
              </View>
              <Text style={styles.bodyMuted}>{inference}</Text>
            </View>
          ) : null}

          {/* ── 6. PATH TO VERDICT (conditional) ── */}
          {pathToVerdict ? (
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Path to Verdict</Text>
                <View style={styles.labelRule} />
              </View>
              <Text style={styles.bodyPath}>{pathToVerdict}</Text>
            </View>
          ) : null}
          <View style={styles.divider} />

          {/* ── 7. RECOMMENDED ENGAGEMENT ── */}
          <View style={styles.section}>
            <Text style={styles.label}>Recommended Engagement</Text>
            <View style={styles.engagementBox}>
              <Text style={styles.engagementName}>{tier}</Text>
              <Text style={styles.engagementOutcome}>{tierMeta.outcomeStatement || ''}</Text>
            </View>
          </View>

          {/* ── 8. WHY THIS ENGAGEMENT (conditional) ── */}
          {rationale ? (
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Why This Engagement</Text>
                <View style={styles.labelRule} />
              </View>
              <Text style={styles.body}>{rationale}</Text>
            </View>
          ) : null}
          <View style={styles.divider} />

          {/* ── 9. HOW THE MATH WORKS ── */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>How the Math Works</Text>
              <View style={styles.labelRule} />
            </View>
            <View style={styles.legendTable}>
              {METRIC_LEGEND_DISPLAY.map((item, i) => (
                <View
                  key={item.term}
                  style={i < METRIC_LEGEND_DISPLAY.length - 1 ? styles.legendRow : styles.legendRowLast}
                >
                  <Text style={styles.legendTerm}>{item.term}</Text>
                  <Text style={styles.legendDefinition}>{item.definition}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.divider} />

          {/* ── 10. THE CASE FOR ACTION ── */}
          <View style={styles.sectionLast}>
            <Text style={styles.label}>The Case for Action</Text>
            <View style={styles.caseGrid}>
              <View style={styles.caseCell}>
                <Text style={styles.labelMuted}>Cost of Inaction // Per Year</Text>
                <Text style={styles.caseCostNeutral}>
                  {showGravityFloor ? 'Compounding' : fmt(total)}
                </Text>
                <Text style={styles.caseNote}>Confirmed by this diagnostic</Text>
              </View>
              <View style={styles.caseCellBottom}>
                <Text style={styles.labelMuted}>Cost of Resolution // {tier}</Text>
                <Text style={styles.caseCostAccent}>{tierMeta.feeLabel || ''}</Text>
                {returnMultiple ? (
                  <Text style={styles.caseNote}>
                    {returnMultiple}x return on a 10% friction reduction
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

        </View>
      </Page>

      {/* ══════════════════════════════════════════════════════
          PAGE 2 — INSTITUTIONAL STATE GLOSSARY
          Fine-print supplement register. Visually subordinate
          to the record. Your result is highlighted.
      ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.glossaryPage}>

        {/* Watermark */}
        <Text style={styles.watermark}>Confidential // Record v6.0</Text>

        <Text style={styles.glossaryHeader}>
          Institutional State Glossary
        </Text>
        <Text style={styles.glossarySubhead}>
          The twelve patterns this instrument is designed to identify. Your result appears highlighted below.
        </Text>

        <View style={styles.glossaryTable}>
          {STATE_GLOSSARY.map((entry, i) => {
            const isActive   = entry.id === state.id;
            const isLast     = i === STATE_GLOSSARY.length - 1;

            const rowStyle = isActive
              ? styles.glossaryRowActive
              : isLast
                ? styles.glossaryRowLast
                : styles.glossaryRow;

            return (
              <View key={entry.id} style={rowStyle}>
                <Text style={isActive ? styles.glossaryLabelActive : styles.glossaryLabel}>
                  {entry.label}
                </Text>
                <Text style={isActive ? styles.glossaryDefinitionActive : styles.glossaryDefinition}>
                  {entry.definition}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.glossaryFooter}>
          Principal Resolution // Confidential Diagnostic Record // principalresolution.com
        </Text>

      </Page>

    </Document>
  );
}
