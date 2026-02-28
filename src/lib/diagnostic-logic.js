/**
 * PRINCIPAL RESOLUTION // DIAGNOSTIC ENGINE v6.0
 * Weighted Signal Matrix with Priority Cascading
 * Tri-Axial Scoring: X (Financial Gravity) / Y (Behavioral Complexity) / Z (Institutional Agency)
 *
 * State assignment: X/Y axis
 * Tier assignment: Z axis + State Severity tiebreaker
 *
 * Triple-File Sync: This file is the source of truth for state labels, tier labels,
 * and severity classifications. ResultsLedger.jsx and DiagnosticPDF.jsx must remain
 * in sync with every label defined here.
 */

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

export const TIERS = {
  STABILITY_SUPPORT: 'Stability Support',
  EXECUTIVE_COUNSEL: 'The Executive Counsel',
  INTERVENTION:      'The Intervention',
  ROADMAP:           'The Roadmap',
  DEVELOPMENT:       'Development',
};

export const SEVERITY = {
  HIGH: 'high',
  MID:  'mid',
  LOW:  'low',
};

/**
 * STATE REGISTRY
 * label:       Human-facing name (locked v6.0)
 * id:          Logic identifier
 * severity:    HIGH / MID / LOW — used for Z-axis tier tiebreaker
 * naturalTier: Default tier before Z adjustment
 */
export const STATES = {
  LAST_LEG:          { id: 'LAST_LEG',          label: 'Last Leg',          severity: SEVERITY.HIGH, naturalTier: TIERS.STABILITY_SUPPORT },
  SACRED_COW:        { id: 'SACRED_COW',         label: 'The Sacred Cow',    severity: SEVERITY.HIGH, naturalTier: TIERS.EXECUTIVE_COUNSEL },
  CRACKED_MIRROR:    { id: 'CRACKED_MIRROR',     label: 'Cracked Mirror',    severity: SEVERITY.HIGH, naturalTier: TIERS.EXECUTIVE_COUNSEL },
  EXIT_PATTERN:      { id: 'EXIT_PATTERN',       label: 'The Exit Pattern',  severity: SEVERITY.HIGH, naturalTier: TIERS.INTERVENTION },
  DEAD_CALM:         { id: 'DEAD_CALM',          label: 'Dead Calm',         severity: SEVERITY.MID,  naturalTier: TIERS.INTERVENTION },
  SILOSOLATION:      { id: 'SILOSOLATION',       label: 'Silosolation',      severity: SEVERITY.MID,  naturalTier: TIERS.INTERVENTION },
  RUNAWAY_TREADMILL: { id: 'RUNAWAY_TREADMILL',  label: 'Runaway Treadmill', severity: SEVERITY.MID,  naturalTier: TIERS.ROADMAP },
  FOSSIL_SYSTEM:     { id: 'FOSSIL_SYSTEM',      label: 'The Fossil System', severity: SEVERITY.MID,  naturalTier: TIERS.ROADMAP },
  ANCHOR:            { id: 'ANCHOR',             label: 'The Anchor',        severity: SEVERITY.MID,  naturalTier: TIERS.ROADMAP },
  BROKEN_COMPASS:    { id: 'BROKEN_COMPASS',     label: 'Broken Compass',    severity: SEVERITY.MID,  naturalTier: TIERS.ROADMAP },
  KID_GLOVES:        { id: 'KID_GLOVES',         label: 'Kid Gloves',        severity: SEVERITY.LOW,  naturalTier: TIERS.DEVELOPMENT },
  UNLIT_ROOM:        { id: 'UNLIT_ROOM',         label: 'The Unlit Room',    severity: SEVERITY.LOW,  naturalTier: TIERS.DEVELOPMENT },
};

// ─── UI & SCORING ENUMS (v6.0 Sync) ──────────────────────────────────────────
//
// Shape rules:
//   { label: '...' }  — enums rendered via Object.entries + val.label in OptionButton grids
//   plain string      — enums used in dropdowns (val directly) or display-only
//
// DO NOT flatten { label } objects to plain strings without updating AuditSystem.jsx.
// scoreStates() compares against KEYS only — values/labels are UI display only.

