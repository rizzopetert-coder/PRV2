import { HAMMER_CITATIONS } from '../data/hammer-citations';

/**
 * Principal Resolution // Institutional Logic v4.1
 * Purpose: Converting relatable inputs into a definitive ledger.
 * Tenet: Absolute Candor.
 * Constraints: No em dashes. No semicolons. No "forensic" or "surgical".
 *
 * Priority Matrix v4.5 (The Latitude Mandate)
 * Rule 0: 7% Red Line -- leakRatio >= 0.07 returns TOTAL_FRICTION_COLLAPSE (STABILITY)
 * Rule 1: [Removed] -- confirmedHistoricalLoss is a display-only ledger entry, not a state trigger
 * Rule 2: Acute Behavior -- ATTEMPTED + EXTERNAL returns SAFE_HARBOR (or STABILITY if Rule 0/1 fired)
 * Rule 3: Proportional Fallback -- leakRatio bands assign Authority / Efficiency / Clarity tiers
 */

export const INDUSTRY_BENCHMARKS = {
  TECH:         { label: "Technology / SaaS",            multiplier: 2.2, avgSalary: 165000, volatility: 0.15 },
  FINANCE:      { label: "Finance / Banking",            multiplier: 1.8, avgSalary: 185000, volatility: 0.12 },
  CONSULTING:   { label: "Consulting / Agency",          multiplier: 1.6, avgSalary: 155000, volatility: 0.20 },
  HEALTH:       { label: "Healthcare / Pharma",          multiplier: 1.8, avgSalary: 145000, volatility: 0.10 },
  MANUFACTURING:{ label: "Manufacturing / Industrial",   multiplier: 1.2, avgSalary: 95000,  volatility: 0.08 },
  RETAIL:       { label: "Retail / E-Commerce",          multiplier: 0.9, avgSalary: 85000,  volatility: 0.15 },
  ENERGY:       { label: "Energy / Utilities",           multiplier: 1.4, avgSalary: 135000, volatility: 0.10 },
  MEDIA:        { label: "Media / Entertainment",        multiplier: 1.4, avgSalary: 125000, volatility: 0.18 },
  CONSTRUCTION: { label: "Construction / Real Estate",   multiplier: 1.1, avgSalary: 110000, volatility: 0.12 },
  NONPROFIT:    { label: "Non Profit / Education",       multiplier: 1.0, avgSalary: 90000,  volatility: 0.05 },
  LOGISTICS:    { label: "Logistics / Transport",        multiplier: 1.1, avgSalary: 100000, volatility: 0.10 },
  OTHER:        { label: "Other / Diversified",          multiplier: 1.0, avgSalary: 120000, volatility: 0.15 }
};

export const ORG_STAGES = {
  STARTUP:     { label: "Startup (Under 3 years)",      tenureContext: "founder-centric"  },
  GROWTH:      { label: "Growth (3 to 10 years)",       tenureContext: "scaling friction" },
  ESTABLISHED: { label: "Established (10 to 25 years)", tenureContext: "structural drift" },
  LEGACY:      { label: "Legacy (25+ years)",           tenureContext: "historical drag"  }
};

export const LEADERSHIP_TENURES = {
  UNDER_ONE:   { label: "Under 1 year",  context: "inherited"     },
  ONE_THREE:   { label: "1 to 3 years",  context: "transitional"  },
  THREE_SEVEN: { label: "3 to 7 years",  context: "established"   },
  SEVEN_PLUS:  { label: "7+ years",      context: "entrenched"    }
};

export const FRICTION_LOCATIONS = {
  TEAM:             { label: "Between leadership and the team",            tierSignal: "ROADMAP"       },
  CROSS_FUNCTIONAL: { label: "Between departments or functions",           tierSignal: "INTERVENTION"  },
  WITHIN_LEADERSHIP:{ label: "Within the leadership team itself",          tierSignal: "SAFE_HARBOR"   },
  UNKNOWN:          { label: "We know something is wrong but can't locate it", tierSignal: "ROADMAP"   }
};

