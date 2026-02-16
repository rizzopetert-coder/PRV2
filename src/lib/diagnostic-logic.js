/**
 * Principal Resolution // Institutional Logic v2.6
 * Purpose: Converting relatable inputs into a definitive ledger.
 * Tenet: Absolute Candor.
 * Constraints: No em dashes. No semicolons. No "forensic" or "surgical".
 */

export const INDUSTRY_BENCHMARKS = {
  TECH: { label: "Technology / SaaS", multiplier: 2.2, avgSalary: 165000, volatility: 0.15 },
  FINANCE: { label: "Finance / Banking", multiplier: 1.8, avgSalary: 185000, volatility: 0.12 },
  CONSULTING: { label: "Consulting / Agency", multiplier: 1.6, avgSalary: 155000, volatility: 0.20 },
  HEALTH: { label: "Healthcare / Pharma", multiplier: 1.8, avgSalary: 145000, volatility: 0.10 },
  MANUFACTURING: { label: "Manufacturing / Industrial", multiplier: 1.2, avgSalary: 95000, volatility: 0.08 },
  RETAIL: { label: "Retail / E-Commerce", multiplier: 0.9, avgSalary: 85000, volatility: 0.15 },
  ENERGY: { label: "Energy / Utilities", multiplier: 1.4, avgSalary: 135000, volatility: 0.10 },
  MEDIA: { label: "Media / Entertainment", multiplier: 1.4, avgSalary: 125000, volatility: 0.18 },
  CONSTRUCTION: { label: "Construction / Real Estate", multiplier: 1.1, avgSalary: 110000, volatility: 0.12 },
  NONPROFIT: { label: "Non Profit / Education", multiplier: 1.0, avgSalary: 90000, volatility: 0.05 },
  LOGISTICS: { label: "Logistics / Transport", multiplier: 1.1, avgSalary: 100000, volatility: 0.10 },
  OTHER: { label: "Other / Diversified", multiplier: 1.0, avgSalary: 120000, volatility: 0.15 }
};

export const INSTITUTIONAL_STATES = {
  STAGNANT_STABILITY: { 
    label: "Stagnant Stability", 
    desc: "Low burn but zero velocity. You are not leaking money but you are not gaining ground. The system is safe but silent." 
  },
  PROCESS_PARALYSIS: { 
    label: "Process Paralysis", 
    desc: "Burn is controlled but coordination tax is high. You are over governed and under executed. Permission is the primary bottleneck." 
  },
  SILO_ISOLATION: { 
    label: "Silo Isolation", 
    desc: "Individual units are efficient but connective tissue is missing. Information is trapped within departments creating strategic blindness." 
  },
  STRATEGIC_DRIFT: { 
    label: "Strategic Drift", 
    desc: "Minor leaks in alignment are causing you to miss targets by degrees. Fixable via direct adjustment of leadership truth telling." 
  },
  CAFFEINE_CULTURE: { 
    label: "Caffeine Culture", 
    desc: "High burn masked by high activity. You are moving fast but much of that energy is spent overcoming internal friction rather than market challenges." 
  },
  RELATIONAL_FRICTION: { 
    label: "Relational Friction", 
    desc: "Personnel density is high and conflict is avoided. You are paying a heavy politeness tax that keeps the real issues off the agenda." 
  },
  TALENT_HEMORRHAGE: { 
    label: "Talent Hemorrhage", 
    desc: "Low meeting burn but high retention leak. Your culture is rejecting your best people because it cannot accommodate their excellence." 
  },
  BRILLIANT_SABOTAGE: { 
    label: "Brilliant Sabotage", 
    desc: "High performers are working against the collective. Individual brilliance is capping group ROI and creating a net negative impact on culture." 
  },
  STALLED_HEGEMONY: { 
    label: "Stalled Hegemony", 
    desc: "Historical drag and stalled projects are dictating future strategy. You are governed by projects that no one has the stomach to kill." 
  },
  EXECUTIVE_EMBARGO: { 
    label: "Executive Embargo", 
    desc: "Decision velocity is zero. The leadership team has become the primary bottleneck and holds the rest of the organization hostage to their indecision." 
  },
  INSTITUTIONAL_RIGIDITY: { 
    label: "Institutional Rigidity", 
    desc: "Maximum coordination tax. The system has become so complex and truth averse that it can no longer support its own weight or adapt to change." 
  },
  TOTAL_FRICTION_COLLAPSE: { 
    label: "Total Friction Collapse", 
    desc: "Burn exceeds 35 percent of payroll. The cost of remaining the same is now mathematically higher than the cost of a total institutional reset." 
  }
};

