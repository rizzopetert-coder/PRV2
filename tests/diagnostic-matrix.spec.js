/**
 * Principal Resolution // Diagnostic Matrix Spec v3.2
 * Suite: Institutional Logic Regression
 * Coverage: All 12 v6.0 states and engagement tiers
 * Strategy: Fresh browser context per profile. No shared state between tests.
 *
 * v3.1 fixes:
 * - All label maps sourced directly from diagnostic-logic.js
 * - ORG_STAGES: EARLY/GROWTH/ESTABLISHED/LEGACY with full label strings
 * - TENURE: UNDER_ONE/ONE_3YR/FOUR_6YR/SEVEN_PLUS with correct labels
 * - FRICTION: CROSS_FUNCTIONAL = 'Between Departments/Silos'
 * - AVOIDANCE: 4 valid keys (NO_FORUM/PREDETERMINED/COST_TOO_HIGH/NOT_AN_ISSUE)
 * - PRIOR_ATTEMPT: NONE/CONVERSATION/STRUCTURAL/EXTERNAL with correct labels
 * - PERSONNEL_RISK: NONE/YES/LOST with correct labels
 * - RESOLUTION_BLOCKAGE: NONE/KNOWN/SUSPECTED/ATTEMPTED with correct labels
 * - DURATION: exact capitalisation ('Under 6 Months', '6–12 Months', etc.)
 * - DOWNSTREAM: INDIVIDUAL/LARGE/FULL_ORG only
 * - INDUSTRY: TECH='Technology', NONPROFIT='Nonprofit & Social Enterprise'
 * - Tier strings: 'The Executive Counsel', 'The Intervention', 'The Roadmap'
 * - CustomSelect: scoped to div[class*="absolute"] after trigger click
 */

const { test, expect } = require('@playwright/test');
const profiles = require('./data/matrix-profiles.json');

// ─── LABEL MAPS ──────────────────────────────────────────────────────────────
// Source of truth: src/lib/diagnostic-logic.js
// Keys = enum values used in matrix-profiles.json inputs
// Values = exact visible text rendered in AuditSystem.jsx

const INDUSTRY_LABELS = {
  TECH:         'Technology',
  FINANCE:      'Finance & Insurance',
  CONSULTING:   'Consulting & Professional Services',
  HEALTH:       'Healthcare & Life Sciences',
  GOV:          'Government & Public Sector',
  NONPROFIT:    'Nonprofit & Social Enterprise',
  MEDIA:        'Media & Communications',
  MANUFACTURING:'Manufacturing & Industrial',
  RETAIL:       'Retail & Consumer Goods',
  ENERGY:       'Energy & Utilities',
  CONSTRUCTION: 'Construction & Real Estate',
  LOGISTICS:    'Logistics & Supply Chain',
  OTHER:        'Other',
};

const ORG_STAGE_LABELS = {
  EARLY:       'Early Stage — under 3 years or pre-revenue',
  GROWTH:      'Growth Stage — scaling, headcount increasing',
  ESTABLISHED: 'Established — stable, defined structure',
  LEGACY:      'Legacy — long-tenured, entrenched patterns',
};

const TENURE_LABELS = {
  UNDER_ONE:  'Under 1 year',
  ONE_3YR:    '1 to 3 years',
  FOUR_6YR:   '4 to 6 years',
  SEVEN_PLUS: '7 years or more',
};

const FRICTION_LABELS = {
  WITHIN_LEADERSHIP: 'Within the Leadership Team',
  CROSS_FUNCTIONAL:  'Between Departments/Silos',
  TEAM:              'Within a Specific Team',
  UNKNOWN:           'I cannot pinpoint the source',
};

const AVOIDANCE_LABELS = {
  NO_FORUM:      'No forum for the conversation',
  PREDETERMINED: 'Decisions are made before meetings',
  COST_TOO_HIGH: 'The social cost of speaking up is too high',
  NOT_AN_ISSUE:  'Leadership denies the problem exists',
};