export const AVOIDANCE_MECHANISMS = {
  NO_FORUM:     { label: "No safe forum for them",           tierSignal: "SAFE_HARBOR"   },
  PREDETERMINED:{ label: "The outcome feels predetermined",  tierSignal: "INTERVENTION"  },
  COST_TOO_HIGH:{ label: "The cost seems too high",          tierSignal: "ROADMAP"       },
  NOT_AN_ISSUE: { label: "They do happen here",              tierSignal: null            }
};

export const PRIOR_ATTEMPTS = {
  NONE:        { label: "We haven't addressed it yet",                                tierSignal: "ROADMAP"      },
  CONVERSATION:{ label: "We've had the conversation -- nothing changed",              tierSignal: "INTERVENTION" },
  EXTERNAL:    { label: "We brought someone in and it didn't work",                   tierSignal: "SAFE_HARBOR"  },
  UNCLEAR:     { label: "We tried something -- not sure it addressed the right thing",tierSignal: "INTERVENTION" },
};

export const PERSONNEL_RISK = {
  NONE:    { label: "Not that I'm aware of",               urgencySignal: 0 },
  POSSIBLY:{ label: "There are signs -- nothing confirmed", urgencySignal: 1 },
  YES:     { label: "Yes, and we know who",                 urgencySignal: 2 },
  LOST:    { label: "We've already lost someone because of it", urgencySignal: 3 },
};

export const RESOLUTION_BLOCKAGE = {
  NONE:     { label: "No -- nothing like that is pending",                    urgencySignal: 0 },
  SUSPECTED:{ label: "Possibly -- we haven't named it yet",                   urgencySignal: 1 },
  KNOWN:    { label: "Yes -- we know what needs to happen but haven't acted", urgencySignal: 2 },
  ATTEMPTED:{ label: "We've tried to move on it and haven't been able to",    urgencySignal: 3 },
};

export const HEADCOUNT_RANGES = {
  MICRO: { label: "Under 25",   midpoint: 15  },
  SMALL: { label: "25 to 100",  midpoint: 60  },
  MID:   { label: "100 to 500", midpoint: 250 },
  LARGE: { label: "500+",       midpoint: 750 }
};

// Downstream population exposed to friction-at-the-top
export const DOWNSTREAM_POPULATIONS = {
  NONE:    { label: "Just the friction group",         multiplier: 0    },
  SMALL:   { label: "Up to 25 people",                 multiplier: 25   },
  MEDIUM:  { label: "25 to 100 people",                multiplier: 60   },
  LARGE:   { label: "100 to 500 people",               multiplier: 250  },
  FULL_ORG:{ label: "The entire organization",         multiplier: null }, // uses totalHeadcount
};

export const FRICTION_DURATIONS = {
  UNDER_3:  { label: "Under 3 months",  months: 2   },
  THREE_6:  { label: "3 to 6 months",   months: 4.5 },
  SIX_12:   { label: "6 to 12 months",  months: 9   },
  ONE_2YR:  { label: "1 to 2 years",    months: 18  },
  OVER_2YR: { label: "Over 2 years",    months: 30  },
};

