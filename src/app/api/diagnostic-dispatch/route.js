/**
 * Principal Resolution // Diagnostic Dispatch API
 * Route: /api/diagnostic-dispatch
 * Purpose: Receives diagnostic results post-download,
 * forwards structured payload to Zapier webhook -> Dubsado.
 * Fires silently -- never interrupts the user experience.
 * v6.0: Full field alignment with v6.0 engine output and Dubsado custom fields.
 *       Forensic Layer (v4.5) fields retired.
 *       Decisions and Primary_Emotion added.
 *       All payload keys use PascalCase to match Dubsado field names.
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
      context             = {},
      email               = null,
      companyName         = '',
      prior_attempt       = '',
      personnel_risk      = '',
      resolution_blockage = '',
      decisions           = '',
      primary_emotion     = '',
      playbookId          = null,
      } = body;

    // Validate minimum required fields
    if (!verdict || !tier) {
      return NextResponse.json(
        { error: 'Missing required fields: verdict, tier' },
        { status: 400 }
      );
    }

    // Structure the Zapier payload.
    // All keys use PascalCase to match Dubsado custom field names.
    // Zapier maps these directly into the Create Project action.
    const zapierPayload = {
      // Verdict and tier
      Audit_Verdict:       verdict,
      Audit_Tier:          tier,
      Recommended:         tier,

      // Core financial
      Annual_Cost:         total,
      Monthly_Burn:        monthlyBurn,

      // Organizational context
      Industry:            context.industry           || 'Unknown',
      Org_Stage:           context.orgStage           || 'Unknown',
      Leadership_Tenure:   context.leadershipTenure   || 'Unknown',
      Friction:            context.frictionLocation   || 'Unknown',
      Avoidance:           context.avoidanceMechanism || 'Unknown',

      // Behavioral signals
      Prior_Attempt:       prior_attempt              || 'Unknown',
      Personnel_Risk:      personnel_risk             || 'Unknown',
      Resolution_Blockage: resolution_blockage        || 'Unknown',
      Decisions:           decisions                  || 'Unknown',
      Primary_Emotion:     primary_emotion            || 'Unknown',
      Playbook_ID:         playbookId                 || '',

      // Identity -- optional, provided only if prospect submitted email
      Client_Email:        email || 'diagnostic@principalresolution.com',

      // Metadata
      Timestamp:           new Date().toISOString(),
      Source:              'diagnostic-tool',

      // Dubsado project fields
      Project_Workflow:    'Diagnostic Follow-Up',
      Project_Title:       `Diagnostic Audit: ${verdict}`,
      Client_Company:      companyName || 'Unknown -- see RB2B',
    };

    // Forward to Zapier if webhook URL is configured
    if (ZAPIER_WEBHOOK_URL) {
      const zapierResponse = await fetch(ZAPIER_WEBHOOK_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(zapierPayload),
      });

      if (!zapierResponse.ok) {
        // Log server-side only -- never surface to client
        console.error(
          `[diagnostic-dispatch] Zapier webhook failed: ${zapierResponse.status} ${zapierResponse.statusText}`
        );
      }
    } else {
      // Dev environment -- log payload for field mapping verification
      console.log('[diagnostic-dispatch] Webhook URL not configured. Payload:', zapierPayload);
    }

    // Always return success to the client
    // The user experience must never depend on webhook success
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('[diagnostic-dispatch] Unhandled error:', error);
    // Still return 200 -- client must never see this failure
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
