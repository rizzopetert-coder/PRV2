/**
 * Principal Resolution // Report Engine v2.6
 * Purpose: Converting complex inputs into a definitive reality ledger.
 * Tenet: Absolute Candor.
 * Constraints: No em dashes. No semicolons. No technical jargon.
 */

export const INDUSTRY_VOLATILITY = {
  TECH: { label: "Technology / SaaS", multiplier: 2.2, targetROI: 4.0 },
  FINANCE: { label: "Finance / Banking", multiplier: 1.8, targetROI: 3.5 },
  CONSULTING: { label: "Consulting / Agency", multiplier: 1.6, targetROI: 3.0 },
  HEALTH: { label: "Healthcare / Pharma", multiplier: 1.8, targetROI: 2.5 },
  MANUFACTURING: { label: "Manufacturing / Industrial", multiplier: 1.2, targetROI: 2.2 },
  OTHER: { label: "Other", multiplier: 1.0, targetROI: 3.0 }
};

/**
 * DIRECT CALCULATION
 * Incorporating Aggressive Scaling and Seniority Impact.
 */
export const calculateRealityReport = (data) => {
  const { 
    payroll = 0, 
    industry = 'TECH', 
    friction = 20, 
    months = 12, 
    totalCompanyHeadcount = 0, 
    seniority = { exec: 0, manager: 0, staff: 0 }
  } = data;

  const sector = INDUSTRY_VOLATILITY[industry] || INDUSTRY_VOLATILITY.OTHER;

  // 1. LEADERSHIP IMPACT (Cost Weighting)
  const totalAuditHeadcount = (seniority.exec + seniority.manager + seniority.staff) || 1;
  const weightedLeads = (seniority.exec * 3.0) + (seniority.manager * 1.5) + (seniority.staff * 1.0);
  const leadershipImpact = weightedLeads / totalAuditHeadcount;

  // 2. COORDINATION TAX (Log Scaling)
  const scalingFactor = totalCompanyHeadcount > 500 ? 0.35 : 0.20;
  const coordinationTax = totalCompanyHeadcount > 0 
    ? 1 + (Math.log10(totalCompanyHeadcount) * scalingFactor) 
    : 1;

  // 3. CORE FINANCIAL LEAK
  const monthlyPayroll = payroll / 12;
  const baseMonthlyLeak = monthlyPayroll * (friction / 100);
  const weightedMonthlyLeak = baseMonthlyLeak * leadershipImpact * coordinationTax;
  
  // Refactored from Hiring Risk to Institutional Drag
  const institutionalDrag = (payroll * sector.multiplier);
  const totalWastedCapital = weightedMonthlyLeak * months;
  const totalCostOfFriction = institutionalDrag + totalWastedCapital;

  // 4. THE SILENCE TAX (Percentage Representation)
  const silenceTaxPercentage = Math.round((totalWastedCapital / (payroll || 1)) * 100);

  return {
    total: Math.round(totalCostOfFriction),
    monthlyLeak: Math.round(weightedMonthlyLeak),
    institutionalDrag: Math.round(institutionalDrag),
    silenceTax: `${silenceTaxPercentage}%`,
    coordinationTax: coordinationTax.toFixed(2),
    status: silenceTaxPercentage > 30 ? "CRITICAL" : "ELEVATED"
  };
};