export const INSTITUTIONAL_STATES = {
  STAGNANT_STABILITY: {
    label: "Stagnant Stability",
    desc: "Nothing is visibly breaking, which is part of the problem. The organization is safe and silent in equal measure -- and what looks like stability is usually just friction that everyone has learned to live around.",
    tier: "ROADMAP"
  },
  PROCESS_PARALYSIS: {
    label: "Process Paralysis",
    desc: "The burn is controlled but the coordination tax is real. Permission has become the primary product. The organization is over-governed and under-executed, and the people closest to the work know it better than the people approving it.",
    tier: "ROADMAP"
  },
  SILO_ISOLATION: {
    label: "Silo Isolation",
    desc: "Individual units are performing. The connective tissue between them isn't. Information is staying inside departments that need to be sharing it, and the strategic picture leadership is working from is missing pieces everyone else can see.",
    tier: "ROADMAP"
  },
  STRATEGIC_DRIFT: {
    label: "Strategic Drift",
    desc: "The misses are small enough to explain away and large enough to compound. The gap between where the organization intended to go and where it's actually heading is a candor problem wearing a strategy disguise.",
    tier: "ROADMAP"
  },
  CAFFEINE_CULTURE: {
    label: "Caffeine Culture",
    desc: "High activity is masking high burn. The organization is moving fast -- a lot of that energy is being spent overcoming internal friction rather than market challenges. Busy and effective are not the same thing, and right now they're being treated like they are.",
    tier: "INTERVENTION"
  },
  RELATIONAL_FRICTION: {
    label: "Relational Friction",
    desc: "The room is full of people who are too careful with each other. The politeness tax is real and it's keeping the most important conversations off the agenda. What looks like a respectful culture is often just a conflict-averse one.",
    tier: "INTERVENTION"
  },
  TALENT_HEMORRHAGE: {
    label: "Talent Hemorrhage",
    desc: "The people who have other options are quietly evaluating them. Not because the work isn't interesting -- because the environment isn't honest enough to keep people who have standards for how they want to work. That's a specific and expensive kind of culture problem.",
    tier: "INTERVENTION"
  },
  BRILLIANT_SABOTAGE: {
    label: "Brilliant Sabotage",
    desc: "Someone in the room is winning individually while the collective loses. The individual output is real. The net impact on the organization is negative. High performance and high dysfunction are coexisting in a way that's capping everyone else's ceiling.",
    tier: "INTERVENTION"
  },
  STALLED_HEGEMONY: {
    label: "Stalled Hegemony",
    desc: "The organization is being governed by projects nobody will kill and decisions nobody will make. Historical momentum is dictating future strategy. What started as ambition is now dead weight that everyone is working around and nobody will name.",
    tier: "INTERVENTION"
  },
  EXECUTIVE_EMBARGO: {
    label: "Executive Embargo",
    desc: "The leadership team has become the bottleneck. Decision velocity is effectively zero because the people with authority to move things forward are the same people keeping things still. The rest of the organization is waiting and has been for a while.",
    tier: "SAFE_HARBOR"
  },
  INSTITUTIONAL_RIGIDITY: {
    label: "Institutional Rigidity",
    desc: "The system has become too complex to support its own weight. Truth-averse cultures don't fail dramatically -- they calcify. The coordination tax is at maximum and the organization's ability to adapt has been quietly compromised for longer than anyone wants to admit.",
    tier: "SAFE_HARBOR"
  },
  TOTAL_FRICTION_COLLAPSE: {
    label: "Total Friction Collapse",
    desc: "The math has turned. The cost of staying the same now exceeds the cost of a complete institutional reset. This isn't a warning -- it's a finding. The diagnostic has confirmed what was probably already suspected: inaction is no longer the safer option.",
    tier: "STABILITY"
  },
};

export const TIER_RECOMMENDATIONS = {
  ROADMAP: {
    name: "The Roadmap",
    fee: 12500,
    feeLabel: "From $12,500",
    cta: "Start the Roadmap",
    outcome: "You leave with a diagnosis that names the real problem and a plan your team can actually execute."
  },
  INTERVENTION: {
    name: "The Intervention",
    fee: 29500,
    feeLabel: "From $29,500",
    cta: "Bring us in",
    outcome: "You leave with resolution. Not a plan to resolve. Not a framework for resolving. The thing itself, done."
  },
  SAFE_HARBOR: {
    name: "Safe Harbor",
    fee: null,
    feeLabel: "Custom Arrangement",
    cta: "Request Safe Harbor",
    outcome: "No judgment, no agenda, no clock running. Just the kind of clarity that's only possible when someone is entirely and indefinitely in your corner."
  },
  STABILITY: {
    name: "Stability Support",
    fee: null,
    feeLabel: "Quoted at intake",
    cta: "Call us now",
    outcome: "Your mission stays intact. Your people come through it with more trust in leadership than when the crisis began."
  }
};