export const INDUSTRY_BENCHMARKS = {
  TECH:         'Technology',
  MEDIA:        'Media/Creative',
  HEALTH:       'Healthcare',
  FINANCE:      'Finance',
  NONPROFIT:    'Non-Profit',
  GOV:          'Government',
  MANUFACTURING:'Manufacturing',
  RETAIL:       'Retail',
  ENERGY:       'Energy',
  CONSULTING:   'Professional Services',
  CONSTRUCTION: 'Construction',
  LOGISTICS:    'Logistics/Supply Chain',
  OTHER:        'Other',
};

export const ORG_STAGES = {
  EARLY:       'Early Stage / Startup',
  GROWTH:      'Rapid Growth / Scaling',
  ESTABLISHED: 'Established / Mature',
  LEGACY:      'Legacy / Institutional',
};

export const LEADERSHIP_TENURES = {
  UNDER_ONE: 'Under 1 Year',
  ONE_3YR:   '1–3 Years',
  FOUR_6YR:  '4–6 Years',
  SEVEN_PLUS:'7+ Years',
};

export const FRICTION_LOCATIONS = {
  WITHIN_LEADERSHIP: { label: 'Within the Leadership Team' },
  CROSS_FUNCTIONAL:  { label: 'Between Departments/Silos' },
  TEAM:              { label: 'Within a Specific Team' },
  UNKNOWN:           { label: 'I cannot pinpoint the source' },
};

export const AVOIDANCE_MECHANISMS = {
  NO_FORUM:      { label: 'No forum for the conversation' },
  PREDETERMINED: { label: 'Decisions are made before meetings' },
  COST_TOO_HIGH: { label: 'The social cost of speaking up is too high' },
  NOT_AN_ISSUE:  { label: 'Leadership denies the problem exists' },
};

export const PRIOR_ATTEMPTS = {
  NONE:         { label: 'No formal attempt made' },
  CONVERSATION: { label: 'Internal conversations only' },
  STRUCTURAL:   { label: 'Structural/Reporting changes' },
  EXTERNAL:     { label: 'Brought in outside help before' },
};

export const PERSONNEL_RISK = {
  NONE: { label: 'No immediate risk' },
  YES:  { label: 'Key people are disengaged/looking' },
  LOST: { label: 'We have already lost critical talent' },
};

export const RESOLUTION_BLOCKAGE = {
  NONE:      { label: 'Clear path to resolution' },
  KNOWN:     { label: 'Known individual/group is blocking' },
  SUSPECTED: { label: 'Suspect a blockage but unconfirmed' },
  ATTEMPTED: { label: 'We tried to resolve it and failed' },
};

export const FRICTION_DURATIONS = {
  UNDER_6MO: { label: 'Under 6 Months' },
  SIX_12MO:  { label: '6–12 Months' },
  ONE_2YR:   { label: '1–2 Years' },
  OVER_2YR:  { label: 'Over 2 Years' },
};

export const DOWNSTREAM_POPULATIONS = {
  INDIVIDUAL: { label: 'Individual/Small Team' },
  LARGE:      { label: 'Large Department' },
  FULL_ORG:   { label: 'The Entire Organization' },
};

export const METRIC_LEGEND = {
  EXECUTION_GAP:    'Leadership Execution Gap',
  RADIATED_IMPACT:  'Radiated Team Impact',
  HISTORICAL_LOSS:  'Confirmed Historical Loss',
};

// ─── INDUSTRY VOLATILITY MULTIPLIERS ─────────────────────────────────────────

const INDUSTRY_MULTIPLIER = {
  TECH:         0.9,
  MEDIA:        0.9,
  HEALTH:       1.1,
  FINANCE:      1.1,
  NONPROFIT:    1.2,
  GOV:          1.2,
  MANUFACTURING:1.0,
  RETAIL:       1.0,
  ENERGY:       1.0,
  CONSULTING:   1.0,
  CONSTRUCTION: 1.0,
  LOGISTICS:    1.0,
  OTHER:        1.0,
};

// ─── FINANCIAL CALCULATIONS ───────────────────────────────────────────────────

/**
 * Derives financial signals from raw inputs.
 * monthlyPayroll = payroll / 12
 * leakRatio = monthlyBurn / monthlyPayroll (capped at 1.0 / 100%)
 */