const PRIOR_ATTEMPT_LABELS = {
  NONE:         'No formal attempt made',
  CONVERSATION: 'Internal conversations only',
  STRUCTURAL:   'Structural/Reporting changes',
  EXTERNAL:     'Brought in outside help before',
};

const PERSONNEL_RISK_LABELS = {
  NONE: 'No immediate risk',
  YES:  'Key people are disengaged/looking',
  LOST: 'We have already lost critical talent',
};

const RESOLUTION_BLOCKAGE_LABELS = {
  NONE:      'Clear path to resolution',
  KNOWN:     'Known individual/group is blocking',
  SUSPECTED: 'Suspect a blockage but unconfirmed',
  ATTEMPTED: 'We tried to resolve it and failed',
};

const DURATION_LABELS = {
  UNDER_6MO: 'Under 6 Months',
  SIX_12MO:  '6–12 Months',
  ONE_2YR:   '1–2 Years',
  OVER_2YR:  'Over 2 Years',
};

const DOWNSTREAM_LABELS = {
  INDIVIDUAL: 'Individual/Small Team',
  LARGE:      'Large Department',
  FULL_ORG:   'The Entire Organization',
};

const DECISIONS_LABELS = {
  FAST:    'Decisions get made and stay made',
  SLOW:    'Decisions require multiple rounds before they land',
  STALLED: 'Decisions get deferred or reopened constantly',
};

const EMOTION_LABELS = {
  EXHAUSTION:  'Tired',
  FRUSTRATION: 'Frustrated',
  FEAR:        'Uncertain',
  APATHY:      'Distant',
};

// ─── PAGE OBJECT ─────────────────────────────────────────────────────────────

class AuditPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/#audit');
    await this.page.waitForSelector('#audit', { state: 'visible' });
    await this.suppressAdvisorPanel();
  }

  async clickIntro() {
    await this.page.getByRole('button', { name: /Show Me What This Is Costing/i }).click();
  }

  async fillEmotion(emotionKey) {
    const label = EMOTION_LABELS[emotionKey];
    await this.page.getByRole('button', { name: new RegExp(label, 'i') }).first().click();
    await this.page.getByRole('button', { name: /Continue/i }).click();
  }

  async fillContext(inputs) {
    // CustomSelect: click trigger to open dropdown, then click option inside the dropdown div
    const industryLabel = INDUSTRY_LABELS[inputs.industry];
    await this.page.locator('button').filter({ hasText: /Select your sector/i }).click();
    await this.page.locator('div[class*="absolute"]')
      .getByRole('button', { name: industryLabel })
      .click();

    await this.page.getByRole('button', { name: ORG_STAGE_LABELS[inputs.orgStage] }).click();
    await this.page.getByRole('button', { name: TENURE_LABELS[inputs.leadershipTenure] }).click();
    await this.page.getByRole('button', { name: /Map the Room/i }).click();
  }

  async fillPersonnel(inputs) {
    await this.page.locator('input[placeholder="Estimated total headcount"]').fill(
      String(inputs.headcount)
    );

    const steppers = this.page.locator('input[inputmode="numeric"]');
    const counts = inputs.personnel.map(p => p.count);
    for (let i = 0; i < counts.length; i++) {
      if (counts[i] > 0) {
        await steppers.nth(i).fill(String(counts[i]));
        await steppers.nth(i).dispatchEvent('input');
        await steppers.nth(i).dispatchEvent('change');
      }
    }

    if (inputs.execCount !== undefined) {
      await this.page.evaluate((val) => {
        const input = document.getElementById('execCount-override');
        if (!input) return;
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value'
        ).set;
        setter.call(input, val);
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }, inputs.execCount);
    }

    await this.page.getByRole('button', { name: /Locate the Friction/i }).click();
  }

  // The FloatingAdvisor uses key={insightKey} — Framer Motion unmounts and
  // remounts a fresh DOM node after every selection. Post-hoc CSS on the old
  // node has no effect on the replacement. Instead, inject a persistent
  // <style> rule into the document head before any React rendering happens.
  // This survives remounts because it targets the className, not the element.
  async suppressAdvisorPanel() {
    await this.page.addStyleTag({
      content: '.pointer-events-auto.fixed { pointer-events: none !important; display: none !important; }'
    });
  }

  async fillBehavior(inputs) {
    await this.page.getByRole('button', { name: FRICTION_LABELS[inputs.frictionLocation] }).click();
    await this.page.getByRole('button', { name: AVOIDANCE_LABELS[inputs.avoidanceMechanism] }).click();
    await this.page.getByRole('button', { name: PRIOR_ATTEMPT_LABELS[inputs.priorAttempt] }).click();
    await this.page.getByRole('button', { name: PERSONNEL_RISK_LABELS[inputs.personnelRisk] }).click();
    await this.page.getByRole('button', { name: RESOLUTION_BLOCKAGE_LABELS[inputs.resolutionBlockage] }).click();
    await this.page.getByRole('button', { name: DURATION_LABELS[inputs.frictionDuration] }).click();
    await this.page.getByRole('button', { name: DOWNSTREAM_LABELS[inputs.downstreamPopulation] }).click();
    await this.page.getByRole('button', { name: DECISIONS_LABELS[inputs.decisions] }).click();
    await this.page.getByRole('button', { name: /Count the Cost/i }).click();
  }

  async fillFinancial(inputs) {
    if (inputs.payroll && !inputs.isUnsurePayroll) {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0,
      }).format(Number(inputs.payroll));
      const payrollInput = this.page.locator('input[placeholder="Estimate is sufficient"]');
      await payrollInput.fill(formatted);
      await payrollInput.blur();
    }

    if (inputs.stalledProjectCapital && Number(inputs.stalledProjectCapital) > 0) {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0,
      }).format(Number(inputs.stalledProjectCapital));
      const capitalInput = this.page.locator('input[placeholder="Optional"]').first();
      await capitalInput.fill(formatted);
      await capitalInput.blur();
    }

    if (inputs.meetingHours !== undefined) {
      await this.page.locator('input[type="range"]').evaluate((el, val) => {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value'
        ).set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input',  { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, inputs.meetingHours);
    }

    await this.page.getByRole('button', { name: /Generate Institutional Record/i }).click();
  }

  async downloadPDF() {
  await this.page.getByRole('button', { name: /Download the Record/i }).click();
}

  async runAudit(inputs) {
    await this.clickIntro();
    await this.fillEmotion(inputs.primaryEmotion);
    await this.fillContext(inputs);
    await this.fillPersonnel(inputs);
    await this.fillBehavior(inputs);
    await this.fillFinancial(inputs);
  }
}

