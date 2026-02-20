/**
 * Principal Resolution // Institutional Logic v3.0
 * Purpose: Converting relatable inputs into a definitive ledger.
 * Tenet: Absolute Candor.
 * Constraints: No em dashes. No semicolons. No "forensic" or "surgical".
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
  STARTUP:     { label: "Startup (Under 3 years)",    tenureContext: "founder-centric" },
  GROWTH:      { label: "Growth (3 to 10 years)",     tenureContext: "scaling friction" },
  ESTABLISHED: { label: "Established (10 to 25 years)", tenureContext: "structural drift" },
  LEGACY:      { label: "Legacy (25+ years)",         tenureContext: "historical drag" }
};

export const LEADERSHIP_TENURES = {
  UNDER_ONE:  { label: "Under 1 year",  context: "inherited" },
  ONE_THREE:  { label: "1 to 3 years",  context: "transitional" },
  THREE_SEVEN:{ label: "3 to 7 years",  context: "established" },
  SEVEN_PLUS: { label: "7+ years",      context: "entrenched" }
};

export const FRICTION_LOCATIONS = {
  TEAM:            { label: "Between leadership and the team",       tierSignal: "ROADMAP" },
  CROSS_FUNCTIONAL:{ label: "Between departments or functions",      tierSignal: "INTERVENTION" },
  WITHIN_LEADERSHIP:{ label: "Within the leadership team itself",    tierSignal: "SAFE_HARBOR" },
  UNKNOWN:         { label: "We know something is wrong but can't locate it", tierSignal: "ROADMAP" }
};

export const AVOIDANCE_MECHANISMS = {
  NO_FORUM:    { label: "No safe forum for them",          tierSignal: "SAFE_HARBOR" },
  PREDETERMINED:{ label: "The outcome feels predetermined", tierSignal: "INTERVENTION" },
  COST_TOO_HIGH:{ label: "The cost seems too high",        tierSignal: "ROADMAP" },
  NOT_AN_ISSUE: { label: "They do happen here",            tierSignal: null }
};
export const PRIOR_ATTEMPTS = {
  NONE:        { label: "We haven't addressed it yet",                                tierSignal: "ROADMAP"       },
  CONVERSATION:{ label: "We've had the conversation — nothing changed",               tierSignal: "INTERVENTION"  },
  EXTERNAL:    { label: "We brought someone in and it didn't work",                   tierSignal: "SAFE_HARBOR"   },
  UNCLEAR:     { label: "We tried something — not sure it addressed the right thing", tierSignal: "INTERVENTION" },
};

export const PERSONNEL_RISK = {
  NONE:        { label: "Not that I'm aware of",                              urgencySignal: 0 },
  POSSIBLY:    { label: "There are signs — nothing confirmed",                urgencySignal: 1 },
  YES:         { label: "Yes, and we know who",                               urgencySignal: 2 },
  LOST:        { label: "We've already lost someone because of it",           urgencySignal: 3 },
};

export const RESOLUTION_BLOCKAGE = {
  NONE:        { label: "No — nothing like that is pending",                    urgencySignal: 0 },
  SUSPECTED:   { label: "Possibly — we haven't named it yet",                   urgencySignal: 1 },
  KNOWN:       { label: "Yes — we know what needs to happen but haven't acted", urgencySignal: 2 },
  ATTEMPTED:   { label: "We've tried and something keeps getting in the way",   urgencySignal: 3 },
};

export const HEADCOUNT_RANGES = {
  MICRO:  { label: "Under 25",   midpoint: 15  },
  SMALL:  { label: "25 to 100",  midpoint: 60  },
  MID:    { label: "100 to 500", midpoint: 250 },
  LARGE:  { label: "500+",       midpoint: 750 }
};

export const INSTITUTIONAL_STATES = {
  STAGNANT_STABILITY: {
    label: "Stagnant Stability",
    desc: "Nothing is visibly breaking, which is part of the problem. The organization is safe and silent in equal measure — and what looks like stability is usually just friction that everyone has learned to live around.",
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
    desc: "High activity is masking high burn. The organization is moving fast — a lot of that energy is being spent overcoming internal friction rather than market challenges. Busy and effective are not the same thing, and right now they're being treated like they are.",
    tier: "INTERVENTION"
  },
  RELATIONAL_FRICTION: {
    label: "Relational Friction",
    desc: "The room is full of people who are too careful with each other. The politeness tax is real and it's keeping the most important conversations off the agenda. What looks like a respectful culture is often just a conflict-averse one.",
    tier: "INTERVENTION"
  },
  TALENT_HEMORRHAGE: {
    label: "Talent Hemorrhage",
    desc: "The people who have other options are quietly evaluating them. Not because the work isn't interesting — because the environment isn't honest enough to keep people who have standards for how they want to work. That's a specific and expensive kind of culture problem.",
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
    desc: "The system has become too complex to support its own weight. Truth-averse cultures don't fail dramatically — they calcify. The coordination tax is at maximum and the organization's ability to adapt has been quietly compromised for longer than anyone wants to admit.",
    tier: "SAFE_HARBOR"
  },
  TOTAL_FRICTION_COLLAPSE: {
    label: "Total Friction Collapse",
    desc: "The math has turned. The cost of staying the same now exceeds the cost of a complete institutional reset. This isn't a warning — it's a finding. The diagnostic has confirmed what was probably already suspected: inaction is no longer the safer option.",
    tier: "STABILITY"
  },
};

// Maps diagnosed tier to service metadata for ResultsLedger
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

const resolveTier = (financialTier, data) => {
  const {
    avoidanceMechanism, frictionLocation, orgStage, leadershipTenure,
    personnelRisk, resolutionBlockage, priorAttempt,
  } = data;

  // Active blockage with failed prior attempt = most acute signal
  if (resolutionBlockage === 'ATTEMPTED' && priorAttempt === 'EXTERNAL') {
    if (financialTier === 'STABILITY') return 'STABILITY';
    return 'SAFE_HARBOR';
  }

  // Known blockage or confirmed personnel loss always escalates
  if (resolutionBlockage === 'KNOWN' || personnelRisk === 'LOST') {
    if (financialTier === 'STABILITY') return 'STABILITY';
    if (financialTier === 'SAFE_HARBOR') return 'SAFE_HARBOR';
    return 'INTERVENTION';
  }

  // Personnel at confirmed risk escalates to at least Intervention
  if (personnelRisk === 'YES') {
    if (financialTier === 'STABILITY') return 'STABILITY';
    if (financialTier === 'SAFE_HARBOR') return 'SAFE_HARBOR';
    return 'INTERVENTION';
  }

  // Avoidance mechanism signals
  if (avoidanceMechanism && avoidanceMechanism !== 'NOT_AN_ISSUE') {
    const avoidanceTier = AVOIDANCE_MECHANISMS[avoidanceMechanism]?.tierSignal;
    if (avoidanceTier === 'SAFE_HARBOR') return 'SAFE_HARBOR';
  }

  // Friction location can upgrade
  if (frictionLocation) {
    const locationTier = FRICTION_LOCATIONS[frictionLocation]?.tierSignal;
    if (locationTier === 'SAFE_HARBOR' && financialTier !== 'STABILITY') return 'SAFE_HARBOR';
    if (locationTier === 'INTERVENTION' && financialTier === 'ROADMAP') return 'INTERVENTION';
  }

  // Prior attempt that didn't hold warrants at least Intervention
  if (priorAttempt === 'EXTERNAL' || priorAttempt === 'CONVERSATION') {
    if (financialTier === 'ROADMAP') return 'INTERVENTION';
  }

  // Legacy org with entrenched leadership + low financial signal
  if (orgStage === 'LEGACY' && leadershipTenure === 'SEVEN_PLUS' && financialTier === 'ROADMAP') {
    return 'INTERVENTION';
  }

  // Inherited leadership problem
  if (leadershipTenure === 'UNDER_ONE' && financialTier !== 'STABILITY') {
    return 'SAFE_HARBOR';
  }

  return financialTier;
};

export const calculateRealitySummary = (data) => {
  const {
    payroll,
    industry = 'TECH',
    headcountRange = 'SMALL',
    revenueBest,
    revenueWorst,
    personnel = [],
    stalledProjectCapital,
    meetingHours = 5,
    isUnsurePayroll = false,
    isUnsureRevenue = false,
    orgStage = 'ESTABLISHED',
    leadershipTenure = 'THREE_SEVEN',
    frictionLocation = 'UNKNOWN',
    avoidanceMechanism = 'NOT_AN_ISSUE',
    urgency = 'NO'
  } = data;

  const sector = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.OTHER;
  const headcountMidpoint = HEADCOUNT_RANGES[headcountRange]?.midpoint || 60;

  // PERSONNEL COUNT AND WEIGHTING
  const execCount   = personnel.find(p => p.id === 'EXECUTIVE')?.count  || 0;
  const managerCount= personnel.find(p => p.id === 'MANAGER')?.count    || 0;
  const staffCount  = personnel.find(p => p.id === 'PROFESSIONAL')?.count || 0;
  const totalHeadcount = Math.max(1, execCount + managerCount + staffCount);
  const weightedHeadcount = (execCount * 1.5) + (managerCount * 1.2) + staffCount;

  // PAYROLL — use industry estimate if bypassed
  const activePayroll = isUnsurePayroll
    ? (headcountMidpoint * sector.avgSalary)
    : (Number(payroll) || (headcountMidpoint * sector.avgSalary));

  // REVENUE GAP — use sector volatility if bypassed
  const activeRevGap = isUnsureRevenue
    ? (activePayroll * sector.volatility)
    : Math.max(0, (Number(revenueBest) || 0) - (Number(revenueWorst) || 0));

  // COORDINATION TAX — log scaling based on headcount range
  const scalingFactor = headcountMidpoint > 500 ? 0.35 : 0.20;
  const cTax = 1 + (Math.log10(Math.max(1, headcountMidpoint)) * scalingFactor);

  // MEETING BURN
  const perPersonPayroll = activePayroll / Math.max(1, totalHeadcount);
  const hourlyRate = perPersonPayroll / 2080;
  const monthlyMeetingBurn = (meetingHours * 4 * hourlyRate) * cTax * (weightedHeadcount / 10);

  // STALLED DRAG — default to 5% of payroll
  const activeStalledDrag = Number(stalledProjectCapital) || (activePayroll * 0.05);

  // TOTALS
  const monthlyLeak    = monthlyMeetingBurn;
  const historicalWaste= activeStalledDrag + activeRevGap;
  const totalImpact    = (monthlyLeak * 12) + historicalWaste;

  // FINANCIAL STATE ASSIGNMENT
  const monthlyPayroll = activePayroll / 12;
  const leakRatio      = monthlyLeak / monthlyPayroll;

  let stateKey = "STRATEGIC_DRIFT";

  if (leakRatio < 0.10) {
    if (cTax > 1.2)                            stateKey = "PROCESS_PARALYSIS";
    else if (leakRatio < 0.05 && cTax < 1.1)  stateKey = "SILO_ISOLATION";
    else                                        stateKey = "STAGNANT_STABILITY";
  } else if (leakRatio < 0.20) {
    if (execCount > 4)                          stateKey = "RELATIONAL_FRICTION";
    else if (activeRevGap > activePayroll * 0.1) stateKey = "TALENT_HEMORRHAGE";
    else                                        stateKey = "CAFFEINE_CULTURE";
  } else if (leakRatio < 0.35) {
    if (cTax > 1.3)                             stateKey = "INSTITUTIONAL_RIGIDITY";
    else if (execCount > 5)                     stateKey = "EXECUTIVE_EMBARGO";
    else if (activeStalledDrag > activePayroll * 0.1) stateKey = "STALLED_HEGEMONY";
    else                                        stateKey = "BRILLIANT_SABOTAGE";
  } else {
    stateKey = "TOTAL_FRICTION_COLLAPSE";
  }

  const diagnosedState = INSTITUTIONAL_STATES[stateKey];
  const financialTier  = diagnosedState.tier;
  const resolvedTier   = resolveTier(financialTier, data);
  const recommendation = TIER_RECOMMENDATIONS[resolvedTier];

  return {
    total:           Math.round(totalImpact),
    monthlyBurn:     Math.round(monthlyLeak),
    historicalWaste: Math.round(historicalWaste),
    executionGap:    Math.round(activeRevGap),
    coordinationTax: cTax.toFixed(2),
    state:           diagnosedState,
    recommendation,
    resolvedTier,
    // Context for synthesis panel
    context: {
      orgStage,
      leadershipTenure,
      frictionLocation,
      avoidanceMechanism,
      urgency,
      industry,
      headcountRange,
      execCount,
      leakRatio: leakRatio.toFixed(3)
    },
    glossary: {
      silenceTax:       "The cost of withheld truth. Avoided conflict leads to expensive repairs instead of cheap preventions.",
      frictionLatency:  "The time cost between identifying a problem and acting on it. High latency equals a higher monthly burn."
    }
  };
};