export function calculateFinancials(inputs) {
  const {
    payroll = 0,
    leadershipHoursLost = 0,
    avgLeadershipSalary = 0,
    teamMultiplier = 1,
    historicalLoss = 0,
    monthlyRevenue = 0,
    stalledProjectCapital = 0,
  } = inputs;

  const monthlyPayroll       = payroll / 12;
  const executionGap         = (leadershipHoursLost / 160) * (avgLeadershipSalary / 12);
  const radiatedImpact       = executionGap * Math.max(0, teamMultiplier - 1);
  const confirmedHistoricalLoss = historicalLoss || 0;
  const monthlyBurn          = executionGap + radiatedImpact + confirmedHistoricalLoss;
  const total                = monthlyBurn * 12;
  const leakRatio            = monthlyPayroll > 0
    ? Math.min(monthlyBurn / monthlyPayroll, 1.0)
    : 0;

  // Gravity Floor: suppress dollar display below $50k annual
  const showGravityFloor = total < 50000;

  return {
    monthlyPayroll,
    executionGap,
    radiatedImpact,
    confirmedHistoricalLoss,
    monthlyBurn,
    total,
    leakRatio,
    showGravityFloor,
    stalledProjectCapital,
    monthlyRevenue,
  };
}

// ─── COORDINATION TAX ─────────────────────────────────────────────────────────

/**
 * Log-scale coordination tax multiplier based on headcount.
 * Returns 1.0 to ~1.5.
 * Used as a corroborating signal weight in The Anchor scoring.
 */
export function coordinationTax(headcount = 0) {
  if (headcount <= 0) return 1.0;
  return Math.min(1.0 + Math.log10(headcount) * 0.2, 1.5);
}

// ─── AVOIDANCE SIGNAL MAPPING ─────────────────────────────────────────────────

/**
 * Maps legacy UI values to v6.0 STRUCTURAL / CULTURAL categories.
 * STRUCTURAL: NO_FORUM, PREDETERMINED
 * CULTURAL:   COST_TOO_HIGH, NOT_AN_ISSUE
 */
export function mapAvoidance(avoidanceMechanism) {
  const structural = ['NO_FORUM', 'PREDETERMINED'];
  const cultural   = ['COST_TOO_HIGH', 'NOT_AN_ISSUE'];
  if (structural.includes(avoidanceMechanism)) return 'STRUCTURAL';
  if (cultural.includes(avoidanceMechanism))   return 'CULTURAL';
  return null;
}

// ─── UNKNOWN FRICTION PENALTY ─────────────────────────────────────────────────

/**
 * If frictionLocation === UNKNOWN, apply 0.8x penalty to all high-severity state scores.
 * Prevents extreme diagnoses when the user cannot locate the problem.
 */
function unknownPenalty(frictionLocation, severity) {
  if (frictionLocation === 'UNKNOWN' && severity === SEVERITY.HIGH) return 0.8;
  return 1.0;
}

// ─── X / Y AXIS SCORING ───────────────────────────────────────────────────────

/**
 * Scores each state against the input signals.
 * Returns an ordered array of { state, score } for cascade evaluation.
 * Only states meeting their Core Requirement are eligible.
 */