// ─── TEST SUITE ───────────────────────────────────────────────────────────────

for (const profile of profiles) {
  test(`${profile.id}: ${profile.label}`, async ({ page }) => {
    const audit = new AuditPage(page);

    // Register dispatch interceptor before navigation so it is in place
    // when downloadPDF() fires the fetch to /api/diagnostic-dispatch.
    let capturedDispatch = null;
    await page.route('**/api/diagnostic-dispatch', async route => {
      try {
        capturedDispatch = JSON.parse(route.request().postData() || '{}');
      } catch (_) {
        capturedDispatch = {};
      }
      await route.continue();
    });

    await audit.goto();
    await audit.runAudit(profile.inputs);

    // ── UI assertions ──────────────────────────────────────────────────────
    await expect(page.locator('[data-report-container]')).toBeVisible({ timeout: 15000 });

    await expect(
      page.locator('[data-report-container] h2', { hasText: profile.expected.verdict })
    ).toBeVisible({ timeout: 5000 });

    await expect(
      page.locator('[data-report-container] h3', { hasText: profile.expected.tier })
    ).toBeVisible({ timeout: 5000 });

    // ── Dispatch assertion ─────────────────────────────────────────────────
    // Click download to trigger the primary dispatch path.
    // page.route() is already registered above — it will capture the POST body.
    await audit.downloadPDF();

    await expect
      .poll(() => capturedDispatch?.playbookId, {
        timeout: 10000,
        message: `[${profile.id}] Expected dispatch playbookId to be ${profile.expected.playbookId}`,
      })
      .toBe(profile.expected.playbookId);
  });
}