// ---------------------------------------------------------------------------
// METRIC LEGEND -- definitions used in ResultsLedger and PDF
// ---------------------------------------------------------------------------
export const METRIC_LEGEND = [
  {
    term: "Institutional Leak",
    definition: "The monthly hard-dollar cost of time lost to friction. Not an estimate of what might happen -- a calculation of what is already leaving the building every month."
  },
  {
    term: "Coordination Tax",
    definition: "A weighted multiplier for organizational complexity. Larger organizations pay more per friction event because every misalignment ripples across more people, more meetings, and more decisions."
  },
  {
    term: "Radiated Impact",
    definition: "Secondary burn on downstream populations waiting for decisions that aren't being made. When friction lives at the top, the people below it absorb a 10% productivity loss while they wait."
  },
  {
    term: "Execution Gap",
    definition: "The delta between best-case revenue potential and actual results. The space between what this organization could be producing and what it is."
  },
  {
    term: "Confirmed Historical Loss",
    definition: "Capital already incinerated. The Institutional Leak multiplied by how long the friction has been running. This is a ledger entry, not a projection."
  },
];

// ---------------------------------------------------------------------------
// COMPETITIVE PRIORITY MATRIX v4.5
// ---------------------------------------------------------------------------
const resolveFinancialState = (leakRatio) => {
  // Rule 0: The 7% Red Line
  if (leakRatio >= 0.07) {
    return { stateKey: 'TOTAL_FRICTION_COLLAPSE', financialTier: 'STABILITY' };
  }

  // Rule 1: confirmedHistoricalLoss is a display-only ledger entry.
  // It is returned in the summary object and shown in the UI and PDF
  // but does not participate in state assignment.

  // Rule 3: Proportional Fallback
  // Authority band: 2% to 7% leak ratio
  if (leakRatio >= 0.02) {
    return { stateKey: null, financialTier: 'AUTHORITY' };
  }

  // Efficiency band: 1% to 2%
  if (leakRatio >= 0.01) {
    return { stateKey: null, financialTier: 'EFFICIENCY' };
  }

  // Clarity band: < 1%
  return { stateKey: null, financialTier: 'CLARITY' };
};

const resolveStateFromBandAndSignals = (financialTier, data, cTax, execCount, activeRevGap, activePayroll, activeStalledDrag) => {
  const { frictionLocation, avoidanceMechanism, orgStage, leadershipTenure, personnelRisk } = data;

  if (financialTier === 'STABILITY') return 'TOTAL_FRICTION_COLLAPSE';

  if (financialTier === 'AUTHORITY') {
    // Within the leadership team is the most contained version of authority-band friction
    if (frictionLocation === 'WITHIN_LEADERSHIP') return 'EXECUTIVE_EMBARGO';
    if (cTax > 1.3) return 'INSTITUTIONAL_RIGIDITY';
    if (personnelRisk === 'LOST' || personnelRisk === 'YES') return 'TALENT_HEMORRHAGE';
    if (avoidanceMechanism === 'PREDETERMINED' && execCount > 3) return 'BRILLIANT_SABOTAGE';
    return 'RELATIONAL_FRICTION';
  }

  if (financialTier === 'EFFICIENCY') {
    if (activeStalledDrag > activePayroll * 0.10) return 'STALLED_HEGEMONY';
    if (activeRevGap > activePayroll * 0.10) return 'TALENT_HEMORRHAGE';
    if (execCount > 4) return 'CAFFEINE_CULTURE';
    return 'CAFFEINE_CULTURE';
  }

  // CLARITY band
  if (cTax > 1.2) return 'PROCESS_PARALYSIS';
  if (frictionLocation === 'CROSS_FUNCTIONAL') return 'SILO_ISOLATION';
  if (orgStage === 'LEGACY' && leadershipTenure === 'SEVEN_PLUS') return 'STRATEGIC_DRIFT';
  return 'STAGNANT_STABILITY';
};