function scoreStates(inputs, financials) {
  const {
    industry,
    orgStage,
    leadershipTenure,
    headcount = 0,
    frictionLocation,
    avoidanceMechanism,
    priorAttempt,
    personnelRisk,
    resolutionBlockage,
    frictionDuration,
    decisions,
    downstreamPopulation,
  } = inputs;

  const { leakRatio } = financials;
  const avoidance = mapAvoidance(avoidanceMechanism);
  const industryMult = INDUSTRY_MULTIPLIER[industry] || 1.0;
  const cTax = coordinationTax(headcount);

  const scores = [];

  // ── STATE 01: LAST LEG ──────────────────────────────────────────────────────
  // Core: leakRatio > 0.20 AND personnelRisk: LOST
  if (leakRatio > 0.20 && personnelRisk === 'LOST') {
    let score = 0;
    if (frictionDuration === 'OVER_2YR')           score += 40;
    if (decisions === 'STALLED')                   score += 30;
    if (resolutionBlockage === 'ATTEMPTED')        score += 20;
    const mult = frictionDuration === 'OVER_2YR' ? 1.3 : 1.0;
    scores.push({ state: STATES.LAST_LEG, score: score * mult * industryMult });
  }

  // ── STATE 02: THE SACRED COW ────────────────────────────────────────────────
  // Core: avoidance === CULTURAL AND resolutionBlockage === KNOWN
  if (avoidance === 'CULTURAL' && resolutionBlockage === 'KNOWN') {
    let score = 0;
    if (['YES', 'LOST'].includes(personnelRisk))   score += 40;
    if (frictionLocation === 'WITHIN_LEADERSHIP')  score += 30;
    if (priorAttempt === 'EXTERNAL')               score += 20;
    scores.push({ state: STATES.SACRED_COW, score: score * industryMult * unknownPenalty(frictionLocation, SEVERITY.HIGH) });
  }

  // ── STATE 03: CRACKED MIRROR ────────────────────────────────────────────────
  // Core: frictionLocation === WITHIN_LEADERSHIP AND resolutionBlockage === SUSPECTED
  if (frictionLocation === 'WITHIN_LEADERSHIP' && resolutionBlockage === 'SUSPECTED') {
    let score = 0;
    if (leadershipTenure === 'SEVEN_PLUS')         score += 40;
    if (decisions === 'STALLED')                   score += 30;
    if (priorAttempt === 'CONVERSATION')           score += 20;
    const durationMult = ['ONE_2YR', 'OVER_2YR'].includes(frictionDuration) ? 1.2 : 1.0;
    scores.push({ state: STATES.CRACKED_MIRROR, score: score * durationMult * industryMult * unknownPenalty(frictionLocation, SEVERITY.HIGH) });
  }

  // ── STATE 04: THE EXIT PATTERN ──────────────────────────────────────────────
  // Core: personnelRisk === YES AND frictionDuration === ONE_2YR or OVER_2YR
  const exitDurationMet = ['ONE_2YR', 'OVER_2YR'].includes(frictionDuration);
  if (personnelRisk === 'YES' && exitDurationMet) {
    let score = 0;
    if (leakRatio > 0.10)                          score += 40;
    if (decisions === 'SLOW')                      score += 30;
    if (resolutionBlockage === 'ATTEMPTED')        score += 20;
    scores.push({ state: STATES.EXIT_PATTERN, score: score * industryMult * unknownPenalty(frictionLocation, SEVERITY.HIGH) });
  }

  // ── STATE 05: DEAD CALM ─────────────────────────────────────────────────────
  // Core: decisions === STALLED AND avoidance === STRUCTURAL
  if (decisions === 'STALLED' && avoidance === 'STRUCTURAL') {
    let score = 0;
    if (frictionLocation === 'WITHIN_LEADERSHIP')  score += 40;
    if (priorAttempt === 'NONE')                   score += 30;
    const durationMult = ['ONE_2YR', 'OVER_2YR'].includes(frictionDuration) ? 1.2 : 1.0;
    scores.push({ state: STATES.DEAD_CALM, score: score * durationMult * industryMult });
  }

  // ── STATE 06: SILOSOLATION ──────────────────────────────────────────────────
  // Core: frictionLocation === CROSS_FUNCTIONAL AND avoidance === STRUCTURAL
  if (frictionLocation === 'CROSS_FUNCTIONAL' && avoidance === 'STRUCTURAL') {
    let score = 0;
    if (decisions === 'SLOW')                                            score += 40;
    if (['LARGE', 'FULL_ORG'].includes(downstreamPopulation))           score += 30;
    scores.push({ state: STATES.SILOSOLATION, score: score * industryMult });
  }

  // ── STATE 07: RUNAWAY TREADMILL ─────────────────────────────────────────────
  // Core: orgStage === GROWTH AND frictionDuration === OVER_2YR
  if (orgStage === 'GROWTH' && frictionDuration === 'OVER_2YR') {
    let score = 0;
    if (decisions === 'SLOW')                      score += 40; // reactive, not fast
    if (leadershipTenure === 'UNDER_ONE')          score += 30;
    scores.push({ state: STATES.RUNAWAY_TREADMILL, score: score * industryMult });
  }

  // ── STATE 08: THE FOSSIL SYSTEM ─────────────────────────────────────────────
  // Core: orgStage === LEGACY AND avoidance === STRUCTURAL
  if (orgStage === 'LEGACY' && avoidance === 'STRUCTURAL') {
    let score = 0;
    if (leadershipTenure === 'SEVEN_PLUS')         score += 40;
    if (decisions === 'SLOW')                      score += 30;
    const mult = leadershipTenure === 'SEVEN_PLUS' ? 1.1 : 1.0;
    scores.push({ state: STATES.FOSSIL_SYSTEM, score: score * mult * industryMult });
  }

  // ── STATE 09: THE ANCHOR ────────────────────────────────────────────────────
  // Core: headcount > 50 AND frictionLocation === CROSS_FUNCTIONAL
  if (headcount > 50 && frictionLocation === 'CROSS_FUNCTIONAL') {
    let score = 0;
    if (cTax > 1.2)                                score += 40; // coordination tax corroborates
    if (frictionLocation === 'TEAM')               score += 30;
    if (orgStage === 'ESTABLISHED')                score += 30;
    if (decisions === 'SLOW')                      score += 20;
    scores.push({ state: STATES.ANCHOR, score: score * industryMult });
  }

  // ── STATE 10: BROKEN COMPASS ────────────────────────────────────────────────
  // Core: frictionLocation === WITHIN_LEADERSHIP AND priorAttempt === CONVERSATION
  if (frictionLocation === 'WITHIN_LEADERSHIP' && priorAttempt === 'CONVERSATION') {
    let score = 0;
    if (decisions === 'SLOW')                                            score += 40;
    if (['GROWTH', 'ESTABLISHED'].includes(orgStage))                   score += 30;
    scores.push({ state: STATES.BROKEN_COMPASS, score: score * industryMult });
  }

  // ── STATE 11: KID GLOVES ────────────────────────────────────────────────────
  // Core: avoidance === CULTURAL AND personnelRisk === NONE
  if (avoidance === 'CULTURAL' && personnelRisk === 'NONE') {
    let score = 0;
    if (decisions === 'SLOW')                      score += 40;
    if (frictionDuration === 'ONE_2YR')            score += 30;
    scores.push({ state: STATES.KID_GLOVES, score: score * industryMult });
  }

  return scores;
}

