/**
 * Principal Resolution // Report Engine v3.1
 * Purpose: Data preparation layer for PDF, webhook, and social card outputs.
 * Takes calculateRealitySummary output directly — no legacy input structure.
 * Tenet: Results (Effectiveness).
 */

import { INDUSTRY_BENCHMARKS, ORG_STAGES, LEADERSHIP_TENURES } from './diagnostic-logic';

/**
 * Prepares a structured report payload from the diagnostic summary.
 * Used by PDF generation, Dubsado webhook, and social card export.
 */
export const prepareReportPayload = (summary, inputData) => {
  const {
    total, monthlyBurn, historicalWaste, executionGap,
    coordinationTax, state, recommendation, resolvedTier, context,
  } = summary;

  const industry = INDUSTRY_BENCHMARKS[inputData.industry]?.label || inputData.industry;
  const stage    = ORG_STAGES[context.orgStage]?.label            || context.orgStage;
  const tenure   = LEADERSHIP_TENURES[context.leadershipTenure]?.label || context.leadershipTenure;

  const monthlyRecovery = Math.round(monthlyBurn * 0.10);
  const annualRecovery  = monthlyRecovery * 12;
  const returnMultiple  = recommendation.fee
    ? (annualRecovery / recommendation.fee).toFixed(1)
    : null;

  return {
    // Identity
    generatedAt:  new Date().toISOString(),
    version:      '3.1',

    // Diagnosis
    institutionalState: state.label,
    stateDescription:   state.desc,
    resolvedTier,

    // Financial
    annualCost:      total,
    monthlyBurn,
    historicalWaste,
    executionGap,
    coordinationTax: parseFloat(coordinationTax),
    annualRecovery,
    returnMultiple,

    // Recommendation
    recommendedEngagement: recommendation.name,
    engagementFee:         recommendation.feeLabel,
    engagementOutcome:     recommendation.outcome,
    engagementCta:         recommendation.cta,

    // Context
    industry,
    orgStage:         stage,
    leadershipTenure: tenure,
    frictionLocation: context.frictionLocation,
    avoidanceMechanism: context.avoidanceMechanism,
    urgency:          context.urgency,
    execCount:        context.execCount,
    leakRatio:        context.leakRatio,

    // Dubsado webhook fields
    dubsado: {
      Audit_Verdict:  state.label,
      Industry:       industry,
      Recommended:    recommendation.name,
      Urgency:        context.urgency,
      Org_Stage:      stage,
      Friction:       context.frictionLocation,
      Annual_Cost:    total,
      Monthly_Burn:   monthlyBurn,
      Tier:           resolvedTier,
    },
  };
};

/**
 * Formats a report payload for social card export.
 * 1200x630 canvas — cost figure, state label, PR wordmark.
 */
export const prepareSocialCardData = (summary) => ({
  headline:    summary.state.label,
  costFigure:  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(summary.total),
  subline:     `${summary.recommendation.name} recommended`,
  watermark:   'Principal Resolution // principalresolution.com',
});