// Rule 2: Behavioral override -- runs after financial state is set
const applyBehavioralOverride = (financialTier, stateKey, data) => {
  const { resolutionBlockage, priorAttempt, personnelRisk, frictionLocation, avoidanceMechanism, orgStage, leadershipTenure } = data;

  // Rule 2: Acute behavior -- ATTEMPTED blockage + EXTERNAL prior = institutional protection
  if (resolutionBlockage === 'ATTEMPTED' && priorAttempt === 'EXTERNAL') {
    if (financialTier === 'STABILITY') return { stateKey, resolvedTier: 'STABILITY' };
    return { stateKey, resolvedTier: 'SAFE_HARBOR' };
  }

  // Known blockage or confirmed personnel loss -- escalate to at least INTERVENTION
  if (resolutionBlockage === 'KNOWN' || personnelRisk === 'LOST') {
    if (financialTier === 'STABILITY') return { stateKey, resolvedTier: 'STABILITY' };
    if (financialTier === 'AUTHORITY') return { stateKey, resolvedTier: 'SAFE_HARBOR' };
    return { stateKey, resolvedTier: 'INTERVENTION' };
  }

  // Confirmed personnel at risk
  if (personnelRisk === 'YES') {
    if (financialTier === 'STABILITY') return { stateKey, resolvedTier: 'STABILITY' };
    if (financialTier === 'AUTHORITY') return { stateKey, resolvedTier: 'SAFE_HARBOR' };
    return { stateKey, resolvedTier: 'INTERVENTION' };
  }

  // Avoidance mechanism: no safe forum = can't even start
  if (avoidanceMechanism === 'NO_FORUM') {
    if (financialTier === 'STABILITY') return { stateKey, resolvedTier: 'STABILITY' };
    return { stateKey, resolvedTier: 'SAFE_HARBOR' };
  }

  // Friction location signals
  if (frictionLocation === 'WITHIN_LEADERSHIP' && financialTier !== 'STABILITY') {
    return { stateKey, resolvedTier: 'SAFE_HARBOR' };
  }
  if (frictionLocation === 'CROSS_FUNCTIONAL' && financialTier === 'CLARITY') {
    return { stateKey, resolvedTier: 'INTERVENTION' };
  }

  // Prior attempt escalation
  if ((priorAttempt === 'EXTERNAL' || priorAttempt === 'CONVERSATION') && financialTier === 'CLARITY') {
    return { stateKey, resolvedTier: 'INTERVENTION' };
  }

  // Inherited leadership in a high-stakes context
  if (leadershipTenure === 'UNDER_ONE' && financialTier !== 'STABILITY') {
    return { stateKey, resolvedTier: 'SAFE_HARBOR' };
  }

  // Legacy + entrenched leadership
  if (orgStage === 'LEGACY' && leadershipTenure === 'SEVEN_PLUS' && financialTier === 'CLARITY') {
    return { stateKey, resolvedTier: 'INTERVENTION' };
  }

  // Map financial tier to engagement tier
  const tierMap = {
    STABILITY:  'STABILITY',
    AUTHORITY:  'SAFE_HARBOR',
    EFFICIENCY: 'INTERVENTION',
    CLARITY:    'ROADMAP',
  };

  return { stateKey, resolvedTier: tierMap[financialTier] || 'ROADMAP' };
};