// ─── PRIORITY CASCADE ─────────────────────────────────────────────────────────

/**
 * Priority order reflects clinical urgency.
 * First state to exceed 70 points wins.
 * If two states tie, cascade order determines winner.
 */
const CASCADE_ORDER = [
  STATES.LAST_LEG,
  STATES.SACRED_COW,
  STATES.CRACKED_MIRROR,
  STATES.EXIT_PATTERN,
  STATES.DEAD_CALM,
  STATES.SILOSOLATION,
  STATES.RUNAWAY_TREADMILL,
  STATES.FOSSIL_SYSTEM,
  STATES.BROKEN_COMPASS,
  STATES.ANCHOR,
  STATES.KID_GLOVES,
  STATES.UNLIT_ROOM,
];

const SCORE_THRESHOLD = 70;

// ─── Z-AXIS: AGENCY SCORING ───────────────────────────────────────────────────

/**
 * Agency score starts at 50 (neutral midpoint — capable until proven otherwise).
 * Adjusted by behavioral signals.
 * Capped at 39 if resolutionBlockage === ATTEMPTED.
 */
function calculateAgency(inputs) {
  const { priorAttempt, resolutionBlockage, primaryEmotion, decisions } = inputs;

  let z = 50; // baseline

  // Prior Attempt
  if (priorAttempt === 'NONE')     z += 30;
  if (priorAttempt === 'EXTERNAL') z -= 20;

  // Resolution Blockage
  if (resolutionBlockage === 'NONE')      z += 30;
  if (resolutionBlockage === 'ATTEMPTED') z -= 40;

  // Emotion signals (copy modifier AND Z-proxy)
  if (primaryEmotion === 'APATHY') z -= 30;
  if (primaryEmotion === 'FEAR')   z -= 10;

  // Decision velocity
  if (decisions === 'FAST') z += 20;

  // Hard ceiling: failed internal attempt caps agency
  if (resolutionBlockage === 'ATTEMPTED') {
    z = Math.min(z, 39);
  }

  return Math.max(0, Math.min(z, 100));
}

// ─── TIER ASSIGNMENT ──────────────────────────────────────────────────────────

