/**
 * Principal Resolution // Diagnostic Dispatch API
 * Route: /api/diagnostic-dispatch
 * Purpose: Receives diagnostic results post-download,
 * forwards structured payload to Zapier webhook → Dubsado.
 * Fires silently — never interrupts the user experience.
 */

import { NextResponse } from 'next/server';

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_DIAGNOSTIC_WEBHOOK;

export async function POST(request) {
  try {
    const body = await request.json();

    const {
  verdict,
  tier,
  monthlyBurn,
  total,
  context = {},
  email = null,
  optSendRecord = false,
  optIntelligence = false,
  prior_attempt = '',
  personnel_risk = '',
  resolution_blockage = '',
  resolution_vision = '',
} = body;

    // Validate minimum required fields
    if (!verdict || !tier) {
      return NextResponse.json(
        { error: 'Missing required fields: verdict, tier' },
        { status: 400 }
      );
    }

    // Structure the Zapier payload
    // Field names match what Zapier expects to forward to Dubsado
    const zapierPayload = {
      // Core diagnostic
      Audit_Verdict:       verdict,
      Recommended:         tier,
      Annual_Cost:         total,
      Monthly_Burn:        monthlyBurn,

      // Organizational context
      Industry:            context.industry            || 'Unknown',
      Org_Stage:           context.orgStage            || 'Unknown',
      Leadership_Tenure:   context.leadershipTenure    || 'Unknown',
      Friction:            context.frictionLocation    || 'Unknown',
      Avoidance:           context.avoidanceMechanism  || 'Unknown',
Prior_Attempt:       prior_attempt               || 'Unknown',
Personnel_Risk:      personnel_risk              || 'Unknown',
Resolution_Blockage: resolution_blockage         || 'Unknown',
Resolution_Vision:   resolution_vision           || '',
Exec_Count:          context.execCount           || 0,
      Leak_Ratio:          context.leakRatio           || '0.000',

      // Identity — optional, provided only if prospect submitted email
      Client_Email:        email || 'diagnostic@principalresolution.com',
Opt_Send_Record:     optSendRecord,
Opt_In_Memos:        optIntelligence,
      // Metadata
      Timestamp:           new Date().toISOString(),
      Source:              'diagnostic-tool',

      // Dubsado project fields
      // These map directly to the Create Project action in Zapier
      Project_Workflow:    'Diagnostic Follow-Up',
      Project_Title:       `Diagnostic Audit: ${verdict}`,
      Client_Company:      context.companyName || 'Unknown — see RB2B',
    };

    // Forward to Zapier if webhook URL is configured
    if (ZAPIER_WEBHOOK_URL) {
      const zapierResponse = await fetch(ZAPIER_WEBHOOK_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(zapierPayload),
      });

      if (!zapierResponse.ok) {
        // Log server-side only — never surface to client
        console.error(
          `[diagnostic-dispatch] Zapier webhook failed: ${zapierResponse.status} ${zapierResponse.statusText}`
        );
      }
    } else {
      // Dev environment — log payload for field mapping verification
      console.log('[diagnostic-dispatch] Webhook URL not configured. Payload:', zapierPayload);
    }

    // Always return success to the client
    // The user experience must never depend on webhook success
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('[diagnostic-dispatch] Unhandled error:', error);
    // Still return 200 — client must never see this failure
    return NextResponse.json({ received: true }, { status: 200 });
  }
}