export const calculateRealitySummary = (data) => {
  const { 
    payroll, 
    industry = 'TECH', 
    revenueBest, 
    revenueWorst, 
    personnel = [], 
    stalledProjectCapital, 
    meetingHours = 5,
    isUnsurePayroll = false,
    isUnsureRevenue = false
  } = data;

  const sector = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.OTHER;

  // 🏛️ PERSONNEL COUNT & WEIGHTING
  const execCount = (personnel.find(p => p.id === 'EXECUTIVE')?.count || 0);
  const managerCount = (personnel.find(p => p.id === 'MANAGER')?.count || 0);
  const staffCount = (personnel.find(p => p.id === 'PROFESSIONAL')?.count || 0);
  const totalHeadcount = Math.max(1, execCount + managerCount + staffCount);
  
  const weightedHeadcount = (execCount * 1.5) + (managerCount * 1.2) + staffCount;

  // 🏛️ RECOVERING MISSING DATA (The "I Don't Know" Logic)
  const activePayroll = isUnsurePayroll 
    ? (totalHeadcount * sector.avgSalary) 
    : (Number(payroll) || (totalHeadcount * sector.avgSalary));

  const activeRevGap = isUnsureRevenue 
    ? (activePayroll * sector.volatility) 
    : Math.max(0, Number(revenueBest) - Number(revenueWorst));

  // 🏛️ CALCULATION LOGIC
  const cleanHeadcount = Math.max(1, totalHeadcount);
  const scalingFactor = cleanHeadcount > 500 ? 0.35 : 0.20; 
  const cTax = 1 + (Math.log10(cleanHeadcount) * scalingFactor);

  const hourlyRate = (activePayroll / 2080); 
  const monthlyMeetingBurn = (meetingHours * 4 * hourlyRate) * cTax * (weightedHeadcount / 10);
  
  // Stalled drag is either provided or defaults to 5 percent of payroll as a baseline for friction
  const activeStalledDrag = Number(stalledProjectCapital) || (activePayroll * 0.05);

  const monthlyLeak = monthlyMeetingBurn; 
  const historicalWaste = activeStalledDrag + activeRevGap;
  const totalImpact = (monthlyLeak * 12) + historicalWaste;

  // 🏛️ STATE LOGIC
  const monthlyPayroll = activePayroll / 12;
  const leakRatio = monthlyLeak / monthlyPayroll;
  
  let stateKey = "STRATEGIC_DRIFT";

  if (leakRatio < 0.10) {
    stateKey = cTax > 1.2 ? "PROCESS_PARALYSIS" : "STAGNANT_STABILITY";
    if (leakRatio < 0.05 && cTax < 1.1) stateKey = "SILO_ISOLATION";
  } else if (leakRatio >= 0.10 && leakRatio < 0.20) {
    stateKey = "CAFFEINE_CULTURE";
    if (execCount > 3) stateKey = "RELATIONAL_FRICTION";
  } else if (leakRatio >= 0.20) {
    if (cTax > 1.3) stateKey = "INSTITUTIONAL_RIGIDITY";
    else if (execCount > 5) stateKey = "EXECUTIVE_EMBARGO";
    else if (activeStalledDrag > (activePayroll * 0.1)) stateKey = "STALLED_HEGEMONY";
    else stateKey = "BRILLIANT_SABOTAGE";
  }

  if (leakRatio > 0.35) {
    stateKey = "TOTAL_FRICTION_COLLAPSE";
  }

  return {
    total: Math.round(totalImpact),
    monthlyBurn: Math.round(monthlyLeak),
    historicalWaste: Math.round(historicalWaste),
    executionGap: Math.round(activeRevGap),
    coordinationTax: cTax.toFixed(2),
    state: INSTITUTIONAL_STATES[stateKey],
    glossary: {
      silenceTax: "The cost of withheld truth. Avoided conflict leads to expensive repairs instead of cheap preventions.",
      frictionLatency: "The time cost between identifying a problem and acting on it. High latency equals a higher monthly burn."
    }
  };
};