/**
 * Maps Z-score + state severity to final tier.
 *
 * High Agency (Z > 70):
 *   Low Severity  → Development
 *   Mid/High      → The Roadmap
 *
 * Neutral Agency (Z 40–70):
 *   Low/Mid       → The Roadmap
 *   High          → The Intervention
 *
 * Low Agency (Z < 40):
 *   Low/Mid       → The Intervention
 *   High          → The Executive Counsel
 *
 * Master Rule: Last Leg always → Stability Support regardless of Z.
 */
function assignTier(state, agencyScore) {
  // Master rule — Last Leg is fixed
  if (state.id === 'LAST_LEG') return TIERS.STABILITY_SUPPORT;

  const { severity } = state;

  if (agencyScore > 70) {
    return severity === SEVERITY.LOW ? TIERS.DEVELOPMENT : TIERS.ROADMAP;
  }

  if (agencyScore >= 40) {
    return severity === SEVERITY.HIGH ? TIERS.INTERVENTION : TIERS.ROADMAP;
  }

  // Z < 40
  return severity === SEVERITY.HIGH ? TIERS.EXECUTIVE_COUNSEL : TIERS.INTERVENTION;
}

// ─── FALLBACK VALIDATION ──────────────────────────────────────────────────────

/**
 * The Unlit Room fires only when:
 * 1. No preceding state met its core requirement or exceeded the threshold.
 * 2. Low-water mark signals confirmed: leakRatio < 0.05, personnelRisk: NONE,
 *    resolutionBlockage: NONE, decisions: FAST.
 * 3. Zero-Sum Check: no HIGH signal present (personnelRisk: LOST blocks fallback).
 */
function validateFallback(inputs, financials) {
  const { personnelRisk, resolutionBlockage, decisions } = inputs;
  const { leakRatio } = financials;

  // Zero-Sum Check — any catastrophic signal blocks the fallback
  if (personnelRisk === 'LOST') return false;
  if (resolutionBlockage === 'ATTEMPTED') return false;

  // Low-water mark confirmation
  const lowWater =
    leakRatio < 0.05 &&
    personnelRisk === 'NONE' &&
    resolutionBlockage === 'NONE' &&
    decisions === 'FAST';

  return lowWater;
}

// ─── TONE KEY ─────────────────────────────────────────────────────────────────

/**
 * primaryEmotion passes a toneKey to the frontend for synthesis string selection.
 * Zero scoring weight. Copy modifier only.
 */
export function getToneKey(primaryEmotion) {
  const valid = ['EXHAUSTION', 'FRUSTRATION', 'APATHY', 'FEAR'];
  return valid.includes(primaryEmotion) ? primaryEmotion : 'NEUTRAL';
}

// ─── MAIN ENGINE EXPORT ───────────────────────────────────────────────────────

/**
 * runDiagnostic(inputs)
 *
 * Primary export. Accepts raw user inputs, returns:
 * {
 *   state:       STATES.*      — the matched institutional state
 *   tier:        TIERS.*       — the recommended engagement tier
 *   agencyScore: number        — Z-axis score (0–100)
 *   stateScore:  number        — winning X/Y score
 *   toneKey:     string        — copy modifier from primaryEmotion
 *   financials:  object        — derived financial signals
 *   signals:     object        — scored signal summary for Path to Verdict
 * }
 */
