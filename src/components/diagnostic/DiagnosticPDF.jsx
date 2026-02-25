import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import {
  INDUSTRY_BENCHMARKS,
  ORG_STAGES,
  LEADERSHIP_TENURES,
  FRICTION_LOCATIONS,
  AVOIDANCE_MECHANISMS,
  METRIC_LEGEND,
} from '../../lib/diagnostic-logic';
Font.register({
  family: 'Newsreader',
  fonts: [
    { src: '/fonts/Newsreader-Italic.ttf', fontStyle: 'italic' },
  ],
});
Font.register({
  family: 'SpaceMono',
  fonts: [
    { src: '/fonts/SpaceMono-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/SpaceMono-Bold.ttf', fontWeight: 700 },
  ],
});
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 700 },
  ],
});
// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg:      '#FAF9F6',
  text:    '#1C1C1C',
  accent:  '#FF4500',
  muted:   '#6B6560',
  border:  '#D0CBC2',
};
const styles = StyleSheet.create({
  page: {
    backgroundColor: T.bg,
    paddingTop:        36,
    paddingBottom:     36,
    paddingHorizontal: 52,
    fontFamily: 'Newsreader',
    fontStyle: 'italic',
    color: T.text,
  },
  // ── watermark ──
  watermark: {
    position: 'absolute',
    top: 40,
    right: 32,
    fontSize: 7,
    fontFamily: 'SpaceMono',
    color: T.text,
    opacity: 0.08,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // ── section spacing ──
  section: { marginBottom: 32 },
  sectionLast: { marginBottom: 0 },
  // ── label / eyebrow ──
  label: {
    fontFamily: 'SpaceMono',
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: T.accent,
    fontWeight: 700,
    marginBottom: 8,
  },
  labelMuted: {
    fontFamily: 'SpaceMono',
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: T.muted,
    fontWeight: 700,
    marginBottom: 6,
  },
  // ── verdict ──
  verdictTitle: {
    fontFamily: 'Newsreader',
    fontStyle: 'italic',
    fontSize: 52,
    color: T.text,
    lineHeight: 1,
    marginBottom: 14,
  },
  verdictDesc: {
    fontFamily: 'Newsreader',
    fontStyle: 'italic',
    fontSize: 12,
    color: T.muted,
    lineHeight: 1.6,
    borderLeftWidth: 3,
    borderLeftColor: T.accent,
    paddingLeft: 14,
    maxWidth: 480,
  },
  // ── divider ──
  divider: {
    borderTopWidth: 0.5,
    borderTopColor: T.border,
    marginVertical: 24,
  },
  // ── cost figure ──
  costFigureLarge: {
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: 48,
    color: T.text,
    lineHeight: 1.4,
    marginBottom: 16,
  },
  costFigureRow: { flexDirection: 'row', gap: 32, marginTop: 4, flexWrap: 'wrap' },
  costFigureItem: { flexDirection: 'column', gap: 4 },
  costFigureValue: {
    fontFamily: 'Newsreader',
    fontStyle: 'italic',
    fontSize: 22,
    color: T.accent,
  },
  costFigureValueNeutral: {
    fontFamily: 'Newsreader',
    fontStyle: 'italic',
    fontSize: 22,
    color: T.text,
  },
  // ── body text (synthesis / inference / rationale) ──
  body: {
    fontFamily: 'Newsreader',
    fontStyle: 'italic',
    fontSize: 11,
    color: T.text,
    lineHeight: 1.65,
    borderLeftWidth: 1.5,
    borderLeftColor: T.accent,
    paddingLeft: 14,
    maxWidth: 480,
  },
  bodyMuted: {
    fontFamily: 'Newsreader',
    fontStyle: 'italic',
    fontSize: 10.5,
    color: T.muted,
    lineHeight: 1.65,
    borderLeftWidth: 2.5,
    borderLeftColor: T.border,
    paddingLeft: 14,
    maxWidth: 480,
  },
  // ── divider row (label + rule) ──
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  labelRule: { flex: 1, borderTopWidth: 0.5, borderTopColor: T.border },
  // ── recommended engagement box ──
  engagementBox: {
    borderWidth: 0.75,
    borderColor: T.accent,
    padding: 20,
    marginTop: 4,
  },
  engagementName: {
    fontFamily: 'Newsreader',
    fontStyle: 'italic',
    fontSize: 22,
    color: T.text,
    marginBottom: 8,
  },
  engagementOutcome: {
    fontFamily: 'SpaceMono',
    fontSize: 7.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: T.accent,
    fontWeight: 700,
    lineHeight: 1.5,
  },
  // ── metric legend ──
  legendTable: {
    borderWidth: 0.5,
    borderColor: T.border,
    marginTop: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: T.border,
  },
  legendRowLast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 16,
  },
  legendTerm: {
    fontFamily: 'SpaceMono',
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: T.accent,
    fontWeight: 700,
    width: 110,
    paddingTop: 1,
  },
  legendDefinition: {
    fontFamily: 'Newsreader',
    fontStyle: 'italic',
    fontSize: 9.5,
    color: T.muted,
    lineHeight: 1.55,
    flex: 1,
  },
  // ── benchmark block ──
  benchmarkBlock: {
    backgroundColor: T.text,
    padding: 20,
    marginTop: 4,
  },
  benchmarkLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 7.5,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: T.accent,
    fontWeight: 700,
    marginBottom: 8,
  },
  benchmarkQuote: {
    fontFamily: 'Newsreader',
    fontStyle: 'italic',
    fontSize: 11,
    color: T.bg,
    lineHeight: 1.65,
  },
  // ── case for action grid ──
  caseGrid: {
    borderWidth: 0.5,
    borderColor: T.border,
    marginTop: 4,
  },
  caseCell: { padding: 20, gap: 8 },
  caseCellBottom: {
    padding: 20,
    gap: 8,
    borderTopWidth: 0.5,
    borderTopColor: T.border,
    backgroundColor: '#FFF5F0',
  },
  caseCostNeutral: {
    fontFamily: 'SpaceMono',
    fontWeight: 700,
    fontSize: 28,
    color: T.text,
    lineHeight: 1,
  },
  caseCostAccent: {
    fontFamily: 'SpaceMono',
    fontWeight: 700,
    fontSize: 28,
    color: T.accent,
    lineHeight: 1,
  },
  caseNote: {
    fontFamily: 'SpaceMono',
    fontSize: 7.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: T.muted,
    fontWeight: 700,
  },
});
// ── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (val) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);