// ---------------------------------------------------------------------------
// MAIN EXPORT
// ---------------------------------------------------------------------------
export const calculateRealitySummary = (data) => {
  const {
    industry         = 'TECH',
    orgStage         = 'ESTABLISHED',
    headcountRange   = 'SMALL',
    headcount,                          // exact count -- primary denominator
    activePayroll: rawPayroll,
    leadershipTenure = 'THREE_SEVEN',
    frictionLocation = 'UNKNOWN',
    avoidanceMechanism = 'NOT_AN_ISSUE',
    priorAttempt,
    personnelRisk,
    resolutionBlockage,
    downstreamPopulation = 'NONE',
    frictionDuration = 'UNDER_3',
    meetingHours     = 5,
    isUnsurePayroll  = false,
    revenueBest,
    revenueWorst,
    isUnsureRevenue  = false,
    stalledProjectCapital,
  } = data;

  const sector = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.OTHER;

  // ── PRECISION HEADCOUNT ─────────────────────────────────────────────────
  // Exact headcount is the primary denominator. Midpoint is the fallback only.
  const headcountMidpoint = HEADCOUNT_RANGES[headcountRange]?.midpoint || 60;
  const totalHeadcount    = Number(headcount) || headcountMidpoint;

  // ── PAYROLL ──────────────────────────────────────────────────────────────
  const activePayroll = isUnsurePayroll
    ? (totalHeadcount * sector.avgSalary)
    : (Number(rawPayroll) || (totalHeadcount * sector.avgSalary));

  // ── HOURLY RATE -- per Section 3 MOB precision rule ─────────────────────
  // perPersonPayroll / 2080, never activePayroll / 2080
  const perPersonPayroll = activePayroll / Math.max(1, totalHeadcount);
  const hourlyRate       = perPersonPayroll / 2080;

  // ── COORDINATION TAX ─────────────────────────────────────────────────────
  const scalingFactor = totalHeadcount > 500 ? 0.35 : 0.20;
  const cTax          = 1 + (Math.log10(Math.max(1, totalHeadcount)) * scalingFactor);

  // ── EXECUTIVE COUNT (estimated from headcount range if not provided) ────
  const execCount = data.execCount || Math.max(2, Math.round(totalHeadcount * 0.05));

  // ── INSTITUTIONAL LEAK (Direct Burn) ────────────────────────────────────
  // Meeting hours * weekly * hourly rate * coordination tax * friction group size
  const frictionGroupSize    = Math.min(execCount + Math.round(totalHeadcount * 0.10), totalHeadcount);
  const monthlyMeetingBurn   = (meetingHours * 4 * hourlyRate) * cTax * frictionGroupSize;

  // ── RADIATED IMPACT (10% Idle Tax on downstream population) ─────────────
  const downstreamConfig = DOWNSTREAM_POPULATIONS[downstreamPopulation] || DOWNSTREAM_POPULATIONS.NONE;
  const downstreamCount  = downstreamConfig.multiplier === null
    ? totalHeadcount                    // FULL_ORG
    : (downstreamConfig.multiplier || 0);

  // Monthly cost of a 10% productivity loss on the downstream group
  const radiatedImpact = downstreamCount > 0
    ? (perPersonPayroll / 12) * 0.10 * downstreamCount
    : 0;

  // ── TOTAL MONTHLY LEAK ──────────────────────────────────────────────────
  const monthlyLeak = monthlyMeetingBurn + radiatedImpact;

  // ── CONFIRMED HISTORICAL LOSS ────────────────────────────────────────────
  const durationMonths           = FRICTION_DURATIONS[frictionDuration]?.months || 2;
  const confirmedHistoricalLoss  = monthlyLeak * durationMonths;

  // ── REVENUE GAP ──────────────────────────────────────────────────────────
  const activeRevGap = isUnsureRevenue
    ? (activePayroll * sector.volatility)
    : Math.max(0, (Number(revenueBest) || 0) - (Number(revenueWorst) || 0));

  // ── STALLED DRAG ─────────────────────────────────────────────────────────
  const activeStalledDrag = Number(stalledProjectCapital) || (activePayroll * 0.05);

  // ── TOTALS ───────────────────────────────────────────────────────────────
  const historicalWaste = activeStalledDrag + activeRevGap;
  const totalImpact     = (monthlyLeak * 12) + historicalWaste;

  // ── LEAK RATIO ───────────────────────────────────────────────────────────
  const monthlyPayroll = activePayroll / 12;
  const leakRatio      = monthlyLeak / Math.max(1, monthlyPayroll);

  // ── PRIORITY MATRIX v4.5 ─────────────────────────────────────────────────
  const { stateKey: financialStateKey, financialTier } = resolveFinancialState(leakRatio);

  const resolvedStateKey = financialStateKey || resolveStateFromBandAndSignals(
    financialTier, data, cTax, execCount, activeRevGap, activePayroll, activeStalledDrag
  );

  const { stateKey: finalStateKey, resolvedTier } = applyBehavioralOverride(
    financialTier, resolvedStateKey, data
  );

  const diagnosedState = INSTITUTIONAL_STATES[finalStateKey] || INSTITUTIONAL_STATES.STAGNANT_STABILITY;
  const recommendation = TIER_RECOMMENDATIONS[resolvedTier];

  const hammerCitation = getHammerCitation({
    leakRatio,
    personnelRisk:      data.personnelRisk,
    resolutionBlockage: data.resolutionBlockage,
    frictionDuration:   data.frictionDuration,
  });

  return {
    total:                  Math.round(totalImpact),
    monthlyBurn:            Math.round(monthlyLeak),
    radiatedImpact:         Math.round(radiatedImpact),
    confirmedHistoricalLoss:Math.round(confirmedHistoricalLoss),
    historicalWaste:        Math.round(historicalWaste),
    executionGap:           Math.round(activeRevGap),
    coordinationTax:        cTax.toFixed(2),
    state:                  diagnosedState,
    recommendation,
    resolvedTier,
    leakRatio:              leakRatio.toFixed(4),
    frictionDurationMonths: durationMonths,
    hammerCitation,
    context: {
      orgStage,
      leadershipTenure,
      frictionLocation,
      avoidanceMechanism,
      industry,
      headcountRange,
      totalHeadcount,
      execCount,
      leakRatio: leakRatio.toFixed(3)
    },
    glossary: {
      silenceTax:      "The cost of withheld truth. Avoided conflict leads to expensive repairs instead of cheap preventions.",
      frictionLatency: "The time cost between identifying a problem and acting on it. High latency equals a higher monthly burn."
    }
  };
};