export function runDiagnostic(inputs) {
  const financials  = calculateFinancials(inputs);
  const agencyScore = calculateAgency(inputs);
  const toneKey     = getToneKey(inputs.primaryEmotion);
  const stateScores = scoreStates(inputs, financials);

  // Build score lookup by state ID
  const scoreMap = {};
  stateScores.forEach(({ state, score }) => {
    scoreMap[state.id] = score;
  });

  // Priority cascade — first state exceeding threshold wins
  let matchedState = null;
  let matchedScore = 0;

  for (const candidate of CASCADE_ORDER) {
    if (candidate.id === 'UNLIT_ROOM') break; // handled separately
    const score = scoreMap[candidate.id] || 0;
    if (score >= SCORE_THRESHOLD) {
      matchedState = candidate;
      matchedScore = score;
      break;
    }
  }

  // Fallback: The Unlit Room
  if (!matchedState) {
    const fallbackValid = validateFallback(inputs, financials);
    matchedState = STATES.UNLIT_ROOM;
    matchedScore = 0;

    // If fallback validation fails (high signals present but no state threshold met),
    // find highest-scoring eligible state and assign it regardless of threshold
    if (!fallbackValid) {
      let highestScore = 0;
      let highestState = STATES.UNLIT_ROOM;
      for (const candidate of CASCADE_ORDER) {
        if (candidate.id === 'UNLIT_ROOM') continue;
        const score = scoreMap[candidate.id] || 0;
        if (score > highestScore) {
          highestScore = score;
          highestState = candidate;
        }
      }
      matchedState = highestState;
      matchedScore = highestScore;
    }
  }

  const tier = assignTier(matchedState, agencyScore);

  // Signals summary for Path to Verdict narrative
  const signals = buildSignalSummary(inputs, financials);

  return {
    state:       matchedState,
    tier,
    agencyScore,
    stateScore:  matchedScore,
    toneKey,
    financials,
    signals,
  };
}

// ─── SIGNAL SUMMARY (PATH TO VERDICT) ────────────────────────────────────────

/**
 * Builds a plain-language signal summary for the "Path to Verdict" narrative.
 * The frontend uses this to explain what drove the result.
 */
function buildSignalSummary(inputs, financials) {
  const avoidance = mapAvoidance(inputs.avoidanceMechanism);
  const cTax      = coordinationTax(inputs.headcount);

  return {
    leakRatio:            financials.leakRatio,
    leakRatioPercent:     Math.round(financials.leakRatio * 100),
    avoidanceCategory:    avoidance,
    coordinationTax:      cTax,
    coordinationTaxHigh:  cTax > 1.2,
    frictionLocation:     inputs.frictionLocation,
    frictionDuration:     inputs.frictionDuration,
    personnelRisk:        inputs.personnelRisk,
    resolutionBlockage:   inputs.resolutionBlockage,
    priorAttempt:         inputs.priorAttempt,
    decisions:            inputs.decisions,
    orgStage:             inputs.orgStage,
    leadershipTenure:     inputs.leadershipTenure,
    primaryEmotion:       inputs.primaryEmotion,
    headcount:            inputs.headcount,
    industry:             inputs.industry,
  };
}

// ─── LEGACY COMPATIBILITY SHIM ────────────────────────────────────────────────

/**
 * v5.0 exported assignState() and calculateFinancials() separately.
 * This shim maintains compatibility with any ResultsLedger.jsx or
 * DiagnosticPDF.jsx calls that haven't been migrated yet.
 * Remove after Triple-File Sync is confirmed complete.
 */
export function assignState(inputs) {
  const result = runDiagnostic(inputs);
  return {
    label:      result.state.label,
    id:         result.state.id,
    tier:       result.tier,
    severity:   result.state.severity,
    toneKey:    result.toneKey,
    agencyScore: result.agencyScore,
  };
}

// ─── SERVICE TIER METADATA ────────────────────────────────────────────────────

export const TIER_META = {
  [TIERS.STABILITY_SUPPORT]: {
    feeLabel:        'Quoted at intake',
    cta:             'Call us now',
    outcomeStatement: 'Emergency stabilization during leadership pivots, mass exits, or organizational trauma.',
  },
  [TIERS.EXECUTIVE_COUNSEL]: {
    feeLabel:        'Custom arrangement',
    cta:             'Request Executive Counsel',
    outcomeStatement: 'A confidential ongoing relationship for leaders navigating situations they cannot discuss with anyone inside the building.',
  },
  [TIERS.INTERVENTION]: {
    feeLabel:        'From $29,500',
    cta:             'Bring us in',
    outcomeStatement: 'Direct tactical engagement. We step into the room and handle the high-stakes conversations the internal team cannot.',
  },
  [TIERS.ROADMAP]: {
    feeLabel:        'From $12,500',
    cta:             'Start the Roadmap',
    outcomeStatement: 'Thirty days. A structured diagnosis and prioritized plan the organization can execute.',
  },
  [TIERS.DEVELOPMENT]: {
    feeLabel:        'Pricing at intake',
    cta:             'Start the conversation',
    outcomeStatement: 'Leadership development for individuals and teams. Practical tools, real-world application.',
  },
};