// v4.0 label constants -- must match INSTITUTIONAL_STATES exactly
const V4_LABELS = {
  INSTITUTIONAL_PROTECTION: "Institutional protection is blocking your path forward.",
  CULTURE_SELECTING_OUT:    "Culture is currently selecting against high performers.",
  PROBLEM_AT_THE_TOP:       "The problem is at the top.",
  STRUCTURAL_NOT_PERSONAL:  "The problem is structural, not personal.",
  UNKNOWN_UNKNOWN:          "We don't know what we don't know.",
  HIGH_ACTIVITY_HIGH_BURN:  "High activity is masking high burn.",
};

function buildSynthesis(summary, inputData) {
  const { state, recommendation, monthlyBurn, total, context } = summary;
  const { orgStage, leadershipTenure, frictionLocation, avoidanceMechanism } = context;
  const industry = INDUSTRY_BENCHMARKS[inputData.industry]?.label || inputData.industry;
  const stage    = ORG_STAGES[orgStage]?.label || orgStage;
  const tenure   = LEADERSHIP_TENURES[leadershipTenure]?.label || leadershipTenure;
  const friction = FRICTION_LOCATIONS[frictionLocation]?.label?.toLowerCase() || 'an unlocated source';
  const avoidanceLine = {
    NO_FORUM:      "The absence of a safe forum means the real conversation has never had a place to happen.",
    PREDETERMINED: "When outcomes feel predetermined, filtered information reaches leadership -- and the real problem stays hidden.",
    COST_TOO_HIGH: "The perceived cost of the conversation is being weighed against the actual cost of avoiding it. The math does not favor avoidance.",
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
    CONVERSATION: "A prior conversation addressed this without producing change -- a signal that the source hasn't been reached yet.",
    UNCLEAR:      "It's unclear whether previous efforts addressed the right problem, which is itself a finding.",
  }[inputData.priorAttempt] || "";

  // v4.0 labels are full sentences -- don't embed them in "presenting a X pattern" construction
  const isV4Label = Object.values(V4_LABELS).includes(state.label);
  const openingLine = isV4Label
    ? `This ${stage.toLowerCase()} ${industry} organization: ${state.label}`
    : `This ${stage.toLowerCase()} ${industry} organization is presenting a ${state.label} pattern.`;

  return [
    openingLine,
    `The friction is concentrated ${friction}, with leadership in place for ${tenure.toLowerCase()}.`,
    avoidanceLine,
    personnelRiskLine,
    resolutionBlockageLine,
    priorAttemptLine,
    `At ${fmt(monthlyBurn)} per month, the annual institutional cost is ${fmt(total)}.`,
    `Based on this profile, the recommended entry point is ${recommendation.name}.`,
  ].filter(Boolean).join(' ');
}