// ---------------------------------------------------------------------------
// HAMMER CITATION SELECTOR
// Selects the single most aggressive citation based on firing priority:
// 1. TALENT_ARSON   -- personnelRisk YES or LOST
// 2. DECISION_LATENCY -- resolutionBlockage ATTEMPTED
// 3. CULTURAL_SCARRING -- frictionDuration > 12 months
// 4. FINANCIAL_GRAVITY -- leakRatio > 5% (baseline fallback)
// Within each category, the highest-weight citation is returned.
// ---------------------------------------------------------------------------
export const getHammerCitation = ({ leakRatio, personnelRisk, resolutionBlockage, frictionDuration }) => {
  const LONG_DURATION_KEYS = new Set(['ONE_2YR', 'OVER_2YR']);

  let targetTag = null;

  if (personnelRisk === 'YES' || personnelRisk === 'LOST') {
    targetTag = 'TALENT_ARSON';
  } else if (resolutionBlockage === 'ATTEMPTED') {
    targetTag = 'DECISION_LATENCY';
  } else if (LONG_DURATION_KEYS.has(frictionDuration)) {
    targetTag = 'CULTURAL_SCARRING';
  } else if (leakRatio >= 0.05) {
    targetTag = 'FINANCIAL_GRAVITY';
  }

  // Fallback: highest-weight citation in the full catalog
  if (!targetTag) {
    return HAMMER_CITATIONS.reduce((best, c) => c.weight > best.weight ? c : best);
  }

  const pool = HAMMER_CITATIONS.filter(c => c.forceTag === targetTag);
  return pool.reduce((best, c) => c.weight > best.weight ? c : best);
};