function buildInferredObservation(summary, inputData) {
  const { state } = summary;
  const {
    industry, orgStage, leadershipTenure, frictionLocation,
    avoidanceMechanism, priorAttempt, personnelRisk, resolutionBlockage,
  } = inputData;

  // ── v4.0 IFTTT State Observations ──────────────────────────────────────────
  if (state.label === V4_LABELS.INSTITUTIONAL_PROTECTION) {
    return "Two attempts at resolution and something keeps getting in the way. In my experience, that pattern almost always means the blockage has institutional protection -- someone or something with enough influence to survive the intervention. The next engagement needs to reach that layer directly.";
  }
  if (state.label === V4_LABELS.CULTURE_SELECTING_OUT) {
    return "This organization has already lost someone because of this dynamic. That is a confirmed cost, not a projection. The people who have other options are quietly evaluating them -- not because the work isn't interesting, but because the environment isn't honest enough to keep people who have standards for how they want to work. That's a specific and expensive kind of culture problem, and it compounds with time.";
  }
  if (state.label === V4_LABELS.PROBLEM_AT_THE_TOP) {
    return "The people with the authority to make the decision are the same people whose dynamic is preventing it. That is a closed loop. No amount of process improvement or structural change will resolve something that lives in the leadership team itself. Until that dynamic is named and worked directly, any intervention will work around it rather than through it.";
  }
  if (state.label === V4_LABELS.STRUCTURAL_NOT_PERSONAL) {
    return "Cross-functional friction that survives a direct conversation is almost never a communication problem. If the friction is between departments, it lives in how the organization is designed -- not in how the people in it are talking to each other. Those are different problems with different solutions, and it matters which one you're actually addressing.";
  }
  if (state.label === V4_LABELS.UNKNOWN_UNKNOWN) {
    return "Not being able to locate the source of organizational friction is a legitimate presenting condition, not a failure of self-awareness. Organizations that can't locate the problem are often the ones closest to it. The diagnostic exists precisely for this -- the first act of resolution is finding out exactly what you're resolving.";
  }
  if (state.label === V4_LABELS.HIGH_ACTIVITY_HIGH_BURN) {
    return "This organization has been moving fast enough that it hasn't stopped to name what it's actually running on. Speed is functioning as avoidance here -- not deliberately, but effectively. The cost has been accumulating in the background while the activity level made it easy not to look.";
  }

  // ── v3.0 Legacy State Observations ─────────────────────────────────────────
  if (priorAttempt === 'EXTERNAL' && resolutionBlockage === 'ATTEMPTED') {
    return "Two attempts at resolution and something keeps getting in the way. In my experience, that pattern almost always means the blockage has institutional protection -- someone or something with enough influence to survive the intervention. The next engagement needs to reach that layer directly.";
  }
  if (priorAttempt === 'EXTERNAL' && resolutionBlockage === 'KNOWN') {
    return "A previous external engagement didn't produce lasting change, and there's a decision the organization knows needs to happen but hasn't. Those two facts are usually related. The prior intervention likely addressed the visible dynamic without reaching the source of the blockage.";
  }
  if (priorAttempt === 'CONVERSATION' && frictionLocation === 'CROSS_FUNCTIONAL') {
    return "Cross-functional friction that survives a direct conversation is almost never a communication problem. If the conversation happened and nothing changed, the friction is structural -- it lives in how the organization is designed, not in how the people in it are talking to each other.";
  }
  if (priorAttempt === 'CONVERSATION' && frictionLocation === 'WITHIN_LEADERSHIP') {
    return "A leadership team conversation that produced no lasting change usually means the conversation didn't include the person who most needed to be in it -- or that person was in it and the dynamic made honest engagement impossible. The source is still in place.";
  }
  if (frictionLocation === 'WITHIN_LEADERSHIP' && avoidanceMechanism === 'PREDETERMINED' && priorAttempt === 'EXTERNAL') {
    return "The previous engagement didn't hold because predetermined outcomes in a leadership team almost always trace back to a single person whose position makes the outcome feel inevitable before the conversation starts. Until that dynamic is named directly, any intervention will work around it rather than through it.";
  }
  if (frictionLocation === 'WITHIN_LEADERSHIP' && avoidanceMechanism === 'NO_FORUM' && resolutionBlockage === 'KNOWN') {
    return "The organization knows what needs to happen and has built -- probably without deciding to -- a culture that makes it impossible to say so out loud. That's not an accident and it's not a coincidence. The absence of a forum and the presence of an unmade decision are the same problem from two different angles.";
  }
  if (frictionLocation === 'WITHIN_LEADERSHIP' && orgStage === 'LEGACY' && leadershipTenure === 'SEVEN_PLUS') {
    return "When leadership friction has been present for seven-plus years in a legacy organization with no forum to surface it, the patterns have usually been in place longer than anyone will admit out loud. The people who built them are still in the room. That's not an obstacle to resolution -- it's the resolution. The conversation has to include them directly.";
  }
  if (state.label === 'Executive Embargo' && resolutionBlockage === 'KNOWN') {
    return "The leadership team is both the source of the friction and the reason the resolution can't happen. That's a closed loop -- the people with the authority to make the decision are the same people whose dynamic is preventing it. Getting out of it requires someone outside that loop to name it clearly enough that action becomes possible.";
  }
  if (state.label === 'Caffeine Culture' && priorAttempt === 'NONE') {
    return "This organization has been moving fast enough that it hasn't stopped to name what it's actually running on. Speed is functioning as avoidance here -- not deliberately, but effectively. The cost has been accumulating in the background while the activity level made it easy not to look.";
  }
  if (state.label === 'Talent Hemorrhage' && (personnelRisk === 'YES' || personnelRisk === 'LOST')) {
    return "The institutional state and the personnel risk signal are confirming the same thing: this culture is already selecting against the people it most needs to keep. That's not a retention problem with a recruiting solution. It's an environment problem, and the people with the highest standards for how they want to work are the first ones to act on it.";
  }
  if (state.label === 'Brilliant Sabotage' && priorAttempt === 'NONE') {
    return "High individual performance coexisting with collective dysfunction almost never resolves on its own -- because the person at the center of it is also the person whose output makes it feel too costly to address. The longer it goes unnamed, the more entrenched the dynamic becomes and the more the organization shapes itself around accommodating it.";
  }
  if ((industry === 'CONSULTING' || industry === 'FINANCE') && avoidanceMechanism === 'PREDETERMINED') {
    return "In an organization that runs on analytical rigor, predetermined outcomes in leadership conversations are a specific kind of credibility problem. The analysis is real. The conclusion was decided before it started. The rigor is being used to justify a decision that was made on other grounds -- and the people in the room know it.";
  }
  if (industry === 'NONPROFIT' && personnelRisk === 'LOST') {
    return "Losing someone to organizational dysfunction in a mission-driven organization carries a specific cost that doesn't appear in any financial calculation. The people who join nonprofits have already made a values-based trade. When the environment fails them, they don't just leave the organization -- they often leave the sector. The mission didn't protect the person serving it.";
  }
  if (industry === 'MEDIA' && frictionLocation === 'WITHIN_LEADERSHIP' && avoidanceMechanism === 'NO_FORUM') {
    return "Creative cultures are often psychologically safer for disagreement about the work than for disagreement about the people doing it. The same environment that produces passionate creative debate can be completely silent about the leadership dynamic making that debate harder. The two cultures coexist in the same room and almost never interact.";
  }
  if (industry === 'TECH' && orgStage === 'STARTUP' && priorAttempt === 'EXTERNAL') {
    return "An external engagement that didn't hold in a startup usually means the founding dynamic reasserted itself as soon as the external presence left. That dynamic is the product of the founding relationships -- it predates the organization and it will outlast any intervention that doesn't reach it directly.";
  }
  return null;
}

function buildRecommendationRationale(summary, inputData) {
  const { state, recommendation } = summary;
  const {
    industry, orgStage, frictionLocation, avoidanceMechanism,
    priorAttempt, personnelRisk, resolutionBlockage, leadershipTenure,
  } = inputData;
  const tier = recommendation.name;
  if (tier === 'Stability Support') {
    return "The math has turned on this one. The diagnostic is showing a cost of inaction that exceeds what a structured intervention can address incrementally. What's needed now isn't a plan -- it's immediate stabilization. Stability Support is the right entry point because the window for a deliberate process has closed and what happens in the next few weeks will determine what's possible after that.";
  }
  if (tier === 'Safe Harbor') {
    if (priorAttempt === 'EXTERNAL' && resolutionBlockage === 'ATTEMPTED') {
      return "Safe Harbor is the right entry point here because two prior attempts at resolution haven't held, which tells us the source of the blockage has institutional protection. What's needed isn't another structured engagement -- it's a sustained, confidential relationship that can operate outside the dynamics that have protected the problem so far.";
    }
    if (leadershipTenure === 'UNDER_ONE') {
      return "Safe Harbor is the right entry point because you're navigating a problem you inherited, not one you created. The friction predates your tenure and the people who built it are probably still in the room. What you need isn't an intervention -- it's a confidential relationship with someone who can help you see the landscape clearly and move through it without the constraints that come with a formal engagement.";
    }
    if (frictionLocation === 'WITHIN_LEADERSHIP' && avoidanceMechanism === 'PREDETERMINED') {
      return "Safe Harbor is the right entry point because predetermined outcomes in a leadership team almost always trace back to a single dynamic that a structured intervention can work around but rarely reaches directly. What's needed is the kind of relationship where that dynamic can be named without consequence and addressed without the political weight that comes with a formal process.";
    }
    if (personnelRisk === 'LOST' || resolutionBlockage === 'ATTEMPTED') {
      return "Safe Harbor is the right entry point because this situation has already produced consequences -- and something is actively preventing the resolution the organization knows it needs. A structured engagement alone won't reach that. What's needed is a sustained, confidential presence that can operate where the formal process can't.";
    }
    return "Safe Harbor is the right entry point because what this profile describes isn't a situation that a time-bound structured engagement will resolve. The friction is too embedded, the stakes are too specific, and what's needed is an indefinite confidential relationship -- not a project with a deliverable at the end.";
  }
  if (tier === 'The Intervention') {
    if (summary.total > 1000000 && state.label.includes("structural")) {
      return "The Intervention is the right entry point because the financial gravity of this situation has exceeded the window for a standard roadmap. At an annual cost of " + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(summary.total) + ", the roadmap phase represents an additional and unnecessary liability. We recommend moving directly to resolution.";
    }
    if (personnelRisk === 'YES' && resolutionBlockage === 'KNOWN') {
      return `Based on what this diagnostic describes -- ${state.label.replace(/\.$/, '').toLowerCase()} in a ${INDUSTRY_BENCHMARKS[industry]?.label || industry} organization, with someone at risk of leaving and a decision the organization knows needs to happen -- The Intervention is the right entry point. The situation is already in motion. What's needed isn't a roadmap for addressing it. It's someone in the room to move it through.`;
    }
    if (priorAttempt === 'CONVERSATION') {
      return "The Intervention is the right entry point because a prior conversation addressed this without producing change -- which means the source hasn't been reached yet. The Roadmap assumes a level of organizational readiness to act on its findings that this profile suggests isn't fully in place. The Intervention goes where the conversation didn't.";
    }
    if (priorAttempt === 'EXTERNAL') {
      return "A previous external engagement didn't hold, which tells us the resolution needs to go somewhere the last one didn't reach. The Intervention is the right entry point because it doesn't produce a plan for your organization to execute -- it produces the resolution directly, in the room, with the people who need to be part of it.";
    }
    if (frictionLocation === 'WITHIN_LEADERSHIP' && personnelRisk !== 'NONE') {
      return "The Intervention is the right entry point because the friction is inside the leadership team and there's already a personnel consequence in play. At that combination, a diagnostic and roadmap phase delays the resolution the organization actually needs. We come in, we address it directly, and you leave with the thing done -- not a plan to do it.";
    }
    if (orgStage === 'LEGACY' && leadershipTenure === 'SEVEN_PLUS') {
      return "The Intervention is the right entry point because what this profile describes has been in place long enough that a roadmap phase would spend its time documenting what everyone already knows. The patterns are established, the cost is confirmed, and the organization needs someone to move it -- not map it.";
    }
    return "The Intervention is the right entry point based on this profile. The pattern combined with the behavioral signals this diagnostic has surfaced indicates that what's needed is resolution, not a plan for resolution. The Roadmap is the right entry point when the organization needs clarity on what to address. This organization already has that clarity. What it needs now is someone to address it.";
  }
  if (tier === 'The Roadmap') {
    if (priorAttempt === 'NONE') {
      return "The Roadmap is the right entry point because this is the first structured look at what's happening and what it's costing. Before bringing someone in to resolve it, it's worth getting a precise diagnosis of where the friction lives, what's sustaining it, and what resolution actually needs to look like for this specific organization. The Roadmap produces that -- and a plan your team can execute on.";
    }
    if (frictionLocation === 'CROSS_FUNCTIONAL') {
      return "Cross-functional friction is the hardest kind to resolve without first mapping it precisely -- because what looks like a relationship problem is almost always a structural one. The Roadmap is the right entry point because it will identify whether the friction is in the design of the organization or in the dynamics between the people in it. Those are different problems with different solutions, and the distinction is worth getting right before bringing someone in to address it.";
    }
    if (frictionLocation === 'TEAM') {
      return "The Roadmap is the right entry point because friction between leadership and the team almost always has a specific origin point that a diagnostic phase will surface. Going straight to intervention without that clarity risks addressing the symptom rather than the source. The Roadmap gives you the precise picture and a structured path forward.";
    }
    return "The Roadmap is the right entry point based on this profile. The friction is real and the cost is confirmed -- but the profile indicates this organization is in a position to address it deliberately rather than urgently. The Roadmap will name the source precisely, build the case internally, and give your team a structured path to resolution that doesn't require an external presence to execute.";
  }
  return null;
}

// ── DOCUMENT ─────────────────────────────────────────────────────────────────
export function DiagnosticDocument({ summary, inputData }) {
  const { total: _total, monthlyBurn: _monthlyBurn, executionGap: _executionGap, radiatedImpact: _radiated, confirmedHistoricalLoss: _chl, state, recommendation, resolvedTier, hammerCitation } = summary;
  const total                  = Number(_total)     || 0;
  const monthlyBurn            = Number(_monthlyBurn) || 0;
  const executionGap           = Number(_executionGap) || 0;
  const radiatedImpact         = Number(_radiated)   || 0;
  const confirmedHistoricalLoss= Number(_chl)        || 0;
  const synthesis           = buildSynthesis(summary, inputData);
  const inferredObservation = buildInferredObservation(summary, inputData);
  const rationale           = buildRecommendationRationale(summary, inputData);
  const monthlyRecovery = Math.round(monthlyBurn * 0.10);
  const annualRecovery  = monthlyRecovery * 12;
  const returnMultiple  = recommendation.fee
    ? (annualRecovery / recommendation.fee).toFixed(1)
    : null;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, paddingBottom: 36 }}>
          {/* Watermark */}
          <Text style={styles.watermark}>Confidential // Record v4.1</Text>
          {/* ── 1. VERDICT ── */}
          <View style={styles.section}>
            <Text style={styles.label}>Institutional State</Text>
            <Text style={styles.verdictTitle}>{state.label}</Text>
            <Text style={styles.verdictDesc}>{state.desc || ''}</Text>
          </View>
          <View style={styles.divider} />
          {/* ── 2. COST FIGURE ── */}
          <View style={styles.section}>
            <Text style={styles.labelMuted}>Annual Institutional Cost</Text>
            <View style={{ minHeight: 110 }}>
              <Text style={styles.costFigureLarge}>{fmt(total)}</Text>
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
          {/* ── 3. ADVISOR SYNTHESIS ── */}
          <View style={styles.section}>
            <Text style={styles.label}>Advisor Synthesis</Text>
            <Text style={styles.body}>{synthesis}</Text>
          </View>
          {/* ── 4. ADVISOR INFERENCE (conditional) ── */}
          {inferredObservation ? (
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Advisor Inference</Text>
                <View style={styles.labelRule} />
              </View>
              <Text style={styles.bodyMuted}>{inferredObservation}</Text>
            </View>
          ) : null}
          <View style={styles.divider} />
          {/* ── 5. RECOMMENDED ENGAGEMENT ── */}
          <View style={styles.section}>
            <Text style={styles.label}>Recommended Engagement</Text>
            <View style={styles.engagementBox}>
              <Text style={styles.engagementName}>{recommendation.name}</Text>
              <Text style={styles.engagementOutcome}>{recommendation.outcome || ''}</Text>
            </View>
          </View>
          {/* ── 6. WHY THIS ENGAGEMENT (conditional) ── */}
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
          {/* ── 7. INSTITUTIONAL BENCHMARKS (conditional) ── */}
          {hammerCitation ? (
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Institutional Benchmarks</Text>
                <View style={styles.labelRule} />
              </View>
              <View style={styles.benchmarkBlock}>
                <Text style={styles.benchmarkLabel}>{hammerCitation.source}</Text>
                <Text style={styles.benchmarkQuote}>"{hammerCitation.text}"</Text>
              </View>
            </View>
          ) : null}
          <View style={styles.divider} />
          {/* ── 8. HOW THE MATH WORKS (Metric Legend) ── */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>How the Math Works</Text>
              <View style={styles.labelRule} />
            </View>
            <View style={styles.legendTable}>
              {METRIC_LEGEND.map((item, i) => (
                <View
                  key={item.term}
                  style={i < METRIC_LEGEND.length - 1 ? styles.legendRow : styles.legendRowLast}
                >
                  <Text style={styles.legendTerm}>{item.term}</Text>
                  <Text style={styles.legendDefinition}>{item.definition}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.divider} />
          {/* ── 8. THE CASE FOR ACTION ── */}
          <View style={styles.sectionLast}>
            <Text style={styles.label}>The Case for Action</Text>
            <View style={styles.caseGrid}>
              <View style={styles.caseCell}>
                <Text style={styles.labelMuted}>Cost of Inaction // Per Year</Text>
                <Text style={styles.caseCostNeutral}>{fmt(total)}</Text>
                <Text style={styles.caseNote}>Confirmed by this diagnostic</Text>
              </View>
              <View style={styles.caseCellBottom}>
                <Text style={styles.labelMuted}>Cost of Resolution // {recommendation.name}</Text>
                <Text style={styles.caseCostAccent}>{recommendation.feeLabel || ''}</Text>
                {returnMultiple ? (
                  <Text style={styles.caseNote}>{returnMultiple}x return on a 10% friction reduction</Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}